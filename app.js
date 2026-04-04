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
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
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
    const audioEl = document.getElementById('homeAudioControls');
    if (!coverEl) return;
    try {
      const { data, error } = await db.from('music_works').select('*').order('created_at', { ascending: false }).limit(1).single();
      if (!error && data) {
        coverEl.src = data.cover_url;
        if (audioEl && data.audio_url) { audioEl.src = data.audio_url; audioEl.load(); }
      }
    } catch (e) {}
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
        // Use 'audio_url' as the YouTube link per admin backend mapping
        const ytLink = s.audio_url || s.youtube_url; 
        html += `<div class="song-work-card fade-in visible">
            <div class="mini-vinyl-wrap" style="position:relative;" onmouseenter="triggerNotes(this)">
              <div class="mini-vinyl"><img src="${s.cover_url}" onerror="this.src='assets/logo.png'"><div class="vinyl-play-overlay">🎶</div></div>
            </div>
            <div class="song-content-area">
              <h3 class="song-card-title">${s.title || 'Untitled'}</h3>
              <p class="song-card-desc">${s.description || ''}</p>
              <div class="song-card-actions">
                ${ytLink ? `<a href="${ytLink}" target="_blank" class="btn-youtube-premium"><i class="fab fa-youtube"></i> WATCH ON YOUTUBE</a>` : ''}
                ${s.score_url ? `<a href="${s.score_url}" target="_blank" class="btn-dl-score"><i class="fas fa-file-pdf"></i> DOWNLOAD SCORE</a>` : ''}
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
      const { data: rawEvents, error } = await db.from('events').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      let html = "";
      rawEvents.forEach(e => {
        let desc = e.description || "";
        let date = e.event_date;
        let time = e.event_time;
        let loc = e.location;

        // 🛡️ PARSE EXT_META (Anti-Garbage Logic)
        const metaMatch = desc.match(/EXT_META:(.*?)\|\|/);
        let murl = e.map_url;
        if (metaMatch) {
          try {
            const meta = JSON.parse(metaMatch[1]);
            date = meta.d || date;
            time = meta.tm || time;
            loc = meta.loc || loc;
            murl = meta.murl || murl;
            desc = desc.replace(metaMatch[0], '').trim(); // Remove the meta string from display
          } catch (err) { console.warn("Meta parse error:", err); }
        }

        const locHtml = (loc && murl) 
          ? `<a href="${murl}" target="_blank" style="color:var(--gold); text-decoration:underline;"><i class="fas fa-map-marker-alt"></i> ${loc}</a>`
          : (loc ? `<span><i class="fas fa-map-marker-alt"></i> ${loc}</span>` : '');

        html += `<div class="event-card fade-in visible" style="background:rgba(255,255,255,0.02); backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,0.05); padding:2.5rem; border-radius:24px; border-left:2px solid var(--gold); min-height:250px; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="color:var(--gold); font-size:0.8rem; letter-spacing:1px; margin-bottom:1.2rem; display:flex; flex-wrap:wrap; gap:15px;">
                <span><i class="fas fa-calendar-alt"></i> ${date || 'TBA'}</span>
                <span><i class="fas fa-clock"></i> ${time || '-'}</span>
                ${locHtml}
              </div>
              <h3 style="color:#fff; font-size:1.6rem; font-family:'Ma Shan Zheng', cursive;">${e.title}</h3>
              <p style="color:#ccc; line-height:1.8;">${desc}</p>
            </div>
            <button class="btn-score-premium" style="width:100%; border-radius:60px; padding:12px; margin-top:20px;" onclick="openReminderModal('${e.id}', '${e.title}')"><i class="fas fa-bell"></i> 提醒我 RECEIVE REMINDER</button>
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
      container.innerHTML = albums.map(d => `<div class="folder-card fade-in visible" onclick="location.href='event.html?id=${d.id}'"><div class="folder-main"><img src="${d.cover_url || (d.diary_media[0]?d.diary_media[0].media_url:'')}" class="folder-cover"><div class="folder-info"><p class="folder-date">${d.date}</p><h3 class="folder-title">${d.title}</h3></div></div></div>`).join('');
      refreshObserver();
    } catch (e) {}
  }

  function spawnMusicalNotes(element) {
    const symbols = ['♪', '♫', '♬', '♩'];
    const rect = element.getBoundingClientRect();
    for (let i = 0; i < 5; i++) {
      const note = document.createElement('span');
      note.className = 'floating-note';
      note.innerText = symbols[Math.floor(Math.random() * symbols.length)];
      const angle = Math.random() * Math.PI * 2;
      const dist = 50 + Math.random() * 50;
      note.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
      note.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
      note.style.left = `50%`; note.style.top = `50%`;
      element.appendChild(note);
      setTimeout(() => note.remove(), 2000);
    }
  }

  window.triggerNotes = (el) => spawnMusicalNotes(el);

  window.openReminderModal = (id, title) => {
    let m = document.getElementById('reminderModal');
    if(!m){
      m=document.createElement('div'); m.id='reminderModal'; m.className='reminder-modal';
      m.innerHTML=`<div class="reminder-content"><h2 style="color:var(--gold);">活动提醒</h2><p id="rem_t"></p><input type="email" id="rem_email" placeholder="your@email.com" style="width:100%; margin:1rem 0;"><input type="hidden" id="rem_id"><div style="display:flex; gap:10px;"><button class="btn btn-submit" style="flex:2;" onclick="submitReminder()">🔔 立即订阅</button><button class="btn-tiny" onclick="document.getElementById('reminderModal').remove()">取消</button></div></div>`;
      document.body.appendChild(m);
    }
    document.getElementById('rem_t').innerText=`订阅《${title}》`;
    document.getElementById('rem_id').value=id; m.classList.add('active');
  };

  window.submitReminder = async () => {
    const id=document.getElementById('rem_id').value; const email=document.getElementById('rem_email').value;
    if(!email) return alert("请输入邮箱");
    const { error } = await db.from('submissions').insert([{ type: 'event_reminder', content: `Email: ${email} | EventID: ${id}` }]);
    alert("✅ 订阅成功！"); document.getElementById('reminderModal').remove();
  };

  syncSiteContent();
  fetchMusic();
  fetchEvents();
  fetchDiary();
});
