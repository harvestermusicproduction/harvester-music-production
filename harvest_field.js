/**
 * Harvest Field v8.0 - MISSION CONTROL ALPHA (Horizontal FPS Gallery)
 * Cinematic Horizontal 3D Space Gallery with FPS-style Camera & Crosshair HUD.
 * Tech: Vanilla Three.js + GSAP + CSS HUD
 */

let db, scene, camera, renderer, raycaster, mouse;
let starMesh, gridHelper, cardsGroup;
let cards = [];
let allSingers = [];
let hoverIdx = -1;
let targetCamX = 0;
let mouseLook = { x: 0, y: 0 };
let textureLoader;
let initiated = false;

// Drag State
let isDragging = false;
let startX = 0;
let scrollAtStart = 0;

const CFG = {
  X_GAP: 600,            // Distance between cards sideways
  W: 320,                // Card width
  H: 480,                // Card height
  GOLD: 0xc9933b,
  DARK: 0x050508,
  GLOW: 0x00f3ff         // Cyber blue glow for "Locked" state
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
  
  // 1. Scene Setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(CFG.DARK);
  scene.fog = new THREE.FogExp2(CFG.DARK, 0.0003);

  // 2. Camera: FPS View
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 30000);
  camera.position.set(0, 0, 1000); // Start back a bit

  // 3. Renderer
  const canvas = document.getElementById('harvest-canvas');
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2(0, 0); // Raycast from CENTER (Crosshair)
  textureLoader = new THREE.TextureLoader();
  textureLoader.setCrossOrigin('anonymous');

  cardsGroup = new THREE.Group();
  scene.add(cardsGroup);

  // 4. Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const flash = new THREE.PointLight(0xffffff, 1);
  flash.position.set(0, 500, 1500);
  scene.add(flash);

  buildEnvironment();

  // 5. Interaction Listeners
  window.addEventListener('resize', onResize);
  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('mousemove', onMouseMove);
  
  // Drag Support
  window.addEventListener('mousedown', onPointerDown);
  window.addEventListener('touchstart', onPointerDown, { passive: false });
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('touchmove', onPointerMove, { passive: false });
  window.addEventListener('mouseup', onPointerUp);
  window.addEventListener('touchend', onPointerUp);
  window.addEventListener('click', onClick);
  
  const closeBtn = document.querySelector('.close-card');
  if (closeBtn) closeBtn.onclick = hideOverlay;

  renderLoop();
  await loadData();
}

function buildEnvironment() {
  // Deep Perspective Grid (Horizontal direction)
  gridHelper = new THREE.GridHelper(50000, 200, 0x333333, 0x111111);
  gridHelper.position.y = -CFG.H * 0.8;
  scene.add(gridHelper);

  // Star Particles
  const geo = new THREE.BufferGeometry();
  const pos = [];
  for (let i = 0; i < 8000; i++) {
    pos.push((Math.random() - 0.5) * 30000, (Math.random() - 0.5) * 10000, (Math.random() - 0.5) * 10000);
  }
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  starMesh = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: 2, transparent: true, opacity: 0.3 }));
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
    console.error('[MissionControl] Data Error:', err);
  } finally {
    const loader = document.getElementById('scene-loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 800);
    }
  }
}

/**
 * High-End Cyber UI Texture for Card Back
 */
function createCardUITexture(singer) {
  const w = 512, h = 768;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');

  // Dark Panel
  ctx.fillStyle = '#0a0a0c';
  ctx.fillRect(0, 0, w, h);

  // Grid background pattern
  ctx.strokeStyle = '#1a1a1f';
  ctx.lineWidth = 1;
  for(let i=0; i<w; i+=40) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,h); ctx.stroke(); }
  for(let j=0; j<h; j+=40) { ctx.beginPath(); ctx.moveTo(0,j); ctx.lineTo(w,j); ctx.stroke(); }

  // Cyber Borders
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, w - 20, h - 20);

  // Corner Accents
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 4;
  const len = 40;
  // Top Left
  ctx.beginPath(); ctx.moveTo(10, 10+len); ctx.lineTo(10,10); ctx.lineTo(10+len,10); ctx.stroke();
  // Bottom Right
  ctx.beginPath(); ctx.moveTo(w-10-len, h-10); ctx.lineTo(w-10, h-10); ctx.lineTo(w-10, h-10-len); ctx.stroke();

  // Name (Moved Up)
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 50px Courier, monospace';
  ctx.shadowColor = '#00f3ff';
  ctx.shadowBlur = 0;
  ctx.fillText(singer.name.toUpperCase(), 35, h - 180);

  // Bio (Multi-line support)
  ctx.font = '22px Courier, monospace';
  ctx.fillStyle = CFG.GOLD;
  const bioText = singer.role || singer.bio || '';
  
  // Simple Wrap logic
  const words = bioText.split('');
  let line1 = '', line2 = '';
  const maxLine = 22;
  
  if (words.length > maxLine) {
    line1 = bioText.substring(0, maxLine);
    line2 = bioText.substring(maxLine, maxLine + maxLine);
    if(bioText.length > maxLine * 2) line2 += '...';
  } else {
    line1 = bioText;
  }

  ctx.fillText(line1, 35, h - 130);
  if(line2) ctx.fillText(line2, 35, h - 95);

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  return tex;
}

