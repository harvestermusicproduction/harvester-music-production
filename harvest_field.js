/**
 * Harvest Field v2.0 - Living, Interactive Immersive Scene
 * Uses InstancedMesh and Custom Shaders for high-performance organic wheat field.
 */

const db = window.supabase;
let scene, camera, renderer, raycaster, mouse;
let wheatMesh, singerMesh;
let particles;
let currentDepth = 0;
let targetDepth = 0;
let singers = [];
let singerNodes = []; // Indices and data for singer stalks
let hoverId = -1;

// --- Config ---
const CONFIG = {
  FIELD_SIZE: 6000,
  STALKS_COUNT: 3000,
  GOLD_COLOR: 0xf6d28a,
  BROWN_COLOR: 0x8b5a2b,
  SUNSET_GRADIENT: [0x050508, 0x1a0f05, 0x4a2c0a], // Bottom to Top
  DEPTH_SPEED: 8.0,
  WIND_STRENGTH: 0.2,
  WIND_SPEED: 0.001
};

async function init() {
  // 1. Setup Scene
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
  const ambient = new THREE.HemisphereLight(0xffffff, 0x000000, 0.3);
  scene.add(ambient);

  const sunset = new THREE.PointLight(0xffa500, 3, 4000);
  sunset.position.set(0, 500, -2000);
  scene.add(sunset);

  // 3. Components
  createBackground();
  createField();
  createParticles();

  // 4. Load Data
  await loadSingers();

  // 5. Events
  window.addEventListener('resize', onResize);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mousedown', onSelect);
  window.addEventListener('wheel', onWheel, { passive: false });
  document.querySelector('.close-card').onclick = closeDetail;

  animate();
}

