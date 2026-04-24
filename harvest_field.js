/**
 * Harvest Field v6.0 - High Fidelity 3D Space Gallery
 * Implements Z-axis scrolling, CanvasTextures for card details, and stable loading.
 */

let db, scene, camera, renderer, raycaster, mouse;
let starMesh, gridHelper, cardsGroup;
let cards = [];
let allSingers = [];
let hoverIdx = -1;
let targetCamZ = 500;
let textureLoader;
let initiated = false;

const CFG = {
  Z_GAP: 950,
  W: 240,
  H: 360,
  GOLD_HEX: 0xc9933b,
  BG: 0x050508
};

function waitAndInit() {
  if (typeof THREE === 'undefined' || typeof window.supabase === 'undefined') {
    setTimeout(waitAndInit, 200);
    return;
  }
  if (!initiated) {
    initiated = true;
    init();
  }
}

document.addEventListener('DOMContentLoaded', waitAndInit);

async function init() {
  db = window.supabase;
  scene = new THREE.Scene();
  scene.background = new THREE.Color(CFG.BG);
  scene.fog = new THREE.FogExp2(CFG.BG, 0.0004);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 20000);
  camera.position.set(0, 0, targetCamZ);

  const canvas = document.getElementById('harvest-canvas');
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2(-9999, -9999);
  textureLoader = new THREE.TextureLoader();

  cardsGroup = new THREE.Group();
  scene.add(cardsGroup);

  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const spot = new THREE.SpotLight(0xffffff, 1.2);
  spot.position.set(0, 800, 800);
  scene.add(spot);

  buildEnvironment();

  window.addEventListener('resize', onResize);
  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('mousemove', onMouseMove);
  const closeBtn = document.querySelector('.close-card');
  if (closeBtn) closeBtn.onclick = hideOverlay;

  renderLoop();
  await loadData();
}

function buildEnvironment() {
  gridHelper = new THREE.GridHelper(30000, 200, CFG.GOLD_HEX, 0x111111);
  gridHelper.position.y = -CFG.H * 0.7;
  scene.add(gridHelper);

  const geo = new THREE.BufferGeometry();
  const pos = [];
  for (let i = 0; i < 5000; i++) {
    pos.push((Math.random() - 0.5) * 8000, (Math.random() - 0.5) * 4000, (Math.random() - 0.5) * 20000);
  }
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  starMesh = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: 2, transparent: true, opacity: 0.4 }));
  scene.add(starMesh);
}

async function loadData() {
  try {
    const { data, error } = await db.from('singers').select('*').order('display_order', { ascending: true });
    if (error) throw error;
    allSingers = data || [];
    
    const tab = new URLSearchParams(window.location.search).get('tab');
    if (tab === 'gospel') window.switchCategory('福音');
    else if (tab === 'worship') window.switchCategory('敬拜');
    else buildCards(allSingers);

  } catch (err) {
    console.error('Data error:', err);
  } finally {
    const loader = document.getElementById('scene-loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 1000);
    }
  }
}

// Draw content onto a 2D canvas then use as 3D texture
function createCardTexture(singer, photo) {
  const w = 512, h = 768;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');

  // Background
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#151525');
  grad.addColorStop(1, '#050510');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Borders
  ctx.strokeStyle = '#c9933b';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, w - 10, h - 10);

  // Photo
  const imgH = h * 0.65;
  if (photo) {
    const ratio = photo.width / photo.height;
    const targetRatio = w / imgH;
    let sw = photo.width, sh = photo.height, sx = 0, sy = 0;
    if (ratio > targetRatio) { sw = sh * targetRatio; sx = (photo.width - sw) / 2; }
    else { sh = sw / targetRatio; sy = (photo.height - sh) / 2; }
    ctx.drawImage(photo, sx, sy, sw, sh, 10, 10, w - 20, imgH - 10);
  } else {
    ctx.fillStyle = '#222';
    ctx.fillRect(10, 10, w - 20, imgH - 10);
    ctx.fillStyle = '#c9933b';
    ctx.font = '80px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('HM', w / 2, imgH / 2 + 30);
  }

  // Name
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 50px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(singer.name || 'Unknown', w / 2, imgH + 80);

  // Role snippet
  ctx.fillStyle = '#c9933b';
  ctx.font = '24px Arial';
  const roleStr = singer.category === 'worship' ? '敬拜歌手 Worship' : '福音歌手 Gospel';
  ctx.fillText(roleStr, w / 2, imgH + 130);

  return new THREE.CanvasTexture(canvas);
}

