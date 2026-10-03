/**
 * Gallery Engine v11.0 - EXHIBITION & CO-WORKERS EDITION
 * Seamless Two-Way Sync with Admin CMS (主要同工与歌手).
 */

let db;
let allArtists = [];

const defaultCoreStaff = [
  {
    id: "staff_txk",
    name: "汤小康 & Warren 沈自强",
    category: "core",
    role: "创作平台创办启发人",
    image_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    bio: "马来西亚知名音乐制作人与敬拜主领。怀揣对神国度音乐的负担，启发创立收割机创作工作坊，致力于发掘并培育新一代福音音乐与敬拜创作者，让更多写给神的原创音乐在全地传唱。"
  },
  {
    id: "staff_warren",
    name: "Warren 沈自强",
    category: "core",
    role: "创作",
    image_url: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
    bio: "收割机核心创作启发者与敬拜主领。长年投身于现代基督教音乐（CCM）创作与敬拜赞美服事，带领创作团队以真理与灵感打磨每一首诗歌，传递扎实的福音信息与恩膏。"
  },
  {
    id: "staff_prod",
    name: "汤小康 & 制作团队",
    category: "core",
    role: "制作",
    image_url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80",
    bio: "由资深基督徒音乐人与录音工程师组成的制作团队，秉持专业卓越的标准，为每一首收割机作品提供高水准的编曲、器乐录制、人声配唱及母带后期制作。"
  },
  {
    id: "staff_media",
    name: "陈宏亮 / 影视设计组",
    category: "core",
    role: "拍摄 / 影视设计",
    image_url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80",
    bio: "负责收割机官方 MV 拍摄制作、专辑封面美学设计与照片集影像记录，以现代电影感画面传递每首诗歌背后的属灵故事。"
  },
  {
    id: "staff_promo",
    name: "Sherlyn / 企划团队",
    category: "core",
    role: "宣传 / 企划推广",
    image_url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80",
    bio: "负责收割机各大数位平台的内容推广与社群连结，让福音音符触达更多年轻群体。"
  },
  {
    id: "staff_admin",
    name: "梁苡乐 / 行政支持团队",
    category: "core",
    role: "行政",
    image_url: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80",
    bio: "负责创作者版权登记、版税收益结算分配、海内外教会与机构合作对接，保障合作透明、规范与长远发展。"
  },
  {
    id: "staff_singers",
    name: "依歌曲需求而定",
    category: "core",
    role: "歌手与主领",
    image_url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
    bio: "汇聚海内外优秀福音歌手与敬拜主领，根据每首诗歌的特色与属灵定位，邀请最契合的嗓音与心声共同诠释。"
  }
];

async function initGallery() {
  db = window.supabase;
  await fetchArtists();
}