function buildCards(dataArray) {
  // Reset
  cards.forEach(c => {
    c.traverse(child => { if(child.material) { if(child.material.map) child.material.map.dispose(); child.material.dispose(); } });
    cardsGroup.remove(c);
  });
  cards = [];
  hoverIdx = -1;

  if (!dataArray || dataArray.length === 0) {
    dataArray = [{ name: 'EMPTY CACHE', category: 'SYSTEM' }];
  }

  targetCamX = 0;
  camera.position.x = 0;

  dataArray.forEach((singer, i) => {
    const cardGroup = new THREE.Group();
    const xPos = i * CFG.X_GAP;
    // Layered Depth: staggered to create 3D paralax
    const zPos = (Math.random() - 0.5) * 100; 
    cardGroup.position.set(xPos, 0, zPos);
    
    // 1. MAIN PANEL (Back)
    const uiGeo = new THREE.PlaneGeometry(CFG.W, CFG.H);
    const uiMat = new THREE.MeshStandardMaterial({ 
      map: createCardUITexture(singer),
      transparent: true,
      side: THREE.DoubleSide
    });
    const uiMesh = new THREE.Mesh(uiGeo, uiMat);
    cardGroup.add(uiMesh);

    // 2. PHOTO PORT (Front)
    const pW = CFG.W - 50;
    const pH = CFG.H - 180;
    const pGeo = new THREE.PlaneGeometry(pW, pH);
    const pMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 1 });
    const pMesh = new THREE.Mesh(pGeo, pMat);
    pMesh.position.set(0, 60, 2);
    cardGroup.add(pMesh);

    // Load Photo
    if(singer.image_url) {
      textureLoader.load(singer.image_url, (t) => {
        pMat.map = t;
        pMat.color.setHex(0xffffff);
        pMat.needsUpdate = true;
      });
    }

    // 3. SCANLINE EFFECT (Hidden by default)
    const sMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff, transparent: true, opacity: 0 });
    const sMesh = new THREE.Mesh(new THREE.PlaneGeometry(CFG.W, 2), sMat);
    sMesh.position.z = 5;
    cardGroup.add(sMesh);

    cardGroup.userData = { singer, index: i, scanline: sMesh, photo: pMesh };
    cardsGroup.add(cardGroup);
    cards.push(cardGroup);

    // Entry animation: Fade in from distance
    gsap.from(cardGroup.position, { z: -1000, opacity: 0, duration: 1.5, delay: i * 0.1, ease: 'power3.out' });
  });

  // Limits
  cardsGroup.userData.maxX = (dataArray.length - 1) * CFG.X_GAP;
}

window.switchCategory = function (cat) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  let key = 'all';
  if (cat === '福音') { document.getElementById('tab-gospel')?.classList.add('active'); key = 'gospel'; }
  else if (cat === '敬拜') { document.getElementById('tab-worship')?.classList.add('active'); key = 'worship'; }
  else document.getElementById('tab-all')?.classList.add('active');

  const filtered = key === 'all' ? allSingers : allSingers.filter(s => s.category === key);
  
  // Transition
  gsap.to(cardsGroup.position, { z: -1000, opacity: 0, duration: 0.5, onComplete: () => {
    buildCards(filtered);
    gsap.to(cardsGroup.position, { z: 0, opacity: 1, duration: 1 });
  }});
};

// Horizontal Scroll (Snappier)
function onWheel(e) {
  e.preventDefault();
  // Sensitivity boosted to 2.5, duration reduced to 0.7s
  targetCamX += e.deltaY * 2.5;
  applyBounds();
  gsap.to(camera.position, { x: targetCamX, duration: 0.7, ease: 'power2.out', overwrite: true });
}

// Drag & Swipe Mechanism
function onPointerDown(e) {
  isDragging = true;
  startX = e.clientX || (e.touches && e.touches[0].clientX);
  scrollAtStart = targetCamX;
  document.body.style.cursor = 'grabbing';
}

