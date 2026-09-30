
document.addEventListener('DOMContentLoaded', () => {
  const db = window.supabase;
  if (!db) return;

  // --- UI Elements ---
  const loadingText = document.getElementById('authLoading');
  const loginBox = document.getElementById('loginBox');
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');
  const adminDashboard = document.getElementById('adminDashboard');
  const btnLogin = document.getElementById('btnLogin');

  // --- Global Error Handler ---
  window.addEventListener('error', (e) => {
    console.error("Global Error Caught:", e);
    alert(`⚠️ 脚本运行出错 [Global Error]:\n${e.message}\n文件: ${e.filename.split('/').pop()}\n行号: ${e.lineno}`);
  });

  // --- Auth Listener ---
  db.auth.onAuthStateChange((event, session) => {
    if(loadingText) loadingText.style.display = 'none';
    if (session) {
      if(loginBox) loginBox.classList.add('hidden');
      adminDashboard.classList.add('active');
      renderCMS();
    } else {
      adminDashboard.classList.remove('active');
      if(loginBox) loginBox.classList.remove('hidden');
    }
  });

  // --- Login Logic ---
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('txtEmail').value.trim();
    const password = document.getElementById('txtPassword').value.trim();
    btnLogin.innerText = '验证中...';
    const { error } = await db.auth.signInWithPassword({ email, password });
    if (error) {
      loginError.innerText = "登录失败: " + error.message;
      loginError.style.display = 'block';
      btnLogin.innerText = '授权进入 (Login)';
    }
  });

  let currentModule = 'dashboard';
  window.switchModule = (m) => { currentModule = m; renderCMS(); };
  window.logoutAdmin = () => db.auth.signOut();

  async function renderCMS() {
    adminDashboard.innerHTML = `
      <div class="cms-layout" style="display:flex; height:100vh; background:#050505; color:#fff; overflow:hidden; font-family: 'Inter', -apple-system, sans-serif;">
        <!-- Clean Professional Sidebar -->
        <aside style="width:240px; background:#000; border-right:1px solid #1a1a1a; padding:2.5rem 1.2rem; display:flex; flex-direction:column;">
          <div style="margin-bottom:3rem; padding-left:10px;">
            <h2 style="color:var(--gold); font-size:1.4rem; letter-spacing:3px; margin:0; font-weight: 300;">HARVESTER</h2>
            <p style="font-size:0.6rem; color:#1877F2; margin:5px 0 0; letter-spacing:2px; text-transform:uppercase; font-weight:bold;">DIAMOND EDGE V2.0 ACTIVE</p>
          </div>
          
          <nav style="flex:1; display:flex; flex-direction:column; gap:6px;">
            <p class="nav-section-title">Core Content</p>
            <a href="javascript:void(0)" onclick="switchModule('dashboard')" class="nav-item ${currentModule==='dashboard'?'active':''}">📊 Overview</a>
            <a href="javascript:void(0)" onclick="switchModule('music')" class="nav-item ${currentModule==='music'?'active':''}">🎵 Music</a>
            <a href="javascript:void(0)" onclick="switchModule('singers')" class="nav-item ${currentModule==='singers'?'active':''}">🎙️ Singers</a>
            <a href="javascript:void(0)" onclick="switchModule('events')" class="nav-item ${currentModule==='events'?'active':''}">📅 Events</a>
            <a href="javascript:void(0)" onclick="switchModule('diary')" class="nav-item ${currentModule==='diary'?'active':''}">📂 Field Diary</a>

            <p class="nav-section-title" style="margin-top:25px;">Interact</p>
            <a href="javascript:void(0)" onclick="switchModule('echo')" class="nav-item ${currentModule==='echo'?'active':''}">🌌 Echo Space</a>
            <a href="javascript:void(0)" onclick="switchModule('submissions')" class="nav-item ${currentModule==='submissions'?'active':''}">📮 Inbox</a>
            <a href="javascript:void(0)" onclick="switchModule('reminders')" class="nav-item ${currentModule==='reminders'?'active':''}">⏰ Subscriptions</a>
            <p class="nav-section-title" style="margin-top:25px;">Engine</p>
            <a href="javascript:void(0)" onclick="switchModule('config')" class="nav-item ${currentModule==='config'?'active':''}">⚙️ Global Settings</a>
          </nav>
          
          <button onclick="logoutAdmin()" style="background:none; border:none; color:#444; text-align:left; padding:10px; font-size:0.8rem; cursor:pointer; transition:0.3s; margin-top:20px; border-top:1px solid #111;">
            <i class="fas fa-sign-out-alt"></i> SIGN OUT
          </button>
        </aside>

        <main id="moduleBody" style="flex:1; padding:4rem 5rem; overflow-y:auto; background:#050505;"></main>
      </div>

      <style>
        .nav-section-title { font-size: 0.6rem; color: #2a2a2a; text-transform: uppercase; letter-spacing: 2.5px; margin: 10px 0 10px 10px; font-weight: bold; }
        .nav-item {
          color: #777;
          text-decoration: none;
          padding: 10px 15px;
          border-radius: 6px;
          font-size: 0.85rem;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          gap: 12px;
          letter-spacing: 0.5px;
        }
        .nav-item:hover { background: rgba(255,255,255,0.02); color: #bbb; }
        .nav-item.active { background: rgba(246, 210, 138, 0.08); color: var(--gold); font-weight: 500; }
        
        .cms-card { background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 12px; padding: 2rem; }
        .btn-tiny { background: #111; border: 1px solid #222; color: #888; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.75rem; transition: 0.3s; }
        .btn-tiny:hover { background: #222; color: #fff; border-color: #444; }
        .btn-tiny.danger:hover { background: #422; color: #f44; border-color: #622; }
      </style>
    `;
    const body = document.getElementById('moduleBody');
    if (currentModule === 'dashboard') renderDashboard(body);
    else if (currentModule === 'music') renderMusic(body);
    else if (currentModule === 'events') renderEvents(body);
    else if (currentModule === 'singers') renderSingers(body);
    else if (currentModule === 'diary') renderDiary(body);
    else if (currentModule === 'echo') renderEchoes(body);
    else if (currentModule === 'reminders') renderReminders(body);
    else if (currentModule === 'submissions') renderSubmissions(body);
    else if (currentModule === 'config') renderConfig(body);
    else body.innerHTML = `<h2 style="color:#333;">${currentModule.toUpperCase()}</h2><p style="color:#222;">Migration in progress.</p>`;
  }

  // --- Frontend Image Compression Helper ---
  const compressImage = (file, maxWidth=2000, maxHeight=2000, quality=0.85) => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) return resolve(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = event => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width; let height = img.height;
          if (width > height && width > maxWidth) { height *= maxWidth / width; width = maxWidth; }
          else if (height > maxHeight) { width *= maxHeight / height; height = maxHeight; }
          canvas.width = width; canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(blob => {
            if(!blob) return resolve(file);
            resolve(new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", { type: 'image/jpeg' }));
          }, 'image/jpeg', quality);
        };
        img.onerror = error => resolve(file);
      };
      reader.onerror = error => resolve(file);
    });
  };

  // --- SHARED Uploader ---
  window.uploadFile = async (fileInputId, targetId, previewId) => {
    let file = document.getElementById(fileInputId).files[0];
    if(!file) return alert("请选择文件");
    
    const btn = event.target;
    btn.innerText = "自动压缩中...";
    
    if (file.type.startsWith('image/')) {
        file = await compressImage(file);
    }

    const safeName = file.name.replace(/[^\w.-]/g, "_");
    const path = `uploads/${Date.now()}-${safeName}`;
    btn.innerText = "高速上传中...";
    const { data, error } = await db.storage.from('harvester-media').upload(path, file);
    if(error) return alert("上传失败: " + error.message);
    const { data: { publicUrl } } = db.storage.from('harvester-media').getPublicUrl(path);
    document.getElementById(targetId).value = publicUrl;
    if(previewId) {
      const prevEl = document.getElementById(previewId);
      if(prevEl) {
        prevEl.src = publicUrl;
        if(prevEl.tagName === 'VIDEO') prevEl.load();
      }
    }
    btn.innerText = "✅ 上传成功";
  };

  async function renderDashboard(container) {
    const { count: v } = await db.from('visits').select('*', { count: 'exact', head: true });
    const { count: m } = await db.from('music_works').select('*', { count: 'exact', head: true });
    
    // Fetch Rankings
    const { data: topDownloads } = await db.from('music_works').select('*').order('download_count', { ascending: false }).limit(5);
    const { data: topListen } = await db.from('music_works').select('*').order('listen_count', { ascending: false }).limit(5);

    container.innerHTML = `
      <h1 style="color:var(--gold);">系统概览 (Dashboard)</h1>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:20px; margin-top:20px;">
        <div class="cms-card" style="background:#1a1a1a; padding:2rem; border-radius:12px; border-left:4px solid var(--gold);">
          <h3 style="font-size:2.5rem; margin:0;">${v||0}</h3><p style="color:#666; margin:0;">全站访客总数 (Total Visits)</p>
        </div>
        <div class="cms-card" style="background:#1a1a1a; padding:2rem; border-radius:12px; border-left:4px solid #64D28A;">
          <h3 style="font-size:2.5rem; margin:0;">${m||0}</h3><p style="color:#666; margin:0;">已发布曲目 (Live Tracks)</p>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:30px; margin-top:40px;">
        <!-- Ranking 1: Downloads -->
        <div style="background:#0a0a0a; border:1px solid #222; border-radius:12px; padding:20px;">
          <h3 style="color:var(--gold); margin-top:0; border-bottom:1px solid #222; padding-bottom:10px;">📈 热门下载 (Top Scores)</h3>
          <div style="display:flex; flex-direction:column; gap:10px; margin-top:15px;">
            ${topDownloads?.map((s, i) => `
              <div style="display:flex; justify-content:space-between; align-items:center; background:#151515; padding:10px 15px; border-radius:8px;">
                <span><small style="color:#444;">#${i+1}</small> ${s.title}</span>
                <span style="color:var(--gold); font-weight:bold;">${s.download_count||0} 📄</span>
              </div>
            `).join('') || '<p style="color:#444;">暂无下载数据</p>'}
          </div>
        </div>

        <!-- Ranking 2: Listening -->
        <div style="background:#0a0a0a; border:1px solid #222; border-radius:12px; padding:20px;">
          <h3 style="color:#64D28A; margin-top:0; border-bottom:1px solid #222; padding-bottom:10px;">🎧 热门收听 (Top Listening)</h3>
          <div style="display:flex; flex-direction:column; gap:10px; margin-top:15px;">
            ${topListen?.map((s, i) => `
              <div style="display:flex; justify-content:space-between; align-items:center; background:#151515; padding:10px 15px; border-radius:8px;">
                <span><small style="color:#444;">#${i+1}</small> ${s.title}</span>
                <span style="color:#64D28A; font-weight:bold;">${s.listen_count||0} 🎧</span>
              </div>
            `).join('') || '<p style="color:#444;">暂无收听数据</p>'}
          </div>
        </div>
      </div>
    `;
  }

  async function renderMusic(container) {
    const { data: songs } = await db.from('music_works').select('*').order('created_at', {ascending: false});
    const { data: cfg } = await db.from('site_config').select('value').eq('key', 'cfg_latest_music_id').maybeSingle();
    const latestId = cfg?.value;

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem;">
        <h1 style="color:var(--gold);">音乐作品管理</h1>
        <button class="btn btn-submit" style="width:auto; padding:10px 25px;" onclick="openMusicModal()">+ 发布新单曲</button>
      </div>
      
      <div style="display:flex; flex-direction:column; gap:20px;">
        ${songs?.map(s => `
          <div style="background:#0a0a0a; border:1px solid #222; border-radius:12px; padding:20px; transition:0.3s; position:relative;">
            
            <!-- 第一排：核心信息 -->
            <div style="display:flex; gap:20px; align-items:center; margin-bottom:15px; padding-bottom:15px; border-bottom:1px solid #1a1a1a;">
              <img src="${(s.cover_url && s.cover_url.startsWith('http')) ? s.cover_url : 'https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&w=400&q=80'}" 
                   style="width:80px; height:80px; object-fit:cover; border-radius:8px; border:1px solid #333;"
                   onerror="this.src='https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80'">
              <div style="flex:1;">
                <h3 style="margin:0; color:#fff; font-size:1.2rem;">${s.title} ${s.id === latestId || s.is_latest ? '<span style="color:var(--gold); font-size:0.7rem; background:rgba(246,210,138,0.1); padding:2px 8px; border-radius:50px; margin-left:10px;">HOME FEATURED</span>' : ''}</h3>
                <p style="margin:5px 0 0 0; color:#666; font-size:0.85rem; line-height:1.4;">${s.description || '暂无作品简介...'}</p>
                <div style="display:flex; gap:15px; margin-top:8px;">
                   <span style="font-size:0.75rem; color:#444;">📺 YouTube: ${s.audio_url ? '已链接' : '未设置'}</span>
                   <span style="font-size:0.75rem; color:#444;">📄 歌谱: ${s.score_url ? '已上传' : '未设置'}</span>
                </div>
              </div>
            </div>

            <!-- 第二排：操作按钮 -->
            <div style="display:flex; gap:10px; justify-content: flex-end;">
              <button class="btn-tiny" style="padding:8px 25px;" onclick="openMusicModal('${s.id}')">⚙️ 编辑详细资料 (Edit)</button>
              <button class="btn-tiny danger" style="padding:8px 15px;" onclick="deleteItem('music_works', '${s.id}')">🗑️ 删除 (Delete)</button>
            </div>

          </div>
        `).join('') || '<p style="text-align:center; color:#444; padding:50px;">暂无数据，请发布您的第一首单曲</p>'}
      </div>
    `;
  }

  window.openMusicModal = async (id = null) => {
    const btn = event.currentTarget;
    const originalText = btn.innerText;
    if (id) { btn.innerText = "⏳ 正在拉取数据..."; btn.disabled = true; }

    try {
      let s = null;
      if (id) {
        const { data, error } = await db.from('music_works').select('*').eq('id', id).single();
        if (error) throw error;
        const { data: cfg } = await db.from('site_config').select('value').eq('key', 'cfg_latest_music_id').maybeSingle();
        s = { ...data, force_latest: data.id === cfg?.value };
      }
      const isEdit = !!s;
      const modal = document.createElement('div');
      modal.id = 'musicEditModal';
      modal.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:9999; display:flex; justify-content:center; align-items:center; backdrop-filter:blur(10px); padding:20px;";
      modal.innerHTML = `
        <div style="background:#111; border:1px solid var(--gold); border-radius:16px; padding:2rem; width:100%; max-width:550px; max-height:90vh; overflow-y:auto; box-shadow:0 20px 60px rgba(0,0,0,1);">
          <h2 style="color:var(--gold); margin-bottom:1.5rem; text-align:center;">${isEdit ? '编辑详细资料' : '发布新单曲'}</h2>
          
          <div style="margin-bottom:20px; background:#0a0a0a; padding:15px; border-radius:12px; border:1px solid #222;">
            <label style="display:block; margin-bottom:10px; color:#aaa; font-size:0.8rem;">封面照片 (Cover Image)</label>
            <img id="m_prev" src="${s?.cover_url || 'https://via.placeholder.com/300x300?text=Harvester+Cover'}" style="width:120px; height:120px; object-fit:cover; border-radius:8px; display:block; margin:0 auto 15px; border:1px solid #333; background:#222;">
            <input type="file" id="mf_up" style="font-size:0.8rem; color:#888;">
            <button class="btn-tiny" style="margin-top:10px; width:100%;" onclick="uploadFile('mf_up', 'm_url', 'm_prev')">📤 上传封面图</button>
            <input type="hidden" id="m_url" value="${s?.cover_url || ''}">
          </div>

          <div style="margin-bottom:15px;">
            <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem;">歌曲名字 (Title)</label>
            <input type="text" id="m_t" value="${s?.title || ''}" placeholder="歌曲名称" style="width:100%; padding:10px;">
          </div>

          <div style="margin-bottom:15px;">
            <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem;">YouTube 链接</label>
            <input type="text" id="m_a" value="${s?.audio_url || ''}" placeholder="https://youtube.com/..." style="width:100%; padding:10px;">
          </div>

          <div style="margin-bottom:15px;">
            <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem;">Google Drive 歌谱链接</label>
            <input type="text" id="m_s" value="${s?.score_url || ''}" placeholder="https://drive.google.com/..." style="width:100%; padding:10px;">
          </div>

          <div style="margin-bottom:15px;">
            <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem;">歌曲简介 (Description)</label>
            <textarea id="m_d" placeholder="简单介绍一下这首作品..." style="width:100%; height:80px; padding:10px;">${s?.description || ''}</textarea>
          </div>

          <div style="margin: 15px 0;">
            <label style="display:flex; align-items:center; gap:10px; cursor:pointer; color:var(--gold);">
              <input type="checkbox" id="m_latest" ${s?.force_latest || s?.is_latest ? 'checked' : ''} style="width:auto;"> 
              设为最新歌曲 (首页首屏展示)
            </label>
          </div>

          <div style="display:flex; gap:15px; margin-top:20px; position:sticky; bottom:0; padding-top:10px; background:#111; border-top:1px solid #222;">
            <button class="btn btn-submit" style="flex:2; padding:12px;" onclick="saveMusic('${s?.id || ''}')">💾 保存作品信息</button>
            <button class="btn-tiny" style="flex:1;" onclick="this.closest('#musicEditModal').remove()">取消</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    } catch (err) {
      console.error("openMusicModal Fail:", err);
      alert("❌ 无法加载数据: " + (err.message || err));
    } finally {
      if (id) { btn.innerText = originalText; btn.disabled = false; }
    }
  };

  window.saveMusic = async(id) => {
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = "⏳ 正在保存...";
    btn.disabled = true;

    try {
      const isLatest = document.getElementById('m_latest').checked;
      
      const payload = {
        title: document.getElementById('m_t').value,
        cover_url: document.getElementById('m_url').value,
        audio_url: document.getElementById('m_a').value,
        score_url: document.getElementById('m_s').value,
        description: document.getElementById('m_d').value
        // 🚀 Physical Removal: is_latest is no longer sent to music_works table
      };

      let result;
      if(id) {
        result = await db.from('music_works').update(payload).eq('id', id).select();
      } else {
        result = await db.from('music_works').insert([payload]).select();
      }
      
      if (result.error) throw result.error;

      // Handle "Latest" logic EXCLUSIVELY via site_config (Schema-Safe)
      if (isLatest) {
        const savedId = id || result.data?.[0]?.id;
        if (savedId) {
          await db.from('site_config').upsert({ key: 'cfg_latest_music_id', value: savedId });
        }
      }

      console.log("Music saved successfully!");
      const modal = document.getElementById('musicEditModal');
      if(modal) modal.remove();
      renderCMS();
    } catch (err) {
      console.error("Save error:", err);
      alert("❌ 保存失败: " + err.message);
      btn.innerText = originalText;
      btn.disabled = false;
    }
  };

  // --- 📅 EVENTS MODULE (Upgraded) ---
  // --- 📅 EVENTS MODULE (Upgraded with Order Controls & Full Details) ---
  async function renderEvents(container) {
    let rawEvents = [];
    try {
      const { data, error } = await db.from('events').select('*');
      if (error) console.warn("Events fetch note:", error);
      rawEvents = data || [];
    } catch(err) {
      console.error("Events fetch error:", err);
    }

    const { data: bannerCfg } = await db.from('site_config').select('value').eq('key', 'cfg_events_banner').maybeSingle();
    const currentBanner = bannerCfg?.value || '';

    // Fetch custom order from site_config
    const { data: ordCfg } = await db.from('site_config').select('value').eq('key', 'cfg_events_order').maybeSingle();
    let customOrderIds = ordCfg?.value ? ordCfg.value.split(',').filter(Boolean) : [];

    // Parse metadata for maximum robustness
    const events = rawEvents.map(e => {
      let desc = e.description || "";
      let evDate = e.event_date || e.date || "";
      let evTime = e.event_time || e.time || "";
      let loc = e.location || e.loc || "";
      let murl = e.map_url || e.mapUrl || "";
      let img = e.image_url || e.cover_url || "";
      let et = e.email_template || "";
      let ord = e.display_order ?? 0;
      let stag = e.status_tag || "";
      let turl = e.ticket_url || "";
      let ttext = e.ticket_text || "前往购票/索票/报名";
      let reqTicket = true;
      if (e.requires_ticket !== undefined && e.requires_ticket !== null) {
        reqTicket = e.requires_ticket === true || e.requires_ticket === 'true' || e.requires_ticket === 1 || e.requires_ticket === '1';
      }

      const metaMatch = desc.match(/EXT_META:(.*?)\|\|/);
      if (metaMatch) {
        try {
          const meta = JSON.parse(metaMatch[1]);
          evDate = meta.d || meta.date || meta.event_date || evDate;
          evTime = meta.tm || meta.time || meta.event_time || meta.start_time || meta.t || evTime;
          loc = meta.loc || meta.location || meta.place || meta.venue || loc;
          murl = meta.murl || meta.map_url || meta.mapUrl || murl;
          img = meta.img || meta.image_url || meta.cover_url || img;
          et = meta.et || meta.email_template || et;
          ord = meta.ord ?? meta.display_order ?? ord;
          stag = meta.status_tag || meta.stag || stag;
          turl = meta.ticket_url || meta.turl || turl;
          ttext = meta.ticket_text || meta.ttext || ttext;
          if (meta.rt !== undefined) reqTicket = meta.rt === true || meta.rt === 'true' || meta.rt === 1 || meta.rt === '1';
          if (meta.requires_ticket !== undefined) reqTicket = meta.requires_ticket === true || meta.requires_ticket === 'true' || meta.requires_ticket === 1 || meta.requires_ticket === '1';
          if (meta.req_ticket !== undefined) reqTicket = meta.req_ticket === true || meta.req_ticket === 'true' || meta.req_ticket === 1 || meta.req_ticket === '1';
          desc = desc.replace(metaMatch[0], '').trim();
        } catch (err) {
          desc = desc.replace(metaMatch[0], '').trim();
        }
      }

      // Title status tag extraction if present
      let rawTitle = e.title || "";
      const titleTagMatch = rawTitle.match(/^(\[[^\]]+\]|\【[^\】]+\】)/);
      if (!stag && titleTagMatch) {
        stag = titleTagMatch[1];
        rawTitle = rawTitle.replace(titleTagMatch[0], '').trim();
      }

      if (!evTime && evDate) {
        if (evDate.includes('T')) {
          const parts = evDate.split('T');
          evDate = parts[0];
          if (parts[1]) evTime = parts[1].replace('Z', '').substring(0, 5);
        } else if (evDate.includes(' ')) {
          const m = evDate.match(/^(.*?)[ ]+([0-9]{1,2}[:：.][0-9]{2})/);
          if (m) { evDate = m[1].trim(); evTime = m[2].trim(); }
        }
      }

      return {
        ...e,
        title: rawTitle,
        status_tag: stag,
        event_date: evDate,
        event_time: evTime,
        location: loc,
        map_url: murl,
        image_url: img,
        ticket_url: turl,
        ticket_text: ttext,
        requires_ticket: reqTicket,
        email_template: et,
        display_order: parseInt(ord, 10) || 0,
        description: desc
      };
    });

    // 排序逻辑：
    // 1. cfg_events_order 自定义排序优先
    // 2. 其次按 display_order 升序
    // 3. 再次按日期
    events.sort((a, b) => {
      if (customOrderIds.length > 0) {
        const idxA = customOrderIds.indexOf(String(a.id));
        const idxB = customOrderIds.indexOf(String(b.id));
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
      }
      if (a.display_order !== b.display_order) return a.display_order - b.display_order;
      if (a.event_date && b.event_date) return a.event_date.localeCompare(b.event_date);
      return (b.created_at || '').localeCompare(a.created_at || '');
    });

    // Keep global events list for order swapping
    window._currentAdminEvents = events;

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:12px;">
        <div>
          <h1 style="color:var(--gold); margin:0;">📅 活动排期与详情管理 (Events CMS)</h1>
          <p style="color:#888; font-size:0.85rem; margin-top:4px;">可直接使用 ⬆️ ⬇️ 调整活动前后顺序，或进入编辑修改地点、标签、购票链接与海报等细节。</p>
        </div>
        <div style="display:flex; gap:10px;">
          <button class="btn btn-submit" style="width:auto; padding:10px 22px; background:#333; color:#ccc;" onclick="triggerBlast()">🚀 一键发送提醒</button>
          <button class="btn btn-submit" style="width:auto; padding:10px 25px;" onclick="openEventModal()">+ 发布新活动</button>
        </div>
      </div>

      <!-- 🌟 精彩活动页面顶部主海报管理卡片 -->
      <div style="background:#0e0e0e; border:1px solid rgba(246,210,138,0.25); border-radius:14px; padding:20px; margin-bottom:28px; box-shadow:0 8px 30px rgba(0,0,0,0.6);">
        <div style="margin-bottom:12px;">
          <h3 style="margin:0; color:var(--gold); font-size:1.05rem; display:flex; align-items:center; gap:8px;">
            <i class="fas fa-image"></i> 精彩活动 顶部主海报 (Events Top Banner)
          </h3>
          <p style="margin:4px 0 0 0; color:#888; font-size:0.8rem;">
            在此上传的海报将置顶展示在活动页面标题正下方。留空则自动选用排在第 1 位的活动海报。
          </p>
        </div>
        <div style="display:grid; grid-template-columns: minmax(220px, 320px) 1fr; gap:20px; align-items:center; background:#050505; padding:15px; border-radius:10px; border:1px solid #1c1c1c;">
          <div>
            <img id="ev_hero_prev" src="${currentBanner || 'https://via.placeholder.com/1200x500?text=Events+Hero+Banner'}" style="width:100%; max-height:140px; object-fit:contain; border-radius:8px; border:1px solid #333; background:#111;">
          </div>
          <div>
            <label style="display:block; font-size:0.75rem; color:#aaa; margin-bottom:6px;">选择新海报图片 (推荐比例 21:9 或 16:9)</label>
            <input type="file" id="f_ev_hero" style="font-size:0.8rem; color:#aaa; margin-bottom:10px; width:100%;">
            <input type="hidden" id="url_ev_hero" value="${currentBanner}">
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
              <button class="btn-tiny" style="padding:8px 16px; background:rgba(246,210,138,0.15); border-color:var(--gold); color:var(--gold); font-weight:600;" onclick="uploadAndSaveEventsBanner('f_ev_hero', 'url_ev_hero', 'ev_hero_prev')">📤 上传并设为主海报</button>
              ${currentBanner ? `<button class="btn-tiny danger" style="padding:8px 14px;" onclick="clearEventsBanner()">✖ 移除独立主海报</button>` : ''}
            </div>
          </div>
        </div>
      </div>

      <!-- 🌟 各活动列表与顺序调整 (Strip Manager Table) -->
      <div style="background:#0a0a0a; border:1px solid #222; border-radius:12px; padding:20px;">
        <div style="margin-bottom:15px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <h3 style="margin:0; color:var(--gold); font-size:1.05rem;">
            <i class="fas fa-list-ol"></i> 活动排期与排序列表 (${events.length} 个活动)
          </h3>
          <span style="font-size:0.8rem; color:#888;">使用 <b>⬆️ ⬇️</b> 按钮可直接上下调整活动排期顺序</span>
        </div>

        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; color:#eee; min-width:750px;">
            <thead>
              <tr style="border-bottom:1px solid #333; text-align:left; background:#111; font-size:0.8rem; color:#888;">
                <th style="padding:14px; width:90px; text-align:center;">排序</th>
                <th style="padding:14px; width:100px;">海报</th>
                <th style="padding:14px; width:120px;">日期/时间</th>
                <th style="padding:14px;">活动名称与状态</th>
                <th style="padding:14px;">地点 / 场馆</th>
                <th style="padding:14px;">购票/报名</th>
                <th style="padding:14px; text-align:right; width:150px;">操作</th>
              </tr>
            </thead>
            <tbody>
              ${events.map((e, index) => {
                const isFirst = index === 0;
                const isLast = index === events.length - 1;
                let tagBadge = '';
                if (e.status_tag) {
                  const tagUpper = e.status_tag.toUpperCase();
                  const isSold = tagUpper.includes('SOLD') || tagUpper.includes('售罄');
                  const isCancel = tagUpper.includes('取消') || tagUpper.includes('CANCEL');
                  tagBadge = `<span style="padding:2px 8px; border-radius:4px; font-size:0.75rem; font-weight:bold; margin-right:6px; background:${isSold ? 'rgba(255,107,129,0.15)' : (isCancel ? 'rgba(164,176,190,0.15)' : 'rgba(46,213,115,0.15)')}; color:${isSold ? '#ff6b81' : (isCancel ? '#a4b0be' : '#2ed573')}; border:1px solid ${isSold ? 'rgba(255,107,129,0.3)' : (isCancel ? 'rgba(164,176,190,0.3)' : 'rgba(46,213,115,0.3)')};">${e.status_tag}</span>`;
                }

                return `
                  <tr style="border-bottom:1px solid #1a1a1a; transition:0.25s;" onmouseover="this.style.background='#111'" onmouseout="this.style.background='transparent'">
                    <td style="padding:14px; text-align:center;">
                      <div style="display:flex; align-items:center; justify-content:center; gap:4px;">
                        <button class="btn-tiny" ${isFirst ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : ''} onclick="moveEventOrder('${e.id}', 'up')" title="上移一位">⬆️</button>
                        <button class="btn-tiny" ${isLast ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : ''} onclick="moveEventOrder('${e.id}', 'down')" title="下移一位">⬇️</button>
                      </div>
                      <span style="font-size:0.7rem; color:#666; display:block; margin-top:4px;">#${index + 1}</span>
                    </td>
                    <td style="padding:14px;">
                      <img src="${e.image_url || 'https://via.placeholder.com/600x338?text=Event'}" style="width:75px; height:45px; object-fit:cover; border-radius:6px; border:1px solid #333; background:#000;">
                    </td>
                    <td style="padding:14px; font-size:0.85rem; color:#ccc;">
                      <b style="color:#fff;">${e.event_date || '未定'}</b>
                      <div style="font-size:0.75rem; color:#888;">${e.event_time || ''}</div>
                    </td>
                    <td style="padding:14px;">
                      <div style="font-size:1rem; font-weight:500; color:#fff; display:flex; align-items:center; flex-wrap:wrap; gap:4px;">
                        ${tagBadge}
                        <span>${e.title}</span>
                      </div>
                    </td>
                    <td style="padding:14px; font-size:0.85rem; color:#aaa;">
                      ${e.location || '待定'}
                    </td>
                    <td style="padding:14px; font-size:0.8rem;">
                      ${!e.requires_ticket 
                        ? `<span style="display:inline-flex; align-items:center; gap:5px; color:#aaa; background:rgba(255,255,255,0.06); padding:3px 8px; border-radius:50px; font-size:0.75rem; border:1px solid rgba(255,255,255,0.1);"><i class="fas fa-bell" style="color:var(--gold);"></i> 仅铃铛提醒 (免购票)</span>` 
                        : (e.ticket_url ? `<a href="${e.ticket_url}" target="_blank" style="color:var(--gold); text-decoration:underline;">${e.ticket_text || '外部链接'} ↗</a>` : `<span style="color:#666;">站内详情</span>`)}
                    </td>
                    <td style="padding:14px; text-align:right; white-space:nowrap;">
                      <button class="btn-tiny" style="margin-right:6px; border-color:var(--gold); color:var(--gold);" onclick="openEventModal('${e.id}')">✏️ 编辑</button>
                      <button class="btn-tiny danger" onclick="deleteItem('events', '${e.id}')" title="删除活动">🗑️</button>
                    </td>
                  </tr>
                `;
              }).join('') || '<tr><td colspan="7" style="padding:40px; text-align:center; color:#666;">暂无活动，请点击右上角「发布新活动」</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // --- 🌟 上移 / 下移 活动排序逻辑 ---
  window.moveEventOrder = async (id, direction) => {
    const list = window._currentAdminEvents || [];
    const index = list.findIndex(e => String(e.id) === String(id));
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === list.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    // Swap
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    const newOrderIds = list.map(e => String(e.id));

    try {
      await db.from('site_config').upsert({
        key: 'cfg_events_order',
        value: newOrderIds.join(',')
      }, { onConflict: 'key' });

      // Also update display_order on items where possible
      for (let i = 0; i < list.length; i++) {
        try {
          await db.from('events').update({ display_order: i }).eq('id', list[i].id);
        } catch(e){}
      }

      renderCMS();
    } catch(err) {
      alert("排序更新失败: " + err.message);
    }
  };
  
  window.uploadAndSaveEventsBanner = async (fileInputId, targetId, previewId) => {
    const fileInput = document.getElementById(fileInputId);
    const file = fileInput?.files?.[0];
    if(!file) return alert("请先选择要上传的海报图片文件");
    const btn = event.currentTarget;
    const origText = btn.innerText;
    btn.innerText = "⏳ 正在上传并同步...";
    btn.disabled = true;
    try {
      let uploadFileObj = file;
      if (file.type.startsWith('image/')) {
        uploadFileObj = await compressImage(file);
      }
      const safeName = uploadFileObj.name.replace(/[^\w.-]/g, "_");
      const path = `banners/${Date.now()}-${safeName}`;
      const { data, error } = await db.storage.from('harvester-media').upload(path, uploadFileObj);
      if(error) throw error;
      const { data: { publicUrl } } = db.storage.from('harvester-media').getPublicUrl(path);
      
      document.getElementById(targetId).value = publicUrl;
      const prevEl = document.getElementById(previewId);
      if(prevEl) prevEl.src = publicUrl;

      await db.from('site_config').upsert({ key: 'cfg_events_banner', value: publicUrl }, { onConflict: 'key' });
      alert("✅ 精彩活动主海报已成功上传并生效！");
      renderCMS();
    } catch(err) {
      alert("上传失败: " + err.message);
    } finally {
      btn.innerText = origText;
      btn.disabled = false;
    }
  };

  window.clearEventsBanner = async () => {
    if(!confirm("确定要移除独立主海报吗？移除后活动页面将自动展示排在第 1 位的活动海报。")) return;
    try {
      await db.from('site_config').upsert({ key: 'cfg_events_banner', value: '' }, { onConflict: 'key' });
      alert("✅ 已移除独立主海报，现已恢复为自动展示首位活动海报。");
      renderCMS();
    } catch(err) {
      alert("操作失败: " + err.message);
    }
  };
  
  window.triggerBlast = async () => {
    if(!confirm("确定要立即发送所有处于‘未发送’状态的活动提醒邮件吗？")) return;
    const originalText = event.currentTarget.innerText;
    event.currentTarget.innerText = "⏳ 正在发送中...";
    try {
      const res = await fetch('/api/blast');
      const data = await res.json();
      alert(data.message || "发送指令已下达！");
    } catch(e) {
      alert("发送失败: " + e.message);
    } finally {
      event.currentTarget.innerText = originalText;
    }
  };
  
  window.openEventModal = async (id = null) => {
    const btn = event.currentTarget;
    const originalText = btn ? btn.innerText : '';
    if (id && btn) { btn.innerText = "⏳ 正在拉取..."; btn.disabled = true; }

    try {
      let e = null;
      if (id) {
        const { data, error } = await db.from('events').select('*').eq('id', id).single();
        if (error) throw error;
        e = data;

        let evDate = e.event_date || e.date || "";
        let evTime = e.event_time || e.time || "";
        let loc = e.location || e.loc || "";
        let murl = e.map_url || e.mapUrl || "";
        let img = e.image_url || e.cover_url || "";
        let et = e.email_template || "";
        let ord = e.display_order ?? 0;
        let desc = e.description || "";
        let stag = e.status_tag || "";
        let turl = e.ticket_url || "";
        let ttext = e.ticket_text || "前往购票/索票/报名";
        let reqTicket = true;
        if (e.requires_ticket !== undefined && e.requires_ticket !== null) {
          reqTicket = e.requires_ticket === true || e.requires_ticket === 'true' || e.requires_ticket === 1 || e.requires_ticket === '1';
        }

        if (desc.includes('EXT_META:')) {
           const metaMatch = desc.match(/EXT_META:(.*?)\|\|/);
           if (metaMatch) {
              try {
                const meta = JSON.parse(metaMatch[1]);
                evDate = meta.d || meta.date || meta.event_date || evDate;
                evTime = meta.tm || meta.time || meta.event_time || meta.start_time || meta.t || evTime;
                loc = meta.loc || meta.location || meta.place || meta.venue || loc;
                murl = meta.murl || meta.map_url || meta.mapUrl || murl;
                img = meta.img || meta.image_url || meta.cover_url || img;
                et = meta.et || meta.email_template || et;
                ord = meta.ord ?? meta.display_order ?? ord;
                stag = meta.status_tag || meta.stag || stag;
                turl = meta.ticket_url || meta.turl || turl;
                ttext = meta.ticket_text || meta.ttext || ttext;
                if (meta.rt !== undefined) reqTicket = meta.rt === true || meta.rt === 'true' || meta.rt === 1 || meta.rt === '1';
                if (meta.requires_ticket !== undefined) reqTicket = meta.requires_ticket === true || meta.requires_ticket === 'true' || meta.requires_ticket === 1 || meta.requires_ticket === '1';
                if (meta.req_ticket !== undefined) reqTicket = meta.req_ticket === true || meta.req_ticket === 'true' || meta.req_ticket === 1 || meta.req_ticket === '1';
                desc = desc.replace(metaMatch[0], '').trim();
              } catch(err) {
                desc = desc.replace(metaMatch[0], '').trim();
              }
           }
        }

        let rawTitle = e.title || "";
        const titleTagMatch = rawTitle.match(/^(\[[^\]]+\]|\【[^\】]+\】)/);
        if (!stag && titleTagMatch) {
          stag = titleTagMatch[1];
          rawTitle = rawTitle.replace(titleTagMatch[0], '').trim();
        }

        if (!evTime && evDate) {
          if (evDate.includes('T')) {
            const parts = evDate.split('T');
            evDate = parts[0];
            if (parts[1]) evTime = parts[1].replace('Z', '').substring(0, 5);
          } else if (evDate.includes(' ')) {
            const m = evDate.match(/^(.*?)[ ]+([0-9]{1,2}[:：.][0-9]{2})/);
            if (m) { evDate = m[1].trim(); evTime = m[2].trim(); }
          }
        }

        e = {
          ...e,
          title: rawTitle,
          status_tag: stag,
          event_date: evDate,
          event_time: evTime,
          location: loc,
          map_url: murl,
          image_url: img,
          ticket_url: turl,
          ticket_text: ttext,
          requires_ticket: reqTicket,
          email_template: et,
          display_order: ord,
          description: desc
        };
      }

      const isEdit = !!e;
      const modal = document.createElement('div');
      modal.id = "eventEditModal";
      modal.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:9999; display:flex; justify-content:center; align-items:center; backdrop-filter:blur(8px); padding:20px;";
      modal.innerHTML = `
        <div style="background:#111; border:1px solid var(--gold); border-radius:16px; padding:2rem; width:100%; max-width:600px; max-height:90vh; overflow-y:auto; position:relative; box-shadow: 0 20px 60px rgba(0,0,0,1);">
          <h2 style="color:var(--gold); margin-bottom:1.5rem; text-align:center;">${isEdit ? '编辑活动详情' : '发布新活动'}</h2>
          
          <!-- 活动海报 -->
          <div style="margin-bottom:20px; background: #0a0a0a; padding: 15px; border-radius: 12px; border:1px solid #222;">
            <label style="display:block; margin-bottom:8px; color:#aaa; font-size:0.8rem; text-transform:uppercase; letter-spacing:1px;">活动海报预览 (Poster)</label>
            <img id="ev_prev" src="${e?.image_url || 'https://via.placeholder.com/1920x1080?text=Harvester+Event'}" style="width:100%; max-height:180px; object-fit:cover; border-radius:8px; margin-bottom:10px; border:1px solid #333;">
            <input type="file" id="f_ev" style="font-size:0.8rem; color:#888;">
            <button class="btn-tiny" style="margin-top:10px; width:100%; padding:8px;" onclick="uploadFile('f_ev', 'ev_url', 'ev_prev')">📤 上传活动海报图片</button>
            <input type="hidden" id="ev_url" value="${e?.image_url || ''}">
          </div>

          <!-- 标题与状态标签 -->
          <div style="display:grid; grid-template-columns: 2fr 1fr; gap:15px; margin-bottom:15px;">
            <div>
              <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem;">活动名称 (Title)</label>
              <input type="text" id="ev_t" value="${e?.title || ''}" placeholder="例如：东京敬拜赞美节庆" style="width:100%; padding:10px;">
            </div>
            <div>
              <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem;">状态标签 (Tag)</label>
              <input type="text" id="ev_stag" value="${e?.status_tag || ''}" placeholder="如 [SOLD OUT] 或 [已取消]" style="width:100%; padding:10px;">
            </div>
          </div>

          <!-- 日期与时间 -->
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin-bottom:15px;">
            <div>
              <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem;">活动日期 (Date)</label>
              <input type="date" id="ev_d" value="${e?.event_date || ''}" style="width:100%; padding:10px;">
            </div>
            <div>
              <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem;">开始时间 (Time)</label>
              <input type="time" id="ev_tm" value="${e?.event_time || ''}" style="width:100%; padding:10px;">
            </div>
          </div>

          <!-- 地点与地图 -->
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin-bottom:15px;">
            <div>
              <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem;">地点/场馆 (Venue - City)</label>
              <input type="text" id="ev_l" value="${e?.location || ''}" placeholder="例如：YOHAN TOKYO CHRIST CHURCH - 东京" style="width:100%; padding:10px;">
            </div>
            <div>
              <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem;">Google Map 地图链接 (可选)</label>
              <input type="text" id="ev_ml" value="${e?.map_url || ''}" placeholder="https://maps.app.goo.gl/..." style="width:100%; padding:10px;">
            </div>
          </div>

          <!-- 是否需要购票/报名 (勾选切换) -->
          <div style="background:#0e0e0e; border:1px solid #222; border-radius:12px; padding:15px; margin-bottom:15px;">
            <label style="display:flex; align-items:center; gap:12px; cursor:pointer; font-size:0.9rem; color:#fff; font-weight:600; user-select:none;">
              <input type="checkbox" id="ev_req_ticket" ${e && e.requires_ticket === false ? '' : 'checked'} onchange="document.getElementById('ev_ticket_fields').style.display = this.checked ? 'grid' : 'none';" style="width:20px; height:20px; accent-color:var(--gold); cursor:pointer;">
              <span>需要购票 / 报名 / 索票 (Require Ticket or Registration)</span>
            </label>
            <p style="margin:6px 0 0 32px; font-size:0.75rem; color:#888; line-height:1.5;">
              💡 <b>勾选时</b>：活动列表中会显示【前往购票/索票/报名】按钮与铃铛。<br>
              💡 <b>取消勾选时</b>：活动为免购票/免报名开放活动，<b>前台仅显示铃铛提醒图标</b>。
            </p>
          </div>

          <!-- 购票/报名链接与按钮文字 (根据勾选状态展示/折叠) -->
          <div id="ev_ticket_fields" style="display:${e && e.requires_ticket === false ? 'none' : 'grid'}; grid-template-columns: 2fr 1.2fr; gap:15px; margin-bottom:15px;">
            <div>
              <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem;">购票/索票/报名链接 (Ticket URL)</label>
              <input type="text" id="ev_turl" value="${e?.ticket_url || ''}" placeholder="https://... 留空则链接到站内详情" style="width:100%; padding:10px;">
            </div>
            <div>
              <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem;">按钮文字 (Button Text)</label>
              <input type="text" id="ev_ttext" value="${e?.ticket_text || '前往购票/索票/报名'}" placeholder="前往购票/索票/报名" style="width:100%; padding:10px;">
            </div>
          </div>

          <!-- 排位顺序 -->
          <div style="margin-bottom:15px;">
            <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem;">显示排序序号 Order (数值越小排在越前面)</label>
            <input type="number" id="ev_order" value="${e?.display_order || 0}" style="width:100%; padding:10px;">
          </div>

          <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem;">活动详情描述 (Description)</label>
          <textarea id="ev_desc" placeholder="请输入活动详情描述..." style="width:100%; height:90px; margin-bottom:15px; padding:10px;">${e?.description || ''}</textarea>

          <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem;">定制提醒邮件内容 (Email Notification Template)</label>
          <textarea id="ev_email" placeholder="输入在活动前给订阅听众发送的专属提醒通知..." style="width:100%; height:70px; margin-bottom:20px; padding:10px;">${e?.email_template || ''}</textarea>

          <div style="display:flex; gap:15px; position:sticky; bottom:0; background:#111; padding-top:10px; border-top:1px solid #222;">
            <button class="btn btn-submit" id="btnSaveEventSubmit" style="flex:2; padding:12px;" onclick="saveEvent('${e?.id || ''}')">🚀 保存活动信息</button>
            <button class="btn-tiny" style="flex:1;" onclick="this.closest('#eventEditModal').remove()">取消</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    } catch (err) {
      console.error("openEventModal Fail:", err);
      alert("😰 无法加载活动数据: " + (err.message || err));
    } finally {
      if (id && btn) { btn.innerText = originalText; btn.disabled = false; }
    }
  };

  window.saveEvent = async(id) => {
    const btn = document.getElementById('btnSaveEventSubmit');
    const originalText = btn ? btn.innerText : '保存';
    if (btn) { btn.innerText = "⏳ 正在同步到云端..."; btn.disabled = true; }

    const reqTicket = document.getElementById('ev_req_ticket').checked;
    const rawTitle = document.getElementById('ev_t').value.trim();
    const stag = document.getElementById('ev_stag').value.trim();
    const finalTitle = stag ? `${stag} ${rawTitle}` : rawTitle;

    const payload = {
      title: finalTitle,
      event_date: document.getElementById('ev_d').value,
      event_time: document.getElementById('ev_tm').value,
      location: document.getElementById('ev_l').value,
      map_url: document.getElementById('ev_ml').value,
      image_url: document.getElementById('ev_url').value,
      ticket_url: reqTicket ? document.getElementById('ev_turl').value.trim() : '',
      ticket_text: reqTicket ? (document.getElementById('ev_ttext').value.trim() || '前往购票/索票/报名') : '',
      requires_ticket: reqTicket,
      status_tag: stag,
      email_template: document.getElementById('ev_email').value,
      description: document.getElementById('ev_desc').value,
      display_order: parseInt(document.getElementById('ev_order').value, 10) || 0
    };

    if (!payload.title) {
      alert("请输入活动名称");
      if (btn) { btn.innerText = originalText; btn.disabled = false; }
      return;
    }

    try {
      // 1. 尝试直接保存
      let saveRes = id 
        ? await db.from('events').update(payload).eq('id', id)
        : await db.from('events').insert([payload]).select();

      if (saveRes.error) {
        console.warn("Direct save failed, packing structured meta into description fallback:", saveRes.error);
        const meta = {
          d: payload.event_date,
          tm: payload.event_time,
          loc: payload.location,
          murl: payload.map_url,
          img: payload.image_url,
          turl: payload.ticket_url,
          ttext: payload.ticket_text,
          rt: payload.requires_ticket,
          requires_ticket: payload.requires_ticket,
          req_ticket: payload.requires_ticket,
          stag: payload.status_tag,
          et: payload.email_template,
          ord: payload.display_order
        };
        const fallbackPayload = {
          title: payload.title,
          date: payload.event_date || new Date().toISOString().split('T')[0],
          description: `EXT_META:${JSON.stringify(meta)}||${payload.description}`
        };
        
        const fRes = id 
          ? await db.from('events').update(fallbackPayload).eq('id', id)
          : await db.from('events').insert([fallbackPayload]);
        
        if (fRes.error) throw fRes.error;
      }
      
      const modal = document.getElementById('eventEditModal');
      if(modal) modal.remove();
      alert("✅ 活动信息已成功保存并同步！");
      renderCMS();
    } catch(err) {
      console.error("Save error:", err);
      alert("❌ 保存失败: " + err.message);
      if (btn) { btn.innerText = originalText; btn.disabled = false; }
    }
  };

  // --- 🎙️ SINGER MODULE ---
  async function renderSingers(container) {
    const { data: singers } = await db.from('singers').select('*').order('display_order', {ascending: true});
    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem;">
        <h1 style="color:var(--gold);">歌手管理 Singers Management</h1>
        <button class="btn btn-submit" style="width:auto; padding:10px 25px;" onclick="addSinger()">+ 邀请新歌手</button>
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:20px;">
        ${singers?.map(s => `
          <div style="background:#1a1a1a; padding:20px; border-radius:12px; border:1px solid #222;">
            <img src="${s.image_url || 'https://via.placeholder.com/300x400?text=Singer'}" style="width:100%; aspect-ratio:3/4; object-fit:cover; border-radius:8px; margin-bottom:15px;">
            <h3 style="margin:0; color:var(--gold);">${s.name}</h3>
            <p style="color:#666; font-size:0.85rem; margin:5px 0 10px;">${s.role || 'Gospel Singer'} <span style="background:rgba(255,255,255,0.1); padding:2px 8px; border-radius:4px; font-size:0.7rem; margin-left:10px;">${s.category === 'worship' ? '敬拜' : '福音'}</span></p>
            <div style="display:flex; gap:10px; margin-top:20px;">
              <button class="btn-tiny" style="flex:1;" onclick="editSinger('${s.id}')">编辑</button>
              <button class="btn-tiny danger" onclick="deleteItem('singers', '${s.id}')">删除</button>
            </div>
          </div>
        `).join('') || '<p>暂无歌手数据</p>'}
      </div>
    `;
  }

  window.addSinger = async() => {
    const modal = document.createElement('div');
    modal.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:999; display:flex; justify-content:center; align-items:center;";
    modal.innerHTML = `
      <div style="background:#111; border:1px solid var(--gold); border-radius:12px; padding:2rem; width:100%; max-width:500px; max-height:90vh; overflow-y:auto;">
        <h3 style="color:var(--gold);">邀请新歌手 Invite New Singer</h3>
        
        <div style="margin-bottom:20px; text-align:center;">
          <img id="sprev_new" src="https://via.placeholder.com/300x400?text=Upload+Photo" style="width:150px; aspect-ratio:3/4; object-fit:cover; border-radius:8px; margin-bottom:10px; background:#222;">
          <input type="file" id="sfup_new" style="display:block; margin:0 auto;">
          <button class="btn-tiny" style="margin-top:10px;" onclick="uploadFile('sfup_new', 'surl_new', 'sprev_new')">上传照片</button>
          <input type="hidden" id="surl_new" value="">
        </div>

        <label>姓名 Name</label>
        <input type="text" id="s_n_new" placeholder="请输入姓名..." style="width:100%; margin-bottom:15px;">

        <label>短简介 Bio (显示在卡片上)</label>
        <input type="text" id="s_role_new" placeholder="例如：CCM 创作人 / 敬拜主领" style="width:100%; margin-bottom:15px;" value="">
        
        <label>详细介绍 Description (显示在弹窗里)</label>
        <textarea id="s_bio_new" placeholder="请输入详细的歌手介绍..." style="width:100%; height:100px; margin-bottom:15px; background:#222; color:#fff; border:1px solid #444; padding:10px;"></textarea>
        <label>展示分类 Category</label>
        <select id="s_cat_new" style="width:100%; margin-bottom:15px; background: #222; color: #fff; padding: 10px; border: 1px solid #444;">
          <option value="gospel">福音歌手 Gospel</option>
          <option value="worship">敬拜歌手 Worship</option>
        </select>
        <div style="margin-top:20px; display:flex; gap:10px;">
          <button class="btn btn-submit" style="flex:1;" onclick="submitNewSinger(this)">确认邀请</button>
          <button class="btn-tiny" style="flex:1;" onclick="this.closest('div').parentElement.parentElement.remove()">取消</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  };

  window.submitNewSinger = async(btn) => {
    const name = document.getElementById('s_n_new').value.trim();
    const role = document.getElementById('s_role_new').value.trim();
    const bio = document.getElementById('s_bio_new').value.trim();
    const category = document.getElementById('s_cat_new').value;
    const image_url = document.getElementById('surl_new').value;
    if(!name) return alert("请输入姓名");
    
    try {
      if(btn) btn.innerText = "处理中...";
      const { error } = await db.from('singers').insert([{ name, role, bio, category, image_url }]);
      if (error) throw error;
      if(btn) btn.closest('div').parentElement.parentElement.remove();
      renderCMS();
    } catch (e) {
      alert("添加失败: " + e.message);
      if(btn) btn.innerText = "确认邀请";
    }
  };

  window.editSinger = async(id) => {
    const { data: s } = await db.from('singers').select('*').eq('id', id).single();
    const modal = document.createElement('div');
    modal.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:999; display:flex; justify-content:center; align-items:center; overflow-y:auto; padding:20px;";
    modal.innerHTML = `
      <div style="background:#111; border:1px solid var(--gold); border-radius:16px; padding:2rem; width:100%; max-width:600px; margin:auto;">
        <h2 style="color:var(--gold); margin-bottom:1.5rem;">编辑歌手档案</h2>
        
        <div style="margin-bottom:20px; text-align:center;">
          <img id="sprev" src="${s.image_url || 'https://via.placeholder.com/300x400'}" style="width:150px; aspect-ratio:3/4; object-fit:cover; border-radius:8px; margin-bottom:10px; background:#222;">
          <input type="file" id="sfup" style="display:block; margin:0 auto;">
          <button class="btn-tiny" style="margin-top:10px;" onclick="uploadFile('sfup', 'surl', 'sprev')">上传照片</button>
          <input type="hidden" id="surl" value="${s.image_url || ''}">
        </div>

        <label>姓名 Name</label>
        <input type="text" id="sn" value="${s.name}" style="width:100%; margin-bottom:15px;">
        
        <label>短简介 Bio (显示在卡片上)</label>
        <input type="text" id="sr" value="${s.role || ''}" style="width:100%; margin-bottom:15px;">

        <label>详细介绍 Description (显示在弹窗里)</label>
        <textarea id="sb" style="width:100%; height:120px; margin-bottom:15px; background:#222; color:#fff; border:1px solid #444; padding:10px;">${s.bio || ''}</textarea>
        
        <label>展示分类 Category</label>
        <select id="scat" style="width:100%; margin-bottom:15px; background: #222; color: #fff; padding: 10px; border: 1px solid #444;">
          <option value="gospel" ${s.category === 'gospel' ? 'selected' : ''}>福音歌手 Gospel</option>
          <option value="worship" ${s.category === 'worship' ? 'selected' : ''}>敬拜歌手 Worship</option>
        </select>
        
        <!-- Details removed as per request -->
        
        <label>排位顺序 Order (越小越靠前)</label>
        <input type="number" id="so" value="${s.display_order || 0}" style="width:100%; margin-bottom:20px;">

        <div style="display:flex; gap:10px;">
          <button class="btn btn-submit" style="flex:2;" onclick="saveSinger('${id}', this)">💾 保存档案</button>
          <button class="btn-tiny" style="flex:1;" onclick="this.closest('div').parentElement.parentElement.remove()">取消</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  };

  window.saveSinger = async(id, btn) => {
    const p = {
      name: document.getElementById('sn').value,
      bio: document.getElementById('sb').value,
      role: document.getElementById('sr').value,
      category: document.getElementById('scat').value,
      image_url: document.getElementById('surl').value,
      display_order: parseInt(document.getElementById('so').value) || 0
    };
    try {
      if(btn) btn.innerText = "保存中...";
      const { error } = await db.from('singers').update(p).eq('id', id);
      if (error) throw error;
      if(btn) btn.closest('div').parentElement.parentElement.remove();
      renderCMS();
    } catch(e) {
      alert("保存失败: " + e.message);
      if(btn) btn.innerText = "💾 保存档案";
    }
  };

  // --- ⏰ REMINDERS MODULE (活动提醒记录) ---
  window.triggerEmailBlast = async () => {
    if(!confirm("确定要立即给下面列表里所有「等待发送」的用户发送提醒邮件吗？")) return;
    const btn = document.getElementById('blastBtn');
    if(btn) { btn.innerText = "🚀 疯狂发信中..."; btn.disabled = true; }
    
    try {
      const res = await fetch('/api/blast', { method: 'POST' });
      const data = await res.json();
      alert(data.message || data.error);
      renderCMS();
    } catch(e) {
      alert("发信系统出错: " + e.message);
      if(btn) { btn.innerText = "🚀 一键群发所有待发提醒"; btn.disabled = false; }
    }
  };

  async function renderReminders(container) {
    const { data: reminders } = await db.from('event_reminders').select('*').order('created_at', {ascending: false});
    
    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem;">
        <h1 style="color:var(--gold);">⏰ 提醒订阅管理 (Event Reminders)</h1>
        <div>
           <button id="blastBtn" class="btn btn-submit" style="padding:10px 20px; background:linear-gradient(135deg, #64D28A 0%, #3ca85f 100%); margin-right:10px;" onclick="triggerEmailBlast()">🚀 一键群发所有待发提醒</button>
           <button class="btn-tiny" onclick="switchModule('reminders')" style="padding:10px;">刷新数据</button>
        </div>
      </div>

      <div style="background:#0a0a0a; border-radius:12px; overflow:hidden; border:1px solid #222; margin-top:15px;">
        <table style="width:100%; text-align:left; border-collapse:collapse;">
          <tr style="background:#151515; color:#666; font-size:0.8rem;">
            <th style="padding:15px;">提交日期</th>
            <th>关联活动</th>
            <th>目标邮箱</th>
            <th>发送状态</th>
            <th>操作</th>
          </tr>
          ${reminders?.map(r => `
            <tr style="border-bottom:1px solid #222;">
              <td style="padding:15px; font-size:0.8rem; color:#888;">${new Date(r.created_at).toLocaleDateString()} ${new Date(r.created_at).toLocaleTimeString().substring(0,5)}</td>
              <td style="color:var(--gold); font-weight:bold;">《${r.eventTitle}》<br><small style="color:#666; font-weight:normal;">时间: ${r.eventDate}</small></td>
              <td style="color:#fff;">${r.userEmail}</td>
              <td><span style="color:${r.reminderSent?'#64D28A':'#e5b05a'}; background:rgba(255,255,255,0.05); padding:4px 8px; border-radius:4px; font-size:0.75rem;">${r.reminderSent ? '✅ 已发邮件' : '⏳ 等待发送'}</span></td>
              <td>
                <button class="btn-tiny danger" onclick="deleteItem('event_reminders', '${r.id}')">删除</button>
              </td>
            </tr>
          `).join('') || '<tr><td colspan="5" style="padding:30px; text-align:center;">暂无任何用户订阅提醒</td></tr>'}
        </table>
      </div>
    `;
  }

  // --- 📮 SUBMISSIONS MODULE ---
  async function renderSubmissions(container) {
    const { data: subs } = await db.from('submissions').select('*').order('created_at', {ascending: false});
    const { data: contacts } = await db.from('contact_messages').select('*').order('created_at', {ascending: false});
    
    // 🛡️ Fetch approved IDs for moderation UI
    const { data: cfg } = await db.from('site_config').select('value').eq('key', 'cfg_approved_echo_ids').maybeSingle();
    const approvedIds = cfg?.value ? cfg.value.split(',') : [];

    container.innerHTML = `
      <h1 style="color:var(--gold); margin-bottom:2rem;">📮 全站收件箱 (Inboxes)</h1>

      <!-- Part 0: Echo Space Moderation (回声空间审核) -->
      <section style="margin-bottom:4rem;">
        <h3 style="color:var(--gold); border-bottom:1px solid #222; padding-bottom:10px;">✨ 回声空间审核 (Echo Moderation)</h3>
        <p style="color:#666; font-size:0.85rem; margin-top:5px;">此处审核通过的内容将以 X 轴漂浮方式呈现在“回声空间”页面。</p>
        <div style="background:#0a0a0a; border-radius:12px; overflow:hidden; border:1px solid #222; margin-top:15px;">
          <table style="width:100%; text-align:left; border-collapse:collapse;">
            <tr style="background:#151515; color:#666; font-size:0.8rem;">
              <th style="padding:15px;">留言内容</th><th>状态</th><th>操作</th>
            </tr>
            ${contacts?.filter(c => c.message?.includes('[ECHO]')).map(c => {
              const isApproved = approvedIds.includes(c.id.toString());
              return `
              <tr style="border-bottom:1px solid #222;">
                <td style="padding:15px; color:#ccc;">
                  <div style="color:var(--gold); font-size:0.75rem; margin-bottom:4px;">${new Date(c.created_at).toLocaleDateString()} ${c.name}</div>
                  ${c.message.replace('[ECHO]', '')}
                </td>
                <td>
                  <span style="padding:4px 8px; border-radius:4px; font-size:0.75rem; background:${isApproved ? 'rgba(100,210,138,0.1)' : 'rgba(255,255,255,0.05)'}; color:${isApproved ? '#64D28A' : '#444'}">
                    ${isApproved ? '✅ 已在回声空间显示' : '🚫 隐藏中'}
                  </span>
                </td>
                <td>
                  <button class="btn-tiny" onclick="toggleEchoApproval('${c.id}', ${isApproved})">${isApproved ? '取消批准' : '批准显示'}</button>
                  <button class="btn-tiny danger" onclick="deleteItem('contact_messages', '${c.id}')">删除</button>
                </td>
              </tr>
              `;
            }).join('') || '<tr><td colspan="3" style="padding:30px; text-align:center;">暂无回声留言</td></tr>'}
          </table>
        </div>
      </section>
      
      <!-- Part 1: Creative Submissions (我要投稿) -->
      <section style="margin-bottom:4rem;">
        <h3 style="color:#64D28A; border-bottom:1px solid #222; padding-bottom:10px;">🎵 我要投稿 (Creative Submissions)</h3>
        <div style="background:#0a0a0a; border-radius:12px; overflow:hidden; border:1px solid #222; margin-top:15px;">
          <table style="width:100%; text-align:left; border-collapse:collapse;">
            <tr style="background:#151515; color:#666; font-size:0.8rem;">
              <th style="padding:15px;">日期</th><th>投稿人</th><th>预览</th><th>状态</th><th>操作</th>
            </tr>
            ${subs?.map(s => `
              <tr style="border-bottom:1px solid #222;">
                <td style="padding:15px; font-size:0.8rem; color:#666;">${new Date(s.created_at).toLocaleDateString()}</td>
                <td style="color:var(--gold);">${s.user_name}</td>
                <td style="color:#888;">${s.message?.substring(0, 30)}...</td>
                <td><span style="color:${s.status==='pending'?'#e5b05a':'#666'}">${s.status.toUpperCase()}</span></td>
                <td>
                  <button class="btn-tiny" onclick="viewSub('${s.id}')">详情</button>
                  <button class="btn-tiny danger" onclick="deleteItem('submissions', '${s.id}')">删除</button>
                </td>
              </tr>
            `).join('') || '<tr><td colspan="5" style="padding:30px; text-align:center;">尚无粉丝投稿</td></tr>'}
          </table>
        </div>
      </section>

      <!-- Part 2: Contact Messages (联系我们) -->
      <section>
        <h3 style="color:var(--gold); border-bottom:1px solid #222; padding-bottom:10px;">📬 联系与合作 (Contact Inquiries)</h3>
        <div style="background:#0a0a0a; border-radius:12px; overflow:hidden; border:1px solid #222; margin-top:15px;">
          <table style="width:100%; text-align:left; border-collapse:collapse;">
            <tr style="background:#151515; color:#666; font-size:0.8rem;">
              <th style="padding:15px;">日期</th><th>姓名</th><th>Email</th><th>预览</th><th>操作</th>
            </tr>
            ${contacts?.filter(c => !c.message?.includes('[ECHO]')).map(c => `
              <tr style="border-bottom:1px solid #222;">
                <td style="padding:15px; font-size:0.8rem; color:#666;">${new Date(c.created_at).toLocaleDateString()}</td>
                <td style="color:var(--gold);">${c.name}</td>
                <td><small>${c.email}</small></td>
                <td style="color:#888;">${c.message?.substring(0, 30)}...</td>
                <td>
                  <button class="btn-tiny" onclick="viewContact('${c.id}')">查看</button>
                  <button class="btn-tiny danger" onclick="deleteItem('contact_messages', '${c.id}')">删除</button>
                </td>
              </tr>
            `).join('') || '<tr><td colspan="5" style="padding:30px; text-align:center;">暂无合作留言</td></tr>'}
          </table>
        </div>
      </section>
    `;
  }

  window.toggleEchoApproval = async(id, currentlyApproved) => {
    try {
      const { data: cfg } = await db.from('site_config').select('value').eq('key', 'cfg_approved_echo_ids').maybeSingle();
      let currentIds = cfg?.value ? cfg.value.split(',').filter(Boolean) : [];
      
      if (currentlyApproved) {
        currentIds = currentIds.filter(cid => cid !== id.toString());
        await db.from('contact_messages').update({ status: 'pending' }).eq('id', id);
      } else {
        if (!currentIds.includes(id.toString())) currentIds.push(id.toString());
        await db.from('contact_messages').update({ status: 'approved' }).eq('id', id);
      }
      
      await db.from('site_config').upsert({ key: 'cfg_approved_echo_ids', value: currentIds.join(',') }, { onConflict: 'key' });
      renderCMS();
    } catch(err) {
      alert("操作失败: " + err.message);
    }
  };

  // --- Modal Helpers ---
  window.viewContact = async(id) => {
    const { data: c } = await db.from('contact_messages').select('*').eq('id', id).single();
    const modal = document.createElement('div');
    modal.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:999; display:flex; justify-content:center; align-items:center;";
    modal.innerHTML = `
      <div style="background:#111; border:1px solid var(--gold); border-radius:12px; padding:2rem; width:100%; max-width:600px;">
        <h3 style="color:var(--gold);">合作咨询详情</h3>
        <p><strong>姓名:</strong> ${c.name}</p>
        <p><strong>Email:</strong> ${c.email}</p>
        <hr style="border:0; border-top:1px solid #222; margin:15px 0;">
        <p style="white-space:pre-wrap; line-height:1.6;">${c.message}</p>
        <div style="margin-top:20px;">
          <button class="btn btn-submit" onclick="this.closest('div').parentElement.parentElement.remove()">关闭详情</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    await db.from('contact_messages').update({status:'reviewed'}).eq('id', id);
  };

  window.viewSub = async(id) => {
    const { data: s } = await db.from('submissions').select('*').eq('id', id).single();
    const modal = document.createElement('div');
    modal.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:999; display:flex; justify-content:center; align-items:center;";
    modal.innerHTML = `
      <div style="background:#111; border:1px solid var(--gold); border-radius:12px; padding:2rem; width:100%; max-width:600px;">
        <h3 style="color:var(--gold);">投稿详情</h3>
        <p><strong>姓名:</strong> ${s.user_name}</p>
        <p><strong>联系方式:</strong> ${s.contact_info}</p>
        <hr style="border:0; border-top:1px solid #222; margin:15px 0;">
        <p style="white-space:pre-wrap;">${s.message}</p>
        ${s.file_url ? `<a href="${s.file_url}" target="_blank" class="btn-tiny" style="display:inline-block; margin-top:10px;">查看附件</a>` : ''}
        <div style="margin-top:20px;">
          <button class="btn btn-submit" onclick="this.closest('div').parentElement.parentElement.remove()">关闭</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    if(s.status === 'pending') await db.from('submissions').update({status:'reviewed'}).eq('id', id);
  };

  // --- ⚙️ CONFIG MODULE ---
  async function renderConfig(container) {
    const { data: configs } = await db.from('site_config').select('*');
    const c = configs.reduce((acc, curr) => { acc[curr.key] = curr.value; return acc; }, {});
    
    container.innerHTML = `
      <h1 style="color:var(--gold); margin-bottom:2rem;">全站内容管理 (CMS Configuration)</h1>
      
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:30px; margin-bottom:40px;">
        <div style="background:#151515; padding:25px; border-radius:12px; border:1px solid #222;">
          <h3 style="color:var(--gold); margin-top:0;"><i class="fas fa-edit"></i> 核心文案与社交链接</h3>
          
          <div style="margin-bottom:15px;">
            <label>关于我们描述 (About Text)</label>
            <textarea id="cfg_about_text" style="width:100%; height:80px; background:#222; border:1px solid #444; color:#fff; padding:10px; border-radius:4px;">${c['cfg_about_text']||''}</textarea>
          </div>

          <div style="margin-bottom:15px;">
            <label>联系我们邮箱 (Contact Email)</label>
            <input type="text" id="cfg_contact_email" value="${c['cfg_contact_email']||''}" style="width:100%; background:#222; border:1px solid #444; color:#fff; padding:8px; border-radius:4px;">
          </div>

          <div style="margin-bottom:15px; padding-top:15px; border-top:1px solid #222;">
            <h4 style="margin-bottom:10px;">社交媒体链接 (Social Links)</h4>
            <label style="font-size:0.7rem; color:#666;">Facebook URL (Global)</label><input type="text" id="cfg_social_fb" value="${c['cfg_social_fb']||''}" style="width:100%; margin-bottom:10px; background:#222; border:1px solid #444; color:#fff;">
            <label style="font-size:0.7rem; color:#666;">Instagram URL</label><input type="text" id="cfg_social_ig" value="${c['cfg_social_ig']||''}" style="width:100%; margin-bottom:10px; background:#222; border:1px solid #444; color:#fff;">
            <label style="font-size:0.7rem; color:#666;">YouTube URL</label><input type="text" id="cfg_social_yt" value="${c['cfg_social_yt']||''}" style="width:100%; background:#222; border:1px solid #444; color:#fff;">
          </div>

          <button class="btn btn-submit" style="margin-top:15px; width:100%;" onclick="saveAllConfigs()">更新设置与文案</button>
        </div>

        <!-- Column 2: Financial & Support -->
        <div style="background:#151515; padding:25px; border-radius:12px; border:1px solid #222;">
          <h3 style="color:var(--gold); margin-top:0;"><i class="fas fa-hand-holding-heart"></i> 支持我们 (Support Info)</h3>
          
          <div style="margin-bottom:15px;">
            <label>银行名称 (Bank Name)</label>
            <input type="text" id="cfg_support_bank" value="${c['cfg_support_bank']||''}" style="width:100%; margin-bottom:10px; background:#222; border:1px solid #444; color:#fff;">
            <label>银行账号 (Account No.)</label>
            <input type="text" id="cfg_support_acc_no" value="${c['cfg_support_acc_no']||''}" style="width:100%; margin-bottom:10px; background:#222; border:1px solid #444; color:#fff;">
            <label>户名 (Account Name)</label>
            <input type="text" id="cfg_support_acc_name" value="${c['cfg_support_acc_name']||''}" style="width:100%; margin-bottom:10px; background:#222; border:1px solid #444; color:#fff;">
          </div>

          <div style="margin-bottom:15px; padding-top:15px; border-top:1px solid #222;">
            <label>TNG / DuitNow 联络信息</label>
            <input type="text" id="cfg_support_tng" value="${c['cfg_support_tng']||''}" style="width:100%; margin-bottom:15px; background:#222; border:1px solid #444; color:#fff;">
            
            <label>DuitNow QR Code</label>
            <img id="prev_qr" src="${c['cfg_support_qr']||''}" style="width:120px; height:120px; object-fit:contain; background:#fff; border-radius:4px; margin:5px 0; display:block;">
            <input type="file" id="f_qr">
            <button class="btn-tiny" style="margin-top:5px; width:100%;" onclick="uploadFile('f_qr', 'url_qr', 'prev_qr')">上传 QR Code</button>
            <input type="hidden" id="url_qr" value="${c['cfg_support_qr']||''}">
          </div>

          <button class="btn btn-submit" style="margin-top:15px; width:100%;" onclick="saveSupportInfo()">保存支持信息</button>
        </div>
      </div>

      <div style="background:#151515; padding:25px; border-radius:12px; border:1px solid #222;">
        <h3 style="color:var(--gold); margin-top:0;"><i class="fas fa-image"></i> 页面海报与背景图 (Banners)</h3>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:20px;">
          
          <div class="banner-edit-item">
            <label>关于我们 品牌宣传视频</label>
            <video id="prev_about_v" src="${c['cfg_about_video']||''}" style="width:100%; height:120px; object-fit:cover; border-radius:4px; margin:10px 0; background:#000;" muted loop playsinline controls></video>
            <input type="file" id="f_about_v">
            <button class="btn-tiny" style="width:100%; margin-top:5px;" onclick="uploadFile('f_about_v', 'url_about_v', 'prev_about_v')">上传视频</button>
            <input type="hidden" id="url_about_v" value="${c['cfg_about_video']||''}">
          </div>

          <div class="banner-edit-item" style="grid-column: 1 / -1; border-top: 1px solid #222; padding-top: 15px;">
            <label style="color:var(--gold);"><i class="fas fa-bookmark"></i> 视频章节标记 (Video Chapters JSON)</label>
            <p style="font-size:0.7rem; color:#666; margin-bottom:8px;">请输入 JSON 数组。例如: <code>[{"t":0, "title":"开场"}, {"t":60, "title":"核心愿景"}]</code></p>
            <textarea id="cfg_about_video_chapters" style="width:100%; height:80px; background:#0a0a0a; border:1px solid #333; color:var(--gold); font-family:monospace; padding:10px; font-size:0.8rem;">${c['cfg_about_video_chapters'] || '[{"t":0,"title":"开始"}]'}</textarea>
          </div>

          <div class="banner-edit-item">
            <label>联系我们 背景</label>
            <img id="prev_contact" src="${c['cfg_contact_banner']||''}" style="width:100%; height:120px; object-fit:cover; border-radius:4px; margin:10px 0;">
            <input type="file" id="f_contact">
            <button class="btn-tiny" style="width:100%; margin-top:5px;" onclick="uploadFile('f_contact', 'url_contact', 'prev_contact')">上传背景</button>
            <input type="hidden" id="url_contact" value="${c['cfg_contact_banner']||''}">
          </div>

          <div class="banner-edit-item">
            <label>活动页面 精彩活动主海报 (Events Top Banner)</label>
            <img id="prev_events_banner" src="${c['cfg_events_banner']||''}" style="width:100%; height:120px; object-fit:cover; border-radius:4px; margin:10px 0; background:#000;">
            <input type="file" id="f_events_banner">
            <button class="btn-tiny" style="width:100%; margin-top:5px;" onclick="uploadFile('f_events_banner', 'url_events_banner', 'prev_events_banner')">上传活动海报</button>
            <input type="hidden" id="url_events_banner" value="${c['cfg_events_banner']||''}">
          </div>

          <div class="banner-edit-item">
            <label>我要投稿 海报</label>
            <img id="prev_submit" src="${c['cfg_submit_poster']||''}" style="width:100%; height:120px; object-fit:cover; border-radius:4px; margin:10px 0;">
            <input type="file" id="f_submit">
            <button class="btn-tiny" style="width:100%; margin-top:5px;" onclick="uploadFile('f_submit', 'url_submit', 'prev_submit')">上传海报</button>
            <input type="hidden" id="url_submit" value="${c['cfg_submit_poster']||''}">
          </div>

          <div class="banner-edit-item" style="grid-column: 1 / -1; border-top: 1px solid #222; padding-top: 15px; margin-top:20px;">
            <label style="color:var(--gold);"><i class="fas fa-search"></i> Google 搜索关键词 (SEO Keywords)</label>
            <p style="font-size:0.7rem; color:#666; margin-bottom:8px;">用逗号隔开。例如: <code>收割机音乐, CCM, 基督教, 赞美诗</code></p>
            <input type="text" id="cfg_site_keywords" value="${c['cfg_site_keywords']||''}" style="width:100%; background:#0a0a0a; border:1px solid #333; color:var(--gold); padding:10px; border-radius:4px;">
          </div>

          <div class="banner-edit-item" style="grid-column: 1 / -1; border-top: 1px solid #222; padding-top: 15px;">
            <label style="color:var(--gold);"><i class="fas fa-id-card"></i> 搜索结果显示的网站简介 (Meta Description)</label>
            <p style="font-size:0.7rem; color:#666; margin-bottom:8px;">这段话将出现在 Google 搜索结果的标题下方。</p>
            <textarea id="cfg_site_description" style="width:100%; height:60px; background:#0a0a0a; border:1px solid #333; color:#fff; padding:10px; border-radius:4px; font-size:0.85rem;">${c['cfg_site_description']||''}</textarea>
          </div>

          <div class="banner-edit-item" style="margin-top:20px; border-top:1px solid #222; padding-top:15px; grid-column: 1 / -1;">
             <label style="color:var(--gold);"><i class="fas fa-edit"></i> 投稿页面说明文字 (Submit Terms Text)</label>
             <p style="font-size:0.7rem; color:#666; margin-bottom:8px;">支持多行输入。换行将自动转换为 HTML &lt;br&gt;</p>
             <textarea id="cfg_submit_text" style="width:100%; height:120px; background:#0a0a0a; border:1px solid #333; color:#fff; padding:10px; border-radius:4px; font-size:0.85rem; line-height:1.6;">${c['cfg_submit_text']||''}</textarea>
          </div>

          <div class="banner-edit-item" style="margin-top:20px; border-top:1px solid #222; padding-top:15px; grid-column: 1 / -1;">
            <label style="color:var(--gold);"><i class="fas fa-link"></i> 投稿按钮跳转链接 (Submit Button URL)</label>
            <p style="font-size:0.7rem; color:#666; margin-bottom:8px;">点击“我要投稿”后跳转的页面地址</p>
            <input type="text" id="cfg_submit_btn_link" value="${c['cfg_submit_btn_link']||''}" placeholder="https://..." style="width:100%; background:#0a0a0a; border:1px solid #333; color:#fff; padding:10px; border-radius:4px;">
          </div>
        </div>
        <button class="btn btn-submit" style="margin-top:25px;" onclick="saveBanners()">保存所有媒体配置</button>
      </div>
    `;
  }

  window.saveAllConfigs = async() => {
    const keys = ['cfg_about_text', 'cfg_contact_email', 'cfg_social_fb', 'cfg_social_ig', 'cfg_social_yt'];
    for(let k of keys) {
      const el = document.getElementById(k);
      if(el) {
        await db.from('site_config').upsert({key: k, value: el.value}, {onConflict: 'key'});
      }
    }
    alert("配置已更新成功! 您的设计选择已生效。");
    renderCMS();
  };

  window.saveSupportInfo = async() => {
    const data = [
      {k: 'cfg_support_bank', v: document.getElementById('cfg_support_bank').value},
      {k: 'cfg_support_acc_no', v: document.getElementById('cfg_support_acc_no').value},
      {k: 'cfg_support_acc_name', v: document.getElementById('cfg_support_acc_name').value},
      {k: 'cfg_support_tng', v: document.getElementById('cfg_support_tng').value},
      {k: 'cfg_support_qr', v: document.getElementById('url_qr').value}
    ];
    for(let item of data) {
      await db.from('site_config').upsert({key: item.k, value: item.v}, {onConflict: 'key'});
    }
    alert("支持信息（银行/TNG）更新成功!");
  };

  window.saveBanners = async() => {
    const banners = [
      {k: 'cfg_about_video', v: document.getElementById('url_about_v').value},
      {k: 'cfg_about_video_chapters', v: document.getElementById('cfg_about_video_chapters').value},
      {k: 'cfg_contact_banner', v: document.getElementById('url_contact').value},
      {k: 'cfg_events_banner', v: document.getElementById('url_events_banner').value},
      {k: 'cfg_submit_poster', v: document.getElementById('url_submit').value},
      {k: 'cfg_submit_btn_link', v: document.getElementById('cfg_submit_btn_link').value},
      {k: 'cfg_submit_text', v: document.getElementById('cfg_submit_text').value},
      {k: 'cfg_site_keywords', v: document.getElementById('cfg_site_keywords').value},
      {k: 'cfg_site_description', v: document.getElementById('cfg_site_description').value}
    ];
    for(let b of banners) {
      await db.from('site_config').upsert({key: b.k, value: b.v}, {onConflict: 'key'});
    }
    alert("所有页面海报及背景图更新成功!");
  };

  // --- 📂 DIARY MODULE ---
  async function renderDiary(container) {
    const { data: albums } = await db.from('diary_albums').select('*').order('date', {ascending: false});
    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem;">
        <h1 style="color:var(--gold);">田野日志 Diary Management</h1>
        <button class="btn btn-submit" style="width:auto; padding:10px 25px;" onclick="openDiaryModal()">+ 新建相册</button>
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(300px, 1fr)); gap:20px;">
        ${albums?.map(a => `
          <div style="background:#1a1a1a; padding:20px; border-radius:12px; border:1px solid #222; position:relative;">
            <img src="${a.cover_url || 'https://via.placeholder.com/600x400?text=No+Cover'}" style="width:100%; aspect-ratio:1.6/1; object-fit:cover; border-radius:8px; margin-bottom:15px; border:1px solid #333;">
            <h3 style="margin:0; color:var(--gold);">${a.title}</h3>
            <p style="color:#666; font-size:0.85rem; margin:5px 0;">${a.date || ''}</p>
            
            <div style="display:flex; gap:10px; margin-top:20px;">
              <button class="btn-submit" style="flex:1; padding:8px;" onclick="managePhotos('${a.id}')">📷 照片管理</button>
            </div>
            <div style="display:flex; gap:10px; margin-top:10px;">
              <button class="btn-tiny" style="flex:1;" onclick="openDiaryModal('${a.id}')">编辑相册信息</button>
              <button class="btn-tiny danger" onclick="deleteItem('diary_albums', '${a.id}')">删除整个相册</button>
            </div>
          </div>
        `).join('') || '<p>暂无日记相册，立即创建一个吧。</p>'}
      </div>
    `;
  }
  
  window.openDiaryModal = async (id = null) => {
    const btn = event.currentTarget;
    const originalText = btn.innerText;
    if (id) { btn.innerText = "⏳..."; btn.disabled = true; }

    try {
      let a = null;
      if (id) {
        const { data, error } = await db.from('diary_albums').select('*').eq('id', id).single();
        if (error) throw error;
        a = data;
      }
      const isEdit = !!a;
      const modal = document.createElement('div');
      modal.id = 'diaryAlbumModal';
      modal.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:9999; display:flex; justify-content:center; align-items:center; backdrop-filter:blur(8px); padding:20px;";
      modal.innerHTML = `
        <div style="background:#111; border:1px solid var(--gold); border-radius:16px; padding:2rem; width:100%; max-width:550px; max-height:90vh; overflow-y:auto; box-shadow:0 20px 60px rgba(0,0,0,1);">
          <h2 style="color:var(--gold); margin-bottom:1.5rem; text-align:center;">${isEdit ? '编辑日记相册' : '新建日记相册'}</h2>
          
          <div style="margin-bottom:20px; background:#0a0a0a; padding:15px; border-radius:12px; border:1px solid #222;">
            <label style="display:block; margin-bottom:10px; color:#aaa; font-size:0.8rem;">相册封面 (Album Cover)</label>
            <img id="da_prev" src="${a?.cover_url || 'https://via.placeholder.com/600x400?text=Album+Cover'}" style="width:100%; aspect-ratio:1.6/1; object-fit:cover; border-radius:8px; display:block; margin:0 auto 15px; border:1px solid #333; background:#222;">
            <input type="file" id="daf_up" style="font-size:0.8rem; color:#888;">
            <button class="btn-tiny" style="margin-top:10px; width:100%;" onclick="uploadFile('daf_up', 'da_url', 'da_prev')">📤 上传相册封面图</button>
            <input type="hidden" id="da_url" value="${a?.cover_url || ''}">
          </div>

          <div style="margin-bottom:15px;">
            <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem;">相册名称 (Album Name)</label>
            <input type="text" id="da_title" value="${a?.title || ''}" placeholder="例如：2026 巴生谷田野调查" style="width:100%; padding:10px;">
          </div>

          <div style="margin-bottom:15px;">
            <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem;">相册日期 (Album Date)</label>
            <input type="date" id="da_date" value="${a?.date || ''}" style="width:100%; padding:10px;">
          </div>

          <div style="display:flex; gap:15px; margin-top:20px; position:sticky; bottom:0; padding-top:10px; background:#111; border-top:1px solid #222;">
            <button class="btn btn-submit" style="flex:2; padding:12px;" onclick="saveDiaryAlbum('${a?.id || ''}')">💾 保存相册信息</button>
            <button class="btn-tiny" style="flex:1;" onclick="this.closest('#diaryAlbumModal').remove()">取消</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    } catch (err) {
      alert("日记加载失败: " + err.message);
    } finally {
      if (id) { btn.innerText = originalText; btn.disabled = false; }
    }
  };

  window.saveDiaryAlbum = async(id) => {
    // Robust Parsing/Saving: If fb_url doesn't exist in DB, we hide it in title or other field
    // But for now, we try to save it normally. 
    const payload = {
      title: document.getElementById('da_title').value,
      date: document.getElementById('da_date').value,
      cover_url: document.getElementById('da_url').value
    };
    if(!payload.title) return alert("请输入名称");
    
    if(id) await db.from('diary_albums').update(payload).eq('id', id);
    else await db.from('diary_albums').insert([payload]);
    
    // Close modal & Refresh
    if(document.getElementById('diaryAlbumModal')) document.getElementById('diaryAlbumModal').remove();
    renderCMS();
    alert("相册信息已保存");
  };

  window.saveDiaryAlbumMinimal = async (id) => {
    const fb = document.getElementById('da_fb_instant')?.value;
    try {
      const { error } = await db.from('diary_albums').update({ fb_url: fb }).eq('id', id);
      if(error) throw error;
      alert("✅ Facebook 链接已成功同步到官网！");
    } catch(e) {
      alert("同步失败：" + e.message);
    }
  };
  
  window.managePhotos = async(id) => {
    const { data: album } = await db.from('diary_albums').select('*').eq('id', id).single();
    const { data: photos } = await db.from('diary_media').select('*').eq('album_id', id);
    const modal = document.createElement('div');
    modal.id = 'photoManagerModal';
    modal.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:999; display:flex; justify-content:center; align-items:center; backdrop-filter:blur(10px); padding:20px;";
    modal.innerHTML = `
      <div style="background:#111; border:1px solid var(--gold); border-radius:16px; padding:2rem; width:100%; max-width:800px; max-height:85vh; overflow-y:auto; box-shadow:0 0 50px rgba(0,0,0,0.8);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
          <h3 style="color:var(--gold); margin:0;">正在管理相册照片 (Album Photos)</h3>
          <button class="btn-tiny" onclick="this.closest('#photoManagerModal').remove()">关闭</button>
        </div>

        <!-- Added redundant Social Link field for ease of access -->
        <div style="background:rgba(24,119,242,0.1); padding:20px; border-radius:12px; margin-bottom:20px; border:1px solid rgba(24,119,242,0.3);">
          <label style="display:block; margin-bottom:10px; color:#1877F2; font-weight:bold; font-size:0.85rem;">
            <i class="fab fa-facebook"></i> 同步至 Facebook 相册 (Social Cross-post Link)
          </label>
          <div style="display:flex; gap:10px;">
            <input type="text" id="da_fb_instant" value="${album?.fb_url || ''}" placeholder="粘贴 FB 相册链接..." style="flex:1; padding:10px; background:#000; border:1px solid #333; color:white; border-radius:4px;">
            <button class="btn-tiny" onclick="saveDiaryAlbumMinimal('${id}')" style="background:#1877F2; color:white; border:none; padding:0 20px;">更新链接</button>
          </div>
          <p style="font-size:0.65rem; color:#666; margin-top:8px;">此处修改后，官网详情页将立即显示 "View on Facebook" 按钮。</p>
        </div>

        <div style="background:#0a0a0a; padding:20px; border-radius:12px; text-align:center; margin-bottom:20px; border:1px dashed #333;">
           <p style="color:#888; font-size:0.8rem; margin-bottom:10px;">选择想要上传的作品瞬间</p>
           <input type="file" id="d_up">
           <button class="btn btn-submit" style="margin-top:10px; width:100%;" onclick="uploadDiaryPhoto('${id}')">上传并存入相册</button>
           <div id="up_stat" style="font-size:0.7rem; color:var(--gold); margin-top:5px;"></div>
        </div>
        <div id="photoGridCMS" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(120px, 1fr)); gap:15px;">
          ${photos?.map(p => {
             const optimized = p.media_url; 
             return `
            <div style="position:relative; aspect-ratio:1; border-radius:8px; overflow:hidden; border:1px solid #222;">
              <img src="${optimized}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='assets/logo.png'">
              <button onclick="deleteDiaryPhoto('${p.id}', this)" style="position:absolute; top:5px; right:5px; background:rgba(255,0,0,0.8); border:none; color:white; border-radius:50%; width:20px; height:20px; cursor:pointer; font-size:10px; display:flex; align-items:center; justify-content:center;">✕</button>
            </div>
          `}).join('') || '<p style="grid-column:1/-1; text-align:center; opacity:0.3;">暂无内容</p>'}
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  };

  window.uploadDiaryPhoto = async (aid) => {
    const fileInput = document.getElementById('d_up');
    const stat = document.getElementById('up_stat');
    let file = fileInput.files[0];
    if(!file) return alert("请先选择照片");
    
    stat.innerText = "🎨 正在自动无损压缩照片体积...";
    if (file.type.startsWith('image/')) {
        file = await compressImage(file);
    }
    
    stat.innerText = "⚡ 正在极速上传并同步数据库...";
    
    // Use the global uploadFile logic but handle the DB entry here
    const safeName = file.name.replace(/[^\w.-]/g, "_");
    const path = `diary/${Date.now()}-${safeName}`;
    
    try {
      const { data, error } = await db.storage.from('harvester-media').upload(path, file);
      if(error) throw error;
      
      const { data: { publicUrl } } = db.storage.from('harvester-media').getPublicUrl(path);
      
      // Save to diary_media
      await db.from('diary_media').insert([{
        album_id: aid, 
        media_url: publicUrl, 
        type: file.type.startsWith('video') ? 'video' : 'image'
      }]);
      
      stat.innerText = "✅ 上传成功！正在刷新列表...";
      
      // Refresh the specific photo grid without closing the modal
      const { data: newPhotos } = await db.from('diary_media').select('*').eq('album_id', aid);
      document.getElementById('photoGridCMS').innerHTML = newPhotos.map(p => {
        const optimized = p.media_url;
        return `
        <div style="position:relative; aspect-ratio:1; border-radius:8px; overflow:hidden; border:1px solid #222;">
          <img src="${optimized}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='assets/logo.png'">
          <button onclick="deleteDiaryPhoto('${p.id}', this)" style="position:absolute; top:5px; right:5px; background:rgba(255,0,0,0.8); border:none; color:white; border-radius:50%; width:20px; height:20px; cursor:pointer; font-size:10px; display:flex; align-items:center; justify-content:center;">✕</button>
        </div>
      `}).join('');
      
      fileInput.value = ""; // Clear input
    } catch (e) {
      alert("上传失败: " + e.message);
      stat.innerText = "❌ 发生错误";
    }
  };

  window.deleteDiaryPhoto = async (id, btn) => {
    if(confirm("确定删除这张照片？")) {
      await db.from('diary_media').delete().eq('id', id);
      btn.parentElement.remove();
    }
  };

  window.deleteItem = async(t, id) => {
    if(confirm("确定永久删除？")) { await db.from(t).delete().eq('id', id); renderCMS(); }
  };

  async function renderEchoes(container) {
    const { data: echoes } = await db.from('contact_messages').select('*').ilike('message', '[ECHO]%').order('created_at', {ascending: false});
    
    // 🛡️ Fetch approved IDs for moderation UI
    const { data: cfg } = await db.from('site_config').select('value').eq('key', 'cfg_approved_echo_ids').maybeSingle();
    const approvedIds = cfg?.value ? cfg.value.split(',').filter(Boolean) : [];

    // 📊 Fetch reaction statistics
    const { data: rCfg } = await db.from('site_config').select('value').eq('key', 'cfg_echo_reactions_stats').maybeSingle();
    let stats = { total: 0, reactions: {} };
    if (rCfg?.value) {
      try { stats = JSON.parse(rCfg.value); } catch(err){}
    }
    const reactions = stats.reactions || {};
    const countTouched = reactions['❤️ 被触动'] || 0;
    const countComforted = reactions['🙏 被安慰'] || 0;
    const countReal = reactions['🔥 很真实'] || 0;
    const countLoop = reactions['🎧 单曲循环'] || 0;
    
    // Other / Custom reactions
    const customList = Object.entries(reactions).filter(([k]) => !['❤️ 被触动', '🙏 被安慰', '🔥 很真实', '🎧 单曲循环'].includes(k));
    const totalApproved = echoes?.filter(e => approvedIds.includes(e.id.toString()) || e.status === 'approved').length || 0;

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem;">
        <div>
          <h1 style="color:var(--gold); margin:0;">🌌 回声空间管理 (Echo Space & Moderation)</h1>
          <p style="color:#888; font-size:0.9rem; margin-top:5px;">
            共鸣点击统计 + 留言审核后台。前台星空将实时循环展示最新的 <span style="color:var(--gold); font-weight:bold;">20 条已审核留言</span>（最新自动取代最旧，后台历史数据永久保留）。
          </p>
        </div>
        <button class="btn-tiny danger" onclick="resetReactionStats()" style="padding: 8px 16px;">🔄 重置点击数据</button>
      </div>

      <!-- 1. 📊 共鸣互动点击统计卡片 (Reaction Analytics) -->
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:15px; margin-bottom: 2.5rem;">
        <div style="background: linear-gradient(135deg, rgba(246,210,138,0.15) 0%, rgba(20,20,20,0.8) 100%); border: 1px solid rgba(246,210,138,0.3); border-radius: 12px; padding: 20px;">
          <div style="font-size:0.75rem; color:#888; text-transform:uppercase; letter-spacing:1px;">总互动点击次数</div>
          <div style="font-size:2.2rem; font-weight:bold; color:var(--gold); margin-top:5px;">${stats.total || 0}</div>
        </div>

        <div style="background:#0e0e0e; border: 1px solid #222; border-radius: 12px; padding: 20px;">
          <div style="font-size:0.75rem; color:#888;">❤️ 被触动</div>
          <div style="font-size:1.8rem; font-weight:bold; color:#ff6b81; margin-top:5px;">${countTouched}</div>
        </div>

        <div style="background:#0e0e0e; border: 1px solid #222; border-radius: 12px; padding: 20px;">
          <div style="font-size:0.75rem; color:#888;">🙏 被安慰</div>
          <div style="font-size:1.8rem; font-weight:bold; color:#70a1ff; margin-top:5px;">${countComforted}</div>
        </div>

        <div style="background:#0e0e0e; border: 1px solid #222; border-radius: 12px; padding: 20px;">
          <div style="font-size:0.75rem; color:#888;">🔥 很真实</div>
          <div style="font-size:1.8rem; font-weight:bold; color:#ffa502; margin-top:5px;">${countReal}</div>
        </div>

        <div style="background:#0e0e0e; border: 1px solid #222; border-radius: 12px; padding: 20px;">
          <div style="font-size:0.75rem; color:#888;">🎧 单曲循环</div>
          <div style="font-size:1.8rem; font-weight:bold; color:#2ed573; margin-top:5px;">${countLoop}</div>
        </div>

        <div style="background:#0e0e0e; border: 1px solid #222; border-radius: 12px; padding: 20px;">
          <div style="font-size:0.75rem; color:#888;">✨ 自定义/其他短语</div>
          <div style="font-size:1.8rem; font-weight:bold; color:#eccc68; margin-top:5px;">${customList.reduce((acc, [, v]) => acc + v, 0)}</div>
        </div>
      </div>

      ${customList.length > 0 ? `
        <div style="background:#0a0a0a; border: 1px solid #1a1a1a; border-radius: 10px; padding: 15px; margin-bottom: 2.5rem;">
          <p style="font-size:0.8rem; color:#888; margin:0 0 10px 0;">自定义触发短语明细：</p>
          <div style="display:flex; flex-wrap:wrap; gap:8px;">
            ${customList.map(([k, v]) => `
              <span style="background:#151515; border:1px solid #333; padding:4px 10px; border-radius:20px; font-size:0.75rem; color:#ccc;">
                ${k}: <b style="color:var(--gold);">${v}</b> 次
              </span>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- 2. 📝 留言审核与展示列表 (Moderation Table) -->
      <div style="background:#0a0a0a; border:1px solid #222; border-radius:12px; padding:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; flex-wrap:wrap; gap:10px;">
          <div style="font-size:0.9rem; color:#aaa;">
            全部记录: <b style="color:#fff;">${echoes?.length || 0}</b> 条 ｜ 
            已批准展示: <b style="color:#64D28A;">${totalApproved}</b> 条 
            <span style="font-size:0.75rem; color:#666; margin-left:10px;">(前台星空背景将自动漂浮最新的前 20 条已批准留言)</span>
          </div>
        </div>

        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; color:#eee; min-width:650px;">
            <thead>
              <tr style="border-bottom:1px solid #333; text-align:left; background:#111;">
                <th style="padding:15px; font-size:0.8rem; color:#666; width:130px;">提交时间</th>
                <th style="padding:15px; font-size:0.8rem; color:#666; width:120px;">昵称/身份</th>
                <th style="padding:15px; font-size:0.8rem; color:#666;">回声感悟留言内容</th>
                <th style="padding:15px; font-size:0.8rem; color:#666; width:140px;">当前状态</th>
                <th style="padding:15px; font-size:0.8rem; color:#666; text-align:right; width:170px;">审核与管理</th>
              </tr>
            </thead>
            <tbody>
              ${echoes?.map(e => {
                const isApproved = approvedIds.includes(e.id.toString()) || e.status === 'approved';
                const cleanMsg = e.message ? e.message.replace('[ECHO]', '').trim() : '';
                return `
                  <tr style="border-bottom:1px solid #1a1a1a; transition:0.3s;" onmouseover="this.style.background='#111'" onmouseout="this.style.background='transparent'">
                    <td style="padding:15px; font-size:0.8rem; color:#666;">${new Date(e.created_at).toLocaleString()}</td>
                    <td style="padding:15px; color:var(--gold); font-weight:500;">${e.name || '匿名听众'}</td>
                    <td style="padding:15px; font-style:italic; color:#fff; font-size:0.95rem; font-family:'ChenYuluoyan', sans-serif, system-ui;">
                      "${cleanMsg}"
                    </td>
                    <td style="padding:15px;">
                      <span style="padding:5px 12px; border-radius:50px; font-size:0.75rem; font-weight:bold; display:inline-flex; align-items:center; gap:5px; background:${isApproved ? 'rgba(100,210,138,0.12)' : 'rgba(255,165,2,0.1)'}; color:${isApproved ? '#64D28A' : '#ffa502'}; border:1px solid ${isApproved ? 'rgba(100,210,138,0.3)' : 'rgba(255,165,2,0.3)'};">
                        ${isApproved ? '● 已批准 (星空展示中)' : '○ 待审核 (前台隐藏)'}
                      </span>
                    </td>
                    <td style="padding:15px; text-align:right; white-space:nowrap;">
                      <button class="btn-tiny" style="margin-right:6px; border-color:${isApproved ? '#555' : 'var(--gold)'}; color:${isApproved ? '#aaa' : 'var(--gold)'}; background:${isApproved ? 'transparent' : 'rgba(246,210,138,0.1)'};" onclick="toggleEchoApproval('${e.id}', ${isApproved})">
                        ${isApproved ? '🚫 撤回隐藏' : '✅ 批准发布'}
                      </button>
                      <button class="btn-tiny danger" onclick="deleteItem('contact_messages', '${e.id}')" title="删除记录">🗑️</button>
                    </td>
                  </tr>
                `;
              }).join('') || '<tr><td colspan="5" style="padding:50px; text-align:center; color:#555;">暂无回声留言记录...</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  window.resetReactionStats = async () => {
    if (!confirm("⚠️ 确定要重置所有共鸣互动点击计数吗？")) return;
    const initialStats = { total: 0, reactions: {} };
    await db.from('site_config').upsert({
      key: 'cfg_echo_reactions_stats',
      value: JSON.stringify(initialStats)
    }, { onConflict: 'key' });
    alert("✅ 点击数据已重置！");
    renderCMS();
  };
});
