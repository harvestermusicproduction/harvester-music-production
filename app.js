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
    const a = e.target.closest('a');
    if (!a) return;
    if (a.classList.contains('mobile-dropdown-toggle') || a.getAttribute('href') === 'javascript:void(0)' || a.getAttribute('href') === '#') {
      return;
    }
    window.toggleMobileMenu();
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

  // --- 0. Supabase Initialization (Non-blocking Safe Mode) ---
  const db = window.supabase || null;

  // --- 📈 Real-time Analytics ---
  async function recordVisit() {
    try {
      if (db && !sessionStorage.getItem('h_v')) {
        await db.from('visits').insert([{}]);
        sessionStorage.setItem('h_v', '1');
      }
    } catch(e) { console.warn("Analytics idle."); }
  }
  recordVisit();

  // --- 2. Site Content Synchronization ---
  let siteConfigs = {};
  async function syncSiteContent() {
    if (!db) return;
    try {
      const { data, error } = await db.from('site_config').select('*');
      if (error) throw error;
      siteConfigs = data.reduce((acc, curr) => { acc[curr.key] = curr.value; return acc; }, {});
      applyHydration();
      fetchLatestMusicForHome();
      fetchEvents();
      // Re-run diary to apply global FB link from config if needed
      fetchDiary(); 
    } catch (err) { console.warn("Supabase Config Error:", err.message); }
  }

  function applyHydration() {
    document.querySelectorAll('[id^="cfg_"]').forEach(el => {
      const val = siteConfigs[el.id];
      if(!val) return;
      if (el.tagName === 'IMG') el.src = val;
      else if (el.tagName === 'A') {
        const trimmed = typeof val === 'string' ? val.trim() : '';
        if (trimmed && trimmed !== '#' && trimmed !== 'javascript:void(0)') {
          el.href = trimmed;
        }
      }
      else el.innerHTML = val.replace(/\n/g, '<br>');
    });

    // 🌐 Social Links Full Site Synchronization
    const navFb = (siteConfigs['cfg_nav_fb'] || siteConfigs['cfg_social_fb'] || '').trim();
    const navIg = (siteConfigs['cfg_nav_ig'] || siteConfigs['cfg_social_ig'] || '').trim();
    const navYt = (siteConfigs['cfg_nav_yt'] || siteConfigs['cfg_social_yt'] || '').trim();
    const navWa = (siteConfigs['cfg_nav_wa'] || siteConfigs['cfg_social_wa'] || '').trim();
    const navSp = (siteConfigs['cfg_nav_sp'] || siteConfigs['cfg_social_sp'] || '').trim();

    if (navFb && navFb !== '#' && navFb !== 'javascript:void(0)') {
      document.querySelectorAll('#cfg_nav_fb, #cfg_social_fb, #cfg_contact_fb').forEach(a => { a.href = navFb; });
    }
    if (navIg && navIg !== '#' && navIg !== 'javascript:void(0)') {
      document.querySelectorAll('#cfg_nav_ig, #cfg_social_ig').forEach(a => { a.href = navIg; });
    }
    if (navYt && navYt !== '#' && navYt !== 'javascript:void(0)') {
      document.querySelectorAll('#cfg_nav_yt, #cfg_social_yt').forEach(a => { a.href = navYt; });
    }
    if (navWa && navWa !== '#' && navWa !== 'javascript:void(0)') {
      document.querySelectorAll('#cfg_nav_wa, #cfg_social_wa, #cfg_contact_wa').forEach(a => { a.href = navWa; });
    }
    if (navSp && navSp !== '#' && navSp !== 'javascript:void(0)') {
      document.querySelectorAll('#cfg_nav_sp, #cfg_social_sp').forEach(a => { a.href = navSp; });
    }

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

    // --- 🎬 Video Replacement Logic (About Page) ---
    const vUrl = siteConfigs['cfg_about_video'];
    const mediaContainer = document.getElementById('cfg_about_media_container');
    if (vUrl && mediaContainer) {
      mediaContainer.innerHTML = `
        <video src="${vUrl}" 
               style="width: 100%; height: 100%; object-fit: cover;" 
               autoplay loop muted playsinline>
        </video>
      `;
    }

    // --- 📖 About Page Full Dynamic Content Hydration ---
    const aboutJson = siteConfigs['cfg_about_content_json'];
    if (aboutJson) {
      try {
        const aboutData = typeof aboutJson === 'string' ? JSON.parse(aboutJson) : aboutJson;
        if (aboutData && typeof aboutData === 'object') {
          // Dynamic team list rendering for about.html polaroid gallery
          if (Array.isArray(aboutData.about_team_list) && aboutData.about_team_list.length > 0) {
            const teamSection = document.getElementById('section-team');
            if (teamSection) {
              let gridWrap = teamSection.querySelector('.team-grid-dynamic');
              if (!gridWrap) {
                const topGrid = teamSection.querySelector('.team-grid-top');
                const btmGrid = teamSection.querySelector('.team-grid-bottom');
                if (topGrid) topGrid.remove();
                if (btmGrid) btmGrid.remove();
                gridWrap = document.createElement('div');
                gridWrap.className = 'team-grid-dynamic';
                gridWrap.style = "display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 2rem; margin-bottom: 2.5rem;";
                const header = teamSection.querySelector('.section-sketch-header');
                if (header && header.nextSibling) {
                  teamSection.insertBefore(gridWrap, header.nextSibling);
                } else {
                  teamSection.appendChild(gridWrap);
                }
              }
              gridWrap.innerHTML = aboutData.about_team_list.map((m, idx) => `
                <div class="polaroid-card">
                  <div class="team-card-upper">
                    <div class="team-card-spine">
                      <span class="team-spine-name">${m.names || m.name || '主要同工'}</span>
                    </div>
                    <div class="polaroid-img-box">
                      <img src="${m.image_url || m.img || 'assets/logo.png'}" 
                           alt="${m.role || '同工'}" 
                           style="object-position: ${m.img_pos || m.pos || '50% 20%'}; transform: scale(${m.img_zoom || m.zoom || 1.0});" 
                           onerror="this.src='assets/logo.png'">
                    </div>
                  </div>
                  <div class="team-card-bottom">
                    <span class="team-bottom-role" title="${m.role || ''}">${m.role || '主要服事同工'}</span>
                    ${m.role_en && m.role_en.trim() ? `<span class="team-bottom-sub">${m.role_en.trim()}</span>` : ''}
                  </div>
                </div>
              `).join('');
            }
          }

          Object.keys(aboutData).forEach(key => {
            const el = document.getElementById(key);
            if (!el) return;
            const val = aboutData[key];
            if (!val && val !== '') return;
            if (el.tagName === 'IMG') el.src = val;
            else if (el.tagName === 'A') el.href = val;
            else if (typeof val === 'string' && (val.includes('<br') || val.includes('<b') || val.includes('<span'))) el.innerHTML = val;
            else el.innerText = val;
          });
        }
      } catch(e) { console.warn("About Data parse note:", e); }
    }
  }

  async function fetchLatestMusicForHome() {
    try {
      let featuredSong = null;
      const featuredId = siteConfigs['cfg_latest_music_id'];
      
      // Parse custom albums JSON if available
      let customAlbums = [];
      if (siteConfigs['cfg_albums_custom_json']) {
        try { customAlbums = JSON.parse(siteConfigs['cfg_albums_custom_json']); } catch(e){}
      }

      // 1. Try fetching by configured latest_music_id (首推单曲)
      if (featuredId) {
        const { data: byId } = await db.from('music_works').select('*').eq('id', featuredId).maybeSingle();
        if (byId) {
          featuredSong = byId;
        } else if (Array.isArray(customAlbums)) {
          featuredSong = customAlbums.find(a => a.id === featuredId);
        }
      }

      // 2. Fallback to latest created in database if not set
      if (!featuredSong) {
        const { data: latest } = await db.from('music_works').select('*').order('created_at', { ascending: false }).limit(1).maybeSingle();
        if (latest) {
          featuredSong = latest;
        } else if (Array.isArray(customAlbums) && customAlbums.length > 0) {
          featuredSong = customAlbums[0];
        }
      }

      // 3. Render into Home Page
      if (featuredSong) {
        const customMatch = Array.isArray(customAlbums) ? customAlbums.find(a => a.id === featuredSong.id || a.title === featuredSong.title) : null;
        const songTitle = featuredSong.title;
        const songArtist = customMatch?.artist || featuredSong.artist || 'Harvester Worship';
        const songCover = customMatch?.cover_url || featuredSong.cover_url || 'assets/logo.png';
        const songAudio = featuredSong.audio_url || customMatch?.youtube_url || customMatch?.audio_url || '';

        // 15-second preview audio extraction for White 3D Turntable
        const previewUrl = featuredSong.preview_audio_url || 
          (featuredSong.audio_url && !featuredSong.audio_url.includes('youtube.com') && !featuredSong.audio_url.includes('youtu.be') ? featuredSong.audio_url : '') ||
          customMatch?.preview_audio_url || 
          (customMatch?.audio_url && !customMatch.audio_url.includes('youtube.com') && !customMatch.audio_url.includes('youtu.be') ? customMatch.audio_url : '') || '';

        if (typeof window.setHomeTurntableAudio === 'function') {
          window.setHomeTurntableAudio(previewUrl, songTitle);
        }

        const titleEl = document.getElementById('cfg_homeSongTitle') || document.getElementById('latest_title');
        if (titleEl) {
          titleEl.innerHTML = `${songTitle} <span style="display:block; font-size:0.95rem; color:var(--gold); font-family:var(--font-serif); margin-top:6px; font-weight:normal; letter-spacing:1px;">${songArtist}</span>`;
        }

        const coverEl = document.getElementById('cfg_homeSongCover') || document.getElementById('latest_cover');
        if (coverEl) coverEl.src = songCover;

        const ytEl = document.getElementById('cfg_homeSongYT');
        if (ytEl) {
          if (songAudio && songAudio.startsWith('http')) {
            ytEl.href = songAudio;
            ytEl.innerHTML = '<i class="fab fa-youtube"></i> WATCH ON YOUTUBE';
            ytEl.style.display = 'inline-flex';
          } else {
            ytEl.href = 'music.html';
            ytEl.innerHTML = '<i class="fas fa-compact-disc"></i> 聆听 3D 唱片';
            ytEl.style.display = 'inline-flex';
          }
        }
      }
    } catch(e) {
      console.warn("fetchLatestMusicForHome note:", e);
    }
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
              ${ytLink ? `<a href="${ytLink}" target="_blank" class="btn-frosted-gold"><i class="fab fa-youtube"></i> YOUTUBE</a>` : ''}
              ${s.score_url ? `<a href="${s.score_url}" target="_blank" class="btn-frosted-gold"><i class="fas fa-file-pdf"></i> 歌谱</a>` : ''}
              <a href="contact.html#echo" class="btn-frosted-gold"><i class="fas fa-bullhorn"></i> 回声</a>
            </div>
          </div>
        </div>`;
      }).join('');
      refreshObserver();
    } catch (err) {}
  }

  // --- Event Title Sanitizer ---
  function sanitizeEventTitle(rawTitle, statusTag = '') {
    if (!rawTitle) return "";
    let clean = String(rawTitle).trim();
    
    const tagWords = [
      (statusTag || '').trim(),
      '即将来临 ⏳', '即将来临', '即将开启', 
      'HOT 热门 🔥', 'HOT 热门', 'HOT', '热门', 
      '报名中 🎟️', '报名中', 'OPEN 报名中', 'OPEN', 
      '售罄', 'SOLD OUT', '已满额', 
      '已结束 🏁', '已结束', 
      '精彩回顾 🎞️', '精彩回顾', 'RECAP', 
      'ANNUAL 年度特会', 'ANNUAL', '年度特会', 
      '进行中 ⚡', '进行中', 
      '⏳', '🔥', '🎟️', '🏁', '🔒', '⛪', '🎞️', '⚡'
    ].filter(Boolean);

    let changed = true;
    while (changed) {
      changed = false;
      // Strip brackets
      const bMatch = clean.match(/^(\[[^\]]+\]|【[^】]+】)\s*/);
      if (bMatch) {
        clean = clean.substring(bMatch[0].length).trim();
        changed = true;
      }
      // Strip any matching tag words at the beginning
      for (const tw of tagWords) {
        if (clean.startsWith(tw)) {
          clean = clean.substring(tw.length).trim();
          changed = true;
          break;
        }
      }
      // Strip leading colons, hyphens, dots
      const pMatch = clean.match(/^[:：\-—·\s]+/);
      if (pMatch) {
        clean = clean.substring(pMatch[0].length).trim();
        changed = true;
      }
    }

    return clean || rawTitle;
  }

  // --- Event & Album Metadata Parser ---
  function parseEventData(item) {
    if (!item) return { id: '', title: '', dateStr: '', timeStr: '', location: '', mapUrl: '', image_url: '', description: '', rawDate: '', rawTime: '', fullDateTime: '', day: '01', month: '01 月', year: '2026', cleanTitle: '', statusTag: '' };
    
    let desc = (item.description || "").trim();
    let rawDate = item.event_date || item.date || item.start_date || item.eventDate || item.event_day || item.datetime || item.event_datetime || item.start_at || item.start || "";
    let rawTime = item.event_time || item.time || item.start_time || item.eventTime || item.event_hour || item.time_str || item.event_time_str || item.timing || "";
    let rawLoc = item.location || item.loc || item.place || item.venue || item.address || "";
    let rawMapUrl = item.map_url || item.mapUrl || item.murl || item.google_map || "";
    let rawImg = item.image_url || item.cover_url || item.imageUrl || item.poster_url || item.poster || item.photo_url || "";
    let emailTemplate = item.email_template || item.emailTemplate || "";
    let order = (item.display_order !== undefined && item.display_order !== null && !isNaN(parseInt(item.display_order, 10))) ? parseInt(item.display_order, 10) : null;
    let meta = {};

    // Parse EXT_META JSON block if embedded in description
    if (desc && typeof desc === 'string' && desc.includes('EXT_META:')) {
      const metaMatch = desc.match(/EXT_META:(.*?)\|\|/);
      if (metaMatch) {
        try {
          meta = JSON.parse(metaMatch[1]) || {};
          if (meta.d || meta.date || meta.event_date) rawDate = meta.d || meta.date || meta.event_date;
          if (meta.tm || meta.time || meta.event_time || meta.start_time || meta.t) rawTime = meta.tm || meta.time || meta.event_time || meta.start_time || meta.t;
          if (meta.loc || meta.location || meta.place || meta.venue || meta.address) rawLoc = meta.loc || meta.location || meta.place || meta.venue || meta.address;
          if (meta.murl || meta.map_url || meta.mapUrl) rawMapUrl = meta.murl || meta.map_url || meta.mapUrl;
          if (meta.img || meta.image_url || meta.imageUrl || meta.cover_url || meta.poster_url) rawImg = meta.img || meta.image_url || meta.imageUrl || meta.cover_url || meta.poster_url;
          if (meta.et || meta.email_template) emailTemplate = meta.et || meta.email_template;
          if (meta.ord !== undefined || meta.display_order !== undefined) {
            const parsedOrd = parseInt(meta.ord ?? meta.display_order, 10);
            if (!isNaN(parsedOrd)) order = parsedOrd;
          }
        } catch (err) {
          console.warn("Meta parse fail:", err);
        }
        desc = desc.replace(metaMatch[0], '').trim();
      }
    }

    // Extract time from date string if combined (e.g. 2026-08-25T19:30:00, 2026-08-25 19:30:00, 2026-08-25 19:30, 2026年8月25日 19:30)
    let datePart = rawDate ? String(rawDate).trim() : "";
    if (datePart.includes('T')) {
      const parts = datePart.split('T');
      datePart = parts[0];
      if (!rawTime && parts[1]) {
        const tMatch = parts[1].replace('Z', '').match(/(\d{1,2}[:：.]\d{2})/);
        if (tMatch) rawTime = tMatch[1];
      }
    } else if (/\s+/.test(datePart)) {
      const parts = datePart.split(/\s+/);
      const timeCandidate = parts.slice(1).join(' ');
      const tMatch = timeCandidate.match(/(\d{1,2}[:：.]\d{2}(?::\d{2})?(?:\s*(?:am|pm|AM|PM))?(?:\s*[-~至到to]\s*\d{1,2}[:：.]\d{2}(?:\s*(?:am|pm|AM|PM))?)?)/i);
      if (tMatch) {
        datePart = parts[0];
        if (!rawTime) rawTime = tMatch[1];
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

    // Parse Day, Month, Year for sleek tour layout
    let day = "01";
    let month = "01 月";
    let year = "2026";
    
    // Check YYYY-MM-DD or YYYY/MM/DD or YYYY.MM.DD
    const dMatch = datePart.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
    if (dMatch) {
      year = dMatch[1];
      const mNum = parseInt(dMatch[2], 10);
      month = `${String(mNum).padStart(2, '0')} 月`;
      day = String(parseInt(dMatch[3], 10)).padStart(2, '0');
    } else {
      const cnMatch = datePart.match(/(\d{4})年\s*(\d{1,2})月(?:\s*(\d{1,2})日)?/);
      if (cnMatch) {
        year = cnMatch[1];
        month = `${String(parseInt(cnMatch[2], 10)).padStart(2, '0')} 月`;
        day = cnMatch[3] ? String(parseInt(cnMatch[3], 10)).padStart(2, '0') : "01";
      } else {
        const mdMatch = datePart.match(/(\d{1,2})[-/.](\d{1,2})/);
        if (mdMatch) {
          month = `${String(parseInt(mdMatch[1], 10)).padStart(2, '0')} 月`;
          day = String(parseInt(mdMatch[2], 10)).padStart(2, '0');
        }
      }
    }

    // Status Tag extraction
    let statusTag = "";
    let cleanTitle = item.title || "";
    const titleTagMatch = cleanTitle.match(/^(\[[^\]]+\]|\【[^\】]+\】)/);
    if (titleTagMatch) {
      statusTag = titleTagMatch[1];
      cleanTitle = cleanTitle.replace(titleTagMatch[0], '').trim();
    }

    if (meta.status_tag || meta.statusTag || meta.stag) statusTag = meta.status_tag || meta.statusTag || meta.stag;
    if (item.status_tag) statusTag = item.status_tag;

    // Sanitize title to ensure status tags or prefixes are never duplicated
    cleanTitle = sanitizeEventTitle(item.title || "", statusTag);

    // Format Date (e.g. 2026-08-25 -> 2026年8月25日)
    let dateStr = datePart;
    if (dMatch) {
      dateStr = `${dMatch[1]}年${parseInt(dMatch[2], 10)}月${parseInt(dMatch[3], 10)}日`;
    }

    // Format Time (e.g. 19:30 or 19:30 - 21:30 or 7:30 PM)
    let timeStr = "";
    if (rawTime) {
      let cleanTime = String(rawTime).trim();
      // If time has seconds (e.g. "19:30:00" or "19:30:00+08"), trim seconds
      if (/^\d{1,2}:\d{2}:\d{2}(?:[+-]\d{2})?$/.test(cleanTime)) {
        cleanTime = cleanTime.substring(0, 5);
      }
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
          timeStr = cleanTime;
        }
      }
    }

    const fullDateTime = `${dateStr}${timeStr ? ' ' + timeStr : ''}`.trim();

    return {
      id: item.id,
      title: item.title || '',
      cleanTitle: cleanTitle || item.title || '',
      statusTag,
      day,
      month,
      year,
      dateStr,
      timeStr,
      location: rawLoc,
      mapUrl: rawMapUrl,
      image_url: rawImg,
      description: desc,
      rawDate,
      rawTime,
      emailTemplate,
      order,
      created_at: item.created_at || '',
      fullDateTime,
      img_pos: meta.img_pos || meta.pos || item.img_pos || item.pos || '50% 50%',
      img_zoom: meta.img_zoom || meta.zoom || item.img_zoom || item.zoom || 1.0
    };
  }

  // =========================================================================
  // 🌟 精彩活动 & 照片集 零延迟秒开与全量内置数据 (Curated Fallback & Instant Render)
  // =========================================================================
  const defaultCuratedEvents = [
    {
      id: "curated_1",
      title: "收割敬拜之夜 · 吉隆坡特别专场",
      event_date: "2025.11.15",
      event_time: "19:30 - 21:30",
      location: "吉隆坡 · 全福敬拜大厅 (Kuala Lumpur)",
      status_tag: "OPEN 报名中",
      image_url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=85",
      description: "聚集全马各地渴慕敬拜的弟兄姊妹，以原创 CCM 诗歌与深刻见证同心称谢主名。特邀多位知名福音歌手与同工现场配搭，愿圣灵的火焰点燃每一个敬拜的心灵。",
      map_url: "https://maps.google.com"
    },
    {
      id: "curated_2",
      title: "原创赞美诗创作营 & 制作工作坊",
      event_date: "2025.08.20",
      event_time: "09:30 - 17:00",
      location: "新山 · 音乐创作空间 (Johor Bahru)",
      status_tag: "HOT 热门",
      image_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=85",
      description: "为有志于诗歌创作的音乐人与主领提供专业编曲、作词、和声编写及录音实战教学。汤小康老师与制作团队亲自指导，协助完成属于神国度的原创佳作。",
      map_url: "https://maps.google.com"
    },
    {
      id: "curated_3",
      title: "灵火青年敬拜节 · 赞美复兴特会",
      event_date: "2025.07.12",
      event_time: "19:00 - 22:00",
      location: "槟城 · 圣爱大礼堂 (Penang)",
      status_tag: "RECAP 精彩回顾",
      image_url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=85",
      description: "专为年轻世代打造的现代流行敬拜之夜！融合摇滚、流行与民谣风格赞美诗，唤醒年轻人对福音的火热心志，立志在时代中作光作盐。",
      map_url: "https://maps.google.com"
    },
    {
      id: "curated_4",
      title: "收割者福音巡回音乐分享会",
      event_date: "2025.06.05",
      event_time: "20:00 - 21:45",
      location: "怡保 · 基督徒交流中心 (Ipoh)",
      status_tag: "UPCOMING 即将开启",
      image_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=85",
      description: "深入各地堂会与团契，以纯粹的木吉他与琴声讲述创作背后的属灵历程与恩典见证，用音乐播种爱与盼望。",
      map_url: "https://maps.google.com"
    },
    {
      id: "curated_5",
      title: "赞美诗合唱与管弦乐室内交响夜",
      event_date: "2025.05.01",
      event_time: "19:30 - 21:30",
      location: "吉隆坡 · 艺术文化中心 (Kuala Lumpur)",
      status_tag: "RECAP 精彩回顾",
      image_url: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=85",
      description: "经典与现代的庄严对话。室内管弦乐团与数十人诗班同台献唱经典圣诗与 Harvester 原创交响诗篇，呈现震撼心灵的敬拜飨宴。",
      map_url: "https://maps.google.com"
    },
    {
      id: "curated_6",
      title: "收割机敬拜团同工灵修培灵会",
      event_date: "2025.03.18",
      event_time: "10:00 - 16:30",
      location: "马六甲 · 恩典营地 (Melaka)",
      status_tag: "ANNUAL 年度特会",
      image_url: "https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51?auto=format&fit=crop&w=1200&q=85",
      description: "收割机全职与义工同工年度退修会，重温呼召与使命，在安静、祷告与彼此代祷中重新得力，整装待发。",
      map_url: "https://maps.google.com"
    }
  ];

  const defaultCuratedAlbums = [
    {
      id: "album_kl_worship",
      title: "收割敬拜之夜 · 吉隆坡现场回顾",
      date: "2025-11-15",
      cover_url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1000&q=80",
      photos: [
        { media_url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=85" },
        { media_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=85" },
        { media_url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=85" }
      ]
    },
    {
      id: "album_studio_creative",
      title: "录音室原创诗歌创作与配唱瞬间",
      date: "2025-08-20",
      cover_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80",
      photos: [
        { media_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=85" },
        { media_url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=85" }
      ]
    },
    {
      id: "album_youth_fire",
      title: "灵火青年敬拜赞美特会精选相片",
      date: "2025-07-12",
      cover_url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80",
      photos: [
        { media_url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=85" },
        { media_url: "https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51?auto=format&fit=crop&w=1200&q=85" }
      ]
    },
    {
      id: "album_retreat_camp",
      title: "收割机团队同工年度灵修退修会",
      date: "2025-03-18",
      cover_url: "https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51?auto=format&fit=crop&w=1000&q=80",
      photos: [
        { media_url: "https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51?auto=format&fit=crop&w=1200&q=85" },
        { media_url: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=85" }
      ]
    }
  ];

  // 渲染横向条状活动列表 HTML
  function renderEventsListHtml(events, container) {
    if (!container) return;
    if (!events || events.length === 0) {
      container.innerHTML = `<p style="text-align:center; opacity:0.5; font-size:0.95rem; margin:3rem 0;">暂无活动预告 敬请期待</p>`;
      return;
    }
    container.innerHTML = events.map(e => {
      let badgeClass = "open";
      const tagText = e.statusTag ? e.statusTag.toUpperCase() : "";
      if (tagText.includes("取消") || tagText.includes("CANCEL")) {
        badgeClass = "cancelled";
      } else if (tagText.includes("HOT") || tagText.includes("热门") || tagText.includes("🔥")) {
        badgeClass = "hot";
      } else if (tagText.includes("RECAP") || tagText.includes("回顾") || tagText.includes("结束")) {
        badgeClass = "cancelled";
      }
      const tagHtml = e.statusTag ? `<span class="event-strip-badge ${badgeClass}">${e.statusTag}</span>` : '';

      const isCancelled = tagText.includes("取消") || tagText.includes("CANCEL");
      let actionHtml = '';
      if (isCancelled) {
        actionHtml = `<span class="event-strip-disabled">已取消</span>`;
      } else {
        actionHtml = `<a href="event.html?id=${e.id}" class="event-strip-link">查看详情 <i class="fas fa-angle-right" style="font-size:0.8rem; margin-left:3px;"></i></a>`;
      }

      const safeTitle = (e.cleanTitle || e.title || "").replace(/'/g, "\\'");

      return `
        <div class="event-strip-row fade-in">
          <!-- Left: Date & Time -->
          <div class="event-date-block">
            <span class="event-day">${e.day}</span>
            <div class="event-month-year">
              <span class="event-month">${e.month}</span>
              <span class="event-year">${e.year}</span>
              ${e.timeStr ? `<span class="event-time-badge"><i class="far fa-clock"></i> ${e.timeStr}</span>` : ''}
            </div>
          </div>

          <!-- Center: Info -->
          <div class="event-info-block">
            ${tagHtml ? `<div class="event-tag-badge-wrap">${tagHtml}</div>` : ''}
            <h3 class="event-strip-title">
              <a href="event.html?id=${e.id}">${e.cleanTitle}</a>
            </h3>
            <p class="event-strip-venue">
              ${e.timeStr ? `<span class="event-strip-time"><i class="far fa-clock"></i> ${e.timeStr}</span><span class="event-strip-dot">·</span>` : ''}
              <span class="event-strip-loc"><i class="fas fa-map-marker-alt"></i> ${e.location || 'HARVESTER MUSIC PRODUCTION'}</span>
            </p>
          </div>

          <!-- Right: Action -->
          <div class="event-action-block">
            ${actionHtml}
            <button class="btn-strip-remind" title="开启活动提醒" onclick="openReminderModal('${e.id}', '${safeTitle}', '${e.fullDateTime}')">
              <i class="fas fa-bell"></i>
            </button>
          </div>
        </div>`;
    }).join('');
    refreshObserver();
  }

  // --- 🌟 精彩活动主加载函数 (零等待秒开 + 后台双模同步) ---
  async function fetchEvents() {
    const container = document.getElementById('eventsContainer');
    if (!container) return;

    // 1. 立即秒开渲染内置精选活动与本地缓存 (0.0ms 响应，告别卡死加载)
    let initialRaw = [...defaultCuratedEvents];
    const cachedCustom = siteConfigs['cfg_events_custom_json'] || localStorage.getItem('cfg_events_custom_json');
    if (cachedCustom) {
      try {
        const parsed = typeof cachedCustom === 'string' ? JSON.parse(cachedCustom) : cachedCustom;
        if (Array.isArray(parsed) && parsed.length > 0) initialRaw = parsed;
      } catch(e){}
    }

    let initialEvents = initialRaw.map(e => parseEventData(e));
    renderEventsPanoramicGallery(initialEvents);
    renderEventsListHtml(initialEvents, container);

    // 2. 后台异步从 Supabase 与 site_config 提取最新动态 (带 2.5s 安全超时保护)
    try {
      let remoteRaw = [];
      let res = null;
      if (db) {
        try {
          const fetchPromise = db.from('events').select('*');
          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2500));
          res = await Promise.race([fetchPromise, timeoutPromise]).catch(() => null);
          if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
            remoteRaw = res.data;
          }
        } catch(dbErr) {
          console.warn("fetchEvents DB query note:", dbErr);
        }
      }

      if (remoteRaw.length === 0 && siteConfigs['cfg_events_custom_json']) {
        try {
          const parsed = typeof siteConfigs['cfg_events_custom_json'] === 'string'
            ? JSON.parse(siteConfigs['cfg_events_custom_json'])
            : siteConfigs['cfg_events_custom_json'];
          if (Array.isArray(parsed) && parsed.length > 0) {
            remoteRaw = parsed;
          }
        } catch(cfgErr) {
          console.warn("fetchEvents config fallback note:", cfgErr);
        }
      }

      if (remoteRaw.length > 0) {
        let customOrderIds = [];
        try {
          const ordVal = siteConfigs['cfg_events_order'];
          if (ordVal) customOrderIds = ordVal.split(',').filter(Boolean);
        } catch(e){}

        const events = remoteRaw.map(e => parseEventData(e));
        events.sort((a, b) => {
          if (customOrderIds.length > 0) {
            const idxA = customOrderIds.indexOf(String(a.id));
            const idxB = customOrderIds.indexOf(String(b.id));
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
          }
          const orderA = (a.order !== null && a.order !== undefined && !isNaN(a.order)) ? a.order : 999999;
          const orderB = (b.order !== null && b.order !== undefined && !isNaN(b.order)) ? b.order : 999999;
          if (orderA !== orderB) return orderA - orderB;
          if (b.rawDate && a.rawDate) {
            const comp = a.rawDate.localeCompare(b.rawDate);
            if (comp !== 0) return comp;
          }
          return (b.created_at || '').localeCompare(a.created_at || '');
        });

        renderEventsPanoramicGallery(events);
        renderEventsListHtml(events, container);
      }
    } catch(e) {
      console.warn("fetchEvents fail-safe note:", e);
    }
  }

  // 🌟 Full-Width Panoramic Multi-Photo Running Gallery (横向尽头多照片跑马灯画廊)
  function renderEventsPanoramicGallery(events) {
    const track = document.getElementById('eventsGalleryTrack');
    const viewport = document.getElementById('eventsGalleryViewport');
    const heroSec = document.getElementById('eventsHeroSection');
    if (!track || !viewport) return;

    // 🌟 Strict Authoritative Custom Posters Resolution
    let galleryItems = [];
    const cfgPostersRaw = siteConfigs['cfg_events_posters_json'];

    if (cfgPostersRaw !== undefined && cfgPostersRaw !== null) {
      try {
        const parsed = typeof cfgPostersRaw === 'string' ? JSON.parse(cfgPostersRaw) : cfgPostersRaw;
        if (Array.isArray(parsed) && parsed.length > 0) {
          galleryItems = parsed.map(p => ({
            id: p.id || 'poster_' + Math.random(),
            title: p.title || 'Harvester 精彩活动',
            image_url: p.image_url,
            date: p.date || 'UPCOMING',
            venue: p.venue || '各大展演空间',
            statusTag: p.statusTag || 'HOT 热门',
            link: p.link || `event.html?id=${p.id}`
          })).filter(p => p.image_url);
        }
      } catch(e) {
        galleryItems = [];
      }
    }

    if (galleryItems.length === 0 && events && events.length > 0) {
      events.forEach(e => {
        if (e.image_url && !galleryItems.some(item => item.image_url === e.image_url || item.title === e.title)) {
          galleryItems.push({
            id: e.id,
            title: e.cleanTitle || e.title,
            image_url: e.image_url,
            date: e.dateStr || `${e.year || '2025'}.${e.month || ''}.${e.day || ''}`,
            time: e.timeStr || '',
            venue: e.location || '线下敬拜现场',
            statusTag: e.statusTag || 'UPCOMING',
            link: `event.html?id=${e.id}`
          });
        }
      });
    }

    if (galleryItems.length === 0) {
      galleryItems = defaultCuratedEvents.map(e => ({
        id: e.id,
        title: e.title,
        image_url: e.image_url,
        date: e.event_date,
        time: e.event_time,
        venue: e.location,
        statusTag: e.status_tag,
        link: `event.html?id=${e.id}`
      }));
    }

    // Render cards
    const renderCard = (item) => `
      <a href="${item.link || 'javascript:void(0)'}" class="event-photo-card" ${item.link && item.link.startsWith('http') ? 'target="_blank"' : ''}>
        <div class="event-card-bg-blur" style="background-image: url('${item.image_url}')"></div>
        <div class="event-card-img-wrap">
          <img src="${item.image_url}" alt="${item.title}" class="event-card-main-img" loading="lazy" style="object-position: ${item.img_pos || '50% 50%'}; transform: scale(${item.img_zoom || 1.0}); transform-origin: ${item.img_pos || '50% 50%'};" onerror="this.src='https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=900&q=80'">
        </div>
        <div class="event-card-gradient"></div>
        <span class="event-card-top-tag">${item.date}</span>
        <span class="event-card-status-pill">${item.statusTag}</span>
        <div class="event-card-bottom-info">
          <h3 class="event-card-title">${item.title}</h3>
          <div class="event-card-meta">
            ${item.time ? `<span><i class="far fa-clock"></i> ${item.time}</span>` : ''}
            <span><i class="fas fa-map-marker-alt"></i> ${item.venue}</span>
            <span><i class="fas fa-arrow-right"></i> 查看详情</span>
          </div>
        </div>
      </a>
    `;

    // Dynamic repeat count for seamless running loop without phantom mock items
    let repeatCount = 1;
    if (galleryItems.length === 1) repeatCount = 6;
    else if (galleryItems.length === 2) repeatCount = 4;
    else if (galleryItems.length >= 3) repeatCount = 3;

    const singleSet = galleryItems.map(renderCard).join('');
    let repeatedHtml = '';
    for (let r = 0; r < repeatCount; r++) {
      repeatedHtml += singleSet;
    }
    track.innerHTML = repeatedHtml;
    if (heroSec) heroSec.style.display = 'block';

    const oneSetWidth = () => track.scrollWidth / repeatCount;

    // 🏹 Setup Arrow Navigation
    window.scrollEventsGallery = function(direction) {
      const cardWidth = window.innerWidth <= 768 ? 310 : 404;
      viewport.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
    };

    // 🏃 Continuous Auto-Running Ticker Loop (Pauses on Hover & Drag)
    if (window._eventsAutoScrollInterval) clearInterval(window._eventsAutoScrollInterval);
    let isAutoScrolling = true;

    window._eventsAutoScrollInterval = setInterval(() => {
      if (!isAutoScrolling) return;
      viewport.scrollLeft += 1;
      const setW = oneSetWidth();
      if (setW > 0 && viewport.scrollLeft >= setW * 2) {
        viewport.scrollLeft -= setW;
      }
    }, 25);

    if (!viewport.dataset.listenersAttached) {
      viewport.dataset.listenersAttached = 'true';
      viewport.addEventListener('mouseenter', () => { isAutoScrolling = false; });
      viewport.addEventListener('mouseleave', () => { isAutoScrolling = true; });
      viewport.addEventListener('touchstart', () => { isAutoScrolling = false; }, { passive: true });
      viewport.addEventListener('touchend', () => { setTimeout(() => { isAutoScrolling = true; }, 2000); });

      // Drag to scroll
      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;

      viewport.addEventListener('mousedown', (e) => {
        isDown = true;
        isAutoScrolling = false;
        startX = e.pageX - viewport.offsetLeft;
        scrollLeft = viewport.scrollLeft;
      });

      window.addEventListener('mouseup', () => {
        if (isDown) {
          isDown = false;
          setTimeout(() => { isAutoScrolling = true; }, 1500);
        }
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - viewport.offsetLeft;
        const walk = (x - startX) * 1.5;
        viewport.scrollLeft = scrollLeft - walk;
      });
    }
  }

  window.openReminderModal = (id, title, date) => {
    let m = document.getElementById('reminderModal');
    if(!m){
      m=document.createElement('div'); m.id='reminderModal';
      m.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:9999; display:flex; justify-content:center; align-items:center; backdrop-filter:blur(15px); padding:20px;";
      m.innerHTML=`<div style="background:#111; border:1px solid var(--gold); border-radius:24px; padding:2.5rem; text-align:center; max-width:420px; width:100%; color: #F6F4F0; box-shadow:0 20px 50px rgba(0,0,0,0.8);">
         <h2 style="margin-bottom:0.5rem; font-family:var(--font-display); color:var(--gold);">活动提醒</h2>
         <p style="font-size:0.9rem; margin-bottom:1.2rem; color:#aaa;">输入邮箱，我们会在活动前给您发送提醒。</p>
         <h4 id="rem_t" style="margin-bottom:0.4rem; color: #F6F4F0; font-size:1.1rem;"></h4>
         <p id="rem_d" style="font-size:0.85rem; color:var(--gold); margin-bottom:1.5rem;"></p>
         <input type="email" id="rem_email" placeholder="your@email.com" style="width:100%; padding:12px; border-radius:10px; border:1px solid #333; background:#222; color: #F6F4F0; margin-bottom:1.5rem; text-align:center; font-size:1rem; box-sizing:border-box;">
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
      try {
        if (db) await db.from('event_reminders').insert([{ eventId: id, eventTitle: title, userEmail: email, eventDate: date }]);
      } catch(e){}
      alert("✅ 设置成功！届时系统将通知您。");
      m.style.display = 'none';
    };
  };

  // 渲染相册列表 HTML
  function renderDiaryAlbumsHtml(albums, container) {
    if (!container) return;
    if (!albums || albums.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: #888;">
        <p style="font-size: 1.15rem; margin-bottom: 0.5rem; color: var(--gold);">📷 暂无相册记录</p>
        <p style="font-size: 0.85rem; opacity: 0.7;">请进入管理后台添加精彩照片集与瞬间回忆。</p>
      </div>`;
      return;
    }
    const globalFb = siteConfigs['cfg_diary_fb'];
    container.innerHTML = albums.map(d => {
      const coverImg = d.cover_url || (d.photos && d.photos[0] ? d.photos[0].media_url : 'assets/logo.png');
      const finalFb = d.fb_url || globalFb;
      const photoCount = (d.photos && Array.isArray(d.photos)) ? d.photos.length : 0;
      const countBadge = photoCount > 0 ? `<span class="folder-count"><i class="fas fa-images"></i> ${photoCount} 张相片</span>` : '';
      return `
        <div class="folder-card fade-in" onclick="location.href='event.html?id=${d.id}'">
          <div class="folder-main">
            ${countBadge}
            <img src="${coverImg}" class="folder-cover" style="object-position: ${d.cover_pos || d.img_pos || '50% 50%'}; transform: scale(${d.cover_zoom || d.img_zoom || 1.0}); transform-origin: ${d.cover_pos || d.img_pos || '50% 50%'};" onerror="this.src='assets/logo.png'">
            <div class="folder-info">
              <p class="folder-date">📅 ${d.date || '未定日期'}</p>
              <h3 class="folder-title">${d.title}</h3>
              ${finalFb ? `<a href="${finalFb}" target="_blank" class="btn-social-fb" onclick="event.stopPropagation()"><i class="fab fa-facebook"></i> View on Facebook</a>` : ''}
            </div>
          </div>
        </div>`;
    }).join('');
    refreshObserver();
  }

  async function fetchDiary() {
    const container = document.getElementById('diaryContainer');
    if (!container) return;

    // 1. 立即秒开渲染内置精选相册
    let initialAlbums = [...defaultCuratedAlbums];
    const cfgAlbums = siteConfigs['cfg_diary_albums_json'] || localStorage.getItem('cfg_diary_albums_json');
    if (cfgAlbums) {
      try {
        const parsed = typeof cfgAlbums === 'string' ? JSON.parse(cfgAlbums) : cfgAlbums;
        if (Array.isArray(parsed) && parsed.length > 0) initialAlbums = parsed;
      } catch(e){}
    }
    renderDiaryAlbumsHtml(initialAlbums, container);

    // 2. 后台异步同步 Supabase
    try {
      let albums = [];
      if (db) {
        try {
          const { data, error } = await db.from('diary_albums').select('*').order('date', { ascending: false });
          if (!error && Array.isArray(data) && data.length > 0) albums = data;
        } catch(err){
          console.warn("fetchDiary DB note:", err);
        }
      }

      if (cfgAlbums) {
        try {
          const parsed = typeof cfgAlbums === 'string' ? JSON.parse(cfgAlbums) : cfgAlbums;
          if (Array.isArray(parsed) && parsed.length > 0) {
            parsed.forEach(p => {
              const matchIdx = albums.findIndex(a => String(a.id) === String(p.id) || a.title === p.title);
              if (matchIdx !== -1) {
                albums[matchIdx] = { ...p, ...albums[matchIdx] };
              } else {
                albums.push(p);
              }
            });
          }
        } catch(e){}
      }

      if (albums.length > 0) {
        albums.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        renderDiaryAlbumsHtml(albums, container);
      }
    } catch (e) {
      console.warn("fetchDiary Error:", e);
    }
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

      // 1. 优先在内置活动与内置相册中匹配
      const curEv = defaultCuratedEvents.find(x => String(x.id) === String(id));
      if (curEv) {
        album = curEv;
        isEvent = true;
      }

      if (!album) {
        const curAlb = defaultCuratedAlbums.find(x => String(x.id) === String(id));
        if (curAlb) {
          album = curAlb;
        }
      }

      // 2. 匹配 site_config cfg_events_custom_json
      if (!album && siteConfigs['cfg_events_custom_json']) {
        try {
          const evList = typeof siteConfigs['cfg_events_custom_json'] === 'string' ? JSON.parse(siteConfigs['cfg_events_custom_json']) : siteConfigs['cfg_events_custom_json'];
          if (Array.isArray(evList)) {
            const foundEv = evList.find(x => String(x.id) === String(id));
            if (foundEv) {
              album = foundEv;
              isEvent = true;
            }
          }
        } catch(e){}
      }

      // 3. 匹配 site_config cfg_events_posters_json
      if (!album && siteConfigs['cfg_events_posters_json']) {
        try {
          const pList = typeof siteConfigs['cfg_events_posters_json'] === 'string' ? JSON.parse(siteConfigs['cfg_events_posters_json']) : siteConfigs['cfg_events_posters_json'];
          if (Array.isArray(pList)) {
            const foundP = pList.find(x => String(x.id) === String(id));
            if (foundP) {
              album = foundP;
              isEvent = true;
            }
          }
        } catch(e){}
      }

      // 4. 匹配 site_config cfg_diary_albums_json
      if (!album && siteConfigs['cfg_diary_albums_json']) {
        try {
          const list = typeof siteConfigs['cfg_diary_albums_json'] === 'string' ? JSON.parse(siteConfigs['cfg_diary_albums_json']) : siteConfigs['cfg_diary_albums_json'];
          if (Array.isArray(list)) {
            const found = list.find(x => String(x.id) === String(id));
            if (found) album = found;
          }
        } catch(e){}
      }

      // 5. 尝试从 Supabase 查找
      if (!album && db) {
        try {
          const { data: eventData } = await db.from('events').select('*').eq('id', id).maybeSingle();
          if (eventData) {
            album = eventData;
            isEvent = true;
          }
        } catch(e){}
      }

      if (!album && db) {
        try {
          const { data: diaryData } = await db.from('diary_albums').select('*').eq('id', id).maybeSingle();
          if (diaryData) album = diaryData;
        } catch(e){}
      }

      if (!album) {
        container.innerHTML = "<p style='text-align:center; opacity:0.5; padding:3rem;'>暂无相关活动数据</p>";
        return;
      }

      const parsed = parseEventData(album);
      const cleanT = parsed.cleanTitle || parsed.title || '活动详情';
      document.title = `${cleanT} | Harvester Music`;

      const titleEl = document.getElementById('eventTitle');
      if (titleEl) titleEl.innerText = cleanT;

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

      // If it's an event (from events table or poster), add reminder button
      const oldBtn = document.getElementById('event_remind_btn_wrap');
      if (oldBtn) oldBtn.remove();
      if (isEvent || album.location || parsed.location || parsed.dateStr) {
        const cleanTitle = (cleanT || "").replace(/'/g, "\\'");
        const btnWrap = document.createElement('div');
        btnWrap.id = 'event_remind_btn_wrap';
        btnWrap.style = "width:100%; display:flex; justify-content:center; margin-top:20px;";
        btnWrap.innerHTML = `
          <button class="btn-frosted-gold" style="min-width:180px; max-width:260px; padding:12px 24px; background:rgba(246,210,138,0.1); color:var(--gold); border:1px solid rgba(246,210,138,0.3); border-radius:50px; cursor:pointer; font-weight:600; font-size:0.95rem; display:inline-flex; align-items:center; justify-content:center; gap:8px;" onclick="openReminderModal('${album.id}', '${cleanTitle}', '${parsed.fullDateTime}')"><i class="fas fa-bell"></i> 提醒我</button>
        `;
        const eventHeader = document.getElementById('eventHeader');
        if (eventHeader) eventHeader.appendChild(btnWrap);
      }

      // Gather photos
      let dbPhotos = [];
      if (db) {
        try {
          const { data: mData, error: mErr } = await db.from('diary_media').select('*').eq('album_id', id);
          if (!mErr && Array.isArray(mData)) dbPhotos = mData;
        } catch(err){}
      }

      let list = [];
      if (Array.isArray(album.photos) && album.photos.length > 0) {
        album.photos.forEach(p => {
          const url = typeof p === 'string' ? p : p.media_url;
          if (url && !list.some(x => x.media_url === url)) {
            list.push({ media_url: url });
          }
        });
      }

      dbPhotos.forEach(p => {
        const url = p.media_url;
        if (url && !list.some(x => x.media_url === url)) {
          list.push({ media_url: url });
        }
      });

      if (album.diary_media && Array.isArray(album.diary_media)) {
        album.diary_media.forEach(p => {
          const url = p.media_url;
          if (url && !list.some(x => x.media_url === url)) {
            list.push({ media_url: url });
          }
        });
      }

      // Best poster URL resolution (自然尺寸放大高清呈现)
      let posterUrl = parsed.image_url || album.cover_url || album.image_url || album.poster_url || "";
      if (!posterUrl && list.length > 0) {
        posterUrl = list[0].media_url;
      }
      if (!posterUrl) {
        posterUrl = siteConfigs['cfg_events_banner'] || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=85';
      }

      // 🌟 Render Enlarged Natural-Size Poster (适合原本的尺寸，高清且无多余提示字)
      let mainPosterHtml = `
        <div class="event-single-poster-wrap">
          <div class="event-poster-card" onclick="openLightbox('${posterUrl}')" title="点击查看高清海报">
            <img src="${posterUrl}" class="event-poster-full-img" alt="${cleanT}" draggable="false" onerror="this.src='https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=85'">
            <div class="event-poster-hover-hint"><i class="fas fa-search-plus"></i> 点击查看高清原图</div>
          </div>
        </div>
      `;

      // If there are additional photos beyond the poster, render secondary gallery
      let extraPhotos = list.filter(p => p.media_url !== posterUrl);
      let extraGalleryHtml = '';
      if (extraPhotos.length > 0) {
        extraGalleryHtml = `
          <div style="max-width:1100px; margin:2rem auto; padding:0 1.5rem;">
            <div style="display:flex; align-items:center; justify-content:center; gap:12px; margin-bottom:1.5rem;">
              <span style="height:1px; flex:1; background:rgba(246,210,138,0.25);"></span>
              <h3 style="color:var(--gold); font-size:1.05rem; font-weight:600; margin:0; letter-spacing:1px;"><i class="fas fa-camera"></i> 现场照片记录</h3>
              <span style="height:1px; flex:1; background:rgba(246,210,138,0.25);"></span>
            </div>
            <div class="photo-gallery">
              ${extraPhotos.map(p => `
                <div class="gallery-item" onclick="openLightbox('${p.media_url}')">
                  <img src="${p.media_url}" class="gallery-img" loading="lazy" onerror="this.parentElement.style.display='none'">
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      container.className = 'event-poster-view-container';
      container.innerHTML = mainPosterHtml + extraGalleryHtml;

    } catch (e) {
      console.error("initEventGallery Error:", e);
      container.innerHTML = "<p style='text-align:center; opacity:0.5; padding:3rem;'>加载失败。</p>";
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
  initInteractiveTitle();
  if (document.getElementById('galleryContainer')) initEventGallery();
});

// --- ✨ Interactive Main Title (Harvester Music Production) ---
function initInteractiveTitle() {
  const titles = document.querySelectorAll('.hero-hand-title');
  const SPARKLE_CHARS = ['✦', '♪', '♫', '✧', '𝄞', '♬', '✨', '♩'];

  titles.forEach(title => {
    const rawText = title.innerText.trim();
    if (!rawText || title.dataset.interactiveDone) return;
    title.dataset.interactiveDone = 'true';

    // Split words and letters while keeping whitespace layout intact
    const words = rawText.split(' ');
    title.innerHTML = words.map(word => {
      const letters = Array.from(word).map(ch => {
        const rot = (Math.random() * 8 - 4).toFixed(1);
        return `<span class="title-char" style="--rot:${rot}deg;">${ch}</span>`;
      }).join('');
      return `<span class="title-word">${letters}</span>`;
    }).join(' ');

    // Interactive Hover & Particles on individual characters
    const chars = title.querySelectorAll('.title-char');
    chars.forEach(charEl => {
      charEl.addEventListener('mouseenter', () => {
        const rect = charEl.getBoundingClientRect();
        spawnTitleSparkle(rect.left + rect.width / 2, rect.top + rect.height / 2);
      });
    });

    // 3D Magnetic tilt on mousemove
    title.addEventListener('mousemove', (e) => {
      const rect = title.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);

      const tiltX = (deltaY * -5).toFixed(2);
      const tiltY = (deltaX * 7).toFixed(2);
      title.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px) scale(1.02)`;

      if (Math.random() < 0.2) {
        spawnTitleSparkle(e.clientX, e.clientY);
      }
    });

    title.addEventListener('mouseleave', () => {
      title.style.transform = '';
    });
  });

  function spawnTitleSparkle(x, y) {
    if (document.hidden) return;
    const spark = document.createElement('span');
    spark.className = 'title-spark-particle';
    spark.innerText = SPARKLE_CHARS[Math.floor(Math.random() * SPARKLE_CHARS.length)];
    
    const dx = (Math.random() * 70 - 35).toFixed(1);
    const dy = (-30 - Math.random() * 50).toFixed(1);
    const rot = (Math.random() * 90 - 45).toFixed(1);
    const size = (Math.random() * 0.5 + 0.95).toFixed(2);

    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    spark.style.fontSize = `${size}rem`;
    spark.style.setProperty('--dx', `${dx}px`);
    spark.style.setProperty('--dy', `${dy}px`);
    spark.style.setProperty('--rot', `${rot}deg`);

    document.body.appendChild(spark);
    setTimeout(() => { spark.remove(); }, 1100);
  }
}

// Note Particles logic restated
function startNotes(el) { el._n = setInterval(() => {
  const n = document.createElement('span'); n.className = 'note-particle'; n.innerText = '♪';
  n.style.left = '50%'; n.style.top = '50%'; el.appendChild(n);
  setTimeout(() => n.remove(), 2000);
}, 400); }
function stopNotes(el) { clearInterval(el._n); }