function onPointerMove(e) {
  if (!isDragging) return;
  const currentX = e.clientX || (e.touches && e.touches[0].clientX);
  const diff = (startX - currentX) * 2.5; // Drag sensitivity
  targetCamX = scrollAtStart + diff;
  applyBounds();
  camera.position.x = targetCamX; // Instant feedback while dragging
}

function onPointerUp() {
  if (!isDragging) return;
  isDragging = false;
  document.body.style.cursor = 'default';
  // Final smooth settle
  gsap.to(camera.position, { x: targetCamX, duration: 0.8, ease: 'power3.out', overwrite: true });
}

function applyBounds() {
  const maxX = cardsGroup.userData.maxX || 0;
  if (targetCamX < 0) targetCamX = 0;
  if (targetCamX > maxX) targetCamX = maxX;
}

// FPS Mouse Look
function onMouseMove(e) {
  // 1. Update Look Target (Rotation)
  const x = (e.clientX / window.innerWidth) * 2 - 1;
  const y = -(e.clientY / window.innerHeight) * 2 + 1;
  mouseLook.x = x * 0.2; // Max yaw
  mouseLook.y = y * 0.15; // Max pitch

  // 2. HUD Crosshair move slightly (Lag effect)
  const crosshair = document.getElementById('crosshair');
  if(crosshair) {
    gsap.to(crosshair, { x: x * 20, y: -y * 20, duration: 0.2 });
  }
}

function onClick() {
  if (hoverIdx !== -1) {
    showOverlay(cards[hoverIdx].userData.singer);
  }
}

function renderLoop() {
  requestAnimationFrame(renderLoop);

  // 1. Apply FPS Rotation
  camera.rotation.y += (mouseLook.x - camera.rotation.y) * 0.05;
  camera.rotation.x += (-mouseLook.y - camera.rotation.x) * 0.05;

  // 2. Raycast from SCREEN CENTER (FPS Crosshair)
  raycaster.setFromCamera(new THREE.Vector2(0,0), camera);
  const hits = raycaster.intersectObjects(cards, true);

  if (hits.length > 0) {
    let obj = hits[0].object;
    while(obj.parent && !obj.userData.singer) obj = obj.parent;
    
    if (obj.userData.singer && hoverIdx !== obj.userData.index) {
      if (hoverIdx !== -1 && cards[hoverIdx]) revertCard(cards[hoverIdx]);
      hoverIdx = obj.userData.index;
      lockCard(obj);
      document.body.style.cursor = 'crosshair';
      updateSystemHUD(obj.userData.singer, true);
    }
    
    // Animate Scanline
    const card = cards[hoverIdx];
    if(card && card.userData.scanline) {
      card.userData.scanline.position.y = Math.sin(Date.now() * 0.005) * (CFG.H/2);
      card.userData.scanline.material.opacity = 0.8;
    }

  } else if (hoverIdx !== -1) {
    revertCard(cards[hoverIdx]);
    hoverIdx = -1;
    document.body.style.cursor = 'default';
    updateSystemHUD(null, false);
  }

  // Environment animation
  if (starMesh) starMesh.rotation.y += 0.0001;
  
  renderer.render(scene, camera);
}

function lockCard(m) {
  gsap.to(m.scale, { x: 1.1, y: 1.1, duration: 0.3 });
  gsap.to(m.position, { z: 50, duration: 0.3 }); // Pop out
  
  // HUD Elements
  const hud = document.getElementById('fps-target-info');
  if(hud) hud.classList.add('detected');
}

function revertCard(m) {
  gsap.to(m.scale, { x: 1, y: 1, duration: 0.4 });
  gsap.to(m.position, { z: 0, duration: 0.4 });
  if(m.userData.scanline) m.userData.scanline.material.opacity = 0;
  
  const hud = document.getElementById('fps-target-info');
  if(hud) hud.classList.remove('detected');
}

function updateSystemHUD(singer, detected) {
  const label = document.getElementById('fps-target-name');
  if(!label) return;
  if(detected) {
    label.innerText = 'TARGET: ' + singer.name.toUpperCase();
    document.getElementById('crosshair').classList.add('locking');
  } else {
    label.innerText = 'SCANNING FOR TARGET...';
    document.getElementById('crosshair').classList.remove('locking');
  }
}

function showOverlay(s) {
  const o = document.getElementById('singer-card-overlay');
  if (!o) return;
  o.classList.remove('hidden');
  document.getElementById('card-name').innerText = s.name || '';
  document.getElementById('card-role').innerText = s.role || '';
  document.getElementById('card-bio').innerText = s.bio || '';
  gsap.fromTo(o, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out' });
}

function hideOverlay() {
  const o = document.getElementById('singer-card-overlay');
  if (o) gsap.to(o, { opacity: 0, scale: 1.1, duration: 0.3, onComplete: () => o.classList.add('hidden') });
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
