/**
 * Harvest Field v4.0 - VibeCoding Minimalist Z-Axis 3D Gallery
 * Transforms the viewport into a deep space tunnel gallery with hovering cards.
 */

let db;
let scene, camera, renderer, raycaster, mouse;
let starMesh, gridHelper;
let allSingers = [];
let cardsGroup = new THREE.Group();
let cards = [];
let hoverIdx = -1;
let targetZ = 500;
let textureLoader;

const CONFIG = {
  Z_SPACING: 800,        // Space between cards
  CARD_WIDTH: 220,
  CARD_HEIGHT: 330,
  GOLD: 0xc9933b,
  DARK: 0x050508
};

async function init() {
  db = window.supabase;
  if (!db) {
    setTimeout(init, 500);
    return;
  }

  // 1. Core Setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(CONFIG.DARK);
  // Add heavy fog for depth transition
  scene.fog = new THREE.FogExp2(CONFIG.DARK, 0.0006);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 15000);
  camera.position.set(0, 0, targetZ);

  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('harvest-canvas'),
    antialias: true,
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  textureLoader = new THREE.TextureLoader();

  // 2. Lighting (Moody, cinematic)
  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);
  
  const spotLight = new THREE.SpotLight(0xffffff, 1.5);
  spotLight.position.set(0, 500, 500);
  spotLight.angle = Math.PI / 4;
  spotLight.penumbra = 0.5;
  scene.add(spotLight);

  scene.add(cardsGroup);

  // 3. Environment: Stars & Grid
  createEnvironment();

  // 4. Fetch & Build Data
  await loadSingers();

  // 5. Events
  window.addEventListener('resize', onResize);
  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('mousemove', onMouseMove);
  
  const closeBtn = document.querySelector('.close-card');
  if(closeBtn) closeBtn.onclick = hideOverlay;

  // Render Loop
  gsap.ticker.add(animate);
}

function createEnvironment() {
  // Deep Perspective Grid
  gridHelper = new THREE.GridHelper(20000, 200, CONFIG.GOLD, 0x111111);
  gridHelper.position.y = -CONFIG.CARD_HEIGHT;
  scene.add(gridHelper);

  // Subtle Star Particles
  const geo = new THREE.BufferGeometry();
  const verts = [];
  for(let i=0; i<3000; i++) {
    verts.push(
      (Math.random() - 0.5) * 4000,
      (Math.random() - 0.5) * 4000,
      (Math.random() - 0.5) * 10000
    );
  }
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 2, transparent: true, opacity: 0.4 });
  starMesh = new THREE.Points(geo, mat);
  scene.add(starMesh);
}

async function loadSingers() {
  try {
    const { data, error } = await db.from('singers').select('*');
    if (error) throw error;
    allSingers = data || [];
    
    // Check URL Route
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'gospel') {
      window.switchCategory('福音');
    } else if (tab === 'worship') {
      window.switchCategory('敬拜');
    } else {
      buildCards(allSingers);
    }
    
    // Fade out loader
    const loader = document.getElementById('scene-loader');
    if(loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 1000);
    }
  } catch (e) {
    console.error("Loader Error:", e);
    alert("System Boot Error: " + e.message);
    const loader = document.getElementById('scene-loader');
    if(loader) loader.style.display = 'none';
  }
}

