document.addEventListener('DOMContentLoaded', () => {
  console.log("💎 Harvester Diamond V1.9: Multi-Layer Logic Active");

  // --- 📱 Global UX UI Controllers ---
  window.toggleMobileMenu = () => {
    const overlay = document.getElementById('mobileNavOverlay');
    if (!overlay) return;
    const isActive = overlay.classList.toggle('active');
    document.body.style.overflow = isActive ? 'hidden' : '';
  };
  
  document.getElementById('mobileNavOverlay')?.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') window.toggleMobileMenu();
  });

  // --- 0. Supabase Initialization ---
  const db = window.supabase;
  if(!db) { console.error("❌ Harvester Engine: Supabase Client NOT found!"); return; }

  // --- 📈 Real-time Analytics ---
  async function recordVisit() {
    try {
      if (!sessionStorage.getItem('h_v')) {
        await db.from('visits').insert([{}]);
        sessionStorage.setItem('h_v', '1');
      }
    } catch(e) { console.warn("Analytics idle."); }
  }
  recordVisit();

  // --- 1. General UX (Particles & Scroll) ---
  const header = document.querySelector('header');
  if(header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    });
  }

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
    document.querySelectorAll('.fade-in, .reveal, .event-card, .folder-card').forEach(el => observer.observe(el));
  };

  // --- 2. Site Content Synchronization ---
  let siteConfigs = {};
  async function syncSiteContent() {
    try {
      const { data, error } = await db.from('site_config').select('*');
      if (error) throw error;
      siteConfigs = data.reduce((acc, curr) => { acc[curr.key] = curr.value; return acc; }, {});
      applyHydration();
      fetchLatestMusicForHome();
      // Re-run diary to apply global FB link from config if needed
      fetchDiary(); 
      if (document.getElementById('galleryContainer')) initEventGallery();
    } catch (err) { console.warn("Supabase Config Error:", err.message); }
  }

  function applyHydration() {
    document.querySelectorAll('[id^="cfg_"]').forEach(el => {
      const val = siteConfigs[el.id];
      if(!val) return;
      if (el.tagName === 'IMG') el.src = val;
      else if (el.tagName === 'A') el.href = val;
      else el.innerHTML = val.replace(/\n/g, '<br>');
    });
  }

  async function fetchLatestMusicForHome() {
    try {
      const { data: s } = await db.from('music_works').select('*').order('created_at', { ascending: false }).limit(1).maybeSingle();
      if (s) {
        const titleEl = document.getElementById('latest_title') || document.getElementById('cfg_homeSongTitle');
        if (titleEl) titleEl.innerText = s.title;
        const coverEl = document.getElementById('latest_cover') || document.getElementById('cfg_homeSongCover');
        if (coverEl) coverEl.src = s.cover_url || 'assets/placeholder.jpg';
      }
    } catch(e) {}
  }

  // --- 3. Dynamic Modules ---
  async function fetchMusic() {
    const container = document.getElementById('musicContainer');
    if(!container) return;
    try {
      const { data: docs } = await db.from('music_works').select('*').order('created_at', { ascending: false });
      container.innerHTML = docs.map(s => {
        const ytLink = s.audio_url || s.youtube_url;
        return `<div class="song-work-card fade-in">
          <div class="mini-vinyl-wrap" onmouseenter="startNotes(this)" onmouseleave="stopNotes(this)">
            <div class="mini-vinyl"><img src="${s.cover_url || 'assets/logo.png'}"></div>
          </div>
          <div class="song-content-area">
            <h3>${s.title}</h3>
            <div class="song-card-actions">
              ${ytLink ? `<a href="${ytLink}" target="_blank" class="btn-frosted-gold">YOUTUBE</a>` : ''}
              <a href="feedback.html?id=${s.id}" class="btn-frosted-gold">回声</a>
            </div>
          </div>
        </div>`;
      }).join('');
      refreshObserver();
    } catch (err) {}
  }

  async function fetchEvents() {
    const container = document.getElementById('eventsContainer');
    if (!container) return;
    try {
      const { data: events } = await db.from('events').select('*').order('date', { ascending: true });
      container.innerHTML = events.map(e => {
        let desc = e.description || "";
        const metaMatch = desc.match(/EXT_META:(.*?)\|\|/);
        if (metaMatch) desc = desc.replace(metaMatch[0], '').trim();
        
        const date = e.date ? new Date(e.date).toLocaleDateString('zh-CN') : 'TBA';
        return `
          <div class="event-card fade-in gold-theme" style="text-align:center;">
            <div style="font-size:0.9rem; opacity:0.8; margin-bottom:1rem;">
              <span><i class="fas fa-calendar-alt"></i> ${date}</span>
              ${e.location ? `<span style="margin-left:15px;"><i class="fas fa-map-marker-alt"></i> ${e.location}</span>` : ''}
            </div>
            <h3 style="color:var(--gold); font-size:1.6rem; margin-bottom:0.8rem;">${e.title}</h3>
            <p style="line-height:1.6; font-size:0.95rem;">${desc}</p>
            <div style="margin-top:20px;">
              <button class="btn-frosted-gold" style="width:100%; max-width:200px;" onclick="alert('即将上线: 活动提醒功能')">我要参与 / 提醒我</button>
            </div>
          </div>`;
      }).join('');
      refreshObserver();
    } catch(e) {}
  }

  async function fetchDiary() {
    const container = document.getElementById('diaryContainer');
    if (!container) return;
    try {
      const { data: albums } = await db.from('diary_albums').select('*, diary_media(media_url)').order('date', { ascending: false });
      const globalFb = siteConfigs['cfg_diary_fb'];
      container.innerHTML = albums.map(d => {
        const coverImg = d.cover_url || (d.diary_media[0] ? d.diary_media[0].media_url : 'assets/logo.png');
        const finalFb = d.fb_url || globalFb;
        return `
          <div class="folder-card fade-in" onclick="location.href='event.html?id=${d.id}'">
            <div class="folder-main">
              <img src="${coverImg}" class="folder-cover">
              <div class="folder-info">
                <p class="folder-date">${d.date}</p>
                <h3 class="folder-title">${d.title}</h3>
                ${finalFb ? `<a href="${finalFb}" target="_blank" class="btn-social-fb" onclick="event.stopPropagation()"><i class="fab fa-facebook"></i> View on Facebook</a>` : ''}
              </div>
            </div>
          </div>`;
      }).join('');
      refreshObserver();
    } catch (e) {}
  }

  // --- 4. Detail Page Logic (event.html) ---
  async function initEventGallery() {
    const container = document.getElementById('galleryContainer');
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!container || !id) return;

    try {
      const { data: album } = await db.from('diary_albums').select('*, diary_media(*)').eq('id', id).single();
      document.getElementById('eventTitle').innerText = album.title;
      document.getElementById('eventDate').innerText = album.date + " | FB Link Sync: Active";

      const fbLink = album.fb_url || siteConfigs['cfg_diary_fb'];
      if (fbLink && !document.getElementById('fb_link_exists')) {
        const link = document.createElement('span');
        link.id = 'fb_link_exists';
        link.style.marginLeft = "15px";
        link.innerHTML = `<a href="${fbLink}" target="_blank" class="btn-social-fb" style="width:auto; padding:5px 15px; font-size:0.8rem; vertical-align:middle;"><i class="fab fa-facebook"></i> 跳轉到 FB 帖子</a>`;
        document.getElementById('eventDate')?.appendChild(link);
      }

      let list = [];
      if (album.cover_url) list.push({ media_url: album.cover_url, is_cover: true });
      if (album.diary_media) list = [...list, ...album.diary_media];

      container.innerHTML = list.map(p => `
        <div class="photo-item" onclick="openLightbox('${p.media_url}')">
          <img src="${p.media_url}">
        </div>`).join('');
    } catch (e) { container.innerHTML = "加载失败。"; }
  }

  window.openLightbox = (url) => {
    const lb = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    if(lb && img) { img.src = url; lb.style.display = 'flex'; }
  };

  // --- Runtime ---
  syncSiteContent();
  fetchMusic();
  fetchEvents();
});

// Note Particles logic restated
function startNotes(el) { el._n = setInterval(() => {
  const n = document.createElement('span'); n.className = 'note-particle'; n.innerText = '♪';
  n.style.left = '50%'; n.style.top = '50%'; el.appendChild(n);
  setTimeout(() => n.remove(), 2000);
}, 400); }
function stopNotes(el) { clearInterval(el._n); }
