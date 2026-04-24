/**
 * Harvest Field v5.0 - Z-Axis Space Gallery (Rebuilt)
 * All globals initialized inside init() to prevent load-order crashes.
 */

// Declare references only — no THREE calls until init()
let db, scene, camera, renderer, raycaster, mouse;
let starMesh, gridHelper, cardsGroup;
let cards = [];
let allSingers = [];
let hoverIdx = -1;
let targetCamZ = 500;
let textureLoader;
let initiated = false;

const CFG = {
  Z_GAP: 900,
  W: 240,
  H: 360,
  GOLD_HEX: 0xc9933b,
  BG: 0x050508
};

// ─────────────────────────────────────────
// BOOT: wait for both Three.js AND Supabase
// ─────────────────────────────────────────
function waitAndInit() {
  if (typeof THREE === 'undefined' || typeof window.supabase === 'undefined') {
    console.log('[HF] Waiting for dependencies...');
    setTimeout(waitAndInit, 200);
    return;
  }
  if (!initiated) {
    initiated = true;
    init();
  }
}

document.addEventListener('DOMContentLoaded', waitAndInit);

// ─────────────────────────────────────────
// INIT
// ─────────────────────────────────────────
async function init() {
  console.log('[HF] init() started');
  db = window.supabase;

  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(CFG.BG);
  scene.fog = new THREE.FogExp2(CFG.BG, 0.0005);

  // Camera
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 20000);
  camera.position.set(0, 0, targetCamZ);

  // Renderer
  const canvas = document.getElementById('harvest-canvas');
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Raycaster + Mouse
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2(-9999, -9999); // off-screen default

  // TextureLoader
  textureLoader = new THREE.TextureLoader();

  // Cards group
  cardsGroup = new THREE.Group();
  scene.add(cardsGroup);

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const spot = new THREE.SpotLight(0xffffff, 1.5);
  spot.position.set(0, 600, 600);
  spot.angle = Math.PI / 4;
  spot.penumbra = 0.6;
  scene.add(spot);

  buildEnvironment();

  // Events
  window.addEventListener('resize', onResize);
  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('mousemove', onMouseMove);
  const closeBtn = document.querySelector('.close-card');
  if (closeBtn) closeBtn.onclick = hideOverlay;

  // Render loop — use native requestAnimationFrame
  renderLoop();

  // Load data
  await loadData();
}

// ─────────────────────────────────────────
// ENVIRONMENT
// ─────────────────────────────────────────
function buildEnvironment() {
  // Grid floor
  gridHelper = new THREE.GridHelper(30000, 300, CFG.GOLD_HEX, 0x111111);
  gridHelper.position.y = -CFG.H * 0.6;
  scene.add(gridHelper);

  // Stars
  const geo = new THREE.BufferGeometry();
  const pos = [];
  for (let i = 0; i < 4000; i++) {
    pos.push(
      (Math.random() - 0.5) * 6000,
      (Math.random() - 0.5) * 3000,
      (Math.random() - 0.5) * 15000
    );
  }
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  starMesh = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: 2, transparent: true, opacity: 0.35 }));
  scene.add(starMesh);
}

// ─────────────────────────────────────────
// DATA
// ─────────────────────────────────────────
async function loadData() {
  try {
    const { data, error } = await db.from('singers').select('*');
    if (error) throw error;
    allSingers = data || [];
    console.log('[HF] Singers loaded:', allSingers.length);

    // URL tab param
    const tab = new URLSearchParams(window.location.search).get('tab');
    if (tab === 'gospel') window.switchCategory('福音');
    else if (tab === 'worship') window.switchCategory('敬拜');
    else buildCards(allSingers);

  } catch (err) {
    console.error('[HF] loadData error:', err);
    alert('数据库错误: ' + err.message);
  } finally {
    // Always hide loader
    const loader = document.getElementById('scene-loader');
    if (loader) {
      loader.style.transition = 'opacity 0.8s';
      loader.style.opacity = '0';
      setTimeout(() => { if (loader.parentNode) loader.parentNode.removeChild(loader); }, 900);
    }
  }
}

