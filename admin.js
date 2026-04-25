
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
  async function renderEvents(container) {
    const { data: rawEvents } = await db.from('events').select('*').order('created_at', {ascending: false});
    
    // Parse metadata if present (Regex for maximum robustness)
    const events = rawEvents?.map(e => {
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
            email_template: meta.et || e.email_template,
            description: desc.replace(metaMatch[0], '').trim()
          };
        } catch (err) {
          console.warn("Meta parse fail:", err);
          return { ...e, description: desc.replace(metaMatch[0], '').trim() };
        }
      }
      return e;
    });

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem;">
        <h1 style="color:var(--gold);">活动预告管理</h1>
        <div style="display:flex; gap:10px;">
          <button class="btn btn-submit" style="width:auto; padding:10px 25px; background:#444;" onclick="triggerBlast()">🚀 一键发送提醒</button>
          <button class="btn btn-submit" style="width:auto; padding:10px 25px;" onclick="openEventModal()">+ 新建活动</button>
        </div>
      </div>
      <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap:20px;">
        ${events?.map(e => `
          <div style="background:#0a0a0a; border:1px solid #222; border-radius:12px; padding:20px; display:flex; flex-direction:column; gap:10px;">
            <img src="${e.image_url || 'https://via.placeholder.com/1920x1080?text=Event+Poster'}" style="width:100%; aspect-ratio:16/9; object-fit:cover; border-radius:8px; border:1px solid #333;">
            <h3 style="margin:0; color:var(--gold);">${e.title}</h3>
            <p style="color:#888; font-size:0.85rem; margin:0;"><i class="fas fa-calendar-alt"></i> ${e.event_date || '未设置日期'} | <i class="fas fa-clock"></i> ${e.event_time || '未设置时间'}</p>
            <div style="display:flex; gap:10px; margin-top:10px; justify-content:flex-end;">
              <button class="btn-tiny" onclick="openEventModal('${e.id}')">编辑</button>
              <button class="btn-tiny danger" onclick="deleteItem('events', '${e.id}')">删除</button>
            </div>
          </div>
        `).join('') || '<p>暂无活动，请点击右上角新建。</p>'}
      </div>
    `;
  }
  
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
    const originalText = btn.innerText;
    if (id) { btn.innerText = "⏳ 正在拉取..."; btn.disabled = true; }

    try {
      let e = null;
      if (id) {
        const { data, error } = await db.from('events').select('*').eq('id', id).single();
        if (error) throw error;
        e = data;
        // Handle meta parsing if description has it
        if (e.description?.includes('EXT_META:')) {
           const metaMatch = e.description.match(/EXT_META:(.*?)\|\|/);
           if (metaMatch) {
              try {
                const meta = JSON.parse(metaMatch[1]);
                e = {
                  ...e,
                  event_date: meta.d || e.event_date,
                  event_time: meta.tm || e.event_time,
                  image_url: meta.img || e.image_url,
                  email_template: meta.et || e.email_template,
                  description: e.description.replace(metaMatch[0], '').trim()
                };
              } catch(err) {}
           }
        }
      }
      const isEdit = !!e;
      const modal = document.createElement('div');
      modal.id = "eventEditModal";
      modal.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:9999; display:flex; justify-content:center; align-items:center; backdrop-filter:blur(8px); padding:20px;";
      modal.innerHTML = `
        <div style="background:#111; border:1px solid var(--gold); border-radius:16px; padding:2rem; width:100%; max-width:550px; max-height:90vh; overflow-y:auto; position:relative; box-shadow: 0 20px 60px rgba(0,0,0,1);">
          <h2 style="color:var(--gold); margin-bottom:1.5rem; text-align:center;">${isEdit ? '编辑活动详情' : '发布新活动'}</h2>
          
          <div style="margin-bottom:20px; background: #0a0a0a; padding: 15px; border-radius: 12px; border:1px solid #222;">
            <label style="display:block; margin-bottom:10px; color:#aaa; font-size:0.8rem; text-transform:uppercase; letter-spacing:1px;">活动海报预览</label>
            <img id="ev_prev" src="${e?.image_url || 'https://via.placeholder.com/1920x1080?text=Harvester+Event'}" style="width:100%; max-height:180px; object-fit:cover; border-radius:8px; margin-bottom:10px; border:1px solid #333;">
            <input type="file" id="f_ev" style="font-size:0.8rem; color:#888;">
            <button class="btn-tiny" style="margin-top:10px; width:100%; padding:8px;" onclick="uploadFile('f_ev', 'ev_url', 'ev_prev')">📤 上传活动海报</button>
            <input type="hidden" id="ev_url" value="${e?.image_url || ''}">
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin-bottom:15px;">
            <div>
              <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem;">活动名称</label>
              <input type="text" id="ev_t" value="${e?.title || ''}" placeholder="例如：赞美祭" style="width:100%; padding:10px;">
            </div>
            <div>
              <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem;">活动地点 (名称)</label>
              <input type="text" id="ev_l" value="${e?.location || ''}" placeholder="例如：吉隆坡大礼堂" style="width:100%; padding:10px;">
            </div>
          </div>

          <div style="margin-bottom:15px;">
            <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem;">Google Map 链接 (可选)</label>
            <input type="text" id="ev_ml" value="${e?.map_url || ''}" placeholder="https://goo.gl/maps/..." style="width:100%; padding:10px;">
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin-bottom:15px;">
            <div>
              <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem;">活动日期</label>
              <input type="date" id="ev_d" value="${e?.event_date || ''}" style="width:100%; padding:10px;">
            </div>
            <div>
              <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem;">开始时间</label>
              <input type="time" id="ev_tm" value="${e?.event_time || ''}" style="width:100%; padding:10px;">
            </div>
          </div>

          <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem;">活动详情描述</label>
          <textarea id="ev_desc" placeholder="请输入活动详情描述..." style="width:100%; height:100px; margin-bottom:15px; padding:10px;">${e?.description || ''}</textarea>

          <label style="display:block; margin-bottom:5px; color:#aaa; font-size:0.8rem;">提醒邮件定制内容 (如果不填则使用系统默认)</label>
          <textarea id="ev_email" placeholder="支持自动换行。例：请记得明天穿白色上衣出席哦！" style="width:100%; height:80px; margin-bottom:20px; padding:10px;">${e?.email_template || ''}</textarea>

          <div style="display:flex; gap:15px; position:sticky; bottom:0; background:#111; padding-top:10px; border-top:1px solid #222;">
            <button class="btn btn-submit" style="flex:2; padding:12px;" onclick="saveEvent('${e?.id || ''}')">🚀 立即保存</button>
            <button class="btn-tiny" style="flex:1;" onclick="this.closest('#eventEditModal').remove()">取消</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    } catch (err) {
      console.error("openEventModal Fail:", err);
      alert("😰 无法加载活动数据: " + (err.message || err));
    } finally {
      if (id) { btn.innerText = originalText; btn.disabled = false; }
    }
  };

  window.saveEvent = async(id) => {
    const btn = document.querySelector('.btn-submit');
    const originalText = btn.innerText;
    btn.innerText = "⏳ 正在同步到云端...";
    btn.disabled = true;

    const payload = {
      title: document.getElementById('ev_t').value,
      event_date: document.getElementById('ev_d').value,
      event_time: document.getElementById('ev_tm').value,
      location: document.getElementById('ev_l').value,
      map_url: document.getElementById('ev_ml').value,
      image_url: document.getElementById('ev_url').value,
      email_template: document.getElementById('ev_email').value,
      description: document.getElementById('ev_desc').value
    };

    try {
      // 尝试直接保存（如果数据库表已有这些栏位）
      const { error } = id 
        ? await db.from('events').update(payload).eq('id', id)
        : await db.from('events').insert([payload]);

      if (error) {
        console.warn("Retrying with fallback due to missing columns:", error);
        // Fallback: 将多余数据打包进 description 避免乱码
        const meta = {
          d: payload.event_date,
          tm: payload.event_time,
          loc: payload.location,
          murl: payload.map_url,
          img: payload.image_url,
          et: payload.email_template
        };
        const fallbackPayload = {
          title: payload.title,
          date: payload.event_date || new Date().toISOString().split('T')[0],
          description: `EXT_META:${JSON.stringify(meta)}||${payload.description}`
        };
        
        const { error: fError } = id 
          ? await db.from('events').update(fallbackPayload).eq('id', id)
          : await db.from('events').insert([fallbackPayload]);
        
        if (fError) throw fError;
      }
      
      const modal = document.getElementById('eventEditModal');
      if (modal) modal.remove();
      renderCMS(); 
    } catch (err) {
      alert("❌ 保存失败: " + err.message);
      btn.innerText = originalText;
      btn.disabled = false;
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
        <label>简介 Bio</label>
        <input type="text" id="s_role_new" placeholder="请输入简介..." style="width:100%; margin-bottom:15px;" value="">
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
    const category = document.getElementById('s_cat_new').value;
    const image_url = document.getElementById('surl_new').value;
    if(!name) return alert("请输入姓名");
    
    try {
      if(btn) btn.innerText = "处理中...";
      const { error } = await db.from('singers').insert([{ name, role, category, image_url }]);
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
        
        <label>简介 Bio</label>
        <input type="text" id="sr" value="${s.role || ''}" style="width:100%; margin-bottom:15px;">
        
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
      // bio field removed as per request
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
    const { data: cfg } = await db.from('site_config').select('value').eq('key', 'cfg_approved_echo_ids').maybeSingle();
    let currentIds = cfg?.value ? cfg.value.split(',') : [];
    
    if (currentlyApproved) {
      currentIds = currentIds.filter(cid => cid !== id.toString());
    } else {
      if (!currentIds.includes(id.toString())) currentIds.push(id.toString());
    }
    
    await db.from('site_config').upsert({ key: 'cfg_approved_echo_ids', value: currentIds.join(',') });
    renderCMS();
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
            <label style="font-size:0.7rem; color:#1877F2;">Facebook URL (Diary Albums)</label><input type="text" id="cfg_diary_fb" value="${c['cfg_diary_fb']||''}" placeholder="每个相册默认跳转的 FB 链接..." style="width:100%; margin-bottom:10px; background:#111; border:1px solid #1877F2; color:#fff;">
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
            <label>我要投稿 海报</label>
            <img id="prev_submit" src="${c['cfg_submit_poster']||''}" style="width:100%; height:120px; object-fit:cover; border-radius:4px; margin:10px 0;">
            <input type="file" id="f_submit">
            <button class="btn-tiny" style="width:100%; margin-top:5px;" onclick="uploadFile('f_submit', 'url_submit', 'prev_submit')">上传海报</button>
            <input type="hidden" id="url_submit" value="${c['cfg_submit_poster']||''}">
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
    const keys = ['cfg_about_text', 'cfg_contact_email', 'cfg_social_fb', 'cfg_diary_fb', 'cfg_social_ig', 'cfg_social_yt'];
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
      {k: 'cfg_submit_poster', v: document.getElementById('url_submit').value},
      {k: 'cfg_submit_btn_link', v: document.getElementById('cfg_submit_btn_link').value},
      {k: 'cfg_submit_text', v: document.getElementById('cfg_submit_text').value}
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

          <div style="margin-bottom:20px; padding:15px; background:rgba(24,119,242,0.1); border:1px solid rgba(24,119,242,0.3); border-radius:8px;">
            <label style="display:block; margin-bottom:10px; color:#1877F2; font-weight:bold; font-size:0.9rem;">
              <i class="fab fa-facebook"></i> Facebook 完整相册链接 (必填建议)
            </label>
            <input type="text" id="da_fb" value="${a?.fb_url || ''}" placeholder="在此粘贴 FB 相册的 https:// 完整链接..." style="width:100%; padding:12px; background:#000; border:1px solid #333; color:white; border-radius:4px;">
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
      cover_url: document.getElementById('da_url').value,
      fb_url: document.getElementById('da_fb').value
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
    const approvedIds = cfg?.value ? cfg.value.split(',') : [];

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem;">
        <h1 style="color:var(--gold);">回声空间留言管理 (Echo Moderation)</h1>
        <p style="color:#666;">审核通过的留言将以 X 轴漂浮方式呈现在“回声空间” 3D 宇宙中。</p>
      </div>
      <div style="background:#0a0a0a; border:1px solid #222; border-radius:12px; padding:20px; overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; color:#eee; min-width:600px;">
          <thead>
            <tr style="border-bottom:1px solid #333; text-align:left; background:#111;">
              <th style="padding:15px; font-size:0.8rem; color:#666;">日期 (Date)</th>
              <th style="padding:15px; font-size:0.8rem; color:#666;">发送者 (Sender)</th>
              <th style="padding:15px; font-size:0.8rem; color:#666;">留言内容 (Echo Message)</th>
              <th style="padding:15px; font-size:0.8rem; color:#666;">状态 (Status)</th>
              <th style="padding:15px; font-size:0.8rem; color:#666; text-align:right;">管理操作 (Actions)</th>
            </tr>
          </thead>
          <tbody>
            ${echoes?.map(e => {
              const isApproved = approvedIds.includes(e.id.toString());
              return `
                <tr style="border-bottom:1px solid #1a1a1a; transition:0.3s;" onmouseover="this.style.background='#111'" onmouseout="this.style.background='transparent'">
                  <td style="padding:15px; font-size:0.8rem; color:#555;">${new Date(e.created_at).toLocaleDateString()}</td>
                  <td style="padding:15px; color:var(--gold); font-weight:500;">${e.name || '神秘听众'}</td>
                  <td style="padding:15px; font-style:italic; color:#ccc;">"${e.message.replace('[ECHO]', '').trim()}"</td>
                  <td style="padding:15px;">
                    <span style="padding:4px 10px; border-radius:50px; font-size:0.7rem; background:${isApproved ? 'rgba(100,210,138,0.1)' : 'rgba(255,255,255,0.05)'}; color:${isApproved ? '#64D28A' : '#444'}; border:1px solid ${isApproved ? 'rgba(100,210,138,0.2)' : 'rgba(255,255,255,0.1)'};">
                      ${isApproved ? '● 已发布/显示中' : '○ 待审核/隐藏'}
                    </span>
                  </td>
                  <td style="padding:15px; text-align:right; white-space:nowrap;">
                    <button class="btn-tiny" style="margin-right:5px; border-color:${isApproved ? '#444' : 'var(--gold)'}; color:${isApproved ? '#888' : 'var(--gold)'};" onclick="toggleEchoApproval('${e.id}', ${isApproved})">
                      ${isApproved ? '取消发布' : '批准发布'}
                    </button>
                    <button class="btn-tiny danger" onclick="deleteItem('contact_messages', '${e.id}')">🗑️</button>
                  </td>
                </tr>
              `;
            }).join('') || '<tr><td colspan="5" style="padding:50px; text-align:center; color:#444;">无回声...</td></tr>'}
          </tbody>
        </table>
      </div>
    `;
  }
});