function createBackground() {
  // Create a large vertical gradient plane for the horizon micro-glow
  const geo = new THREE.PlaneGeometry(20000, 10000);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      color1: { value: new THREE.Color(0x0a0602) }, // Dark bottom
      color2: { value: new THREE.Color(0x2a1a0a) }  // Warm horizon
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color1;
      uniform vec3 color2;
      varying vec2 vUv;
      void main() {
        gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
      }
    `,
    side: THREE.BackSide
  });
  const bg = new THREE.Mesh(geo, mat);
  bg.position.z = -5000;
  scene.add(bg);
}

function createField() {
  // Organic Stalk Geometry (more segments for bending)
  const geometry = new THREE.CylinderGeometry(0.5, 1.2, 180, 5, 10);
  geometry.translate(0, 90, 0); // Origin at bottom

  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      uColor: { value: new THREE.Color(CONFIG.GOLD_COLOR) },
      uBaseColor: { value: new THREE.Color(CONFIG.BROWN_COLOR) },
      uWindStrength: { value: CONFIG.WIND_STRENGTH },
      uHoverId: { value: -1.0 },
      uSingerIndices: { value: new Float32Array(50).fill(-1) }
    },
    vertexShader: `
      varying vec2 vUv;
      varying float vDist;
      uniform float time;
      uniform float uWindStrength;
      
      void main() {
        vUv = uv;
        vec3 pos = position;
        
        // World position for localized wind waves
        vec4 worldPos = instanceMatrix * vec4(pos, 1.0);
        
        // Bending logic (organic sway)
        float h = position.y / 180.0;
        float sway = sin(time * 0.002 + worldPos.x * 0.001 + worldPos.z * 0.0015) * uWindStrength;
        float ripple = cos(time * 0.001 + worldPos.x * 0.002) * 0.1;
        
        pos.x += pow(h, 2.0) * (sway + ripple) * 60.0;
        pos.z += pow(h, 2.0) * sway * 30.0;
        pos.y -= pow(h, 2.0) * 10.0; // Height compression during bend
        
        vDist = h;
        gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying float vDist;
      uniform vec3 uColor;
      uniform vec3 uBaseColor;
      
      void main() {
        // Gradient from base to golden tip
        vec3 color = mix(uBaseColor, uColor, vDist);
        
        // Highlight at the tip
        float tipHighlight = pow(vDist, 4.0) * 0.5;
        color += tipHighlight;
        
        gl_FragColor = vec4(color, 1.0);
      }
    `
  });

  wheatMesh = new THREE.InstancedMesh(geometry, material, CONFIG.STALKS_COUNT);
  
  const dummy = new THREE.Object3D();
  for (let i = 0; i < CONFIG.STALKS_COUNT; i++) {
    const x = (Math.random() - 0.5) * CONFIG.FIELD_SIZE;
    const z = (Math.random() - 0.9) * CONFIG.FIELD_SIZE;
    
    dummy.position.set(x, 0, z);
    dummy.rotation.y = Math.random() * Math.PI;
    dummy.scale.setScalar(0.8 + Math.random() * 0.5);
    dummy.updateMatrix();
    wheatMesh.setMatrixAt(i, dummy.matrix);
  }
  
  scene.add(wheatMesh);
}

function createParticles() {
  const geo = new THREE.BufferGeometry();
  const count = 1500;
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    pos[i] = (Math.random() - 0.5) * CONFIG.FIELD_SIZE;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    size: 5,
    color: 0xfff0c0,
    transparent: true,
    opacity: 0.4,
    map: createCircleTexture()
  });
  particles = new THREE.Points(geo, mat);
  scene.add(particles);
}

function createCircleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64; canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

async function loadSingers() {
  try {
    const { data: rawSingers, error } = await db.from('singers').select('*').order('created_at', { ascending: true });
    if (error) throw error;
    singers = rawSingers || [];

    // Create Instance Mesh for Icons (Gold Stalks)
    const singerGeo = new THREE.CylinderGeometry(2, 2, 200, 6);
    singerGeo.translate(0, 100, 0);
    const singerMat = new THREE.MeshPhongMaterial({ 
      color: CONFIG.GOLD_COLOR, 
      emissive: CONFIG.GOLD_COLOR, 
      emissiveIntensity: 0.5,
      shininess: 100 
    });
    
    singerMesh = new THREE.InstancedMesh(singerGeo, singerMat, singers.length);
    const dummy = new THREE.Object3D();
    
    singerNodes = []; // Reset nodes
    singers.forEach((singer, i) => {
      // Position singers in specific "islands" across the field
      const x = (Math.random() - 0.5) * CONFIG.FIELD_SIZE * 0.7;
      const z = -(i / singers.length) * CONFIG.FIELD_SIZE * 0.6 - 500;
      
      dummy.position.set(x, 0, z);
      dummy.scale.setScalar(1.5 + Math.random() * 0.5);
      dummy.updateMatrix();
      singerMesh.setMatrixAt(i, dummy.matrix);
      
      singerNodes.push({
        id: i,
        data: singer,
        pos: new THREE.Vector3(x, 100, z)
      });
    });
    
    scene.add(singerMesh);
  } catch (err) {
    console.warn("Singer Load Fail:", err);
  }
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  // Subtle camera tilt
  gsap.to(camera.rotation, {
    y: -mouse.x * 0.05,
    x: (mouse.y + 0.5) * 0.03,
    duration: 1.5
  });
}

function onWheel(event) {
  event.preventDefault();
  targetDepth += event.deltaY * CONFIG.DEPTH_SPEED;
  // Clamp depth: Keep camera within the field
  targetDepth = Math.max(-500, Math.min(targetDepth, CONFIG.FIELD_SIZE * 0.8));
}

function onSelect() {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(singerMesh);
  
  if (intersects.length > 0) {
    const instanceId = intersects[0].instanceId;
    const node = singerNodes[instanceId];
    if (node) showProfile(node);
  }
}

function showProfile(node) {
  const wind = document.getElementById('ambient-wind');
  if (wind) { wind.volume = 0.5; wind.play().catch(()=>{}); }

  const overlay = document.getElementById('singer-card-overlay');
  document.getElementById('card-img').src = node.data.image_url || 'assets/logo.png';
  document.getElementById('card-name').innerText = node.data.name;
  document.getElementById('card-role').innerText = node.data.role || 'GOSPEL SINGER';
  document.getElementById('card-bio').innerText = node.data.bio || '一位用生命歌唱的敬拜者。';

  overlay.classList.remove('hidden');
  setTimeout(() => overlay.classList.add('active'), 50);
}

function closeDetail() {
  const overlay = document.getElementById('singer-card-overlay');
  overlay.classList.remove('active');
  setTimeout(() => overlay.classList.add('hidden'), 600);
}

function animate(time) {
  requestAnimationFrame(animate);

  // Smooth Depth Movement (Forward Exploration)
  currentDepth += (targetDepth - currentDepth) * 0.05;
  camera.position.z = 1200 - currentDepth;
  camera.position.y = 180 + Math.sin(time * 0.001) * 10; // Slight breathing head bob

  // Update Shaders
  if (wheatMesh) wheatMesh.material.uniforms.time.value = time;
  if (singerMesh) singerMesh.material.uniforms.time.value = time;

  // Hover Detection (Logic only for singers for performance)
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(singerMesh);
  if (intersects.length > 0) {
    const id = intersects[0].instanceId;
    if(hoverId !== id) {
      hoverId = id;
      // You could trigger a 3D label here
    }
  } else {
    hoverId = -1;
  }

  // Floating Particles
  if (particles) {
    particles.position.y = Math.sin(time * 0.0005) * 50;
    particles.rotation.y += 0.0002;
    particles.position.z = currentDepth * 0.4; // Parallax
  }

  renderer.render(scene, camera);
}

init();
