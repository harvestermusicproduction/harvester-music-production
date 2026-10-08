
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
  window.renderCMS = renderCMS;

  async function renderCMS() {
    adminDashboard.innerHTML = `
      <div class="cms-layout" style="display:flex; height:100vh; background:#080808; color: #ffffff; overflow:hidden; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;">
        <!-- Clean Professional Red/Black/White Sidebar -->
        <aside style="width:265px; min-width:265px; background:#0c0c0c; border-right:1px solid #222222; padding:1.8rem 1.1rem; display:flex; flex-direction:column; box-sizing:border-box;">
          <div style="margin-bottom:1.8rem; padding: 0 4px; display:flex; align-items:center; gap:10px;">
            <img src="assets/logo.png" alt="Harvester Logo" style="height:26px; width:auto; object-fit:contain; filter:brightness(1.6); flex-shrink:0;">
            <div style="min-width:0; flex:1; overflow:visible;">
              <h2 style="color:#ffffff; font-size:1.22rem; letter-spacing:2px; margin:0; font-weight:800; white-space:nowrap; font-family:var(--font-brand), sans-serif;">HARVESTER</h2>
              <p style="font-size:0.62rem; color:#e63946; margin:3px 0 0; letter-spacing:1.5px; text-transform:uppercase; font-weight:700; white-space:nowrap;">CMS CONTROL PANEL</p>
            </div>
          </div>
          
          <nav style="flex:1; display:flex; flex-direction:column; gap:4px; overflow-y:auto; padding-right:4px;">
            <p class="nav-section-title">CONTROL CENTER / 概览</p>
            <a href="javascript:void(0)" onclick="switchModule('dashboard')" class="nav-item ${currentModule==='dashboard'?'active':''}">📊 仪表盘概览 (Overview)</a>

            <p class="nav-section-title" style="margin-top:16px;">FRONTEND PAGES / 前台页面分类管理</p>
            <a href="javascript:void(0)" onclick="switchModule('home')" class="nav-item ${currentModule==='home'?'active':''}">🏠 1. 主页 (Home)</a>
            <a href="javascript:void(0)" onclick="switchModule('music')" class="nav-item ${currentModule==='music'?'active':''}">🎵 2. 音乐与歌谱集 (Music & Scores)</a>
            <a href="javascript:void(0)" onclick="switchModule('events')" class="nav-item ${currentModule==='events'?'active':''}">📅 3. 活动 (Events)</a>
            <a href="javascript:void(0)" onclick="switchModule('diary')" class="nav-item ${currentModule==='diary'?'active':''}">📂 4. 照片集 (Diary)</a>
            <a href="javascript:void(0)" onclick="switchModule('submit')" class="nav-item ${currentModule==='submit' || currentModule==='submissions'?'active':''}">📮 5. 我要投稿 (Submit)</a>
            <a href="javascript:void(0)" onclick="switchModule('about')" class="nav-item ${currentModule==='about'?'active':''}">📖 6. 关于我们 (About Us)</a>
            <a href="javascript:void(0)" onclick="switchModule('singers')" class="nav-item ${currentModule==='singers'?'active':''}">👥 6.1 主要同工 (Singers)</a>
            <a href="javascript:void(0)" onclick="switchModule('support')" class="nav-item ${currentModule==='support'?'active':''}">💖 7. 支持我们 (Support)</a>
            <a href="javascript:void(0)" onclick="switchModule('contact')" class="nav-item ${currentModule==='contact' || currentModule==='echo'?'active':''}">✉️ 8. 联系我们 (Contact)</a>

            <p class="nav-section-title" style="margin-top:16px;">SYSTEM & SUBSCRIPTIONS / 系统设置</p>
            <a href="javascript:void(0)" onclick="switchModule('reminders')" class="nav-item ${currentModule==='reminders'?'active':''}">⏰ 活动订阅提醒 (Reminders)</a>
            <a href="javascript:void(0)" onclick="switchModule('config')" class="nav-item ${currentModule==='config'?'active':''}">⚙️ 全站设置与 SEO (Config)</a>
          </nav>
          
          <button onclick="logoutAdmin()" style="background:none; border:none; color:#777; text-align:left; padding:10px; font-size:0.8rem; cursor:pointer; transition:0.3s; margin-top:15px; border-top:1px solid #222; display:flex; align-items:center; gap:8px;">
            <i class="fas fa-sign-out-alt" style="color:#e63946;"></i> <span style="color:#bbb;">SIGN OUT (登出)</span>
          </button>
        </aside>

        <main id="moduleBody" style="flex:1; padding:3rem 3.5rem; overflow-y:auto; background:#080808;"></main>
      </div>

      <style>
        .nav-section-title { font-size: 0.62rem; color: #666666; text-transform: uppercase; letter-spacing: 1.8px; margin: 10px 0 6px 8px; font-weight: 700; }
        .nav-item {
          color: #999999;
          text-decoration: none;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 0.84rem;
          transition: all 0.22s ease;
          display: flex;
          align-items: center;
          gap: 10px;
          letter-spacing: 0.3px;
        }
        .nav-item:hover { background: rgba(255,255,255,0.06); color: #ffffff; }
        .nav-item.active { background: rgba(230, 57, 70, 0.14); color: #ffffff; font-weight: 600; border-left: 3px solid #e63946; }
        
        .cms-card { background: #111111; border: 1px solid #222222; border-radius: 12px; padding: 2rem; box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
        .btn-tiny { background: #1a1a1a; border: 1px solid #333333; color: #cccccc; padding: 6px 14px; border-radius: 5px; cursor: pointer; font-size: 0.75rem; transition: 0.25s; font-weight: 500; }
        .btn-tiny:hover { background: #262626; color: #ffffff; border-color: #e63946; }
        .btn-tiny.danger { color: #ff6b6b; border-color: rgba(230, 57, 70, 0.4); background: rgba(230, 57, 70, 0.08); }
        .btn-tiny.danger:hover { background: #e63946; color: #ffffff; border-color: #e63946; }
        .btn-primary, .btn-submit-cms { background: linear-gradient(135deg, #e63946 0%, #c92a3f 100%); color: #ffffff; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 700; cursor: pointer; transition: 0.25s; box-shadow: 0 4px 15px rgba(230, 57, 70, 0.35); }
        .btn-primary:hover, .btn-submit-cms:hover { background: #ff4d4f; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(230, 57, 70, 0.5); }
      </style>
    `;
    const body = document.getElementById('moduleBody');
    if (currentModule === 'dashboard') renderDashboard(body);
    else if (currentModule === 'home') renderHomeCMS(body);
    else if (currentModule === 'music') renderMusic(body);
    else if (currentModule === 'events') renderEvents(body);
    else if (currentModule === 'diary') renderDiary(body);
    else if (currentModule === 'submit' || currentModule === 'submissions') renderSubmitCMS(body);
    else if (currentModule === 'about') renderAboutCMS(body);
    else if (currentModule === 'singers') renderSingers(body);
    else if (currentModule === 'support') renderSupportCMS(body);
    else if (currentModule === 'contact' || currentModule === 'echo') renderContactCMS(body);
    else if (currentModule === 'reminders') renderReminders(body);
    else if (currentModule === 'config') renderConfig(body);
    else renderDashboard(body);
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
        if(prevEl.tagName === 'VIDEO' || prevEl.tagName === 'AUDIO') {
          prevEl.style.display = 'block';
          prevEl.load();
        } else if (prevEl.tagName === 'IMG') {
          const widget = document.querySelector(`.crop-controller-widget[data-target-img="${previewId}"]`);
          if (widget) {
            const ctrlId = widget.dataset.ctrlId;
            if (ctrlId && typeof window.onImageCropChange === 'function') {
              window.onImageCropChange(ctrlId);
            }
          }
        }
      }
      const bgEl = document.getElementById(previewId + '_bg');
      if(bgEl) bgEl.style.backgroundImage = `url('${publicUrl}')`;
    }
    btn.innerText = "✅ 上传成功";
  };

  // --- Dedicated 15s Audio Preview Uploader ---
  window.uploadAudioFile = async (fileInputId, targetId, previewId) => {
    const inputEl = document.getElementById(fileInputId);
    const file = inputEl?.files?.[0];
    if (!file) return alert("请先选择音频文件 (MP3, WAV, M4A, AAC, OGG, FLAC 等)");

    const btn = event.currentTarget || event.target;
    const originalText = btn ? btn.innerText : '📤 上传 15s 试听音频';
    if (btn) {
      btn.innerText = "⏳ 正在上传试听音频...";
      btn.disabled = true;
    }

    try {
      const ext = file.name.split('.').pop().toLowerCase();
      const safeName = file.name.replace(/[^\w.-]/g, "_");
      const path = `audio/${Date.now()}-${safeName}`;

      let mime = file.type || 'audio/mpeg';
      if (ext === 'mp3') mime = 'audio/mpeg';
      else if (ext === 'wav') mime = 'audio/wav';
      else if (ext === 'm4a') mime = 'audio/mp4';
      else if (ext === 'ogg') mime = 'audio/ogg';
      else if (ext === 'aac') mime = 'audio/aac';
      else if (ext === 'flac') mime = 'audio/flac';

      const { data, error } = await db.storage.from('harvester-media').upload(path, file, {
        contentType: mime,
        upsert: true
      });
      if (error) throw error;

      const { data: { publicUrl } } = db.storage.from('harvester-media').getPublicUrl(path);
      const targetInput = document.getElementById(targetId);
      if (targetInput) targetInput.value = publicUrl;

      if (previewId) {
        const prevEl = document.getElementById(previewId);
        if (prevEl) {
          prevEl.src = publicUrl;
          prevEl.style.display = 'block';
          prevEl.load();
        }
      }

      if (btn) btn.innerText = "✅ 试听音频上传成功";
      setTimeout(() => {
        if (btn) {
          btn.innerText = originalText;
          btn.disabled = false;
        }
      }, 2500);
    } catch (err) {
      console.error("Audio upload error:", err);
      alert("❌ 音频上传失败: " + (err.message || err));
      if (btn) {
        btn.innerText = originalText;
        btn.disabled = false;
      }
    }
  };

  window.updateAdminAudioPreview = (url) => {
    const prevEl = document.getElementById('prev_audio_el');
    if (!prevEl) return;
    const cleanUrl = (url || '').trim();
    if (cleanUrl) {
      prevEl.src = cleanUrl;
      prevEl.style.display = 'block';
      prevEl.load();
    } else {
      prevEl.src = '';
      prevEl.style.display = 'none';
    }
  };

  async function renderDashboard(container) {
    const { count: v } = await db.from('visits').select('*', { count: 'exact', head: true });
    const { count: m } = await db.from('music_works').select('*', { count: 'exact', head: true });
    
    // Fetch Rankings
    const { data: topDownloads } = await db.from('music_works').select('*').order('download_count', { ascending: false }).limit(5);
    const { data: topListen } = await db.from('music_works').select('*').order('listen_count', { ascending: false }).limit(5);

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #222; padding-bottom:1.2rem; margin-bottom:2rem;">
        <div>
          <h1 style="color:#ffffff; font-size:1.85rem; margin:0; font-weight:800; letter-spacing:0.5px;">系统概览 <span style="color:#e63946;">(Dashboard)</span></h1>
          <p style="color:#888; font-size:0.85rem; margin:4px 0 0;">欢迎进入收割机音乐后台控制中心 · Red, Black & White Edition</p>
        </div>
        <button onclick="renderCMS()" class="btn-tiny" style="display:flex; align-items:center; gap:6px;"><i class="fas fa-sync-alt"></i> 刷新数据</button>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:20px; margin-top:20px;">
        <div class="cms-card" style="background:#111111; padding:1.8rem; border-radius:12px; border-left:4px solid #e63946; border:1px solid #222; border-left:4px solid #e63946;">
          <h3 style="font-size:2.6rem; margin:0; color:#ffffff; font-weight:900;">${v||0}</h3>
          <p style="color:#888; margin:6px 0 0; font-size:0.82rem; text-transform:uppercase; letter-spacing:1px; font-weight:600;">全站访客总数 (Total Visits)</p>
        </div>
        <div class="cms-card" style="background:#111111; padding:1.8rem; border-radius:12px; border-left:4px solid #ffffff; border:1px solid #222; border-left:4px solid #ffffff;">
          <h3 style="font-size:2.6rem; margin:0; color:#ffffff; font-weight:900;">${m||0}</h3>
          <p style="color:#888; margin:6px 0 0; font-size:0.82rem; text-transform:uppercase; letter-spacing:1px; font-weight:600;">已发布曲目 (Live Tracks)</p>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:25px; margin-top:35px;">
        <!-- Ranking 1: Downloads -->
        <div style="background:#111111; border:1px solid #222222; border-radius:12px; padding:22px; box-shadow:0 4px 20px rgba(0,0,0,0.4);">
          <h3 style="color:#ffffff; margin-top:0; border-bottom:1px solid #222; padding-bottom:12px; font-size:1.05rem; display:flex; align-items:center; gap:8px;">
            <i class="fas fa-file-pdf" style="color:#e63946;"></i> 热门歌谱下载 (Top Scores)
          </h3>
          <div style="display:flex; flex-direction:column; gap:10px; margin-top:15px;">
            ${topDownloads?.map((s, i) => `
              <div style="display:flex; justify-content:space-between; align-items:center; background:#181818; border:1px solid #262626; padding:10px 14px; border-radius:6px;">
                <span style="color:#f0f0f0; font-size:0.88rem;"><small style="color:#e63946; font-weight:bold; margin-right:6px;">#${i+1}</small> ${s.title}</span>
                <span style="color:#ffffff; font-weight:bold; font-size:0.82rem; background:rgba(230,57,70,0.18); border:1px solid rgba(230,57,70,0.4); padding:2px 8px; border-radius:4px;">${s.download_count||0} 📄</span>
              </div>
            `).join('') || '<p style="color:#666; font-size:0.85rem;">暂无下载数据</p>'}
          </div>
        </div>

        <!-- Ranking 2: Listening -->
        <div style="background:#111111; border:1px solid #222222; border-radius:12px; padding:22px; box-shadow:0 4px 20px rgba(0,0,0,0.4);">
          <h3 style="color:#ffffff; margin-top:0; border-bottom:1px solid #222; padding-bottom:12px; font-size:1.05rem; display:flex; align-items:center; gap:8px;">
            <i class="fas fa-headphones" style="color:#e63946;"></i> 热门试听曲目 (Top Listening)
          </h3>
          <div style="display:flex; flex-direction:column; gap:10px; margin-top:15px;">
            ${topListen?.map((s, i) => `
              <div style="display:flex; justify-content:space-between; align-items:center; background:#181818; border:1px solid #262626; padding:10px 14px; border-radius:6px;">
                <span style="color:#f0f0f0; font-size:0.88rem;"><small style="color:#e63946; font-weight:bold; margin-right:6px;">#${i+1}</small> ${s.title}</span>
                <span style="color:#ffffff; font-weight:bold; font-size:0.82rem; background:rgba(255,255,255,0.08); border:1px solid #333; padding:2px 8px; border-radius:4px;">${s.listen_count||0} 🎧</span>
              </div>
            `).join('') || '<p style="color:#666; font-size:0.85rem;">暂无试听数据</p>'}
          </div>
        </div>
      </div>
    `;
  }

  let currentMusicSubTab = 'tracks';
  // Curated Collection of Modern Morandi Aesthetic Graphic & Abstract Art (No Portraits)
  const childlikeDoodles = [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&auto=format&fit=crop&q=80", // Modern Morandi 3D fluid sculpture & gradient geometry
    "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=900&auto=format&fit=crop&q=80", // Modern architectural arches & shadows in Morandi light
    "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=900&auto=format&fit=crop&q=80", // Minimalist botanical in muted sage & terracotta clay
    "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=900&auto=format&fit=crop&q=80", // Minimalist misty landscape & quiet slate blue horizon
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=900&auto=format&fit=crop&q=80", // Acoustic studio guitar woodwork in warm Morandi tones
    "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=900&auto=format&fit=crop&q=80", // Modern abstract Bauhaus color field & graphic lines
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=900&auto=format&fit=crop&q=80", // Contemporary oil brushstrokes in dusty rose & sand
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=900&auto=format&fit=crop&q=80", // Audio mixing console & dials in sleek dark slate
    "https://images.unsplash.com/photo-1520523839898-50712509e37b?w=900&auto=format&fit=crop&q=80", // Minimalist grand piano keys in Morandi kraft & ivory
    "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=900&auto=format&fit=crop&q=80", // Museum abstract textural sculpture painting
    "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=900&auto=format&fit=crop&q=80", // Modern violin & vintage sheet music still life
    "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=900&auto=format&fit=crop&q=80"  // Modern vinyl record in dusty rose & cream
  ];

  window.setRandomChildlikeCover = () => {
    const rand = childlikeDoodles[Math.floor(Math.random() * childlikeDoodles.length)];
    const imgEl = document.getElementById('m_prev');
    const inputEl = document.getElementById('m_url');
    if (imgEl) imgEl.src = rand;
    if (inputEl) inputEl.value = rand;
  };

  // --- 🏠 HOME PAGE CMS MODULE (主页) ---
  async function renderHomeCMS(container) {
    const { data: configs } = await db.from('site_config').select('*');
    const c = (configs || []).reduce((acc, curr) => { acc[curr.key] = curr.value; return acc; }, {});
    const { data: songs } = await db.from('music_works').select('id, title').order('created_at', { ascending: false });

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem; flex-wrap:wrap; gap:15px;">
        <div>
          <h1 style="color:var(--gold); margin:0;">🏠 主页内容管理 (Home Page CMS)</h1>
          <p style="color:#888; font-size:0.9rem; margin-top:5px;">
            编辑主页 Hero 视频/背景、最新主打推荐歌曲、愿景文案与社交平台链接。
          </p>
        </div>
        <div style="display:flex; gap:10px;">
          <a href="index.html" target="_blank" class="btn-tiny" style="padding:10px 16px; text-decoration:none; display:inline-flex; align-items:center; gap:6px; color:var(--gold); border-color:var(--gold);">
            <i class="fas fa-external-link-alt"></i> 预览前台主页
          </a>
          <button class="btn btn-submit" style="width:auto; padding:10px 24px;" onclick="saveHomeCMS()">💾 保存主页配置</button>
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:2.5rem; max-width:1100px;">
        <!-- 1. 最新歌曲推荐设定 -->
        <div class="cms-card" style="border-left: 4px solid #64D28A;">
          <h3 style="color:#64D28A; margin-top:0; display:flex; align-items:center; gap:8px;">
            <span>🎵</span> 主页推荐主打单曲 (Latest Harvest Music)
          </h3>
          <p style="font-size:0.8rem; color:#888; margin-bottom:1.5rem;">选择一首在主页“最新歌曲”板块高亮展示的原创作品。</p>
          <div style="margin-bottom:15px;">
            <label style="display:block; color:#aaa; font-size:0.8rem; margin-bottom:5px;">选择推荐单曲 (Featured Single)</label>
            <select id="in_latest_music_id" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:12px; border-radius:6px;">
              <option value="">-- 默认取最新发布的一首 --</option>
              ${(songs || []).map(s => `
                <option value="${s.id}" ${c['cfg_latest_music_id'] === s.id ? 'selected' : ''}>${s.title} (${s.artist || 'Harvester'})</option>
              `).join('')}
            </select>
          </div>
        </div>

        <!-- 2. 全局社交网络链接 -->
        <div class="cms-card" style="border-left: 4px solid #1877F2;">
          <h3 style="color:#1877F2; margin-top:0; display:flex; align-items:center; gap:8px;">
            <span>🌐</span> 官方社群媒体与联络链接 (Header Socials)
          </h3>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin-top:15px;">
            <div>
              <label style="display:block; color:#aaa; font-size:0.8rem; margin-bottom:5px;"><i class="fab fa-whatsapp" style="color:#25D366;"></i> WhatsApp 咨询链接</label>
              <input type="text" id="in_nav_wa" value="${c['cfg_nav_wa'] || 'https://wa.me/60187755581?text=Hi%20Harvester%2C%20I%20would%20like%20to%20make%20an%20enquiry.'}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:10px; border-radius:6px;">
            </div>
            <div>
              <label style="display:block; color:#aaa; font-size:0.8rem; margin-bottom:5px;"><i class="fab fa-spotify" style="color:#1DB954;"></i> Spotify 艺人主页</label>
              <input type="text" id="in_nav_sp" value="${c['cfg_nav_sp'] || 'https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS'}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:10px; border-radius:6px;">
            </div>
            <div>
              <label style="display:block; color:#aaa; font-size:0.8rem; margin-bottom:5px;"><i class="fab fa-facebook" style="color:#1877F2;"></i> Facebook 专页</label>
              <input type="text" id="in_nav_fb" value="${c['cfg_nav_fb'] && c['cfg_nav_fb'] !== '#' ? c['cfg_nav_fb'] : 'https://www.facebook.com/harvester2025'}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:10px; border-radius:6px;">
            </div>
            <div>
              <label style="display:block; color:#aaa; font-size:0.8rem; margin-bottom:5px;"><i class="fab fa-instagram" style="color:#E1306C;"></i> Instagram 账号</label>
              <input type="text" id="in_nav_ig" value="${c['cfg_nav_ig'] && c['cfg_nav_ig'] !== '#' ? c['cfg_nav_ig'] : 'https://www.instagram.com/harvestermusic.production?stkn=bzVqMGhvN2Q2OXZo&utm_source=qr'}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:10px; border-radius:6px;">
            </div>
            <div style="grid-column: 1/-1;">
              <label style="display:block; color:#aaa; font-size:0.8rem; margin-bottom:5px;"><i class="fab fa-youtube" style="color:#FF0000;"></i> YouTube 官方频道</label>
              <input type="text" id="in_nav_yt" value="${c['cfg_nav_yt'] && c['cfg_nav_yt'] !== '#' ? c['cfg_nav_yt'] : 'https://youtube.com/@harvestermusic.production?si=JvBC-9qgOsKdI3XT'}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:10px; border-radius:6px;">
            </div>
          </div>
        </div>

        <button class="btn btn-submit" style="width:100%; padding:14px; font-size:1rem;" onclick="saveHomeCMS()">💾 立即保存主页配置</button>
      </div>
    `;
  }

  window.saveHomeCMS = async () => {
    const payload = [
      { key: 'cfg_latest_music_id', value: document.getElementById('in_latest_music_id')?.value.trim() || '' },
      { key: 'cfg_nav_wa', value: document.getElementById('in_nav_wa')?.value.trim() || '' },
      { key: 'cfg_nav_sp', value: document.getElementById('in_nav_sp')?.value.trim() || '' },
      { key: 'cfg_nav_fb', value: document.getElementById('in_nav_fb')?.value.trim() || '' },
      { key: 'cfg_nav_ig', value: document.getElementById('in_nav_ig')?.value.trim() || '' },
      { key: 'cfg_nav_yt', value: document.getElementById('in_nav_yt')?.value.trim() || '' }
    ];

    try {
      for (const item of payload) {
        await db.from('site_config').upsert(item, { onConflict: 'key' });
      }
      alert("🎉 主页配置已成功保存并实时生效！");
      renderCMS();
    } catch(err) {
      alert("保存失败: " + err.message);
    }
  };

  // --- 🎨 莫兰迪五大高定色系标准配置表 (5 Signature Morandi Sets) ---
  const MORANDI_5_SETS = [
    {
      id: "palette_1_sage",
      num: "01",
      name: "01 · 鼠尾草灰绿",
      nameEn: "Sage Green & Slate",
      icon: "🍃",
      spine_bg: "#607272",
      spine_color: "#FDF9EE",
      theme_color: "#182222",
      bg_center: "#384a4a",
      bg_mid: "#222e2e",
      bg_outer: "#131b1b",
      glow: "rgba(193, 194, 167, 0.45)",
      colors: [
        { label: "冷青石灰", hex: "#778585" },
        { label: "鼠尾草绿", hex: "#C1C2A7" },
        { label: "柔粉砂色", hex: "#EBD6CE" },
        { label: "象牙暖白", hex: "#FDF9EE" }
      ],
      fold1: { name: "歌词", bg: "#EBD6CE", text: "#2c3434" },
      fold2: { name: "经文/心得", bg: "#687676", text: "#FDF9EE" },
      fold3: { name: "同工团队", bg: "#C1C2A7", text: "#222a2a" }
    },
    {
      id: "palette_2_lavender",
      num: "02",
      name: "02 · 雾霭薰衣紫",
      nameEn: "Misty Lavender & Slate Lilac",
      icon: "🪻",
      spine_bg: "#6c6374",
      spine_color: "#FDF9EE",
      theme_color: "#211b27",
      bg_center: "#42374b",
      bg_mid: "#2a2231",
      bg_outer: "#17121b",
      glow: "rgba(198, 183, 207, 0.45)",
      colors: [
        { label: "暗灰紫", hex: "#7C7582" },
        { label: "雾紫灰", hex: "#C6B7CF" },
        { label: "薄荷雾白", hex: "#D5DEDD" },
        { label: "象牙暖白", hex: "#FDF9EE" }
      ],
      fold1: { name: "歌词", bg: "#D5DEDD", text: "#2a2330" },
      fold2: { name: "经文/心得", bg: "#6c6473", text: "#FDF9EE" },
      fold3: { name: "同工团队", bg: "#C6B7CF", text: "#221a28" }
    },
    {
      id: "palette_3_eucalyptus",
      num: "03",
      name: "03 · 尤加利草木",
      nameEn: "Eucalyptus & Earth Grey",
      icon: "🌿",
      spine_bg: "#556958",
      spine_color: "#FDF9EE",
      theme_color: "#1b241d",
      bg_center: "#37493b",
      bg_mid: "#233026",
      bg_outer: "#141c16",
      glow: "rgba(180, 194, 182, 0.45)",
      colors: [
        { label: "暖木灰褐", hex: "#857979" },
        { label: "尤加利绿", hex: "#B4C2B6" },
        { label: "柔淡紫", hex: "#E0CEE0" },
        { label: "象牙暖白", hex: "#FDF9EE" }
      ],
      fold1: { name: "歌词", bg: "#E0CEE0", text: "#2a2323" },
      fold2: { name: "经文/心得", bg: "#7a6d6d", text: "#FDF9EE" },
      fold3: { name: "同工团队", bg: "#B4C2B6", text: "#1c241e" }
    },
    {
      id: "palette_4_dusty_rose",
      num: "04",
      name: "04 · 烟粉豆沙灰",
      nameEn: "Dusty Rose & Olive Taupe",
      icon: "🌸",
      spine_bg: "#755963",
      spine_color: "#FDF9EE",
      theme_color: "#241b1f",
      bg_center: "#48343b",
      bg_mid: "#2d2025",
      bg_outer: "#191114",
      glow: "rgba(207, 183, 188, 0.45)",
      colors: [
        { label: "橄榄褐灰", hex: "#858479" },
        { label: "烟粉豆沙", hex: "#CFB7BC" },
        { label: "雾蓝紫", hex: "#D6DAEB" },
        { label: "象牙暖白", hex: "#FDF9EE" }
      ],
      fold1: { name: "歌词", bg: "#D6DAEB", text: "#2b2326" },
      fold2: { name: "经文/心得", bg: "#79786d", text: "#FDF9EE" },
      fold3: { name: "同工团队", bg: "#CFB7BC", text: "#261b20" }
    },
    {
      id: "palette_5_burgundy_wine",
      num: "05",
      name: "05 · 勃艮第夜幕",
      nameEn: "Burgundy & Warm Linen",
      icon: "🍷",
      spine_bg: "#52222e",
      spine_color: "#FDF9EE",
      theme_color: "#210e14",
      bg_center: "#481a25",
      bg_mid: "#2d0f17",
      bg_outer: "#19080d",
      glow: "rgba(180, 70, 95, 0.45)",
      colors: [
        { label: "勃艮第酒红", hex: "#5c2734" },
        { label: "暖砂陶土", hex: "#dfd5c4" },
        { label: "亚麻草木灰", hex: "#dedad4" },
        { label: "象牙暖白", hex: "#FDF9EE" }
      ],
      fold1: { name: "歌词", bg: "#dfd5c4", text: "#2c241c" },
      fold2: { name: "经文/心得", bg: "#5c2734", text: "#fae8ec" },
      fold3: { name: "同工团队", bg: "#dedad4", text: "#26221f" }
    }
  ];

  function getMorandiSet(item, idx = 0) {
    if (item?.palette_id) {
      const found = MORANDI_5_SETS.find(s => s.id === item.palette_id);
      if (found) return found;
    }
    const spine = (item?.spine_bg || '').trim().toLowerCase();
    if (spine) {
      const found = MORANDI_5_SETS.find(s => s.spine_bg.toLowerCase() === spine);
      if (found) return found;
    }
    const theme = (item?.theme_color || '').trim().toLowerCase();
    if (theme) {
      const found = MORANDI_5_SETS.find(s => s.theme_color.toLowerCase() === theme || (s.bg_mid && s.bg_mid.toLowerCase() === theme));
      if (found) return found;
    }
    return MORANDI_5_SETS[idx % MORANDI_5_SETS.length];
  }

  window.selectMorandiSet = (setId) => {
    const selInput = document.getElementById('m_selected_morandi_set');
    if (selInput) selInput.value = setId;

    const set = MORANDI_5_SETS.find(s => s.id === setId) || MORANDI_5_SETS[0];

    const spineBgEl = document.getElementById('m_spine_bg_hex');
    if (spineBgEl) spineBgEl.value = set.spine_bg;
    const spineClrEl = document.getElementById('m_spine_clr_hex');
    if (spineClrEl) spineClrEl.value = set.spine_color;
    const themeClrEl = document.getElementById('m_theme_clr_hex');
    if (themeClrEl) themeClrEl.value = set.theme_color;
    const spineTEl = document.getElementById('m_spine_t');
    if (spineTEl) spineTEl.value = "";

    document.querySelectorAll('.morandi-set-card').forEach(card => {
      const cardId = card.getAttribute('data-set-id');
      const isSelected = cardId === setId;
      card.style.borderColor = isSelected ? 'var(--gold)' : '#262626';
      card.style.background = isSelected ? 'rgba(246, 210, 138, 0.08)' : '#0d0d0d';
      card.style.boxShadow = isSelected ? '0 0 16px rgba(246, 210, 138, 0.25)' : 'none';
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = isSelected;
      const checkIcon = card.querySelector('.morandi-check-icon');
      if (checkIcon) checkIcon.style.opacity = isSelected ? '1' : '0';
    });

    const spinePreview = document.getElementById('modalSpinePreview');
    if (spinePreview) {
      spinePreview.style.background = set.spine_bg;
      spinePreview.innerHTML = `
        <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#fff; box-shadow:0 0 4px rgba(255,255,255,0.8);"></span>
        <span>已选专属色系：<strong>${set.name}</strong>（${set.spine_bg} · 3D 书脊极简硬壳质感）</span>
      `;
    }
  };

  // --- 🎵 音乐与歌谱集 (Music & Scores Management Organized by Year) ---
  let adminMusicYearFilter = 'ALL';
  window.setAdminMusicYearFilter = (yr) => {
    adminMusicYearFilter = yr;
    const body = document.getElementById('moduleBody');
    if (body) renderMusic(body);
  };

  async function renderMusic(container) {
    const { data: rawSongs } = await db.from('music_works').select('*').order('created_at', {ascending: false});
    const { data: cfg } = await db.from('site_config').select('value').eq('key', 'cfg_latest_music_id').maybeSingle();
    const latestId = cfg?.value;

    const { data: albumCfg } = await db.from('site_config').select('value').eq('key', 'cfg_albums_custom_json').maybeSingle();
    let albumsCustom = [];
    if (albumCfg?.value) {
      try { albumsCustom = JSON.parse(albumCfg.value); } catch(e){}
    }

    const songs = (rawSongs || []).map((s, idx) => {
      const customMatch = albumsCustom.find(c => c.id === s.id || c.title === s.title);
      const matchedSet = getMorandiSet(customMatch || s, idx);
      const year = String(customMatch?.year || s.year || '2025');
      const spineBg = customMatch?.spine_bg || matchedSet.spine_bg;
      const spineClr = customMatch?.spine_color || matchedSet.spine_color;
      const spineTxt = customMatch?.spine_text || `${s.title}`;
      const coverUrl = s.cover_url || customMatch?.cover_url || childlikeDoodles[idx % childlikeDoodles.length];
      
      const rawAudio = customMatch?.preview_audio_url || (s.audio_url && !s.audio_url.includes('youtube.com') && !s.audio_url.includes('youtu.be') ? s.audio_url : '');
      const previewAudio = rawAudio;
      const youtubeUrl = customMatch?.youtube_url || (s.audio_url && (s.audio_url.includes('youtube.com') || s.audio_url.includes('youtu.be')) ? s.audio_url : '');
      const spotifyUrl = customMatch?.spotify_url || s.spotify_url || '';

      return { ...s, customMatch, matchedSet, year, spineBg, spineClr, spineTxt, coverUrl, previewAudio, youtubeUrl, spotifyUrl };
    });

    // Extract unique available years sorted descending
    const availableYears = Array.from(new Set(songs.map(s => s.year).filter(Boolean)));
    availableYears.sort((a, b) => b.localeCompare(a));

    // Filter by selected year
    const displayYears = adminMusicYearFilter === 'ALL' 
      ? availableYears 
      : availableYears.filter(y => y === adminMusicYearFilter);

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.8rem; flex-wrap:wrap; gap:15px;">
        <div>
          <h1 style="color:var(--gold); margin:0; font-size:1.8rem;">🎵 音乐与歌谱集 (Music & Scores)</h1>
          <p style="color:#888; font-size:0.85rem; margin-top:5px;">管理原创诗歌单曲、3D 展架唱片、15秒试听音频、PDF 歌谱与风琴折档案（按年份归类管理）。</p>
        </div>
        <button class="btn btn-submit" style="width:auto; padding:12px 28px; font-weight:700;" onclick="openMusicModal()">+ 发布新单曲 / 歌谱</button>
      </div>

      <!-- Year Filter Tabs -->
      <div style="display:flex; gap:10px; margin-bottom:28px; flex-wrap:wrap; align-items:center; background:#0e0e0e; padding:10px 16px; border-radius:10px; border:1px solid #1a1a1a;">
        <span style="font-size:0.78rem; color:#888; font-weight:bold; letter-spacing:1px; margin-right:6px;">📅 年份筛选：</span>
        <button class="btn-tiny" style="${adminMusicYearFilter==='ALL'?'background:var(--gold); color:#000; font-weight:bold; border-color:var(--gold);':''}" onclick="setAdminMusicYearFilter('ALL')">
          全部 (${songs.length})
        </button>
        ${availableYears.map(y => {
          const count = songs.filter(s => s.year === y).length;
          const isAct = adminMusicYearFilter === y;
          return `
            <button class="btn-tiny" style="${isAct?'background:var(--gold); color:#000; font-weight:bold; border-color:var(--gold);':''}" onclick="setAdminMusicYearFilter('${y}')">
              ${y} 年 (${count})
            </button>
          `;
        }).join('')}
      </div>

      <!-- Songs Grouped by Year -->
      ${displayYears.length === 0 ? `
        <div style="text-align:center; color:#555; padding:60px; background:#0a0a0a; border-radius:12px; border:1px solid #1a1a1a;">
          暂无单曲数据，点击右上角发布新单曲
        </div>
      ` : displayYears.map(y => {
        const groupSongs = songs.filter(s => s.year === y);
        return `
          <div style="margin-bottom:38px;">
            <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid #1f1f1f; padding-bottom:10px; margin-bottom:18px;">
              <h2 style="font-size:1.25rem; color:#e0d2be; margin:0; display:flex; align-items:center; gap:10px;">
                <span style="background:rgba(246,210,138,0.15); color:var(--gold); border:1px solid rgba(246,210,138,0.3); padding:3px 10px; border-radius:6px; font-size:0.85rem; font-family:monospace; font-weight:bold;">${y}</span>
                ${y} 年度单曲集
                <span style="font-size:0.8rem; color:#666; font-weight:normal;">(共 ${groupSongs.length} 首)</span>
              </h2>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap:20px;">
              ${groupSongs.map(s => `
                <div style="background:#0e0e0e; border:1px solid #1f1f1f; border-radius:14px; padding:20px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 10px 25px rgba(0,0,0,0.5);">
                  <div>
                    <!-- Top Cover & Meta Row -->
                    <div style="display:flex; gap:16px; align-items:center; margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid #1a1a1a;">
                      <img src="${s.coverUrl}" 
                           style="width:78px; height:78px; object-fit:cover; border-radius:10px; border:1px solid #333; background:#181818;"
                           onerror="this.src='${childlikeDoodles[0]}'">
                      <div style="flex:1; overflow:hidden;">
                        <h3 style="margin:0; color: #F6F4F0; font-size:1.1rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; display:flex; align-items:center; gap:8px;">
                          ${s.title}
                          <span style="color:var(--gold); font-size:0.7rem; background:rgba(246,210,138,0.15); border:1px solid rgba(246,210,138,0.35); padding:2px 8px; border-radius:4px; font-family:monospace; font-weight:bold;">${s.year}</span>
                          ${s.id === latestId || s.is_latest ? '<span style="color:var(--gold); font-size:0.65rem; background:rgba(246,210,138,0.12); padding:2px 8px; border-radius:50px; border:1px solid rgba(246,210,138,0.3);">首推</span>' : ''}
                        </h3>
                        <p style="margin:4px 0 0; color:#888; font-size:0.8rem;">${s.customMatch?.artist || s.artist || 'Harvester Worship'}</p>
                        <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:8px;">
                          <span style="font-size:0.72rem; color:${s.previewAudio ? '#f6d28a' : '#666'}; background:${s.previewAudio ? 'rgba(246,210,138,0.12)' : 'rgba(255,255,255,0.04)'}; border:1px solid ${s.previewAudio ? 'rgba(246,210,138,0.3)' : 'rgba(255,255,255,0.08)'}; padding:2px 7px; border-radius:4px; display:inline-flex; align-items:center; gap:4px;">
                            <i class="fas fa-headphones"></i> ${s.previewAudio ? '15s 试听就绪' : '未传试听'}
                          </span>
                          <span style="font-size:0.72rem; color:${s.score_url ? '#2ed573' : '#666'}; background:${s.score_url ? 'rgba(46,213,115,0.1)' : 'rgba(255,255,255,0.04)'}; border:1px solid ${s.score_url ? 'rgba(46,213,115,0.3)' : 'rgba(255,255,255,0.08)'}; padding:2px 7px; border-radius:4px; display:inline-flex; align-items:center; gap:4px;">
                            <i class="fas fa-file-pdf"></i> ${s.score_url ? '歌谱就绪' : '无歌谱'}
                          </span>
                          <span style="font-size:0.72rem; color:${s.youtubeUrl ? '#ff4d4d' : '#666'}; background:${s.youtubeUrl ? 'rgba(255,77,77,0.1)' : 'rgba(255,255,255,0.04)'}; border:1px solid ${s.youtubeUrl ? 'rgba(255,77,77,0.3)' : 'rgba(255,255,255,0.08)'}; padding:2px 7px; border-radius:4px; display:inline-flex; align-items:center; gap:4px;">
                            <i class="fab fa-youtube"></i> ${s.youtubeUrl ? 'YouTube' : '无油管'}
                          </span>
                          <span style="font-size:0.72rem; color:${s.spotifyUrl ? '#1db954' : '#666'}; background:${s.spotifyUrl ? 'rgba(29,185,84,0.1)' : 'rgba(255,255,255,0.04)'}; border:1px solid ${s.spotifyUrl ? 'rgba(29,185,84,0.3)' : 'rgba(255,255,255,0.08)'}; padding:2px 7px; border-radius:4px; display:inline-flex; align-items:center; gap:4px;">
                            <i class="fab fa-spotify"></i> ${s.spotifyUrl ? 'Spotify' : '无Spotify'}
                          </span>
                        </div>
                      </div>
                    </div>

                    ${s.previewAudio ? `
                      <div style="background:#141414; padding:6px 10px; border-radius:8px; border:1px solid #222; margin-bottom:10px;">
                        <audio controls style="width:100%; height:30px;" src="${s.previewAudio}"></audio>
                      </div>
                    ` : ''}

                    <!-- 3D Spine & Morandi Set Preview Badge -->
                    <div style="background:${s.spineBg}; color:#fff; padding:6px 12px; border-radius:6px; font-size:0.75rem; font-weight:bold; letter-spacing:0.5px; margin-bottom:12px; border:1px solid rgba(255,255,255,0.2); display:flex; align-items:center; justify-content:space-between; text-shadow:0 1px 2px rgba(0,0,0,0.8);">
                      <div style="display:flex; align-items:center; gap:8px;">
                        <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#fff; box-shadow:0 0 4px rgba(255,255,255,0.8);"></span>
                        <span>${s.matchedSet ? s.matchedSet.icon + ' ' + s.matchedSet.name : '3D 书脊底色：' + s.spineBg}</span>
                      </div>
                      <div style="display:flex; gap:3px;">
                        ${(s.matchedSet?.colors || []).map(c => `<span title="${c.label}: ${c.hex}" style="width:10px; height:10px; border-radius:2px; background:${c.hex}; display:inline-block; border:1px solid rgba(255,255,255,0.3);"></span>`).join('')}
                      </div>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div style="display:flex; gap:8px; margin-top:8px;">
                    <button class="btn-tiny" style="flex:1; padding:8px; color:var(--gold); border-color:var(--gold);" onclick="openMusicModal('${s.id}')">⚙️ 编辑单曲与歌谱</button>
                    <button class="btn-tiny danger" style="padding:8px 12px;" onclick="deleteItem('music_works', '${s.id}')">🗑️</button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }).join('')}
    `;
  }

  window.openMusicModal = async (id = null) => {
    const btn = event.currentTarget;
    const originalText = btn ? btn.innerText : '';
    if (id && btn) { btn.innerText = "⏳ 正在拉取数据..."; btn.disabled = true; }

    try {
      let s = null;
      let spineCustom = null;
      if (id) {
        const { data, error } = await db.from('music_works').select('*').eq('id', id).single();
        if (error) throw error;
        const { data: cfg } = await db.from('site_config').select('value').eq('key', 'cfg_latest_music_id').maybeSingle();
        s = { ...data, force_latest: data.id === cfg?.value };

        const { data: albumCfg } = await db.from('site_config').select('value').eq('key', 'cfg_albums_custom_json').maybeSingle();
        if (albumCfg?.value) {
          try {
            const arr = JSON.parse(albumCfg.value);
            spineCustom = arr.find(c => c.id === s.id || c.title === s.title);
          } catch(e){}
        }
      }

      const isEdit = !!s;
      const currentSet = getMorandiSet(spineCustom || s, 0);
      const initialCover = s?.cover_url || spineCustom?.cover_url || childlikeDoodles[Math.floor(Math.random() * childlikeDoodles.length)];
      const spotifyUrl = spineCustom?.spotify_url || s?.spotify_url || '';
      let previewAudio = spineCustom?.preview_audio_url || '';
      let youtubeUrl = spineCustom?.youtube_url || '';
      if (!previewAudio && s?.audio_url) {
        if (s.audio_url.includes('youtube.com') || s.audio_url.includes('youtu.be')) {
          if (!youtubeUrl) youtubeUrl = s.audio_url;
        } else {
          previewAudio = s.audio_url;
        }
      }
      if (!youtubeUrl && s?.audio_url && (s.audio_url.includes('youtube.com') || s.audio_url.includes('youtu.be'))) {
        youtubeUrl = s.audio_url;
      }
      const titleEn = spineCustom?.title_en || "Harvester Single";
      const year = spineCustom?.year || "2025";
      const genre = spineCustom?.genre || "Worship / CCM · 2025";
      const keyBpm = spineCustom?.key_bpm || "KEY: C · 72 BPM";
      const scripture = spineCustom?.scripture || "「神是个灵，所以拜他的必须用心灵和诚实拜他。」—— 约翰福音 4:24";
      const notes = spineCustom?.notes || "在瞬息万变、充满喧嚣的世界里，愿我们每一次开口赞美，都是心灵与圣灵的真实对话。";
      const composer = spineCustom?.composer || spineCustom?.artist || s?.artist || "Harvester Worship";
      const arrangement = spineCustom?.arrangement || "Harvester Music Production";
      const vocals = spineCustom?.vocals || "";
      const mixing = spineCustom?.mixing || "";
      const photo1 = spineCustom?.photo_1 || initialCover;
      const photo2 = spineCustom?.photo_2 || childlikeDoodles[1];
      const photo3 = spineCustom?.photo_3 || childlikeDoodles[2];

      const modal = document.createElement('div');
      modal.id = 'musicEditModal';
      modal.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.92); z-index:9999; display:flex; justify-content:center; align-items:center; backdrop-filter:blur(12px); padding:20px;";
      modal.innerHTML = `
        <div style="background:#111; border:1.5px solid var(--gold); border-radius:18px; padding:2.2rem; width:100%; max-width:760px; max-height:92vh; overflow-y:auto; box-shadow:0 25px 70px rgba(0,0,0,1);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; border-bottom:1px solid #222; padding-bottom:10px;">
            <div>
              <h2 style="color:var(--gold); margin:0; font-size:1.4rem;">${isEdit ? '编辑单曲与歌谱档案' : '发布新单曲与歌谱'}</h2>
              <p style="color:#888; font-size:0.8rem; margin:4px 0 0;">可完整自定义前台 3D 展台、立体书脊、PDF 歌谱与莫兰迪风琴折内页所有内容</p>
            </div>
            <button class="btn-tiny" onclick="this.closest('#musicEditModal').remove()">✕ 关闭</button>
          </div>
          
          <!-- 1. 封面管理与童趣手绘预设 -->
          <div style="margin-bottom:20px; background:#0a0a0a; padding:18px; border-radius:12px; border:1px solid #222; text-align:center;">
            <label style="display:block; margin-bottom:8px; color:var(--gold); font-size:0.85rem; font-weight:bold;">📸 单曲主封面 (Single Cover / Poster Sticker)</label>
            <div style="width:150px; height:150px; margin:0 auto 12px; overflow:hidden; border-radius:12px; border:1.5px solid rgba(246,210,138,0.3); background:#181818; display:flex; align-items:center; justify-content:center;">
              <img id="m_prev" src="${initialCover}" style="width:100%; height:100%; object-fit:cover; object-position:${initialCoverPos}; transform:scale(${initialCoverZoom}); transform-origin:${initialCoverPos}; transition:all 0.1s ease;" onerror="this.src='assets/logo.png'">
            </div>
            
            <div style="display:flex; gap:10px; justify-content:center; margin-bottom:10px;">
              <button type="button" class="btn-tiny" style="background:rgba(246,210,138,0.15); border-color:var(--gold); color:var(--gold); padding:8px 16px;" onclick="setRandomChildlikeCover()">
                🎨 换一组随机童趣手绘封面
              </button>
            </div>

            <input type="file" id="mf_up" style="font-size:0.8rem; color:#aaa; margin-bottom:8px; width:100%;">
            <button type="button" class="btn-tiny" style="width:100%; padding:8px;" onclick="uploadFile('mf_up', 'm_url', 'm_prev')">📤 上传自定义封面图片</button>
            <input type="hidden" id="m_url" value="${initialCover}">

            <!-- 🎚️ 单曲封面焦点与裁剪调整 -->
            ${renderImageCropControllerHTML({
              id: 'm_cover_crop',
              targetImgId: 'm_prev',
              posVal: initialCoverPos,
              zoomVal: initialCoverZoom,
              posInputId: 'm_cover_pos',
              zoomInputId: 'm_cover_zoom',
              label: '调整单曲封面呈现区域与焦点 (Cover Crop & Zoom)',
              hint: '因照片与方框比例不同，可微调上下/左右位置或放大，让封面主体居中完美呈现'
            })}
          </div>

          <!-- 2. 基本信息 -->
          <div style="background:#0a0a0a; border:1px solid #222; border-radius:10px; padding:15px; margin-bottom:15px;">
            <label style="display:block; margin-bottom:12px; color:var(--gold); font-size:0.85rem; font-weight:bold;">🏷️ 基础信息 (Basic Information)</label>
            
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin-bottom:12px;">
              <div>
                <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem;">歌曲中文名称 (Title) *</label>
                <input type="text" id="m_t" value="${s?.title || ''}" placeholder="例如：更新敬拜" style="width:100%; padding:10px;">
              </div>
              <div>
                <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem;">英文译名 / 副标题 (English Title)</label>
                <input type="text" id="m_title_en" value="${titleEn}" placeholder="例如：Renewed Worship" style="width:100%; padding:10px;">
              </div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:12px;">
              <div>
                <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem;">所属歌手 / 团队</label>
                <input type="text" id="m_artist" value="${spineCustom?.artist || s?.artist || 'Harvester Worship'}" placeholder="例如：Harvester Worship" style="width:100%; padding:8px;">
              </div>
              <div>
                <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem;">发行年份 (Year)</label>
                <input type="text" id="m_year" value="${year}" placeholder="2025" style="width:100%; padding:8px;">
              </div>
              <div>
                <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem;">音乐流派 (Genre)</label>
                <input type="text" id="m_genre" value="${genre}" placeholder="Worship / CCM · 2025" style="width:100%; padding:8px;">
              </div>
            </div>
          </div>

          <!-- 3. 五大高定莫兰迪色系（单选勾选） -->
          <div style="background:#0a0a0a; border:1.5px solid rgba(246,210,138,0.3); border-radius:12px; padding:18px; margin-bottom:15px;">
            <div style="margin-bottom:14px;">
              <label style="color:var(--gold); font-size:0.92rem; font-weight:bold; margin:0; display:flex; align-items:center; gap:8px;">
                🎨 莫兰迪五大高定色系选择 (5 Signature Morandi Sets)
              </label>
              <p style="color:#888; font-size:0.75rem; margin:4px 0 0; line-height:1.4;">
                勾选其中一个高定色系 Set，系统将自动联动 3D 书脊底色、动态环境背景与三折页内页配色。前台 3D 书脊统一为极简纯粹无字硬壳质感。
              </p>
            </div>

            <!-- 绑定字段（隐藏存储） -->
            <input type="hidden" id="m_selected_morandi_set" value="${currentSet.id}">
            <input type="hidden" id="m_theme_clr_hex" value="${currentSet.theme_color}">
            <input type="hidden" id="m_spine_bg_hex" value="${currentSet.spine_bg}">
            <input type="hidden" id="m_spine_clr_hex" value="${currentSet.spine_color}">
            <input type="hidden" id="m_spine_t" value="">

            <!-- 5 大高定色系单选卡片 -->
            <div style="display:grid; grid-template-columns: 1fr; gap:10px;">
              ${MORANDI_5_SETS.map(item => {
                const isSelected = item.id === currentSet.id;
                return `
                  <div class="morandi-set-card" data-set-id="${item.id}" onclick="selectMorandiSet('${item.id}')"
                       style="cursor:pointer; border:1.5px solid ${isSelected ? 'var(--gold)' : '#262626'}; background:${isSelected ? 'rgba(246, 210, 138, 0.08)' : '#0e0e0e'}; border-radius:10px; padding:12px 16px; transition:all 0.25s ease; ${isSelected ? 'box-shadow:0 0 16px rgba(246, 210, 138, 0.22);' : ''}">
                    <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
                      
                      <!-- 左侧：单选勾选框 + 色系名称 + 书脊标 -->
                      <div style="display:flex; align-items:center; gap:12px; min-width:240px;">
                        <input type="radio" name="morandi_set_radio" value="${item.id}" ${isSelected ? 'checked' : ''} style="width:18px; height:18px; accent-color:var(--gold); cursor:pointer;">
                        <div>
                          <div style="color:#FDF9EE; font-size:0.95rem; font-weight:bold; display:flex; align-items:center; gap:8px;">
                            <span>${item.icon} ${item.name}</span>
                            <span style="font-size:0.75rem; color:#888; font-weight:normal;">(${item.nameEn})</span>
                          </div>
                          <div style="display:flex; align-items:center; gap:8px; margin-top:4px;">
                            <span style="display:inline-flex; align-items:center; gap:5px; background:${item.spine_bg}; color:#fff; font-size:0.72rem; padding:2px 8px; border-radius:4px; border:1px solid rgba(255,255,255,0.25); text-shadow:0 1px 2px rgba(0,0,0,0.8);">
                              <span style="width:6px; height:6px; border-radius:50%; background:#fff;"></span>
                              书脊底色: ${item.spine_bg}
                            </span>
                            <span style="font-size:0.7rem; color:#666;">极简硬壳无字</span>
                          </div>
                        </div>
                      </div>

                      <!-- 右侧：核心4色点 + 三折页色彩预览 + 勾选标记 -->
                      <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
                        <!-- 核心提取4色板 -->
                        <div style="display:flex; flex-direction:column; gap:3px;">
                          <span style="font-size:0.68rem; color:#777;">核心色板:</span>
                          <div style="display:flex; gap:5px;">
                            ${item.colors.map(c => `
                              <div title="${c.label}: ${c.hex}" style="width:18px; height:18px; border-radius:4px; background:${c.hex}; border:1px solid rgba(255,255,255,0.2); box-shadow:0 1px 3px rgba(0,0,0,0.4);"></div>
                            `).join('')}
                          </div>
                        </div>

                        <!-- 三折页内页色彩 -->
                        <div style="display:flex; flex-direction:column; gap:3px;">
                          <span style="font-size:0.68rem; color:#777;">折页色彩:</span>
                          <div style="display:flex; gap:4px;">
                            <span title="折页1歌词 (${item.fold1.bg})" style="background:${item.fold1.bg}; color:${item.fold1.text}; font-size:0.65rem; padding:1px 6px; border-radius:3px; border:1px solid rgba(0,0,0,0.15); font-weight:bold;">折1</span>
                            <span title="折页2心得 (${item.fold2.bg})" style="background:${item.fold2.bg}; color:${item.fold2.text}; font-size:0.65rem; padding:1px 6px; border-radius:3px; border:1px solid rgba(255,255,255,0.15); font-weight:bold;">折2</span>
                            <span title="折页3团队 (${item.fold3.bg})" style="background:${item.fold3.bg}; color:${item.fold3.text}; font-size:0.65rem; padding:1px 6px; border-radius:3px; border:1px solid rgba(0,0,0,0.15); font-weight:bold;">折3</span>
                          </div>
                        </div>

                        <!-- 选中对勾图标 -->
                        <span class="morandi-check-icon" style="color:var(--gold); font-size:1.15rem; opacity:${isSelected ? '1' : '0'}; transition:opacity 0.2s;">
                          <i class="fas fa-check-circle"></i>
                        </span>
                      </div>

                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- 当前选中摘要指示条 -->
            <div id="modalSpinePreview" style="margin-top:14px; background:${currentSet.spine_bg}; color:#fff; padding:9px 14px; border-radius:8px; font-size:0.8rem; font-weight:bold; letter-spacing:0.5px; border:1px solid rgba(255,255,255,0.25); display:flex; align-items:center; gap:8px; text-shadow:0 1px 2px rgba(0,0,0,0.8); transition:background 0.3s ease;">
              <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#fff; box-shadow:0 0 4px rgba(255,255,255,0.8);"></span>
              <span>已选专属色系：<strong>${currentSet.name}</strong>（${currentSet.spine_bg} · 3D 书脊极简硬壳质感）</span>
            </div>
          </div>

          <!-- 4. 视听音频、外链与歌谱资源 -->
          <div style="background:#0a0a0a; border:1.5px solid rgba(246,210,138,0.25); border-radius:12px; padding:18px; margin-bottom:15px;">
            <label style="display:block; margin-bottom:12px; color:var(--gold); font-size:0.9rem; font-weight:bold;">🎧 15秒试听音频、外链与歌谱资源 (Audio & Media)</label>

            <!-- 15秒试听音频专属上传与设置 -->
            <div style="background:#141414; border:1px solid rgba(246,210,138,0.2); border-radius:10px; padding:14px; margin-bottom:16px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
                <label style="color:#f6d28a; font-size:0.85rem; font-weight:bold;">🎵 15秒试听音频文件 (15s Preview Audio)</label>
                <span style="font-size:0.72rem; color:#888;">供前台 3D 展架与浮动胶囊播放器直接调用</span>
              </div>
              <p style="font-size:0.75rem; color:#aaa; margin:0 0 10px 0; line-height:1.4;">
                支持直接上传 MP3、WAV、M4A、AAC 等音频文件。上传后前台底部胶囊播放器即可直接播放 15 秒精选片段。
              </p>
              
              <!-- Inline Audio Player Preview -->
              <audio id="prev_audio_el" controls style="width:100%; height:36px; margin-bottom:10px; display:${previewAudio ? 'block' : 'none'}; background:#222; border-radius:6px;" src="${previewAudio}"></audio>

              <div style="margin-bottom:8px;">
                <input type="text" id="m_preview_audio" value="${previewAudio}" placeholder="上传音频后自动填入直链，或直接粘贴音频 .mp3/.wav 文件直链" style="width:100%; padding:9px; background:#1a1a1a; border:1px solid #333; color:#fff; border-radius:6px; font-size:0.82rem;" oninput="updateAdminAudioPreview(this.value)">
              </div>

              <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
                <input type="file" id="mf_audio" accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.flac" style="font-size:0.78rem; color:#aaa; flex:1; min-width:200px;">
                <button type="button" class="btn-tiny" style="background:rgba(246,210,138,0.18); border-color:var(--gold); color:var(--gold); font-weight:bold; padding:8px 16px; border-radius:6px;" onclick="uploadAudioFile('mf_audio', 'm_preview_audio', 'prev_audio_el')">
                  📤 上传 15s 试听音频
                </button>
              </div>
            </div>

            <!-- YouTube Video Link -->
            <div style="margin-bottom:12px;">
              <label style="display:block; margin-bottom:4px; color:#aaa; font-size:0.8rem;">▶️ YouTube 官方 MV / 完整音频链接 (YouTube URL)</label>
              <input type="text" id="m_yt" value="${youtubeUrl}" placeholder="https://www.youtube.com/watch?v=..." style="width:100%; padding:8px; background:#1a1a1a; border:1px solid #333; color:#fff; border-radius:6px;">
            </div>

            <!-- Spotify Track Link -->
            <div style="margin-bottom:12px;">
              <label style="display:block; margin-bottom:4px; color:#aaa; font-size:0.8rem;">🟢 Spotify 官方试听链接 (Spotify Track URL)</label>
              <input type="text" id="m_sp" value="${spotifyUrl}" placeholder="https://open.spotify.com/track/..." style="width:100%; padding:8px; background:#1a1a1a; border:1px solid #333; color:#fff; border-radius:6px;">
            </div>

            <!-- PDF Score Upload -->
            <div style="margin-top:14px; padding-top:12px; border-top:1px solid #222;">
              <label style="display:block; margin-bottom:4px; color:#aaa; font-size:0.8rem;">📄 PDF 歌谱链接 / 文件上传 (Score PDF)</label>
              <input type="text" id="m_s" value="${s?.score_url || ''}" placeholder="可直接在下方上传 PDF 或粘贴链接" style="width:100%; padding:8px; margin-bottom:8px; background:#1a1a1a; border:1px solid #333; color:#fff; border-radius:6px;">
              <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
                <input type="file" id="mf_score" style="font-size:0.78rem; color:#aaa; flex:1; min-width:200px;" accept=".pdf">
                <button type="button" class="btn-tiny" style="padding:8px 16px;" onclick="uploadFile('mf_score', 'm_s')">📤 上传歌谱 PDF 文件</button>
              </div>
            </div>
          </div>

          <!-- 5. 莫兰迪风琴折内页 (FOLD 01 / 02 / 03 完整配置) -->
          <div style="background:#0a0a0a; border:1.5px solid rgba(78,205,196,0.3); border-radius:12px; padding:18px; margin-bottom:15px;">
            <label style="display:block; margin-bottom:12px; color:#4ecdc4; font-size:0.9rem; font-weight:bold;">📖 莫兰迪风琴折内页详细内容 (3-Fold Concertina Booklet)</label>
            
            <!-- Fold 1 -->
            <div style="background:#141414; padding:12px; border-radius:8px; margin-bottom:12px; border-left:3px solid #dfd5c4;">
              <span style="color:#dfd5c4; font-weight:bold; font-size:0.85rem; display:block; margin-bottom:6px;">📂 折页一 (沙色)：完整歌词与曲速调号</span>
              <div style="margin-bottom:8px;">
                <label style="font-size:0.75rem; color:#888; display:block;">调号与速度 (Key & BPM)</label>
                <input type="text" id="m_key_bpm" value="${keyBpm}" placeholder="KEY: C · 72 BPM" style="width:100%; padding:6px;">
              </div>
              <div style="margin-bottom:8px;">
                <label style="font-size:0.75rem; color:#888; display:block;">折页一顶部拍立得照片 URL</label>
                <input type="text" id="m_photo1" value="${photo1}" style="width:100%; padding:6px;">
              </div>
              <div>
                <label style="font-size:0.75rem; color:#888; display:block;">完整歌词 (换行保留)</label>
                <textarea id="m_d" placeholder="输入完整歌词..." style="width:100%; height:120px; padding:8px; line-height:1.5; font-size:0.85rem;">${s?.description || ''}</textarea>
              </div>
            </div>

            <!-- Fold 2 -->
            <div style="background:#141414; padding:12px; border-radius:8px; margin-bottom:12px; border-left:3px solid #5c2734;">
              <span style="color:#e28299; font-weight:bold; font-size:0.85rem; display:block; margin-bottom:6px;">📂 折页二 (勃艮第红)：创作心得与经文灵修</span>
              <div style="margin-bottom:8px;">
                <label style="font-size:0.75rem; color:#888; display:block;">核心圣经经文 (Scripture)</label>
                <input type="text" id="m_scripture" value="${scripture}" placeholder="「神是个灵，所以拜他的必须用心灵和诚实拜他。」—— 约翰福音 4:24" style="width:100%; padding:6px;">
              </div>
              <div style="margin-bottom:8px;">
                <label style="font-size:0.75rem; color:#888; display:block;">折页二底部艺术配图 URL</label>
                <input type="text" id="m_photo2" value="${photo2}" style="width:100%; padding:6px;">
              </div>
              <div>
                <label style="font-size:0.75rem; color:#888; display:block;">创作背景与灵修故事 (Worship Notes)</label>
                <textarea id="m_notes" placeholder="输入敬拜创作心得与祷告感受..." style="width:100%; height:90px; padding:8px; line-height:1.5; font-size:0.85rem;">${notes}</textarea>
              </div>
            </div>

            <!-- Fold 3 -->
            <div style="background:#141414; padding:12px; border-radius:8px; border-left:3px solid #dedad4;">
              <span style="color:#dedad4; font-weight:bold; font-size:0.85rem; display:block; margin-bottom:6px;">📂 折页三 (浅灰麻布)：同工团队与制作人员名单</span>
              <div style="margin-bottom:8px;">
                <label style="font-size:0.75rem; color:#888; display:block;">折页三顶部幕后相片 URL</label>
                <input type="text" id="m_photo3" value="${photo3}" style="width:100%; padding:6px;">
              </div>
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
                <div>
                  <label style="font-size:0.75rem; color:#888; display:block;">词曲创作</label>
                  <input type="text" id="m_composer" value="${composer}" placeholder="Harvester Worship" style="width:100%; padding:6px;">
                </div>
                <div>
                  <label style="font-size:0.75rem; color:#888; display:block;">编曲制作</label>
                  <input type="text" id="m_arrangement" value="${arrangement}" placeholder="Harvester Music Production" style="width:100%; padding:6px;">
                </div>
                <div>
                  <label style="font-size:0.75rem; color:#888; display:block;">人声主唱</label>
                  <input type="text" id="m_vocals" value="${vocals}" placeholder="选填（若不填写则前台不显示）" style="width:100%; padding:6px;">
                </div>
                <div>
                  <label style="font-size:0.75rem; color:#888; display:block;">录音混音母带</label>
                  <input type="text" id="m_mixing" value="${mixing}" placeholder="选填（若不填写则前台不显示）" style="width:100%; padding:6px;">
                </div>
              </div>
            </div>
          </div>

          <!-- 6. 首推设置 -->
          <div style="margin: 15px 0; background:rgba(246,210,138,0.06); padding:12px 15px; border-radius:8px; border:1px solid rgba(246,210,138,0.2);">
            <label style="display:flex; align-items:center; gap:10px; cursor:pointer; color:var(--gold); font-weight:500;">
              <input type="checkbox" id="m_latest" ${s?.force_latest || s?.is_latest ? 'checked' : ''} style="width:18px; height:18px; accent-color:var(--gold);"> 
              设为全站首推单曲 (首页首屏大图及播放器直接调用)
            </label>
          </div>

          <div style="display:flex; gap:15px; margin-top:20px; position:sticky; bottom:0; padding-top:10px; background:#111; border-top:1px solid #222;">
            <button class="btn btn-submit" style="flex:2; padding:12px;" onclick="saveMusic('${s?.id || ''}')">💾 保存单曲与歌谱档案</button>
            <button class="btn-tiny" style="flex:1;" onclick="this.closest('#musicEditModal').remove()">取消</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    } catch (err) {
      console.error("openMusicModal Fail:", err);
      alert("❌ 无法加载数据: " + (err.message || err));
    } finally {
      if (id && btn) { btn.innerText = originalText; btn.disabled = false; }
    }
  };

  window.saveMusic = async(id) => {
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = "⏳ 正在保存...";
    btn.disabled = true;

    try {
      const isLatest = document.getElementById('m_latest').checked;
      const title = document.getElementById('m_t').value.trim();
      const title_en = document.getElementById('m_title_en')?.value.trim() || "Harvester Single";
      const artist = document.getElementById('m_artist').value.trim() || 'Harvester Worship';
      const year = document.getElementById('m_year')?.value.trim() || "2025";
      const genre = document.getElementById('m_genre')?.value.trim() || "Worship / CCM · 2025";

      // 🎨 Read selected Morandi Set
      const selectedSetId = document.getElementById('m_selected_morandi_set')?.value || 'palette_1_sage';
      const selectedSet = MORANDI_5_SETS.find(set => set.id === selectedSetId) || MORANDI_5_SETS[0];

      const theme_color = selectedSet.theme_color;
      const spine_bg = selectedSet.spine_bg;
      const spine_color = selectedSet.spine_color;
      const spine_text = ""; // 前台 3D 书脊统一为极简纯粹无字硬壳质感
      const palette_id = selectedSet.id;
      const palette_name = selectedSet.name;

      const cover_url = document.getElementById('m_url').value.trim();
      const cover_pos = document.getElementById('m_cover_pos')?.value.trim() || '50% 50%';
      const cover_zoom = parseFloat(document.getElementById('m_cover_zoom')?.value) || 1.0;
      const preview_audio_url = document.getElementById('m_preview_audio')?.value.trim() || '';
      const youtube_url = document.getElementById('m_yt')?.value.trim() || '';
      const spotify_url = document.getElementById('m_sp')?.value.trim() || '';
      const score_url = document.getElementById('m_s').value.trim();
      const description = document.getElementById('m_d').value.trim();

      const key_bpm = document.getElementById('m_key_bpm')?.value.trim() || "KEY: C · 72 BPM";
      const scripture = document.getElementById('m_scripture')?.value.trim() || "";
      const notes = document.getElementById('m_notes')?.value.trim() || "";
      const composer = document.getElementById('m_composer')?.value.trim() || artist;
      const arrangement = document.getElementById('m_arrangement')?.value.trim() || "Harvester Music Production";
      const vocals = document.getElementById('m_vocals')?.value.trim() || "";
      const mixing = document.getElementById('m_mixing')?.value.trim() || "";
      const photo_1 = document.getElementById('m_photo1')?.value.trim() || cover_url;
      const photo_2 = document.getElementById('m_photo2')?.value.trim() || cover_url;
      const photo_3 = document.getElementById('m_photo3')?.value.trim() || cover_url;

      if (!title) throw new Error("请输入歌曲名称");

      // Save playable audio URL if provided, otherwise YouTube link
      const audio_url = preview_audio_url || youtube_url;

      const payload = {
        title,
        cover_url,
        cover_pos,
        cover_zoom,
        img_pos: cover_pos,
        img_zoom: cover_zoom,
        audio_url,
        score_url,
        description
      };

      let result;
      if(id) {
        result = await db.from('music_works').update(payload).eq('id', id).select();
      } else {
        result = await db.from('music_works').insert([payload]).select();
      }
      
      if (result.error) throw result.error;
      const savedId = id || result.data?.[0]?.id;

      // Also update site_config for 3D spine attributes and custom albums JSON
      const { data: albumCfg } = await db.from('site_config').select('value').eq('key', 'cfg_albums_custom_json').maybeSingle();
      let albums = [];
      if (albumCfg?.value) {
        try { albums = JSON.parse(albumCfg.value); } catch(e){}
      }
      const existingIdx = albums.findIndex(x => x.id === savedId || x.title === title);
      const albumObj = {
        id: savedId,
        title,
        title_en,
        artist,
        year,
        genre,
        palette_id,
        palette_name,
        theme_color,
        spine_text,
        spine_bg,
        spine_color,
        cover_url,
        cover_pos,
        cover_zoom,
        img_pos: cover_pos,
        img_zoom: cover_zoom,
        description,
        score_url,
        preview_audio_url,
        audio_url,
        youtube_url,
        spotify_url,
        key_bpm,
        scripture,
        notes,
        composer,
        arrangement,
        vocals,
        mixing,
        photo_1,
        photo_2,
        photo_3
      };
      if (existingIdx >= 0) {
        albums[existingIdx] = albumObj;
      } else {
        albums.push(albumObj);
      }
      await db.from('site_config').upsert({
        key: 'cfg_albums_custom_json',
        value: JSON.stringify(albums)
      }, { onConflict: 'key' });

      // Handle "Latest" featured single logic
      if (savedId) {
        if (isLatest) {
          await db.from('site_config').upsert({ key: 'cfg_latest_music_id', value: savedId }, { onConflict: 'key' });
        } else {
          const { data: currentLatest } = await db.from('site_config').select('value').eq('key', 'cfg_latest_music_id').maybeSingle();
          if (currentLatest?.value === savedId) {
            await db.from('site_config').delete().eq('key', 'cfg_latest_music_id');
          }
        }
      }

      alert("✅ 单曲与 3D 唱片档案已成功保存并实时同步全站！");
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

    const { data: configs } = await db.from('site_config').select('key, value').in('key', [
      'cfg_events_banner',
      'cfg_events_banner_title',
      'cfg_events_banner_date',
      'cfg_events_banner_venue',
      'cfg_events_banner_tag',
      'cfg_events_banner_link',
      'cfg_events_posters_json',
      'cfg_events_custom_json',
      'cfg_events_order'
    ]);
    const cfgMap = {};
    (configs || []).forEach(c => { cfgMap[c.key] = c.value; });

    const currentBanner = cfgMap['cfg_events_banner'] || '';
    const currentBannerTitle = cfgMap['cfg_events_banner_title'] || 'Harvester 精彩活动与巡回特会';
    const currentBannerDate = cfgMap['cfg_events_banner_date'] || 'FEATURED 精彩主推';
    const currentBannerVenue = cfgMap['cfg_events_banner_venue'] || '各城各乡 · 福音巡回';
    const currentBannerTag = cfgMap['cfg_events_banner_tag'] || 'HOT 热门';
    const currentBannerLink = cfgMap['cfg_events_banner_link'] || '';
    let customOrderIds = cfgMap['cfg_events_order'] ? cfgMap['cfg_events_order'].split(',').filter(Boolean) : [];

    // Parse Posters List from cfg_events_posters_json with strict source of truth
    let customPosters = [];
    let hasExplicitPostersConfig = false;
    if (cfgMap['cfg_events_posters_json'] !== undefined && cfgMap['cfg_events_posters_json'] !== null) {
      try {
        const parsed = JSON.parse(cfgMap['cfg_events_posters_json']);
        if (Array.isArray(parsed)) {
          customPosters = parsed;
          hasExplicitPostersConfig = true;
        }
      } catch(e) {}
    }

    // Only populate sample default posters if user has never configured site_config
    if (!hasExplicitPostersConfig && customPosters.length === 0) {
      if (currentBanner) {
        customPosters.push({
          id: 'poster_banner_1',
          title: currentBannerTitle,
          image_url: currentBanner,
          date: currentBannerDate,
          venue: currentBannerVenue,
          statusTag: currentBannerTag,
          link: currentBannerLink
        });
      }
      const defaultCurated = [
        {
          id: 'curated_p1',
          title: '收割敬拜之夜 · 吉隆坡特别专场',
          image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1000&q=80',
          date: '2025.11.15',
          time: '19:30 - 21:30',
          venue: '吉隆坡 · 全福敬拜大厅',
          statusTag: '报名中 🎟️',
          link: ''
        },
        {
          id: 'curated_p2',
          title: '原创赞美诗创作营 & 制作工作坊',
          image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80',
          date: '2025.08.20',
          time: '09:30 - 17:00',
          venue: '新山 · 音乐创作空间',
          statusTag: 'HOT 热门 🔥',
          link: ''
        },
        {
          id: 'curated_p3',
          title: '灵火青年敬拜节 · 赞美特会',
          image_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80',
          date: '2025.07.12',
          time: '19:00 - 22:00',
          venue: '槟城 · 圣爱大礼堂',
          statusTag: '精彩回顾 🎞️',
          link: ''
        },
        {
          id: 'curated_p4',
          title: '收割者福音巡回音乐分享会',
          image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80',
          date: '2025.06.05',
          time: '20:00 - 21:45',
          venue: '怡保 · 基督徒交流中心',
          statusTag: '即将来临 ⏳',
          link: ''
        },
        {
          id: 'curated_p5',
          title: '赞美诗合唱与管弦乐室内交响夜',
          image_url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1000&q=80',
          date: '2025.05.01',
          time: '19:30 - 21:30',
          venue: '吉隆坡 · 艺术文化中心',
          statusTag: '精彩回顾 🎞️',
          link: ''
        },
        {
          id: 'curated_p6',
          title: '收割机敬拜团同工灵修培灵会',
          image_url: 'https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51?auto=format&fit=crop&w=1000&q=80',
          date: '2025.03.18',
          time: '10:00 - 16:30',
          venue: '马六甲 · 恩典营地',
          statusTag: '年度特会 ⛪',
          link: ''
        }
      ];
      defaultCurated.forEach(dp => {
        if (!customPosters.some(p => p.title === dp.title)) {
          customPosters.push(dp);
        }
      });
    }
    window._currentAdminPosters = customPosters;

    const defaultCuratedEventsMap = {
      "curated_1": { time: "19:30 - 21:30" },
      "curated_2": { time: "09:30 - 17:00" },
      "curated_3": { time: "19:00 - 22:00" },
      "curated_4": { time: "20:00 - 21:45" },
      "curated_5": { time: "19:30 - 21:30" },
      "curated_6": { time: "10:00 - 16:30" },
      "收割敬拜之夜 · 吉隆坡特别专场": { time: "19:30 - 21:30" },
      "原创赞美诗创作营 & 制作工作坊": { time: "09:30 - 17:00" },
      "灵火青年敬拜节 · 赞美特会": { time: "19:00 - 22:00" },
      "灵火青年敬拜节 · 赞美复兴特会": { time: "19:00 - 22:00" },
      "收割者福音巡回音乐分享会": { time: "20:00 - 21:45" },
      "赞美诗合唱与管弦乐室内交响夜": { time: "19:30 - 21:30" },
      "收割机敬拜团同工灵修培灵会": { time: "10:00 - 16:30" }
    };
    window._defaultCuratedEventsMap = defaultCuratedEventsMap;

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
      let extUrl = e.external_url || e.ticket_url || "";
      let extText = e.button_text || e.ticket_text || "查看详情";
      if (extText.includes('购票') || extText.includes('索票')) extText = "查看详情";

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
          extUrl = meta.external_url || meta.ext_url || meta.ticket_url || meta.turl || extUrl;
          extText = meta.button_text || meta.btn_text || meta.ticket_text || meta.ttext || extText;
          if (extText.includes('购票') || extText.includes('索票')) extText = "查看详情";
          desc = desc.replace(metaMatch[0], '').trim();
        } catch (err) {
          desc = desc.replace(metaMatch[0], '').trim();
        }
      }

      // Title status tag extraction and sanitization
      let rawTitle = sanitizeEventTitle(e.title || "", stag);
      const titleTagMatch = rawTitle.match(/^(\[[^\]]+\]|\【[^\】]+\】)/);
      if (!stag && titleTagMatch) {
        stag = titleTagMatch[1];
        rawTitle = rawTitle.replace(titleTagMatch[0], '').trim();
      }
      rawTitle = sanitizeEventTitle(rawTitle, stag);

      if (!evTime && evDate) {
        if (evDate.includes('T')) {
          const parts = evDate.split('T');
          evDate = parts[0];
          if (parts[1]) {
            const tmMatch = parts[1].replace('Z', '').match(/(\d{1,2}[:：.]\d{2}(?:\s*[-~至到to]\s*\d{1,2}[:：.]\d{2})?)/);
            if (tmMatch) evTime = tmMatch[1];
          }
        } else if (evDate.includes(' ')) {
          const tmMatch = evDate.match(/(\d{1,2}[:：.]\d{2}(?:\s*[-~至到to]\s*\d{1,2}[:：.]\d{2})?)/);
          if (tmMatch) {
            evTime = tmMatch[1];
            evDate = evDate.replace(tmMatch[0], '').trim();
          }
        }
      }

      if (!evTime && defaultCuratedEventsMap[e.id]) {
        evTime = defaultCuratedEventsMap[e.id].time;
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
        ticket_url: extUrl,
        ticket_text: extText,
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
          <p style="color:#888; font-size:0.85rem; margin-top:4px;">管理顶部走廊多海报展示，以及下方条状活动排期的顺序、时间、地点、状态标签与海报等细节。</p>
        </div>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <button class="btn btn-submit" style="width:auto; padding:10px 18px; background:rgba(246,210,138,0.15); border-color:var(--gold); color:var(--gold);" onclick="openEventPosterModal()">+ 添加走廊海报</button>
          <button class="btn btn-submit" style="width:auto; padding:10px 22px; background:#333; color:#ccc;" onclick="triggerBlast()">🚀 一键发送提醒</button>
          <button class="btn btn-submit" style="width:auto; padding:10px 25px;" onclick="openEventModal()">+ 发布新活动</button>
        </div>
      </div>

      <!-- 🌟 精彩活动全宽横向走廊海报多图管理 (Events Panoramic Posters Carousel CMS) -->
      <div style="background:#0e0e0e; border:1.5px solid rgba(246,210,138,0.35); border-radius:14px; padding:22px; margin-bottom:28px; box-shadow:0 8px 30px rgba(0,0,0,0.6);">
        <div style="margin-bottom:18px; border-bottom:1px solid #222; padding-bottom:12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <h3 style="margin:0; color:var(--gold); font-size:1.2rem; display:flex; align-items:center; gap:8px;">
              <i class="fas fa-images"></i> 精彩活动 走廊海报多照片与属性管理 (${customPosters.length} 张展示中)
            </h3>
            <p style="margin:6px 0 0 0; color:#aaa; font-size:0.84rem; line-height:1.5;">
              在此管理活动页面顶部<b>全宽走廊跑马灯展示的所有海报图片</b>及其属性（状态标签如 <span style="color:#ff6b81; font-weight:bold;">HOT</span>、<span style="color:#2ed573; font-weight:bold;">报名中</span>、日期、地点、标题、跳转链接）。可上传多张照片、自由调整先后顺序。
            </p>
          </div>
          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            <button class="btn btn-submit" style="width:auto; padding:8px 20px; font-size:0.85rem;" onclick="openEventPosterModal()">+ 添加新海报</button>
            <button class="btn-tiny" style="padding:8px 16px; border-color:var(--gold); color:var(--gold);" onclick="saveAllEventPosters()">💾 确认保存全部海报</button>
          </div>
        </div>

        <!-- 海报卡片流 -->
        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:18px;">
          ${customPosters.map((p, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === customPosters.length - 1;
            const tag = p.statusTag || 'UPCOMING';
            const tagUpper = tag.toUpperCase();
            const isHot = tagUpper.includes('HOT') || tagUpper.includes('热门');
            const isReg = tagUpper.includes('报名') || tagUpper.includes('OPEN');
            const isRecap = tagUpper.includes('回顾') || tagUpper.includes('RECAP');
            const isEnded = tagUpper.includes('结束') || tagUpper.includes('ENDED');
            const badgeBg = isHot ? 'rgba(255,107,129,0.9)' : (isReg ? 'rgba(46,213,115,0.9)' : (isRecap ? 'rgba(164,176,190,0.9)' : (isEnded ? 'rgba(100,100,100,0.9)' : 'rgba(246,210,138,0.9)')));
            const badgeColor = (isHot || isReg || isEnded) ? '#fff' : '#1a1410';

            return `
              <div style="background:#161616; border:1px solid rgba(246,210,138,0.22); border-radius:12px; overflow:hidden; display:flex; flex-direction:column; position:relative; box-shadow:0 8px 20px rgba(0,0,0,0.5);">
                <!-- Poster Image with Badges -->
                <div style="position:relative; width:100%; height:170px; background:#080808; overflow:hidden; display:flex; align-items:center; justify-content:center;">
                  <div style="position:absolute; inset:-10px; background-image:url('${p.image_url || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80'}'); background-size:cover; background-position:center; filter:blur(16px) brightness(0.35); opacity:0.85;"></div>
                  <img src="${p.image_url || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80'}" style="position:relative; z-index:1; width:100%; height:100%; object-fit:contain; filter:drop-shadow(0 4px 12px rgba(0,0,0,0.8));" onerror="this.src='https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80'">
                  <div style="position:absolute; inset:0; z-index:2; background:linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 55%); pointer-events:none;"></div>
                  <!-- Top Left Date Badge -->
                  <span style="position:absolute; top:8px; left:8px; z-index:3; background:rgba(0,0,0,0.8); color:var(--gold); border:1px solid rgba(246,210,138,0.35); font-size:0.7rem; padding:2px 8px; border-radius:12px; font-weight:600;">
                    ${p.date || '未定日期'}${p.time ? ' · ' + p.time : ''}
                  </span>
                  <!-- Top Right Status Tag -->
                  <span style="position:absolute; top:8px; right:8px; z-index:3; background:${badgeBg}; color:${badgeColor}; font-size:0.68rem; font-weight:800; padding:2px 9px; border-radius:12px; box-shadow:0 2px 6px rgba(0,0,0,0.4);">
                    ${tag}
                  </span>
                  <span style="position:absolute; bottom:6px; right:8px; z-index:3; background:rgba(0,0,0,0.8); color:#aaa; font-size:0.68rem; padding:1px 6px; border-radius:4px;">
                    #${idx + 1}
                  </span>
                </div>

                <!-- Poster Metadata Body -->
                <div style="padding:12px; flex:1; display:flex; flex-direction:column; justify-content:space-between; gap:8px;">
                  <div>
                    <h4 style="margin:0 0 4px 0; color:#F6F4F0; font-size:0.95rem; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${p.title}">
                      ${p.title}
                    </h4>
                    <p style="margin:0; font-size:0.75rem; color:#888; display:flex; align-items:center; gap:5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                      <i class="fas fa-map-marker-alt" style="color:var(--gold);"></i> ${p.venue || '待定地点'}
                    </p>
                    ${p.link ? `<p style="margin:3px 0 0 0; font-size:0.7rem; color:var(--gold); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"><i class="fas fa-link"></i> ${p.link}</p>` : ''}
                  </div>

                  <!-- Toolbar -->
                  <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #222; padding-top:8px; margin-top:4px;">
                    <div style="display:flex; gap:4px;">
                      <button class="btn-tiny" ${isFirst ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : ''} onclick="movePosterOrder('${p.id}', 'up')" title="前移一位">⬆️</button>
                      <button class="btn-tiny" ${isLast ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : ''} onclick="movePosterOrder('${p.id}', 'down')" title="后移一位">⬇️</button>
                    </div>
                    <div style="display:flex; gap:6px;">
                      <button class="btn-tiny" style="border-color:var(--gold); color:var(--gold); padding:3px 10px;" onclick="openEventPosterModal('${p.id}')">✏️ 编辑</button>
                      <button class="btn-tiny danger" style="padding:3px 8px;" onclick="deleteEventPoster('${p.id}')" title="删除海报">🗑️</button>
                    </div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
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
                <th style="padding:14px;">提醒状态</th>
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
                      <b style="color: #F6F4F0;">${e.event_date || '未定'}</b>
                      <div style="font-size:0.75rem; color:var(--gold);"><i class="far fa-clock"></i> ${e.event_time || '未设时间'}</div>
                    </td>
                    <td style="padding:14px;">
                      <div style="font-size:1rem; font-weight:500; color: #F6F4F0; display:flex; align-items:center; flex-wrap:wrap; gap:4px;">
                        ${tagBadge}
                        <span>${sanitizeEventTitle(e.title, e.status_tag)}</span>
                      </div>
                    </td>
                    <td style="padding:14px; font-size:0.85rem; color:#aaa;">
                      ${e.location || '待定'}
                    </td>
                    <td style="padding:14px; font-size:0.8rem;">
                      <span style="display:inline-flex; align-items:center; gap:5px; color:#aaa; background:rgba(255,255,255,0.06); padding:3px 8px; border-radius:50px; font-size:0.75rem; border:1px solid rgba(255,255,255,0.1);"><i class="fas fa-bell" style="color:var(--gold);"></i> 开启活动提醒</span>
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
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    const newOrderIds = list.map(e => String(e.id));

    try {
      await db.from('site_config').upsert({
        key: 'cfg_events_order',
        value: newOrderIds.join(',')
      }, { onConflict: 'key' });

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

  // --- 🌟 走廊海报管理：添加 / 编辑 模态框 ---
  window.openEventPosterModal = (posterId = null) => {
    const list = window._currentAdminPosters || [];
    const p = posterId ? list.find(item => String(item.id) === String(posterId)) : null;
    const isEdit = !!p;
    const posterPos = p?.img_pos || p?.pos || '50% 50%';
    const posterZoom = p?.img_zoom || p?.zoom ? parseFloat(p.img_zoom || p.zoom) : 1.0;

    const modal = document.createElement('div');
    modal.id = "eventPosterModal";
    modal.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:9999; display:flex; justify-content:center; align-items:center; backdrop-filter:blur(8px); padding:20px;";
    
    // Build options for events linking
    const evList = window._currentAdminEvents || [];
    const eventOptions = evList.map(e => `<option value="event.html?id=${e.id}" data-date="${e.event_date || ''}" data-time="${e.event_time || ''}" data-venue="${e.location || ''}" data-title="${sanitizeEventTitle(e.title, e.status_tag)}">${sanitizeEventTitle(e.title, e.status_tag)} (${e.event_date || '未定日期'}${e.event_time ? ' ' + e.event_time : ''})</option>`).join('');

    modal.innerHTML = `
      <div style="background:#111; border:1px solid var(--gold); border-radius:16px; padding:2rem; width:100%; max-width:620px; max-height:90vh; overflow-y:auto; position:relative; box-shadow:0 20px 60px rgba(0,0,0,1);">
        <h2 style="color:var(--gold); margin-bottom:1.5rem; text-align:center;">${isEdit ? '编辑走廊海报与展示设置' : '添加新走廊海报'}</h2>
        
        <!-- 海报图片预览与上传 -->
        <div style="margin-bottom:18px; background:#0a0a0a; padding:15px; border-radius:12px; border:1px solid #222;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <label style="color:#aaa; font-size:0.8rem; text-transform:uppercase; letter-spacing:1px; font-weight:600; margin:0;">海报图片预览 (Poster Image)</label>
            <span style="font-size:0.72rem; color:var(--gold);">✨ 完美自适应横版及竖版（打直）海报</span>
          </div>
          <div style="width:100%; height:220px; border-radius:8px; overflow:hidden; border:1px solid #333; background:#080808; margin-bottom:10px; display:flex; align-items:center; justify-content:center; position:relative;">
            <div id="ev_p_prev_bg" style="position:absolute; inset:-10px; background-image:url('${p?.image_url || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=900&q=80'}'); background-size:cover; background-position:center; filter:blur(20px) brightness(0.35); opacity:0.85;"></div>
            <img id="ev_p_prev" src="${p?.image_url || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=900&q=80'}" style="position:relative; z-index:1; width:100%; height:100%; object-fit:cover; object-position:${posterPos}; transform:scale(${posterZoom}); transform-origin:${posterPos}; filter:drop-shadow(0 6px 16px rgba(0,0,0,0.85)); transition:all 0.1s ease;" onerror="this.src='https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=900&q=80'">
          </div>

          <div style="display:flex; flex-direction:column; gap:8px;">
            <div>
              <label style="display:block; font-size:0.75rem; color:#888; margin-bottom:4px;">方式一：选择本地图片上传 (支持横版 / 竖版 A4 / 手机比例海报)</label>
              <div style="display:flex; gap:8px;">
                <input type="file" id="f_ev_p" accept="image/*" style="font-size:0.75rem; color:#888; flex:1;">
                <button class="btn-tiny" id="btnUploadEvP" style="background:rgba(246,210,138,0.15); border-color:var(--gold); color:var(--gold); font-weight:600; padding:6px 14px;" onclick="uploadPosterPhoto('f_ev_p', 'ev_p_img', 'ev_p_prev')">📤 上传并同步</button>
              </div>
            </div>
            <div>
              <label style="display:block; font-size:0.75rem; color:#888; margin-bottom:4px;">方式二：直接输入海报图片 URL 链接</label>
              <input type="text" id="ev_p_img" value="${p?.image_url || ''}" placeholder="https://..." style="width:100%; padding:8px 10px; background:#181818; border:1px solid #333; color:#F6F4F0; border-radius:4px; font-size:0.85rem;" oninput="document.getElementById('ev_p_prev').src = this.value.trim() || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=900&q=80'; const bgEl = document.getElementById('ev_p_prev_bg'); if (bgEl) bgEl.style.backgroundImage = 'url(' + (this.value.trim() || '') + ')';">
            </div>
          </div>

          <!-- 🎚️ 走廊海报焦点与缩放调整 -->
          ${renderImageCropControllerHTML({
            id: 'ev_p_crop',
            targetImgId: 'ev_p_prev',
            posVal: posterPos,
            zoomVal: posterZoom,
            posInputId: 'ev_p_pos',
            zoomInputId: 'ev_p_zoom',
            label: '调整走廊海报呈现区域与焦点 (Poster Crop & Zoom)',
            hint: '因走廊卡片与原海报比例不同，可调整画面上下/左右对焦点与放大倍数'
          })}
        </div>

        <!-- 状态标签设置 -->
        <div style="margin-bottom:16px;">
          <label style="display:block; margin-bottom:6px; color:#aaa; font-size:0.8rem; font-weight:600;">状态徽章标签 (Status Tag - 位于海报右上角)</label>
          <input type="text" id="ev_p_tag" value="${p?.statusTag || 'HOT 热门 🔥'}" placeholder="例如：HOT 热门、报名中、即将来临" style="width:100%; padding:10px; margin-bottom:8px;">
          
          <!-- 快捷一键点选徽章 -->
          <div style="display:flex; flex-wrap:wrap; gap:6px;">
            <button type="button" class="btn-tiny" onclick="document.getElementById('ev_p_tag').value='HOT 热门 🔥'">🔥 HOT 热门</button>
            <button type="button" class="btn-tiny" onclick="document.getElementById('ev_p_tag').value='报名中 🎟️'">🎟️ 报名中</button>
            <button type="button" class="btn-tiny" onclick="document.getElementById('ev_p_tag').value='即将来临 ⏳'">⏳ 即将来临</button>
            <button type="button" class="btn-tiny" onclick="document.getElementById('ev_p_tag').value='进行中 ⚡'">⚡ 进行中</button>
            <button type="button" class="btn-tiny" onclick="document.getElementById('ev_p_tag').value='已满额 🔒'">🔒 已满额</button>
            <button type="button" class="btn-tiny" onclick="document.getElementById('ev_p_tag').value='精彩回顾 🎞️'">🎞️ 精彩回顾</button>
            <button type="button" class="btn-tiny" onclick="document.getElementById('ev_p_tag').value='已结束 🏁'">🏁 已结束</button>
          </div>
        </div>

        <!-- 标题、日期与时间 -->
        <div style="margin-bottom:15px;">
          <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem; font-weight:600;">海报标题 (Title)</label>
          <input type="text" id="ev_p_title" value="${p?.title || ''}" placeholder="例如：收割敬拜之夜 · 吉隆坡特别专场" style="width:100%; padding:10px;">
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin-bottom:15px;">
          <div>
            <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem; font-weight:600;">显示日期 (Date Tag)</label>
            <input type="text" id="ev_p_date" value="${p?.date || ''}" placeholder="例如：2025.11.15" style="width:100%; padding:10px;">
          </div>
          <div>
            <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem; font-weight:600;">活动具体时间 (Time)</label>
            <input type="text" id="ev_p_time" value="${p?.time || ''}" placeholder="例如：19:30 或 19:30 - 21:30" style="width:100%; padding:10px;">
          </div>
        </div>

        <!-- 地点与场馆 -->
        <div style="margin-bottom:15px;">
          <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem; font-weight:600;">活动地点 / 场馆 / 副标 (Venue)</label>
          <input type="text" id="ev_p_venue" value="${p?.venue || ''}" placeholder="例如：吉隆坡 · 全福敬拜大厅" style="width:100%; padding:10px;">
        </div>

        <!-- 跳转链接与快速绑定 -->
        <div style="margin-bottom:20px; background:#0e0e0e; padding:14px; border-radius:10px; border:1px solid #222;">
          <label style="display:block; margin-bottom:6px; color:#aaa; font-size:0.8rem; font-weight:600;">点击跳转链接 (Target Link)</label>
          <input type="text" id="ev_p_link" value="${p?.link || ''}" placeholder="例如：event.html?id=... 或外部报名链接 https://..." style="width:100%; padding:9px 10px; margin-bottom:8px;">
          
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:0.75rem; color:#888; white-space:nowrap;">快速绑定活动：</span>
            <select style="flex:1; padding:6px; font-size:0.8rem; background:#181818; color:#eee; border:1px solid #333; border-radius:4px;" onchange="if(this.value) {
              document.getElementById('ev_p_link').value = this.value;
              const opt = this.options[this.selectedIndex];
              if(opt) {
                const optTitle = opt.getAttribute('data-title');
                const optDate = opt.getAttribute('data-date');
                const optTime = opt.getAttribute('data-time');
                const optVenue = opt.getAttribute('data-venue');
                if(optTitle && !document.getElementById('ev_p_title').value) document.getElementById('ev_p_title').value = optTitle;
                if(optDate && !document.getElementById('ev_p_date').value) document.getElementById('ev_p_date').value = optDate;
                if(optTime && !document.getElementById('ev_p_time').value) document.getElementById('ev_p_time').value = optTime;
                if(optVenue && !document.getElementById('ev_p_venue').value) document.getElementById('ev_p_venue').value = optVenue;
              }
            }">
              <option value="">-- 选择现有活动排期以一键绑定 --</option>
              ${eventOptions}
            </select>
          </div>
        </div>

        <div style="display:flex; gap:15px; position:sticky; bottom:0; background:#111; padding-top:10px; border-top:1px solid #222;">
          <button class="btn btn-submit" id="btnSaveEventPoster" style="flex:2; padding:12px;" onclick="saveEventPoster('${p?.id || ''}')">💾 保存海报设置</button>
          <button class="btn-tiny" style="flex:1;" onclick="this.closest('#eventPosterModal').remove()">取消</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  };

  // 上传走廊海报图片
  window.uploadPosterPhoto = async (fileInputId, targetId, previewId) => {
    const fileInput = document.getElementById(fileInputId);
    const file = fileInput?.files?.[0];
    if(!file) return alert("请先选择图片文件");
    const btn = event.currentTarget;
    const origText = btn.innerText;
    btn.innerText = "⏳ 上传中...";
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
      const bgEl = document.getElementById(previewId + '_bg');
      if (bgEl) bgEl.style.backgroundImage = `url('${publicUrl}')`;
      alert("✅ 海报图片上传成功！");
    } catch(err) {
      alert("上传失败: " + err.message);
    } finally {
      btn.innerText = origText;
      btn.disabled = false;
    }
  };

  // 保存单张走廊海报
  window.saveEventPoster = async (posterId) => {
    const imgUrl = document.getElementById('ev_p_img')?.value.trim();
    const title = document.getElementById('ev_p_title')?.value.trim();
    const tag = document.getElementById('ev_p_tag')?.value.trim() || 'HOT 热门';
    const date = document.getElementById('ev_p_date')?.value.trim() || 'FEATURED 推荐';
    const time = document.getElementById('ev_p_time')?.value.trim() || '';
    const venue = document.getElementById('ev_p_venue')?.value.trim() || '各城各乡 · 福音巡回';
    const link = document.getElementById('ev_p_link')?.value.trim() || '';

    if (!imgUrl) return alert("请上传或填入海报图片链接");
    if (!title) return alert("请输入海报标题");

    const list = window._currentAdminPosters || [];
    const imgPos = document.getElementById('ev_p_pos')?.value.trim() || '50% 50%';
    const imgZoom = parseFloat(document.getElementById('ev_p_zoom')?.value) || 1.0;
    const item = {
      id: posterId || ('poster_' + Date.now()),
      title: title,
      image_url: imgUrl,
      img_pos: imgPos,
      img_zoom: imgZoom,
      statusTag: tag,
      date: date,
      time: time,
      venue: venue,
      link: link
    };

    if (posterId) {
      const idx = list.findIndex(p => String(p.id) === String(posterId));
      if (idx !== -1) list[idx] = item;
      else list.push(item);
    } else {
      list.push(item);
    }
    window._currentAdminPosters = list;

    try {
      await db.from('site_config').upsert({
        key: 'cfg_events_posters_json',
        value: JSON.stringify(list)
      }, { onConflict: 'key' });

      // Keep cfg_events_banner synced with first poster
      if (list.length > 0) {
        await db.from('site_config').upsert({ key: 'cfg_events_banner', value: list[0].image_url }, { onConflict: 'key' });
        await db.from('site_config').upsert({ key: 'cfg_events_banner_title', value: list[0].title }, { onConflict: 'key' });
        await db.from('site_config').upsert({ key: 'cfg_events_banner_tag', value: list[0].statusTag }, { onConflict: 'key' });
        await db.from('site_config').upsert({ key: 'cfg_events_banner_venue', value: list[0].venue }, { onConflict: 'key' });
        await db.from('site_config').upsert({ key: 'cfg_events_banner_link', value: list[0].link }, { onConflict: 'key' });
      }

      const modal = document.getElementById('eventPosterModal');
      if (modal) modal.remove();
      alert("✅ 走廊海报设置已成功保存！");
      renderCMS();
    } catch(err) {
      alert("保存失败: " + err.message);
    }
  };

  // 移动走廊海报顺序
  window.movePosterOrder = async (posterId, direction) => {
    const list = window._currentAdminPosters || [];
    const idx = list.findIndex(p => String(p.id) === String(posterId));
    if (idx === -1) return;
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === list.length - 1) return;

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;
    window._currentAdminPosters = list;

    try {
      await db.from('site_config').upsert({
        key: 'cfg_events_posters_json',
        value: JSON.stringify(list)
      }, { onConflict: 'key' });

      if (list.length > 0) {
        await db.from('site_config').upsert({ key: 'cfg_events_banner', value: list[0].image_url }, { onConflict: 'key' });
      }

      renderCMS();
    } catch(err) {
      alert("海报排序保存失败: " + err.message);
    }
  };

  // 删除走廊海报
  window.deleteEventPoster = async (posterId) => {
    if (!confirm("确定要移除这张走廊海报吗？")) return;
    let list = window._currentAdminPosters || [];
    list = list.filter(p => String(p.id) !== String(posterId));
    window._currentAdminPosters = list;

    try {
      await db.from('site_config').upsert({
        key: 'cfg_events_posters_json',
        value: JSON.stringify(list)
      }, { onConflict: 'key' });

      if (list.length > 0) {
        await db.from('site_config').upsert({ key: 'cfg_events_banner', value: list[0].image_url }, { onConflict: 'key' });
      } else {
        await db.from('site_config').upsert({ key: 'cfg_events_banner', value: '' }, { onConflict: 'key' });
      }

      alert("✅ 已成功移除海报！");
      renderCMS();
    } catch(err) {
      alert("移除失败: " + err.message);
    }
  };

  // 批量保存全部走廊海报
  window.saveAllEventPosters = async () => {
    const list = window._currentAdminPosters || [];
    try {
      await db.from('site_config').upsert({
        key: 'cfg_events_posters_json',
        value: JSON.stringify(list)
      }, { onConflict: 'key' });

      if (list.length > 0) {
        await db.from('site_config').upsert({ key: 'cfg_events_banner', value: list[0].image_url }, { onConflict: 'key' });
      }

      alert("✅ 全部走廊海报设置已成功同步到云端！");
      renderCMS();
    } catch(err) {
      alert("保存失败: " + err.message);
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
        let ttext = e.ticket_text || "查看详情";
        if (ttext.includes('购票') || ttext.includes('索票')) ttext = "查看详情";
        let reqTicket = false;

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
                if (ttext.includes('购票') || ttext.includes('索票')) ttext = "查看详情";
                desc = desc.replace(metaMatch[0], '').trim();
              } catch(err) {
                desc = desc.replace(metaMatch[0], '').trim();
              }
           }
        }

        let rawTitle = sanitizeEventTitle(e.title || "", stag);
        const titleTagMatch = rawTitle.match(/^(\[[^\]]+\]|\【[^\】]+\】)/);
        if (!stag && titleTagMatch) {
          stag = titleTagMatch[1];
          rawTitle = rawTitle.replace(titleTagMatch[0], '').trim();
        }
        rawTitle = sanitizeEventTitle(rawTitle, stag);

        if (!evTime && evDate) {
          if (evDate.includes('T')) {
            const parts = evDate.split('T');
            evDate = parts[0];
            if (parts[1]) {
              const tmMatch = parts[1].replace('Z', '').match(/(\d{1,2}[:：.]\d{2}(?:\s*[-~至到to]\s*\d{1,2}[:：.]\d{2})?)/);
              if (tmMatch) evTime = tmMatch[1];
            }
          } else if (evDate.includes(' ')) {
            const tmMatch = evDate.match(/(\d{1,2}[:：.]\d{2}(?:\s*[-~至到to]\s*\d{1,2}[:：.]\d{2})?)/);
            if (tmMatch) {
              evTime = tmMatch[1];
              evDate = evDate.replace(tmMatch[0], '').trim();
            }
          }
        }

        if (!evTime && window._defaultCuratedEventsMap) {
          const map = window._defaultCuratedEventsMap;
          if (map[e.id]) evTime = map[e.id].time;
          else if (map[rawTitle]) evTime = map[rawTitle].time;
          else if (map[e.title]) evTime = map[e.title].time;
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
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <label style="color:#aaa; font-size:0.8rem; text-transform:uppercase; letter-spacing:1px; margin:0;">活动海报预览 (Poster)</label>
              <span style="font-size:0.72rem; color:var(--gold);">✨ 支持横版及打直/竖版海报完整展示</span>
            </div>
            <div style="width:100%; height:220px; border-radius:8px; overflow:hidden; border:1px solid #333; background:#080808; margin-bottom:10px; display:flex; align-items:center; justify-content:center; position:relative;">
              <div id="ev_prev_bg" style="position:absolute; inset:-10px; background-image:url('${e?.image_url || 'https://via.placeholder.com/1920x1080?text=Harvester+Event'}'); background-size:cover; background-position:center; filter:blur(20px) brightness(0.35); opacity:0.85;"></div>
              <img id="ev_prev" src="${e?.image_url || 'https://via.placeholder.com/1920x1080?text=Harvester+Event'}" style="position:relative; z-index:1; width:100%; height:100%; object-fit:cover; object-position:${e?.img_pos || e?.pos || '50% 50%'}; transform:scale(${e?.img_zoom || e?.zoom || 1.0}); transform-origin:${e?.img_pos || e?.pos || '50% 50%'}; filter:drop-shadow(0 6px 16px rgba(0,0,0,0.85)); transition:all 0.1s ease;" onerror="this.src='https://via.placeholder.com/1920x1080?text=Harvester+Event'">
            </div>
            <input type="file" id="f_ev" style="font-size:0.8rem; color:#888;">
            <button class="btn-tiny" style="margin-top:10px; width:100%; padding:8px;" onclick="uploadFile('f_ev', 'ev_url', 'ev_prev')">📤 上传活动海报图片</button>
            <input type="hidden" id="ev_url" value="${e?.image_url || ''}">

            <!-- 🎚️ 活动海报焦点与裁剪 -->
            ${renderImageCropControllerHTML({
              id: 'ev_crop',
              targetImgId: 'ev_prev',
              posVal: e?.img_pos || e?.pos || '50% 50%',
              zoomVal: e?.img_zoom || e?.zoom || 1.0,
              posInputId: 'ev_pos',
              zoomInputId: 'ev_zoom',
              label: '调整活动海报显示区域与焦点 (Event Poster Focus)',
              hint: '可调整海报上下/左右位置与缩放，使核心文字与视觉主体完美呈现'
            })}
          </div>

          <!-- 标题与状态标签 -->
          <div style="display:grid; grid-template-columns: 2fr 1fr; gap:15px; margin-bottom:10px;">
            <div>
              <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem;">活动名称 (Title)</label>
              <input type="text" id="ev_t" value="${sanitizeEventTitle(e?.title || '', e?.status_tag || '')}" placeholder="例如：东京敬拜赞美节庆" style="width:100%; padding:10px;">
            </div>
            <div>
              <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem;">状态标签 (Tag)</label>
              <input type="text" id="ev_stag" value="${e?.status_tag || ''}" placeholder="如 HOT 热门、报名中" style="width:100%; padding:10px;">
            </div>
          </div>
          <!-- 状态标签快捷点选 -->
          <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:15px;">
            <button type="button" class="btn-tiny" onclick="document.getElementById('ev_stag').value='HOT 热门 🔥'">🔥 HOT 热门</button>
            <button type="button" class="btn-tiny" onclick="document.getElementById('ev_stag').value='报名中 🎟️'">🎟️ 报名中</button>
            <button type="button" class="btn-tiny" onclick="document.getElementById('ev_stag').value='即将来临 ⏳'">⏳ 即将来临</button>
            <button type="button" class="btn-tiny" onclick="document.getElementById('ev_stag').value='进行中 ⚡'">⚡ 进行中</button>
            <button type="button" class="btn-tiny" onclick="document.getElementById('ev_stag').value='已满额 🔒'">🔒 已满额</button>
            <button type="button" class="btn-tiny" onclick="document.getElementById('ev_stag').value='已结束 🏁'">🏁 已结束</button>
          </div>

          <!-- 日期与时间 -->
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin-bottom:15px;">
            <div>
              <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem;">活动日期 (Date)</label>
              <input type="date" id="ev_d" value="${(e?.event_date || '').replace(/\./g, '-')}" style="width:100%; padding:10px;">
            </div>
            <div>
              <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem;">活动具体时间 (Time，支持时段)</label>
              <input type="text" id="ev_tm" value="${e?.event_time || ''}" placeholder="例如：19:30 或 19:30 - 21:30" style="width:100%; padding:10px; background:#181818; border:1px solid #333; color:#F6F4F0; border-radius:4px;">
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

          <!-- 外部跳转 / 报名链接设置 (可选) -->
          <div style="background:#0e0e0e; border:1px solid #222; border-radius:12px; padding:12px 15px; margin-bottom:15px;">
            <div style="display:flex; align-items:center; justify-content:space-between;">
              <span style="font-size:0.85rem; color:#aaa;"><i class="fas fa-link" style="color:var(--gold); margin-right:5px;"></i> 外部跳转 / 报名链接 (可选，留空则默认链接到站内详情)</span>
              <a href="javascript:void(0)" onclick="const f=document.getElementById('ev_ext_fields'); f.style.display=f.style.display==='none'?'grid':'none'; this.innerText=f.style.display==='none'?'展开配置 ▾':'收起配置 ▴';" style="font-size:0.75rem; color:var(--gold); text-decoration:none;">${e?.ticket_url ? '收起配置 ▴' : '展开配置 ▾'}</a>
            </div>
          </div>

          <!-- 外部链接配置 (折叠/展开) -->
          <div id="ev_ext_fields" style="display:${e?.ticket_url ? 'grid' : 'none'}; grid-template-columns: 2fr 1.2fr; gap:15px; margin-bottom:15px;">
            <div>
              <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem;">外部链接地址 (URL)</label>
              <input type="text" id="ev_turl" value="${e?.ticket_url || ''}" placeholder="https://... 留空则链接到站内详情" style="width:100%; padding:10px;">
            </div>
            <div>
              <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem;">按钮文字 (Button Text)</label>
              <input type="text" id="ev_ttext" value="${e?.ticket_text || '查看详情'}" placeholder="例如：查看详情" style="width:100%; padding:10px;">
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

    const rawTitle = document.getElementById('ev_t').value.trim();
    const stag = document.getElementById('ev_stag').value.trim();
    const finalTitle = sanitizeEventTitle(rawTitle, stag);

    const extUrl = document.getElementById('ev_turl')?.value.trim() || '';
    let extText = document.getElementById('ev_ttext')?.value.trim() || '查看详情';
    if (extText.includes('购票') || extText.includes('索票')) extText = '查看详情';

    const imgPos = document.getElementById('ev_pos')?.value.trim() || '50% 50%';
    const imgZoom = parseFloat(document.getElementById('ev_zoom')?.value) || 1.0;
    const payload = {
      title: finalTitle,
      event_date: document.getElementById('ev_d').value,
      event_time: document.getElementById('ev_tm').value.trim(),
      location: document.getElementById('ev_l').value.trim(),
      map_url: document.getElementById('ev_ml').value.trim(),
      image_url: document.getElementById('ev_url').value.trim(),
      img_pos: imgPos,
      img_zoom: imgZoom,
      ticket_url: extUrl,
      ticket_text: extText,
      requires_ticket: false,
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
          pos: payload.img_pos,
          zoom: payload.img_zoom,
          img_pos: payload.img_pos,
          img_zoom: payload.img_zoom,
          turl: payload.ticket_url,
          ttext: payload.ticket_text,
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

      // 2. 双重持久化同步到 site_config 备用存储 (防 RLS 拦截)
      try {
        const { data: evCfg } = await db.from('site_config').select('value').eq('key', 'cfg_events_custom_json').maybeSingle();
        let evList = [];
        if (evCfg?.value) {
          try { evList = JSON.parse(evCfg.value); } catch(e){}
        }
        if (!Array.isArray(evList)) evList = [];
        const evItem = {
          id: id || ('ev_' + Date.now()),
          ...payload
        };
        const existIdx = evList.findIndex(x => String(x.id) === String(evItem.id) || x.title === evItem.title);
        if (existIdx !== -1) evList[existIdx] = evItem;
        else evList.push(evItem);
        await db.from('site_config').upsert({
          key: 'cfg_events_custom_json',
          value: JSON.stringify(evList)
        }, { onConflict: 'key' });
      } catch(syncErr) {
        console.warn("Event custom JSON sync note:", syncErr);
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

  // --- 🎙️ SINGER & CO-WORKERS MODULE ---
  let currentSingerSubTab = 'core';
  window.switchSingerTab = (tab) => { currentSingerSubTab = tab; renderSingers(document.getElementById('moduleBody')); };

  async function renderSingers(container) {
    const { data: singers } = await db.from('singers').select('*').order('display_order', {ascending: true});
    const { data: configs } = await db.from('site_config').select('*');
    const c = (configs || []).reduce((acc, curr) => { acc[curr.key] = curr.value; return acc; }, {});
    let aboutData = {};
    if (c['cfg_about_content_json']) {
      try {
        aboutData = typeof c['cfg_about_content_json'] === 'string' ? JSON.parse(c['cfg_about_content_json']) : c['cfg_about_content_json'];
      } catch(e){}
    }
    const d = (key, fallback = '') => (aboutData && aboutData[key] !== undefined && aboutData[key] !== null) ? aboutData[key] : fallback;

    let hiddenSingerIds = [];
    if (c['cfg_hidden_singer_ids']) {
      try {
        hiddenSingerIds = typeof c['cfg_hidden_singer_ids'] === 'string' ? JSON.parse(c['cfg_hidden_singer_ids']) : c['cfg_hidden_singer_ids'];
      } catch(e){}
    }
    if (!Array.isArray(hiddenSingerIds)) hiddenSingerIds = [];

    const gospelSingers = (singers || []).filter(s => s.category === 'gospel');
    const worshipSingers = (singers || []).filter(s => s.category === 'worship');
    const coWorkersList = getCoWorkersListFromConfig(aboutData);

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:15px;">
        <div>
          <h1 style="color:var(--gold); margin:0;">🎙️ 主要同工与歌手管理 (Co-workers & Singers)</h1>
          <p style="color:#888; font-size:0.85rem; margin-top:5px;">自由管理主要服事同工团队、福音歌手及敬拜赞美歌手名册，支持随时隐藏未公布的同工与歌手。</p>
        </div>
        <div style="display:flex; gap:10px;">
          ${currentSingerSubTab === 'core' 
            ? `
              <button class="btn btn-tiny" style="background:#222; color:var(--gold); border:1px solid var(--gold); padding:8px 16px; font-weight:600;" onclick="addCoWorkerCard()">+ 添加同工职务</button>
              <button class="btn btn-submit" style="width:auto; padding:8px 24px;" onclick="saveCoreCoWorkersCMS()">💾 保存所有同工修改</button>
            `
            : `<button class="btn btn-submit" style="width:auto; padding:10px 25px;" onclick="addSinger('${currentSingerSubTab}')">+ 邀请新歌手</button>`}
        </div>
      </div>

      <!-- Tab Switcher -->
      <div style="display:flex; gap:10px; margin-bottom:25px; border-bottom:1px solid #222; padding-bottom:10px;">
        <button onclick="switchSingerTab('core')" class="btn-tiny" style="padding:10px 22px; font-size:0.9rem; font-weight:600; border-radius:30px; ${currentSingerSubTab==='core' ? 'background:var(--gold); color:#000; border-color:var(--gold);' : 'background:#111; color:#888;'}">
          👥 主要服事同工 <span id="coWorkersCountBadge" style="opacity:0.8; font-size:0.8rem;">(${coWorkersList.length})</span>
        </button>
        <button onclick="switchSingerTab('gospel')" class="btn-tiny" style="padding:10px 22px; font-size:0.9rem; font-weight:600; border-radius:30px; ${currentSingerSubTab==='gospel' ? 'background:var(--gold); color:#000; border-color:var(--gold);' : 'background:#111; color:#888;'}">
          🎤 福音歌手 (${gospelSingers.length})
        </button>
        <button onclick="switchSingerTab('worship')" class="btn-tiny" style="padding:10px 22px; font-size:0.9rem; font-weight:600; border-radius:30px; ${currentSingerSubTab==='worship' ? 'background:var(--gold); color:#000; border-color:var(--gold);' : 'background:#111; color:#888;'}">
          🕊️ 敬拜赞美歌手 (${worshipSingers.length})
        </button>
      </div>

      ${currentSingerSubTab === 'core' ? `
        <!-- 👥 主要同工管理 (自由增减同工职务 & 隐藏控制) -->
        <div style="background:#0a0a0a; border:1px solid #1f1f1f; border-radius:12px; padding:25px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:1px solid #222; padding-bottom:12px; flex-wrap:wrap; gap:10px;">
            <div>
              <h3 style="color:var(--gold); margin:0;">主要同工职务与拍立得相片管理</h3>
              <span style="color:#777; font-size:0.8rem;">可随时添加新职务、隐藏未公开同工或删除同工，保存后将实时同步更新至前台页面</span>
            </div>
            <button class="btn btn-tiny" style="background:rgba(246,210,138,0.15); border:1px solid var(--gold); color:var(--gold); padding:8px 18px; font-weight:bold;" onclick="addCoWorkerCard()">
              + 添加新同工职务 (Add Role)
            </button>
          </div>

          <div id="coWorkersListGrid" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:20px; margin-bottom:25px;">
            ${renderCoWorkerCardsHTML(coWorkersList)}
          </div>

          <div style="display:flex; gap:15px;">
            <button class="btn" style="flex:1; background:#181818; border:1px dashed var(--gold); color:var(--gold); padding:14px; font-size:0.95rem; font-weight:600;" onclick="addCoWorkerCard()">
              + 添加新同工职务 (Add New Co-worker Role)
            </button>
            <button class="btn btn-submit" style="flex:2; padding:14px; font-size:1rem;" onclick="saveCoreCoWorkersCMS()">
              💾 立即保存主要服事同工名册
            </button>
          </div>
        </div>
      ` : `
        <!-- 歌手名册列表 (Gospel or Worship) -->
        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:20px;">
          ${(currentSingerSubTab === 'gospel' ? gospelSingers : worshipSingers).map(s => {
            const isHidden = (hiddenSingerIds || []).includes(s.id);
            return `
            <div style="background:#111; padding:20px; border-radius:12px; border:1px solid ${isHidden ? '#552222' : '#222'}; opacity:${isHidden ? '0.78' : '1'}; display:flex; flex-direction:column; justify-content:space-between; position:relative;">
              <div>
                <div style="position:relative; margin-bottom:15px;">
                  <img src="${s.image_url || 'assets/logo.png'}" style="width:100%; aspect-ratio:3/4; object-fit:cover; border-radius:8px; border:1px solid #333;" onerror="this.src='assets/logo.png'">
                  <div style="position:absolute; top:8px; right:8px;">
                    <span style="background:${isHidden ? 'rgba(230,57,70,0.9)' : 'rgba(46,213,115,0.9)'}; color:#fff; padding:3px 9px; border-radius:12px; font-size:0.7rem; font-weight:bold; box-shadow:0 2px 6px rgba(0,0,0,0.5);">
                      ${isHidden ? '🙈 已隐藏 (未公布)' : '👁️ 公开展出'}
                    </span>
                  </div>
                </div>
                <h3 style="margin:0; color:var(--gold); font-size:1.15rem;">${s.name}</h3>
                <p style="color:#888; font-size:0.85rem; margin:6px 0 10px;">${s.role || 'Gospel Singer'} <span style="background:rgba(255,255,255,0.08); padding:2px 8px; border-radius:4px; font-size:0.7rem; margin-left:8px; color:#aaa;">${s.category === 'worship' ? '敬拜赞美' : '福音歌手'}</span></p>
                <p style="color:#666; font-size:0.8rem; line-height:1.4; max-height:45px; overflow:hidden;">${s.bio || ''}</p>
              </div>
              <div style="display:flex; gap:8px; margin-top:20px; padding-top:12px; border-top:1px solid #1a1a1a; flex-wrap:wrap;">
                <button class="btn-tiny" style="flex:1; min-width:85px; ${isHidden ? 'color:#2ed573; border-color:#2ed573;' : 'color:#ff6b6b; border-color:#ff6b6b;'}" onclick="toggleSingerHidden('${s.id}', ${!isHidden})" title="切换前台公开或隐藏">
                  ${isHidden ? '👁️ 设为公开' : '🙈 设为隐藏'}
                </button>
                <button class="btn-tiny" style="flex:1; min-width:80px; color:var(--gold); border-color:var(--gold);" onclick="editSinger('${s.id}')">⚙️ 编辑</button>
                <button class="btn-tiny danger" onclick="deleteItem('singers', '${s.id}')">🗑️ 删除</button>
              </div>
            </div>
            `;
          }).join('') || `<p style="grid-column:1/-1; text-align:center; color:#555; padding:60px;">暂无该分类歌手，点击右上角「+ 邀请新歌手」添加</p>`}
        </div>
      `}
    `;
  }

  // ==========================================
  // 🎚️ 统一照片裁剪/焦点与缩放控制器 (Universal Image Focal & Crop System)
  // ==========================================
  window.parseImageCropPosition = function(posStr) {
    if (!posStr) return { x: 50, y: 50 };
    const parts = String(posStr).trim().split(/\s+/);
    let x = 50, y = 50;
    if (parts.length >= 1) {
      if (parts[0] === 'left') x = 0;
      else if (parts[0] === 'center') x = 50;
      else if (parts[0] === 'right') x = 100;
      else {
        const n = parseInt(parts[0], 10);
        if (!isNaN(n)) x = Math.max(0, Math.min(100, n));
      }
    }
    if (parts.length >= 2) {
      if (parts[1] === 'top') y = 0;
      else if (parts[1] === 'center') y = 50;
      else if (parts[1] === 'bottom') y = 100;
      else {
        const n = parseInt(parts[1], 10);
        if (!isNaN(n)) y = Math.max(0, Math.min(100, n));
      }
    } else if (parts.length === 1 && (parts[0] === 'top' || parts[0] === 'bottom')) {
      y = parts[0] === 'top' ? 0 : 100;
      x = 50;
    }
    return { x, y };
  };

  window.getCoworkerXPercent = function(posStr) {
    return window.parseImageCropPosition(posStr).x;
  };

  window.getCoworkerYPercent = function(posStr) {
    return window.parseImageCropPosition(posStr).y;
  };

  window.renderImageCropControllerHTML = function({
    id,
    targetImgId,
    posVal = '50% 50%',
    zoomVal = 1.0,
    posInputId,
    zoomInputId,
    label = '调整照片呈现区域与焦点 (Crop Focus & Zoom)',
    hint = '因照片与方框比例不同，可微调上下/左右位置或放大，让照片主体完美呈现'
  }) {
    const { x, y } = window.parseImageCropPosition(posVal);
    const zoom = zoomVal ? Math.max(1.0, Math.min(2.5, parseFloat(zoomVal))) : 1.0;
    const zoomPct = Math.round(zoom * 100);
    const pId = posInputId || `in_pos_${id}`;
    const zId = zoomInputId || `in_zoom_${id}`;

    return `
      <div class="crop-controller-widget" data-ctrl-id="${id}" data-target-img="${targetImgId}" data-pos-id="${pId}" data-zoom-id="${zId}"
           style="background:#141414; padding:12px 14px; border-radius:10px; border:1px solid #282828; margin-top:10px; text-align:left; animation:fadeIn 0.2s ease;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <span style="font-size:0.75rem; color:var(--gold); font-weight:bold; display:flex; align-items:center; gap:6px;">
            <i class="fas fa-crop-alt"></i> ${label}
          </span>
          <span id="pos_val_badge_${id}" style="font-size:0.68rem; color:#aaa; font-family:monospace; background:#222; padding:2px 6px; border-radius:4px; border:1px solid #333;">${x}% ${y}% · ${zoomPct}%</span>
        </div>
        
        ${hint ? `<p style="font-size:0.68rem; color:#777; margin:0 0 8px 0; line-height:1.3;">${hint}</p>` : ''}

        <!-- 5 快捷焦点预设按钮 -->
        <div style="display:flex; gap:4px; margin-bottom:8px; flex-wrap:wrap;">
          <button type="button" class="btn-tiny" style="padding:2px 7px; font-size:0.68rem; background:#222; border-color:#444;" onclick="setImageCropPreset('${id}', 50, 10, ${zoom})" title="对齐人物面部/头部/顶部">⬆️ 偏上(头部)</button>
          <button type="button" class="btn-tiny" style="padding:2px 7px; font-size:0.68rem; background:#222; border-color:#444;" onclick="setImageCropPreset('${id}', 50, 50, ${zoom})" title="画面正中居中">🎯 居中</button>
          <button type="button" class="btn-tiny" style="padding:2px 7px; font-size:0.68rem; background:#222; border-color:#444;" onclick="setImageCropPreset('${id}', 50, 90, ${zoom})" title="对齐底部">⬇️ 偏下</button>
          <button type="button" class="btn-tiny" style="padding:2px 7px; font-size:0.68rem; background:#222; border-color:#444;" onclick="setImageCropPreset('${id}', 10, 50, ${zoom})" title="偏左对齐">⬅️ 偏左</button>
          <button type="button" class="btn-tiny" style="padding:2px 7px; font-size:0.68rem; background:#222; border-color:#444;" onclick="setImageCropPreset('${id}', 90, 50, ${zoom})" title="偏右对齐">➡️ 偏右</button>
          <button type="button" class="btn-tiny" style="padding:2px 7px; font-size:0.68rem; background:#1c1c1c; border-color:#383838; color:#888;" onclick="setImageCropPreset('${id}', 50, 50, 1.0)" title="重置位置与缩放">↺ 还原</button>
        </div>

        <!-- 上下垂直位置滑块 -->
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:5px;">
          <span style="font-size:0.7rem; color:#aaa; width:48px; flex-shrink:0;">↕️ 上下:</span>
          <input type="range" min="0" max="100" value="${y}" 
                 id="crop_sl_y_${id}" 
                 style="flex:1; accent-color:var(--gold); height:4px; cursor:pointer;"
                 oninput="onImageCropChange('${id}')">
          <span id="crop_txt_y_${id}" style="font-size:0.7rem; color:#ccc; width:30px; text-align:right; font-family:monospace;">${y}%</span>
        </div>

        <!-- 左右水平位置滑块 -->
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:5px;">
          <span style="font-size:0.7rem; color:#aaa; width:48px; flex-shrink:0;">↔️ 左右:</span>
          <input type="range" min="0" max="100" value="${x}" 
                 id="crop_sl_x_${id}" 
                 style="flex:1; accent-color:var(--gold); height:4px; cursor:pointer;"
                 oninput="onImageCropChange('${id}')">
          <span id="crop_txt_x_${id}" style="font-size:0.7rem; color:#ccc; width:30px; text-align:right; font-family:monospace;">${x}%</span>
        </div>

        <!-- 画面缩放滑块 -->
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:0.7rem; color:#aaa; width:48px; flex-shrink:0;">🔍 缩放:</span>
          <input type="range" min="100" max="250" value="${zoomPct}" 
                 id="crop_sl_z_${id}" 
                 style="flex:1; accent-color:var(--gold); height:4px; cursor:pointer;"
                 oninput="onImageCropChange('${id}')">
          <span id="crop_txt_z_${id}" style="font-size:0.7rem; color:#ccc; width:30px; text-align:right; font-family:monospace;">${zoomPct}%</span>
        </div>

        <input type="hidden" id="${pId}" value="${posVal || '50% 50%'}">
        <input type="hidden" id="${zId}" value="${zoom}">
      </div>
    `;
  };

  window.onImageCropChange = function(id) {
    const slX = document.getElementById(`crop_sl_x_${id}`);
    const slY = document.getElementById(`crop_sl_y_${id}`);
    const slZ = document.getElementById(`crop_sl_z_${id}`);
    if (!slX || !slY) return;

    const x = parseInt(slX.value, 10) || 50;
    const y = parseInt(slY.value, 10) || 50;
    const zoom = slZ ? (parseInt(slZ.value, 10) / 100) : 1.0;
    const zoomPct = Math.round(zoom * 100);

    const txtX = document.getElementById(`crop_txt_x_${id}`);
    const txtY = document.getElementById(`crop_txt_y_${id}`);
    const txtZ = document.getElementById(`crop_txt_z_${id}`);
    const badge = document.getElementById(`pos_val_badge_${id}`);
    
    if (txtX) txtX.innerText = `${x}%`;
    if (txtY) txtY.innerText = `${y}%`;
    if (txtZ) txtZ.innerText = `${zoomPct}%`;
    if (badge) badge.innerText = `${x}% ${y}% · ${zoomPct}%`;

    const widget = document.querySelector(`.crop-controller-widget[data-ctrl-id="${id}"]`);
    const targetImgId = widget?.dataset?.targetImg;
    const posInputId = widget?.dataset?.posId || `in_pos_${id}`;
    const zoomInputId = widget?.dataset?.zoomId || `in_zoom_${id}`;

    const posStr = `${x}% ${y}%`;
    const posInput = document.getElementById(posInputId);
    const zoomInput = document.getElementById(zoomInputId);
    if (posInput) posInput.value = posStr;
    if (zoomInput) zoomInput.value = zoom;

    if (targetImgId) {
      const targetImg = document.getElementById(targetImgId);
      if (targetImg) {
        targetImg.style.objectFit = 'cover';
        targetImg.style.objectPosition = posStr;
        targetImg.style.transform = `scale(${zoom})`;
        targetImg.style.transformOrigin = posStr;
      }
    }
  };

  window.setImageCropPreset = function(id, x, y, zoom) {
    const slX = document.getElementById(`crop_sl_x_${id}`);
    const slY = document.getElementById(`crop_sl_y_${id}`);
    const slZ = document.getElementById(`crop_sl_z_${id}`);
    if (slX) slX.value = x;
    if (slY) slY.value = y;
    if (slZ && zoom) slZ.value = Math.round(zoom * 100);
    window.onImageCropChange(id);
  };

  // Backward compatibility aliases for coworkers
  window.onCoworkerCropChange = function(idx) {
    const sX = document.getElementById(`slider_x_${idx}`);
    const sY = document.getElementById(`slider_y_${idx}`);
    const sZ = document.getElementById(`slider_z_${idx}`);
    const valX = sX ? parseInt(sX.value, 10) : 50;
    const valY = sY ? parseInt(sY.value, 10) : 20;
    const valZ = sZ ? (parseInt(sZ.value, 10) / 100) : 1.0;

    const spanX = document.getElementById(`val_x_${idx}`);
    const spanY = document.getElementById(`val_y_${idx}`);
    const spanZ = document.getElementById(`val_z_${idx}`);
    const label = document.getElementById(`pos_label_${idx}`);
    const hiddenPos = document.getElementById(`in_cw_pos_${idx}`);
    const hiddenZoom = document.getElementById(`in_cw_zoom_${idx}`);
    const imgPrev = document.getElementById(`prev_cw_${idx}`);

    if (spanX) spanX.innerText = `${valX}%`;
    if (spanY) spanY.innerText = `${valY}%`;
    if (spanZ) spanZ.innerText = `${Math.round(valZ * 100)}%`;
    const posStr = `${valX}% ${valY}%`;
    if (label) label.innerText = `${posStr}`;
    if (hiddenPos) hiddenPos.value = posStr;
    if (hiddenZoom) hiddenZoom.value = valZ;

    if (imgPrev) {
      imgPrev.style.objectPosition = posStr;
      imgPrev.style.transform = `scale(${valZ})`;
      imgPrev.style.transformOrigin = posStr;
    }
  };

  window.setCoworkerCropPreset = function(idx, xVal, yVal, zVal) {
    const sX = document.getElementById(`slider_x_${idx}`);
    const sY = document.getElementById(`slider_y_${idx}`);
    const sZ = document.getElementById(`slider_z_${idx}`);
    if (sX) sX.value = xVal;
    if (sY) sY.value = yVal;
    if (sZ) sZ.value = Math.round(zVal * 100);
    window.onCoworkerCropChange(idx);
  };

  window.getCoWorkersListFromConfig = function(aboutData) {
    if (aboutData && Array.isArray(aboutData.about_team_list) && aboutData.about_team_list.length > 0) {
      return aboutData.about_team_list.map(item => ({
        ...item,
        hidden: item.hidden === true || item.is_hidden === true || item.hidden === 'true'
      }));
    }
    const list = [];
    for (let i = 1; i <= 20; i++) {
      const role = aboutData[`about_team_r${i}_t`];
      const role_en = aboutData[`about_team_r${i}_te`];
      const names = aboutData[`about_team_r${i}_names`];
      const img = aboutData[`about_team_r${i}_img`];
      const pos = aboutData[`about_team_r${i}_pos`];
      const zoom = aboutData[`about_team_r${i}_zoom`];
      const hidden = aboutData[`about_team_r${i}_hidden`] === true || aboutData[`about_team_r${i}_hidden`] === 'true';
      if (role || names || img) {
        list.push({
          id: `staff_${i}`,
          role: role || `职务 ${i}`,
          role_en: role_en || '',
          names: names || '',
          image_url: img || 'assets/logo.png',
          img_pos: pos || '50% 20%',
          img_zoom: zoom ? parseFloat(zoom) : 1.0,
          hidden: hidden
        });
      }
    }
    if (list.length > 0) return list;

    return [
      { id: "staff_1", role: "创作平台创办启发人", role_en: "", names: "汤小康\nWarren 沈自强", image_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80", img_pos: "50% 20%", img_zoom: 1.0, hidden: false },
      { id: "staff_2", role: "创作", role_en: "", names: "Warren 沈自强\n汤小康\nNatasha", image_url: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80", img_pos: "50% 20%", img_zoom: 1.0, hidden: false },
      { id: "staff_3", role: "制作", role_en: "", names: "汤小康\nWarren 沈自强\nEdward", image_url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80", img_pos: "50% 20%", img_zoom: 1.0, hidden: false },
      { id: "staff_4", role: "拍摄", role_en: "", names: "陈宏亮", image_url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80", img_pos: "50% 20%", img_zoom: 1.0, hidden: false },
      { id: "staff_5", role: "宣传", role_en: "", names: "Sherlyn", image_url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80", img_pos: "50% 20%", img_zoom: 1.0, hidden: false },
      { id: "staff_6", role: "行政", role_en: "", names: "梁苡乐", image_url: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80", img_pos: "50% 20%", img_zoom: 1.0, hidden: false },
      { id: "staff_7", role: "歌手与主领", role_en: "", names: "依歌曲需求而定", image_url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80", img_pos: "50% 20%", img_zoom: 1.0, hidden: false }
    ];
  };

  window.renderCoWorkerCardsHTML = function(teamList) {
    return teamList.map((item, index) => {
      const idx = index + 1;
      const numStr = idx < 10 ? '0' + idx : '' + idx;
      const itemId = item.id || `staff_${idx}`;
      const imgPos = item.img_pos || '50% 20%';
      const imgZoom = item.img_zoom ? parseFloat(item.img_zoom) : 1.0;
      const posX = getCoworkerXPercent(imgPos);
      const posY = getCoworkerYPercent(imgPos);
      const zoomPct = Math.round(imgZoom * 100);
      const isHidden = item.hidden === true || item.is_hidden === true || item.hidden === 'true';

      return `
        <div class="coworker-item-card" data-id="${itemId}" style="background:#121212; padding:18px; border-radius:10px; border:${isHidden ? '1.5px dashed #662222' : '1px solid #222'}; opacity:${isHidden ? '0.85' : '1'}; position:relative; display:flex; flex-direction:column; justify-content:space-between; transition:all 0.2s ease;">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:6px;">
              <span class="coworker-badge" style="color:var(--gold); font-size:0.82rem; font-weight:bold;">${numStr} 职务与成员</span>
              <div style="display:flex; align-items:center; gap:6px;">
                <span class="cw-status-badge" style="background:${isHidden ? 'rgba(230,57,70,0.9)' : 'rgba(46,213,115,0.9)'}; color:#fff; padding:2px 7px; border-radius:10px; font-size:0.68rem; font-weight:bold;">
                  ${isHidden ? '🙈 已隐藏' : '👁️ 公开'}
                </span>
                <button type="button" class="btn-tiny cw-visibility-btn" style="padding:2px 7px; font-size:0.72rem; ${isHidden ? 'color:#2ed573; border-color:#2ed573;' : 'color:#ff6b6b; border-color:#ff6b6b;'}" onclick="toggleCoWorkerVisibility(this)" title="切换前台公开或隐藏">
                  ${isHidden ? '👁️ 设为公开' : '🙈 设为隐藏'}
                </button>
                <button type="button" class="btn-tiny danger" style="padding:2px 7px; font-size:0.72rem;" onclick="removeCoWorkerCard(this)" title="删除此同工职务">🗑️ 删除</button>
              </div>
            </div>
            <input type="hidden" class="coworker-hidden-val" value="${isHidden ? 'true' : 'false'}">
            
            <label style="font-size:0.75rem; color:#aaa;">中文职务名称 (Role Title) *</label>
            <input type="text" class="coworker-role-input" value="${item.role || ''}" placeholder="例如：创作平台创办启发人" style="width:100%; margin:4px 0 8px; font-size:0.85rem; padding:7px 10px; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; border-radius:4px;">
            
            <label style="font-size:0.75rem; color:#aaa;">英文职务 (Role EN, 可选)</label>
            <input type="text" class="coworker-role-en-input" value="${item.role_en || ''}" placeholder="例如：Founding Inspirer" style="width:100%; margin:4px 0 8px; font-size:0.8rem; padding:6px 10px; background:#1a1a1a; border:1px solid #333; color:#aaa; border-radius:4px;">

            <label style="font-size:0.75rem; color:#aaa;">同工姓名 (成员名单，换行分隔)</label>
            <textarea class="coworker-names-input" placeholder="输入同工名字，如：汤小康&#10;Warren 沈自强" style="width:100%; height:55px; margin:4px 0 8px; font-size:0.85rem; padding:6px 10px; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; border-radius:4px;">${item.names || ''}</textarea>

            <label style="font-size:0.75rem; color:#aaa;">拍立得相片 (Polaroid Photo)</label>
            <div style="margin-top:4px;">
              <!-- 实时预览框 (Exact Polaroid Aspect Ratio) -->
              <div style="position:relative; width:100%; height:140px; overflow:hidden; border-radius:6px; background:#080808; border:1px solid #333; margin-bottom:6px;">
                <img id="prev_cw_${idx}" class="coworker-prev-img" src="${item.image_url || 'assets/logo.png'}" 
                     style="width:100%; height:100%; object-fit:cover; object-position:${imgPos}; transform:scale(${imgZoom}); transition:all 0.15s ease;" 
                     onerror="this.src='assets/logo.png'">
              </div>

              <input type="file" id="f_cw_${idx}" style="font-size:0.75rem; width:100%; color:#888;">
              <button class="btn-tiny" style="width:100%; margin-top:4px;" onclick="uploadFile('f_cw_${idx}', 'in_cw_${idx}', 'prev_cw_${idx}')">📤 更换相片</button>
              <input type="hidden" id="in_cw_${idx}" class="coworker-img-val" value="${item.image_url || ''}">

              <!-- 🎚️ 裁剪显示区域与焦点调整 (Crop & Position Controller) -->
              <div style="background:#161616; padding:10px 12px; border-radius:6px; border:1px solid #282828; margin-top:8px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                  <span style="font-size:0.73rem; color:var(--gold); font-weight:bold;"><i class="fas fa-crop-alt"></i> 调整显示区域 (Crop Focus)</span>
                  <span id="pos_label_${idx}" style="font-size:0.68rem; color:#888;">${imgPos}</span>
                </div>

                <!-- 快捷焦点预设 -->
                <div style="display:flex; gap:4px; margin-bottom:8px; flex-wrap:wrap;">
                  <button type="button" class="btn-tiny" style="padding:2px 7px; font-size:0.68rem; background:#222; border-color:#444;" onclick="setCoworkerCropPreset('${idx}', 50, 0, ${imgZoom})" title="对齐头部/顶部">⬆️ 偏上(头部)</button>
                  <button type="button" class="btn-tiny" style="padding:2px 7px; font-size:0.68rem; background:#222; border-color:#444;" onclick="setCoworkerCropPreset('${idx}', 50, 50, ${imgZoom})" title="居中对齐">🎯 居中</button>
                  <button type="button" class="btn-tiny" style="padding:2px 7px; font-size:0.68rem; background:#222; border-color:#444;" onclick="setCoworkerCropPreset('${idx}', 50, 85, ${imgZoom})" title="对齐底部">⬇️ 偏下</button>
                  <button type="button" class="btn-tiny" style="padding:2px 7px; font-size:0.68rem; background:#222; border-color:#444;" onclick="setCoworkerCropPreset('${idx}', 15, 50, ${imgZoom})" title="偏左对齐">⬅️ 偏左</button>
                  <button type="button" class="btn-tiny" style="padding:2px 7px; font-size:0.68rem; background:#222; border-color:#444;" onclick="setCoworkerCropPreset('${idx}', 85, 50, ${imgZoom})" title="偏右对齐">➡️ 偏右</button>
                </div>

                <!-- 上下微调滑块 -->
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:5px;">
                  <span style="font-size:0.7rem; color:#aaa; width:48px; flex-shrink:0;">↕️ 上下:</span>
                  <input type="range" min="0" max="100" value="${posY}" 
                         id="slider_y_${idx}" class="cw-slider-y" 
                         style="flex:1; accent-color:var(--gold); height:4px; cursor:pointer;"
                         oninput="onCoworkerCropChange('${idx}')">
                  <span id="val_y_${idx}" style="font-size:0.7rem; color:#ccc; width:30px; text-align:right;">${posY}%</span>
                </div>

                <!-- 左右微调滑块 -->
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:5px;">
                  <span style="font-size:0.7rem; color:#aaa; width:48px; flex-shrink:0;">↔️ 左右:</span>
                  <input type="range" min="0" max="100" value="${posX}" 
                         id="slider_x_${idx}" class="cw-slider-x" 
                         style="flex:1; accent-color:var(--gold); height:4px; cursor:pointer;"
                         oninput="onCoworkerCropChange('${idx}')">
                  <span id="val_x_${idx}" style="font-size:0.7rem; color:#ccc; width:30px; text-align:right;">${posX}%</span>
                </div>

                <!-- 缩放放大滑块 -->
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-size:0.7rem; color:#aaa; width:48px; flex-shrink:0;">🔍 缩放:</span>
                  <input type="range" min="100" max="200" value="${zoomPct}" 
                         id="slider_z_${idx}" class="cw-slider-z" 
                         style="flex:1; accent-color:var(--gold); height:4px; cursor:pointer;"
                         oninput="onCoworkerCropChange('${idx}')">
                  <span id="val_z_${idx}" style="font-size:0.7rem; color:#ccc; width:30px; text-align:right;">${zoomPct}%</span>
                </div>

                <input type="hidden" id="in_cw_pos_${idx}" class="coworker-pos-val" value="${imgPos}">
                <input type="hidden" id="in_cw_zoom_${idx}" class="coworker-zoom-val" value="${imgZoom}">
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  };

  window.addCoWorkerCard = function() {
    const container = document.getElementById('coWorkersListGrid');
    if (!container) return;
    const count = container.querySelectorAll('.coworker-item-card').length + 1;
    const numStr = count < 10 ? '0' + count : '' + count;
    const uid = Date.now();
    const newCard = document.createElement('div');
    newCard.className = 'coworker-item-card';
    newCard.dataset.id = 'staff_' + uid;
    newCard.style = "background:#121212; padding:18px; border-radius:10px; border:1.5px dashed var(--gold); position:relative; display:flex; flex-direction:column; justify-content:space-between; animation:fadeIn 0.3s ease; transition:all 0.2s ease;";
    newCard.innerHTML = `
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:6px;">
          <span class="coworker-badge" style="color:var(--gold); font-size:0.82rem; font-weight:bold;">${numStr} 新增职务与同工</span>
          <div style="display:flex; align-items:center; gap:6px;">
            <span class="cw-status-badge" style="background:rgba(46,213,115,0.9); color:#fff; padding:2px 7px; border-radius:10px; font-size:0.68rem; font-weight:bold;">
              👁️ 公开
            </span>
            <button type="button" class="btn-tiny cw-visibility-btn" style="padding:2px 7px; font-size:0.72rem; color:#ff6b6b; border-color:#ff6b6b;" onclick="toggleCoWorkerVisibility(this)" title="切换前台公开或隐藏">
              🙈 设为隐藏
            </button>
            <button type="button" class="btn-tiny danger" style="padding:2px 7px; font-size:0.72rem;" onclick="removeCoWorkerCard(this)" title="删除此同工职务">🗑️ 删除</button>
          </div>
        </div>
        <input type="hidden" class="coworker-hidden-val" value="false">
        
        <label style="font-size:0.75rem; color:#aaa;">中文职务名称 (Role Title) *</label>
        <input type="text" class="coworker-role-input" value="" placeholder="例如：诗歌编曲组" style="width:100%; margin:4px 0 8px; font-size:0.85rem; padding:7px 10px; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; border-radius:4px;">
        
        <label style="font-size:0.75rem; color:#aaa;">英文职务 (Role EN, 可选)</label>
        <input type="text" class="coworker-role-en-input" value="" placeholder="例如：Music Arranger" style="width:100%; margin:4px 0 8px; font-size:0.8rem; padding:6px 10px; background:#1a1a1a; border:1px solid #333; color:#aaa; border-radius:4px;">

        <label style="font-size:0.75rem; color:#aaa;">同工姓名 (成员名单，换行分隔)</label>
        <textarea class="coworker-names-input" placeholder="输入同工名字..." style="width:100%; height:55px; margin:4px 0 8px; font-size:0.85rem; padding:6px 10px; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; border-radius:4px;"></textarea>

        <label style="font-size:0.75rem; color:#aaa;">拍立得相片 (Polaroid Photo)</label>
        <div style="margin-top:4px;">
          <div style="position:relative; width:100%; height:140px; overflow:hidden; border-radius:6px; background:#080808; border:1px solid #333; margin-bottom:6px;">
            <img id="prev_cw_${uid}" class="coworker-prev-img" src="assets/logo.png" 
                 style="width:100%; height:100%; object-fit:cover; object-position:50% 20%; transform:scale(1); transition:all 0.15s ease;">
          </div>
          <input type="file" id="f_cw_${uid}" style="font-size:0.75rem; width:100%; color:#888;">
          <button class="btn-tiny" style="width:100%; margin-top:4px;" onclick="uploadFile('f_cw_${uid}', 'in_cw_${uid}', 'prev_cw_${uid}')">📤 上传相片</button>
          <input type="hidden" id="in_cw_${uid}" class="coworker-img-val" value="assets/logo.png">

          <!-- 🎚️ 裁剪显示区域与焦点调整 -->
          <div style="background:#161616; padding:10px 12px; border-radius:6px; border:1px solid #282828; margin-top:8px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <span style="font-size:0.73rem; color:var(--gold); font-weight:bold;"><i class="fas fa-crop-alt"></i> 调整显示区域 (Crop Focus)</span>
              <span id="pos_label_${uid}" style="font-size:0.68rem; color:#888;">50% 20%</span>
            </div>

            <div style="display:flex; gap:4px; margin-bottom:8px; flex-wrap:wrap;">
              <button type="button" class="btn-tiny" style="padding:2px 7px; font-size:0.68rem; background:#222; border-color:#444;" onclick="setCoworkerCropPreset('${uid}', 50, 0, 1.0)" title="对齐头部/顶部">⬆️ 偏上(头部)</button>
              <button type="button" class="btn-tiny" style="padding:2px 7px; font-size:0.68rem; background:#222; border-color:#444;" onclick="setCoworkerCropPreset('${uid}', 50, 50, 1.0)" title="居中对齐">🎯 居中</button>
              <button type="button" class="btn-tiny" style="padding:2px 7px; font-size:0.68rem; background:#222; border-color:#444;" onclick="setCoworkerCropPreset('${uid}', 50, 85, 1.0)" title="对齐底部">⬇️ 偏下</button>
              <button type="button" class="btn-tiny" style="padding:2px 7px; font-size:0.68rem; background:#222; border-color:#444;" onclick="setCoworkerCropPreset('${uid}', 15, 50, 1.0)" title="偏左对齐">⬅️ 偏左</button>
              <button type="button" class="btn-tiny" style="padding:2px 7px; font-size:0.68rem; background:#222; border-color:#444;" onclick="setCoworkerCropPreset('${uid}', 85, 50, 1.0)" title="偏右对齐">➡️ 偏右</button>
            </div>

            <div style="display:flex; align-items:center; gap:8px; margin-bottom:5px;">
              <span style="font-size:0.7rem; color:#aaa; width:48px; flex-shrink:0;">↕️ 上下:</span>
              <input type="range" min="0" max="100" value="20" 
                     id="slider_y_${uid}" class="cw-slider-y" 
                     style="flex:1; accent-color:var(--gold); height:4px; cursor:pointer;"
                     oninput="onCoworkerCropChange('${uid}')">
              <span id="val_y_${uid}" style="font-size:0.7rem; color:#ccc; width:30px; text-align:right;">20%</span>
            </div>

            <div style="display:flex; align-items:center; gap:8px; margin-bottom:5px;">
              <span style="font-size:0.7rem; color:#aaa; width:48px; flex-shrink:0;">↔️ 左右:</span>
              <input type="range" min="0" max="100" value="50" 
                     id="slider_x_${uid}" class="cw-slider-x" 
                     style="flex:1; accent-color:var(--gold); height:4px; cursor:pointer;"
                     oninput="onCoworkerCropChange('${uid}')">
              <span id="val_x_${uid}" style="font-size:0.7rem; color:#ccc; width:30px; text-align:right;">50%</span>
            </div>

            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:0.7rem; color:#aaa; width:48px; flex-shrink:0;">🔍 缩放:</span>
              <input type="range" min="100" max="200" value="100" 
                     id="slider_z_${uid}" class="cw-slider-z" 
                     style="flex:1; accent-color:var(--gold); height:4px; cursor:pointer;"
                     oninput="onCoworkerCropChange('${uid}')">
              <span id="val_z_${uid}" style="font-size:0.7rem; color:#ccc; width:30px; text-align:right;">100%</span>
            </div>

            <input type="hidden" id="in_cw_pos_${uid}" class="coworker-pos-val" value="50% 20%">
            <input type="hidden" id="in_cw_zoom_${uid}" class="coworker-zoom-val" value="1.0">
          </div>
        </div>
      </div>
    `;
    container.appendChild(newCard);
    updateCoWorkerBadges();
  };

  window.toggleCoWorkerVisibility = function(btn) {
    const card = btn.closest('.coworker-item-card');
    if (!card) return;
    const hiddenInput = card.querySelector('.coworker-hidden-val');
    const statusBadge = card.querySelector('.cw-status-badge');
    if (!hiddenInput) return;

    const willBeHidden = hiddenInput.value !== 'true';
    hiddenInput.value = willBeHidden ? 'true' : 'false';

    if (willBeHidden) {
      btn.innerText = '👁️ 设为公开';
      btn.style.color = '#2ed573';
      btn.style.borderColor = '#2ed573';
      if (statusBadge) {
        statusBadge.innerText = '🙈 已隐藏';
        statusBadge.style.background = 'rgba(230,57,70,0.9)';
      }
      card.style.borderColor = '#662222';
      card.style.borderStyle = 'dashed';
      card.style.opacity = '0.85';
    } else {
      btn.innerText = '🙈 设为隐藏';
      btn.style.color = '#ff6b6b';
      btn.style.borderColor = '#ff6b6b';
      if (statusBadge) {
        statusBadge.innerText = '👁️ 公开';
        statusBadge.style.background = 'rgba(46,213,115,0.9)';
      }
      card.style.borderColor = '#222';
      card.style.borderStyle = 'solid';
      card.style.opacity = '1';
    }
  };

  window.removeCoWorkerCard = function(btn) {
    if (!confirm("确定要删除这个职务与同工吗？保存后前台将不再显示。")) return;
    const card = btn.closest('.coworker-item-card');
    if (card) {
      card.remove();
      updateCoWorkerBadges();
    }
  };

  window.updateCoWorkerBadges = function() {
    const container = document.getElementById('coWorkersListGrid');
    if (!container) return;
    const cards = container.querySelectorAll('.coworker-item-card');
    cards.forEach((card, index) => {
      const idx = index + 1;
      const numStr = idx < 10 ? '0' + idx : '' + idx;
      const badge = card.querySelector('.coworker-badge');
      if (badge) badge.innerText = `${numStr} 职务与成员`;
    });
    const countSpan = document.getElementById('coWorkersCountBadge');
    if (countSpan) countSpan.innerText = `(${cards.length})`;
  };

  window.saveCoreCoWorkersCMS = async () => {
    const { data: configs } = await db.from('site_config').select('*');
    const c = (configs || []).reduce((acc, curr) => { acc[curr.key] = curr.value; return acc; }, {});
    let aboutData = {};
    if (c['cfg_about_content_json']) {
      try {
        aboutData = typeof c['cfg_about_content_json'] === 'string' ? JSON.parse(c['cfg_about_content_json']) : c['cfg_about_content_json'];
      } catch(e){}
    }

    const cards = document.querySelectorAll('.coworker-item-card');
    const teamList = [];
    cards.forEach((card, i) => {
      const role = card.querySelector('.coworker-role-input')?.value || '';
      const role_en = card.querySelector('.coworker-role-en-input')?.value || '';
      const names = card.querySelector('.coworker-names-input')?.value || '';
      const img = card.querySelector('.coworker-img-val')?.value || '';
      const pos = card.querySelector('.coworker-pos-val')?.value || '50% 20%';
      const zoom = parseFloat(card.querySelector('.coworker-zoom-val')?.value) || 1.0;
      const isHidden = card.querySelector('.coworker-hidden-val')?.value === 'true';
      const id = card.dataset.id || `staff_${i+1}`;
      teamList.push({
        id,
        role,
        role_en,
        names,
        image_url: img,
        img_pos: pos,
        img_zoom: zoom,
        hidden: isHidden
      });

      // Maintain backwards compatibility
      aboutData[`about_team_r${i+1}_t`] = role;
      aboutData[`about_team_r${i+1}_te`] = role_en;
      aboutData[`about_team_r${i+1}_names`] = names;
      aboutData[`about_team_r${i+1}_img`] = img;
      aboutData[`about_team_r${i+1}_pos`] = pos;
      aboutData[`about_team_r${i+1}_zoom`] = zoom;
      aboutData[`about_team_r${i+1}_hidden`] = isHidden;
    });

    for (let k = teamList.length + 1; k <= 30; k++) {
      delete aboutData[`about_team_r${k}_t`];
      delete aboutData[`about_team_r${k}_te`];
      delete aboutData[`about_team_r${k}_names`];
      delete aboutData[`about_team_r${k}_img`];
      delete aboutData[`about_team_r${k}_pos`];
      delete aboutData[`about_team_r${k}_zoom`];
      delete aboutData[`about_team_r${k}_hidden`];
    }

    aboutData.about_team_list = teamList;

    try {
      await db.from('site_config').upsert({
        key: 'cfg_about_content_json',
        value: JSON.stringify(aboutData)
      }, { onConflict: 'key' });

      alert("🎉 主要服事同工与职务名册（含照片裁剪焦点与展示状态）已成功保存并实时生效！");
      renderCMS();
    } catch(err) {
      alert("保存失败: " + err.message);
    }
  };

  window.toggleSingerHidden = async (singerId, makeHidden) => {
    try {
      const { data: cfg } = await db.from('site_config').select('value').eq('key', 'cfg_hidden_singer_ids').maybeSingle();
      let hiddenSingerIds = [];
      if (cfg && cfg.value) {
        try {
          hiddenSingerIds = typeof cfg.value === 'string' ? JSON.parse(cfg.value) : cfg.value;
        } catch(e){}
      }
      if (!Array.isArray(hiddenSingerIds)) hiddenSingerIds = [];

      if (makeHidden) {
        if (!hiddenSingerIds.includes(singerId)) hiddenSingerIds.push(singerId);
      } else {
        hiddenSingerIds = hiddenSingerIds.filter(id => id !== singerId);
      }

      await db.from('site_config').upsert({
        key: 'cfg_hidden_singer_ids',
        value: JSON.stringify(hiddenSingerIds)
      }, { onConflict: 'key' });

      renderCMS();
    } catch(err) {
      alert("修改歌手展示状态失败: " + err.message);
    }
  };

  window.addSinger = async(defaultCat = 'gospel') => {
    const modal = document.createElement('div');
    modal.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:9999; display:flex; justify-content:center; align-items:center; padding:20px; backdrop-filter:blur(10px);";
    modal.innerHTML = `
      <div style="background:#111; border:1.5px solid var(--gold); border-radius:16px; padding:2.2rem; width:100%; max-width:550px; max-height:90vh; overflow-y:auto;">
        <h3 style="color:var(--gold); margin-top:0;">邀请新歌手档案 (Add Singer)</h3>
        
        <div style="margin-bottom:20px; text-align:center; background:#0a0a0a; padding:15px; border-radius:10px; border:1px solid #222;">
          <div style="width:130px; height:160px; margin:0 auto 10px; overflow:hidden; border-radius:8px; background:#181818; border:1px solid #333; display:flex; align-items:center; justify-content:center;">
            <img id="sprev_new" src="assets/logo.png" style="width:100%; height:100%; object-fit:cover; object-position:50% 20%; transform:scale(1.0); transform-origin:50% 20%; transition:all 0.1s ease;">
          </div>
          <input type="file" id="sfup_new" style="display:block; margin:0 auto; font-size:0.8rem; color:#aaa; width:100%;">
          <button class="btn-tiny" style="margin-top:10px; width:100%;" onclick="uploadFile('sfup_new', 'surl_new', 'sprev_new')">📤 上传歌手照片</button>
          <input type="hidden" id="surl_new" value="">

          <!-- 🎚️ 歌手相片焦点与裁剪调整 -->
          ${renderImageCropControllerHTML({
            id: 'singer_new_crop',
            targetImgId: 'sprev_new',
            posVal: '50% 20%',
            zoomVal: 1.0,
            posInputId: 's_pos_new',
            zoomInputId: 's_zoom_new',
            label: '调整歌手相片呈现区域 (Singer Photo Focus)',
            hint: '调整头部或面部上下位置与缩放，让歌手在卡片上完美展示'
          })}
        </div>

        <label style="color:#aaa; font-size:0.8rem; display:block; margin-bottom:4px;">姓名 (Name) *</label>
        <input type="text" id="s_n_new" placeholder="歌手 / 音乐人姓名..." style="width:100%; margin-bottom:15px; padding:10px;">

        <label style="color:#aaa; font-size:0.8rem; display:block; margin-bottom:4px;">短简介 Title / Role (显示在卡片上)</label>
        <input type="text" id="s_role_new" placeholder="例如：CCM 原创歌手 / 敬拜主领" style="width:100%; margin-bottom:15px; padding:10px;" value="">
        
        <label style="color:#aaa; font-size:0.8rem; display:block; margin-bottom:4px;">详细介绍 Description (显示在弹窗里)</label>
        <textarea id="s_bio_new" placeholder="请输入详细的歌手介绍、信仰见证与音乐经历..." style="width:100%; height:100px; margin-bottom:15px; background:#181818; color: #F6F4F0; border:1px solid #333; padding:10px; border-radius:6px;"></textarea>

        <label style="color:#aaa; font-size:0.8rem; display:block; margin-bottom:4px;">展示分类 (Category)</label>
        <select id="s_cat_new" style="width:100%; margin-bottom:15px; background: #181818; color: #F6F4F0; padding: 10px; border: 1px solid #333; border-radius:6px;">
          <option value="gospel" ${defaultCat==='gospel'?'selected':''}>福音歌手 Gospel</option>
          <option value="worship" ${defaultCat==='worship'?'selected':''}>敬拜赞美歌手 Worship</option>
        </select>

        <label style="color:#aaa; font-size:0.8rem; display:block; margin-bottom:4px;">展示状态 (Visibility)</label>
        <select id="s_hidden_new" style="width:100%; margin-bottom:15px; background: #181818; color: #F6F4F0; padding: 10px; border: 1px solid #333; border-radius:6px;">
          <option value="false">👁️ 正常公开展出 (Visible)</option>
          <option value="true">🙈 暂时隐藏 / 未公布 (Hidden)</option>
        </select>

        <div style="margin-top:20px; display:flex; gap:10px;">
          <button class="btn btn-submit" style="flex:2;" onclick="submitNewSinger(this)">确认创建</button>
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
    const img_pos = document.getElementById('s_pos_new')?.value || '50% 20%';
    const img_zoom = parseFloat(document.getElementById('s_zoom_new')?.value) || 1.0;
    const isHidden = document.getElementById('s_hidden_new')?.value === 'true';

    if(!name) return alert("请输入姓名");
    
    try {
      if(btn) btn.innerText = "处理中...";
      const { data: inserted, error } = await db.from('singers').insert([{
        name,
        role,
        bio,
        category,
        image_url,
        img_pos,
        img_zoom
      }]).select();
      if (error) throw error;

      if (isHidden && inserted && inserted[0]) {
        const newId = inserted[0].id;
        const { data: cfg } = await db.from('site_config').select('value').eq('key', 'cfg_hidden_singer_ids').maybeSingle();
        let hiddenSingerIds = [];
        if (cfg && cfg.value) {
          try { hiddenSingerIds = typeof cfg.value === 'string' ? JSON.parse(cfg.value) : cfg.value; } catch(e){}
        }
        if (!Array.isArray(hiddenSingerIds)) hiddenSingerIds = [];
        if (!hiddenSingerIds.includes(newId)) hiddenSingerIds.push(newId);
        await db.from('site_config').upsert({
          key: 'cfg_hidden_singer_ids',
          value: JSON.stringify(hiddenSingerIds)
        }, { onConflict: 'key' });
      }

      if(btn) btn.closest('div').parentElement.parentElement.remove();
      renderCMS();
    } catch (e) {
      alert("添加失败: " + e.message);
      if(btn) btn.innerText = "确认创建";
    }
  };

  window.editSinger = async(id) => {
    const { data: s } = await db.from('singers').select('*').eq('id', id).single();
    if (!s) return alert("未找到该歌手");

    const { data: hiddenCfg } = await db.from('site_config').select('value').eq('key', 'cfg_hidden_singer_ids').maybeSingle();
    let hiddenSingerIds = [];
    if (hiddenCfg && hiddenCfg.value) {
      try { hiddenSingerIds = typeof hiddenCfg.value === 'string' ? JSON.parse(hiddenCfg.value) : hiddenCfg.value; } catch(e){}
    }
    if (!Array.isArray(hiddenSingerIds)) hiddenSingerIds = [];
    const isHidden = hiddenSingerIds.includes(id) || s.hidden === true || s.is_hidden === true || s.status === 'hidden';

    const modal = document.createElement('div');
    modal.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:999; display:flex; justify-content:center; align-items:center; overflow-y:auto; padding:20px;";
    modal.innerHTML = `
      <div style="background:#111; border:1px solid var(--gold); border-radius:16px; padding:2rem; width:100%; max-width:600px; margin:auto;">
        <h2 style="color:var(--gold); margin-bottom:1.5rem;">编辑歌手档案</h2>
        
        <div style="margin-bottom:20px; text-align:center; background:#0a0a0a; padding:15px; border-radius:10px; border:1px solid #222;">
          <div style="width:130px; height:160px; margin:0 auto 10px; overflow:hidden; border-radius:8px; background:#181818; border:1px solid #333; display:flex; align-items:center; justify-content:center;">
            <img id="sprev" src="${s.image_url || 'assets/logo.png'}" style="width:100%; height:100%; object-fit:cover; object-position:${s.img_pos || s.pos || '50% 20%'}; transform:scale(${s.img_zoom || s.zoom || 1.0}); transform-origin:${s.img_pos || s.pos || '50% 20%'}; transition:all 0.1s ease;" onerror="this.src='assets/logo.png'">
          </div>
          <input type="file" id="sfup" style="display:block; margin:0 auto; font-size:0.8rem; color:#aaa; width:100%;">
          <button class="btn-tiny" style="margin-top:10px; width:100%;" onclick="uploadFile('sfup', 'surl', 'sprev')">📤 上传照片</button>
          <input type="hidden" id="surl" value="${s.image_url || ''}">

          <!-- 🎚️ 歌手相片焦点与裁剪调整 -->
          ${renderImageCropControllerHTML({
            id: 'singer_crop',
            targetImgId: 'sprev',
            posVal: s.img_pos || s.pos || '50% 20%',
            zoomVal: s.img_zoom || s.zoom || 1.0,
            posInputId: 'spos',
            zoomInputId: 'szoom',
            label: '调整歌手相片呈现区域 (Singer Photo Focus)',
            hint: '调整头部或面部上下位置与缩放，让歌手在卡片上完美展示'
          })}
        </div>

        <label>姓名 Name</label>
        <input type="text" id="sn" value="${s.name}" style="width:100%; margin-bottom:15px;">
        
        <label>短简介 Bio (显示在卡片上)</label>
        <input type="text" id="sr" value="${s.role || ''}" style="width:100%; margin-bottom:15px;">

        <label>详细介绍 Description (显示在弹窗里)</label>
        <textarea id="sb" style="width:100%; height:120px; margin-bottom:15px; background:#222; color: #F6F4F0; border:1px solid #444; padding:10px;">${s.bio || ''}</textarea>
        
        <label>展示分类 Category</label>
        <select id="scat" style="width:100%; margin-bottom:15px; background: #222; color: #F6F4F0; padding: 10px; border: 1px solid #444;">
          <option value="gospel" ${s.category === 'gospel' ? 'selected' : ''}>福音歌手 Gospel</option>
          <option value="worship" ${s.category === 'worship' ? 'selected' : ''}>敬拜歌手 Worship</option>
        </select>

        <label>前台展示状态 Visibility</label>
        <select id="shidden" style="width:100%; margin-bottom:15px; background: #222; color: #F6F4F0; padding: 10px; border: 1px solid #444;">
          <option value="false" ${!isHidden ? 'selected' : ''}>👁️ 正常公开展出 (Visible)</option>
          <option value="true" ${isHidden ? 'selected' : ''}>🙈 暂时隐藏 / 未公布 (Hidden)</option>
        </select>
        
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
    const isHidden = document.getElementById('shidden')?.value === 'true';
    const p = {
      name: document.getElementById('sn').value,
      bio: document.getElementById('sb').value,
      role: document.getElementById('sr').value,
      category: document.getElementById('scat').value,
      image_url: document.getElementById('surl').value,
      img_pos: document.getElementById('spos')?.value || '50% 20%',
      img_zoom: parseFloat(document.getElementById('szoom')?.value) || 1.0,
      display_order: parseInt(document.getElementById('so').value) || 0
    };
    try {
      if(btn) btn.innerText = "保存中...";
      const { error } = await db.from('singers').update(p).eq('id', id);
      if (error) throw error;

      // Update cfg_hidden_singer_ids in site_config
      const { data: hiddenCfg } = await db.from('site_config').select('value').eq('key', 'cfg_hidden_singer_ids').maybeSingle();
      let hiddenSingerIds = [];
      if (hiddenCfg && hiddenCfg.value) {
        try { hiddenSingerIds = typeof hiddenCfg.value === 'string' ? JSON.parse(hiddenCfg.value) : hiddenCfg.value; } catch(e){}
      }
      if (!Array.isArray(hiddenSingerIds)) hiddenSingerIds = [];

      if (isHidden) {
        if (!hiddenSingerIds.includes(id)) hiddenSingerIds.push(id);
      } else {
        hiddenSingerIds = hiddenSingerIds.filter(x => x !== id);
      }

      await db.from('site_config').upsert({
        key: 'cfg_hidden_singer_ids',
        value: JSON.stringify(hiddenSingerIds)
      }, { onConflict: 'key' });

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
              <td style="color: #F6F4F0;">${r.userEmail}</td>
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

  // --- 💖 SUPPORT US CMS MODULE (支持我们) ---
  async function renderSupportCMS(container) {
    const { data: configs } = await db.from('site_config').select('*');
    const c = (configs || []).reduce((acc, curr) => { acc[curr.key] = curr.value; return acc; }, {});

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem; flex-wrap:wrap; gap:15px;">
        <div>
          <h1 style="color:var(--gold); margin:0;">💖 支持我们 奉献管理 (Support Us CMS)</h1>
          <p style="color:#888; font-size:0.9rem; margin-top:5px;">
            管理前台「支持我们」页面的银行转账信息、DuitNow 收款二维码、顶部海报与奉献寄语。
          </p>
        </div>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <a href="receipt.html" target="_blank" class="btn-tiny" style="padding:10px 16px; text-decoration:none; display:inline-flex; align-items:center; gap:6px; background:linear-gradient(135deg, #d4af37, #aa820a); color:#111; font-weight:bold; border:none;">
            <i class="fas fa-file-invoice-dollar"></i> 🧾 开具官方奉献收据 / 发送感谢信
          </a>
          <a href="support.html" target="_blank" class="btn-tiny" style="padding:10px 16px; text-decoration:none; display:inline-flex; align-items:center; gap:6px; color:var(--gold); border-color:var(--gold);">
            <i class="fas fa-external-link-alt"></i> 预览前台支持页
          </a>
          <button class="btn btn-submit" style="width:auto; padding:10px 24px;" onclick="saveSupportCMS()">💾 保存支持页面设置</button>
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:2.5rem; max-width:1100px;">
        <!-- 0. 快速开具奉献收据与感谢信通道 -->
        <div class="cms-card" style="border-left: 4px solid #d4af37; background: linear-gradient(135deg, #1f1b14 0%, #151515 100%);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:15px;">
            <div>
              <h3 style="color:#f6d28a; margin:0; display:flex; align-items:center; gap:8px;">
                <span>🧾</span> 官方奉献电子收据开具系统 (Official E-Receipt Generator)
              </h3>
              <p style="color:#aaa; font-size:0.85rem; margin-top:6px; margin-bottom:0; line-height:1.6;">
                当收到奉献凭证邮件时，点击右侧按钮即可快速生成带有 Harvester 官方水印、印章和经文的 A4 打印/PDF 格式电子收据，并一键复制官方感谢回信。
              </p>
            </div>
            <a href="receipt.html" target="_blank" class="btn-tiny" style="padding:10px 20px; text-decoration:none; display:inline-flex; align-items:center; gap:8px; background:linear-gradient(135deg, #d4af37, #aa820a); color:#111; font-weight:bold; border:none; border-radius:6px;">
              <i class="fas fa-external-link-alt"></i> 立即进入收据开具系统
            </a>
          </div>
        </div>

        <!-- 1. 银行账户与二维码 -->
        <div class="cms-card" style="border-left: 4px solid var(--gold);">
          <h3 style="color:var(--gold); margin-top:0; display:flex; align-items:center; gap:8px;">
            <span>💳</span> 奉献账户与 DuitNow / QR Code
          </h3>
          <div style="display:grid; grid-template-columns: 1.2fr 1fr; gap:25px; margin-top:15px;">
            <div>
              <div style="margin-bottom:15px;">
                <label style="display:block; color:#aaa; font-size:0.8rem; margin-bottom:5px;">银行名称 (Bank Name)</label>
                <input type="text" id="in_support_bank" value="${c['cfg_support_bank'] || 'Maybank'}" placeholder="例如：Maybank" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:10px; border-radius:6px;">
              </div>
              <div style="margin-bottom:15px;">
                <label style="display:block; color:#aaa; font-size:0.8rem; margin-bottom:5px;">账户户名 (Account Name)</label>
                <input type="text" id="in_support_acc_name" value="${c['cfg_support_acc_name'] || 'HARVESTER MUSIC PRODUCTION'}" placeholder="例如：HARVESTER MUSIC PRODUCTION" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:10px; border-radius:6px;">
              </div>
              <div style="margin-bottom:15px;">
                <label style="display:block; color:#aaa; font-size:0.8rem; margin-bottom:5px;">银行账号 (Account Number)</label>
                <input type="text" id="in_support_acc_no" value="${c['cfg_support_acc_no'] || '5123 4567 8901'}" placeholder="例如：5123 4567 8901" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:10px; border-radius:6px;">
              </div>
            </div>
            <div style="background:#111; padding:20px; border-radius:10px; border:1px dashed #333; text-align:center;">
              <label style="display:block; color:var(--gold); font-size:0.85rem; font-weight:bold; margin-bottom:10px;">DuitNow / 收款二维码图片</label>
              <img id="prev_support_qr" src="${c['cfg_support_qr'] || 'assets/logo.png'}" style="width:160px; height:160px; object-fit:contain; background:#fff; border-radius:8px; padding:6px; margin-bottom:10px; border:1px solid #444;">
              <input type="file" id="f_support_qr" style="font-size:0.8rem; color:#aaa; width:100%; margin-bottom:8px;">
              <button class="btn-tiny" style="width:100%;" onclick="uploadFile('f_support_qr', 'in_support_qr', 'prev_support_qr')">📤 上传新二维码图片</button>
              <input type="hidden" id="in_support_qr" value="${c['cfg_support_qr'] || ''}">
            </div>
          </div>
        </div>

        <!-- 2. 插画图与致谢说明 -->
        <div class="cms-card" style="border-left: 4px solid #64D28A;">
          <h3 style="color:#64D28A; margin-top:0; display:flex; align-items:center; gap:8px;">
            <span>🎨</span> 左侧插画图与奉献寄语说明
          </h3>
          <div style="display:grid; grid-template-columns: 1.2fr 1fr; gap:25px; margin-top:15px;">
            <div>
              <div style="margin-bottom:15px;">
                <label style="display:block; color:#aaa; font-size:0.8rem; margin-bottom:5px;">奉献致谢与支持说明文案</label>
                <textarea id="in_support_text" style="width:100%; height:120px; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:10px; border-radius:6px; line-height:1.6;">${c['cfg_support_text'] || '若这份音乐祝福了你，欢迎以自由奉献支持我们的创作与服事。您的每一份支持都将用于福音音乐的制作与推广。'}</textarea>
              </div>
            </div>
            <div style="background:#111; padding:20px; border-radius:10px; border:1px dashed #333; text-align:center;">
              <label style="display:block; color:#64D28A; font-size:0.85rem; font-weight:bold; margin-bottom:10px;">支持页面左侧插画/展示图 (Illustration Image)</label>
              <img id="prev_support_banner" src="${c['cfg_support_banner'] || 'assets/illustrations/qsl-support-radio.jpg'}" style="width:100%; height:130px; object-fit:cover; border-radius:6px; margin-bottom:10px; border:1px solid #222;">
              <input type="file" id="f_support_banner" style="font-size:0.8rem; color:#aaa; width:100%; margin-bottom:8px;">
              <button class="btn-tiny" style="width:100%;" onclick="uploadFile('f_support_banner', 'in_support_banner', 'prev_support_banner')">📤 上传插画图片</button>
              <input type="hidden" id="in_support_banner" value="${c['cfg_support_banner'] || ''}">
            </div>
          </div>
        </div>

        <button class="btn btn-submit" style="width:100%; padding:14px; font-size:1rem;" onclick="saveSupportCMS()">💾 立即保存支持页面设置</button>
      </div>
    `;
  }

  window.saveSupportCMS = async () => {
    const payload = [
      { key: 'cfg_support_bank', value: document.getElementById('in_support_bank').value.trim() },
      { key: 'cfg_support_acc_name', value: document.getElementById('in_support_acc_name').value.trim() },
      { key: 'cfg_support_acc_no', value: document.getElementById('in_support_acc_no').value.trim() },
      { key: 'cfg_support_qr', value: document.getElementById('in_support_qr').value.trim() },
      { key: 'cfg_support_text', value: document.getElementById('in_support_text').value.trim() },
      { key: 'cfg_support_banner', value: document.getElementById('in_support_banner').value.trim() }
    ];

    try {
      for (const item of payload) {
        await db.from('site_config').upsert(item, { onConflict: 'key' });
      }
      alert("🎉 支持我们页面设置已成功保存并实时生效！");
      renderCMS();
    } catch(err) {
      alert("保存失败: " + err.message);
    }
  };

  // --- 📮 SUBMIT CMS MODULE (我要投稿与合作方案) ---
  let currentSubmitSubTab = 'inbox';
  window.switchSubmitTab = (tab) => { currentSubmitSubTab = tab; renderSubmitCMS(document.getElementById('moduleBody')); };

  async function renderSubmitCMS(container) {
    const { data: subs } = await db.from('submissions').select('*').order('created_at', {ascending: false});
    const { data: configs } = await db.from('site_config').select('*');
    const c = (configs || []).reduce((acc, curr) => { acc[curr.key] = curr.value; return acc; }, {});

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:15px;">
        <div>
          <h1 style="color:var(--gold); margin:0;">📮 我要投稿与合作管理 (Submissions & Cooperation)</h1>
          <p style="color:#888; font-size:0.85rem; margin-top:5px;">管理粉丝与音乐人提交的原创作品投稿、投稿规则、版权分成及合作方案。</p>
        </div>
        <div style="display:flex; gap:10px;">
          <a href="submit.html" target="_blank" class="btn-tiny" style="padding:10px 16px; text-decoration:none; display:inline-flex; align-items:center; gap:6px; color:var(--gold); border-color:var(--gold);">
            <i class="fas fa-external-link-alt"></i> 预览投稿页面
          </a>
          ${currentSubmitSubTab !== 'inbox' ? `<button class="btn btn-submit" style="width:auto; padding:10px 24px;" onclick="saveSubmitPageCMS()">💾 保存投稿页面设置</button>` : ''}
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div style="display:flex; gap:10px; margin-bottom:25px; border-bottom:1px solid #222; padding-bottom:10px; flex-wrap:wrap;">
        <button onclick="switchSubmitTab('inbox')" class="btn-tiny" style="padding:10px 22px; font-size:0.9rem; font-weight:600; border-radius:30px; ${currentSubmitSubTab==='inbox' ? 'background:var(--gold); color:#000; border-color:var(--gold);' : 'background:#111; color:#888;'}">
          📥 投稿作品收件箱 (${subs?.length || 0})
        </button>
        <button onclick="switchSubmitTab('guidelines')" class="btn-tiny" style="padding:10px 22px; font-size:0.9rem; font-weight:600; border-radius:30px; ${currentSubmitSubTab==='guidelines' ? 'background:var(--gold); color:#000; border-color:var(--gold);' : 'background:#111; color:#888;'}">
          📝 投稿须知与海报
        </button>
        <button onclick="switchSubmitTab('profit')" class="btn-tiny" style="padding:10px 22px; font-size:0.9rem; font-weight:600; border-radius:30px; ${currentSubmitSubTab==='profit' ? 'background:var(--gold); color:#000; border-color:var(--gold);' : 'background:#111; color:#888;'}">
          💽 版权分成方案
        </button>
        <button onclick="switchSubmitTab('coop')" class="btn-tiny" style="padding:10px 22px; font-size:0.9rem; font-weight:600; border-radius:30px; ${currentSubmitSubTab==='coop' ? 'background:var(--gold); color:#000; border-color:var(--gold);' : 'background:#111; color:#888;'}">
          🤝 合作方案与要求
        </button>
      </div>

      ${currentSubmitSubTab === 'inbox' ? `
        <!-- 📥 作品收件箱列表 -->
        <div style="background:#0a0a0a; border-radius:12px; overflow:hidden; border:1px solid #222;">
          <table style="width:100%; text-align:left; border-collapse:collapse;">
            <thead>
              <tr style="background:#151515; color:#888; font-size:0.8rem; border-bottom:1px solid #222;">
                <th style="padding:15px;">日期</th>
                <th style="padding:15px;">投稿人</th>
                <th style="padding:15px;">联系方式</th>
                <th style="padding:15px;">歌曲与作品预览</th>
                <th style="padding:15px;">审核状态</th>
                <th style="padding:15px; text-align:right;">操作</th>
              </tr>
            </thead>
            <tbody>
              ${(subs || []).map(s => `
                <tr style="border-bottom:1px solid #1a1a1a;" onmouseover="this.style.background='#111'" onmouseout="this.style.background='transparent'">
                  <td style="padding:15px; font-size:0.8rem; color:#666;">${new Date(s.created_at).toLocaleDateString()}</td>
                  <td style="padding:15px; color:var(--gold); font-weight:600;">${s.user_name || '匿名创作者'}</td>
                  <td style="padding:15px; font-size:0.85rem; color:#aaa;">${s.user_contact || s.email || '未留'}</td>
                  <td style="padding:15px; color:#ccc; font-size:0.85rem;">
                    <div style="font-weight:bold; color: #F6F4F0; margin-bottom:4px;">${s.song_title || '未命名作品'}</div>
                    <div style="color:#777; font-size:0.75rem; max-width:280px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${s.message || s.lyrics || ''}</div>
                    ${s.audio_url ? `<audio src="${s.audio_url}" controls style="height:28px; margin-top:6px; max-width:240px;"></audio>` : ''}
                  </td>
                  <td style="padding:15px;">
                    <span style="padding:3px 8px; border-radius:4px; font-size:0.75rem; font-weight:bold; background:${s.status==='accepted'?'rgba(100,210,138,0.15)':(s.status==='rejected'?'rgba(255,100,100,0.15)':'rgba(246,210,138,0.15)')}; color:${s.status==='accepted'?'#64D28A':(s.status==='rejected'?'#ff6b81':'var(--gold)')};">
                      ${s.status ? s.status.toUpperCase() : 'PENDING'}
                    </span>
                  </td>
                  <td style="padding:15px; text-align:right; white-space:nowrap;">
                    <button class="btn-tiny" onclick="viewSub('${s.id}')" style="margin-right:6px; border-color:var(--gold); color:var(--gold);">👁️ 详情</button>
                    <button class="btn-tiny danger" onclick="deleteItem('submissions', '${s.id}')">🗑️</button>
                  </td>
                </tr>
              `).join('') || '<tr><td colspan="6" style="padding:50px; text-align:center; color:#555;">尚无粉丝投稿记录</td></tr>'}
            </tbody>
          </table>
        </div>
      ` : currentSubmitSubTab === 'guidelines' ? `
        <!-- 📝 投稿须知与海报 -->
        <div class="cms-card" style="border-left:4px solid var(--gold);">
          <h3 style="color:var(--gold); margin-top:0;">📝 投稿须知海报与征集规则设置</h3>
          <div style="display:grid; grid-template-columns: 1.2fr 1fr; gap:25px; margin-top:15px;">
            <div>
              <div style="margin-bottom:15px;">
                <label style="display:block; color:#aaa; font-size:0.8rem; margin-bottom:5px;">投稿征集规则文案 (支持 HTML 格式)</label>
                <textarea id="in_submit_text" style="width:100%; height:180px; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:10px; border-radius:6px; line-height:1.6;">${c['cfg_submit_text'] || `所有经收割机制作与发行的作品，词曲版权由收割机拥有七年。七年后归还作者。\n✦ 发行形式：所有作品将以「收割机EP」或数位单曲形式全球发行。\n✦ 创作者尊荣：发行时将在 FB / IG / YouTube 及主流流媒体标注所有创作者，给予应有尊重。\n✦ 投稿方式：填写在线投稿表单。`}</textarea>
              </div>
              <div>
                <label style="display:block; color:#aaa; font-size:0.8rem; margin-bottom:5px;">提交作品按钮跳转链接 (表单 / WhatsApp)</label>
                <input type="text" id="in_submit_btn_link" value="${c['cfg_submit_btn_link'] || 'https://wa.me/60187755581?text=Hi%20Harvester%2C%20I%20would%20like%20to%20submit%20my%20song.'}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:10px; border-radius:6px;">
              </div>
            </div>
            <div style="background:#111; padding:20px; border-radius:10px; border:1px dashed #333; text-align:center;">
              <label style="display:block; color:var(--gold); font-size:0.85rem; font-weight:bold; margin-bottom:10px;">投稿须知宣传海报 (Poster)</label>
              <img id="prev_submit_poster" src="${c['cfg_submit_poster'] || 'assets/illustrations/morandi-bird-sky.png'}" style="width:100%; max-height:220px; object-fit:cover; border-radius:8px; margin-bottom:10px; border:1px solid #222;">
              <input type="file" id="f_submit_poster" style="font-size:0.8rem; color:#aaa; width:100%; margin-bottom:8px;">
              <button class="btn-tiny" style="width:100%;" onclick="uploadFile('f_submit_poster', 'in_submit_poster', 'prev_submit_poster')">📤 上传海报图片</button>
              <input type="hidden" id="in_submit_poster" value="${c['cfg_submit_poster'] || 'assets/illustrations/morandi-bird-sky.png'}">
            </div>
          </div>
          <button class="btn btn-submit" style="width:100%; padding:14px; margin-top:20px;" onclick="saveSubmitPageCMS()">💾 立即保存投稿须知设置</button>
        </div>
      ` : currentSubmitSubTab === 'profit' ? `
        <!-- 💽 版权分成方案 -->
        <div class="cms-card" style="border-left:4px solid #64D28A;">
          <h3 style="color:#64D28A; margin-top:0;">💽 版权分成结构与流媒体收益说明</h3>
          <div style="display:grid; grid-template-columns: 1.2fr 1fr; gap:25px; margin-top:15px;">
            <div>
              <div style="margin-bottom:15px;">
                <label style="display:block; color:#aaa; font-size:0.8rem; margin-bottom:5px;">收益分配机制与结算周期说明</label>
                <textarea id="in_submit_profit_text" style="width:100%; height:150px; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:10px; border-radius:6px; line-height:1.6;">${c['cfg_submit_profit_text'] || `主要来自 YouTube、Spotify、Apple Music 及各大数字流媒体音乐平台的播放与版税收益。\n收入将在扣除平台必要成本后，按约定比例定期结算给词曲创作者与制作团队。`}</textarea>
              </div>
            </div>
            <div style="background:#111; padding:20px; border-radius:10px; border:1px dashed #333; text-align:center;">
              <label style="display:block; color:#64D28A; font-size:0.85rem; font-weight:bold; margin-bottom:10px;">分成板块配图 (Revenue Image)</label>
              <img id="prev_about_rev_img" src="${c['cfg_about_rev_img'] || 'https://images.unsplash.com/photo-1520523839898-50712509e37b?auto=format&fit=crop&w=800&q=80'}" style="width:100%; height:140px; object-fit:cover; border-radius:6px; margin-bottom:10px; border:1px solid #222;">
              <input type="file" id="f_about_rev_img" style="font-size:0.8rem; color:#aaa; width:100%; margin-bottom:8px;">
              <button class="btn-tiny" style="width:100%;" onclick="uploadFile('f_about_rev_img', 'in_about_rev_img', 'prev_about_rev_img')">📤 更换展示配图</button>
              <input type="hidden" id="in_about_rev_img" value="${c['cfg_about_rev_img'] || ''}">
            </div>
          </div>
          <button class="btn btn-submit" style="width:100%; padding:14px; margin-top:20px;" onclick="saveSubmitPageCMS()">💾 立即保存分成设置</button>
        </div>
      ` : `
        <!-- 🤝 合作方案与要求 -->
        <div class="cms-card" style="border-left:4px solid #1877F2;">
          <h3 style="color:#1877F2; margin-top:0;">🤝 合作方案与事工对接设置</h3>
          <div style="margin-top:15px;">
            <label style="display:block; color:#aaa; font-size:0.8rem; margin-bottom:5px;">合作方案与要求说明文案</label>
            <textarea id="in_submit_coop_text" style="width:100%; height:160px; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:10px; border-radius:6px; line-height:1.6;">${c['cfg_submit_coop_text'] || `收割机欢迎教会、音乐人及敬拜团队展开深度合作，包括全案单曲制作、敬拜特会主领邀约、歌曲重新编曲与海外巡回宣教支持。`}</textarea>
          </div>
          <button class="btn btn-submit" style="width:100%; padding:14px; margin-top:20px;" onclick="saveSubmitPageCMS()">💾 立即保存合作方案设置</button>
        </div>
      `}
    `;
  }

  window.saveSubmitPageCMS = async () => {
    const payload = [];
    const tEl = document.getElementById('in_submit_text');
    const pEl = document.getElementById('in_submit_poster');
    const lEl = document.getElementById('in_submit_btn_link');
    const prEl = document.getElementById('in_submit_profit_text');
    const revImgEl = document.getElementById('in_about_rev_img');
    const coopEl = document.getElementById('in_submit_coop_text');

    if (tEl) payload.push({ key: 'cfg_submit_text', value: tEl.value.trim() });
    if (pEl) payload.push({ key: 'cfg_submit_poster', value: pEl.value.trim() });
    if (lEl) payload.push({ key: 'cfg_submit_btn_link', value: lEl.value.trim() });
    if (prEl) payload.push({ key: 'cfg_submit_profit_text', value: prEl.value.trim() });
    if (revImgEl) payload.push({ key: 'cfg_about_rev_img', value: revImgEl.value.trim() });
    if (coopEl) payload.push({ key: 'cfg_submit_coop_text', value: coopEl.value.trim() });

    try {
      for (const item of payload) {
        await db.from('site_config').upsert(item, { onConflict: 'key' });
      }
      alert("🎉 我要投稿页面设置已成功保存！");
      renderCMS();
    } catch(err) {
      alert("保存失败: " + err.message);
    }
  };

  // --- 🌌 CONTACT & ECHO SPACE CMS MODULE (联系我们与回声空间) ---
  let currentContactSubTab = 'inbox';
  window.switchContactTab = (tab) => { currentContactSubTab = tab; renderContactCMS(document.getElementById('moduleBody')); };

  async function renderContactCMS(container) {
    const { data: contacts } = await db.from('contact_messages').select('*').order('created_at', {ascending: false});
    const { data: cfg } = await db.from('site_config').select('value').eq('key', 'cfg_approved_echo_ids').maybeSingle();
    const approvedIds = cfg?.value ? cfg.value.split(',').filter(Boolean) : [];

    const { data: configs } = await db.from('site_config').select('*');
    const c = (configs || []).reduce((acc, curr) => { acc[curr.key] = curr.value; return acc; }, {});

    const echoMessages = (contacts || []).filter(c => c.message?.includes('[ECHO]'));
    const regularInquiries = (contacts || []).filter(c => !c.message?.includes('[ECHO]'));

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:15px;">
        <div>
          <h1 style="color:var(--gold); margin:0;">🌌 联系我们与回声空间管理 (Contact & Echo Space)</h1>
          <p style="color:#888; font-size:0.85rem; margin-top:5px;">管理来自官方联系表单的合作留言、3D 回声空间星空留言审核与官方联系方式。</p>
        </div>
        <div style="display:flex; gap:10px;">
          <a href="contact.html" target="_blank" class="btn-tiny" style="padding:10px 16px; text-decoration:none; display:inline-flex; align-items:center; gap:6px; color:var(--gold); border-color:var(--gold);">
            <i class="fas fa-external-link-alt"></i> 预览联系与回声页
          </a>
          ${currentContactSubTab === 'info' ? `<button class="btn btn-submit" style="width:auto; padding:10px 24px;" onclick="saveContactInfoCMS()">💾 保存官方联络信息</button>` : ''}
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div style="display:flex; gap:10px; margin-bottom:25px; border-bottom:1px solid #222; padding-bottom:10px; flex-wrap:wrap;">
        <button onclick="switchContactTab('inbox')" class="btn-tiny" style="padding:10px 22px; font-size:0.9rem; font-weight:600; border-radius:30px; ${currentContactSubTab==='inbox' ? 'background:var(--gold); color:#000; border-color:var(--gold);' : 'background:#111; color:#888;'}">
          📬 官方咨询信箱 (${regularInquiries.length})
        </button>
        <button onclick="switchContactTab('echo')" class="btn-tiny" style="padding:10px 22px; font-size:0.9rem; font-weight:600; border-radius:30px; ${currentContactSubTab==='echo' ? 'background:var(--gold); color:#000; border-color:var(--gold);' : 'background:#111; color:#888;'}">
          ✨ 3D 回声空间星空审核 (${echoMessages.length})
        </button>
        <button onclick="switchContactTab('info')" class="btn-tiny" style="padding:10px 22px; font-size:0.9rem; font-weight:600; border-radius:30px; ${currentContactSubTab==='info' ? 'background:var(--gold); color:#000; border-color:var(--gold);' : 'background:#111; color:#888;'}">
          📞 官方联系方式配置
        </button>
      </div>

      ${currentContactSubTab === 'inbox' ? `
        <!-- 📬 官方咨询信箱 -->
        <div style="background:#0a0a0a; border-radius:12px; overflow:hidden; border:1px solid #222;">
          <table style="width:100%; text-align:left; border-collapse:collapse;">
            <thead>
              <tr style="background:#151515; color:#888; font-size:0.8rem; border-bottom:1px solid #222;">
                <th style="padding:15px;">日期</th>
                <th style="padding:15px;">发信人</th>
                <th style="padding:15px;">邮箱 / 联系方式</th>
                <th style="padding:15px;">咨询内容</th>
                <th style="padding:15px; text-align:right;">操作</th>
              </tr>
            </thead>
            <tbody>
              ${regularInquiries.map(c => `
                <tr style="border-bottom:1px solid #1a1a1a;" onmouseover="this.style.background='#111'" onmouseout="this.style.background='transparent'">
                  <td style="padding:15px; font-size:0.8rem; color:#666;">${new Date(c.created_at).toLocaleDateString()}</td>
                  <td style="padding:15px; color:var(--gold); font-weight:600;">${c.name || '访客'}</td>
                  <td style="padding:15px;">
                    ${c.email ? `<a href="mailto:${c.email}?subject=【Harvester 收割机音乐】关于合作咨询回复" target="_blank" style="color:#70a1ff; text-decoration:none; font-size:0.85rem;"><i class="fas fa-envelope"></i> ${c.email}</a>` : '<span style="color:#555;">无邮箱</span>'}
                  </td>
                  <td style="padding:15px; color:#ccc; font-size:0.85rem; max-width:400px; line-height:1.5;">${c.message || ''}</td>
                  <td style="padding:15px; text-align:right; white-space:nowrap;">
                    <button class="btn-tiny" onclick="viewContact('${c.id}')" style="margin-right:5px; color:var(--gold); border-color:var(--gold);">查看</button>
                    <button class="btn-tiny danger" onclick="deleteItem('contact_messages', '${c.id}')">🗑️ 删除</button>
                  </td>
                </tr>
              `).join('') || '<tr><td colspan="5" style="padding:50px; text-align:center; color:#555;">暂无官方咨询信件</td></tr>'}
            </tbody>
          </table>
        </div>
      ` : currentContactSubTab === 'echo' ? `
        <!-- ✨ 3D 回声空间星空审核 -->
        <div style="background:#0a0a0a; border-radius:12px; overflow:hidden; border:1px solid #222;">
          <table style="width:100%; text-align:left; border-collapse:collapse;">
            <thead>
              <tr style="background:#151515; color:#888; font-size:0.8rem; border-bottom:1px solid #222;">
                <th style="padding:15px;">提交日期</th>
                <th style="padding:15px;">听众昵称</th>
                <th style="padding:15px;">回声寄语内容</th>
                <th style="padding:15px;">星空展示状态</th>
                <th style="padding:15px; text-align:right;">审核操作</th>
              </tr>
            </thead>
            <tbody>
              ${echoMessages.map(c => {
                const isApproved = approvedIds.includes(String(c.id));
                const cleanMsg = c.message.replace('[ECHO]', '').trim();
                return `
                  <tr style="border-bottom:1px solid #1a1a1a;" onmouseover="this.style.background='#111'" onmouseout="this.style.background='transparent'">
                    <td style="padding:15px; font-size:0.8rem; color:#666;">${new Date(c.created_at).toLocaleDateString()}</td>
                    <td style="padding:15px; color:var(--gold); font-weight:600;">${c.name || '匿名听众'}</td>
                    <td style="padding:15px; color:#eee; font-size:0.9rem; max-width:450px; line-height:1.6;">${cleanMsg}</td>
                    <td style="padding:15px;">
                      <span style="padding:4px 10px; border-radius:20px; font-size:0.75rem; font-weight:bold; background:${isApproved ? 'rgba(100,210,138,0.15)' : 'rgba(255,255,255,0.05)'}; color:${isApproved ? '#64D28A' : '#666'}; border:1px solid ${isApproved ? 'rgba(100,210,138,0.3)' : 'rgba(255,255,255,0.1)'};">
                        ${isApproved ? '✨ 星空漂浮展示中' : '🚫 审核隐藏中'}
                      </span>
                    </td>
                    <td style="padding:15px; text-align:right; white-space:nowrap;">
                      <button class="btn-tiny" style="margin-right:6px; border-color:${isApproved ? '#888' : 'var(--gold)'}; color:${isApproved ? '#aaa' : 'var(--gold)'};" onclick="toggleEchoApproval('${c.id}', ${isApproved})">
                        ${isApproved ? '取消展示' : '🌟 批准在星空显示'}
                      </button>
                      <button class="btn-tiny danger" onclick="deleteItem('contact_messages', '${c.id}')">🗑️</button>
                    </td>
                  </tr>
                `;
              }).join('') || '<tr><td colspan="5" style="padding:50px; text-align:center; color:#555;">暂无回声空间留言</td></tr>'}
            </tbody>
          </table>
        </div>
      ` : `
        <!-- 📞 官方联系方式配置 -->
        <div class="cms-card" style="border-left:4px solid var(--gold);">
          <h3 style="color:var(--gold); margin-top:0;">📞 官方联络与客服配置</h3>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-top:15px;">
            <div>
              <label style="display:block; color:#aaa; font-size:0.8rem; margin-bottom:5px;">官方联络 Email</label>
              <input type="text" id="in_official_email" value="${c['cfg_official_email'] || 'harvestermusicproduction@gmail.com'}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:10px; border-radius:6px;">
            </div>
            <div>
              <label style="display:block; color:#aaa; font-size:0.8rem; margin-bottom:5px;">官方客服 WhatsApp 号码 / 链接</label>
              <input type="text" id="in_official_wa" value="${c['cfg_nav_wa'] || 'https://wa.me/60187755581'}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:10px; border-radius:6px;">
            </div>
            <div style="grid-column: 1/-1;">
              <label style="display:block; color:#aaa; font-size:0.8rem; margin-bottom:5px;">办公/事工联络地址 (可选)</label>
              <input type="text" id="in_official_addr" value="${c['cfg_official_addr'] || 'Kuala Lumpur, Malaysia'}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:10px; border-radius:6px;">
            </div>
          </div>
          <button class="btn btn-submit" style="width:100%; padding:14px; margin-top:25px;" onclick="saveContactInfoCMS()">💾 立即保存官方联络信息</button>
        </div>

        <!-- 📲 官网新留言 WhatsApp 自动提醒推送配置 -->
        <div class="cms-card" style="border-left:4px solid #25D366; margin-top:25px;">
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px;">
            <h3 style="color:#25D366; margin:0;"><i class="fab fa-whatsapp"></i> 官网新留言 WhatsApp 自动提醒推送 (CallMeBot API)</h3>
            <span style="font-size:0.75rem; background:rgba(37,211,102,0.15); color:#25D366; padding:3px 10px; border-radius:20px; border:1px solid rgba(37,211,102,0.3);">全自动静默推送</span>
          </div>
          <p style="color:#aaa; font-size:0.85rem; line-height:1.6; margin:10px 0 15px;">
            当访客在官网提交联系表单时，系统将通过 CallMeBot 自动在后台向您的 WhatsApp 发送一条新留言通知消息。
          </p>

          <div style="background:#111; border:1px dashed #333; border-radius:8px; padding:14px 18px; margin-bottom:18px; font-size:0.85rem; color:#bbb; line-height:1.8;">
            <strong style="color:var(--gold); font-size:0.92rem;">🔑 获取免费 CallMeBot API Key（最新有效方式）：</strong><br>
            1. 点击此官方链接直接打开 WhatsApp 对话：<a href="https://wa.me/34644992698?text=I%20allow%20callmebot%20to%20send%20me%20messages" target="_blank" style="color:#25D366; text-decoration:underline; font-weight:bold;">👉 点击这里给机器人发送激活消息 (+34 644 99 26 98)</a><br>
            2. 发送预填消息：<code style="color:#F6F4F0; background:#222; padding:2px 6px; border-radius:3px;">I allow callmebot to send me messages</code><br>
            3. 等待机器人回复您的专属 <strong>API Key</strong>（例如：123456），将该数字填入下方保存即可！
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
            <div>
              <label style="display:block; color:#aaa; font-size:0.8rem; margin-bottom:5px;">接收提醒的 WhatsApp 号码（包含国家区号，如 +60187755581）</label>
              <input type="text" id="in_notify_wa_phone" value="${c['cfg_notify_wa_phone'] || '+60187755581'}" placeholder="+60187755581" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:10px; border-radius:6px;">
            </div>
            <div>
              <label style="display:block; color:#aaa; font-size:0.8rem; margin-bottom:5px;">CallMeBot WhatsApp API Key (若暂未开通可先留空)</label>
              <input type="text" id="in_notify_wa_apikey" value="${c['cfg_notify_wa_apikey'] || ''}" placeholder="例如：123456" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:10px; border-radius:6px;">
            </div>
          </div>

          <div style="display:flex; gap:12px; margin-top:20px; flex-wrap:wrap;">
            <button class="btn btn-submit" style="flex:1; min-width:200px; padding:12px; background:linear-gradient(135deg, #25D366 0%, #128C7E 100%);" onclick="saveNotifyWACMS()">💾 保存 WhatsApp 推送配置</button>
            <button class="btn btn-tiny" style="padding:12px 20px; border-color:#25D366; color:#25D366; background:rgba(37,211,102,0.1);" onclick="testNotifyWA()">📲 发送测试提醒到我手机</button>
          </div>
        </div>
      `}
    `;
  }

  window.saveContactInfoCMS = async () => {
    const payload = [
      { key: 'cfg_official_email', value: document.getElementById('in_official_email').value.trim() },
      { key: 'cfg_nav_wa', value: document.getElementById('in_official_wa').value.trim() },
      { key: 'cfg_official_addr', value: document.getElementById('in_official_addr').value.trim() }
    ];
    try {
      for (const item of payload) {
        await db.from('site_config').upsert(item, { onConflict: 'key' });
      }
      alert("🎉 官方联络信息已成功保存！");
      renderCMS();
    } catch(err) {
      alert("保存失败: " + err.message);
    }
  };

  window.saveNotifyWACMS = async () => {
    const payload = [
      { key: 'cfg_notify_wa_phone', value: document.getElementById('in_notify_wa_phone').value.trim() },
      { key: 'cfg_notify_wa_apikey', value: document.getElementById('in_notify_wa_apikey').value.trim() }
    ];
    try {
      for (const item of payload) {
        await db.from('site_config').upsert(item, { onConflict: 'key' });
      }
      alert("🎉 WhatsApp 提醒推送配置已成功保存！");
      renderCMS();
    } catch(err) {
      alert("保存失败: " + err.message);
    }
  };

  window.testNotifyWA = async () => {
    const phone = (document.getElementById('in_notify_wa_phone')?.value || '+60187755581').replace(/[^0-9+]/g, '');
    const apiKey = document.getElementById('in_notify_wa_apikey')?.value?.trim();

    if (!apiKey) {
      alert("⚠️ 请先填写您的 CallMeBot API Key 后再进行测试！\n\n获取方式：用 WhatsApp 发送「I allow callmebot to send me messages」至 +34 644 99 26 98 获取 Key。");
      return;
    }

    const testMsg = `🔔【Harvester 官网测试提醒】\n这是一条来自收割机音乐后台的 WhatsApp 自动推送测试消息！\n\n发送时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Kuala_Lumpur' })}`;
    const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(testMsg)}&apikey=${encodeURIComponent(apiKey)}`;

    try {
      const beacon = new Image();
      beacon.src = url;
      alert("🚀 测试消息请求已发出！请检查您的 WhatsApp 是否收到来自 CallMeBot 的测试提醒。");
    } catch(err) {
      alert("发送测试请求失败: " + err.message);
    }
  };

  window.toggleContactStatus = async (id, isReplied) => {
    try {
      const newStatus = isReplied ? 'replied' : 'pending';
      const { error } = await db.from('contact_messages').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      renderCMS();
    } catch(err) {
      alert("更新状态失败: " + err.message);
    }
  };

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
    const isProcessed = c.status === 'replied' || c.status === 'processed' || c.status === 'reviewed' || c.status === 'done';
    const modal = document.createElement('div');
    modal.id = 'contactDetailModal';
    modal.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:9999; display:flex; justify-content:center; align-items:center; backdrop-filter:blur(8px); padding:20px;";
    modal.innerHTML = `
      <div style="background:#111; border:1px solid var(--gold); border-radius:16px; padding:2.2rem; width:100%; max-width:620px; box-shadow:0 20px 60px rgba(0,0,0,0.9);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; border-bottom:1px solid #222; padding-bottom:1rem;">
          <h3 style="color:var(--gold); margin:0; font-size:1.3rem; display:flex; align-items:center; gap:8px;">
            <span>📬</span> 合作咨询与联系留言详情
          </h3>
          <span style="font-size:0.75rem; color:#888;">${new Date(c.created_at).toLocaleString()}</span>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin-bottom:1.2rem; background:#161616; padding:15px; border-radius:10px; border:1px solid #282828;">
          <div>
            <label style="font-size:0.75rem; color:#888; display:block;">咨询人称呼</label>
            <div style="color:var(--gold); font-weight:bold; font-size:1.1rem; margin-top:2px;">${c.name || '未填写'}</div>
          </div>
          <div>
            <label style="font-size:0.75rem; color:#888; display:block;">联络邮箱</label>
            <div style="color: #F6F4F0; margin-top:2px; font-size:0.95rem;">
              ${c.email ? `<a href="mailto:${c.email}?subject=【Harvester 收割机音乐】关于合作咨询回复" target="_blank" style="color:#70a1ff; text-decoration:none;"><i class="fas fa-paper-plane"></i> ${c.email}</a>` : '未填写'}
            </div>
          </div>
        </div>

        <div style="margin-bottom:1.5rem;">
          <label style="font-size:0.75rem; color:#888; display:block; margin-bottom:6px;">留言内容 / 合作意向</label>
          <div style="background:#0a0a0a; border:1px solid #222; border-radius:10px; padding:15px; max-height:220px; overflow-y:auto; color:#eee; font-size:0.95rem; line-height:1.7; white-space:pre-wrap;">${c.message || ''}</div>
        </div>

        <!-- Processed / Replied Checkbox Control -->
        <div style="background:rgba(246,210,138,0.06); border:1px solid rgba(246,210,138,0.25); border-radius:10px; padding:14px 18px; margin-bottom:1.5rem; display:flex; align-items:center; justify-content:space-between;">
          <div>
            <div style="color:var(--gold); font-weight:bold; font-size:0.9rem;">回复/处理状态标记</div>
            <div style="color:#888; font-size:0.75rem;">勾选以标记此条信息是否已与对方回复/跟进处理</div>
          </div>
          <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-size:0.95rem; color:${isProcessed ? '#64D28A' : '#ffa502'}; font-weight:bold;">
            <input type="checkbox" id="modalContactCheck" ${isProcessed ? 'checked' : ''} style="width:18px; height:18px; cursor:pointer; accent-color:#64D28A;" onchange="toggleContactStatus('${c.id}', this.checked)">
            <span>${isProcessed ? '✅ 已回复/已处理' : '⏳ 待回复/待处理'}</span>
          </label>
        </div>

        <div style="display:flex; gap:12px; justify-content:flex-end;">
          ${c.email ? `<a href="mailto:${c.email}?subject=【Harvester 收割机音乐】关于合作咨询回复" target="_blank" class="btn-tiny" style="padding:10px 18px; background:rgba(112,161,255,0.15); color:#70a1ff; border-color:#70a1ff; text-decoration:none; display:inline-flex; align-items:center; gap:6px;"><i class="fas fa-reply"></i> 发送邮件回复</a>` : ''}
          <button class="btn btn-submit" style="width:auto; padding:10px 24px;" onclick="this.closest('#contactDetailModal').remove()">完成并关闭</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
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

  // --- 📖 ABOUT US CMS MODULE ---
  async function renderAboutCMS(container) {
    const { data: configs } = await db.from('site_config').select('*');
    const c = (configs || []).reduce((acc, curr) => { acc[curr.key] = curr.value; return acc; }, {});

    let aboutData = {};
    if (c['cfg_about_content_json']) {
      try {
        aboutData = typeof c['cfg_about_content_json'] === 'string' ? JSON.parse(c['cfg_about_content_json']) : c['cfg_about_content_json'];
      } catch(e) { console.warn("Parse error:", e); }
    }

    const d = (key, fallback = '') => {
      return (aboutData && aboutData[key] !== undefined && aboutData[key] !== null) ? aboutData[key] : fallback;
    };

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem; flex-wrap:wrap; gap:15px;">
        <div>
          <h1 style="color:var(--gold); margin:0;">📖 关于我们 动态内容管理 (About Us CMS)</h1>
          <p style="color:#888; font-size:0.9rem; margin-top:5px;">
            在此可视化编辑“关于我们”页面的每一个板块文字、双语文案与配图。保存后前台立即实时生效。
          </p>
        </div>
        <div style="display:flex; gap:10px;">
          <a href="about.html" target="_blank" class="btn-tiny" style="padding:10px 16px; text-decoration:none; display:inline-flex; align-items:center; gap:6px; color:var(--gold); border-color:var(--gold);">
            <i class="fas fa-external-link-alt"></i> 前往预览页面
          </a>
          <button class="btn btn-submit" style="width:auto; padding:10px 24px;" onclick="saveAboutCMS()">💾 保存所有图文修改</button>
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:2.5rem; max-width:1100px;">

        <!-- 🌾 板块 1: 名字的由来 (NAME ORIGIN) -->
        <div class="cms-card" style="border-left: 4px solid var(--gold);">
          <h3 style="color:var(--gold); margin-top:0; display:flex; align-items:center; gap:8px;">
            <span>🌾</span> 板块一：名字的由来 (Name Origin)
          </h3>
          <p style="font-size:0.8rem; color:#888; margin-bottom:1.5rem;">对应前台顶部“收割机的故事”与约翰福音 4:37 经文启发。</p>
          
          <div style="display:grid; grid-template-columns: 1.2fr 1fr; gap:25px;">
            <div>
              <div style="margin-bottom:15px;">
                <label style="display:block; color:#aaa; font-size:0.8rem; margin-bottom:5px;">主标题 (Main Title)</label>
                <input type="text" id="in_about_origin_main_title" value="${d('about_origin_main_title', '收 割 机 的 故 事')}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:10px; border-radius:6px;">
              </div>

              <div style="margin-bottom:15px;">
                <label style="display:block; color:#aaa; font-size:0.8rem; margin-bottom:5px;">启发经文 中文 (Scripture CN)</label>
                <textarea id="in_about_origin_scripture" style="width:100%; height:65px; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:10px; border-radius:6px;">${d('about_origin_scripture', '「那人撒种，这人收割，这话可见是真的。」')}</textarea>
              </div>

              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin-bottom:15px;">
                <div>
                  <label style="display:block; color:#aaa; font-size:0.8rem; margin-bottom:5px;">经文出处 (Reference)</label>
                  <input type="text" id="in_about_origin_ref" value="${d('about_origin_ref', '—— 约翰福音 4:37 · John 4:37')}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:10px; border-radius:6px;">
                </div>
                <div>
                  <label style="display:block; color:#aaa; font-size:0.8rem; margin-bottom:5px;">启发经文 英文 (Scripture EN)</label>
                  <input type="text" id="in_about_origin_scripture_en" value="${d('about_origin_scripture_en', 'One sows and another reaps. This saying is true.')}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:10px; border-radius:6px;">
                </div>
              </div>

              <div style="margin-bottom:15px;">
                <label style="display:block; color:#aaa; font-size:0.8rem; margin-bottom:5px;">名字意义 中文 (Meaning CN)</label>
                <textarea id="in_about_origin_meaning" style="width:100%; height:75px; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:10px; border-radius:6px;">${d('about_origin_meaning', '以“收割机”命名，象征着神国的丰收。\n音乐作品如同撒下的种子，触动人心，在神的时间里结出果实。')}</textarea>
              </div>

              <div>
                <label style="display:block; color:#aaa; font-size:0.8rem; margin-bottom:5px;">名字意义 英文 (Meaning EN)</label>
                <textarea id="in_about_origin_meaning_en" style="width:100%; height:65px; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:10px; border-radius:6px;">${d('about_origin_meaning_en', 'The name \'Harvester\' symbolizes the abundant harvest in God\'s kingdom. Music is like a seed that touches hearts and bears fruit in God\'s timing.')}</textarea>
              </div>
            </div>

            <!-- 配图展示 -->
            <div style="background:#111; padding:20px; border-radius:10px; border:1px dashed #333; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center;">
              <label style="display:block; color:var(--gold); font-size:0.85rem; font-weight:bold; margin-bottom:10px;">名字由来展示配图 (麦田涂鸦手绘插画)</label>
              <img id="prev_about_origin_img" src="${d('about_origin_img', 'assets/illustrations/doodle-harvest-story.jpg')}" style="width:100%; max-height:220px; object-fit:cover; border-radius:8px; margin-bottom:12px; border:1px solid #222;">
              <input type="file" id="f_about_origin_img" style="font-size:0.8rem; width:100%; margin-bottom:8px;">
              <button class="btn-tiny" style="width:100%;" onclick="uploadFile('f_about_origin_img', 'in_about_origin_img', 'prev_about_origin_img')">📤 上传并更换配图</button>
              <input type="hidden" id="in_about_origin_img" value="${d('about_origin_img', 'assets/illustrations/doodle-harvest-story.jpg')}">
            </div>
          </div>
        </div>

        <!-- 🕊️ 板块 2: 愿景与使命 (VISION & MISSION) -->
        <div class="cms-card" style="border-left: 4px solid #64D28A;">
          <h3 style="color:#64D28A; margin-top:0; display:flex; align-items:center; gap:8px;">
            <span>🕊️</span> 板块二：愿景与使命 (Vision & Mission)
          </h3>
          <p style="font-size:0.8rem; color:#888; margin-bottom:1.5rem;">双翼卡片展示，包含双语愿景与使命核心宣告。</p>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:25px;">
            <!-- 愿景 (Vision) -->
            <div style="background:#111; padding:20px; border-radius:10px; border:1px solid #222;">
              <h4 style="color:var(--gold); margin-top:0; margin-bottom:15px;">🌟 愿景 (Vision)</h4>
              <div style="margin-bottom:12px;">
                <label style="display:block; color:#aaa; font-size:0.75rem; margin-bottom:4px;">愿景标题</label>
                <input type="text" id="in_about_vision_title" value="${d('about_vision_title', '愿 景')}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">
              </div>
              <div style="margin-bottom:12px;">
                <label style="display:block; color:#aaa; font-size:0.75rem; margin-bottom:4px;">愿景要点 1 (中文)</label>
                <textarea id="in_about_vision_1" style="width:100%; height:50px; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">${d('about_vision_1', '推动现代流行基督教音乐的推广与发展')}</textarea>
              </div>
              <div style="margin-bottom:12px;">
                <label style="display:block; color:#aaa; font-size:0.75rem; margin-bottom:4px;">愿景要点 1 (英文)</label>
                <input type="text" id="in_about_vision_1_en" value="${d('about_vision_1_en', 'To promote and develop modern contemporary Christian music')}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">
              </div>
              <div style="margin-bottom:12px;">
                <label style="display:block; color:#aaa; font-size:0.75rem; margin-bottom:4px;">愿景要点 2 (中文)</label>
                <textarea id="in_about_vision_2" style="width:100%; height:50px; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">${d('about_vision_2', '同心合一，为神国度收割灵魂，透过音乐传扬福音')}</textarea>
              </div>
              <div>
                <label style="display:block; color:#aaa; font-size:0.75rem; margin-bottom:4px;">愿景要点 2 (英文)</label>
                <input type="text" id="in_about_vision_2_en" value="${d('about_vision_2_en', 'United as one, harvesting souls for God\'s kingdom through the power of music')}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">
              </div>
            </div>

            <!-- 使命 (Mission) -->
            <div style="background:#111; padding:20px; border-radius:10px; border:1px solid #222;">
              <h4 style="color:#64D28A; margin-top:0; margin-bottom:15px;">🎯 使命 (Mission)</h4>
              <div style="margin-bottom:12px;">
                <label style="display:block; color:#aaa; font-size:0.75rem; margin-bottom:4px;">使命标题</label>
                <input type="text" id="in_about_mission_title" value="${d('about_mission_title', '使 命')}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">
              </div>
              <div style="margin-bottom:12px;">
                <label style="display:block; color:#aaa; font-size:0.75rem; margin-bottom:4px;">使命要点 1 (中文)</label>
                <textarea id="in_about_mission_1" style="width:100%; height:50px; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">${d('about_mission_1', '为主兴起这世代的中文诗歌词曲创作人和音乐人')}</textarea>
              </div>
              <div style="margin-bottom:12px;">
                <label style="display:block; color:#aaa; font-size:0.75rem; margin-bottom:4px;">使命要点 1 (英文)</label>
                <input type="text" id="in_about_mission_1_en" value="${d('about_mission_1_en', 'To raise up the songwriters and musicians of this generation for the Lord through Chinese poetry and song creation')}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">
              </div>
              <div style="margin-bottom:12px;">
                <label style="display:block; color:#aaa; font-size:0.75rem; margin-bottom:4px;">使命要点 2 (中文)</label>
                <textarea id="in_about_mission_2" style="width:100%; height:50px; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">${d('about_mission_2', '通过创作歌曲引导人认识神，并传播真理、信望与爱')}</textarea>
              </div>
              <div>
                <label style="display:block; color:#aaa; font-size:0.75rem; margin-bottom:4px;">使命要点 2 (英文)</label>
                <input type="text" id="in_about_mission_2_en" value="${d('about_mission_2_en', 'To guide people to know God through song creation and spread truth, faith, hope, and love')}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">
              </div>
            </div>
          </div>
        </div>

        <!-- 🏛️ 板块 3: 使命四大支柱 (4 MISSION PILLARS) -->
        <div class="cms-card" style="border-left: 4px solid #70a1ff;">
          <h3 style="color:#70a1ff; margin-top:0; display:flex; align-items:center; gap:8px;">
            <span>🏛️</span> 板块三：使命四大支柱 (Four Mission Pillars)
          </h3>
          <p style="font-size:0.8rem; color:#888; margin-bottom:1.5rem;">01 推动诗歌创作 / 02 提供服事平台 / 03 建立版权制度 / 04 传承培育下一代</p>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
            <!-- Pillar 1 -->
            <div style="background:#111; padding:18px; border-radius:10px; border:1px solid #222;">
              <span style="font-weight:bold; color:var(--gold); font-size:0.8rem;">支柱 01</span>
              <div style="margin:10px 0 8px;">
                <label style="font-size:0.75rem; color:#aaa;">中文标题</label>
                <input type="text" id="in_about_p1_t" value="${d('about_p1_t', '推动诗歌创作')}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">
              </div>
              <div style="margin-bottom:8px;">
                <label style="font-size:0.75rem; color:#aaa;">英文标题</label>
                <input type="text" id="in_about_p1_te" value="${d('about_p1_te', 'Promoting Songwriting')}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">
              </div>
              <div style="margin-bottom:8px;">
                <label style="font-size:0.75rem; color:#aaa;">中文说明</label>
                <textarea id="in_about_p1_d" style="width:100%; height:50px; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">${d('about_p1_d', '鼓励并支持创作能够传递信仰的诗歌与歌曲。')}</textarea>
              </div>
              <div>
                <label style="font-size:0.75rem; color:#aaa;">英文说明</label>
                <textarea id="in_about_p1_de" style="width:100%; height:50px; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">${d('about_p1_de', 'Encourage and support the creation of songs and hymns that communicate faith.')}</textarea>
              </div>
            </div>

            <!-- Pillar 2 -->
            <div style="background:#111; padding:18px; border-radius:10px; border:1px solid #222;">
              <span style="font-weight:bold; color:var(--gold); font-size:0.8rem;">支柱 02</span>
              <div style="margin:10px 0 8px;">
                <label style="font-size:0.75rem; color:#aaa;">中文标题</label>
                <input type="text" id="in_about_p2_t" value="${d('about_p2_t', '提供服事平台')}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">
              </div>
              <div style="margin-bottom:8px;">
                <label style="font-size:0.75rem; color:#aaa;">英文标题</label>
                <input type="text" id="in_about_p2_te" value="${d('about_p2_te', 'Providing a Service Platform')}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">
              </div>
              <div style="margin-bottom:8px;">
                <label style="font-size:0.75rem; color:#aaa;">中文说明</label>
                <textarea id="in_about_p2_d" style="width:100%; height:50px; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">${d('about_p2_d', '创建一个平台，让音乐人能够分享、服事，达到共赢。')}</textarea>
              </div>
              <div>
                <label style="font-size:0.75rem; color:#aaa;">英文说明</label>
                <textarea id="in_about_p2_de" style="width:100%; height:50px; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">${d('about_p2_de', 'Create a platform where musicians can share and serve, achieving a win-win situation.')}</textarea>
              </div>
            </div>

            <!-- Pillar 3 -->
            <div style="background:#111; padding:18px; border-radius:10px; border:1px solid #222;">
              <span style="font-weight:bold; color:var(--gold); font-size:0.8rem;">支柱 03</span>
              <div style="margin:10px 0 8px;">
                <label style="font-size:0.75rem; color:#aaa;">中文标题</label>
                <input type="text" id="in_about_p3_t" value="${d('about_p3_t', '建立版权制度')}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">
              </div>
              <div style="margin-bottom:8px;">
                <label style="font-size:0.75rem; color:#aaa;">英文标题</label>
                <input type="text" id="in_about_p3_te" value="${d('about_p3_te', 'Establishing a Copyright System')}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">
              </div>
              <div style="margin-bottom:8px;">
                <label style="font-size:0.75rem; color:#aaa;">中文说明</label>
                <textarea id="in_about_p3_d" style="width:100%; height:50px; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">${d('about_p3_d', '保护创作人的版权，确保每首歌曲在法律框架下得到保障。')}</textarea>
              </div>
              <div>
                <label style="font-size:0.75rem; color:#aaa;">英文说明</label>
                <textarea id="in_about_p3_de" style="width:100%; height:50px; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">${d('about_p3_de', 'Protect creators\' copyrights and ensure that each song is legally protected.')}</textarea>
              </div>
            </div>

            <!-- Pillar 4 -->
            <div style="background:#111; padding:18px; border-radius:10px; border:1px solid #222;">
              <span style="font-weight:bold; color:var(--gold); font-size:0.8rem;">支柱 04</span>
              <div style="margin:10px 0 8px;">
                <label style="font-size:0.75rem; color:#aaa;">中文标题</label>
                <input type="text" id="in_about_p4_t" value="${d('about_p4_t', '传承培育下一代')}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">
              </div>
              <div style="margin-bottom:8px;">
                <label style="font-size:0.75rem; color:#aaa;">英文标题</label>
                <input type="text" id="in_about_p4_te" value="${d('about_p4_te', 'Passing on and Cultivating the Next Generation')}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">
              </div>
              <div style="margin-bottom:8px;">
                <label style="font-size:0.75rem; color:#aaa;">中文说明</label>
                <textarea id="in_about_p4_d" style="width:100%; height:50px; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">${d('about_p4_d', '培养下一代音乐人才，为神的事业贡献创意与才华。')}</textarea>
              </div>
              <div>
                <label style="font-size:0.75rem; color:#aaa;">英文说明</label>
                <textarea id="in_about_p4_de" style="width:100%; height:50px; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">${d('about_p4_de', 'Cultivate the next generation of music talent, contributing creativity and skills to God\'s work.')}</textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- 👥 板块 4: 创作群体与目标受众 (CALLING & AUDIENCE) -->
        <div class="cms-card" style="border-left: 4px solid #ffa502;">
          <h3 style="color:#ffa502; margin-top:0; display:flex; align-items:center; gap:8px;">
            <span>👥</span> 板块四：创作群体与目标受众 (Calling Group & Target Audience)
          </h3>
          <p style="font-size:0.8rem; color:#888; margin-bottom:1.5rem;">编辑号召的门徒群体与歌曲面向的受众（支持双语及各自照片更换）。</p>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:25px;">
            <!-- Group 1: Calling -->
            <div style="background:#111; padding:20px; border-radius:10px; border:1px solid #222;">
              <h4 style="color:var(--gold); margin-top:0; margin-bottom:12px;">🎸 主要号召群体 (Calling Group)</h4>
              <div style="margin-bottom:10px;">
                <label style="font-size:0.75rem; color:#aaa;">标题 CN / EN</label>
                <div style="display:flex; gap:10px;">
                  <input type="text" id="in_about_aud_call_t" value="${d('about_aud_call_t', '主要的号召群体')}" style="flex:1; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">
                  <input type="text" id="in_about_aud_call_te" value="${d('about_aud_call_te', 'Primary Calling Group')}" style="flex:1; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">
                </div>
              </div>
              <div style="margin-bottom:10px;">
                <label style="font-size:0.75rem; color:#aaa;">描述 1 CN / EN</label>
                <textarea id="in_about_aud_call_d1" style="width:100%; height:45px; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px; margin-bottom:5px;">${d('about_aud_call_d1', '号召一群已经在上帝给的恩赐中装备成熟的门徒。')}</textarea>
                <input type="text" id="in_about_aud_call_d1e" value="${d('about_aud_call_d1e', 'Call upon disciples who are spiritually mature and equipped with God\'s gifts.')}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">
              </div>
              <div style="margin-bottom:15px;">
                <label style="font-size:0.75rem; color:#aaa;">描述 2 CN / EN</label>
                <textarea id="in_about_aud_call_d2" style="width:100%; height:45px; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px; margin-bottom:5px;">${d('about_aud_call_d2', '通过他们的创作，帮助更多的人认识神、领受真理，并传递信望与爱的作品。')}</textarea>
                <input type="text" id="in_about_aud_call_d2e" value="${d('about_aud_call_d2e', 'Through their creations, help others know God, receive the truth, and spread works of faith, hope, and love.')}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">
              </div>
              <div>
                <label style="font-size:0.75rem; color:var(--gold); display:block; margin-bottom:5px;">群体配图 (Photo)</label>
                <img id="prev_about_aud_call_img" src="${d('about_aud_call_img', 'assets/illustrations/morandi-light-silhouette.png')}" style="width:100%; height:130px; object-fit:cover; border-radius:6px; margin-bottom:8px; border:1px solid #333;">
                <input type="file" id="f_about_aud_call_img" style="font-size:0.8rem; width:100%; margin-bottom:5px;">
                <button class="btn-tiny" style="width:100%;" onclick="uploadFile('f_about_aud_call_img', 'in_about_aud_call_img', 'prev_about_aud_call_img')">📤 上传群体配图</button>
                <input type="hidden" id="in_about_aud_call_img" value="${d('about_aud_call_img', 'assets/illustrations/morandi-light-silhouette.png')}">
              </div>
            </div>

            <!-- Group 2: Target Audience -->
            <div style="background:#111; padding:20px; border-radius:10px; border:1px solid #222;">
              <h4 style="color:#ffa502; margin-top:0; margin-bottom:12px;">🎯 目标受众 (Target Audience)</h4>
              <div style="margin-bottom:10px;">
                <label style="font-size:0.75rem; color:#aaa;">标题 CN / EN</label>
                <div style="display:flex; gap:10px;">
                  <input type="text" id="in_about_aud_target_t" value="${d('about_aud_target_t', '目标受众')}" style="flex:1; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">
                  <input type="text" id="in_about_aud_target_te" value="${d('about_aud_target_te', 'Target Audience')}" style="flex:1; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">
                </div>
              </div>
              <div style="margin-bottom:10px;">
                <label style="font-size:0.75rem; color:#aaa;">描述 1 CN / EN</label>
                <textarea id="in_about_aud_target_d1" style="width:100%; height:45px; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px; margin-bottom:5px;">${d('about_aud_target_d1', '主要是那些未认识神的年轻人，甚至是年长的未信者。')}</textarea>
                <input type="text" id="in_about_aud_target_d1e" value="${d('about_aud_target_d1e', 'Mainly young people who have not yet known God, as well as older non-believers.')}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">
              </div>
              <div style="margin-bottom:15px;">
                <label style="font-size:0.75rem; color:#aaa;">描述 2 CN / EN</label>
                <textarea id="in_about_aud_target_d2" style="width:100%; height:45px; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px; margin-bottom:5px;">${d('about_aud_target_d2', '让他们在这些歌曲中找到人生的盼望、希望与爱，这一切都在耶稣基督里。')}</textarea>
                <input type="text" id="in_about_aud_target_d2e" value="${d('about_aud_target_d2e', 'Help them find hope, purpose, and love in these songs, all of which are found in Jesus Christ.')}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">
              </div>
              <div>
                <label style="font-size:0.75rem; color:var(--gold); display:block; margin-bottom:5px;">受众配图 (Photo)</label>
                <img id="prev_about_aud_target_img" src="${d('about_aud_target_img', 'assets/illustrations/morandi-bird-sky.png')}" style="width:100%; height:130px; object-fit:cover; border-radius:6px; margin-bottom:8px; border:1px solid #333;">
                <input type="file" id="f_about_aud_target_img" style="font-size:0.8rem; width:100%; margin-bottom:5px;">
                <button class="btn-tiny" style="width:100%;" onclick="uploadFile('f_about_aud_target_img', 'in_about_aud_target_img', 'prev_about_aud_target_img')">📤 上传受众配图</button>
                <input type="hidden" id="in_about_aud_target_img" value="${d('about_aud_target_img', 'assets/illustrations/morandi-bird-sky.png')}">
              </div>
            </div>
          </div>
        </div>

        <!-- 🎼 板块 5: 主要诗歌创作方向 (SONGWRITING DIRECTIONS) -->
        <div class="cms-card" style="border-left: 4px solid #ff6b81;">
          <h3 style="color:#ff6b81; margin-top:0; display:flex; align-items:center; gap:8px;">
            <span>🎼</span> 板块五：主要诗歌创作方向 (Main Songwriting Categories)
          </h3>
          <p style="font-size:0.8rem; color:#888; margin-bottom:1.5rem;">布道型、教会型、商业型、机构主题曲 4 大类别文案与缩略图。</p>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
            <!-- Cat 1 -->
            <div style="background:#111; padding:18px; border-radius:10px; border:1px solid #222;">
              <span style="font-weight:bold; color:var(--gold); font-size:0.8rem;">类别 01 · 布道型</span>
              <div style="display:flex; gap:10px; margin:10px 0 8px;">
                <input type="text" id="in_about_cat1_t" value="${d('about_cat1_t', '布道型')}" placeholder="标题" style="flex:1; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">
                <input type="text" id="in_about_cat1_te" value="${d('about_cat1_te', 'Evangelistic')}" placeholder="英文" style="flex:1; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">
              </div>
              <textarea id="in_about_cat1_d1" style="width:100%; height:45px; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px; margin-bottom:5px;">${d('about_cat1_d1', '适用于布道会或福音外展活动，结合流行音乐元素，使福音信息更具吸引力。')}</textarea>
              <textarea id="in_about_cat1_d2" style="width:100%; height:45px; background:#1a1a1a; border:1px solid #333; color:var(--gold); padding:8px; border-radius:4px; margin-bottom:10px;">${d('about_cat1_d2', '目的在于带动气氛，并整体传达基督信仰的核心价值观。')}</textarea>
              <div style="display:flex; align-items:center; gap:12px;">
                <img id="prev_about_cat1_img" src="${d('about_cat1_img', 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=600&q=80')}" style="width:50px; height:50px; object-fit:cover; border-radius:6px; border:1px solid #333;">
                <div style="flex:1;">
                  <input type="file" id="f_about_cat1_img" style="font-size:0.75rem; width:100%;">
                  <button class="btn-tiny" style="width:100%; margin-top:4px;" onclick="uploadFile('f_about_cat1_img', 'in_about_cat1_img', 'prev_about_cat1_img')">上传缩略图</button>
                  <input type="hidden" id="in_about_cat1_img" value="${d('about_cat1_img', 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=600&q=80')}">
                </div>
              </div>
            </div>

            <!-- Cat 2 -->
            <div style="background:#111; padding:18px; border-radius:10px; border:1px solid #222;">
              <span style="font-weight:bold; color:var(--gold); font-size:0.8rem;">类别 02 · 教会型</span>
              <div style="display:flex; gap:10px; margin:10px 0 8px;">
                <input type="text" id="in_about_cat2_t" value="${d('about_cat2_t', '教会型')}" placeholder="标题" style="flex:1; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">
                <input type="text" id="in_about_cat2_te" value="${d('about_cat2_te', 'Church Worship')}" placeholder="英文" style="flex:1; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">
              </div>
              <textarea id="in_about_cat2_d1" style="width:100%; height:45px; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px; margin-bottom:5px;">${d('about_cat2_d1', '适用于教会敬拜、团契、主日崇拜等，歌词内容以赞美、敬拜、祷告为主，符合教会使用需求。')}</textarea>
              <textarea id="in_about_cat2_d2" style="width:100%; height:45px; background:#1a1a1a; border:1px solid #333; color:var(--gold); padding:8px; border-radius:4px; margin-bottom:10px;">${d('about_cat2_d2', '旨在帮助信徒更深入地进入敬拜神的氛围。')}</textarea>
              <div style="display:flex; align-items:center; gap:12px;">
                <img id="prev_about_cat2_img" src="${d('about_cat2_img', 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=600&q=80')}" style="width:50px; height:50px; object-fit:cover; border-radius:6px; border:1px solid #333;">
                <div style="flex:1;">
                  <input type="file" id="f_about_cat2_img" style="font-size:0.75rem; width:100%;">
                  <button class="btn-tiny" style="width:100%; margin-top:4px;" onclick="uploadFile('f_about_cat2_img', 'in_about_cat2_img', 'prev_about_cat2_img')">上传缩略图</button>
                  <input type="hidden" id="in_about_cat2_img" value="${d('about_cat2_img', 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=600&q=80')}">
                </div>
              </div>
            </div>

            <!-- Cat 3 -->
            <div style="background:#111; padding:18px; border-radius:10px; border:1px solid #222;">
              <span style="font-weight:bold; color:var(--gold); font-size:0.8rem;">类别 03 · 商业型</span>
              <div style="display:flex; gap:10px; margin:10px 0 8px;">
                <input type="text" id="in_about_cat3_t" value="${d('about_cat3_t', '商业型')}" placeholder="标题" style="flex:1; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">
                <input type="text" id="in_about_cat3_te" value="${d('about_cat3_te', 'Commercial / Contemporary')}" placeholder="英文" style="flex:1; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">
              </div>
              <textarea id="in_about_cat3_d1" style="width:100%; height:40px; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px; margin-bottom:5px;">${d('about_cat3_d1', '适用于日常生活，可在社交媒体、流行音乐平台上播放。')}</textarea>
              <textarea id="in_about_cat3_d2" style="width:100%; height:40px; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px; margin-bottom:5px;">${d('about_cat3_d2', '歌词生活化、口语化，使非信徒也能接受和感动。')}</textarea>
              <textarea id="in_about_cat3_d3" style="width:100%; height:40px; background:#1a1a1a; border:1px solid #333; color:var(--gold); padding:8px; border-radius:4px; margin-bottom:10px;">${d('about_cat3_d3', '通过触动人心的旋律和歌词，引导听众认识上帝的爱。')}</textarea>
              <div style="display:flex; align-items:center; gap:12px;">
                <img id="prev_about_cat3_img" src="${d('about_cat3_img', 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80')}" style="width:50px; height:50px; object-fit:cover; border-radius:6px; border:1px solid #333;">
                <div style="flex:1;">
                  <input type="file" id="f_about_cat3_img" style="font-size:0.75rem; width:100%;">
                  <button class="btn-tiny" style="width:100%; margin-top:4px;" onclick="uploadFile('f_about_cat3_img', 'in_about_cat3_img', 'prev_about_cat3_img')">上传缩略图</button>
                  <input type="hidden" id="in_about_cat3_img" value="${d('about_cat3_img', 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80')}">
                </div>
              </div>
            </div>

            <!-- Cat 4 -->
            <div style="background:#111; padding:18px; border-radius:10px; border:1px solid #222;">
              <span style="font-weight:bold; color:var(--gold); font-size:0.8rem;">类别 04 · 主题曲</span>
              <div style="display:flex; gap:10px; margin:10px 0 8px;">
                <input type="text" id="in_about_cat4_t" value="${d('about_cat4_t', '主题曲')}" placeholder="标题" style="flex:1; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">
                <input type="text" id="in_about_cat4_te" value="${d('about_cat4_te', 'Theme Songs')}" placeholder="英文" style="flex:1; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">
              </div>
              <textarea id="in_about_cat4_d1" style="width:100%; height:45px; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px; margin-bottom:5px;">${d('about_cat4_d1', '为特殊的基督教机构创作主题曲：')}</textarea>
              <textarea id="in_about_cat4_d2" style="width:100%; height:60px; background:#1a1a1a; border:1px solid #333; color:var(--gold); padding:8px; border-radius:4px; margin-bottom:10px;">${d('about_cat4_d2', '• 孤儿院 (Orphanage)\n• 老人院 (Nursing Home)\n• 特殊儿童教育机构 (Special Needs Children)')}</textarea>
              <div style="display:flex; align-items:center; gap:12px;">
                <img id="prev_about_cat4_img" src="${d('about_cat4_img', 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80')}" style="width:50px; height:50px; object-fit:cover; border-radius:6px; border:1px solid #333;">
                <div style="flex:1;">
                  <input type="file" id="f_about_cat4_img" style="font-size:0.75rem; width:100%;">
                  <button class="btn-tiny" style="width:100%; margin-top:4px;" onclick="uploadFile('f_about_cat4_img', 'in_about_cat4_img', 'prev_about_cat4_img')">上传缩略图</button>
                  <input type="hidden" id="in_about_cat4_img" value="${d('about_cat4_img', 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80')}">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 👥 板块 6: 主要同工 (KEY CO-WORKERS POLAROIDS) -->
        <div class="cms-card" style="border-left: 4px solid #1dd1a1;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:10px;">
            <h3 style="color:#1dd1a1; margin:0; display:flex; align-items:center; gap:8px;">
              <span>👥</span> 板块六：主要同工拍立得画廊 (Key Co-workers Polaroids)
            </h3>
            <button class="btn btn-tiny" style="background:#1dd1a1; color:#000; font-weight:bold; border:none; padding:8px 18px;" onclick="switchModule('singers'); switchSingerTab('core');">
              👥 前往主要同工管理页面编辑 (+/- 自由增减)
            </button>
          </div>
          <p style="font-size:0.8rem; color:#888; margin-bottom:1.2rem;">编辑各职务成员名单、中英文职称以及拍立得照片（现已全面支持自由添加或删除职务）。</p>

          <div style="background:#111; padding:20px; border-radius:10px; border:1px solid #222; text-align:center;">
            <p style="color:#aaa; font-size:0.9rem; margin:0 0 12px;">主要同工职务与拍立得相片已统一在「👥 主要同工」模块管理，支持自由添加新职务或删除同工。</p>
            <button class="btn btn-submit" style="width:auto; padding:10px 24px;" onclick="switchModule('singers'); switchSingerTab('core');">
              👉 点击立即前往「👥 主要同工」管理职务与相片
            </button>
          </div>
        </div>

          <!-- 🕊️ 牧师顾问团 / 属灵遮盖与监督 (PASTORAL ADVISORY TEAM) -->
          <div style="background:#141210; padding:18px; border-radius:10px; border:1px solid rgba(246,210,138,0.3); margin-top:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px dashed #333; padding-bottom:8px;">
              <h4 style="color:var(--gold); margin:0; display:flex; align-items:center; gap:8px;">
                <span>🕊️</span> 牧师顾问团 / 属灵遮盖与监督 (Pastoral Advisory Team)
              </h4>
              <div style="display:flex; gap:8px;">
                <input type="text" id="in_about_pastoral_title" value="${d('about_pastoral_title', '牧 师 团')}" style="background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:4px 8px; border-radius:4px; font-size:0.8rem; width:100px;">
                <input type="text" id="in_about_pastoral_subtitle" value="${d('about_pastoral_subtitle', 'Pastoral Advisory Team')}" style="background:#1a1a1a; border:1px solid #333; color:var(--gold); padding:4px 8px; border-radius:4px; font-size:0.8rem;">
              </div>
            </div>

            <div style="display:grid; grid-template-columns: 240px 1fr; gap:20px; align-items:start;">
              <!-- Photo -->
              <div style="background:#111; padding:12px; border-radius:8px; border:1px dashed #333; text-align:center;">
                <label style="font-size:0.75rem; color:#aaa; display:block; margin-bottom:4px;">顾问团圣经配图</label>
                <img id="prev_about_pastoral_img" src="${d('about_pastoral_img', 'assets/illustrations/morandi-white-tree.jpg')}" style="width:100%; height:110px; object-fit:cover; border-radius:4px; margin-bottom:6px;">
                <input type="file" id="f_about_pastoral_img" style="font-size:0.7rem; width:100%;">
                <button class="btn-tiny" style="width:100%; margin-top:4px;" onclick="uploadFile('f_about_pastoral_img', 'in_about_pastoral_img', 'prev_about_pastoral_img')">更换圣经相片</button>
                <input type="hidden" id="in_about_pastoral_img" value="${d('about_pastoral_img', 'assets/illustrations/morandi-white-tree.jpg')}">
              </div>

              <!-- Content details -->
              <div>
                <!-- 1. Advisory Team -->
                <div style="margin-bottom:12px; background:#111; padding:12px; border-radius:6px; border:1px solid #222;">
                  <label style="font-size:0.75rem; color:var(--gold); font-weight:bold; display:block; margin-bottom:4px;">📖 顾问团队 (Advisory Team)</label>
                  <input type="text" id="in_about_pastoral_adv_title" value="${d('about_pastoral_adv_title', '顾问团队 / Advisory Team')}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:6px; border-radius:4px; font-size:0.8rem; margin-bottom:6px;">
                  <textarea id="in_about_pastoral_adv_desc" style="width:100%; height:45px; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:6px; border-radius:4px; font-size:0.8rem; margin-bottom:4px;">${d('about_pastoral_adv_desc', '需要 4 位牧师成为顾问，提供属灵遮盖，并监督歌词的神学准确性。')}</textarea>
                  <input type="text" id="in_about_pastoral_adv_desc_en" value="${d('about_pastoral_adv_desc_en', 'Four pastors will serve as advisors, providing spiritual covering and ensuring theological accuracy in lyrics.')}" style="width:100%; background:#1a1a1a; border:1px solid #333; color:#aaa; padding:6px; border-radius:4px; font-size:0.75rem;">
                </div>

                <!-- 2. Supervisory Role -->
                <div style="background:#111; padding:12px; border-radius:6px; border:1px solid #222;">
                  <label style="font-size:0.75rem; color:var(--gold); font-weight:bold; display:block; margin-bottom:4px;">🛡️ 监督职责 (Supervisory Role)</label>
                  <input type="text" id="in_about_pastoral_sup_title" value="${d('about_pastoral_sup_title', '监督职责 / Supervisory Role')}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:6px; border-radius:4px; font-size:0.8rem; margin-bottom:6px;">
                  <input type="text" id="in_about_pastoral_sup_r1" value="${d('about_pastoral_sup_r1', '检查歌词是否符合神学教导。')}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:5px; border-radius:4px; font-size:0.8rem; margin-bottom:4px;">
                  <input type="text" id="in_about_pastoral_sup_r2" value="${d('about_pastoral_sup_r2', '在非传统教会诗歌中提供指导，避免误导性用词。')}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:5px; border-radius:4px; font-size:0.8rem; margin-bottom:4px;">
                  <input type="text" id="in_about_pastoral_sup_r3" value="${d('about_pastoral_sup_r3', '作为创作坊的属灵掌舵人，确保财务透明，防止滥用资源。')}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:5px; border-radius:4px; font-size:0.8rem; margin-bottom:4px;">
                  <input type="text" id="in_about_pastoral_sup_en" value="${d('about_pastoral_sup_en', 'Review lyrics for theological accuracy, provide guidance on non-traditional songs, and ensure financial transparency to prevent misuse of resources.')}" style="width:100%; background:#1a1a1a; border:1px solid #333; color:#aaa; padding:5px; border-radius:4px; font-size:0.75rem;">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 🎯 板块 7: 平台定位 (POSITIONING) -->
        <div class="cms-card" style="border-left: 4px solid #2ed573;">
          <h3 style="color:#2ed573; margin-top:0; display:flex; align-items:center; gap:8px;">
            <span>🎯</span> 板块七：平台定位 (Brand Positioning)
          </h3>
          <p style="font-size:0.8rem; color:#888; margin-bottom:1.5rem;">编辑定位口号、大标题及两大核心支柱。</p>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:15px;">
            <div>
              <label style="display:block; color:#aaa; font-size:0.8rem; margin-bottom:5px;">英文标语 (Tagline)</label>
              <input type="text" id="in_about_pos_tagline" value="${d('about_pos_tagline', 'Promoting Contemporary Christian Music')}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:10px; border-radius:4px;">
            </div>
            <div>
              <label style="display:block; color:#aaa; font-size:0.8rem; margin-bottom:5px;">主标题 (Main Title)</label>
              <input type="text" id="in_about_pos_title" value="${d('about_pos_title', '推 广 现 代 流 行 基 督 教 音 乐')}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:10px; border-radius:4px;">
            </div>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
            <div style="background:#111; padding:15px; border-radius:8px; border:1px solid #222;">
              <label style="font-size:0.75rem; color:#aaa;">定位要点 1 标题</label>
              <input type="text" id="in_about_pos_p1_t" value="${d('about_pos_p1_t', '为神创作的门徒培养平台')}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px; margin-bottom:8px;">
              <label style="font-size:0.75rem; color:#aaa;">定位要点 1 中文描述</label>
              <textarea id="in_about_pos_p1_d" style="width:100%; height:45px; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px; margin-bottom:8px;">${d('about_pos_p1_d', '专注于培养具备创作才能的门徒，让原创音符成为敬拜与传道的器皿。')}</textarea>
              <label style="font-size:0.75rem; color:#aaa;">定位要点 1 英文描述</label>
              <input type="text" id="in_about_pos_p1_de" value="${d('about_pos_p1_de', 'Positioned as a platform for music created for God, focusing on cultivating disciples with creative talents.')}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">
            </div>

            <div style="background:#111; padding:15px; border-radius:8px; border:1px solid #222;">
              <label style="font-size:0.75rem; color:#aaa;">定位要点 2 标题</label>
              <input type="text" id="in_about_pos_p2_t" value="${d('about_pos_p2_t', '触及年轻一代与福音禾场')}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px; margin-bottom:8px;">
              <label style="font-size:0.75rem; color:#aaa;">定位要点 2 中文描述</label>
              <textarea id="in_about_pos_p2_d" style="width:100%; height:45px; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px; margin-bottom:8px;">${d('about_pos_p2_d', '通过现代音乐语言向世人传递信仰、希望与爱，尤其是年轻群体和未认识神的群体。')}</textarea>
              <label style="font-size:0.75rem; color:#aaa;">定位要点 2 英文描述</label>
              <input type="text" id="in_about_pos_p2_de" value="${d('about_pos_p2_de', 'Use music to convey faith, hope, and love, especially to young people and those who have not yet known God.')}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:8px; border-radius:4px;">
            </div>
          </div>
        </div>

        <!-- 🎬 板块 8: 视听故事与品牌媒体 (MEDIA & FOOTER TEXT) -->
        <div class="cms-card" style="border-left: 4px solid var(--gold);">
          <h3 style="color:var(--gold); margin-top:0; display:flex; align-items:center; gap:8px;">
            <span>🎬</span> 板块八：品牌视听与结语 (Media Showcase & Closing Words)
          </h3>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:25px; margin-bottom:20px;">
            <!-- Video -->
            <div style="background:#111; padding:18px; border-radius:10px; border:1px solid #222;">
              <label style="color:var(--gold); font-size:0.8rem; font-weight:bold;">品牌宣传视频 (Brand Video)</label>
              <video id="prev_about_video_file" src="${c['cfg_about_video']||''}" style="width:100%; height:130px; object-fit:cover; border-radius:6px; margin:8px 0; background:#000;" muted controls></video>
              <input type="file" id="f_about_v_file" style="font-size:0.75rem; width:100%;">
              <button class="btn-tiny" style="width:100%; margin-top:5px;" onclick="uploadFile('f_about_v_file', 'in_about_video', 'prev_about_video_file')">上传视频</button>
              <input type="hidden" id="in_about_video" value="${c['cfg_about_video']||''}">
            </div>

            <!-- Banner / Main Image -->
            <div style="background:#111; padding:18px; border-radius:10px; border:1px solid #222;">
              <label style="color:var(--gold); font-size:0.8rem; font-weight:bold;">宣传主视觉海报 (Main Image Fallback)</label>
              <img id="prev_about_banner_file" src="${c['cfg_about_banner']||'assets/illustrations/morandi-snow-mountain.jpg'}" style="width:100%; height:130px; object-fit:cover; border-radius:6px; margin:8px 0; border:1px solid #333;">
              <input type="file" id="f_about_b_file" style="font-size:0.75rem; width:100%;">
              <button class="btn-tiny" style="width:100%; margin-top:5px;" onclick="uploadFile('f_about_b_file', 'in_about_banner', 'prev_about_banner_file')">上传海报</button>
              <input type="hidden" id="in_about_banner" value="${c['cfg_about_banner']||'assets/illustrations/morandi-snow-mountain.jpg'}">
            </div>
          </div>

          <div>
            <label style="display:block; color:#aaa; font-size:0.8rem; margin-bottom:5px;">视听展区底部金句 / 品牌结语 (Closing Quote)</label>
            <textarea id="in_about_text" style="width:100%; height:60px; background:#1a1a1a; border:1px solid #333; color:var(--gold); padding:10px; border-radius:4px; font-size:0.95rem;">${c['cfg_about_text'] || '让每一首写给神的歌都被听见，让每一颗跳动的心灵被主爱收割。'}</textarea>
          </div>
        </div>

        <!-- Sticky Floating Save Bar -->
        <div style="position:sticky; bottom:20px; background:rgba(10,10,10,0.95); backdrop-filter:blur(15px); border:1px solid var(--gold); border-radius:14px; padding:1.2rem 2rem; display:flex; justify-content:space-between; align-items:center; box-shadow:0 15px 40px rgba(0,0,0,0.9); z-index:100;">
          <div>
            <span style="color:var(--gold); font-weight:bold;">⚡ 一键同步到“关于我们”前台</span>
            <span style="color:#888; font-size:0.8rem; margin-left:10px;">所有修改将实时打包并安全保存至数据库</span>
          </div>
          <button class="btn btn-submit" style="width:auto; padding:12px 35px; font-size:1rem;" onclick="saveAboutCMS()">💾 保存所有图文修改</button>
        </div>

      </div>
    `;
  }

  window.saveAboutCMS = async () => {
    const keys = [
      'about_origin_main_title',
      'about_origin_scripture',
      'about_origin_ref',
      'about_origin_scripture_en',
      'about_origin_meaning',
      'about_origin_meaning_en',
      'about_origin_img',

      'about_vision_title',
      'about_vision_1',
      'about_vision_1_en',
      'about_vision_2',
      'about_vision_2_en',

      'about_mission_title',
      'about_mission_1',
      'about_mission_1_en',
      'about_mission_2',
      'about_mission_2_en',

      'about_p1_t', 'about_p1_te', 'about_p1_d', 'about_p1_de',
      'about_p2_t', 'about_p2_te', 'about_p2_d', 'about_p2_de',
      'about_p3_t', 'about_p3_te', 'about_p3_d', 'about_p3_de',
      'about_p4_t', 'about_p4_te', 'about_p4_d', 'about_p4_de',

      'about_aud_call_t', 'about_aud_call_te', 'about_aud_call_d1', 'about_aud_call_d1e', 'about_aud_call_d2', 'about_aud_call_d2e', 'about_aud_call_img',
      'about_aud_target_t', 'about_aud_target_te', 'about_aud_target_d1', 'about_aud_target_d1e', 'about_aud_target_d2', 'about_aud_target_d2e', 'about_aud_target_img',

      'about_cat1_t', 'about_cat1_te', 'about_cat1_d1', 'about_cat1_d2', 'about_cat1_img',
      'about_cat2_t', 'about_cat2_te', 'about_cat2_d1', 'about_cat2_d2', 'about_cat2_img',
      'about_cat3_t', 'about_cat3_te', 'about_cat3_d1', 'about_cat3_d2', 'about_cat3_d3', 'about_cat3_img',
      'about_cat4_t', 'about_cat4_te', 'about_cat4_d1', 'about_cat4_d2', 'about_cat4_img',

      'about_team_main_title', 'about_team_subtitle',
      'about_team_r1_t', 'about_team_r1_te', 'about_team_r1_names', 'about_team_r1_img',
      'about_team_r2_t', 'about_team_r2_te', 'about_team_r2_names', 'about_team_r2_img',
      'about_team_r3_t', 'about_team_r3_te', 'about_team_r3_names', 'about_team_r3_img',
      'about_team_r4_t', 'about_team_r4_te', 'about_team_r4_names', 'about_team_r4_img',
      'about_team_r5_t', 'about_team_r5_te', 'about_team_r5_names', 'about_team_r5_img',
      'about_team_r6_t', 'about_team_r6_te', 'about_team_r6_names', 'about_team_r6_img',
      'about_team_r7_t', 'about_team_r7_te', 'about_team_r7_names', 'about_team_r7_names_en', 'about_team_r7_img',
      'about_pastoral_title', 'about_pastoral_subtitle', 'about_pastoral_img',
      'about_pastoral_adv_title', 'about_pastoral_adv_desc', 'about_pastoral_adv_desc_en',
      'about_pastoral_sup_title', 'about_pastoral_sup_r1', 'about_pastoral_sup_r2', 'about_pastoral_sup_r3', 'about_pastoral_sup_en',
      'about_pos_tagline',
      'about_pos_title',
      'about_pos_p1_t', 'about_pos_p1_d', 'about_pos_p1_de',
      'about_pos_p2_t', 'about_pos_p2_d', 'about_pos_p2_de'
    ];

    const payload = {};
    for (let k of keys) {
      const el = document.getElementById('in_' + k);
      if (el) payload[k] = el.value;
    }

    try {
      // 1. Save JSON bundle
      await db.from('site_config').upsert({
        key: 'cfg_about_content_json',
        value: JSON.stringify(payload)
      }, { onConflict: 'key' });

      // 2. Save media & text
      const vEl = document.getElementById('in_about_video');
      if (vEl) await db.from('site_config').upsert({ key: 'cfg_about_video', value: vEl.value }, { onConflict: 'key' });

      const bEl = document.getElementById('in_about_banner');
      if (bEl) await db.from('site_config').upsert({ key: 'cfg_about_banner', value: bEl.value }, { onConflict: 'key' });

      const tEl = document.getElementById('in_about_text');
      if (tEl) await db.from('site_config').upsert({ key: 'cfg_about_text', value: tEl.value }, { onConflict: 'key' });

      alert("🎉 关于我们所有文案与配图已成功保存并实时生效！");
      renderCMS();
    } catch(err) {
      alert("保存失败: " + err.message);
    }
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
            <textarea id="cfg_about_text" style="width:100%; height:80px; background:#222; border:1px solid #444; color: #F6F4F0; padding:10px; border-radius:4px;">${c['cfg_about_text']||''}</textarea>
          </div>

          <div style="margin-bottom:15px;">
            <label>联系我们邮箱 (Contact Email)</label>
            <input type="text" id="cfg_contact_email" value="${c['cfg_contact_email']||''}" style="width:100%; background:#222; border:1px solid #444; color: #F6F4F0; padding:8px; border-radius:4px;">
          </div>

          <div style="margin-bottom:15px; padding-top:15px; border-top:1px solid #222;">
            <h4 style="margin-bottom:10px;">社交媒体链接 (Social Links)</h4>
            <label style="font-size:0.7rem; color:#666;">Facebook URL (Global)</label><input type="text" id="cfg_social_fb" value="${c['cfg_social_fb']||''}" style="width:100%; margin-bottom:10px; background:#222; border:1px solid #444; color: #F6F4F0;">
            <label style="font-size:0.7rem; color:#666;">Instagram URL</label><input type="text" id="cfg_social_ig" value="${c['cfg_social_ig']||''}" style="width:100%; margin-bottom:10px; background:#222; border:1px solid #444; color: #F6F4F0;">
            <label style="font-size:0.7rem; color:#666;">YouTube URL</label><input type="text" id="cfg_social_yt" value="${c['cfg_social_yt']||''}" style="width:100%; background:#222; border:1px solid #444; color: #F6F4F0;">
          </div>

          <button class="btn btn-submit" style="margin-top:15px; width:100%;" onclick="saveAllConfigs()">更新设置与文案</button>
        </div>

        <!-- Column 2: Financial & Support -->
        <div style="background:#151515; padding:25px; border-radius:12px; border:1px solid #222;">
          <h3 style="color:var(--gold); margin-top:0;"><i class="fas fa-hand-holding-heart"></i> 支持我们 (Support Info)</h3>
          
          <div style="margin-bottom:15px;">
            <label>银行名称 (Bank Name)</label>
            <input type="text" id="cfg_support_bank" value="${c['cfg_support_bank']||''}" style="width:100%; margin-bottom:10px; background:#222; border:1px solid #444; color: #F6F4F0;">
            <label>银行账号 (Account No.)</label>
            <input type="text" id="cfg_support_acc_no" value="${c['cfg_support_acc_no']||''}" style="width:100%; margin-bottom:10px; background:#222; border:1px solid #444; color: #F6F4F0;">
            <label>户名 (Account Name)</label>
            <input type="text" id="cfg_support_acc_name" value="${c['cfg_support_acc_name']||''}" style="width:100%; margin-bottom:10px; background:#222; border:1px solid #444; color: #F6F4F0;">
          </div>

          <div style="margin-bottom:15px; padding-top:15px; border-top:1px solid #222;">
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
            <textarea id="cfg_site_description" style="width:100%; height:60px; background:#0a0a0a; border:1px solid #333; color: #F6F4F0; padding:10px; border-radius:4px; font-size:0.85rem;">${c['cfg_site_description']||''}</textarea>
          </div>

          <div class="banner-edit-item" style="margin-top:20px; border-top:1px solid #222; padding-top:15px; grid-column: 1 / -1;">
             <label style="color:var(--gold);"><i class="fas fa-edit"></i> 投稿页面说明文字 (Submit Terms Text)</label>
             <p style="font-size:0.7rem; color:#666; margin-bottom:8px;">支持多行输入。换行将自动转换为 HTML &lt;br&gt;</p>
             <textarea id="cfg_submit_text" style="width:100%; height:120px; background:#0a0a0a; border:1px solid #333; color: #F6F4F0; padding:10px; border-radius:4px; font-size:0.85rem; line-height:1.6;">${c['cfg_submit_text']||''}</textarea>
          </div>

          <div class="banner-edit-item" style="margin-top:20px; border-top:1px solid #222; padding-top:15px; grid-column: 1 / -1;">
            <label style="color:var(--gold);"><i class="fas fa-link"></i> 投稿按钮跳转链接 (Submit Button URL)</label>
            <p style="font-size:0.7rem; color:#666; margin-bottom:8px;">点击“我要投稿”后跳转的页面地址</p>
            <input type="text" id="cfg_submit_btn_link" value="${c['cfg_submit_btn_link']||''}" placeholder="https://..." style="width:100%; background:#0a0a0a; border:1px solid #333; color: #F6F4F0; padding:10px; border-radius:4px;">
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
      {k: 'cfg_support_qr', v: document.getElementById('url_qr').value}
    ];
    for(let item of data) {
      await db.from('site_config').upsert({key: item.k, value: item.v}, {onConflict: 'key'});
    }
    alert("支持信息（银行/QR Code）更新成功!");
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
    let albums = [];
    try {
      const { data, error } = await db.from('diary_albums').select('*').order('date', {ascending: false});
      if (!error && Array.isArray(data)) albums = data;
    } catch(err) {
      console.warn("diary_albums query note:", err);
    }

    // Double-check & merge with site_config cfg_diary_albums_json (robust fallback against RLS/schema issues)
    try {
      const { data: cfg } = await db.from('site_config').select('value').eq('key', 'cfg_diary_albums_json').maybeSingle();
      if (cfg?.value) {
        const parsed = JSON.parse(cfg.value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed.forEach(p => {
            const matchIdx = albums.findIndex(a => String(a.id) === String(p.id) || a.title === p.title);
            if (matchIdx !== -1) {
              albums[matchIdx] = { ...p, ...albums[matchIdx], photos: p.photos || albums[matchIdx].photos || [] };
            } else {
              albums.push(p);
            }
          });
        }
      }
    } catch(e) {
      console.warn("cfg_diary_albums_json read note:", e);
    }

    // Also query diary_media to ensure live photo counts are up-to-date
    try {
      const { data: allMedia } = await db.from('diary_media').select('id, album_id, media_url');
      if (Array.isArray(allMedia) && allMedia.length > 0) {
        albums.forEach(a => {
          if (!a.photos) a.photos = [];
          const mForAlbum = allMedia.filter(m => String(m.album_id) === String(a.id));
          mForAlbum.forEach(m => {
            if (!a.photos.some(p => (typeof p === 'string' ? p : p.media_url) === m.media_url)) {
              a.photos.push(m);
            }
          });
        });
      }
    } catch(mErr){}

    // Sort by date descending
    albums.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    window._currentAdminDiaryAlbums = albums;

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem; flex-wrap:wrap; gap:12px;">
        <div>
          <h1 style="color:var(--gold); margin:0;">📷 照片集与相册管理 (Photo Gallery CMS)</h1>
          <p style="color:#888; font-size:0.85rem; margin-top:4px;">共 ${albums.length} 个相册。支持为相册极速批量上传多张照片、拖拽上传、设为封面与双重云端同步。</p>
        </div>
        <button class="btn btn-submit" style="width:auto; padding:10px 25px;" onclick="openDiaryModal()">+ 新建相册</button>
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:22px;">
        ${albums.map(a => {
          const photoCount = (a.photos && Array.isArray(a.photos)) ? a.photos.length : 0;
          return `
          <div style="background:#141414; padding:20px; border-radius:14px; border:1px solid #282828; position:relative; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 8px 24px rgba(0,0,0,0.5); transition:transform 0.25s, border-color 0.25s;" onmouseover="this.style.borderColor='rgba(246,210,138,0.45)'" onmouseout="this.style.borderColor='#282828'">
            <div>
              <div style="position:relative; width:100%; aspect-ratio:1.6/1; border-radius:10px; overflow:hidden; margin-bottom:15px; border:1px solid #333; background:#080808;">
                <img src="${a.cover_url || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80'}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='assets/logo.png'">
                <span style="position:absolute; top:8px; right:8px; background:rgba(0,0,0,0.75); backdrop-filter:blur(6px); color:var(--gold); font-size:0.75rem; font-weight:bold; padding:4px 10px; border-radius:50px; border:1px solid rgba(246,210,138,0.3);">
                  📷 ${photoCount} 张照片
                </span>
              </div>
              <h3 style="margin:0; color:var(--gold); font-size:1.15rem; font-weight:600;">${a.title}</h3>
              <p style="color:#aaa; font-size:0.85rem; margin:6px 0;">📅 ${a.date || '未定日期'}</p>
              ${a.fb_url ? `<p style="font-size:0.75rem; color:#1877F2; margin:0;"><i class="fab fa-facebook"></i> 已关联 Facebook 相册</p>` : ''}
            </div>
            
            <div style="margin-top:20px; display:flex; flex-direction:column; gap:8px;">
              <button class="btn btn-submit" style="width:100%; padding:10px; font-size:0.9rem; font-weight:600; display:flex; align-items:center; justify-content:center; gap:6px;" onclick="managePhotos('${a.id}')">
                <span>📤</span> 上传与管理照片 (${photoCount} 张)
              </button>
              <div style="display:flex; gap:8px;">
                <button class="btn-tiny" style="flex:1; padding:8px;" onclick="openDiaryModal('${a.id}')">✏️ 编辑信息</button>
                <button class="btn-tiny danger" style="padding:8px 12px;" onclick="deleteItem('diary_albums', '${a.id}')" title="删除整个相册">🗑️ 删除</button>
              </div>
            </div>
          </div>
        `;}).join('') || '<p style="color:#888; grid-column:1/-1; text-align:center; padding:3rem 0;">暂无日记相册，立即点击右上角「+ 新建相册」创建一个吧。</p>'}
      </div>
    `;
  }
  
  window.openDiaryModal = async (id = null) => {
    const list = window._currentAdminDiaryAlbums || [];
    let a = id ? list.find(x => String(x.id) === String(id)) : null;

    if (!a && id) {
      try {
        const { data } = await db.from('diary_albums').select('*').eq('id', id).maybeSingle();
        if (data) a = data;
      } catch(e) {}
    }

    const isEdit = !!a;
    const modal = document.createElement('div');
    modal.id = 'diaryAlbumModal';
    modal.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:9999; display:flex; justify-content:center; align-items:center; backdrop-filter:blur(8px); padding:20px;";
    modal.innerHTML = `
      <div style="background:#111; border:1px solid var(--gold); border-radius:16px; padding:2rem; width:100%; max-width:560px; max-height:90vh; overflow-y:auto; box-shadow:0 20px 60px rgba(0,0,0,1);">
        <h2 style="color:var(--gold); margin-bottom:1.5rem; text-align:center;">${isEdit ? '编辑日记相册' : '新建日记相册'}</h2>
        
        <!-- 相册封面 -->
        <div style="margin-bottom:20px; background:#0a0a0a; padding:15px; border-radius:12px; border:1px solid #222;">
          <label style="display:block; margin-bottom:8px; color:#aaa; font-size:0.8rem; font-weight:600;">相册封面 (Album Cover)</label>
          <div style="width:100%; aspect-ratio:1.6/1; overflow:hidden; border-radius:8px; border:1px solid #333; background:#222; margin:0 auto 12px; display:flex; align-items:center; justify-content:center;">
            <img id="da_prev" src="${a?.cover_url || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80'}" style="width:100%; height:100%; object-fit:cover; object-position:${a?.cover_pos || a?.img_pos || '50% 50%'}; transform:scale(${a?.cover_zoom || a?.img_zoom || 1.0}); transform-origin:${a?.cover_pos || a?.img_pos || '50% 50%'}; transition:all 0.1s ease;" onerror="this.src='assets/logo.png'">
          </div>
          <div style="display:flex; flex-direction:column; gap:8px;">
            <input type="file" id="daf_up" accept="image/*" style="font-size:0.8rem; color:#888;">
            <button class="btn-tiny" style="width:100%; padding:7px; background:rgba(246,210,138,0.15); border-color:var(--gold); color:var(--gold); font-weight:600;" onclick="uploadFile('daf_up', 'da_url', 'da_prev')">📤 上传相册封面图</button>
            <input type="text" id="da_url" value="${a?.cover_url || ''}" placeholder="或直接粘贴封面图片 URL 链接..." style="width:100%; padding:8px 10px; background:#181818; border:1px solid #333; color:#eee; border-radius:4px; font-size:0.8rem;" oninput="document.getElementById('da_prev').src = this.value.trim() || 'assets/logo.png'">
          </div>

          <!-- 🎚️ 相册封面焦点与裁剪调整 -->
          ${renderImageCropControllerHTML({
            id: 'da_crop',
            targetImgId: 'da_prev',
            posVal: a?.cover_pos || a?.img_pos || '50% 50%',
            zoomVal: a?.cover_zoom || a?.img_zoom || 1.0,
            posInputId: 'da_pos',
            zoomInputId: 'da_zoom',
            label: '调整相册封面呈现区域与焦点 (Album Cover Crop & Zoom)',
            hint: '微调封面上下/左右位置与放大比例，确保相册卡片封面不切到人脸或重要景物'
          })}
        </div>

        <!-- 相册名称与日期 -->
        <div style="margin-bottom:15px;">
          <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem; font-weight:600;">相册名称 (Album Name)</label>
          <input type="text" id="da_title" value="${a?.title || ''}" placeholder="例如：2026 巴生谷田野调查与敬拜瞬间" style="width:100%; padding:10px;">
        </div>

        <div style="margin-bottom:15px;">
          <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem; font-weight:600;">相册日期 (Album Date)</label>
          <input type="date" id="da_date" value="${a?.date || new Date().toISOString().split('T')[0]}" style="width:100%; padding:10px;">
        </div>

        <!-- Facebook 关联相册链接 -->
        <div style="margin-bottom:20px;">
          <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem; font-weight:600;">Facebook 相册链接 (Social Link - 可选)</label>
          <input type="text" id="da_fb" value="${a?.fb_url || ''}" placeholder="https://www.facebook.com/media/set/?set=..." style="width:100%; padding:10px;">
        </div>

        ${!isEdit ? `
          <!-- 新建时可选：直接选择第一批照片 -->
          <div style="margin-bottom:20px; background:#161616; padding:15px; border-radius:10px; border:1px dashed rgba(246,210,138,0.3);">
            <label style="display:block; margin-bottom:5px; color:var(--gold); font-size:0.8rem; font-weight:600;">
              ✨ 一键顺便上传第一批相册照片 (可选)
            </label>
            <p style="font-size:0.72rem; color:#888; margin:0 0 8px 0;">可在此一次性选择多张照片，创建后会自动全部加入相册中。</p>
            <input type="file" id="daf_multi_create" multiple accept="image/*" style="font-size:0.8rem; color:#aaa; width:100%;">
          </div>
        ` : ''}

        <div style="display:flex; gap:15px; margin-top:20px; position:sticky; bottom:0; padding-top:10px; background:#111; border-top:1px solid #222;">
          <button class="btn btn-submit" id="btnSaveDiaryAlbum" style="flex:2; padding:12px;" onclick="saveDiaryAlbum('${a?.id || ''}')">💾 保存相册信息</button>
          <button class="btn-tiny" style="flex:1;" onclick="this.closest('#diaryAlbumModal').remove()">取消</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  };

  window.saveDiaryAlbum = async(id) => {
    const btn = document.getElementById('btnSaveDiaryAlbum');
    const origText = btn ? btn.innerText : '保存';
    const title = document.getElementById('da_title')?.value.trim();
    let date = document.getElementById('da_date')?.value.trim();
    const coverUrl = document.getElementById('da_url')?.value.trim();
    const fbUrl = document.getElementById('da_fb')?.value.trim() || '';
    const multiFiles = document.getElementById('daf_multi_create')?.files;

    if(!title) return alert("请输入相册名称");
    if(!date) date = new Date().toISOString().split('T')[0];

    if (btn) { btn.innerText = "⏳ 正在同步中..."; btn.disabled = true; }

    const coverPos = document.getElementById('da_pos')?.value.trim() || '50% 50%';
    const coverZoom = parseFloat(document.getElementById('da_zoom')?.value) || 1.0;
    const albumId = id || ('album_' + Date.now());
    const payload = {
      id: albumId,
      title: title,
      date: date,
      cover_url: coverUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
      cover_pos: coverPos,
      cover_zoom: coverZoom,
      img_pos: coverPos,
      img_zoom: coverZoom,
      fb_url: fbUrl
    };

    // 1. 尝试保存至 diary_albums 表
    try {
      const dbPayload = {
        title: payload.title,
        date: payload.date,
        cover_url: payload.cover_url,
        cover_pos: coverPos,
        cover_zoom: coverZoom,
        img_pos: coverPos,
        img_zoom: coverZoom
      };
      if (fbUrl) dbPayload.fb_url = fbUrl;

      if(id) {
        await db.from('diary_albums').update(dbPayload).eq('id', id);
      } else {
        await db.from('diary_albums').insert([{ id: albumId, ...dbPayload }]);
      }
    } catch(err) {
      console.warn("diary_albums table insert note:", err);
    }

    // 2. 双重持久化同步到 site_config cfg_diary_albums_json
    try {
      const { data: cfg } = await db.from('site_config').select('value').eq('key', 'cfg_diary_albums_json').maybeSingle();
      let list = [];
      if (cfg?.value) {
        try { list = JSON.parse(cfg.value); } catch(e){}
      }
      if (!Array.isArray(list)) list = [];

      const existingIdx = list.findIndex(x => String(x.id) === String(albumId) || x.title === title);
      const fullAlbum = {
        ...payload,
        photos: existingIdx !== -1 ? (list[existingIdx].photos || []) : []
      };

      if (existingIdx !== -1) {
        list[existingIdx] = { ...list[existingIdx], ...fullAlbum };
      } else {
        list.unshift(fullAlbum);
      }

      await db.from('site_config').upsert({
        key: 'cfg_diary_albums_json',
        value: JSON.stringify(list)
      }, { onConflict: 'key' });
    } catch(cfgErr) {
      console.warn("cfg_diary_albums_json sync note:", cfgErr);
    }

    // 3. 如果在新建时选择了首批照片，立刻后台批量上传
    if (multiFiles && multiFiles.length > 0) {
      if (btn) btn.innerText = `⏳ 正在批量上传首批 ${multiFiles.length} 张照片...`;
      try {
        await uploadDiaryPhotosBatch(albumId, Array.from(multiFiles), false);
      } catch(upErr){
        console.warn("Batch initial photos upload note:", upErr);
      }
    }
    
    // 关闭模态框并刷新
    if(document.getElementById('diaryAlbumModal')) document.getElementById('diaryAlbumModal').remove();
    alert("✅ 相册已成功保存！");
    renderCMS();
  };

  window.saveDiaryAlbumMinimal = async (id) => {
    const fb = document.getElementById('da_fb_instant')?.value.trim();
    try {
      // 1. Update DB table
      try {
        await db.from('diary_albums').update({ fb_url: fb }).eq('id', id);
      } catch(e){}

      // 2. Update site_config
      const { data: cfg } = await db.from('site_config').select('value').eq('key', 'cfg_diary_albums_json').maybeSingle();
      if (cfg?.value) {
        let list = JSON.parse(cfg.value);
        const idx = list.findIndex(x => String(x.id) === String(id));
        if (idx !== -1) {
          list[idx].fb_url = fb;
          await db.from('site_config').upsert({ key: 'cfg_diary_albums_json', value: JSON.stringify(list) }, { onConflict: 'key' });
        }
      }

      alert("✅ Facebook 链接已成功同步！");
      renderCMS();
    } catch(e) {
      alert("同步失败：" + e.message);
    }
  };
  
  // --- 🌟 照片管理与多图批量上传模态框 ---
  window.managePhotos = async(id) => {
    const list = window._currentAdminDiaryAlbums || [];
    let album = list.find(x => String(x.id) === String(id)) || null;

    if (!album && id) {
      try {
        const { data } = await db.from('diary_albums').select('*').eq('id', id).maybeSingle();
        if (data) album = data;
      } catch(e){}
    }

    let dbPhotos = [];
    try {
      const { data } = await db.from('diary_media').select('*').eq('album_id', id);
      if (data) dbPhotos = data;
    } catch(e){}

    // Merge with album.photos from config
    let allPhotos = [...dbPhotos];
    if (album?.photos?.length) {
      album.photos.forEach(p => {
        const pUrl = typeof p === 'string' ? p : p.media_url;
        if (pUrl && !allPhotos.some(dp => dp.media_url === pUrl || (p.id && String(dp.id) === String(p.id)))) {
          allPhotos.push(typeof p === 'string' ? { id: 'photo_' + Math.random(), media_url: p } : p);
        }
      });
    }

    const modal = document.createElement('div');
    modal.id = 'photoManagerModal';
    modal.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.92); z-index:9999; display:flex; justify-content:center; align-items:center; backdrop-filter:blur(12px); padding:20px;";
    modal.innerHTML = `
      <div style="background:#111; border:1.5px solid var(--gold); border-radius:18px; padding:2rem; width:100%; max-width:880px; max-height:88vh; overflow-y:auto; box-shadow:0 25px 70px rgba(0,0,0,0.95); position:relative;">
        
        <!-- Header -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; border-bottom:1px solid #222; padding-bottom:14px; flex-wrap:wrap; gap:10px;">
          <div>
            <h2 style="color:var(--gold); margin:0; font-size:1.35rem; display:flex; align-items:center; gap:8px;">
              <span>📷</span> 照片管理 ·《${album?.title || '未命名相册'}》
            </h2>
            <p style="color:#888; font-size:0.8rem; margin:4px 0 0 0;">
              当前相册共有 <b id="photoCountHeader" style="color:var(--gold);">${allPhotos.length}</b> 张照片 · 支持批量上传与拖拽选择多图
            </p>
          </div>
          <button class="btn-tiny" style="padding:6px 14px; font-size:0.85rem;" onclick="this.closest('#photoManagerModal').remove(); renderCMS();">✕ 完成并关闭</button>
        </div>

        <!-- 🌟 Upload Area with Drag-and-Drop & Multi-select -->
        <div id="diaryDropZone" style="background:#0a0a0a; padding:24px 20px; border-radius:14px; text-align:center; margin-bottom:20px; border:2px dashed rgba(246,210,138,0.35); transition:all 0.3s ease; position:relative; cursor:pointer;"
             onclick="document.getElementById('d_up_multi').click();"
             ondragover="event.preventDefault(); this.style.borderColor='var(--gold)'; this.style.background='rgba(246,210,138,0.08)';"
             ondragleave="this.style.borderColor='rgba(246,210,138,0.35)'; this.style.background='#0a0a0a';"
             ondrop="event.preventDefault(); this.style.borderColor='rgba(246,210,138,0.35)'; this.style.background='#0a0a0a'; handleDiaryFilesDrop(event, '${id}');">
           
           <div style="font-size:2.2rem; margin-bottom:6px;">📤</div>
           <p style="color: #F6F4F0; font-size:0.95rem; margin:0 0 6px 0; font-weight:600;">
             点击此处批量选择多张照片，或直接将图片文件拖放至此
           </p>
           <p style="color:#888; font-size:0.75rem; margin:0 0 12px 0;">
             ✨ 支持 JPG / PNG / WEBP 格式，系统会自动进行高清无损压缩与极速上传
           </p>
           
           <input type="file" id="d_up_multi" multiple accept="image/*" style="display:none;" onchange="handleDiaryFilesSelected(this.files, '${id}')" onclick="event.stopPropagation();">
           
           <button type="button" class="btn btn-submit" style="display:inline-block; width:auto; padding:8px 24px; font-size:0.85rem;" onclick="event.stopPropagation(); document.getElementById('d_up_multi').click();">
             + 批量选择本地照片 (按住 Ctrl / Shift 可选多张)
           </button>

           <div id="up_stat_box" style="margin-top:12px; display:none;">
             <div id="up_progress_bar_bg" style="width:100%; height:6px; background:#222; border-radius:3px; overflow:hidden; margin-bottom:6px;">
               <div id="up_progress_bar" style="width:0%; height:100%; background:var(--gold); transition:width 0.2s;"></div>
             </div>
             <div id="up_stat" style="font-size:0.8rem; color:var(--gold); font-weight:600;"></div>
           </div>
        </div>

        <!-- 🌟 Option 2: Batch Paste URLs or Social Link (Collapsible / Clean) -->
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin-bottom:20px;">
          <!-- Batch URLs -->
          <div style="background:#141414; padding:14px; border-radius:10px; border:1px solid #222;">
            <label style="display:block; margin-bottom:6px; color:#aaa; font-size:0.78rem; font-weight:600;">
              🔗 批量粘贴图片链接快速加入相册
            </label>
            <textarea id="d_urls_batch" placeholder="可粘贴多行图片链接，每行一个 URL..." style="width:100%; height:60px; font-size:0.75rem; padding:8px; background:#080808; border:1px solid #333; color:#eee; border-radius:4px; margin-bottom:8px; resize:none;"></textarea>
            <button class="btn-tiny" style="width:100%; padding:6px; background:rgba(246,210,138,0.1); border-color:var(--gold); color:var(--gold);" onclick="batchAddPhotoUrls('${id}')">
              ➕ 批量导入链接照片
            </button>
          </div>

          <!-- FB Social Link -->
          <div style="background:#141414; padding:14px; border-radius:10px; border:1px solid #222; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <label style="display:block; margin-bottom:6px; color:#1877F2; font-size:0.78rem; font-weight:600;">
                <i class="fab fa-facebook"></i> 关联 Facebook 相册外链 (Social Cross-post)
              </label>
              <input type="text" id="da_fb_instant" value="${album?.fb_url || ''}" placeholder="https://www.facebook.com/media/set/..." style="width:100%; padding:8px; font-size:0.75rem; background:#080808; border:1px solid #333; color:#eee; border-radius:4px; margin-bottom:8px;">
            </div>
            <button class="btn-tiny" onclick="saveDiaryAlbumMinimal('${id}')" style="width:100%; padding:6px; background:#1877F2; color:#fff; border:none;">
              💾 保存 FB 链接
            </button>
          </div>
        </div>

        <!-- 🌟 Photos Grid -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <h4 style="margin:0; color:#ddd; font-size:0.9rem;">
            相册内所有相片列表 (共 <span id="photoCountBadge">${allPhotos.length}</span> 张)
          </h4>
          <span style="font-size:0.72rem; color:#888;">💡 点击「⭐ 设为封面」可随时更换相册主展示图</span>
        </div>

        <div id="photoGridCMS" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(135px, 1fr)); gap:12px; max-height:420px; overflow-y:auto; padding-right:4px;">
          ${allPhotos.map((p, pIdx) => {
             const optimized = p.media_url; 
             const isCover = album?.cover_url === optimized;
             return `
            <div id="photo_card_${p.id || pIdx}" style="position:relative; aspect-ratio:1; border-radius:8px; overflow:hidden; border:${isCover ? '2px solid var(--gold)' : '1px solid #333'}; background:#080808; box-shadow:0 4px 12px rgba(0,0,0,0.5);">
              <img src="${optimized}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='assets/logo.png'">
              
              <!-- Index Badge -->
              <span style="position:absolute; top:4px; left:4px; background:rgba(0,0,0,0.7); color:#ccc; font-size:0.65rem; padding:1px 5px; border-radius:3px;">#${pIdx + 1}</span>

              <!-- Cover Badge -->
              ${isCover ? `<span style="position:absolute; bottom:4px; left:4px; background:var(--gold); color:#000; font-size:0.62rem; font-weight:bold; padding:1px 5px; border-radius:3px;">封面</span>` : ''}

              <!-- Action buttons overlay -->
              <div style="position:absolute; top:4px; right:4px; display:flex; gap:3px;">
                ${!isCover ? `<button onclick="setAlbumCover('${id}', '${optimized.replace(/'/g, "\\'")}', this)" style="background:rgba(0,0,0,0.75); border:1px solid #555; color:var(--gold); border-radius:4px; padding:2px 5px; cursor:pointer; font-size:0.65rem;" title="设为此相册封面">⭐ 封面</button>` : ''}
                <button onclick="deleteDiaryPhoto('${p.id || ''}', '${optimized.replace(/'/g, "\\'")}', '${id}', this)" style="background:rgba(255,0,0,0.85); border:none; color:#fff; border-radius:4px; width:22px; height:22px; cursor:pointer; font-size:12px; display:flex; align-items:center; justify-content:center;" title="删除此照片">✕</button>
              </div>
            </div>
          `;}).join('') || '<p id="emptyPhotoNotice" style="grid-column:1/-1; text-align:center; opacity:0.5; padding:3rem 0; font-size:0.9rem;">此相册暂无照片，请使用上方拖拽或点击上传多张照片。</p>'}
        </div>

      </div>
    `;
    document.body.appendChild(modal);
  };

  window.handleDiaryFilesSelected = (files, aid) => {
    if (!files || files.length === 0) return;
    uploadDiaryPhotosBatch(aid, Array.from(files));
  };

  window.handleDiaryFilesDrop = (event, aid) => {
    const files = event.dataTransfer?.files;
    if (!files || files.length === 0) return;
    uploadDiaryPhotosBatch(aid, Array.from(files));
  };

  window.uploadDiaryPhotosBatch = async (aid, files, updateUI = true) => {
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return alert("请选择有效的图片文件");

    const statBox = document.getElementById('up_stat_box');
    const statText = document.getElementById('up_stat');
    const pBar = document.getElementById('up_progress_bar');
    if (statBox && updateUI) statBox.style.display = 'block';

    let successCount = 0;
    const total = imageFiles.length;

    for (let i = 0; i < total; i++) {
      const file = imageFiles[i];
      const percent = Math.round(((i + 1) / total) * 100);
      if (pBar && updateUI) pBar.style.width = `${percent}%`;
      if (statText && updateUI) statText.innerText = `⏳ 正在处理并上传第 ${i + 1}/${total} 张照片: ${file.name}... (${percent}%)`;

      try {
        let uploadObj = file;
        if (file.type.startsWith('image/')) {
          uploadObj = await compressImage(file);
        }
        const safeName = uploadObj.name.replace(/[^\w.-]/g, "_");
        const path = `diary/${Date.now()}-${i}-${safeName}`;

        const { data, error } = await db.storage.from('harvester-media').upload(path, uploadObj);
        if (error) throw error;

        const { data: { publicUrl } } = db.storage.from('harvester-media').getPublicUrl(path);
        const photoItem = {
          id: 'photo_' + Date.now() + '_' + i,
          album_id: aid,
          media_url: publicUrl,
          type: 'image'
        };

        // 1. Save to DB table
        try {
          await db.from('diary_media').insert([photoItem]);
        } catch(err){}

        // 2. Sync to site_config cfg_diary_albums_json
        try {
          const { data: cfg } = await db.from('site_config').select('value').eq('key', 'cfg_diary_albums_json').maybeSingle();
          if (cfg?.value) {
            let list = JSON.parse(cfg.value);
            const aIdx = list.findIndex(x => String(x.id) === String(aid));
            if (aIdx !== -1) {
              if (!list[aIdx].photos) list[aIdx].photos = [];
              if (!list[aIdx].cover_url || list[aIdx].cover_url.includes('unsplash') || list[aIdx].cover_url === 'assets/logo.png') {
                list[aIdx].cover_url = publicUrl;
              }
              list[aIdx].photos.push(photoItem);
              await db.from('site_config').upsert({ key: 'cfg_diary_albums_json', value: JSON.stringify(list) }, { onConflict: 'key' });
            }
          }
        } catch(err){}

        // Append to DOM live if modal is open
        const emptyNotice = document.getElementById('emptyPhotoNotice');
        if (emptyNotice) emptyNotice.remove();

        const grid = document.getElementById('photoGridCMS');
        if (grid && updateUI) {
          const photoDiv = document.createElement('div');
          photoDiv.style = "position:relative; aspect-ratio:1; border-radius:8px; overflow:hidden; border:1px solid #333; background:#080808; box-shadow:0 4px 12px rgba(0,0,0,0.5);";
          photoDiv.innerHTML = `
            <img src="${publicUrl}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='assets/logo.png'">
            <span style="position:absolute; top:4px; left:4px; background:rgba(0,0,0,0.7); color:#ccc; font-size:0.65rem; padding:1px 5px; border-radius:3px;">新</span>
            <div style="position:absolute; top:4px; right:4px; display:flex; gap:3px;">
              <button onclick="setAlbumCover('${aid}', '${publicUrl.replace(/'/g, "\\'")}', this)" style="background:rgba(0,0,0,0.75); border:1px solid #555; color:var(--gold); border-radius:4px; padding:2px 5px; cursor:pointer; font-size:0.65rem;" title="设为封面">⭐ 封面</button>
              <button onclick="deleteDiaryPhoto('${photoItem.id}', '${publicUrl.replace(/'/g, "\\'")}', '${aid}', this)" style="background:rgba(255,0,0,0.85); border:none; color:#fff; border-radius:4px; width:22px; height:22px; cursor:pointer; font-size:12px; display:flex; align-items:center; justify-content:center;" title="删除照片">✕</button>
            </div>
          `;
          grid.appendChild(photoDiv);
        }

        successCount++;
      } catch(err) {
        console.warn("Photo upload fail:", err);
      }
    }

    if (statText && updateUI) statText.innerText = `🎉 批量上传完成！已成功加入 ${successCount} 张照片。`;
    const countBadge = document.getElementById('photoCountBadge');
    const countH = document.getElementById('photoCountHeader');
    const gridEl = document.getElementById('photoGridCMS');
    if (gridEl) {
      const newTotal = gridEl.querySelectorAll('img').length;
      if (countBadge) countBadge.innerText = newTotal;
      if (countH) countH.innerText = newTotal;
    }

    const fileInput = document.getElementById('d_up_multi');
    if (fileInput) fileInput.value = "";
  };

  window.batchAddPhotoUrls = async (aid) => {
    const txt = document.getElementById('d_urls_batch')?.value.trim();
    if (!txt) return alert("请输入图片链接（每行一个）");
    const urls = txt.split(/[\r\n,]+/).map(u => u.trim()).filter(u => u && (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('assets/')));
    if (urls.length === 0) return alert("未识别到有效的图片链接");

    let count = 0;
    for (const url of urls) {
      const photoItem = {
        id: 'photo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        album_id: aid,
        media_url: url,
        type: 'image'
      };

      try {
        await db.from('diary_media').insert([photoItem]);
      } catch(e){}

      try {
        const { data: cfg } = await db.from('site_config').select('value').eq('key', 'cfg_diary_albums_json').maybeSingle();
        if (cfg?.value) {
          let list = JSON.parse(cfg.value);
          const aIdx = list.findIndex(x => String(x.id) === String(aid));
          if (aIdx !== -1) {
            if (!list[aIdx].photos) list[aIdx].photos = [];
            list[aIdx].photos.push(photoItem);
            await db.from('site_config').upsert({ key: 'cfg_diary_albums_json', value: JSON.stringify(list) }, { onConflict: 'key' });
          }
        }
      } catch(e){}

      count++;
    }

    alert(`✅ 已成功批量导入 ${count} 张链接照片！`);
    managePhotos(aid);
  };

  window.setAlbumCover = async (aid, photoUrl, btn) => {
    try {
      // 1. Update DB table
      try {
        await db.from('diary_albums').update({ cover_url: photoUrl }).eq('id', aid);
      } catch(e){}

      // 2. Update site_config
      const { data: cfg } = await db.from('site_config').select('value').eq('key', 'cfg_diary_albums_json').maybeSingle();
      if (cfg?.value) {
        let list = JSON.parse(cfg.value);
        const aIdx = list.findIndex(x => String(x.id) === String(aid));
        if (aIdx !== -1) {
          list[aIdx].cover_url = photoUrl;
          await db.from('site_config').upsert({ key: 'cfg_diary_albums_json', value: JSON.stringify(list) }, { onConflict: 'key' });
        }
      }

      alert("⭐ 已成功将该照片设为相册封面！");
      managePhotos(aid);
    } catch(e) {
      alert("设置封面失败：" + e.message);
    }
  };

  window.deleteDiaryPhoto = async (photoId, mediaUrl, aid, btn) => {
    if(!confirm("确定删除这张照片？")) return;

    // 1. Try DB delete
    try {
      if (photoId && !photoId.startsWith('photo_')) {
        await db.from('diary_media').delete().eq('id', photoId);
      } else if (mediaUrl) {
        await db.from('diary_media').delete().eq('media_url', mediaUrl);
      }
    } catch(e){}

    // 2. Config delete
    try {
      const { data: cfg } = await db.from('site_config').select('value').eq('key', 'cfg_diary_albums_json').maybeSingle();
      if (cfg?.value) {
        let list = JSON.parse(cfg.value);
        const aIdx = list.findIndex(x => String(x.id) === String(aid));
        if (aIdx !== -1 && list[aIdx].photos) {
          list[aIdx].photos = list[aIdx].photos.filter(p => (typeof p === 'string' ? p : p.media_url) !== mediaUrl && String(p.id) !== String(photoId));
          await db.from('site_config').upsert({ key: 'cfg_diary_albums_json', value: JSON.stringify(list) }, { onConflict: 'key' });
        }
      }
    } catch(e){}

    if (btn && btn.parentElement) {
      const card = btn.closest('[id^="photo_card_"]') || btn.parentElement;
      if (card) card.remove();
    }
    const countBadge = document.getElementById('photoCountBadge');
    const countH = document.getElementById('photoCountHeader');
    const gridEl = document.getElementById('photoGridCMS');
    if (gridEl) {
      const newTotal = gridEl.querySelectorAll('img').length;
      if (countBadge) countBadge.innerText = newTotal;
      if (countH) countH.innerText = newTotal;
    }
  };

  window.deleteItem = async(t, id) => {
    if(!confirm("确定永久删除此项？")) return;
    try {
      await db.from(t).delete().eq('id', id);
    } catch(e){}

    // If deleting diary album, also delete photos and config
    if (t === 'diary_albums') {
      try {
        await db.from('diary_media').delete().eq('album_id', id);
      } catch(e){}
      try {
        const { data: cfg } = await db.from('site_config').select('value').eq('key', 'cfg_diary_albums_json').maybeSingle();
        if (cfg?.value) {
          let list = JSON.parse(cfg.value);
          if (Array.isArray(list)) {
            list = list.filter(x => String(x.id) !== String(id));
            await db.from('site_config').upsert({ key: 'cfg_diary_albums_json', value: JSON.stringify(list) }, { onConflict: 'key' });
          }
        }
      } catch(e){}
    }

    // 1. If deleting event, also clean up from site_config fallback stores, orders, and posters
    if (t === 'events') {
      try {
        const { data: cfg } = await db.from('site_config').select('value').eq('key', 'cfg_events_custom_json').maybeSingle();
        if (cfg?.value) {
          let list = JSON.parse(cfg.value);
          if (Array.isArray(list)) {
            list = list.filter(x => String(x.id) !== String(id));
            await db.from('site_config').upsert({ key: 'cfg_events_custom_json', value: JSON.stringify(list) }, { onConflict: 'key' });
          }
        }
      } catch(e){}

      try {
        const { data: ordCfg } = await db.from('site_config').select('value').eq('key', 'cfg_events_order').maybeSingle();
        if (ordCfg?.value) {
          let ordList = ordCfg.value.split(',').filter(x => String(x) !== String(id));
          await db.from('site_config').upsert({ key: 'cfg_events_order', value: ordList.join(',') }, { onConflict: 'key' });
        }
      } catch(e){}

      try {
        const { data: pCfg } = await db.from('site_config').select('value').eq('key', 'cfg_events_posters_json').maybeSingle();
        if (pCfg?.value) {
          let plist = JSON.parse(pCfg.value);
          if (Array.isArray(plist)) {
            plist = plist.filter(p => String(p.id) !== String(id) && !(p.link && p.link.includes(String(id))));
            await db.from('site_config').upsert({ key: 'cfg_events_posters_json', value: JSON.stringify(plist) }, { onConflict: 'key' });
          }
        }
      } catch(e){}
    }

    // 2. If deleting diary album, also remove from site_config cfg_diary_albums_json
    if (t === 'diary_albums') {
      try {
        const { data: cfg } = await db.from('site_config').select('value').eq('key', 'cfg_diary_albums_json').maybeSingle();
        if (cfg?.value) {
          let list = JSON.parse(cfg.value);
          if (Array.isArray(list)) {
            list = list.filter(x => String(x.id) !== String(id));
            await db.from('site_config').upsert({ key: 'cfg_diary_albums_json', value: JSON.stringify(list) }, { onConflict: 'key' });
          }
        }
      } catch(e){}
    }

    // 3. If deleting music_works, also remove from site_config cfg_albums_custom_json
    if (t === 'music_works') {
      try {
        const { data: cfg } = await db.from('site_config').select('value').eq('key', 'cfg_albums_custom_json').maybeSingle();
        if (cfg?.value) {
          let list = JSON.parse(cfg.value);
          if (Array.isArray(list)) {
            list = list.filter(x => String(x.id) !== String(id));
            await db.from('site_config').upsert({ key: 'cfg_albums_custom_json', value: JSON.stringify(list) }, { onConflict: 'key' });
          }
        }
      } catch(e){}
    }

    renderCMS();
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
            全部记录: <b style="color: #F6F4F0;">${echoes?.length || 0}</b> 条 ｜ 
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
                    <td style="padding:15px; font-style:italic; color: #F6F4F0; font-size:0.95rem; font-family:'ChenYuluoyan', sans-serif, system-ui;">
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
