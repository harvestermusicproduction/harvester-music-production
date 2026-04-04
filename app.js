document.addEventListener('DOMContentLoaded', () => {
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

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
  
  // Dynamic observer helper
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
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.25;
        this.speedY = (Math.random() - 0.5) * 0.25;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.twinkleDir = Math.random() > 0.5 ? 1 : -1;
      }
      update() {
        this.x += this.speedX; this.y += this.speedY;
        this.opacity += 0.005 * this.twinkleDir;
        if (this.opacity > 0.5) this.twinkleDir = -1;
        if (this.opacity < 0.1) this.twinkleDir = 1;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.shadowBlur = this.size * 2;
        ctx.shadowColor = 'rgba(246, 210, 138, 0.5)';
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(246, 210, 138, ${this.opacity})`;
        ctx.fill();
        ctx.shadowBlur = 0;
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
      
      siteConfigs = data.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});
      
      applyHydration();
      fetchLatestMusicForHome();
    } catch (err) {
      console.warn("Supabase Config Error:", err.message);
    }
  }

  function applyHydration() {
    const aboutContainer = document.getElementById('cfg_about_media_container');
    if (aboutContainer) {
      const videoUrl = siteConfigs['cfg_about_video'];
      const bannerUrl = siteConfigs['cfg_about_banner'];
      
      if (videoUrl && videoUrl.trim() !== '') {
        // Higher Priority: Brand Video (Autoplay + Controls)
        // Add cache busting timestamp to ensure fresh load
        const finalUrl = videoUrl + (videoUrl.includes('?') ? '&' : '?') + 't=' + Date.now();
        aboutContainer.innerHTML = `
          <video id="aboutVideoHero" autoplay muted loop playsinline controls preload="auto" 
                 style="width: 100%; height: 100%; object-fit: cover; display: block; background: #000;">
            <source src="${finalUrl}">
            Your browser does not support the video tag.
          </video>`;
        const v = document.getElementById('aboutVideoHero');
        if (v) {
          v.load();
          v.play().catch(e => console.warn("Video play blocked:", e));
        }
      } else if (bannerUrl && bannerUrl.trim() !== '') {
        // Fallback: Legacy Banner Image
        aboutContainer.innerHTML = `<img src="${bannerUrl}" style="width: 100%; height: 100%; object-fit: cover; display: block;">`;
      }
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
      else if (el.id !== 'cfg_about_media_container') el.innerHTML = val.replace(/\\n/g, '<br>');
    });
  }

  async function fetchLatestMusicForHome() {
    const coverEl = document.getElementById('cfg_homeSongCover');
    const audioEl = document.getElementById('homeAudioControls');
    if (!coverEl) return;
    
    // Default "Warm Accompaniment" Fallback (Acoustic Piano Worship)
    const DEFAULT_AUDIO = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"; // Placeholder "Warm" track
    const DEFAULT_COVER = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80";

    try {
      const { data, error } = await db.from('music_works').select('*').order('created_at', { ascending: false }).limit(1).single();
      
      if (error || !data) {
        // Apply warm accompaniment if DB is empty
        coverEl.src = DEFAULT_COVER;
        if (audioEl) {
          audioEl.src = DEFAULT_AUDIO;
          audioEl.load();
        }
        return;
      }

      coverEl.src = data.cover_url || DEFAULT_COVER;
      if (audioEl && data.audio_url) {
        audioEl.src = data.audio_url;
        audioEl.load();
      }
    } catch (e) { 
      console.warn("Latest Music Fetch Fail, Using Warm Fallback:", e); 
      if (audioEl) { audioEl.src = DEFAULT_AUDIO; audioEl.load(); }
    }
  }

  // --- 3. Dynamic Modules ---
  async function fetchMusic() {
    const container = document.getElementById('musicContainer');
    if(!container) return;
    try {
      const { data: docs, error } = await db.from('music_works').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (!docs || docs.length === 0) {
        container.innerHTML = `<div style='text-align:center; opacity:0.5; padding:5rem;'><p>数据库中暂无歌曲数据。</p></div>`;
        return;
      }
      let html = "";
      docs.forEach(s => {
        html += `
          <div class="song-work-card fade-in visible">
            <div class="mini-vinyl-wrap" style="position:relative;" onmouseenter="triggerNotes(this)">
              <div class="mini-vinyl">
                <img src="${(s.cover_url && s.cover_url.startsWith('http')) ? s.cover_url : 'https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&w=400&q=80'}" 
                     onerror="this.src='https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80'">
                <div class="vinyl-play-overlay">🎶</div>
              </div>
            </div>
            <div class="song-content-area">
              <h3 class="song-card-title">${s.title || 'Untitled'}</h3>
              <p class="song-card-desc">${s.description || ''}</p>
              <div class="song-card-actions">
                ${s.audio_url ? `<a href="${s.audio_url}" target="_blank" rel="noopener" class="btn-youtube-premium" onclick="trackMusicAction('${s.id}', 'listen')"><i class="fab fa-youtube"></i> YOUTUBE</a>` : ''}
                ${s.score_url ? `<a href="${s.score_url}" target="_blank" class="btn-score-premium" download onclick="trackMusicAction('${s.id}', 'download')"><i class="far fa-file-pdf"></i> 下载歌谱</a>` : ''}
              </div>
            </div>
          </div>`;
      });
      container.innerHTML = html;
    } catch (err) { console.error("🔥 Music Load Error:", err); }
  }

  async function fetchEvents() {
    const container = document.getElementById('eventsContainer');
    if (!container) return;
    try {
      // 1. Fetch data from Supabase
      const { data: rawEvents, error } = await db.from('events').select('*');
      
      if (error) {
        console.error("Supabase Error:", error);
        container.innerHTML = `<p style="grid-column:1/-1; text-align:center; opacity:0.6;">⚠️ 活动加载受限 (Status: ${error.code})。内容更新中...</p>`;
        return;
      }

      if (!rawEvents || rawEvents.length === 0) {
        container.innerHTML = "<p style='grid-column:1/-1; text-align:center; opacity:0.5; padding:5rem;'>暂无最新活动，敬请关注！</p>";
        return;
      }

      // 2. Map and parse (safe version)
      const data = rawEvents.map(e => {
        let desc = e.description || "";
        const metaMatch = desc.match(/EXT_META:(.*?)\|\|/);
        if (metaMatch) {
          try {
            const meta = JSON.parse(metaMatch[1]);
            return {
              ...e,
              event_date: meta.d || e.event_date,
              event_time: meta.tm || e.event_time,
              image_url: meta.img || e.image_url,
              description: desc.replace(metaMatch[0], '').trim()
            };
          } catch (err) { }
        }
        return e;
      });
      
      // 3. Sort by date
      data.sort((a, b) => (b.event_date || '').localeCompare(a.event_date || ''));

      let html = "";
      data.forEach(e => {
        const poster = e.image_url || 'https://via.placeholder.com/600x800?text=Event';
        html += `
          <div class="event-card fade-in visible">
            <div class="event-poster-wrap" style="aspect-ratio:1/1;">
              <img src="${poster}" class="event-poster" alt="${e.title}" onerror="this.src='https://via.placeholder.com/600x800?text=Event'">
            </div>
            <div class="event-info" style="padding:1rem;">
              <div class="event-meta" style="font-size:0.75rem; color:var(--gold); margin-bottom:8px;">
                <span><i class="fas fa-calendar-day"></i> ${e.event_date || 'TBD'}</span>
              </div>
              <h4 class="event-title" style="font-size:1rem; margin:0 0 10px 0; color:#fff;">${e.title}</h4>
              <div class="event-actions">
                <button class="btn-premium" style="width:100%; font-size:0.7rem; padding:10px;" onclick="openReminderModal('${e.id}', '${e.title}')">
                   提醒我
                </button>
              </div>
            </div>
          </div>
        `;
      });
      container.innerHTML = html;
      if(window.refreshObserver) window.refreshObserver();
      fetchFootprints(); 
    } catch (err) { 
      console.error("🔥 System Error:", err); 
      container.innerHTML = `<p style="grid-column:1/-1; text-align:center; opacity:0.5;">内容同步中...</p>`;
    }
  }

  async function fetchFootprints() {
    const container = document.getElementById('footprintsContainer');
    if (!container) return;
    try {
      const { data, error } = await db.from('footprints').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (!data || data.length === 0) {
        container.innerHTML = "<p style='grid-column:1/-1; text-align:center; opacity:0.5; padding:3rem;'>暂无收割足迹点滴。</p>";
        return;
      }
      container.innerHTML = data.map(f => `
        <div class="footprint-item fade-in">
          <img src="${f.image_url}" class="footprint-img" alt="Footprint">
          <div class="footprint-overlay">
            <p class="footprint-desc">${f.description || '美好足迹，恩典回顾。'}</p>
          </div>
        </div>
      `).join('');
      refreshObserver();
    } catch (err) { 
      console.error("🔥 Footprints Load Error:", err);
      container.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:#ff4444; opacity:0.8;">⚠️ 足迹加载失败: ${err.message || '请检查数据库连接'}</p>`;
    }
  }

  // --- 🎶 Musical Note Particle System (Premium V2) ---
  function spawnMusicalNotes(element) {
    const symbols = ['♪', '♫', '♬', '♩', '🎶', '🎼'];
    const colors = ['var(--gold)', '#ffffff', '#ff4444', '#f6d28a'];
    const count = 6 + Math.floor(Math.random() * 4); // Slightly more notes
    const rect = element.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    for (let i = 0; i < count; i++) {
      const note = document.createElement('span');
      note.className = 'floating-note';
      note.innerText = symbols[Math.floor(Math.random() * symbols.length)];
      
      const color = colors[Math.floor(Math.random() * colors.length)];
      note.style.color = color;
      note.style.filter = `drop-shadow(0 0 8px ${color})`;
      
      // Random vectors for a natural "burst"
      const angle = (Math.random() * Math.PI * 2);
      const dist = 60 + Math.random() * 80;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      const dx2 = Math.cos(angle) * (dist + 150);
      const dy2 = Math.sin(angle) * (dist + 150);
      const rot = (Math.random() - 0.5) * 360;

      note.style.setProperty('--dx', `${dx}px`);
      note.style.setProperty('--dy', `${dy}px`);
      note.style.setProperty('--dx2', `${dx2}px`);
      note.style.setProperty('--dy2', `${dy2}px`);
      note.style.setProperty('--rot', `${rot}deg`);
      
      note.style.left = `${centerX}px`;
      note.style.top = `${centerY}px`;
      
      element.appendChild(note);
      setTimeout(() => note.remove(), 2000);
    }
  }

  window.triggerNotes = (el) => {
    spawnMusicalNotes(el);
  };

  // --- 🔔 REMINDER SYSTEM ---
  window.openReminderModal = (id, title) => {
    let modal = document.getElementById('reminderModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'reminderModal';
      modal.className = 'reminder-modal';
      modal.innerHTML = `
        <div class="reminder-content">
          <h2 style="color:var(--gold); margin-bottom:1rem;">活动提醒</h2>
          <p id="rem_t" style="color:#fff; margin-bottom:1.5rem;"></p>
          <p style="color:#888; font-size:0.85rem; margin-bottom:1.5rem;">我们将在活动前一天向您发送提醒。请输入您的邮箱：</p>
          <input type="email" id="rem_email" placeholder="your@email.com" style="width:100%; margin-bottom:1.5rem; text-align:center;">
          <input type="hidden" id="rem_id">
          <div style="display:flex; gap:10px;">
            <button class="btn btn-submit" style="flex:2;" onclick="submitReminder()">🔔 立即订阅</button>
            <button class="btn-tiny" style="flex:1;" onclick="document.getElementById('reminderModal').remove()">取消</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }
    document.getElementById('rem_t').innerText = `订阅《${title}》`;
    document.getElementById('rem_id').value = id;
    modal.classList.add('active');
  };

  window.closeReminderModal = () => {
    document.getElementById('reminderModal').classList.remove('active');
  };

  window.submitReminder = async () => {
    const id = document.getElementById('rem_id').value;
    const email = document.getElementById('rem_email').value;
    if (!email) return alert("请输入有效邮箱");

    const btn = event.target;
    btn.innerText = "订阅中...";
    try {
      // Logic: Save to a subscriptions table or falls back to submissions
      const { error } = await db.from('event_subscriptions').insert([{ event_id: id, email: email }]);
      if (error) {
         // Fallback to submissions table if subscriptions doesn't exist
         await db.from('submissions').insert([{ type: 'event_reminder', content: `Email: ${email} | EventID: ${id}` }]);
      }
      alert("✅ 订阅成功！我们将在活动前一天通知您。");
      closeReminderModal();
    } catch (err) {
      console.warn("Subscription fail:", err);
      alert("抱歉，由于网络原因订阅失败。");
    } finally {
      btn.innerText = "确认订阅";
    }
  };

  async function fetchDiary() {
    const container = document.getElementById('diaryContainer');
    if (!container) return;
    try {
      // Fetch albums and include their related media for peeking
      const { data: albums, error } = await db.from('diary_albums').select(`
        *,
        diary_media (media_url)
      `).order('date', { ascending: false });
      
      if (error) throw error;
      if (!albums || albums.length === 0) {
        container.innerHTML = "<p style='grid-column:1/-1; text-align:center; opacity:0.5; padding:5rem;'>暂时没有日记记录。</p>";
        return;
      }

      let html = "";
      albums.forEach(d => {
        // Prepare Peek Photos (up to 3)
        const peekMedia = d.diary_media ? d.diary_media.slice(0, 3) : [];
        const peekHtml = peekMedia.map((m, i) => `
          <img src="${m.media_url}" class="peek-photo" style="z-index:${10-i}">
        `).join('');

        const cover = d.cover_url || (peekMedia[0] ? peekMedia[0].media_url : 'https://via.placeholder.com/600x400?text=Harvester+Diary');

        html += `
          <div class="folder-card fade-in visible" onclick="location.href='event.html?id=${d.id}'">
            ${peekHtml}
            <div class="folder-main">
              <img src="${cover}" class="folder-cover" alt="${d.title}" onerror="this.src='https://via.placeholder.com/600x400?text=Diary'">
              <span class="folder-count">${d.diary_media ? d.diary_media.length : 0} Photos</span>
              <div class="folder-info">
                <p class="folder-date">${d.date || 'Record Date'}</p>
                <h3 class="folder-title">${d.title || 'Untitled Moment'}</h3>
              </div>
            </div>
          </div>
        `;
      });
      container.innerHTML = html;
      refreshObserver();
    } catch (err) { 
      console.error("Diary Fetch Error:", err); 
      container.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:#ff4444; opacity:0.8;">⚠️ 日记加载失败: ${err.message}</p>`;
    }
  }

  async function initGallery() {
    const container = document.getElementById('galleryContainer');
    if (!container) return;
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');
    if (!eventId) return;

    try {
      const { data: album, error: albumError } = await db.from('diary_albums').select('*').eq('id', eventId).single();
      if (albumError || !album) throw albumError || new Error("Album not found");

      document.getElementById('eventTitle').textContent = album.title;
      document.getElementById('eventDate').textContent = album.date;

      const { data: media, error: mediaError } = await db.from('diary_media').select('*').eq('album_id', eventId).order('created_at', { ascending: true });
      if (mediaError) throw mediaError;

      if (!media || media.length === 0) {
        container.innerHTML = "<p style='grid-column:1/-1; text-align:center; opacity:0.5; padding:5rem;'>相册为空，正在等待精彩镜头...</p>";
        return;
      }

      let html = "";
      media.forEach(m => {
        if (m.type === 'video') {
          html += `
            <div class="gallery-item fade-in visible">
              <video src="${m.media_url}" controls style="width:100%; height:100%; object-fit:cover;"></video>
            </div>`;
        } else {
          html += `
            <div class="gallery-item fade-in visible" onclick="openLightbox('${m.media_url}')">
              <img src="${m.media_url}" class="gallery-img" loading="lazy">
            </div>`;
        }
      });
      container.innerHTML = html;
      refreshObserver();
    } catch (err) { 
      console.error("Gallery Error:", err); 
      container.innerHTML = `<p style="text-align:center; color:#ff4444;">⚠️ 无法加载相册内容: ${err.message}</p>`;
    }
  }

  window.openLightbox = function(url) {
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightboxImg');
    if (lb && lbImg) { lbImg.src = url; lb.style.display = 'flex'; }
  };

  // --- 🪄 Global Initialization Protection ---
  try { syncSiteContent(); } catch(e) { console.warn("Sync skipped:", e.message); }
  try { fetchMusic(); } catch(e) { console.warn("Music skipped:", e.message); }
  try { fetchEvents(); } catch(e) { console.warn("Events skipped:", e.message); }
  try { fetchDiary(); } catch(e) { console.warn("Diary skipped:", e.message); }
  try { initGallery(); } catch(e) { console.warn("Gallery skipped:", e.message); }
});
