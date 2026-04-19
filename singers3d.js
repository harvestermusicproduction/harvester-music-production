/**
 * Harvester Space - Horizontal Propulsion Interaction
 * Supabase Edition - High-performance, drag-based, hand-following card system.
 */

// Note: Ensure config.js and Supabase SDK are loaded before this script.
const db = window.supabase; 

let teamData = [];
let scene, camera, renderer, particles;

const fallbackTeam = [
  { name: '汤小康', role: '音乐总监 / 导演', bio: '创作了《情非得已》等经典，Harvester 灵魂人物。', image_url: 'https://ui-avatars.com/api/?name=TXK&background=f6d28a&color=111' },
  { name: 'Warren', role: '制作人', bio: '资深影音策划，Harvester 核心推动者。', image_url: 'https://ui-avatars.com/api/?name=W&background=f6d28a&color=111' },
  { name: 'Natasha', role: '策划总监', bio: '全才型艺人，负责品牌视觉与整体策划。', image_url: 'https://ui-avatars.com/api/?name=N&background=f6d28a&color=111' },
  { name: 'Harvester Music Production', role: '收割机音乐', bio: '以音乐创作、剧情叙事与基督信仰为核心的艺术品牌。', image_url: 'assets/logo.png' }
];

function toImageLink(url) {
  if (!url || typeof url !== 'string') return url;
  if (!url.startsWith('http')) return url; 
  return url;
}

// 1. Three.js Background (Stars)
function initThreeJS() {
  const canvas = document.getElementById('space-canvas');
  if (!canvas) return;
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050508, 0.0002);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 30000);
  camera.position.z = 1000;

  renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const geometry = new THREE.BufferGeometry();
  const count = 3000;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i+=3) {
    positions[i] = (Math.random() - 0.5) * 10000;
    positions[i+1] = (Math.random() - 0.5) * 10000;
    positions[i+2] = (Math.random() - 0.5) * 10000;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ size: 3, color: 0xf6d28a, transparent: true, opacity: 0.4 });
  particles = new THREE.Points(geometry, material);
  scene.add(particles);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// 2. Interaction State
let isDragging = false;
let startX = 0;
let currentScrollX = 0;
let targetScrollX = 0;
let cardSpacing = window.innerWidth * 0.8; 
const dragSensitivity = 1.0; 

window.addEventListener('resize', () => {
  cardSpacing = window.innerWidth * 0.8;
  if (teamData.length > 0) {
    teamData.forEach((data, index) => {
      data.baseX = index * cardSpacing;
    });
  }
});

const spaceCameraDiv = document.getElementById('space-camera');

function initSpaceDOM() {
  if (!spaceCameraDiv) return;
  spaceCameraDiv.innerHTML = ""; 

  teamData.forEach((data, index) => {
    const el = document.createElement('div');
    el.className = 'team-node';
    el.innerHTML = `
      <div class="team-node-card">
        <img src="${toImageLink(data.image_url)}" class="team-node-img" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=111&color=f6d28a&size=512'" alt="${data.name}">
        <div class="team-node-info-text">
          <div class="team-node-role">${data.role || ''}</div>
          <div class="team-node-name">${data.name || 'Untitled'}</div>
          <div class="team-node-desc">${data.bio || ''}</div>
        </div>
      </div>
    `;
    spaceCameraDiv.appendChild(el);
    data.element = el;
    data.baseX = index * cardSpacing;
  });
}

// 3. Animation Loop
function updateSpace() {
  currentScrollX += (targetScrollX - currentScrollX) * 0.2;
  teamData.forEach((data, index) => {
    const node = data.element;
    if (!node) return;
    const xPos = data.baseX + currentScrollX;
    const absDist = Math.abs(xPos);
    let scale = 1.05 - (absDist / cardSpacing) * 0.2;
    scale = Math.max(0.8, Math.min(1.05, scale));
    let opacity = 1 - (absDist / (cardSpacing * 1.5));
    opacity = Math.max(0, Math.min(1, opacity));
    node.style.zIndex = Math.floor(1000 - absDist);
    node.style.opacity = opacity;
    node.style.transform = `translate3d(${xPos}px, 0, 0) scale(${scale})`;
  });

  if (particles) {
    particles.rotation.y += 0.0002;
    particles.position.x = currentScrollX * 0.05;
  }
  if (renderer && scene && camera) renderer.render(scene, camera);
}

// 4. Input Handlers
let initialTargetScrollX = 0;
function getX(e) {
  if (e.touches && e.touches.length > 0) return e.touches[0].clientX;
  return e.clientX;
}
function handleStart(e) {
  isDragging = true;
  startX = getX(e);
  initialTargetScrollX = targetScrollX;
  document.body.classList.add('grabbing');
}
function handleMove(e) {
  if (!isDragging) return;
  const x = getX(e);
  const deltaX = x - startX;
  targetScrollX = initialTargetScrollX - deltaX * dragSensitivity;
  const minScroll = -(teamData.length - 1) * cardSpacing;
  const maxScroll = 0;
  if (targetScrollX > maxScroll) targetScrollX = maxScroll + (targetScrollX - maxScroll) * 0.2;
  else if (targetScrollX < minScroll) targetScrollX = minScroll + (targetScrollX - minScroll) * 0.2;
}
function handleEnd() {
  if (!isDragging) return;
  isDragging = false;
  document.body.classList.remove('grabbing');
  const snapIndex = Math.round(-targetScrollX / cardSpacing);
  const constrainedIndex = Math.max(0, Math.min(teamData.length - 1, snapIndex));
  targetScrollX = -constrainedIndex * cardSpacing;
}

let allRawSingers = []; // Store all from DB
let currentCategory = 'all';

// 5. Initial Init
async function startSpace() {
  initThreeJS();
  try {
    const { data: live, error } = await db.from('singers').select('*').order('display_order', { ascending: true });
    if (error) throw error;
    if (live && live.length > 0) allRawSingers = live;
    else allRawSingers = fallbackTeam;
  } catch (err) {
    console.warn("Using fallback team data:", err);
    allRawSingers = fallbackTeam;
  }
  
  teamData = [...allRawSingers];
  initSpaceDOM();

  function animate() {
    updateSpace();
    requestAnimationFrame(animate);
  }
  animate();
}

window.switchCategory = (category, btnId) => {
  currentCategory = category;
  
  // Update Tab Styling
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  if (btnId) document.getElementById(btnId).classList.add('active');

  // Filter Data
  if (category === 'all') {
    teamData = [...allRawSingers];
  } else {
    teamData = allRawSingers.filter(s => s.category === category);
  }

  // Reset scroll
  targetScrollX = 0;
  currentScrollX = 0;

  // Re-init DOM
  initSpaceDOM();
};

document.addEventListener('DOMContentLoaded', startSpace);
window.addEventListener('mousedown', handleStart);
window.addEventListener('touchstart', handleStart, { passive: false });
window.addEventListener('mousemove', handleMove);
window.addEventListener('touchmove', handleMove, { passive: false });
window.addEventListener('mouseup', handleEnd);
window.addEventListener('touchend', handleEnd);
