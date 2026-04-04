/**
 * Water Material Shader
 * Computes normals from heightmap and applies lighting models.
 */

const WATER_SHADERS = {
  vertex: `
    varying vec2 vUv;
    varying vec3 vViewPosition;

    void main() {
      vUv = uv;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragment: `
    uniform sampler2D tHeight;    // From Ripple Simulation (h in .r)
    uniform sampler2D tBackground; // The original bg texture for refraction
    uniform vec2 delta;           // 1.0 / resolution
    uniform vec3 lightPosition;   // For specular highlights
    uniform vec3 edgeColor;       // Color of the liquid base
    uniform float iTime;           // For subtle movement
    varying vec2 vUv;
    varying vec3 vViewPosition;

    void main() {
      // 1. Compute Normals from heightmap (Sobel-like)
      float hL = texture2D(tHeight, vUv + vec2(-delta.x, 0.0)).r;
      float hR = texture2D(tHeight, vUv + vec2(delta.x, 0.0)).r;
      float hT = texture2D(tHeight, vUv + vec2(0.0, delta.y)).r;
      float hB = texture2D(tHeight, vUv + vec2(0.0, -delta.y)).r;

      // Strength of the "bumpiness"
      float bump = 5.0;
      vec3 normal = normalize(vec3((hL - hR) * bump, (hB - hT) * bump, 1.0));

      // 2. Refraction (Distort UVs based on normal)
      float refractionStrength = 0.05;
      vec2 refractedUv = vUv + normal.xy * refractionStrength;
      vec3 bg = texture2D(tBackground, refractedUv).rgb;

      // 3. Specular Highlights
      vec3 viewDir = normalize(vViewPosition);
      vec3 lightDir = normalize(lightPosition);
      vec3 halfwayDir = normalize(lightDir + viewDir);
      float spec = pow(max(dot(normal, halfwayDir), 0.0), 32.0);
      vec3 specular = vec3(0.96, 0.82, 0.54) * spec * 0.8; // Gold highlights

      // 4. Reflection (Simple color tint + Fresnel-like)
      float fresnel = 1.0 - max(dot(normal, vec3(0.0, 0.0, 1.0)), 0.0);
      fresnel = pow(fresnel, 5.0); // Focus reflection on edges
      vec3 reflectionColor = vec3(0.1, 0.1, 0.1) * fresnel;

      // Final Color Composition
      vec3 finalColor = bg + reflectionColor + specular;
      
      // Depth Tint (Slight blue/black)
      finalColor = mix(finalColor, edgeColor, clamp(fresnel * 0.5, 0.0, 1.0));

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};

window.WATER_SHADERS = WATER_SHADERS;