// ─────────────────────────────────────────
// BUILD CARDS
// ─────────────────────────────────────────
function buildCards(dataArray) {
  // Clear previous
  while (cardsGroup.children.length) cardsGroup.remove(cardsGroup.children[0]);
  cards = [];
  hoverIdx = -1;
  hideOverlay();

  if (!dataArray || dataArray.length === 0) {
    dataArray = [{
      name: '暂无歌手 (No Singers)',
      role: '',
      bio: '管理员尚未添加此分类的歌手，请到后台管理面板添加！',
      image_url: '',
      category: 'gospel'
    }];
  }

  // Reset camera
  targetCamZ = 500;
  camera.position.z = targetCamZ;

  const planeGeo = new THREE.PlaneGeometry(CFG.W, CFG.H);

  dataArray.forEach((singer, i) => {
    const mat = new THREE.MeshStandardMaterial({
      color: 0x888888,
      roughness: 0.2,
      metalness: 0.1,
    });

    const mesh = new THREE.Mesh(planeGeo, mat);

    // Zigzag layout
    const xOffset = i === 0 ? 0 : (i % 2 === 0 ? 200 : -200);
    mesh.position.set(xOffset, 0, -(i * CFG.Z_GAP));
    mesh.rotation.z = (Math.random() - 0.5) * 0.06;
    mesh.rotation.y = xOffset > 0 ? -0.12 : (xOffset < 0 ? 0.12 : 0);

    mesh.userData = {
      singer,
      index: i,
      baseRotX: mesh.rotation.x,
      baseRotY: mesh.rotation.y,
      baseRotZ: mesh.rotation.z
    };

    // Load texture
    const imgUrl = singer.image_url && singer.image_url.startsWith('http')
      ? singer.image_url
      : null;

    if (imgUrl) {
      textureLoader.load(
        imgUrl,
        (tex) => {
          tex.minFilter = THREE.LinearFilter;
          mesh.material.map = tex;
          mesh.material.color.setHex(0xffffff);
          mesh.material.needsUpdate = true;
        },
        undefined,
        () => {
          // On error — show gold placeholder
          mesh.material.color.setHex(CFG.GOLD_HEX);
        }
      );
    } else {
      mesh.material.color.setHex(CFG.GOLD_HEX);
    }

    cardsGroup.add(mesh);
    cards.push(mesh);

    // Entrance animation via GSAP if available
    if (typeof gsap !== 'undefined') {
      const origY = mesh.position.y;
      mesh.position.y = origY - 400;
      gsap.to(mesh.position, { y: origY, duration: 1.2, delay: i * 0.08, ease: 'power3.out' });
    }
  });

  // Store scroll bounds
  cardsGroup.userData.minZ = -(dataArray.length - 1) * CFG.Z_GAP - 800;
  console.log('[HF] Built', cards.length, 'cards');
}

// ─────────────────────────────────────────
// CATEGORY SWITCH (global hook)
// ─────────────────────────────────────────
window.switchCategory = function (cat) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  let dbKey = 'all';
  if (cat === '福音') { document.getElementById('tab-gospel')?.classList.add('active'); dbKey = 'gospel'; }
  else if (cat === '敬拜') { document.getElementById('tab-worship')?.classList.add('active'); dbKey = 'worship'; }
  else document.getElementById('tab-all')?.classList.add('active');

  const filtered = dbKey === 'all' ? allSingers : allSingers.filter(s => s.category === dbKey);
  buildCards(filtered);
};

// ─────────────────────────────────────────
// SCROLL = Camera Drive
// ─────────────────────────────────────────
function onWheel(e) {
  e.preventDefault();
  targetCamZ -= e.deltaY * 1.5;

  const minZ = cardsGroup?.userData?.minZ || -2000;
  if (targetCamZ > 600) targetCamZ = 600;
  if (targetCamZ < minZ) targetCamZ = minZ;

  if (typeof gsap !== 'undefined') {
    gsap.to(camera.position, { z: targetCamZ, duration: 1.2, ease: 'power3.out', overwrite: true });
  } else {
    camera.position.z = targetCamZ;
  }
}

