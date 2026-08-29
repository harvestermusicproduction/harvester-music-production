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

  // --- Event & Album Metadata Parser ---
  function parseEventData(item) {
    if (!item) return { id: '', title: '', dateStr: '', timeStr: '', location: '', mapUrl: '', image_url: '', description: '', rawDate: '', rawTime: '', fullDateTime: '' };
    
    let desc = (item.description || "").trim();
    let rawDate = item.event_date || item.date || item.start_date || item.eventDate || item.event_day || item.datetime || item.event_datetime || item.start_at || "";
    let rawTime = item.event_time || item.time || item.start_time || item.eventTime || item.event_hour || item.time_str || item.event_time_str || "";
    let rawLoc = item.location || item.loc || item.place || item.venue || item.address || "";
    let rawMapUrl = item.map_url || item.mapUrl || item.murl || item.google_map || "";
    let rawImg = item.image_url || item.cover_url || item.imageUrl || item.poster_url || item.poster || item.photo_url || "";
    let emailTemplate = item.email_template || item.emailTemplate || "";

    // Parse EXT_META JSON block if embedded in description
    if (desc && typeof desc === 'string' && desc.includes('EXT_META:')) {
      const metaMatch = desc.match(/EXT_META:(.*?)\|\|/);
      if (metaMatch) {
        try {
          const meta = JSON.parse(metaMatch[1]);
          if (meta.d || meta.date || meta.event_date) rawDate = meta.d || meta.date || meta.event_date;
          if (meta.tm || meta.time || meta.event_time || meta.start_time || meta.t) rawTime = meta.tm || meta.time || meta.event_time || meta.start_time || meta.t;
          if (meta.loc || meta.location || meta.place || meta.venue || meta.address) rawLoc = meta.loc || meta.location || meta.place || meta.venue || meta.address;
          if (meta.murl || meta.map_url || meta.mapUrl) rawMapUrl = meta.murl || meta.map_url || meta.mapUrl;
          if (meta.img || meta.image_url || meta.imageUrl || meta.cover_url || meta.poster_url) rawImg = meta.img || meta.image_url || meta.imageUrl || meta.cover_url || meta.poster_url;
          if (meta.et || meta.email_template) emailTemplate = meta.et || meta.email_template;
        } catch (err) {
          console.warn("Meta parse fail:", err);
        }
        desc = desc.replace(metaMatch[0], '').trim();
      }
    }

    // Extract time from date string if combined (e.g. 2026-08-25T19:30:00, 2026-08-25 19:30, 2026年8月25日 19:30)
    let datePart = rawDate ? String(rawDate).trim() : "";
    if (datePart.includes('T')) {
      const parts = datePart.split('T');
      datePart = parts[0];
      if (!rawTime && parts[1]) rawTime = parts[1].replace('Z', '').substring(0, 5);
    } else if (datePart.includes(' ')) {
      const m = datePart.match(/^(.*?)[ ]+([0-9]{1,2}[:：.][0-9]{2}(?::[0-9]{2})?(?:\s*(?:am|pm|AM|PM))?(?:\s*[-~至到to]\s*[0-9]{1,2}[:：.][0-9]{2}(?:\s*(?:am|pm|AM|PM))?)?)/i);
      if (m) {
        datePart = m[1].trim();
        if (!rawTime) rawTime = m[2].trim();
      }
    }

    // If time is still empty, check description for time clues (e.g. 时间：19:30, ⏰ 19:30, 7:30 PM, etc.)
    if (!rawTime && desc) {
      const m1 = desc.match(/(?:时间|time|⏰|时段|开场|开始)[：:\s]*([0-9]{1,2}[:：.][0-9]{2}(?:\s*(?:am|pm|AM|PM))?(?:\s*[-~至到to]\s*[0-9]{1,2}[:：.][0-9]{2}(?:\s*(?:am|pm|AM|PM))?)?)/i);
      if (m1) {
        rawTime = m1[1].trim();
      } else {
        const m2 = desc.match(/(?:时间|time|⏰)[：:\s]*([^\r\n,，。|]+)/i);
        if (m2) {
          rawTime = m2[1].trim();
        } else {
          const m3 = desc.match(/\b([0-9]{1,2}[:：.][0-9]{2}(?:\s*(?:am|pm|AM|PM))?(?:\s*[-~至到to]\s*[0-9]{1,2}[:：.][0-9]{2}(?:\s*(?:am|pm|AM|PM))?)?)/i);
          if (m3) rawTime = m3[1].trim();
        }
      }
    }

    // Format Date (e.g. 2026-08-25 -> 2026年8月25日)
    let dateStr = datePart;
    const dateMatch = datePart.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
    if (dateMatch) {
      dateStr = `${dateMatch[1]}年${parseInt(dateMatch[2], 10)}月${parseInt(dateMatch[3], 10)}日`;
    } else {
      const yearMonthMatch = datePart.match(/^(\d{4})[-/.](\d{1,2})$/);
      if (yearMonthMatch) {
        dateStr = `${yearMonthMatch[1]}年${parseInt(yearMonthMatch[2], 10)}月`;
      }
    }

    // Format Time (e.g. 19:30 or 19:30 - 21:30 or 7:30 PM)
    let timeStr = "";
    if (rawTime) {
      const cleanTime = String(rawTime).trim();
      if (cleanTime.includes('-') || cleanTime.includes('~') || cleanTime.includes('至') || cleanTime.includes('to')) {
        timeStr = cleanTime;
      } else {
        const isPM = /pm|下午|晚上|夜间|傍晚/i.test(cleanTime);
        const isAM = /am|上午|早上|清晨/i.test(cleanTime);
        const timeMatch = cleanTime.match(/(\d{1,2})[:：.](\d{2})/);
        if (timeMatch) {
          let h = parseInt(timeMatch[1], 10);
          const m = timeMatch[2];
          if (isPM && h < 12) h += 12;
          if (isAM && h === 12) h = 0;
          timeStr = `${String(h).padStart(2, '0')}:${m}`;
        } else {
          const hourOnlyMatch = cleanTime.match(/(\d{1,2})(?:\s*(?:pm|am|点|时|:00))?/i);
          if (hourOnlyMatch && !isNaN(parseInt(hourOnlyMatch[1], 10))) {
            let h = parseInt(hourOnlyMatch[1], 10);
            if (isPM && h < 12) h += 12;
            if (isAM && h === 12) h = 0;
            if (h >= 0 && h <= 24) {
              timeStr = `${String(h).padStart(2, '0')}:00`;
            } else {
              timeStr = cleanTime;
            }
          } else {
            timeStr = cleanTime;
          }
        }
      }
    }

    const fullDateTime = `${dateStr}${timeStr ? ' ' + timeStr : ''}`.trim();

    return {
      id: item.id,
      title: item.title || '',
      dateStr,
      timeStr,
      location: rawLoc,
      mapUrl: rawMapUrl,
      image_url: rawImg,
      description: desc,
      rawDate,
      rawTime,
      emailTemplate,
      fullDateTime
    };
  }

  async function fetchEvents() {
    const container = document.getElementById('eventsContainer');
    if (!container) return;
    try {
      let res = await db.from('events').select('*').order('created_at', { ascending: false });
      if (res.error || !res.data) {
        res = await db.from('events').select('*');
      }
      const rawEvents = res.data || [];

      if (rawEvents.length === 0) {
        container.innerHTML = `<p style="text-align:center; opacity:0.5; font-size:0.95rem; margin-top:2rem;">暂无活动预告 敬请期待</p>`;
        return;
      }

      const events = rawEvents.map(e => parseEventData(e));
      // Sort by date if available
      events.sort((a, b) => (b.rawDate || '').localeCompare(a.rawDate || ''));

      container.innerHTML = events.map(e => {
        const displayDate = e.dateStr ? `<span><i class="fas fa-calendar-alt" style="color:var(--gold); margin-right:6px;"></i>${e.dateStr}</span>` : '';
        const displayTime = e.timeStr ? `<span><i class="fas fa-clock" style="color:var(--gold); margin-right:6px;"></i>${e.timeStr}</span>` : '';
        const displayLocation = e.location ? `<span><i class="fas fa-map-marker-alt" style="color:var(--gold); margin-right:6px;"></i>${e.location}</span>` : '';
        const displayImage = e.image_url ? `<a href="event.html?id=${e.id}"><img src="${e.image_url}" style="width:100%; max-height:280px; object-fit:cover; border-radius:12px; border:1px solid #333; margin-bottom:1.5rem;" onerror="this.style.display='none'"></a>` : '';
        
        const cleanTitle = (e.title || "").replace(/'/g, "\\'");
        const displayButtons = `
            <div style="margin-top:20px; display:flex; gap:10px; justify-content:center;">
              <button class="btn-frosted-gold" style="min-width:180px; max-width:260px; padding:12px 20px; background:rgba(246,210,138,0.1); color:var(--gold); border:1px solid rgba(246,210,138,0.3); border-radius:50px; cursor:pointer; font-weight:600;" onclick="openReminderModal('${e.id}', '${cleanTitle}', '${e.fullDateTime}')"><i class="fas fa-bell"></i> 提醒我</button>
            </div>
        `;

        return `
          <div class="event-card fade-in gold-theme" style="text-align:center; height:auto; aspect-ratio:auto; padding:2.5rem; background:#111; border:1px solid rgba(246,210,138,0.25); border-radius:20px; box-shadow:0 10px 30px rgba(0,0,0,0.5);">
            ${displayImage}
            <div style="font-size:0.95rem; color:#ccc; margin-bottom:1.2rem; display:flex; gap:15px; justify-content:center; flex-wrap:wrap; align-items:center;">
              ${displayDate}
              ${displayTime}
              ${displayLocation}
            </div>
            <h3 style="color:var(--gold); font-size:1.7rem; margin-bottom:0.8rem;"><a href="event.html?id=${e.id}" style="color:inherit; text-decoration:none;">${e.title}</a></h3>
            ${e.description ? `<p style="line-height:1.7; font-size:0.95rem; color:#ddd; margin-bottom:1rem;">${e.description}</p>` : ''}
            ${displayButtons}
          </div>`;
      }).join('');
      refreshObserver();
    } catch(e) {
      console.error("fetchEvents fail:", e);
    }
  }

  window.openReminderModal = (id, title, date) => {
    let m = document.getElementById('reminderModal');
    if(!m){
      m=document.createElement('div'); m.id='reminderModal';
      m.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:9999; display:flex; justify-content:center; align-items:center; backdrop-filter:blur(15px); padding:20px;";
      m.innerHTML=`<div style="background:#111; border:1px solid var(--gold); border-radius:24px; padding:2.5rem; text-align:center; max-width:420px; width:100%; color:#fff; box-shadow:0 20px 50px rgba(0,0,0,0.8);">
         <h2 style="margin-bottom:0.5rem; font-family:var(--font-display); color:var(--gold);">活动提醒</h2>
         <p style="font-size:0.9rem; margin-bottom:1.2rem; color:#aaa;">输入邮箱，我们会在活动前给您发送提醒。</p>
         <h4 id="rem_t" style="margin-bottom:0.4rem; color:#fff; font-size:1.1rem;"></h4>
         <p id="rem_d" style="font-size:0.85rem; color:var(--gold); margin-bottom:1.5rem;"></p>
         <input type="email" id="rem_email" placeholder="your@email.com" style="width:100%; padding:12px; border-radius:10px; border:1px solid #333; background:#222; color:#fff; margin-bottom:1.5rem; text-align:center; font-size:1rem; box-sizing:border-box;">
         <div style="display:flex; gap:10px;">
           <button id="rem_submit" class="btn-frosted-gold" style="flex:2; background:var(--gold); color:#000; border:none; border-radius:50px; padding:12px; font-weight:bold; cursor:pointer;">🔔 提交提醒</button>
           <button style="flex:1; border-radius:50px; padding:12px; background:#222; border:1px solid #444; color:#ccc; cursor:pointer;" onclick="document.getElementById('reminderModal').style.display='none'">取消</button>
         </div>
      </div>`;
      document.body.appendChild(m);
    }
    m.style.display = 'flex';
    document.getElementById('rem_t').innerText = `《${title}》`;
    const remDEl = document.getElementById('rem_d');
    if (remDEl) remDEl.innerText = date ? `📅 ${date}` : '';
    document.getElementById('rem_submit').onclick = async () => {
      const email = document.getElementById('rem_email').value;
      if(!email || !email.includes('@')) return alert("请输入有效邮箱");
      const { error } = await db.from('event_reminders').insert([{ eventId: id, eventTitle: title, userEmail: email, eventDate: date }]);
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
    if (!container) return;

    if (!id) {
      container.innerHTML = "<p style='text-align:center; opacity:0.5; padding:3rem;'>未指定活动或相册</p>";
      return;
    }

    try {
      let album = null;
      let isEvent = false;

      // 1. Try diary_albums first
      const { data: diaryData } = await db.from('diary_albums').select('*, diary_media(*)').eq('id', id).maybeSingle();
      if (diaryData) {
        album = diaryData;
      } else {
        // 2. Fallback to events table
        const { data: eventData } = await db.from('events').select('*').eq('id', id).maybeSingle();
        if (eventData) {
          album = eventData;
          isEvent = true;
        }
      }

      if (!album) {
        container.innerHTML = "<p style='text-align:center; opacity:0.5; padding:3rem;'>暂无相关数据</p>";
        return;
      }

      const parsed = parseEventData(album);

      if (parsed.title) {
        document.title = `${parsed.title} | Harvester Music`;
      }

      const titleEl = document.getElementById('eventTitle');
      if (titleEl) titleEl.innerText = parsed.title || '';

      const dateEl = document.getElementById('eventDate');
      if (dateEl) {
        dateEl.style.display = 'flex';
        dateEl.style.alignItems = 'center';
        dateEl.style.justifyContent = 'center';
        dateEl.style.gap = '15px';
        dateEl.style.flexWrap = 'wrap';

        let html = '';
        if (parsed.dateStr) html += `<span><i class="fas fa-calendar-alt" style="color:var(--gold); margin-right:6px;"></i>${parsed.dateStr}</span>`;
        if (parsed.timeStr) html += `<span><i class="fas fa-clock" style="color:var(--gold); margin-right:6px;"></i>${parsed.timeStr}</span>`;
        if (parsed.location) html += `<span><i class="fas fa-map-marker-alt" style="color:var(--gold); margin-right:6px;"></i>${parsed.location}</span>`;
        
        dateEl.innerHTML = html;
      }

      const descEl = document.getElementById('eventDesc');
      if (descEl) {
        if (parsed.description) {
          descEl.innerText = parsed.description;
          descEl.style.display = 'block';
        } else {
          descEl.style.display = 'none';
        }
      }

      const fbLink = album.fb_url;
      if (fbLink && dateEl && !document.getElementById('fb_link_exists')) {
        const link = document.createElement('span');
        link.id = 'fb_link_exists';
        link.style.display = 'inline-block';
        link.style.lineHeight = '1';
        link.innerHTML = `
          <a href="${fbLink}" target="_blank" class="btn-social-fb" style="display:inline-flex; width:auto; padding:4px 14px; font-size:0.75rem; vertical-align:middle; background:rgba(246,210,138,0.1); color:var(--gold); border:1px solid rgba(246,210,138,0.3); border-radius:100px; text-decoration:none; backdrop-filter:blur(5px); letter-spacing:1px; transition:0.3s; margin:0; align-items:center;">
            <i class="fab fa-facebook-f" style="font-size:0.8rem; margin-right:5px;"></i> Facebook
          </a>
        `;
        dateEl.appendChild(link);
      }

      // If it's an event (from events table), add reminder button
      const oldBtn = document.getElementById('event_remind_btn_wrap');
      if (oldBtn) oldBtn.remove();
      if (isEvent) {
        const cleanTitle = (parsed.title || "").replace(/'/g, "\\'");
        const btnWrap = document.createElement('div');
        btnWrap.id = 'event_remind_btn_wrap';
        btnWrap.style = "width:100%; display:flex; justify-content:center; margin-top:20px;";
        btnWrap.innerHTML = `
          <button class="btn-frosted-gold" style="min-width:180px; max-width:260px; padding:12px 24px; background:rgba(246,210,138,0.1); color:var(--gold); border:1px solid rgba(246,210,138,0.3); border-radius:50px; cursor:pointer; font-weight:600; font-size:0.95rem;" onclick="openReminderModal('${album.id}', '${cleanTitle}', '${parsed.fullDateTime}')"><i class="fas fa-bell"></i> 提醒我</button>
        `;
        const eventHeader = document.getElementById('eventHeader');
        if (eventHeader) eventHeader.appendChild(btnWrap);
      }

      let list = [];
      if (album.cover_url) list.push({ media_url: album.cover_url, is_cover: true });
      if (parsed.image_url && parsed.image_url !== album.cover_url) list.push({ media_url: parsed.image_url, is_cover: true });
      if (album.diary_media && album.diary_media.length > 0) list = [...list, ...album.diary_media];

      if (list.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:3rem; color:#aaa; max-width:600px; margin:0 auto;"><p style="line-height:1.8;">${parsed.description ? '' : '精彩照片整理中...'}</p></div>`;
      } else if (list.length === 1) {
        // Single featured poster presentation
        container.innerHTML = `
          <div style="max-width:680px; margin:2rem auto; text-align:center; padding:0 1rem;">
            <div class="gallery-item" onclick="openLightbox('${list[0].media_url}')" style="cursor:pointer; display:inline-block; max-width:100%; border-radius:16px; overflow:hidden; border:1px solid rgba(246,210,138,0.25); box-shadow:0 15px 40px rgba(0,0,0,0.6); aspect-ratio:auto;">
              <img src="${list[0].media_url}" class="gallery-img" style="max-height:550px; width:100%; object-fit:contain; display:block;" onerror="this.parentElement.style.display='none'">
            </div>
          </div>
        `;
      } else {
        container.innerHTML = list.map(p => `
          <div class="gallery-item" onclick="openLightbox('${p.media_url}')">
            <img src="${p.media_url}" class="gallery-img" onerror="this.parentElement.style.display='none'">
          </div>`).join('');
      }

    } catch (e) {
      console.error("initEventGallery Error:", e);
      container.innerHTML = "<p style='text-align:center; opacity:0.5;'>加载失败。</p>";
    }
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
  if (document.getElementById('galleryContainer')) initEventGallery();
});

// Note Particles logic restated
function startNotes(el) { el._n = setInterval(() => {
  const n = document.createElement('span'); n.className = 'note-particle'; n.innerText = '♪';
  n.style.left = '50%'; n.style.top = '50%'; el.appendChild(n);
  setTimeout(() => n.remove(), 2000);
}, 400); }
function stopNotes(el) { clearInterval(el._n); }
