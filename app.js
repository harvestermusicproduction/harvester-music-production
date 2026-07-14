document.addEventListener('DOMContentLoaded', () => {
  console.log("💎 Harvester Diamond V2.0: Multi-Layer Logic Active");

  // --- 📱 Global UX UI Controllers (DB-independent) ---
  window.toggleMobileMenu = () => {
    const overlay = document.getElementById('mobileNavOverlay');
    if (!overlay) return;
    const isActive = overlay.classList.toggle('active');
    document.body.style.overflow = isActive ? 'hidden' : '';
  };
  
  document.getElementById('mobileNavOverlay')?.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') window.toggleMobileMenu();
  });

  // --- 1. General UX: Scroll & Fade-in (DB-independent) ---
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

  // 🔥 Immediately observe ALL static fade-in elements (no DB needed)
  refreshObserver();

  // --- 0. Supabase Initialization ---
  const db = window.supabase;
  if(!db) { console.error("❌ Harvester Engine: Supabase Client NOT found. Static UI still works."); return; }

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

    // 🔍 Dynamic SEO Sync: Connect DB keywords/desc to actual HTML meta tags
    if (siteConfigs['cfg_site_keywords']) {
      let kTag = document.querySelector('meta[name="keywords"]');
      if (!kTag) { kTag = document.createElement('meta'); kTag.name = "keywords"; document.head.appendChild(kTag); }
      kTag.content = siteConfigs['cfg_site_keywords'];
    }
    if (siteConfigs['cfg_site_description']) {
      let dTag = document.querySelector('meta[name="description"]');
      if (!dTag) { dTag = document.createElement('meta'); dTag.name = "description"; document.head.appendChild(dTag); }
      dTag.content = siteConfigs['cfg_site_description'];
    }
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
          <div class="mini-vinyl-wrap" onmouseenter="startNotes(this)" onmouseleave="stopNotes(this)" style="position:relative; overflow:visible;">
            <div class="mini-vinyl"><img src="${s.cover_url || 'assets/logo.png'}"></div>
          </div>
          <div class="song-content-area">
            <h3>${s.title}</h3>
            <div class="song-card-actions" style="display:flex; gap:12px; margin-top:20px;">
              ${ytLink ? `<a href="${ytLink}" target="_blank" class="btn-frosted-gold" style="background:rgba(246,210,138,0.05); color:var(--gold); border:1px solid rgba(246,210,138,0.2); padding:6px 18px; border-radius:50px; text-decoration:none; font-size:0.8rem;"><i class="fab fa-youtube"></i> YOUTUBE</a>` : ''}
              ${s.score_url ? `<a href="${s.score_url}" target="_blank" class="btn-frosted-gold" style="background:rgba(246,210,138,0.05); color:var(--gold); border:1px solid rgba(246,210,138,0.2); padding:6px 18px; border-radius:50px; text-decoration:none; font-size:0.8rem;"><i class="fas fa-file-pdf"></i> 歌谱</a>` : ''}
              <a href="feedback.html?id=${s.id}" class="btn-frosted-gold" style="background:rgba(246,210,138,0.05); color:var(--gold); border:1px solid rgba(246,210,138,0.2); padding:6px 18px; border-radius:50px; text-decoration:none; font-size:0.8rem;"><i class="fas fa-bullhorn"></i> 回声</a>
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
        let eventDate = e.date;
        let eventTime = "";
        let eventLocation = e.location || "";
        let eventImage = e.image_url || "";
        
        const metaMatch = desc.match(/EXT_META:(.*?)\|\|/);
        let ticketUrl = e.ticket_url || "";
        let ticketPrice = e.ticket_price || "";
        
        if (metaMatch) {
          try {
            const meta = JSON.parse(metaMatch[1]);
            if (meta.d) eventDate = meta.d;
            if (meta.tm) eventTime = meta.tm;
            if (meta.loc) eventLocation = meta.loc;
            if (meta.img) eventImage = meta.img;
            if (meta.turl) ticketUrl = meta.turl;
            if (meta.tprice !== undefined) ticketPrice = meta.tprice;
          } catch (err) {
            console.warn("Meta parse fail:", err);
          }
          desc = desc.replace(metaMatch[0], '').trim();
        }
        
        const dateStr = eventDate ? new Date(eventDate).toLocaleDateString('zh-CN') : 'TBA';
        const displayTime = eventTime ? `<span style="margin-left:15px;"><i class="fas fa-clock"></i> ${eventTime}</span>` : '';
        const displayLocation = eventLocation ? `<span style="margin-left:15px;"><i class="fas fa-map-marker-alt"></i> ${eventLocation}</span>` : '';
        const displayImage = eventImage ? `<img src="${eventImage}" style="width:100%; max-height:220px; object-fit:cover; border-radius:12px; border:1px solid #333; margin-bottom:1.5rem;" onerror="this.style.display='none'">` : '';
        
        const isFree = !ticketPrice || parseFloat(ticketPrice) === 0;
        const priceStr = isFree ? '免费 FREE' : 'RM ' + parseFloat(ticketPrice).toFixed(2);
        
        const displayButtons = `
            <div style="margin-top:20px; display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
              <button class="btn-frosted-gold" style="flex:1; min-width:140px; max-width:240px; padding:12px 10px;" onclick="openTicketInfoModal('${ticketUrl}', '${priceStr}', '${e.title}')">我要参与</button>
              <button class="btn-frosted-gold" style="flex:1; min-width:140px; max-width:240px; padding:12px 10px; background:rgba(255,255,255,0.05); color:#ddd; border-color:rgba(255,255,255,0.2);" onclick="openReminderModal('${e.id}', '${e.title}', '${eventDate}')">提醒我</button>
            </div>
        `;

        return `
          <div class="event-card fade-in gold-theme" style="text-align:center; height:auto; aspect-ratio:auto; padding:2rem;">
            ${displayImage}
            <div style="font-size:0.9rem; opacity:0.8; margin-bottom:1rem;">
              <span><i class="fas fa-calendar-alt"></i> ${dateStr}</span>
              ${displayTime}
              ${displayLocation}
            </div>
            <h3 style="color:var(--gold); font-size:1.6rem; margin-bottom:0.8rem;">${e.title}</h3>
            <p style="line-height:1.6; font-size:0.95rem;">${desc}</p>
            ${displayButtons}
          </div>`;
      }).join('');
      refreshObserver();
    } catch(e) {}
  }

  window.openTicketInfoModal = (url, price, title) => {
    if (!url) return alert("尚未开放报名，敬请期待！");
    // If it's a URL and doesn't look like a supabase image upload, open the link
    if (url.startsWith('http') && !url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) && !url.includes('storage.supabase.co')) {
      window.open(url, '_blank');
      return;
    }
    
    // Otherwise show QR modal
    let m = document.getElementById('ticketQrModal');
    if(!m){
      m = document.createElement('div'); m.id='ticketQrModal';
      m.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:9999; display:flex; justify-content:center; align-items:center; backdrop-filter:blur(15px); padding:20px;";
      document.body.appendChild(m);
    }
    m.innerHTML = `<div style="background:#fff; border-radius:30px; padding:2rem; text-align:center; max-width:400px; width:100%; color:#222; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
         <h2 style="margin-bottom:0.5rem; font-family:var(--font-display);">报名与付款</h2>
         <h4 style="margin-bottom:1rem; color:var(--gold);">《${title}》</h4>
         <p style="font-size:0.9rem; margin-bottom:15px; color:#666;">票价：<strong>${price}</strong></p>
         <p style="font-size:0.8rem; color:#888; margin-bottom:15px;">请扫描下方二维码进行付款或报名。如有备注请填写您的名字。</p>
         <img src="${url}" style="width:100%; max-width:250px; aspect-ratio:1; object-fit:contain; border-radius:12px; border:2px solid #eee; margin:0 auto 1.5rem; display:block;" onerror="this.src='assets/logo.png'">
         <button class="btn-frosted-gold" style="width:100%; background:#eee; color:#333; border:none; border-radius:10px; padding:12px; font-weight:bold; cursor:pointer;" onclick="document.getElementById('ticketQrModal').style.display='none'">关闭 (Close)</button>
      </div>`;
    m.style.display = 'flex';
  };

  window.openReminderModal = (id, title, date) => {
    let m = document.getElementById('reminderModal');
    if(!m){
      m=document.createElement('div'); m.id='reminderModal';
      m.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:9999; display:flex; justify-content:center; align-items:center; backdrop-filter:blur(15px); padding:20px;";
      m.innerHTML=`<div style="background:#fff; border-radius:30px; padding:2rem; text-align:center; max-width:400px; width:100%; color:#222;">
         <h2 style="margin-bottom:0.5rem; font-family:var(--font-display);">活动参与</h2>
         <p style="font-size:0.9rem; margin-bottom:1.5rem; color:#666;">请输入邮箱，我们会在活动前提醒你。</p>
         <h4 id="rem_t" style="margin-bottom:1.5rem; color:var(--gold);"></h4>
         <input type="email" id="rem_email" placeholder="your@email.com" style="width:100%; padding:12px; border-radius:10px; border:1px solid #ccc; margin-bottom:1.5rem; text-align:center;">
         <div style="display:flex; gap:10px;">
           <button id="rem_submit" class="btn-frosted-gold" style="flex:2; background:#000; color:var(--gold); border:none; border-radius:10px; padding:12px; font-weight:bold;">🔔 提交</button>
           <button style="flex:1; border-radius:10px; padding:12px; background:#eee; border:none; color:#666; cursor:pointer;" onclick="document.getElementById('reminderModal').style.display='none'">取消</button>
         </div>
      </div>`;
      document.body.appendChild(m);
    }
    m.style.display = 'flex';
    document.getElementById('rem_t').innerText = `《${title}》`;
    document.getElementById('rem_submit').onclick = async () => {
      const email = document.getElementById('rem_email').value;
      if(!email || !email.includes('@')) return alert("请输入有效邮箱");
      const { error } = await db.from('event_reminders').insert([{ eventId: id, eventTitle: title, userEmail: email }]);
      if(!error) { alert("✅ 设置成功！届时系统将通知您。"); m.style.display = 'none'; }
      else { alert("提交失败，请稍后重试。"); }
    };
  };

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
      const titleEl = document.getElementById('eventTitle');
      if (titleEl) titleEl.innerText = album.title;
      
      const dateEl = document.getElementById('eventDate');
      if (dateEl) {
        dateEl.style.display = 'flex';
        dateEl.style.alignItems = 'center';
        dateEl.innerHTML = `<span>${album.date}</span>`;
      }

      const fbLink = album.fb_url;
      
      if (fbLink && !document.getElementById('fb_link_exists')) {
        const link = document.createElement('span');
        link.id = 'fb_link_exists';
        link.style.display = 'inline-block';
        link.style.lineHeight = '0';
        link.style.marginLeft = "15px";
        link.innerHTML = `
          <a href="${fbLink}" target="_blank" class="btn-social-fb" style="display:inline-flex; width:auto; padding:4px 14px; font-size:0.7rem; vertical-align:middle; background:rgba(246,210,138,0.1); color:var(--gold); border:1px solid rgba(246,210,138,0.3); border-radius:100px; text-decoration:none; backdrop-filter:blur(5px); letter-spacing:1px; transition:0.3s; margin:0; line-height:1;">
            <i class="fab fa-facebook-f" style="font-size:0.8rem; margin-right:5px;"></i> Facebook
          </a>
        `;
        dateEl?.appendChild(link);
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
  refreshObserver(); // Observe ALL static fade-in elements on every page immediately
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