function buildCards(dataArray) {
  cards.forEach(c => {
    if (c.material.map) c.material.map.dispose();
    c.material.dispose();
    cardsGroup.remove(c);
  });
  cards = [];
  hoverIdx = -1;

  if (!dataArray || dataArray.length === 0) {
    dataArray = [{ name: '暂无歌手', category: 'all' }];
  }

  targetCamZ = 500;
  camera.position.z = targetCamZ;

  const geo = new THREE.PlaneGeometry(CFG.W, CFG.H);

  dataArray.forEach((singer, i) => {
    const mat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const mesh = new THREE.Mesh(geo, mat);
    const xOff = i === 0 ? 0 : (i % 2 === 0 ? 220 : -220);
    mesh.position.set(xOff, 0, -(i * CFG.Z_GAP));
    mesh.rotation.y = xOff > 0 ? -0.15 : (xOff < 0 ? 0.15 : 0);
    mesh.userData = { singer, index: i, baseRotY: mesh.rotation.y };

    cardsGroup.add(mesh);
    cards.push(mesh);

    // Dynamic texture
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      mesh.material.map = createCardTexture(singer, img);
      mesh.material.color.setHex(0xffffff);
      mesh.material.needsUpdate = true;
    };
    img.onerror = () => {
      mesh.material.map = createCardTexture(singer, null);
      mesh.material.color.setHex(0xffffff);
      mesh.material.needsUpdate = true;
    };
    img.src = singer.image_url || '';
    if (!singer.image_url) img.onerror();
  });

  cardsGroup.userData.minZ = -(dataArray.length - 1) * CFG.Z_GAP - 1000;
}

window.switchCategory = function (cat) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  let key = 'all';
  if (cat === '福音') { document.getElementById('tab-gospel')?.classList.add('active'); key = 'gospel'; }
  else if (cat === '敬拜') { document.getElementById('tab-worship')?.classList.add('active'); key = 'worship'; }
  else document.getElementById('tab-all')?.classList.add('active');

  const filtered = key === 'all' ? allSingers : allSingers.filter(s => s.category === key);
  buildCards(filtered);
};

function onWheel(e) {
  e.preventDefault();
  targetCamZ -= e.deltaY * 1.5;
  const minZ = cardsGroup.userData.minZ || -2000;
  if (targetCamZ > 600) targetCamZ = 600;
  if (targetCamZ < minZ) targetCamZ = minZ;
  gsap.to(camera.position, { z: targetCamZ, duration: 1.2, ease: 'power3.out' });
}

function onMouseMove(e) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(cards);

  if (hits.length > 0) {
    const mesh = hits[0].object;
    if (hoverIdx !== mesh.userData.index) {
      if (hoverIdx !== -1 && cards[hoverIdx]) revertCard(cards[hoverIdx]);
      hoverIdx = mesh.userData.index;
      focusCard(mesh);
      showOverlay(mesh.userData.singer);
      document.body.style.cursor = 'pointer';
    }
    if (hits[0].uv) {
      gsap.to(mesh.rotation, { 
        x: (hits[0].uv.y - 0.5) * -0.4, 
        y: mesh.userData.baseRotY + (hits[0].uv.x - 0.5) * 0.4, 
        duration: 0.3 
      });
    }
  } else if (hoverIdx !== -1) {
    revertCard(cards[hoverIdx]);
    hoverIdx = -1;
    document.body.style.cursor = 'default';
    hideOverlay();
  }
}

function focusCard(m) {
  gsap.to(m.scale, { x: 1.15, y: 1.15, z: 1.15, duration: 0.4, ease: 'back.out' });
  m.material.emissive = new THREE.Color(CFG.GOLD_HEX);
  m.material.emissiveIntensity = 0.4;
}

function revertCard(m) {
  gsap.to(m.scale, { x: 1, y: 1, z: 1, duration: 0.4 });
  gsap.to(m.rotation, { x: 0, y: m.userData.baseRotY, duration: 0.4 });
  m.material.emissiveIntensity = 0;
}

function showOverlay(s) {
  const o = document.getElementById('singer-card-overlay');
  if (!o) return;
  o.classList.remove('hidden');
  document.getElementById('card-name').innerText = s.name || '';
  document.getElementById('card-role').innerText = s.role || '';
  document.getElementById('card-bio').innerText = s.bio || '';
  gsap.fromTo(o, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.4 });
}

function hideOverlay() {
  const o = document.getElementById('singer-card-overlay');
  if (o) gsap.to(o, { opacity: 0, x: 30, duration: 0.3, onComplete: () => o.classList.add('hidden') });
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function renderLoop() {
  requestAnimationFrame(renderLoop);
  if (starMesh) starMesh.rotation.y += 0.0002;
  renderer.render(scene, camera);
}