async function fetchArtists() {
  try {
    let coreStaffList = [...defaultCoreStaff];
    let remoteSingers = [];

    if (db) {
      // 1. Fetch customized Core Co-workers from site_config cfg_about_content_json
      const { data: cfg } = await db.from('site_config').select('value').eq('key', 'cfg_about_content_json').maybeSingle();
      if (cfg && cfg.value) {
        try {
          const customTeam = typeof cfg.value === 'string' ? JSON.parse(cfg.value) : cfg.value;
          
          if (customTeam && Array.isArray(customTeam.about_team_list) && customTeam.about_team_list.length > 0) {
            coreStaffList = customTeam.about_team_list
              .filter(item => !item.hidden && !item.is_hidden && item.hidden !== 'true')
              .map((item, idx) => ({
                id: item.id || `custom_staff_${idx + 1}`,
                name: (item.names || item.name || `服事同工 ${idx + 1}`).replace(/\n/g, ' & '),
                category: "core",
                role: item.role || item.roleTitle || "主要服事同工",
                role_en: item.role_en || item.roleTitleEn || "",
                image_url: item.image_url || item.img || "assets/logo.png",
                img_pos: item.img_pos || item.pos || "50% 20%",
                img_zoom: item.img_zoom || item.zoom || 1.0,
                bio: `${item.role || '主要服事同工'}：${(item.names || item.name || '').replace(/\n/g, '、')}\n\n忠心服事神国度，将恩赐化为敬拜的赞美与见证。`
              }));
          } else if (customTeam) {
            const dynamicCore = [];
            for (let i = 1; i <= 20; i++) {
              const isHidden = customTeam[`about_team_r${i}_hidden`] === true || customTeam[`about_team_r${i}_hidden`] === 'true';
              if (isHidden) continue;

              const roleTitle = customTeam[`about_team_r${i}_t`];
              const roleTitleEn = customTeam[`about_team_r${i}_te`];
              const names = customTeam[`about_team_r${i}_names`];
              const img = customTeam[`about_team_r${i}_img`];
              const pos = customTeam[`about_team_r${i}_pos`];
              const zoom = customTeam[`about_team_r${i}_zoom`];

              if (roleTitle || names || img) {
                dynamicCore.push({
                  id: `custom_staff_r${i}`,
                  name: (names || defaultCoreStaff[i-1]?.name || `服事团队 ${i}`).replace(/\n/g, ' & '),
                  category: "core",
                  role: roleTitle || defaultCoreStaff[i-1]?.role || "主要服事同工",
                  role_en: roleTitleEn || defaultCoreStaff[i-1]?.role_en || "",
                  image_url: img || defaultCoreStaff[i-1]?.image_url || "assets/logo.png",
                  img_pos: pos || "50% 20%",
                  img_zoom: zoom ? parseFloat(zoom) : 1.0,
                  bio: `${roleTitle || '主要服事同工'}：${names || ''}\n\n忠心服事神国度，将恩赐化为敬拜的赞美与见证。`
                });
              } else if (i <= defaultCoreStaff.length && defaultCoreStaff[i-1]) {
                dynamicCore.push(defaultCoreStaff[i-1]);
              }
            }

            if (dynamicCore.length > 0) {
              coreStaffList = dynamicCore;
            }
          }
        } catch(e) {
          console.warn("Parse team config note:", e);
        }
      }

      // 2. Fetch custom singers and coworkers from singers table & check hidden list
      const { data: hiddenCfg } = await db.from('site_config').select('value').eq('key', 'cfg_hidden_singer_ids').maybeSingle();
      let hiddenSingerIds = [];
      if (hiddenCfg && hiddenCfg.value) {
        try {
          hiddenSingerIds = typeof hiddenCfg.value === 'string' ? JSON.parse(hiddenCfg.value) : hiddenCfg.value;
        } catch(e) {}
      }
      if (!Array.isArray(hiddenSingerIds)) hiddenSingerIds = [];

      const { data: singersData, error } = await db.from('singers').select('*').order('display_order', { ascending: true });
      if (!error && singersData) {
        remoteSingers = singersData.filter(s => !hiddenSingerIds.includes(s.id) && !s.hidden && !s.is_hidden && s.status !== 'hidden');
      }
    }
    
    // Separate core vs singers from Supabase
    const dbCore = remoteSingers.filter(s => s.category === 'core' || s.category === '同工');
    const dbGospelAndWorship = remoteSingers.filter(s => s.category !== 'core' && s.category !== '同工');

    // Seamlessly combine core staff from config with any extra coworkers added to singers table
    const combinedCore = [...coreStaffList];
    if (dbCore.length > 0) {
      dbCore.forEach(dbItem => {
        const exists = combinedCore.some(c => c.name === dbItem.name || c.id === dbItem.id);
        if (!exists) combinedCore.push(dbItem);
      });
    }

    // Combine core staff with Supabase singers
    allArtists = [...combinedCore, ...dbGospelAndWorship];
    
    // Check URL params
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'worship') switchCategory('敬拜');
    else if (tab === 'gospel') switchCategory('福音');
    else switchCategory('同工'); 
    
  } catch (err) {
    console.error("Gallery Fetch Error:", err);
    allArtists = [...defaultCoreStaff];
    switchCategory('同工');
  }
}