// ─────────────────────────────────────────
// MOUSE
// ─────────────────────────────────────────
function onMouseMove(e) {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(cards);

  if (hits.length > 0) {
    const hit = hits[0];
    const mesh = hit.object;
    const idx = mesh.userData.index;

    if (hoverIdx !== idx) {
      if (hoverIdx !== -1 && cards[hoverIdx]) revertCard(cards[hoverIdx]);
      hoverIdx = idx;
      focusCard(mesh);
      showOverlay(mesh.userData.singer);
      document.body.style.cursor = 'pointer';
    }

    // 3D tilt via UV
    if (hit.uv && typeof gsap !== 'undefined') {
      gsap.to(mesh.rotation, {
        x: mesh.userData.baseRotX + (hit.uv.y - 0.5) * -0.4,
        y: mesh.userData.baseRotY + (hit.uv.x - 0.5) * 0.4,
        duration: 0.25, ease: 'power2.out'
      });
    }
  } else {
    if (hoverIdx !== -1) {
      revertCard(cards[hoverIdx]);
      hoverIdx = -1;
      document.body.style.cursor = 'default';
      hideOverlay();
    }
  }
}

function focusCard(mesh) {
  if (typeof gsap !== 'undefined') {
    gsap.to(mesh.scale, { x: 1.12, y: 1.12, z: 1.12, duration: 0.4, ease: 'back.out(2)' });
  }
  mesh.material.emissive = new THREE.Color(CFG.GOLD_HEX);
  mesh.material.emissiveIntensity = 0.35;
  cards.forEach(c => {
    if (c !== mesh && typeof gsap !== 'undefined') {
      gsap.to(c.material.color, { r: 0.25, g: 0.25, b: 0.25, duration: 0.3 });
    }
  });
}

function revertCard(mesh) {
  if (typeof gsap !== 'undefined') {
    gsap.to(mesh.scale, { x: 1, y: 1, z: 1, duration: 0.4 });
    gsap.to(mesh.rotation, {
      x: mesh.userData.baseRotX,
      y: mesh.userData.baseRotY,
      z: mesh.userData.baseRotZ,
      duration: 0.4
    });
  }
  if (mesh.material.emissive) mesh.material.emissiveIntensity = 0;
  cards.forEach(c => {
    if (typeof gsap !== 'undefined') {
      gsap.to(c.material.color, { r: 1, g: 1, b: 1, duration: 0.3 });
    }
  });
}

// ─────────────────────────────────────────
// OVERLAY
// ─────────────────────────────────────────
function showOverlay(singer) {
  const overlay = document.getElementById('singer-card-overlay');
  if (!overlay) return;
  overlay.classList.remove('hidden');
  const el = id => document.getElementById(id);
  if (el('card-name')) el('card-name').innerText = singer.name || '';
  if (el('card-role')) el('card-role').innerText = singer.role || '';
  if (el('card-bio')) el('card-bio').innerText = singer.bio || '';
  if (typeof gsap !== 'undefined') gsap.fromTo(overlay, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.35 });
}

function hideOverlay() {
  const overlay = document.getElementById('singer-card-overlay');
  if (!overlay) return;
  if (typeof gsap !== 'undefined') {
    gsap.to(overlay, { opacity: 0, x: 20, duration: 0.25, onComplete: () => overlay.classList.add('hidden') });
  } else {
    overlay.classList.add('hidden');
  }
}

// ─────────────────────────────────────────
// RESIZE
// ─────────────────────────────────────────
function onResize() {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// ─────────────────────────────────────────
// RENDER LOOP
// ─────────────────────────────────────────
function renderLoop() {
  requestAnimationFrame(renderLoop);
  if (starMesh) starMesh.rotation.y += 0.00015;
  renderer.render(scene, camera);
}
