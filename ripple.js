/**
 * Ripple Simulation Kernel (GPGPU)
 * Based on the Wave Equation: h(t+1) = (2 * h(t) - h(t-1) + laplacian(h(t))) * damping
 */

const RIPPLE_SHADERS = {
  vertex: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // The actual physics calculation
  simulation: `
    uniform sampler2D tPrev;   // Previous height-field (h(t-1))
    uniform sampler2D tCurrent; // Current height-field (h(t))
    uniform vec2 delta;        // 1.0 / resolution
    uniform float damping;     // 0.95 - 0.99
    varying vec2 vUv;

    void main() {
      // Laplacian approximation using 4 neighbors
      float h = texture2D(tCurrent, vUv).r;
      float prevH = texture2D(tPrev, vUv).r;
      
      float left  = texture2D(tCurrent, vUv + vec2(-delta.x, 0.0)).r;
      float right = texture2D(tCurrent, vUv + vec2(delta.x, 0.0)).r;
      float top   = texture2D(tCurrent, vUv + vec2(0.0, delta.y)).r;
      float bottom = texture2D(tCurrent, vUv + vec2(0.0, -delta.y)).r;

      // New height calculation
      float newH = (left + right + top + bottom) * 0.5 - prevH;
      newH *= damping;

      gl_FragColor = vec4(newH, h, 0.0, 1.0);
    }
  `,
  // Adding ripples into the current state
  interaction: `
    uniform sampler2D tCurrent;
    uniform vec2 mouse;      // UV mouse coordinates
    uniform float strength;   // Height of the ripple
    uniform float radius;     // Size of the ripple
    varying vec2 vUv;

    void main() {
      float h = texture2D(tCurrent, vUv).r;
      float dist = distance(vUv, mouse);
      
      if (dist < radius) {
        // Gaussian brush for smooth ripples
        float intensity = 1.0 - smoothstep(0.0, radius, dist);
        h += intensity * strength;
      }
      
      gl_FragColor = vec4(h, texture2D(tCurrent, vUv).g, 0.0, 1.0);
    }
  `
};

window.RIPPLE_SHADERS = RIPPLE_SHADERS;
