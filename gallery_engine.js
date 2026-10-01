/**
 * Gallery Engine v10.0 - EXHIBITION & CO-WORKERS EDITION
 * Minimalist Editorial Layout for Key Co-workers & Artists (主要同工与歌手).
 */

let db;
let allArtists = [];

const defaultCoreStaff = [
  {
    id: "staff_txk",
    name: "汤小康",
    category: "core",
    role: "平台创办启发人 / 音乐顾问",
    image_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    bio: "马来西亚知名音乐制作人、词曲创作者与唱作歌手。怀揣对神国度音乐的负担，启发创立收割机创作工作坊，致力于发掘并培育新一代福音音乐与敬拜创作者，让更多写给神的原创音乐在全地传唱。"
  },
  {
    id: "staff_warren",
    name: "Warren 沈自强",
    category: "core",
    role: "平台创办启发人 / 创作总监",
    image_url: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
    bio: "收割机核心创作启发者与敬拜主领。长年投身于现代基督教音乐（CCM）创作与敬拜赞美服事，带领创作团队以真理与灵感打磨每一首诗歌，传递扎实的福音信息与恩膏。"
  },
  {
    id: "staff_natasha",
    name: "Natasha",
    category: "core",
    role: "诗歌创作 / 宣发与推广",
    image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    bio: "诗歌创作人与事工宣发同工。以细腻的灵性触觉撰写触动人心的歌词，并负责收割机各大数位平台的内容推广与社群连结，让福音音符触达更多年轻群体。"
  },
  {
    id: "staff_production",
    name: "音乐制作团队",
    category: "core",
    role: "编曲 / 录音 / 混音与母带",
    image_url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80",
    bio: "由资深基督徒音乐人与录音工程师组成的制作团队，秉持专业卓越的标准，为每一首收割机作品提供高水准的编曲、器乐录制、人声配唱及母带后期制作。"
  },
  {
    id: "staff_media",
    name: "影视与视觉团队",
    category: "core",
    role: "MV 拍摄 / 视觉设计 / 影像记录",
    image_url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
    bio: "负责收割机官方 MV 拍摄制作、专辑封面美学设计与田野日志影像记录，以现代电影感画面传递每首诗歌背后的属灵故事。"
  },
  {
    id: "staff_admin",
    name: "行政与事工联络",
    category: "core",
    role: "事工行政 / 版权管理 / 合作对接",
    image_url: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80",
    bio: "负责创作者版权登记、版税收益结算分配、海内外教会与机构合作对接，保障合作透明、规范与长远发展。"
  }
];

async function initGallery() {
  db = window.supabase;
  await fetchArtists();
}

async function fetchArtists() {
  try {
    let remoteArtists = [];
    if (db) {
      const { data, error } = await db.from('singers').select('*').order('display_order', { ascending: true });
      if (!error && data) remoteArtists = data;
    }
    
    // Combine core staff with Supabase singers
    allArtists = [...defaultCoreStaff, ...remoteArtists];
    
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
      <div class="img-wrapper">
        <img src="${artist.image_url || 'assets/placeholder.jpg'}" alt="${artist.name}" loading="lazy">
      </div>
      <div class="artist-meta">
        <span class="tag">${getTagLabel(artist.category)}</span>
        <h3>${artist.name}</h3>
        <p class="statement">${artist.role || '主要服事同工'}</p>
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

  if (imgEl) imgEl.src = artist.image_url || 'assets/placeholder.jpg';
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
