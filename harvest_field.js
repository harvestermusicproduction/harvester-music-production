/**
 * Harvest Field v3.0 - Immersive Team Showcase
 * Features: High-performance 3D field with interactive hover-to-reveal singer profiles.
 */

let db;
let scene, camera, renderer, raycaster, mouse;
let wheatMesh, singerMesh;
let singers = [];
let allSingers = []; // Master list
let hoverId = -1;
let currentDepth = 0;
let targetDepth = 0;

const CONFIG = {
  FIELD_SIZE: 5000,
  STALKS_COUNT: 4000,
  GOLD_COLOR: 0xf6d28a,
  DEPTH_SPEED: 8.0
};

async function init() {
  // 0. Database Connection
  db = window.supabase;
  if (!db) {
    console.error("Supabase client not found. Retrying in 1s...");
    setTimeout(init, 1000);
    return;
  }
  // 1. Scene Setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050508);
  scene.fog = new THREE.FogExp2(0x050508, 0.0003);

  camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.set(0, 180, 1200);

  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('harvest-canvas'),
    antialias: true,
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  // 2. Lights
  const ambient = new THREE.HemisphereLight(0xffffff, 0x000000, 0.4);
  scene.add(ambient);

  const sunset = new THREE.PointLight(0xffa500, 2, 4000);
  sunset.position.set(0, 500, -2000);
  scene.add(sunset);

  // 3. Elements
  createField();
  await loadSingers();

  // 4. Events
  window.addEventListener('resize', onResize);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mousedown', onSelect);
  window.addEventListener('wheel', onWheel, { passive: false });
  
  const closeBtn = document.querySelector('.close-card');
  if(closeBtn) closeBtn.onclick = closeDetail;

  animate();
}

function createField() {
  const geometry = new THREE.CylinderGeometry(0.1, 1.5, 90, 4);
  geometry.translate(0, 45, 0); 

  const material = new THREE.MeshStandardMaterial({
    color: CONFIG.GOLD_COLOR,
    roughness: 0.9,
    metalness: 0.0
  });

  wheatMesh = new THREE.InstancedMesh(geometry, material, CONFIG.STALKS_COUNT);
  const dummy = new THREE.Object3D();

  for (let i = 0; i < CONFIG.STALKS_COUNT; i++) {
    const x = (Math.random() - 0.5) * CONFIG.FIELD_SIZE;
    const z = (Math.random() - 0.5) * CONFIG.FIELD_SIZE;
    const s = 0.6 + Math.random() * 0.8;
    
    dummy.position.set(x, 0, z);
    dummy.rotation.y = Math.random() * Math.PI;
    dummy.scale.set(s, s, s);
    dummy.updateMatrix();
    wheatMesh.setMatrixAt(i, dummy.matrix);
  }
  scene.add(wheatMesh);
}

async function loadSingers() {
  try {
    const { data, error } = await db.from('singers').select('*');
    if (error) throw error;
    if (!data || data.length === 0) {
      console.warn("No singers found in database.");
      return;
    }
    allSingers = data;
    renderSingers('all');
    // Hide loading screen if it exists
    const loader = document.getElementById('scene-loader');
    if(loader) loader.style.opacity = '0';
    setTimeout(() => { if(loader) loader.remove(); }, 1000);
  } catch (err) {
    console.error("LoadSingers error:", err);
  }
}

function renderSingers(category) {
  // 1. Cleanup old mesh
  if (singerMesh) scene.remove(singerMesh);

  // 2. Filter data
  if (category === 'all') {
    singers = allSingers;
  } else {
    singers = allSingers.filter(s => (s.role || '').includes(category));
  }

  if (singers.length === 0) return;

  // 3. Create Instanced Mesh
  const geometry = new THREE.SphereGeometry(12, 16, 16);
  const material = new THREE.MeshStandardMaterial({ 
    color: 0xffffff,
    emissive: CONFIG.GOLD_COLOR,
    emissiveIntensity: 0.8 
  });
  
  singerMesh = new THREE.InstancedMesh(geometry, material, singers.length);
  const dummy = new THREE.Object3D();

  singers.forEach((s, i) => {
    const angle = (i / singers.length) * Math.PI * 2 + (Math.random() * 0.5);
    const radius = 600 + Math.random() * 1200;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    
    dummy.position.set(x, 80, z);
    dummy.updateMatrix();
    singerMesh.setMatrixAt(i, dummy.matrix);
  });

  scene.add(singerMesh);
}

// Exposed to global for HTML buttons
window.switchCategory = function(category) {
  // Update Tab UI
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  const targetId = category === 'all' ? 'tab-all' : (category === '福音' ? 'tab-gospel' : 'tab-worship');
  document.getElementById(targetId)?.classList.add('active');

  // Re-render 3D
  renderSingers(category);
  
  // Reset depth for a "fresh" feel
  targetDepth = 0;
}

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(singerMesh);
  
  if (intersects.length > 0) {
    const idx = intersects[0].instanceId;
    if (hoverId !== idx) {
      hoverId = idx;
      document.body.style.cursor = 'pointer';
      showHUD(singers[idx].name, event.clientX, event.clientY);
    }
  } else {
    hoverId = -1;
    document.body.style.cursor = 'default';
    hideHUD();
  }
}

function showHUD(text, x, y) {
  const label = document.getElementById('harvest-label');
  if(!label) return;
  label.innerText = text;
  label.style.left = (x + 25) + 'px';
  label.style.top = (y - 15) + 'px';
  label.classList.add('visible');
}

function hideHUD() {
  const label = document.getElementById('harvest-label');
  if(label) label.classList.remove('visible');
}

function onSelect(event) {
  if (hoverId !== -1) {
    showSingerCard(singers[hoverId]);
  }
}

function showSingerCard(singer) {
  const overlay = document.getElementById('singer-card-overlay');
  if(!overlay) return;
  
  const imgPath = singer.image_url && singer.image_url.startsWith('http') ? singer.image_url : 'assets/logo.png';
  document.getElementById('card-img').src = imgPath;
  document.getElementById('card-name').innerText = singer.name;
  document.getElementById('card-role').innerText = singer.role || '福音歌手';
  document.getElementById('card-bio').innerText = singer.bio || '用心灵和诚实收割每一刻感动的声音。';
  
  overlay.classList.remove('hidden');
  gsap.fromTo(".singer-card", 
    { opacity: 0, scale: 0.9, y: 30 }, 
    { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "power3.out" }
  );
}

function closeDetail() {
  const overlay = document.getElementById('singer-card-overlay');
  gsap.to(".singer-card", { 
    opacity: 0, scale: 0.9, y: 30, duration: 0.3, 
    onComplete: () => overlay.classList.add('hidden') 
  });
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onWheel(event) {
  event.preventDefault();
  targetDepth += event.deltaY * CONFIG.DEPTH_SPEED * 0.5;
  targetDepth = Math.max(-10000, Math.min(10000, targetDepth));
}

function animate() {
  requestAnimationFrame(animate);
  currentDepth += (targetDepth - currentDepth) * 0.05;
  camera.position.z = 1200 + currentDepth;
  
  if(wheatMesh) wheatMesh.rotation.z = Math.sin(Date.now() * 0.001) * 0.015;
  renderer.render(scene, camera);
}

document.addEventListener('DOMContentLoaded', init);