function renderGrid(data) {
  const container = document.getElementById('artist-grid');
  if (!container) return;
  
  if (data.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-muted); font-size: 1.1rem;">暂无同工信息，欢迎持续关注。</div>`;
    return;
  }

  container.innerHTML = data.map((artist) => `
    <div class="artist-card" onclick="showOverlay(${JSON.stringify(artist).replace(/"/g, '&quot;')})">
      <div class="card-upper-row">
        <!-- 竖排姓名像书脊 (Vertical Spine-style Name) -->
        <div class="card-spine-name">
          <span class="spine-name-text">${artist.name}</span>
        </div>
        <!-- 肖像大图 (Portrait Photo - 完美支持后台自定义裁剪区域与缩放) -->
        <div class="img-wrapper">
          <img src="${artist.image_url || 'assets/logo.png'}" 
               alt="${artist.name}" 
               loading="lazy" 
               style="object-position: ${artist.img_pos || '50% 20%'}; transform: scale(${artist.img_zoom || 1.0});" 
               onerror="this.src='assets/logo.png'">
        </div>
      </div>
      <!-- 底部双栏极简信息 (Minimalist Bottom Bar) -->
      <div class="card-bottom-bar">
        <span class="bottom-role" title="${artist.role || ''}">${artist.role || '主要服事同工'}</span>
        ${artist.role_en && artist.role_en.trim() ? `<span class="bottom-category">${artist.role_en.trim()}</span>` : ''}
      </div>
    </div>
  `).join('');

  if (window.gsap) {
    gsap.from(".artist-card", {
      y: 25,
      opacity: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: "power3.out"
    });
  }
}

function getTagCategoryLabel(cat) {
  if (cat === 'core' || cat === '同工') return 'Key Co-worker';
  if (cat === 'gospel' || cat === '福音') return 'Gospel Singer';
  if (cat === 'worship' || cat === '敬拜') return 'Worship Leader';
  return 'Harvester Music';
}

function getTagLabel(cat) {
  if (cat === 'core' || cat === '同工') return 'KEY CO-WORKER / 主要同工';
  if (cat === 'gospel' || cat === '福音') return 'GOSPEL SINGER / 福音歌手';
  if (cat === 'worship' || cat === '敬拜') return 'WORSHIP LEADER / 敬拜歌手';
  return 'HARVESTER TEAM';
}

window.switchCategory = function(cat) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  
  let filtered = [];
  if (cat === '同工') {
    const el = document.getElementById('tab-core');
    if (el) el.classList.add('active');
    filtered = allArtists.filter(s => s.category === 'core' || s.category === '同工' || !s.category);
  } else if (cat === '福音') {
    const el = document.getElementById('tab-gospel');
    if (el) el.classList.add('active');
    filtered = allArtists.filter(s => s.category === 'gospel' || s.category === '福音');
  } else if (cat === '敬拜') {
    const el = document.getElementById('tab-worship');
    if (el) el.classList.add('active');
    filtered = allArtists.filter(s => s.category === 'worship' || s.category === '敬拜');
  } else {
    filtered = allArtists;
  }

  if (window.gsap) {
    gsap.to(".artist-card", {
      opacity: 0,
      y: 10,
      duration: 0.25,
      onComplete: () => renderGrid(filtered)
    });
  } else {
    renderGrid(filtered);
  }
};

window.showOverlay = function(artist) {
  const overlay = document.getElementById('detail-overlay');
  if (!overlay) return;
  
  const imgEl = document.getElementById('modal-img');
  const nameEl = document.getElementById('modal-name');
  const tagEl = document.getElementById('modal-tag');
  const bioEl = document.getElementById('modal-bio');

  if (imgEl) {
    imgEl.src = artist.image_url || 'assets/logo.png';
    imgEl.style.objectPosition = artist.img_pos || '50% 20%';
    imgEl.style.transform = `scale(${artist.img_zoom || 1.0})`;
  }
  if (nameEl) nameEl.innerText = artist.name;
  if (tagEl) tagEl.innerText = getTagLabel(artist.category) + ` · ${artist.role || ''}`;
  if (bioEl) bioEl.innerText = artist.bio || "收割机主要服事同工，同心合意奔跑天路。";
  
  overlay.style.display = 'block';
  document.body.style.overflow = 'hidden';
  
  if (window.gsap) {
    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.35 });
    gsap.fromTo(".modal-container", { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" });
  }
};

window.hideOverlay = function() {
  const overlay = document.getElementById('detail-overlay');
  if (!overlay) return;
  if (window.gsap) {
    gsap.to(".modal-container", { y: 20, opacity: 0, duration: 0.2 });
    gsap.to(overlay, { opacity: 0, duration: 0.2, onComplete: () => {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }});
  } else {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }
};

document.addEventListener('DOMContentLoaded', initGallery);
