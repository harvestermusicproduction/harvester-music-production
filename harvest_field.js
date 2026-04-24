/**
 * Harvest Field v7.0 - Professional 3D Space Gallery
 * Layered Mesh Architecture: Separation of UI (Canvas) and Photo (Texture)
 * Fixed Photo Loading & Display Issues
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
  Z_GAP: 1000,
  W: 240,
  H: 360,
  GOLD_HEX: 0xc9933b,
  BG_HEX: 0x07070a,
  PHOTO_H_RATIO: 0.68
};

function waitAndInit() {
  if (typeof THREE === 'undefined' || typeof window.supabase === 'undefined') {
    setTimeout(waitAndInit, 100);
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
  scene.background = new THREE.Color(CFG.BG_HEX);
  scene.fog = new THREE.FogExp2(CFG.BG_HEX, 0.0004);

  camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000);
  camera.position.set(0, 0, targetCamZ);

  const canvas = document.getElementById('harvest-canvas');
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2(-9999, -9999);
  textureLoader = new THREE.TextureLoader();
  textureLoader.setCrossOrigin('anonymous');

  cardsGroup = new THREE.Group();
  scene.add(cardsGroup);

  // High quality lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
  dirLight.position.set(1, 2, 1);
  scene.add(dirLight);

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
  // Far perspective grid
  gridHelper = new THREE.GridHelper(40000, 200, 0x222222, 0x111111);
  gridHelper.position.y = -CFG.H * 0.8;
  scene.add(gridHelper);

  // Subtle star field
  const geo = new THREE.BufferGeometry();
  const pos = [];
  for (let i = 0; i < 6000; i++) {
    pos.push((Math.random() - 0.5) * 10000, (Math.random() - 0.5) * 5000, (Math.random() - 0.5) * 20000);
  }
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  starMesh = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: 1.5, transparent: true, opacity: 0.3 }));
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
    console.error('[HF] Data Error:', err);
  } finally {
    const loader = document.getElementById('scene-loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 800);
    }
  }
}

/**
 * Creates the UI Texture for the card (Name, Bio, Borders)
 */
function createUITexture(singer) {
  const w = 512, h = 768;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');

  // Glass-like background
  ctx.fillStyle = '#0a0a0f';
  ctx.roundRect(0, 0, w, h, 24);
  ctx.fill();

  // Premium Gold Frame
  ctx.strokeStyle = '#c9933b';
  ctx.lineWidth = 4;
  ctx.roundRect(6, 6, w - 12, h - 12, 20);
  ctx.stroke();

  // Name Label
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 52px "PingFang SC", sans-serif';
  const nameY = h * CFG.PHOTO_H_RATIO + 80;
  ctx.fillText(singer.name || 'Harvester', w / 2, nameY);

  // Category Subtitle
  ctx.fillStyle = '#c9933b';
  ctx.font = '26px "PingFang SC", sans-serif';
  const catStr = singer.category === 'worship' ? '敬拜歌手 Worship' : '福音歌手 Gospel';
  ctx.fillText(catStr, w / 2, nameY + 45);

  // Small decoration line
  ctx.strokeStyle = 'rgba(201,147,59,0.3)';
  ctx.beginPath();
  ctx.moveTo(w * 0.3, h - 40);
  ctx.lineTo(w * 0.7, h - 40);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  return tex;
}

function buildCards(dataArray) {
  // Cleanup
  cards.forEach(c => {
    c.traverse(child => {
      if (child.material) {
        if (child.material.map) child.material.map.dispose();
        child.material.dispose();
      }
    });
    cardsGroup.remove(c);
  });
  cards = [];
  hoverIdx = -1;

  if (!dataArray || dataArray.length === 0) {
    dataArray = [{ name: '收割机音乐', category: 'gospel', bio: '欢迎来到收割机空间' }];
  }

  targetCamZ = 500;
  camera.position.z = targetCamZ;

  dataArray.forEach((singer, i) => {
    const cardBase = new THREE.Group();
    const xOff = i === 0 ? 0 : (i % 2 === 0 ? 240 : -240);
    const zPos = -(i * CFG.Z_GAP);
    cardBase.position.set(xOff, 0, zPos);
    cardBase.rotation.y = xOff > 0 ? -0.15 : (xOff < 0 ? 0.15 : 0);
    
    // 1. Backplane (UI)
    const uiGeo = new THREE.PlaneGeometry(CFG.W, CFG.H);
    const uiMat = new THREE.MeshStandardMaterial({ 
      map: createUITexture(singer),
      transparent: true,
      roughness: 0.3,
      metalness: 0.2
    });
    const uiMesh = new THREE.Mesh(uiGeo, uiMat);
    cardBase.add(uiMesh);

    // 2. Frontplane (Photo)
    const photoW = CFG.W - 24;
    const photoH = CFG.H * CFG.PHOTO_H_RATIO - 20;
    const photoGeo = new THREE.PlaneGeometry(photoW, photoH);
    const photoMat = new THREE.MeshStandardMaterial({ 
      color: 0x111111,
      roughness: 0.5
    });
    const photoMesh = new THREE.Mesh(photoGeo, photoMat);
    // Slightly in front and at the top
    photoMesh.position.set(0, (CFG.H / 2) - (photoH / 2) - 12, 0.5); 
    cardBase.add(photoMesh);

    // Load Image via TextureLoader (Handles CORS and timing better)
    if (singer.image_url) {
      textureLoader.load(singer.image_url, (tex) => {
        tex.anisotropy = 4;
        photoMat.map = tex;
        photoMat.color.setHex(0xffffff);
        photoMat.needsUpdate = true;
      });
    }

    cardBase.userData = { singer, index: i, baseRotY: cardBase.rotation.y };
    cardsGroup.add(cardBase);
    cards.push(cardBase);

    // GSAP Entry
    gsap.from(cardBase.position, { y: -500, duration: 1.5, delay: i * 0.1, ease: 'power4.out' });
  });

  cardsGroup.userData.minZ = -(dataArray.length - 1) * CFG.Z_GAP - 1200;
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
  const hits = raycaster.intersectObjects(cards, true); // Search recursively into children

  if (hits.length > 0) {
    // Find the parent card base
    let obj = hits[0].object;
    while(obj.parent && !obj.userData.singer) obj = obj.parent;
    
    if (obj.userData.singer && hoverIdx !== obj.userData.index) {
      if (hoverIdx !== -1 && cards[hoverIdx]) revertCard(cards[hoverIdx]);
      hoverIdx = obj.userData.index;
      focusCard(obj);
      showOverlay(obj.userData.singer);
      document.body.style.cursor = 'pointer';
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
  m.traverse(child => {
    if (child.material) {
      child.material.emissive = new THREE.Color(CFG.GOLD_HEX);
      child.material.emissiveIntensity = 0.3;
    }
  });
}

function revertCard(m) {
  gsap.to(m.scale, { x: 1, y: 1, z: 1, duration: 0.4 });
  m.traverse(child => {
    if (child.material) child.material.emissiveIntensity = 0;
  });
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
  if (starMesh) starMesh.rotation.y += 0.0001;
  renderer.render(scene, camera);
}
