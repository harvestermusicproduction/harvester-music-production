/**
 * Harvester Music - Physical Modeling Harp Visualizer
 * Sound Design: Resonant 'Ding-Ding' Harp (Sine Pluck + Triangle Body)
 * Interaction: Zero-Friction Hover + Exponential Resonance
 */

class InfinityVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        this.particles = [];
        this.notes = ['♪', '♫', '♬', '♩'];
        
        this.mouse = { x: -1000, y: -1000, active: false };
        this.audio = { analyser: null, data: null, intensity: 0, ctx: null };
        this.isRunning = false;
        
        // C-Major Pentatonic Scale (The Harp Key)
        this.scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00, 1046.50]; 
        this.activeVoices = 0;
        this.MAX_VOICES = 24; // Harp allows more overlap for 'Strumming' feel
        
        this.baseA = 0;
        this.hue = 38; // Gold
        
        this.init();
        this.setupEventListeners();
    }

    init() {
        this.resize();
        this.createParticles();
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        window.addEventListener('touchstart', (e) => {
            this.mouse.active = true;
            this.mouse.x = e.touches[0].clientX;
            this.mouse.y = e.touches[0].clientY;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.baseA = Math.min(this.canvas.width, this.canvas.height) * 0.35;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < 220; i++) {
            this.particles.push({
                t: Math.random() * Math.PI * 2,
                speed: 0.001 + Math.random() * 0.003,
                size: 9 + Math.random() * 14,
                char: this.notes[Math.floor(Math.random() * this.notes.length)],
                alpha: 0.15 + Math.random() * 0.3,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.02,
                vx: 0, vy: 0, dx: 0, dy: 0,
                isColliding: false,
                lastCollision: 0,
                impactGlow: 0
            });
        }
    }

    setAudioSource(analyser, audioCtx) {
        this.audio.analyser = analyser;
        this.audio.ctx = audioCtx;
        if (this.audio.analyser) {
            this.audio.analyser.fftSize = 512;
            this.audio.data = new Uint8Array(this.audio.analyser.frequencyBinCount);
        }
    }

    /**
     * PHYSICAL HARP SYNTHESIZER
     * Pluck (Ping) + Body (Resonance)
     */
    playTone(y, force) {
        if (!this.audio.ctx || this.audio.ctx.state !== 'running' || this.activeVoices >= this.MAX_VOICES) return;
        
        const now = this.audio.ctx.currentTime;
        this.activeVoices++;

        // 1. Frequency Mapping
        const scaleIndex = Math.floor((1 - (y / this.canvas.height)) * this.scale.length);
        const freq = this.scale[Math.max(0, Math.min(scaleIndex, this.scale.length - 1))];

        // --- LAYER 1: THE PLUCK (Sharp 'Ding') ---
        const oscPluck = this.audio.ctx.createOscillator();
        const gainPluck = this.audio.ctx.createGain();
        oscPluck.type = 'sine';
        oscPluck.frequency.setValueAtTime(freq * 1.01, now); // Micro-detune
        gainPluck.gain.setValueAtTime(0, now);
        gainPluck.gain.linearRampToValueAtTime(0.5 * force, now + 0.004);
        gainPluck.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

        // --- LAYER 2: THE BODY (Harp Resonance) ---
        const oscBody = this.audio.ctx.createOscillator();
        const gainBody = this.audio.ctx.createGain();
        const filter = this.audio.ctx.createBiquadFilter();
        oscBody.type = 'triangle';
        oscBody.frequency.setValueAtTime(freq, now);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now); // Warm resonance
        gainBody.gain.setValueAtTime(0, now);
        gainBody.gain.linearRampToValueAtTime(0.3 * force, now + 0.02);
        gainBody.gain.exponentialRampToValueAtTime(0.001, now + 1.2); // Natural ring

        // --- CONNECTIONS ---
        oscPluck.connect(gainPluck);
        gainPluck.connect(this.audio.ctx.destination);
        
        oscBody.connect(filter);
        filter.connect(gainBody);
        gainBody.connect(this.audio.ctx.destination);

        oscPluck.start(now);
        oscBody.start(now);
        oscPluck.stop(now + 0.1);
        oscBody.stop(now + 1.5);
        
        setTimeout(() => this.activeVoices--, 1500);
    }

    update() {
        if (this.audio.analyser) {
            this.audio.analyser.getByteFrequencyData(this.audio.data);
            const avg = this.audio.data.reduce((a, b) => a + b) / this.audio.data.length;
            this.audio.intensity = avg / 255;
        }

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const dynA = this.baseA * (1 + this.audio.intensity * 0.12);
        const activeCount = Math.min(this.particles.length, Math.floor(80 + (this.audio.intensity * 140)));

        for (let i = 0; i < activeCount; i++) {
            const p = this.particles[i];
            
            p.t += p.speed * (1 + this.audio.intensity * 2.5);
            if (p.t > Math.PI * 2) p.t -= Math.PI * 2;

            const sinT = Math.sin(p.t);
            const cosT = Math.cos(p.t);
            const den = 1 + sinT * sinT;
            const targetX = centerX + (dynA * cosT) / den;
            const targetY = centerY + (dynA * sinT * cosT) / den;

            const distMouse = Math.hypot(this.mouse.x - targetX, this.mouse.y - targetY);
            let stretch = 1;
            const threshold = 220;

            if (this.mouse.active && distMouse < threshold) {
                const force = (threshold - distMouse) / threshold;
                
                // Physical Pluck Trigger
                if (!p.isColliding && Date.now() - p.lastCollision > 150) { 
                    this.playTone(targetY, force);
                    p.lastCollision = Date.now();
                    p.impactGlow = 1.0;
                }
                p.isColliding = true;
                
                const angle = Math.atan2(targetY - this.mouse.y, targetX - this.mouse.x);
                p.dx = targetX + Math.cos(angle) * force * 100;
                p.dy = targetY + Math.sin(angle) * force * 100;
                stretch = 1 + force * 2.5;
            } else {
                p.isColliding = false;
                p.dx = targetX;
                p.dy = targetY;
            }

            p.rotation += p.rotSpeed * (1 + this.audio.intensity * 5);
            p.currentStretch = stretch;
            p.impactGlow *= 0.92;
        }
    }

    draw() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const activeCount = Math.min(this.particles.length, Math.floor(80 + (this.audio.intensity * 140)));
        this.ctx.font = '20px serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        for (let i = 0; i < activeCount; i++) {
            const p = this.particles[i];
            this.ctx.save();
            this.ctx.translate(p.dx, p.dy);
            this.ctx.rotate(p.rotation);
            this.ctx.scale(p.currentStretch, 1 / p.currentStretch);

            const brightness = 50 + (this.audio.intensity * 40) + (p.impactGlow * 40);
            const alpha = (p.alpha + this.audio.intensity * 0.4) * (p.isColliding ? 1.8 : 1);
            
            this.ctx.fillStyle = `hsla(${this.hue}, 80%, ${brightness}%, ${alpha})`;
            if (this.audio.intensity > 0.3 || p.impactGlow > 0.1) {
                this.ctx.shadowBlur = p.impactGlow > 0.1 ? 30 : 15;
                this.ctx.shadowColor = p.impactGlow > 0.1 ? '#fff' : 'rgba(246, 210, 138, 0.8)';
            }
            this.ctx.fillText(p.char, 0, 0);
            this.ctx.restore();
        }
    }

    animate() {
        if (!this.isRunning) return;
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }

    start() {
        this.isRunning = true;
        this.animate();
    }
}

window.InfinityVisualizer = InfinityVisualizer;
