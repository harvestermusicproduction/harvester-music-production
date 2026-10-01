
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
      <div class="cms-layout" style="display:flex; height:100vh; background:#050505; color: #F6F4F0; overflow:hidden; font-family: 'Inter', -apple-system, sans-serif;">
        <!-- Clean Professional Sidebar -->
        <aside style="width:250px; background:#000; border-right:1px solid #1a1a1a; padding:2rem 1.2rem; display:flex; flex-direction:column;">
          <div style="margin-bottom:2rem; padding-left:10px;">
            <h2 style="color:var(--gold); font-size:1.35rem; letter-spacing:3px; margin:0; font-weight: 300;">HARVESTER</h2>
            <p style="font-size:0.6rem; color:#1877F2; margin:5px 0 0; letter-spacing:2px; text-transform:uppercase; font-weight:bold;">CMS CONTROL PANEL</p>
          </div>
          
          <nav style="flex:1; display:flex; flex-direction:column; gap:5px; overflow-y:auto; padding-right:4px;">
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
          
          <button onclick="logoutAdmin()" style="background:none; border:none; color:#555; text-align:left; padding:10px; font-size:0.8rem; cursor:pointer; transition:0.3s; margin-top:15px; border-top:1px solid #111;">
            <i class="fas fa-sign-out-alt"></i> SIGN OUT (登出)
          </button>
        </aside>

        <main id="moduleBody" style="flex:1; padding:3.5rem 4.5rem; overflow-y:auto; background:#050505;"></main>
      </div>

      <style>
        .nav-section-title { font-size: 0.6rem; color: #3a3a3a; text-transform: uppercase; letter-spacing: 2px; margin: 8px 0 6px 10px; font-weight: bold; }
        .nav-item {
          color: #888;
          text-decoration: none;
          padding: 9px 14px;
          border-radius: 6px;
          font-size: 0.85rem;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          gap: 10px;
          letter-spacing: 0.3px;
        }
        .nav-item:hover { background: rgba(255,255,255,0.04); color: #ccc; }
        .nav-item.active { background: rgba(246, 210, 138, 0.1); color: var(--gold); font-weight: 600; border-left: 2px solid var(--gold); }
        
        .cms-card { background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 12px; padding: 2rem; }
        .btn-tiny { background: #111; border: 1px solid #222; color: #888; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.75rem; transition: 0.3s; }
        .btn-tiny:hover { background: #222; color: #F6F4F0; border-color: #444; }
        .btn-tiny.danger:hover { background: #422; color: #f44; border-color: #622; }
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
        <!-- 1. Hero 视频与标语 -->
        <div class="cms-card" style="border-left: 4px solid var(--gold);">
          <h3 style="color:var(--gold); margin-top:0; display:flex; align-items:center; gap:8px;">
            <span>🎬</span> 主页 Hero 顶部背景与主视觉
          </h3>
          <div style="display:grid; grid-template-columns: 1.2fr 1fr; gap:25px; margin-top:15px;">
            <div>
              <div style="margin-bottom:15px;">
                <label style="display:block; color:#aaa; font-size:0.8rem; margin-bottom:5px;">顶部主标题 (Hero Title)</label>
                <input type="text" id="in_home_hero_title" value="${c['cfg_home_hero_title'] || '收割感动，播种福音'}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:10px; border-radius:6px;">
              </div>
              <div style="margin-bottom:15px;">
                <label style="display:block; color:#aaa; font-size:0.8rem; margin-bottom:5px;">顶部英文副标 (Hero Subtitle)</label>
                <input type="text" id="in_home_hero_subtitle" value="${c['cfg_home_hero_subtitle'] || 'HARVESTING EMOTIONS, SOWING GOSPEL'}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:10px; border-radius:6px;">
              </div>
              <div>
                <label style="display:block; color:#aaa; font-size:0.8rem; margin-bottom:5px;">Hero 视频流或背景视频链接 (MP4 / WebM)</label>
                <input type="text" id="in_hero_video_url" value="${c['cfg_hero_video_url'] || ''}" placeholder="https://... 或点击右侧上传" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:10px; border-radius:6px;">
              </div>
            </div>
            <div style="background:#111; padding:20px; border-radius:10px; border:1px dashed #333; text-align:center;">
              <label style="display:block; color:var(--gold); font-size:0.85rem; font-weight:bold; margin-bottom:10px;">上传 Hero 视频文件</label>
              <input type="file" id="f_hero_vid" accept="video/mp4,video/webm" style="font-size:0.8rem; color:#aaa; width:100%; margin-bottom:10px;">
              <button class="btn-tiny" style="width:100%;" onclick="uploadFile('f_hero_vid', 'in_hero_video_url', null)">📤 上传并填入视频链接</button>
            </div>
          </div>
        </div>

        <!-- 2. 最新歌曲推荐设定 -->
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

        <!-- 3. 全局社交网络链接 -->
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
              <input type="text" id="in_nav_fb" value="${c['cfg_nav_fb'] || '#'}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:10px; border-radius:6px;">
            </div>
            <div>
              <label style="display:block; color:#aaa; font-size:0.8rem; margin-bottom:5px;"><i class="fab fa-instagram" style="color:#E1306C;"></i> Instagram 账号</label>
              <input type="text" id="in_nav_ig" value="${c['cfg_nav_ig'] || '#'}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:10px; border-radius:6px;">
            </div>
            <div style="grid-column: 1/-1;">
              <label style="display:block; color:#aaa; font-size:0.8rem; margin-bottom:5px;"><i class="fab fa-youtube" style="color:#FF0000;"></i> YouTube 官方频道</label>
              <input type="text" id="in_nav_yt" value="${c['cfg_nav_yt'] || '#'}" style="width:100%; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; padding:10px; border-radius:6px;">
            </div>
          </div>
        </div>

        <button class="btn btn-submit" style="width:100%; padding:14px; font-size:1rem;" onclick="saveHomeCMS()">💾 立即保存主页配置</button>
      </div>
    `;
  }

  window.saveHomeCMS = async () => {
    const payload = [
      { key: 'cfg_home_hero_title', value: document.getElementById('in_home_hero_title').value.trim() },
      { key: 'cfg_home_hero_subtitle', value: document.getElementById('in_home_hero_subtitle').value.trim() },
      { key: 'cfg_hero_video_url', value: document.getElementById('in_hero_video_url').value.trim() },
      { key: 'cfg_latest_music_id', value: document.getElementById('in_latest_music_id').value.trim() },
      { key: 'cfg_nav_wa', value: document.getElementById('in_nav_wa').value.trim() },
      { key: 'cfg_nav_sp', value: document.getElementById('in_nav_sp').value.trim() },
      { key: 'cfg_nav_fb', value: document.getElementById('in_nav_fb').value.trim() },
      { key: 'cfg_nav_ig', value: document.getElementById('in_nav_ig').value.trim() },
      { key: 'cfg_nav_yt', value: document.getElementById('in_nav_yt').value.trim() }
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
      const year = String(customMatch?.year || s.year || '2025');
      const spineBg = customMatch?.spine_bg || ["#1877F2", "#00b894", "#f39c12", "#ea8676", "#0984e3", "#2d3436"][idx % 6];
      const spineClr = customMatch?.spine_color || "#ffffff";
      const spineTxt = customMatch?.spine_text || `${s.title}`;
      const coverUrl = s.cover_url || customMatch?.cover_url || childlikeDoodles[idx % childlikeDoodles.length];
      return { ...s, customMatch, year, spineBg, spineClr, spineTxt, coverUrl };
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
          <p style="color:#888; font-size:0.85rem; margin-top:5px;">管理原创诗歌单曲、3D 展架唱片、PDF 歌谱、音频与风琴折档案（按年份归类管理）。</p>
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
                           style="width:75px; height:75px; object-fit:cover; border-radius:10px; border:1px solid #333; background:#181818;"
                           onerror="this.src='${childlikeDoodles[0]}'">
                      <div style="flex:1; overflow:hidden;">
                        <h3 style="margin:0; color: #F6F4F0; font-size:1.1rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; display:flex; align-items:center; gap:8px;">
                          ${s.title}
                          <span style="color:var(--gold); font-size:0.7rem; background:rgba(246,210,138,0.15); border:1px solid rgba(246,210,138,0.35); padding:2px 8px; border-radius:4px; font-family:monospace; font-weight:bold;">${s.year}</span>
                          ${s.id === latestId || s.is_latest ? '<span style="color:var(--gold); font-size:0.65rem; background:rgba(246,210,138,0.12); padding:2px 8px; border-radius:50px; border:1px solid rgba(246,210,138,0.3);">首推</span>' : ''}
                        </h3>
                        <p style="margin:4px 0 0; color:#888; font-size:0.8rem;">${s.customMatch?.artist || s.artist || 'Harvester Worship'}</p>
                        <div style="display:flex; gap:10px; margin-top:6px;">
                          <span style="font-size:0.75rem; color:${s.score_url ? '#2ed573' : '#555'};"><i class="fas fa-file-pdf"></i> ${s.score_url ? '歌谱就绪' : '无歌谱'}</span>
                          <span style="font-size:0.75rem; color:${s.audio_url ? '#70a1ff' : '#555'};"><i class="fab fa-youtube"></i> ${s.audio_url ? 'YouTube' : '无链接'}</span>
                          <span style="font-size:0.75rem; color:${s.customMatch?.spotify_url || s.spotify_url ? '#1db954' : '#555'};"><i class="fab fa-spotify"></i> ${s.customMatch?.spotify_url || s.spotify_url ? 'Spotify' : '无链接'}</span>
                        </div>
                      </div>
                    </div>

                    <!-- 3D Spine Preview Bar -->
                    <div style="background:${s.spineBg}; color:${s.spineClr}; padding:6px 12px; border-radius:6px; font-size:0.75rem; font-weight:bold; letter-spacing:1px; margin-bottom:12px; border:1px solid rgba(255,255,255,0.1); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; text-shadow:0 1px 2px rgba(0,0,0,0.8);">
                      🧱 书脊: ${s.spineTxt}
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
      const initialCover = s?.cover_url || spineCustom?.cover_url || childlikeDoodles[Math.floor(Math.random() * childlikeDoodles.length)];
      const spineBg = spineCustom?.spine_bg || "#1877F2";
      const spineClr = spineCustom?.spine_color || "#ffffff";
      const spineTxt = spineCustom?.spine_text || (s?.title ? `${s.title}` : "");
      const spotifyUrl = spineCustom?.spotify_url || s?.spotify_url || '';
      const themeColor = spineCustom?.theme_color || "#2e6b82";
      const titleEn = spineCustom?.title_en || "Harvester Single";
      const year = spineCustom?.year || "2025";
      const genre = spineCustom?.genre || "Worship / CCM · 2025";
      const keyBpm = spineCustom?.key_bpm || "KEY: C · 72 BPM";
      const scripture = spineCustom?.scripture || "「神是个灵，所以拜他的必须用心灵和诚实拜他。」—— 约翰福音 4:24";
      const notes = spineCustom?.notes || "在瞬息万变、充满喧嚣的世界里，愿我们每一次开口赞美，都是心灵与圣灵的真实对话。";
      const composer = spineCustom?.composer || spineCustom?.artist || s?.artist || "Harvester Worship";
      const arrangement = spineCustom?.arrangement || "Harvester Music Production";
      const vocals = spineCustom?.vocals || "Creative Vocalists";
      const mixing = spineCustom?.mixing || "Harvester Studio HQ";
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
            <img id="m_prev" src="${initialCover}" style="width:140px; height:140px; object-fit:cover; border-radius:12px; display:block; margin:0 auto 12px; border:1.5px solid rgba(246,210,138,0.3); background:#181818;">
            
            <div style="display:flex; gap:10px; justify-content:center; margin-bottom:10px;">
              <button type="button" class="btn-tiny" style="background:rgba(246,210,138,0.15); border-color:var(--gold); color:var(--gold); padding:8px 16px;" onclick="setRandomChildlikeCover()">
                🎨 换一组随机童趣手绘封面
              </button>
            </div>

            <input type="file" id="mf_up" style="font-size:0.8rem; color:#aaa; margin-bottom:8px; width:100%;">
            <button type="button" class="btn-tiny" style="width:100%; padding:8px;" onclick="uploadFile('mf_up', 'm_url', 'm_prev')">📤 上传自定义封面图片</button>
            <input type="hidden" id="m_url" value="${initialCover}">
          </div>

          <!-- 2. 基本信息 -->
          <div style="background:#0a0a0a; border:1px solid #222; border-radius:10px; padding:15px; margin-bottom:15px;">
            <label style="display:block; margin-bottom:12px; color:var(--gold); font-size:0.85rem; font-weight:bold;">🏷️ 基础信息与莫兰迪主题色</label>
            
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin-bottom:12px;">
              <div>
                <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem;">歌曲中文名称 (Title) *</label>
                <input type="text" id="m_t" value="${s?.title || ''}" placeholder="例如：更新敬拜" style="width:100%; padding:10px;" oninput="document.getElementById('m_spine_t').value = this.value">
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

            <div style="margin-top:12px;">
              <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem;">海报及页面专属莫兰迪主题色 (Theme Color)</label>
              <div style="display:flex; gap:8px; align-items:center;">
                <input type="color" id="m_theme_clr" value="${themeColor}" style="width:40px; height:35px; background:transparent; border:none; cursor:pointer;">
                <input type="text" id="m_theme_clr_hex" value="${themeColor}" style="flex:1; padding:6px; font-family:monospace;" onchange="document.getElementById('m_theme_clr').value=this.value">
              </div>
            </div>
          </div>

          <!-- 3. 3D 立体书脊属性 -->
          <div style="background:#0a0a0a; border:1px solid rgba(246,210,138,0.25); border-radius:10px; padding:15px; margin-bottom:15px;">
            <label style="display:block; margin-bottom:8px; color:var(--gold); font-size:0.85rem; font-weight:bold;">🧱 3D 立体书脊属性 (Spine Attributes)</label>
            <div style="margin-bottom:10px;">
              <label style="display:block; font-size:0.75rem; color:#888; margin-bottom:4px;">书脊印制文字 (Spine Text)</label>
              <input type="text" id="m_spine_t" value="${spineTxt}" placeholder="例如：更新敬拜" style="width:100%; padding:8px;">
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
              <div>
                <label style="display:block; font-size:0.75rem; color:#888; margin-bottom:4px;">书脊底色 (Spine Color)</label>
                <div style="display:flex; gap:8px; align-items:center;">
                  <input type="color" id="m_spine_bg" value="${spineBg}" style="width:40px; height:35px; background:transparent; border:none; cursor:pointer;">
                  <input type="text" id="m_spine_bg_hex" value="${spineBg}" style="flex:1; padding:6px; font-family:monospace;" onchange="document.getElementById('m_spine_bg').value=this.value">
                </div>
              </div>
              <div>
                <label style="display:block; font-size:0.75rem; color:#888; margin-bottom:4px;">书脊文字颜色 (Text Color)</label>
                <div style="display:flex; gap:8px; align-items:center;">
                  <input type="color" id="m_spine_clr" value="${spineClr}" style="width:40px; height:35px; background:transparent; border:none; cursor:pointer;">
                  <input type="text" id="m_spine_clr_hex" value="${spineClr}" style="flex:1; padding:6px; font-family:monospace;" onchange="document.getElementById('m_spine_clr').value=this.value">
                </div>
              </div>
            </div>
          </div>

          <!-- 4. 视听与外链 -->
          <div style="background:#0a0a0a; border:1px solid #222; border-radius:10px; padding:15px; margin-bottom:15px;">
            <label style="display:block; margin-bottom:12px; color:var(--gold); font-size:0.85rem; font-weight:bold;">🔗 试听、外链与歌谱资源</label>

            <div style="margin-bottom:10px;">
              <label style="display:block; margin-bottom:4px; color:#aaa; font-size:0.8rem;">YouTube 播放链接 (Video / Audio URL)</label>
              <input type="text" id="m_a" value="${s?.audio_url || ''}" placeholder="https://www.youtube.com/watch?v=..." style="width:100%; padding:8px;">
            </div>

            <div style="margin-bottom:10px;">
              <label style="display:block; margin-bottom:4px; color:#aaa; font-size:0.8rem;">Spotify 聆听链接 (Spotify URL)</label>
              <input type="text" id="m_sp" value="${spotifyUrl}" placeholder="https://open.spotify.com/track/..." style="width:100%; padding:8px;">
            </div>

            <div style="margin-top:10px;">
              <label style="display:block; margin-bottom:4px; color:#aaa; font-size:0.8rem;">📄 PDF 歌谱链接 / 文件上传 (Score PDF)</label>
              <input type="text" id="m_s" value="${s?.score_url || ''}" placeholder="可直接在下方上传 PDF 或粘贴链接" style="width:100%; padding:8px; margin-bottom:6px;">
              <input type="file" id="mf_score" style="font-size:0.8rem; color:#aaa; margin-bottom:6px; width:100%;" accept=".pdf">
              <button type="button" class="btn-tiny" style="width:100%; padding:6px;" onclick="uploadFile('mf_score', 'm_s')">📤 上传歌谱 PDF 文件</button>
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
                  <input type="text" id="m_vocals" value="${vocals}" placeholder="Creative Vocalists" style="width:100%; padding:6px;">
                </div>
                <div>
                  <label style="font-size:0.75rem; color:#888; display:block;">录音混音母带</label>
                  <input type="text" id="m_mixing" value="${mixing}" placeholder="Harvester Studio HQ" style="width:100%; padding:6px;">
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

      document.getElementById('m_theme_clr').addEventListener('input', (e) => {
        document.getElementById('m_theme_clr_hex').value = e.target.value;
      });
      document.getElementById('m_spine_bg').addEventListener('input', (e) => {
        document.getElementById('m_spine_bg_hex').value = e.target.value;
      });
      document.getElementById('m_spine_clr').addEventListener('input', (e) => {
        document.getElementById('m_spine_clr_hex').value = e.target.value;
      });
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
      const theme_color = document.getElementById('m_theme_clr_hex')?.value.trim() || "#2e6b82";

      const cover_url = document.getElementById('m_url').value.trim();
      const audio_url = document.getElementById('m_a').value.trim();
      const spotify_url = document.getElementById('m_sp')?.value.trim() || '';
      const score_url = document.getElementById('m_s').value.trim();
      const description = document.getElementById('m_d').value.trim();
      
      const spine_text = document.getElementById('m_spine_t').value.trim() || title;
      const spine_bg = document.getElementById('m_spine_bg_hex').value.trim() || '#1877F2';
      const spine_color = document.getElementById('m_spine_clr_hex').value.trim() || '#ffffff';

      const key_bpm = document.getElementById('m_key_bpm')?.value.trim() || "KEY: C · 72 BPM";
      const scripture = document.getElementById('m_scripture')?.value.trim() || "";
      const notes = document.getElementById('m_notes')?.value.trim() || "";
      const composer = document.getElementById('m_composer')?.value.trim() || artist;
      const arrangement = document.getElementById('m_arrangement')?.value.trim() || "Harvester Music Production";
      const vocals = document.getElementById('m_vocals')?.value.trim() || "Creative Vocalists";
      const mixing = document.getElementById('m_mixing')?.value.trim() || "Harvester Studio HQ";
      const photo_1 = document.getElementById('m_photo1')?.value.trim() || cover_url;
      const photo_2 = document.getElementById('m_photo2')?.value.trim() || cover_url;
      const photo_3 = document.getElementById('m_photo3')?.value.trim() || cover_url;

      if (!title) throw new Error("请输入歌曲名称");

      const payload = {
        title,
        cover_url,
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
        theme_color,
        spine_text,
        spine_bg,
        spine_color,
        cover_url,
        description,
        score_url,
        audio_url,
        youtube_url: audio_url,
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
                      <b style="color: #F6F4F0;">${e.event_date || '未定'}</b>
                      <div style="font-size:0.75rem; color:#888;">${e.event_time || ''}</div>
                    </td>
                    <td style="padding:14px;">
                      <div style="font-size:1rem; font-weight:500; color: #F6F4F0; display:flex; align-items:center; flex-wrap:wrap; gap:4px;">
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
            <label style="display:flex; align-items:center; gap:12px; cursor:pointer; font-size:0.9rem; color: #F6F4F0; font-weight:600; user-select:none;">
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

    const gospelSingers = (singers || []).filter(s => s.category === 'gospel');
    const worshipSingers = (singers || []).filter(s => s.category === 'worship');
    const coWorkersList = getCoWorkersListFromConfig(aboutData);

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:15px;">
        <div>
          <h1 style="color:var(--gold); margin:0;">🎙️ 主要同工与歌手管理 (Co-workers & Singers)</h1>
          <p style="color:#888; font-size:0.85rem; margin-top:5px;">自由管理主要服事同工团队、福音歌手及敬拜赞美歌手名册。</p>
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
        <!-- 👥 主要同工管理 (自由增减同工职务) -->
        <div style="background:#0a0a0a; border:1px solid #1f1f1f; border-radius:12px; padding:25px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:1px solid #222; padding-bottom:12px; flex-wrap:wrap; gap:10px;">
            <div>
              <h3 style="color:var(--gold); margin:0;">主要同工职务与拍立得相片管理</h3>
              <span style="color:#777; font-size:0.8rem;">可随时添加新职务或删除同工，保存后将实时同步更新至前台「主要同工」与「关于我们」页面</span>
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
          ${(currentSingerSubTab === 'gospel' ? gospelSingers : worshipSingers).map(s => `
            <div style="background:#111; padding:20px; border-radius:12px; border:1px solid #222; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <img src="${s.image_url || 'assets/logo.png'}" style="width:100%; aspect-ratio:3/4; object-fit:cover; border-radius:8px; margin-bottom:15px; border:1px solid #333;" onerror="this.src='assets/logo.png'">
                <h3 style="margin:0; color:var(--gold); font-size:1.15rem;">${s.name}</h3>
                <p style="color:#888; font-size:0.85rem; margin:6px 0 10px;">${s.role || 'Gospel Singer'} <span style="background:rgba(255,255,255,0.08); padding:2px 8px; border-radius:4px; font-size:0.7rem; margin-left:8px; color:#aaa;">${s.category === 'worship' ? '敬拜赞美' : '福音歌手'}</span></p>
                <p style="color:#666; font-size:0.8rem; line-height:1.4; max-height:45px; overflow:hidden;">${s.bio || ''}</p>
              </div>
              <div style="display:flex; gap:10px; margin-top:20px; padding-top:12px; border-top:1px solid #1a1a1a;">
                <button class="btn-tiny" style="flex:1; color:var(--gold); border-color:var(--gold);" onclick="editSinger('${s.id}')">⚙️ 编辑档案</button>
                <button class="btn-tiny danger" onclick="deleteItem('singers', '${s.id}')">🗑️ 删除</button>
              </div>
            </div>
          `).join('') || `<p style="grid-column:1/-1; text-align:center; color:#555; padding:60px;">暂无该分类歌手，点击右上角「+ 邀请新歌手」添加</p>`}
        </div>
      `}
    `;
  }

  // Dynamic co-worker team management helper
  window.getCoWorkersListFromConfig = function(aboutData) {
    if (aboutData && Array.isArray(aboutData.about_team_list) && aboutData.about_team_list.length > 0) {
      return aboutData.about_team_list;
    }
    const list = [];
    for (let i = 1; i <= 20; i++) {
      const role = aboutData[`about_team_r${i}_t`];
      const role_en = aboutData[`about_team_r${i}_te`];
      const names = aboutData[`about_team_r${i}_names`];
      const img = aboutData[`about_team_r${i}_img`];
      if (role || names || img) {
        list.push({
          id: `staff_${i}`,
          role: role || `职务 ${i}`,
          role_en: role_en || '',
          names: names || '',
          image_url: img || 'assets/logo.png'
        });
      }
    }
    if (list.length > 0) return list;

    return [
      { id: "staff_1", role: "创作平台创办启发人", role_en: "Founding Inspirer", names: "汤小康\nWarren 沈自强", image_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80" },
      { id: "staff_2", role: "创作", role_en: "Music Creation", names: "Warren 沈自强\n汤小康\nNatasha", image_url: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80" },
      { id: "staff_3", role: "制作", role_en: "Music Production", names: "汤小康\nWarren 沈自强\nEdward", image_url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80" },
      { id: "staff_4", role: "拍摄", role_en: "Visual & Video Design", names: "陈宏亮", image_url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80" },
      { id: "staff_5", role: "宣传", role_en: "Marketing & Promotion", names: "Sherlyn", image_url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80" },
      { id: "staff_6", role: "行政", role_en: "Administration", names: "梁苡乐", image_url: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80" },
      { id: "staff_7", role: "歌手与主领", role_en: "Singers & Worship Leaders", names: "依歌曲需求而定", image_url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80" }
    ];
  };

  window.renderCoWorkerCardsHTML = function(teamList) {
    return teamList.map((item, index) => {
      const idx = index + 1;
      const numStr = idx < 10 ? '0' + idx : '' + idx;
      const itemId = item.id || `staff_${idx}`;
      return `
        <div class="coworker-item-card" data-id="${itemId}" style="background:#121212; padding:18px; border-radius:10px; border:1px solid #222; position:relative; display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span class="coworker-badge" style="color:var(--gold); font-size:0.82rem; font-weight:bold;">${numStr} 职务与成员</span>
              <button class="btn-tiny danger" style="padding:2px 8px; font-size:0.75rem;" onclick="removeCoWorkerCard(this)" title="删除此同工职务">🗑️ 删除</button>
            </div>
            
            <label style="font-size:0.75rem; color:#aaa;">中文职务名称 (Role Title) *</label>
            <input type="text" class="coworker-role-input" value="${item.role || ''}" placeholder="例如：创作平台创办启发人" style="width:100%; margin:4px 0 8px; font-size:0.85rem; padding:7px 10px; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; border-radius:4px;">
            
            <label style="font-size:0.75rem; color:#aaa;">英文职务 (Role EN, 可选)</label>
            <input type="text" class="coworker-role-en-input" value="${item.role_en || ''}" placeholder="例如：Founding Inspirer" style="width:100%; margin:4px 0 8px; font-size:0.8rem; padding:6px 10px; background:#1a1a1a; border:1px solid #333; color:#aaa; border-radius:4px;">

            <label style="font-size:0.75rem; color:#aaa;">同工姓名 (成员名单，换行分隔)</label>
            <textarea class="coworker-names-input" placeholder="输入同工名字，如：汤小康&#10;Warren 沈自强" style="width:100%; height:55px; margin:4px 0 8px; font-size:0.85rem; padding:6px 10px; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; border-radius:4px;">${item.names || ''}</textarea>

            <label style="font-size:0.75rem; color:#aaa;">拍立得相片 (Polaroid Photo)</label>
            <div style="margin-top:4px;">
              <img id="prev_cw_${idx}" class="coworker-prev-img" src="${item.image_url || 'assets/logo.png'}" style="width:100%; height:110px; object-fit:cover; border-radius:6px; margin-bottom:6px; background:#000; border:1px solid #333;" onerror="this.src='assets/logo.png'">
              <input type="file" id="f_cw_${idx}" style="font-size:0.75rem; width:100%; color:#888;">
              <button class="btn-tiny" style="width:100%; margin-top:4px;" onclick="uploadFile('f_cw_${idx}', 'in_cw_${idx}', 'prev_cw_${idx}')">📤 更换相片</button>
              <input type="hidden" id="in_cw_${idx}" class="coworker-img-val" value="${item.image_url || ''}">
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
    newCard.style = "background:#121212; padding:18px; border-radius:10px; border:1.5px dashed var(--gold); position:relative; display:flex; flex-direction:column; justify-content:space-between; animation:fadeIn 0.3s ease;";
    newCard.innerHTML = `
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span class="coworker-badge" style="color:var(--gold); font-size:0.82rem; font-weight:bold;">${numStr} 新增职务与同工</span>
          <button class="btn-tiny danger" style="padding:2px 8px; font-size:0.75rem;" onclick="removeCoWorkerCard(this)" title="删除此同工职务">🗑️ 删除</button>
        </div>
        
        <label style="font-size:0.75rem; color:#aaa;">中文职务名称 (Role Title) *</label>
        <input type="text" class="coworker-role-input" value="" placeholder="例如：诗歌编曲组" style="width:100%; margin:4px 0 8px; font-size:0.85rem; padding:7px 10px; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; border-radius:4px;">
        
        <label style="font-size:0.75rem; color:#aaa;">英文职务 (Role EN, 可选)</label>
        <input type="text" class="coworker-role-en-input" value="" placeholder="例如：Music Arranger" style="width:100%; margin:4px 0 8px; font-size:0.8rem; padding:6px 10px; background:#1a1a1a; border:1px solid #333; color:#aaa; border-radius:4px;">

        <label style="font-size:0.75rem; color:#aaa;">同工姓名 (成员名单，换行分隔)</label>
        <textarea class="coworker-names-input" placeholder="输入同工名字..." style="width:100%; height:55px; margin:4px 0 8px; font-size:0.85rem; padding:6px 10px; background:#1a1a1a; border:1px solid #333; color: #F6F4F0; border-radius:4px;"></textarea>

        <label style="font-size:0.75rem; color:#aaa;">拍立得相片 (Polaroid Photo)</label>
        <div style="margin-top:4px;">
          <img id="prev_cw_${uid}" class="coworker-prev-img" src="assets/logo.png" style="width:100%; height:110px; object-fit:cover; border-radius:6px; margin-bottom:6px; background:#000; border:1px solid #333;">
          <input type="file" id="f_cw_${uid}" style="font-size:0.75rem; width:100%; color:#888;">
          <button class="btn-tiny" style="width:100%; margin-top:4px;" onclick="uploadFile('f_cw_${uid}', 'in_cw_${uid}', 'prev_cw_${uid}')">📤 上传相片</button>
          <input type="hidden" id="in_cw_${uid}" class="coworker-img-val" value="assets/logo.png">
        </div>
      </div>
    `;
    container.appendChild(newCard);
    updateCoWorkerBadges();
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
      const id = card.dataset.id || `staff_${i+1}`;
      teamList.push({
        id,
        role,
        role_en,
        names,
        image_url: img
      });

      // Maintain backwards compatibility
      aboutData[`about_team_r${i+1}_t`] = role;
      aboutData[`about_team_r${i+1}_te`] = role_en;
      aboutData[`about_team_r${i+1}_names`] = names;
      aboutData[`about_team_r${i+1}_img`] = img;
    });

    for (let k = teamList.length + 1; k <= 30; k++) {
      delete aboutData[`about_team_r${k}_t`];
      delete aboutData[`about_team_r${k}_te`];
      delete aboutData[`about_team_r${k}_names`];
      delete aboutData[`about_team_r${k}_img`];
    }

    aboutData.about_team_list = teamList;

    try {
      await db.from('site_config').upsert({
        key: 'cfg_about_content_json',
        value: JSON.stringify(aboutData)
      }, { onConflict: 'key' });

      alert("🎉 主要服事同工与职务名册已成功保存并实时生效！");
      renderCMS();
    } catch(err) {
      alert("保存失败: " + err.message);
    }
  };

  window.addSinger = async(defaultCat = 'gospel') => {
    const modal = document.createElement('div');
    modal.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:9999; display:flex; justify-content:center; align-items:center; padding:20px; backdrop-filter:blur(10px);";
    modal.innerHTML = `
      <div style="background:#111; border:1.5px solid var(--gold); border-radius:16px; padding:2.2rem; width:100%; max-width:550px; max-height:90vh; overflow-y:auto;">
        <h3 style="color:var(--gold); margin-top:0;">邀请新歌手档案 (Add Singer)</h3>
        
        <div style="margin-bottom:20px; text-align:center; background:#0a0a0a; padding:15px; border-radius:10px; border:1px solid #222;">
          <img id="sprev_new" src="assets/logo.png" style="width:130px; aspect-ratio:3/4; object-fit:cover; border-radius:8px; margin-bottom:10px; background:#181818; border:1px solid #333;">
          <input type="file" id="sfup_new" style="display:block; margin:0 auto; font-size:0.8rem; color:#aaa; width:100%;">
          <button class="btn-tiny" style="margin-top:10px; width:100%;" onclick="uploadFile('sfup_new', 'surl_new', 'sprev_new')">📤 上传歌手照片</button>
          <input type="hidden" id="surl_new" value="">
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
    if(!name) return alert("请输入姓名");
    
    try {
      if(btn) btn.innerText = "处理中...";
      const { error } = await db.from('singers').insert([{ name, role, bio, category, image_url }]);
      if (error) throw error;
      if(btn) btn.closest('div').parentElement.parentElement.remove();
      renderCMS();
    } catch (e) {
      alert("添加失败: " + e.message);
      if(btn) btn.innerText = "确认创建";
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
        <textarea id="sb" style="width:100%; height:120px; margin-bottom:15px; background:#222; color: #F6F4F0; border:1px solid #444; padding:10px;">${s.bio || ''}</textarea>
        
        <label>展示分类 Category</label>
        <select id="scat" style="width:100%; margin-bottom:15px; background: #222; color: #F6F4F0; padding: 10px; border: 1px solid #444;">
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
        <div style="display:flex; gap:10px;">
          <a href="support.html" target="_blank" class="btn-tiny" style="padding:10px 16px; text-decoration:none; display:inline-flex; align-items:center; gap:6px; color:var(--gold); border-color:var(--gold);">
            <i class="fas fa-external-link-alt"></i> 预览前台支持页
          </a>
          <button class="btn btn-submit" style="width:auto; padding:10px 24px;" onclick="saveSupportCMS()">💾 保存支持页面设置</button>
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:2.5rem; max-width:1100px;">
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
              <img id="prev_support_banner" src="${c['cfg_support_banner'] || 'assets/wheat-field.png'}" style="width:100%; height:130px; object-fit:cover; border-radius:6px; margin-bottom:10px; border:1px solid #222;">
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

            <!-- 配图上传 -->
            <div style="background:#111; padding:20px; border-radius:10px; border:1px dashed #333; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center;">
              <label style="display:block; color:var(--gold); font-size:0.85rem; font-weight:bold; margin-bottom:10px;">名字由来展示配图 (Origin Photo)</label>
              <img id="prev_about_origin_img" src="${d('about_origin_img', 'assets/illustrations/morandi-green-tree.jpg')}" style="width:100%; max-height:220px; object-fit:cover; border-radius:8px; margin-bottom:12px; border:1px solid #222;">
              <input type="file" id="f_about_origin_img" style="font-size:0.8rem; width:100%; margin-bottom:8px;">
              <button class="btn-tiny" style="width:100%;" onclick="uploadFile('f_about_origin_img', 'in_about_origin_img', 'prev_about_origin_img')">📤 上传并更换配图</button>
              <input type="hidden" id="in_about_origin_img" value="${d('about_origin_img', 'assets/illustrations/morandi-green-tree.jpg')}">
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
            <label>TNG / DuitNow 联络信息</label>
            <input type="text" id="cfg_support_tng" value="${c['cfg_support_tng']||''}" style="width:100%; margin-bottom:15px; background:#222; border:1px solid #444; color: #F6F4F0;">
            
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
        <h1 style="color:var(--gold);">照片集 Photo Gallery Management</h1>
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
            <input type="text" id="da_fb_instant" value="${album?.fb_url || ''}" placeholder="粘贴 FB 相册链接..." style="flex:1; padding:10px; background:#000; border:1px solid #333; color: #F6F4F0; border-radius:4px;">
            <button class="btn-tiny" onclick="saveDiaryAlbumMinimal('${id}')" style="background:#1877F2; color: #F6F4F0; border:none; padding:0 20px;">更新链接</button>
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
              <button onclick="deleteDiaryPhoto('${p.id}', this)" style="position:absolute; top:5px; right:5px; background:rgba(255,0,0,0.8); border:none; color: #F6F4F0; border-radius:50%; width:20px; height:20px; cursor:pointer; font-size:10px; display:flex; align-items:center; justify-content:center;">✕</button>
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
          <button onclick="deleteDiaryPhoto('${p.id}', this)" style="position:absolute; top:5px; right:5px; background:rgba(255,0,0,0.8); border:none; color: #F6F4F0; border-radius:50%; width:20px; height:20px; cursor:pointer; font-size:10px; display:flex; align-items:center; justify-content:center;">✕</button>
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