function buildCards(dataArray) {
  try {
    // Cleanup old cards
    cards.forEach(c => cardsGroup.remove(c));
    cards = [];
    hoverIdx = -1;
    hideOverlay();

    // Reset Camera
    targetZ = Math.max(500, CONFIG.Z_SPACING);
    gsap.to(camera.position, { z: targetZ, duration: 1.5, ease: "power3.out" });

    const geo = new THREE.PlaneGeometry(CONFIG.CARD_WIDTH, CONFIG.CARD_HEIGHT);
    
    // Ensure array is valid
    if (!dataArray || !Array.isArray(dataArray)) dataArray = [];

    dataArray.forEach((singer, i) => {
      const sideOffset = i === 0 ? 0 : (i % 2 === 0 ? 150 : -150);
      const zPos = -(i * CONFIG.Z_SPACING);

      const mat = new THREE.MeshStandardMaterial({ 
        color: 0xcccccc, 
        roughness: 0.1,
        metalness: 0.2,
        side: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(sideOffset, 0, zPos);
      
      mesh.rotation.z = (Math.random() - 0.5) * 0.1;
      mesh.rotation.y = (sideOffset > 0) ? -0.1 : (sideOffset < 0 ? 0.1 : 0);
      
      const imgUrl = singer.image_url && String(singer.image_url).startsWith('http') ? singer.image_url : 'assets/logo.png';
      
      try {
        textureLoader.load(imgUrl, (tex) => {
          tex.minFilter = THREE.LinearFilter;
          mesh.material.map = tex;
          mesh.material.color.setHex(0xffffff);
          mesh.material.needsUpdate = true;
        });
      } catch (texErr) {
        console.warn("Texture error:", texErr);
      }

      mesh.userData = { singer: singer, index: i, baseRotX: mesh.rotation.x, baseRotY: mesh.rotation.y, baseRotZ: mesh.rotation.z };
      
      cardsGroup.add(mesh);
      cards.push(mesh);

      gsap.from(mesh.position, {
        y: -500,
        opacity: 0,
        duration: 1.5,
        delay: i * 0.1,
        ease: "power3.out"
      });
    });

    const maxZ = -(dataArray.length > 0 ? dataArray.length - 1 : 0) * CONFIG.Z_SPACING;
    cardsGroup.userData.maxZ = maxZ;

  } catch(err) {
    console.error("buildCards Error:", err);
    alert("Build Error: " + err.message);
  }
}

// Global hook for Navigation Filters
window.switchCategory = function(cat) {
  // Active UI Class Toggle
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  let id = 'tab-all';
  let dbKey = 'all';
  if(cat === '福音') { id = 'tab-gospel'; dbKey = 'gospel'; }
  if(cat === '敬拜') { id = 'tab-worship'; dbKey = 'worship'; }
  document.getElementById(id)?.classList.add('active');

  const filtered = dbKey === 'all' 
    ? allSingers 
    : allSingers.filter(s => s.category === dbKey);
    
  buildCards(filtered);
};

// Scroll = Move Camera Forward (Z-axis drive)
function onWheel(e) {
  e.preventDefault();
  // Multiply factor for speed feeling
  targetZ += e.deltaY * 1.5; 

  // Boundaries: don't reverse past start, don't go infinitely deep
  const startBound = 500;
  const endBound = (cardsGroup.userData.maxZ || -1000) - 800; // allow passing the last card slightly

  if (targetZ > startBound) targetZ = startBound;
  if (targetZ < endBound) targetZ = endBound;

  // Smooth cinematic camera drive
  gsap.to(camera.position, {
    z: targetZ,
    duration: 1.2,
    ease: "power3.out"
  });
}

function onMouseMove(e) {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(cards);

  if (intersects.length > 0) {
    const object = intersects[0].object;
    const idx = object.userData.index;

    if (hoverIdx !== idx) {
      document.body.style.cursor = 'pointer';
      
      // On new hover, revert the old hovered
      if(hoverIdx !== -1) revertCard(cards[hoverIdx]);
      
      hoverIdx = idx;
      focusCard(object);

      // Show HTML DOM Meta Layer
      showOverlay(object.userData.singer);
    }

    // 3D Tilt Parallax Effect relative to mouse on the card!
    const uv = intersects[0].uv; // 0.0 to 1.0 across the plane
    if (uv) {
      const tiltX = (uv.y - 0.5) * -0.5; // Up/Down
      const tiltY = (uv.x - 0.5) * 0.5;  // Left/Right
      gsap.to(object.rotation, {
        x: object.userData.baseRotX + tiltX,
        y: object.userData.baseRotY + tiltY,
        duration: 0.3,
        ease: "power2.out"
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
  // Elevate and Glow
  gsap.to(mesh.scale, { x: 1.15, y: 1.15, z: 1.15, duration: 0.5, ease: "back.out(1.5)" });
  mesh.material.emissive.setHex(CONFIG.GOLD);
  mesh.material.emissiveIntensity = 0.4;
  
  // Dim others (Defocus effect without expensive post-processing)
  cards.forEach(c => {
    if (c !== mesh) {
      gsap.to(c.material.color, { r: 0.2, g: 0.2, b: 0.2, duration: 0.4 });
    }
  });
}

function revertCard(mesh) {
  // Reset geometry
  gsap.to(mesh.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: "power3.out" });
  gsap.to(mesh.rotation, { 
    x: mesh.userData.baseRotX, 
    y: mesh.userData.baseRotY, 
    z: mesh.userData.baseRotZ, 
    duration: 0.5 
  });
  mesh.material.emissiveIntensity = 0;
  
  // Brighten others back
  cards.forEach(c => {
    gsap.to(c.material.color, { r: 1, g: 1, b: 1, duration: 0.4 });
  });
}

function showOverlay(data) {
  const overlay = document.getElementById('singer-card-overlay');
  if(!overlay) return;
  overlay.classList.remove('hidden');
  
  document.getElementById('card-name').innerText = data.name;
  document.getElementById('card-role').innerText = data.role || 'Gospel Singer';
  document.getElementById('card-bio').innerText = data.bio || '';
  
  // Animate it entering via CSS overrides combined with GSAP
  gsap.fromTo(overlay, 
    { opacity: 0, x: 20 }, 
    { opacity: 1, x: 0, duration: 0.4 }
  );
}

function hideOverlay() {
  const overlay = document.getElementById('singer-card-overlay');
  if(overlay) {
    gsap.to(overlay, { 
      opacity: 0, x: 20, duration: 0.3, 
      onComplete: () => overlay.classList.add('hidden')
    });
  }
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  // Move grid endlessly to simulate passive forward motion if needed, 
  // or just tie it to camera movement
  if(gridHelper) {
    // gridHelper.position.z = (camera.position.z % 200); // 200 is grid size, creates infinite floor
  }
  
  // Parallax stars
  if(starMesh) {
    starMesh.rotation.y += 0.0002;
  }

  renderer.render(scene, camera);
}

document.addEventListener('DOMContentLoaded', init);
