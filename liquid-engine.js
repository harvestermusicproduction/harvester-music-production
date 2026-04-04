/**
 * Liquid Engine - Main 3D Scene Management
 * Orchestrates the GPGPU simulation and surface rendering.
 */

class LiquidRipple {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.ratio = 0.5; 
    
    // --- Initialize Core Three.js ---
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
    this.camera.position.z = 1;
    
    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    this.renderer.setClearColor(0x000000, 0); // Transparent black
    this.renderer.setSize(this.width, this.height);
    this.container.appendChild(this.renderer.domElement);

    // 1. Simulation Buffers (Ping-Pong)
    const simWidth = Math.floor(this.width * this.ratio);
    const simHeight = Math.floor(this.height * this.ratio);
    
    // DETECT BEST TEXTURE TYPE
    let type = THREE.HalfFloatType;
    const gl = this.renderer.getContext();
    if (!this.renderer.capabilities.isWebGL2 && !gl.getExtension('OES_texture_half_float')) {
      type = gl.getExtension('OES_texture_float') ? THREE.FloatType : THREE.UnsignedByteType;
    }

    const options = {
      type: type,
      minFilter: THREE.NearestFilter, // Essential for wide compatibility
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false,
      depthBuffer: false
    };

    console.log("Using Liquid Texture Type:", type === THREE.HalfFloatType ? "HalfFloat" : "Other");

    this.renderTarget1 = new THREE.WebGLRenderTarget(simWidth, simHeight, options);
    this.renderTarget2 = this.renderTarget1.clone();
    this.currentBuffer = this.renderTarget1;
    this.prevBuffer = this.renderTarget2;

    // 2. Simulation Materials
    this.simMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tPrev: { value: null },
        tCurrent: { value: null },
        delta: { value: new THREE.Vector2(1.0 / simWidth, 1.0 / simHeight) },
        damping: { value: 0.98 } 
      },
      vertexShader: window.RIPPLE_SHADERS.vertex,
      fragmentShader: window.RIPPLE_SHADERS.simulation
    });

    this.interMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tCurrent: { value: null },
        mouse: { value: new THREE.Vector2(0, 0) },
        strength: { value: 0.2 }, // Boosted for visibility
        radius: { value: 0.04 }
      },
      vertexShader: window.RIPPLE_SHADERS.vertex,
      fragmentShader: window.RIPPLE_SHADERS.interaction
    });

    // 3. Final Surface Material
    // Brighter environmental base (Navy Blue instead of pitch black)
    const fallbackTexture = new THREE.DataTexture(new Uint8Array([15, 15, 25, 255]), 1, 1, THREE.RGBAFormat);
    fallbackTexture.needsUpdate = true;

    this.surfaceMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tHeight: { value: null },
        tBackground: { value: fallbackTexture },
        delta: { value: new THREE.Vector2(1.0 / simWidth, 1.0 / simHeight) },
        lightPosition: { value: new THREE.Vector3(1, 1, 3) },
        edgeColor: { value: new THREE.Color(0x0a0a1a) }, // Slightly deeper blue
        iTime: { value: 0 }
      },
      vertexShader: window.WATER_SHADERS.vertex,
      fragmentShader: window.WATER_SHADERS.fragment,
      transparent: true
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    this.simQuad = new THREE.Mesh(geometry, this.simMaterial);
    this.renderQuad = new THREE.Mesh(geometry, this.surfaceMaterial);
    
    this.scene.add(this.simQuad);
    this.scene.add(this.renderQuad);
    
    this.mouse = new THREE.Vector2(0, 0);
    this.isInteracting = false;
    this.setupListeners();
    this.animate();
  }

  setupListeners() {
    const handleMove = (x, y) => {
      this.mouse.x = x / window.innerWidth;
      this.mouse.y = 1.0 - (y / window.innerHeight);
      this.isInteracting = true;
    };
    window.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
    window.addEventListener('mousedown', () => {
      this.isInteracting = true; 
      this.interMaterial.uniforms.strength.value = 0.3;
    });
    window.addEventListener('mouseup', () => {
      this.interMaterial.uniforms.strength.value = 0.2;
    });
    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.renderer.setSize(this.width, this.height);
    });
  }

  updateSimulation() {
    this.simQuad.visible = true;
    this.renderQuad.visible = false;

    if (this.isInteracting) {
      this.interMaterial.uniforms.tCurrent.value = this.currentBuffer.texture;
      this.interMaterial.uniforms.mouse.value = this.mouse;
      this.simQuad.material = this.interMaterial;
      this.renderer.setRenderTarget(this.prevBuffer);
      this.renderer.render(this.scene, this.camera);
      this.isInteracting = false; 
    }
    this.simMaterial.uniforms.tPrev.value = this.prevBuffer.texture;
    this.simMaterial.uniforms.tCurrent.value = this.currentBuffer.texture;
    this.simQuad.material = this.simMaterial;
    this.renderer.setRenderTarget(this.prevBuffer);
    this.renderer.render(this.scene, this.camera);
    
    const temp = this.currentBuffer;
    this.currentBuffer = this.prevBuffer;
    this.prevBuffer = temp;
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.updateSimulation();
    
    // Final Pass
    this.simQuad.visible = false;
    this.renderQuad.visible = true;
    this.renderer.setRenderTarget(null);
    this.surfaceMaterial.uniforms.tHeight.value = this.currentBuffer.texture;
    this.surfaceMaterial.uniforms.iTime.value = performance.now() / 1000;
    this.renderer.render(this.scene, this.camera);
  }
}

window.LiquidRipple = LiquidRipple;
