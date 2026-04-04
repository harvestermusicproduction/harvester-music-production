document.addEventListener('DOMContentLoaded', () => {
  console.log("💎 Harvester Diamond V1.7: Engine Active");

  // --- 0. Supabase Initialization ---
  const db = window.supabase;
  if(!db) { console.error("❌ Harvester Engine: Supabase Client NOT found!"); return; }
  console.log("🚀 Harvester Engine: Supabase Mode Active");

  // --- 1. General UX (Particles & Scroll) ---
  const header = document.querySelector('header');
  if(header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    });
  }

  // --- 🪄 Intersection Observer (Content Reveal) ---
  const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  window.refreshObserver = () => {
    document.querySelectorAll('.fade-in, .reveal, .event-card, .footprint-item').forEach(el => observer.observe(el));
  };
  refreshObserver();

  function setupParticles() {
    const canvas = document.getElementById('bgParticles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 70;
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();
    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5; this.speedX = (Math.random() - 0.5) * 0.25;
        this.speedY = (Math.random() - 0.5) * 0.25; this.opacity = Math.random() * 0.4 + 0.1;
        this.twinkleDir = Math.random() > 0.5 ? 1 : -1;
      }
      update() {
        this.x += this.speedX; this.y += this.speedY; this.opacity += 0.005 * this.twinkleDir;
        if (this.opacity > 0.5) this.twinkleDir = -1; if (this.opacity < 0.1) this.twinkleDir = 1;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
      }
      draw() {
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(246, 210, 138, ${this.opacity})`; ctx.fill();
      }
    }
    for (let i = 0; i < particleCount; i++) particles.push(new Particle());
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animate);
    }
    animate();
  }
  setupParticles();

  // --- 2. Site Content Synchronization ---
  let siteConfigs = {};
  async function syncSiteContent() {
    try {
      const { data, error } = await db.from('site_config').select('*');
      if (error) throw error;
      siteConfigs = data.reduce((acc, curr) => { acc[curr.key] = curr.value; return acc; }, {});
      applyHydration();
      fetchLatestMusicForHome();
    } catch (err) { console.warn("Supabase Config Error:", err.message); }
  }

  function applyHydration() {
    const aboutContainer = document.getElementById('cfg_about_media_container');
    if (aboutContainer && siteConfigs['cfg_about_video']) {
      const videoUrl = siteConfigs['cfg_about_video'];
      const finalUrl = videoUrl + (videoUrl.includes('?') ? '&' : '?') + 't=' + Date.now();
      aboutContainer.innerHTML = `<video autoplay muted loop playsinline controls style="width:100%; height:100%; object-fit:cover; display:block; background:#000;"><source src="${finalUrl}"></video>`;
    }
    document.querySelectorAll('[id^="cfg_"]').forEach(el => {
      let key = el.id;
      if (key === 'cfg_nav_fb') key = 'cfg_social_fb';
      if (key === 'cfg_nav_ig') key = 'cfg_social_ig';
      if (key === 'cfg_nav_yt') key = 'cfg_social_yt';
      const val = siteConfigs[key];
      if(!val) return;
      if (el.tagName === 'IMG') el.src = val;
      else if (['SOURCE','VIDEO','AUDIO'].includes(el.tagName)) { el.src = val; if(el.load) el.load(); }
      else if (el.tagName === 'A') el.href = val;
      else el.innerHTML = val.replace(/\\n/g, '<br>');
    });
  }

  async function fetchLatestMusicForHome() {
    const coverEl = document.getElementById('cfg_homeSongCover');
    const titleEl = document.getElementById('cfg_homeSongTitle');
    const ytEl = document.getElementById('cfg_homeSongYT');
    const wrapper = document.getElementById('vinylWrapper');
    try {
      let { data: latest, error } = await db.from('music_works').select('*').eq('is_latest', true).limit(1).single();
      if (error || !latest) {
        const { data: fallback } = await db.from('music_works').select('*').order('created_at', { ascending: false }).limit(1).single();
        latest = fallback;
      }
      
      if(latest && wrapper){
        const coverEl = document.getElementById('cfg_homeSongCover'); // Corrected from querySelector
        const fallbackLogo = 'assets/logo.png';
        const coverImg = latest.cover_url || latest.image_url || fallbackLogo;
        
        if(coverEl) {
          coverEl.src = coverImg;
          coverEl.onerror = () => { coverEl.src = fallbackLogo; };
        }
        
        const titleEl = document.getElementById('cfg_homeSongTitle');
        const ytBtn = document.getElementById('cfg_homeSongYT');
        if(titleEl) titleEl.innerText = latest.title || '最新单曲';
        if(ytBtn) {
          const ytUrl = latest.audio_url || latest.youtube_url;
          if(ytUrl) {
            ytBtn.href = ytUrl;
            ytBtn.style.display = 'inline-block';
          } else {
            ytBtn.style.display = 'none';
          }
        }
      }
    } catch (e) {
      console.error("Home music error:", e);
    }
  }

  // --- 3. Dynamic Modules ---
  async function fetchMusic() {
    const container = document.getElementById('musicContainer');
    if(!container) return;
    try {
      const { data: docs, error } = await db.from('music_works').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      let html = "";
      docs.forEach(s => {
        const ytLink = s.audio_url || s.youtube_url; 
        const fallback = 'assets/logo.png';
        const coverImg = s.cover_url || s.image_url || fallback;

        html += `<div class="song-work-card fade-in visible">
            <div class="mini-vinyl-wrap" style="position:relative;" onmouseenter="startNotes(this)" onmouseleave="stopNotes(this)">
                <div class="mini-vinyl"><img src="${coverImg}" onerror="this.src='${fallback}'"></div>
            </div>
            <div class="song-content-area">
              <h3 class="song-card-title">${s.title || 'Untitled'}</h3>
              <p class="song-card-desc">${s.description || ''}</p>
               <div class="song-card-actions">
                ${ytLink ? `<a href="${ytLink}" target="_blank" class="btn-frosted-yt"><i class="fab fa-youtube"></i> YOUTUBE</a>` : ''}
                ${s.score_url ? `<a href="${s.score_url}" target="_blank" class="btn-frosted-score"><i class="fas fa-file-pdf"></i> 下载歌谱集</a>` : ''}
                <a href="feedback.html?id=${s.id}" class="btn-frosted-white" style="padding: 10px 15px; font-size: 0.75rem;"><i class="fas fa-bullhorn"></i> 回声 (Echo)</a>
              </div>
            </div>
          </div>`;
      });
      container.innerHTML = html;
      refreshObserver();
    } catch (err) {}
  }

  async function fetchEvents() {
    const container = document.getElementById('eventsContainer');
    if (!container) return;
    try {
      let { data: events, error } = await db.from('events').select('*').order('date', { ascending: true });
      if (error) throw error;
      
      let html = "";
      events.forEach(e => {
        const isGold = e.is_gold || false;
        const goldClass = isGold ? 'gold-theme' : '';
        const date = e.date ? new Date(e.date).toLocaleDateString('zh-CN') : '';
        const time = e.time || '08:00';
        let desc = e.description || "";
        let loc = e.location;

        // 🛡️ PARSE EXT_META (Anti-Garbage Logic)
        const metaMatch = desc.match(/EXT_META:(.*?)\|\|/);
        let murl = e.map_url;
        if (metaMatch) {
          try {
            const meta = JSON.parse(metaMatch[1]);
            desc = desc.replace(metaMatch[0], '').trim(); // Remove the meta string from display
          } catch (err) { console.warn("Meta parse error:", err); }
        }

        const locHtml = (loc && murl) 
          ? `<a href="${murl}" target="_blank" style="color:var(--gold); text-decoration:underline;"><i class="fas fa-map-marker-alt"></i> ${loc}</a>`
          : (loc ? `<span><i class="fas fa-map-marker-alt"></i> ${loc}</span>` : '');

        html += `<div class="event-card fade-in visible ${goldClass}" style="box-shadow: 0 15px 45px rgba(0,0,0,0.1);">
            <div>
              <div style="color:#666; font-size:0.75rem; letter-spacing:1px; margin-bottom:1.2rem; display:flex; flex-wrap:wrap; gap:15px;">
                <span><i class="fas fa-calendar-alt"></i> ${date || 'TBA'}</span>
                <span><i class="fas fa-clock"></i> ${time}</span>
                ${locHtml}
              </div>
              <h3 style="color:#111; font-size:1.6rem; font-family: var(--font-display); margin-bottom: 0.8rem;">${e.title}</h3>
              <p style="color:#444; line-height:1.7; font-size:0.9rem;">${desc}</p>
            </div>
            <button class="btn-score-premium" style="width:100%; margin-top:20px;" onclick="openReminderModal('${e.id}', '${e.title}')"><i class="fas fa-bell"></i> 我要参与 提醒我</button>
          </div>`;
      });
      container.innerHTML = html;
      refreshObserver();
    } catch (err) {}
  }

  async function fetchDiary() {
    const container = document.getElementById('diaryContainer');
    if (!container) return;
    try {
      const { data: albums } = await db.from('diary_albums').select('*, diary_media(media_url)').order('date', { ascending: false });
      container.innerHTML = albums.map(d => {
        const photos = (d.diary_media || []).slice(0, 3).map((m, idx) => 
          `<img src="${m.media_url}" class="peek-photo peek-${idx+1}">`
        ).join('');
        return `
          <div class="folder-card fade-in visible" onclick="location.href='event.html?id=${d.id}'">
            <div class="folder-main">
              ${photos}
              <img src="${d.cover_url || (d.diary_media[0]?d.diary_media[0].media_url:'')}" class="folder-cover">
              <div class="folder-info">
                <p class="folder-date">${d.date}</p>
                <h3 class="folder-title">${d.title}</h3>
              </div>
            </div>
          </div>`;
      }).join('');
      refreshObserver();
    } catch (e) {}
  }
  async function fetchFootprints() {
    const container = document.getElementById('footprintsContainer');
    if (!container) return;
    try {
      const { data: albums } = await db.from('diary_albums').select('*').order('date', { ascending: false });
      const fallback = 'assets/logo.png';
      container.innerHTML = albums.map(d => {
        const coverImg = d.cover_url || fallback;
        return `
          <div class="footprint-item fade-in visible" onclick="location.href='event.html?id=${d.id}'">
            <img src="${coverImg}" onerror="this.src='${fallback}'" class="footprint-img">
            <div class="footprint-overlay" style="background:rgba(255,255,255,0.05); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px);">
              <h4 style="color:#fff; font-family:'Ma Shan Zheng', cursive; font-size:1.4rem;">${d.title}</h4>
              <p style="color:rgba(255,255,255,0.8); font-size:0.85rem;">${d.date}</p>
            </div>
          </div>`;
      }).join('');
      refreshObserver();
    } catch (e) {
      console.error("Footprints fetch error:", e);
    }
  }

  function spawnSingleNote(element) {
    const symbols = ['♪', '♫', '♬', '♩'];
    const note = document.createElement('span');
    note.className = 'note-particle';
    note.innerText = symbols[Math.floor(Math.random() * symbols.length)];
    
    // Random trajectory
    const dx = (Math.random() * 80 - 40); // -40 to 40 px
    const rot = (Math.random() * 60 - 30); // -30 to 30 deg
    
    note.style.setProperty('--dx', `${dx}px`);
    note.style.setProperty('--rot', `${rot}deg`);
    note.style.left = `50%`;
    note.style.top = `50%`;
    
    element.appendChild(note);
    setTimeout(() => note.remove(), 2500);
  }

  window.startNotes = (el) => {
    if (el._noteTimer) clearInterval(el._noteTimer);
    spawnSingleNote(el); // Immediate first note
    el._noteTimer = setInterval(() => spawnSingleNote(el), 350);
  };

  window.stopNotes = (el) => {
    clearInterval(el._noteTimer);
  };

  window.openReminderModal = (id, title) => {
    let m = document.getElementById('reminderModal');
    if(!m){
      m=document.createElement('div'); m.id='reminderModal'; m.className='reminder-modal';
      m.innerHTML=`<div class="reminder-content" style="background:rgba(255,255,255,0.9); backdrop-filter:blur(35px); -webkit-backdrop-filter:blur(35px); border:1px solid rgba(255,255,255,0.5); border-radius:40px; padding:2.5rem; box-shadow:0 40px 80px rgba(0,0,0,0.2); text-align:center;">
         <h2 style="color:#222; font-family:'Ma Shan Zheng', cursive; font-size:2.4rem; margin-bottom:1rem; letter-spacing:2px;">活动参与</h2>
         <p id="rem_t" style="color:#555; margin-bottom:1.5rem; letter-spacing:2px; font-size:0.95rem;"></p>
         <input type="email" id="rem_email" placeholder="输入您的邮箱地址..." style="width:100%; margin-bottom:1.8rem; padding:16px; border-radius:50px; background:rgba(0,0,0,0.05); border:1px solid rgba(0,0,0,0.1); color:#222; outline:none; text-align:center;">
         <input type="hidden" id="rem_id">
         <div style="display:flex; gap:15px;">
           <button class="btn btn-submit" style="flex:2; border-radius:50px; background:var(--gold); color:#000; font-weight:bold; border:none; padding:16px;" onclick="submitReminder()">🔔 提醒我</button>
           <button class="frosted-glass-white" style="flex:1; border-radius:50px; padding:16px; font-size:0.9rem; background:rgba(0,0,0,0.05);" onclick="document.getElementById('reminderModal').classList.remove('active')">取消</button>
         </div>
      </div>`;
      document.body.appendChild(m);
    }
    if(document.getElementById('rem_t')) document.getElementById('rem_t').innerText=`我要参与《${title}》`;
    if(document.getElementById('rem_id')) document.getElementById('rem_id').value=id; 
    m.classList.add('active');
  };

  window.submitReminder = async () => {
    const id=document.getElementById('rem_id').value; const email=document.getElementById('rem_email').value;
    if(!email) return alert("请输入邮箱");
    const { error } = await db.from('submissions').insert([{ type: 'event_reminder', content: `Email: ${email} | EventID: ${id}` }]);
    alert("✅ 提醒设置成功！哈麦音乐届时将通知您。"); document.getElementById('reminderModal').classList.remove('active');
  };

  syncSiteContent();
  fetchMusic();
  fetchEvents();
  fetchDiary();
  fetchFootprints();
});
