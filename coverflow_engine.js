/**
 * 🎵 Harvester 3D Album Cover Flow & Immersive Single Song Engine
 * 1. Each 3D Album Box = 1 Single Track (1 Album = 1 Single)
 * 2. Whimsical Childlike Hand-Drawn & Crayon / Watercolor Doodle Art Covers
 * 3. Continuous 60fps/120fps Smooth Physics Lerp with Momentum Mouse Drag & Swipe
 * 4. 3D Spine-Stacked Rack with Real-Time Depth & Angles
 * 5. Immersive Single Song Experience with PDF Scores, Full Lyrics, YouTube & Spotify
 * 6. Floating Glass Mini-Player Pill with Sound Wave Visualizer
 */

(function() {
  // Curated Collection of Modern Morandi Aesthetic Music Photography & Art
  const morandiPhotos = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80", // Modern aesthetic portrait in muted studio lighting
    "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=900&auto=format&fit=crop&q=80", // Modern architectural geometry in soft Morandi light
    "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=900&auto=format&fit=crop&q=80", // Minimalist botanical in muted sage & clay
    "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=900&auto=format&fit=crop&q=80", // Minimalist misty landscape in slate blue
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=900&auto=format&fit=crop&q=80", // Acoustic studio guitar in warm Morandi tones
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900&auto=format&fit=crop&q=80", // Live music stage in soft muted teal
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=900&auto=format&fit=crop&q=80", // Atmospheric singer portrait in warm amber dusk
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=900&auto=format&fit=crop&q=80", // Audio mastering console in deep slate
    "https://images.unsplash.com/photo-1520523839898-50712509e37b?w=900&auto=format&fit=crop&q=80", // Minimalist grand piano in Morandi kraft
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&auto=format&fit=crop&q=80", // Modern vocalist with microphone in soft monochrome
    "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=900&auto=format&fit=crop&q=80", // Modern violin and sheet music in muted tones
    "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=900&auto=format&fit=crop&q=80"  // Modern vinyl record in dusty rose & sand
  ];
  const childlikeDoodles = morandiPhotos;

  // Default Curated Single Songs (1 Album = 1 Single Track) with Modern Morandi Artwork
  const defaultAlbums = [
    {
      id: "song_renew",
      title: "更新敬拜",
      title_en: "Renewed Worship",
      artist: "Harvester Worship",
      genre: "Worship / CCM · 2025",
      year: "2025",
      theme_color: "#1c2b36",
      spine_bg: "#3b5a5b",
      spine_color: "#ffffff",
      spine_text: "更新敬拜",
      cover_url: morandiPhotos[0],
      duration: "4'18\"",
      audio_url: "",
      youtube_url: "https://www.youtube.com/@harvestermusic.production",
      spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ",
      score_url: "assets/scores/sample.pdf",
      lyrics: `【更新敬拜】
词曲：Harvester Music Production

在祢的光中 我们得见光
圣灵的火 燃烧我们心房
愿祢国度降临 愿祢旨意成全
在这里 更新我们敬拜

主祢的名 在全地何其美
祢的慈爱 存到永远
我们要歌唱 赞美祢的作为
从今时 直到永永远远

（副歌）
更新我们 燃烧我们
以真理和圣灵敬拜祢
生命献上 作活祭
一生跟随 荣耀主名

（桥段）
哈利路亚 荣耀归于全能神
哈利路亚 配得万民称颂
万膝要跪拜 万口要承认
耶稣基督是主！`
    },
    {
      id: "song_fire",
      title: "灵火 Awakening",
      title_en: "Spiritual Fire",
      artist: "Harvester Creative Team",
      genre: "Acoustic Worship · 2024",
      year: "2024",
      theme_color: "#1a242f",
      spine_bg: "#52796f",
      spine_color: "#ffffff",
      spine_text: "灵火 Awakening",
      cover_url: morandiPhotos[1],
      duration: "4'52\"",
      audio_url: "",
      youtube_url: "https://www.youtube.com/@harvestermusic.production",
      spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ",
      score_url: "assets/scores/sample.pdf",
      lyrics: `【灵火】
词曲：Harvester Music Production

灵火 降下 在这安静时刻
照明我心中的每一个角落
我们若认自己的罪
神是信实的 必然赦免我

（副歌）
愿圣灵的烈火 洁净我心思
让我的敬拜 单单归于祢
放下一切重担 紧随祢脚踪
在祢爱中 重获自由与新生`
    },
    {
      id: "song_because_god",
      title: "因为祢 上帝",
      title_en: "Because of You God",
      artist: "Harvester Worship",
      genre: "Praise & Worship · 2025",
      year: "2025",
      theme_color: "#2a2421",
      spine_bg: "#b06d60",
      spine_color: "#ffffff",
      spine_text: "因为祢 上帝",
      cover_url: morandiPhotos[2],
      duration: "5'10\"",
      audio_url: "",
      youtube_url: "https://www.youtube.com/@harvestermusic.production",
      spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ",
      score_url: "assets/scores/sample.pdf",
      lyrics: `【因为祢 上帝】
词曲：Harvester Music Production

因为祢 上帝 赐下丰盛恩典
在旷野开道路 在沙漠开江河
祢是我坚固台 是我避难所
我心单单仰望祢

（副歌）
哈利路亚 赞美归于宝座上的羔羊
哈利路亚 祢配得万民尊崇
从日出之地 到日落之处
祢的名当受称颂`
    },
    {
      id: "song_alive",
      title: "Im Alive",
      title_en: "Im Alive",
      artist: "Harvester Praise",
      genre: "Pop Praise · 2025",
      year: "2025",
      theme_color: "#242f3a",
      spine_bg: "#2d3748",
      spine_color: "#ffffff",
      spine_text: "Im Alive",
      cover_url: morandiPhotos[3],
      duration: "3'45\"",
      audio_url: "",
      youtube_url: "https://www.youtube.com/@harvestermusic.production",
      spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ",
      score_url: "assets/scores/sample.pdf",
      lyrics: `【Im Alive】
Lyrics & Music: Harvester Praise

I'm alive in Your love, Jesus
Every breath I take is by Your grace
From the darkness into Your glorious light
You have set my feet upon the rock!`
    },
    {
      id: "song_harvest_call",
      title: "收割的呼召",
      title_en: "Call to Harvest",
      artist: "Gospel Collective",
      genre: "Gospel / CCM · 2024",
      year: "2024",
      theme_color: "#202933",
      spine_bg: "#c47b6a",
      spine_color: "#ffffff",
      spine_text: "收割的呼召",
      cover_url: morandiPhotos[4],
      duration: "4'15\"",
      audio_url: "",
      youtube_url: "https://www.youtube.com/@harvestermusic.production",
      spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ",
      score_url: "assets/scores/sample.pdf",
      lyrics: `【收割的呼召】
词曲：Harvester Gospel Collective

「那人撒种，这人收割」
庄稼已经熟了，求庄稼的主打发工人出去收祂的庄稼！
愿每一首写给神的歌都被听见，
在各处传扬救恩的喜讯。`
    },
    {
      id: "song_you_are_all",
      title: "祢是唯一",
      title_en: "You Are My All",
      artist: "Harvester Acoustic",
      genre: "Piano Devotional · 2024",
      year: "2024",
      theme_color: "#1c242d",
      spine_bg: "#4a5568",
      spine_color: "#ffffff",
      spine_text: "祢是唯一",
      cover_url: morandiPhotos[5],
      duration: "4'40\"",
      audio_url: "",
      youtube_url: "https://www.youtube.com/@harvestermusic.production",
      spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ",
      score_url: "assets/scores/sample.pdf",
      lyrics: `【祢是唯一】
词曲：Harvester Acoustic

在天地之间，唯有祢是我心所慕，
在黑暗深夜，祢是我唯一的亮光。
主啊，我将我的一切向祢倾心吐意，
因为祢是我永远的福分。`
    },
    {
      id: "song_heart_desire",
      title: "我心所愿",
      title_en: "Heart's Desire",
      artist: "Strings Ensemble",
      genre: "Strings Devotional · 2025",
      year: "2025",
      theme_color: "#2b2a27",
      spine_bg: "#8c7b75",
      spine_color: "#ffffff",
      spine_text: "我心所愿",
      cover_url: morandiPhotos[6],
      duration: "4'55\"",
      audio_url: "",
      youtube_url: "https://www.youtube.com/@harvestermusic.production",
      spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ",
      score_url: "assets/scores/sample.pdf",
      lyrics: `【我心所愿】
词曲：Harvester Strings Ensemble

愿我的祷告如香陈列在祢面前，
愿我举手祈求如献晚祭。
在祢圣所的荣美中，
我得见祢丰盛的慈爱与信实。`
    },
    {
      id: "song_sanctuary",
      title: "在祢圣所中",
      title_en: "In The Sanctuary",
      artist: "Harvester Chamber Choir",
      genre: "Choral Hymn · 2024",
      year: "2024",
      theme_color: "#161d24",
      spine_bg: "#3d5a80",
      spine_color: "#ffffff",
      spine_text: "在祢圣所中",
      cover_url: morandiPhotos[7],
      duration: "5'30\"",
      audio_url: "",
      youtube_url: "https://www.youtube.com/@harvestermusic.production",
      spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ",
      score_url: "assets/scores/sample.pdf",
      lyrics: `【在祢圣所中】
词曲：Harvester Chamber Choir

神啊，祢是我的神，我要切切地寻求祢。
在干旱疲乏无水之地，我渴想祢，我的心切慕祢。
我在圣所中曾如此瞻仰祢，为要见祢的能力和祢的荣耀。`
    },
    {
      id: "song_daybreak",
      title: "晨光破晓",
      title_en: "Daybreak Glory",
      artist: "Harvester Ensemble",
      genre: "Contemporary Worship · 2025",
      year: "2025",
      theme_color: "#1e2229",
      spine_bg: "#6b705c",
      spine_color: "#ffffff",
      spine_text: "晨光破晓",
      cover_url: morandiPhotos[8],
      duration: "4'10\"",
      audio_url: "",
      youtube_url: "https://www.youtube.com/@harvestermusic.production",
      spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ",
      score_url: "assets/scores/sample.pdf",
      lyrics: `【晨光破晓】
词曲：Harvester Ensemble

早晨我们要歌唱祢的慈爱，
因祢是我的避难所，在我急难的日子作我的高台。
黑夜已过，晨光破晓，
愿万民都在清晨苏醒赞美全能的神！`
    }
  ];

  let allAlbums = [...defaultAlbums];
  let currentYearFilter = 'ALL';
  let albums = [...allAlbums];
  let currentIndex = 0;
  let activeSong = null;
  let isPlaying = false;
  let audioPlayer = new Audio();

  // Continuous Physics Drag & Animation State
  let currentProgress = 0; // Continuous floating index (e.g. 0.0 -> 1.45 -> 2.0)
  let targetProgress = 0;  // Target integer/float index
  let isDragging = false;
  let dragStartX = 0;
  let dragStartProgress = 0;
  let lastDragX = 0;
  let lastDragTime = 0;
  let dragVelocity = 0;
  let hasMovedFar = false;
  let isPhysicsRunning = false;

  // Audio Event Listeners
  audioPlayer.addEventListener('ended', () => {
    isPlaying = false;
    updatePlayerUI();
  });

  // Extract unique available years sorted descending
  function getAvailableYears() {
    const years = Array.from(new Set(allAlbums.map(a => String(a.year || '2025')).filter(Boolean)));
    years.sort((a, b) => b.localeCompare(a));
    return years;
  }

  // Sort albums so songs of the same year are grouped together
  function sortAlbumsByYear(list) {
    return [...list].sort((a, b) => {
      const yA = parseInt(a.year || '2025', 10);
      const yB = parseInt(b.year || '2025', 10);
      if (yB !== yA) return yB - yA;
      return (a.title || '').localeCompare(b.title || '');
    });
  }

  // Initialize Engine
  async function init() {
    await fetchSupabaseSongs();
    allAlbums = sortAlbumsByYear(allAlbums);
    albums = [...allAlbums];
    renderAppLayout();
    setupEventListeners();
    setupInteractiveDrag();
    renderMiniPlayer();
    startPhysicsLoop();
  }

  // Fetch Dynamic CMS Songs and Map 1:1 to 3D Albums with Childlike Doodle Art
  async function fetchSupabaseSongs() {
    try {
      if (window.supabase) {
        // 1. Fetch custom 3D albums / singles configuration
        const { data: albumCfg } = await window.supabase.from('site_config').select('value').eq('key', 'cfg_albums_custom_json').maybeSingle();
        let customAlbums = null;
        if (albumCfg && albumCfg.value) {
          try {
            const parsed = JSON.parse(albumCfg.value);
            if (Array.isArray(parsed) && parsed.length > 0) {
              customAlbums = parsed;
            }
          } catch(e) {}
        }

        // 2. Fetch single songs from music_works
        const { data: songs } = await window.supabase.from('music_works').select('*').order('created_at', { ascending: false });
        if (songs && songs.length > 0) {
          const mappedFromDb = songs.map((s, idx) => {
            const doodleFallback = childlikeDoodles[idx % childlikeDoodles.length];
            const customMatch = customAlbums?.find(c => c.id === s.id || c.title === s.title);
            const songYear = s.year || customMatch?.year || "2025";
            
            return {
              id: s.id,
              title: s.title,
              title_en: customMatch?.title_en || "Harvester Single",
              artist: s.artist || customMatch?.artist || "Harvester Worship",
              genre: customMatch?.genre || `Worship / CCM · ${songYear}`,
              year: songYear,
              theme_color: customMatch?.theme_color || ["#1c2b36", "#1a242f", "#2a2421", "#242f3a", "#202933", "#1c242d", "#2b2a27", "#161d24", "#1e2229"][idx % 9],
              spine_bg: customMatch?.spine_bg || ["#3b5a5b", "#52796f", "#b06d60", "#2d3748", "#c47b6a", "#4a5568", "#8c7b75", "#3d5a80", "#6b705c"][idx % 9],
              spine_color: customMatch?.spine_color || "#ffffff",
              spine_text: customMatch?.spine_text || s.title,
              cover_url: s.cover_url || customMatch?.cover_url || doodleFallback,
              duration: "4'15\"",
              audio_url: s.audio_url || "",
              youtube_url: s.audio_url || s.youtube_url || "https://www.youtube.com/@harvestermusic.production",
              spotify_url: s.spotify_url || "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ",
              score_url: s.score_url || "assets/scores/sample.pdf",
              lyrics: s.description ? s.description : `【${s.title}】\n\n词曲：Harvester Music Production\n愿每一首写给神的歌都被听见。\n欢迎下载歌谱使用并在各处传唱。`,
              key_bpm: customMatch?.key_bpm || "KEY: C · 72 BPM",
              scripture: customMatch?.scripture || "「神是个灵，所以拜他的必须用心灵和诚实拜他。」—— 约翰福音 4:24",
              notes: customMatch?.notes || "在瞬息万变、充满喧嚣的世界里，愿我们每一次开口赞美，都是心灵与圣灵的真实对话。",
              composer: customMatch?.composer || s.artist || "Harvester Worship",
              arrangement: customMatch?.arrangement || "Mango Jump & Harvester",
              vocals: customMatch?.vocals || "Creative Vocalists",
              mixing: customMatch?.mixing || "Harvester Studio HQ",
              photo_1: customMatch?.photo_1 || s.cover_url || doodleFallback,
              photo_2: customMatch?.photo_2 || childlikeDoodles[1],
              photo_3: customMatch?.photo_3 || childlikeDoodles[2]
            };
          });

          allAlbums = sortAlbumsByYear(mappedFromDb);
        } else if (customAlbums) {
          allAlbums = sortAlbumsByYear(customAlbums);
        }
      }
    } catch(e) {
      console.warn("CoverFlow Supabase Fetch Note:", e);
    }
  }

  // Render App Master Layout
  function renderAppLayout() {
    const stage = document.getElementById('coverflowStage');
    if (!stage) return;

    const years = getAvailableYears();

    stage.innerHTML = `
      <!-- 1. Top App Navigation Bar with Year Filters -->
      <div class="video-app-header">
        <div class="header-left">
          <div class="sound-bars">
            <span class="bar bar-1"></span>
            <span class="bar bar-2"></span>
            <span class="bar bar-3"></span>
            <span class="bar bar-4"></span>
          </div>
          <span class="app-time font-eng-title">HARVESTER WORSHIP</span>
        </div>

        <div class="header-center">
          <div class="pill-segmented-control" id="yearFilterControl">
            <button class="pill-btn ${currentYearFilter === 'ALL' ? 'active' : ''}" onclick="window.filterByYear('ALL')">
              <span>🎵 全部 (All)</span>
            </button>
            ${years.map(yr => `
              <button class="pill-btn ${currentYearFilter === yr ? 'active' : ''}" onclick="window.filterByYear('${yr}')">
                <span>${yr} 年</span>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="header-right">
          <button class="icon-btn search-trigger" onclick="toggleSearch()" title="搜索歌曲"><i class="fas fa-search"></i></button>
        </div>
      </div>

      <!-- 2. 3D Coverflow Stage (1 Album = 1 Single Track · Arc Cylinder with Infinite Seamless Loop) -->
      <div class="shelf-wrapper" id="shelfWrapper">
        <div class="coverflow-carousel" id="coverflowCarousel" style="touch-action: pan-y; cursor: grab; user-select: none;">
          <!-- Populated by renderCarouselBoxes() -->
        </div>

        <!-- Shelf Meta Caption -->
        <div class="coverflow-meta-bar fade-in">
          <button class="cf-nav-btn prev" onclick="navigateCoverFlow(-1)" title="上一首"><i class="fas fa-chevron-left"></i></button>
          <div class="active-album-info" id="activeAlbumInfo">
            <span class="cf-tag font-eng-title" id="cfAlbumYear">${albums[currentIndex]?.year || '2025'} RELEASE</span>
            <h2 class="cf-album-title" id="cfAlbumTitle">${albums[currentIndex]?.title || ''}</h2>
            <p class="cf-album-artist" id="cfAlbumArtist">${albums[currentIndex]?.artist || ''}</p>
            <button class="btn-open-booklet" onclick="openActiveSongDetail()" type="button">
              <i class="fas fa-music"></i> 翻开单曲与歌谱 (View Song & Scores)
            </button>
          </div>
          <button class="cf-nav-btn next" onclick="navigateCoverFlow(1)" title="下一首"><i class="fas fa-chevron-right"></i></button>
        </div>
      </div>

      <!-- 3. Immersive Single Song Experience View -->
      <div id="immersiveAlbumView" class="immersive-album-view" style="display:none;">
        <!-- Top Toolbar -->
        <div class="immersive-top-bar">
          <button class="immersive-back-btn" onclick="closeSongDetailView()">
            <i class="fas fa-arrow-left"></i> <span>返回 3D 展台</span>
          </button>
          
          <div class="booklet-page-indicator">
            <span class="page-num-pill">HARVESTER ORIGINAL WORSHIP</span>
          </div>

          <button class="immersive-action-btn" onclick="toggleFullscreen()" title="全屏浏览"><i class="fas fa-expand"></i></button>
        </div>

        <!-- Dynamic Content Stage (Single Song Focus) -->
        <div class="immersive-content-stage" id="immersiveStage">
          <!-- Injected dynamically by renderSingleSongDetail -->
        </div>
      </div>

      <!-- 4. Floating Mini-Player Pill (Playback Only, No Modal Jump) -->
      <div class="floating-mini-player" id="floatingMiniPlayer">
        <div class="mini-left" onclick="toggleAudioPlay()">
          <div class="mini-eq-bars" id="miniEqBars">
            <span></span><span></span><span></span>
          </div>
          <img id="miniCover" src="${albums[0]?.cover_url || childlikeDoodles[0]}" alt="Cover">
          <div class="mini-meta">
            <span id="miniTrackTitle" class="mini-track-name">${albums[0]?.title || ''}</span>
            <span id="miniTrackArtist" class="mini-track-artist">${albums[0]?.artist || ''} · 试听片段</span>
          </div>
        </div>
        <div class="mini-right">
          <button class="mini-play-btn" onclick="event.stopPropagation(); toggleAudioPlay();" title="播放 / 暂停试听">
            <i id="miniPlayIcon" class="fas fa-play"></i>
          </button>
        </div>
      </div>
    `;

    renderCarouselBoxes();
    render3DCoverflow();
    updateMetaBar();
  }

  // Render the virtual 3D boxes for the currently active album list
  function renderCarouselBoxes() {
    const carousel = document.getElementById('coverflowCarousel');
    if (!carousel) return;

    const M = albums.length || 1;
    const repeatCount = Math.max(1, Math.ceil(12 / M));
    const virtualList = [];
    for (let r = 0; r < repeatCount; r++) {
      albums.forEach((album, origIdx) => {
        virtualList.push({ album, origIdx, vIdx: virtualList.length });
      });
    }

    carousel.innerHTML = virtualList.map(({ album, origIdx, vIdx }) => `
      <div class="album-3d-box ${origIdx === currentIndex && vIdx === 0 ? 'active' : ''}" data-vindex="${vIdx}" data-real-index="${origIdx}">
        <div class="album-cube">
          <!-- Front Cover Face (Childlike Doodle Art) -->
          <div class="cube-face cube-front">
            <img src="${album.cover_url || childlikeDoodles[origIdx % childlikeDoodles.length]}" alt="${album.title}" draggable="false" onerror="this.src='assets/logo.png'">
            <div class="album-glass-sheen"></div>
            <div class="album-inner-border"></div>
            <!-- Top Left Year Badge -->
            <div style="position:absolute; top:8px; left:8px; background:rgba(0,0,0,0.65); backdrop-filter:blur(6px); border:1px solid rgba(246,210,138,0.3); color:var(--gold); font-size:0.65rem; font-family:var(--font-eng-title); padding:2px 8px; border-radius:50px; z-index:5;">
              ${album.year || '2025'}
            </div>
          </div>

          <!-- Left Spine (Tactile CD Jewel Case Spine with 3D Depth - Title Only) -->
          <div class="cube-face cube-spine-left" style="background: ${album.spine_bg || '#242f3a'};">
            <div class="spine-inner-text">
              <span class="spine-title">${album.title}</span>
            </div>
          </div>

          <!-- Top Thickness Edge -->
          <div class="cube-face cube-top" style="background: ${album.spine_bg || '#242f3a'}; filter: brightness(1.2);"></div>

          <!-- Bottom Thickness Edge -->
          <div class="cube-face cube-bottom"></div>

          <!-- Back Cover Face (Unified with Front Cover Artwork) -->
          <div class="cube-face cube-back">
            <img src="${album.cover_url || childlikeDoodles[origIdx % childlikeDoodles.length]}" alt="${album.title}" draggable="false" onerror="this.src='assets/logo.png'">
            <div class="album-glass-sheen"></div>
            <div class="album-inner-border"></div>
            <!-- Top Right Year Badge -->
            <div style="position:absolute; top:8px; right:8px; background:rgba(0,0,0,0.65); backdrop-filter:blur(6px); border:1px solid rgba(246,210,138,0.3); color:var(--gold); font-size:0.65rem; font-family:var(--font-eng-title); padding:2px 8px; border-radius:50px; z-index:5;">
              ${album.year || '2025'}
            </div>
          </div>
        </div>

        <!-- 3D Ground Shadow -->
        <div class="album-shadow-3d"></div>
      </div>
    `).join('');
  }

  // Filter 3D Albums by Year
  window.filterByYear = function(year) {
    currentYearFilter = year;
    if (year === 'ALL') {
      albums = [...allAlbums];
    } else {
      albums = allAlbums.filter(a => String(a.year || '2025') === String(year));
    }

    if (!albums.length) {
      albums = [...allAlbums];
    }

    currentProgress = 0;
    targetProgress = 0;
    currentIndex = 0;

    // Update pill buttons active state
    const pillBtns = document.querySelectorAll('#yearFilterControl .pill-btn');
    pillBtns.forEach(btn => {
      const isMatch = (year === 'ALL' && btn.innerText.includes('全部')) || btn.innerText.includes(year);
      btn.classList.toggle('active', isMatch);
    });

    renderCarouselBoxes();
    render3DCoverflow();
    updateMetaBar();

    if (year === 'ALL') {
      window.showMorandiToast(`🎵 已展示全部单曲 (共 ${albums.length} 首)`);
    } else {
      window.showMorandiToast(`📅 已筛选：${year} 年度单曲 (共 ${albums.length} 首)`);
    }
  };

  // =================================================================
  // 🚀 HIGH PERFORMANCE 60FPS/120FPS PHYSICS LOOP (BUTTERY SMOOTH)
  // =================================================================
  function startPhysicsLoop() {
    if (isPhysicsRunning) return;
    isPhysicsRunning = true;

    function tick() {
      if (!isDragging) {
        // Continuous Spring Lerp toward targetProgress
        const diff = targetProgress - currentProgress;
        if (Math.abs(diff) > 0.0004) {
          currentProgress += diff * 0.135;
          render3DCoverflow();
        } else if (currentProgress !== targetProgress) {
          currentProgress = targetProgress;
          render3DCoverflow();
          updateMetaBar();
        }
      } else {
        // While dragging, lerp fast for responsive direct-follow feeling
        currentProgress += (targetProgress - currentProgress) * 0.38;
        render3DCoverflow();
      }

      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // Continuous 3D Transform Rendering for Spine-Facing Curved Bookshelf / Display Rack
  function render3DCoverflow() {
    const boxes = document.querySelectorAll('.album-3d-box');
    if (!boxes.length || !albums.length) return;

    const N = boxes.length;
    const M = albums.length;
    const isMobile = window.innerWidth <= 768;
    
    // Spacing: comfortable, breathable distance like a real physical display shelf
    const stepX = isMobile ? 84 : 118;
    const activeRealIdx = ((Math.round(currentProgress) % M) + M) % M;

    boxes.forEach((box, i) => {
      // Modulo wrap circular distance to [-N/2, N/2]
      let rawDiff = i - currentProgress;
      let offset = ((rawDiff % N) + N) % N;
      if (offset > N / 2) {
        offset -= N;
      }

      const absOffset = Math.abs(offset);
      const pActive = Math.max(0, 1 - absOffset); // 1.0 at center, 0.0 when >= 1 unit away

      // 📚 Spine-Facing Curved Display Rack Rotation:
      // Center (offset = 0): Album faces edge-on with its spine forward (rotY ≈ +78° ~ +80°).
      // Left wing (offset < 0): Angles open smoothly to +50° showing the front cover fanned towards the viewer.
      // Right wing (offset > 0): Continues along the natural bookshelf arc (+92° ~ +104°).
      const rotY = 78 + Math.tanh(offset * 0.55) * 28;

      // 📏 Smooth X Spacing
      const x = offset * stepX;

      // 🌌 3D Arc Depth (Z): Center elevated closest to the viewer, outer wings recede smoothly into depth
      const z = (65 * pActive) - (absOffset * 38) - (offset * offset * 3.5);

      // 🔍 Scale: Hero album in center is 1.12x, smoothly tapering to 0.90x along the arc
      const scale = 0.90 + 0.22 * Math.exp(-absOffset * 0.85);

      // 🌟 Opacity Falloff on the far edges of the arc
      let opacity = 1;
      if (absOffset > 4.6) {
        opacity = 0;
      } else if (absOffset > 2.8) {
        opacity = Math.max(0, 1 - (absOffset - 2.8) / 1.8);
      }

      // 📚 3D Stacking Order: Items closer to center are at the highest elevation
      const zIndex = 1000 - Math.round(absOffset * 100);

      const realIdx = parseInt(box.dataset.realIndex, 10);
      const isActive = (realIdx === activeRealIdx) && (absOffset < 0.5);
      box.classList.toggle('active', isActive);

      box.style.display = opacity <= 0.005 ? 'none' : 'block';
      box.style.transform = `translateX(${x.toFixed(2)}px) translateZ(${z.toFixed(2)}px) rotateY(${rotY.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      box.style.zIndex = zIndex;
      box.style.opacity = opacity.toFixed(3);
    });
  }

  // Update Meta Caption for Active Album
  function updateMetaBar() {
    if (!albums.length) return;
    const M = albums.length;
    const activeIdx = ((Math.round(currentProgress) % M) + M) % M;
    currentIndex = activeIdx;
    const cur = albums[activeIdx];
    if (cur) {
      const titleEl = document.getElementById('cfAlbumTitle');
      const artistEl = document.getElementById('cfAlbumArtist');
      const yearEl = document.getElementById('cfAlbumYear');
      if (titleEl && titleEl.innerText !== cur.title) titleEl.innerText = cur.title;
      if (artistEl && artistEl.innerText !== cur.artist) artistEl.innerText = cur.artist;
      if (yearEl) yearEl.innerText = `${cur.year || '2025'} RELEASE`;
    }
  }

  // Navigate Coverflow Left / Right (Infinite Loop)
  window.navigateCoverFlow = function(dir) {
    targetProgress = Math.round(targetProgress) + dir;
    updateMetaBar();
  };

  // =================================================================
  // 🖱️ MOUSE DRAG & TOUCH SWIPE ENGINE (SLIK & FLUID · INFINITE LOOP)
  // =================================================================
  function setupInteractiveDrag() {
    const carousel = document.getElementById('coverflowCarousel');
    const shelf = document.getElementById('shelfWrapper');
    if (!carousel || !shelf) return;

    function handleDragStart(clientX) {
      isDragging = true;
      hasMovedFar = false;
      dragStartX = clientX;
      dragStartProgress = currentProgress;
      lastDragX = clientX;
      lastDragTime = performance.now();
      dragVelocity = 0;
      carousel.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    }

    function handleDragMove(clientX) {
      if (!isDragging) return;
      const dx = clientX - dragStartX;
      if (Math.abs(dx) > 5) hasMovedFar = true;

      const now = performance.now();
      const dt = Math.max(1, now - lastDragTime);
      dragVelocity = (clientX - lastDragX) / dt;
      lastDragX = clientX;
      lastDragTime = now;

      // Sensitivity: ~165px drag = 1 album (Infinite seamless rotation)
      const pxPerAlbum = window.innerWidth <= 768 ? 125 : 165;
      targetProgress = dragStartProgress - (dx / pxPerAlbum);
    }

    function handleDragEnd() {
      if (!isDragging) return;
      isDragging = false;
      carousel.style.cursor = 'grab';
      document.body.style.userSelect = '';

      // Project momentum based on release velocity
      const momentum = -dragVelocity * 14;
      targetProgress = Math.round(targetProgress + momentum);
      updateMetaBar();
    }

    // Mouse Events
    carousel.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return; // Only left click
      handleDragStart(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) handleDragMove(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) handleDragEnd();
    });

    // Touch Events
    carousel.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        handleDragStart(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length === 1) {
        handleDragMove(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      if (isDragging) handleDragEnd();
    }, { passive: true });

    // Click on individual album slab (Supports Infinite Virtual Ring)
    carousel.addEventListener('click', (e) => {
      const box = e.target.closest('.album-3d-box');
      if (!box) return;

      const vIdx = parseInt(box.dataset.vindex, 10);
      const realIdx = parseInt(box.dataset.realIndex, 10);
      if (isNaN(vIdx)) return;

      // If user dragged more than 5px, it was a drag, not a click
      if (hasMovedFar) return;

      const boxes = document.querySelectorAll('.album-3d-box');
      const N = boxes.length;
      let rawDiff = vIdx - currentProgress;
      let offset = ((rawDiff % N) + N) % N;
      if (offset > N / 2) offset -= N;

      if (Math.abs(offset) < 0.45) {
        openSongDetailView(realIdx);
      } else {
        targetProgress = currentProgress + offset;
        updateMetaBar();
      }
    });

    // Mouse Wheel & Trackpad Scroll (Allows Natural Vertical Page Scroll)
    let wheelDebounce;
    shelf.addEventListener('wheel', (e) => {
      // Only hijack when horizontal scrolling (deltaX) is dominant or when holding Shift key.
      // Normal vertical mouse wheel (deltaY) allows the page to scroll down/up naturally!
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
        e.preventDefault();
        const delta = e.shiftKey ? e.deltaY : e.deltaX;
        targetProgress += delta * 0.0028;

        clearTimeout(wheelDebounce);
        wheelDebounce = setTimeout(() => {
          targetProgress = Math.round(targetProgress);
          updateMetaBar();
        }, 90);
      }
    }, { passive: false });
  }

  // Keyboard Navigation
  function setupEventListeners() {
    window.addEventListener('keydown', (e) => {
      const view = document.getElementById('immersiveAlbumView');
      const isImmersive = view && view.style.display === 'flex';

      if (e.key === 'Escape') {
        if (isImmersive) closeSongDetailView();
        return;
      }

      if (!isImmersive) {
        if (e.key === 'ArrowLeft') navigateCoverFlow(-1);
        if (e.key === 'ArrowRight') navigateCoverFlow(1);
      }
    });

    // Global resilience handler for booklet opening
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-open-booklet');
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        window.openActiveSongDetail();
      }
    });
  }

  // =================================================================
  // 🌟 IMMERSIVE SINGLE SONG DETAIL VIEW (1 Album = 1 Single Track)
  // =================================================================
  window.openActiveSongDetail = function() {
    const activeIdx = Math.max(0, Math.min(albums.length - 1, Math.round(currentProgress)));
    window.openSongDetailView(activeIdx);
  };

  window.openSongDetailView = function(idx) {
    if (typeof idx !== 'number' || isNaN(idx)) {
      idx = Math.max(0, Math.min(albums.length - 1, Math.round(currentProgress)));
    }
    activeSong = albums[idx] || albums[0];
    currentIndex = idx;
    targetProgress = idx;
    currentProgress = idx;

    const view = document.getElementById('immersiveAlbumView');
    if (!view) return;

    // Break out of parent stacking contexts (e.g. .fade-in animation) by attaching directly to document.body
    if (view.parentElement !== document.body) {
      document.body.appendChild(view);
    }
    document.body.classList.add('immersive-modal-active');

    view.style.background = activeSong.theme_color || '#1c2b36';
    view.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    renderSingleSongDetail();

    if (window.gsap) {
      gsap.fromTo(view, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" });
      
      const panels = view.querySelectorAll('.accordion-panel');
      if (panels.length >= 3) {
        gsap.killTweensOf(panels);
        // Start from completely closed accordion state
        gsap.set(panels[0], { transformOrigin: 'left center', rotateY: -88, scaleX: 0.05, opacity: 0 });
        gsap.set(panels[1], { transformOrigin: 'left center', rotateY: 88, scaleX: 0.05, opacity: 0 });
        gsap.set(panels[2], { transformOrigin: 'left center', rotateY: -88, scaleX: 0.05, opacity: 0 });

        const tl = gsap.timeline({ delay: 0.12 });
        tl.to(panels[0], { rotateY: 0, scaleX: 1, opacity: 1, duration: 0.65, ease: "cubic.out" })
          .to(panels[1], { rotateY: 0, scaleX: 1, opacity: 1, duration: 0.68, ease: "cubic.out" }, "-=0.45")
          .to(panels[2], { rotateY: 0, scaleX: 1, opacity: 1, duration: 0.72, ease: "cubic.out" }, "-=0.48");
      }
    }
  };

  window.closeSongDetailView = function() {
    const view = document.getElementById('immersiveAlbumView');
    if (!view) return;
    document.body.classList.remove('immersive-modal-active');
    if (window.gsap) {
      gsap.to(view, { opacity: 0, scale: 0.96, duration: 0.3, onComplete: () => {
        view.style.display = 'none';
        document.body.style.overflow = '';
      }});
    } else {
      view.style.display = 'none';
      document.body.style.overflow = '';
    }
  };

  function renderSingleSongDetail() {
    const stage = document.getElementById('immersiveStage');
    if (!stage || !activeSong) return;

    stage.innerHTML = `
      <div class="immersive-page page-1 fade-in" style="align-items:stretch; gap:20px;">
        <!-- Left Column: Frameless Poster & Actions (Seamless with Background) -->
        <div class="imm-left-col" style="background:transparent; border:none; box-shadow:none; padding:6px 10px; justify-content:space-between; position:relative;">
          <div style="position:relative; z-index:2;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-family:var(--font-times); font-size:0.75rem; letter-spacing:2px; background:rgba(0,0,0,0.3); padding:3px 8px; border-radius:4px; color:#4ecdc4;">AUDIO ARCHIVE</span>
              <span style="font-family:var(--font-times); font-size:0.78rem; color:var(--gold);">VOL. 01</span>
            </div>

            <div style="margin-top:6px;">
              <h1 style="font-family:var(--font-eng-title); font-size:2.2rem; font-weight:900; color:#ffffff; line-height:1; letter-spacing:1.5px; margin:0; text-shadow:0 2px 10px rgba(0,0,0,0.5);">
                MANGO JUMP <span style="font-size:1.2rem; color:#4ecdc4;">&#10022;</span>
              </h1>
              <div style="width:110px; height:4px; background:linear-gradient(to right, #ffd166, #4ecdc4, transparent); border-radius:3px; margin-top:5px;"></div>
            </div>
          </div>

          <!-- Center Band Member Cut-out Sticker -->
          <div style="position:relative; z-index:2; margin:10px 0; text-align:center;">
            <div class="cutout-sticker" style="width:190px; height:190px; margin:0 auto; overflow:hidden; position:relative;">
              <img src="${activeSong.cover_url}" alt="${activeSong.title}" style="width:100%; height:100%; object-fit:cover;">
              <div style="position:absolute; bottom:6px; left:6px; right:6px; background:rgba(0,0,0,0.65); backdrop-filter:blur(8px); padding:4px 10px; border-radius:6px; font-size:0.7rem; color:#fff; display:flex; justify-content:space-between;">
                <span>${activeSong.artist}</span>
                <span style="color:var(--gold); font-family:var(--font-times);">${activeSong.year || '2025'}</span>
              </div>
            </div>

            <div style="margin-top:10px;">
              <h2 style="font-family:var(--font-songti), serif; font-size:1.45rem; font-weight:700; color:#fff; margin:0 0 3px; text-shadow:0 2px 8px rgba(0,0,0,0.6);">
                ${activeSong.title}
              </h2>
              <p style="font-size:0.82rem; color:rgba(255,255,255,0.8); margin:0; font-family:var(--font-body);">
                ${activeSong.artist} · ${activeSong.genre || '敬拜单曲'}
              </p>
            </div>
          </div>

          <!-- Bottom Action Buttons -->
          <div style="position:relative; z-index:2; display:flex; flex-direction:column; gap:8px; border-top:1px solid rgba(255,255,255,0.15); padding-top:10px;">
            ${activeSong.score_url ? `
              <a href="${activeSong.score_url}" target="_blank" class="imm-pill-btn" style="background:var(--gold); color:#111; font-weight:700; border:none; padding:9px 14px; box-shadow:0 4px 15px rgba(0,0,0,0.3); font-family:var(--font-body);">
                <i class="fas fa-file-pdf"></i> 下载歌谱 (PDF)
              </a>
            ` : ''}
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
              ${activeSong.youtube_url ? `
                <a href="${activeSong.youtube_url}" target="_blank" class="imm-pill-btn" style="background:rgba(0,0,0,0.4); border-color:rgba(255,255,255,0.25); font-size:0.78rem; padding:8px 6px; font-family:var(--font-times);">
                  <i class="fab fa-youtube" style="color:#ff4d4d;"></i> YouTube
                </a>
              ` : ''}
              ${activeSong.spotify_url ? `
                <a href="${activeSong.spotify_url}" target="_blank" class="imm-pill-btn" style="background:rgba(0,0,0,0.4); border-color:rgba(255,255,255,0.25); font-size:0.78rem; padding:8px 6px; font-family:var(--font-times);">
                  <i class="fab fa-spotify" style="color:#1db954;"></i> Spotify
                </a>
              ` : ''}
            </div>
          </div>
        </div>

        <!-- Right Column: Accordion Fold Stage (风琴折展开: 沙色折页 + 勃艮第红折页 + 浅灰麻布折页) -->
        <div class="imm-right-col">
          <div class="accordion-booklet-stage">
            
            <!-- FOLD 1: 沙色莫兰迪 (WARM KRAFT SAND CREAM) -->
            <div class="accordion-panel unfold-panel-1" style="background:#dfd5c4; color:#2c241c; border-radius:12px 0 0 12px; padding:20px; border-right:1px solid #c9bda8;">
              <div>
                <!-- Top Polaroid Photo (01 badge) -->
                <div style="width:100%; height:130px; border-radius:8px; overflow:hidden; border:2px solid #c9bda8; position:relative; margin-bottom:12px;">
                  <img src="${activeSong.photo_1 || activeSong.cover_url}" alt="Art 01" style="width:100%; height:100%; object-fit:cover; filter:grayscale(80%);" onerror="this.src='assets/logo.png'">
                  <div style="position:absolute; bottom:6px; right:6px; background:#000; color:#fff; font-family:var(--font-times); font-size:0.75rem; padding:2px 8px; border-radius:4px; font-weight:700;">01</div>
                </div>

                <div style="border-bottom:1px solid rgba(44,36,28,0.15); padding-bottom:8px; margin-bottom:12px;">
                  <span style="font-family:var(--font-times); font-size:0.75rem; letter-spacing:2px; color:#7c664d;">FOLD 01 · LYRICS</span>
                  <h3 style="margin:2px 0 0; color:#2c241c; font-size:1.3rem; font-family:var(--font-eng-title); font-weight:700;">完整歌词 (LYRICS)</h3>
                </div>

                <div style="font-family:var(--font-songti), serif; font-size:0.98rem; line-height:1.9; color:#3a3025; white-space:pre-wrap; max-height:260px; overflow-y:auto; padding-right:6px;">
${activeSong.lyrics}
                </div>
              </div>

              <div style="border-top:1px solid rgba(44,36,28,0.15); padding-top:12px; display:flex; justify-content:space-between; font-family:var(--font-times); font-size:0.75rem; color:#6e5d48;">
                <span>${activeSong.key_bpm || 'KEY: C · 72 BPM'}</span>
                <span style="color:#2c241c; font-weight:700;">ORIGINAL MASTER</span>
              </div>
            </div>

            <!-- FOLD 2: 勃艮第红莫兰迪 (MUTED BURGUNDY / WINE) -->
            <div class="accordion-panel unfold-panel-2" style="background:#5c2734; color:#fae8ec; padding:24px; border-right:1px solid #451c27;">
              <div>
                <div style="border-bottom:1px solid rgba(255,255,255,0.15); padding-bottom:8px; margin-bottom:14px;">
                  <span style="font-family:var(--font-times); font-size:0.75rem; letter-spacing:2px; color:var(--gold);">FOLD 02 · WORSHIP INSPIRATION</span>
                  <h3 style="margin:2px 0 0; color:#fff; font-size:1.3rem; font-family:var(--font-eng-title); font-weight:700;">创作心得与经文 (NOTES)</h3>
                </div>

                <div style="font-family:var(--font-songti), serif; font-size:0.95rem; line-height:1.8; color:#f3d7df; space-y:10px;">
                  ${activeSong.scripture ? `
                    <div style="background:rgba(0,0,0,0.25); border-left:3px solid var(--gold); padding:10px 12px; border-radius:4px; font-size:0.85rem; color:var(--gold); margin-bottom:12px;">
                      ${activeSong.scripture}
                    </div>
                  ` : ''}
                  <div style="white-space:pre-wrap; max-height:200px; overflow-y:auto;">
                    ${activeSong.notes || '在瞬息万变、充满喧嚣的世界里，愿我们每一次开口赞美，都是心灵与圣灵的真实对话。'}
                  </div>
                </div>
              </div>

              <!-- Bottom Polaroid photo -->
              <div style="width:100%; height:130px; border-radius:8px; overflow:hidden; border:2px solid rgba(255,255,255,0.2); position:relative; margin-top:16px;">
                <img src="${activeSong.photo_2 || activeSong.cover_url}" alt="Art 02" style="width:100%; height:100%; object-fit:cover; opacity:0.9;" onerror="this.src='${activeSong.cover_url}'">
                <div style="position:absolute; bottom:6px; left:6px; background:rgba(0,0,0,0.6); backdrop-filter:blur(6px); color:var(--gold); font-family:var(--font-times); font-size:0.7rem; padding:2px 8px; border-radius:4px;">
                  WORSHIP HEART · 02
                </div>
              </div>
            </div>

            <!-- FOLD 3: 浅灰麻布莫兰迪 (MUTED LINEN / STONE GREY) -->
            <div class="accordion-panel unfold-panel-3" style="background:#dedad4; color:#26221f; border-radius:0 12px 12px 0; padding:24px;">
              <div>
                <div style="width:100%; height:150px; border-radius:8px; overflow:hidden; border:2px solid #c6c0b6; position:relative; margin-bottom:16px;">
                  <img src="${activeSong.photo_3 || activeSong.cover_url}" alt="Art 03" style="width:100%; height:100%; object-fit:cover; filter:grayscale(80%);" onerror="this.src='${activeSong.cover_url}'">
                  <div style="position:absolute; bottom:6px; right:6px; background:#000; color:#fff; font-family:var(--font-times); font-size:0.75rem; padding:2px 8px; border-radius:4px; font-weight:700;">03</div>
                </div>

                <div style="border-bottom:1px solid rgba(38,34,31,0.15); padding-bottom:8px; margin-bottom:12px;">
                  <span style="font-family:var(--font-times); font-size:0.75rem; letter-spacing:2px; color:#665e56;">FOLD 03 · PRODUCTION CREDITS</span>
                  <h3 style="margin:2px 0 0; color:#26221f; font-size:1.3rem; font-family:var(--font-eng-title); font-weight:700;">同工团队 (CREDITS)</h3>
                </div>

                <div style="font-size:0.85rem; space-y:8px; color:#423b35; font-family:var(--font-body);">
                  <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(38,34,31,0.08); padding-bottom:6px;">
                    <span style="color:#756a60;">词曲创作：</span>
                    <span style="font-weight:600; color:#1c1815;">${activeSong.composer || activeSong.artist}</span>
                  </div>
                  <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(38,34,31,0.08); padding-bottom:6px;">
                    <span style="color:#756a60;">编曲制作：</span>
                    <span style="font-weight:600; color:#1c1815;">${activeSong.arrangement || 'Mango Jump & Harvester'}</span>
                  </div>
                  ${activeSong.vocals ? `
                    <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(38,34,31,0.08); padding-bottom:6px;">
                      <span style="color:#756a60;">人声主唱：</span>
                      <span style="font-weight:600; color:#1c1815;">${activeSong.vocals}</span>
                    </div>
                  ` : ''}
                  <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(38,34,31,0.08); padding-bottom:6px;">
                    <span style="color:#756a60;">录音母带：</span>
                    <span style="font-weight:600; color:#1c1815;">${activeSong.mixing || 'Harvester Studio HQ'}</span>
                  </div>
                </div>
              </div>

              <div style="border-top:1px solid rgba(38,34,31,0.15); padding-top:12px; display:flex; justify-content:space-between; align-items:center;">
                <span style="font-family:var(--font-times); font-size:0.75rem; color:#665e56;">PDF SCORES</span>
                <button onclick="toggleAudioPlay()" class="imm-pill-btn" style="background:#26221f; color:#dedad4; border:none; font-size:0.8rem; padding:6px 14px; font-family:var(--font-times);">
                  <i id="lyricsPlayBtnIcon" class="fas ${isPlaying ? 'fa-pause' : 'fa-play'}"></i> ${isPlaying ? '暂停' : '试听'}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    `;
  }

  // Audio Playback Engine
  window.toggleAudioPlay = function() {
    if (isPlaying) {
      audioPlayer.pause();
      isPlaying = false;
    } else {
      const cur = activeSong || albums[Math.round(currentProgress)];
      if (cur?.audio_url) {
        audioPlayer.src = cur.audio_url;
        audioPlayer.play().catch(e => console.warn(e));
      }
      isPlaying = true;
    }
    updatePlayerUI();
  };

  function updatePlayerUI() {
    const miniPlayIcon = document.getElementById('miniPlayIcon');
    const miniEqBars = document.getElementById('miniEqBars');
    const miniCover = document.getElementById('miniCover');
    const miniTitle = document.getElementById('miniTrackTitle');
    const miniArtist = document.getElementById('miniTrackArtist');
    const lyricsPlayBtnIcon = document.getElementById('lyricsPlayBtnIcon');

    if (miniPlayIcon) miniPlayIcon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
    if (lyricsPlayBtnIcon) lyricsPlayBtnIcon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
    if (miniEqBars) miniEqBars.classList.toggle('playing', isPlaying);

    const cur = activeSong || albums[Math.round(currentProgress)];
    if (cur) {
      if (miniCover) miniCover.src = cur.cover_url;
      if (miniTitle) miniTitle.innerText = cur.title;
      if (miniArtist) miniArtist.innerText = cur.artist;
    }
  }

  function renderMiniPlayer() {
    updatePlayerUI();
  }

  window.handleMiniPlayerClick = function() {
    openSongDetailView(Math.round(currentProgress));
  };

  window.toggleFullscreen = function() {
    const view = document.getElementById('immersiveAlbumView');
    if (!document.fullscreenElement) {
      view.requestFullscreen().catch(err => console.warn(err));
    } else {
      document.exitFullscreen().catch(err => console.warn(err));
    }
  };

  // =================================================================
  // 🎨 BESPOKE MORANDI SEARCH MODAL & INTERACTIVE TOAST SYSTEM
  // =================================================================
  function initMorandiSearchModal() {
    if (document.getElementById('morandiSearchModal')) return;

    // 1. Inject Morandi Search Modal DOM
    const modalHtml = `
      <div id="morandiSearchModal" class="morandi-search-modal" role="dialog" aria-modal="true">
        <div class="morandi-search-backdrop" onclick="window.toggleSearch(false)"></div>
        <div class="morandi-search-dialog">
          <div class="morandi-search-header">
            <div class="morandi-search-tag">
              <i class="fas fa-search"></i>
              <span>单曲搜索 · SONG SEARCH</span>
            </div>
            <button class="morandi-search-close" onclick="window.toggleSearch(false)" title="关闭 (Esc)">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="morandi-search-body">
            <label class="morandi-search-label" for="morandiSearchInput">请输入要搜索的歌曲名称或歌手：</label>
            <div class="morandi-search-input-wrap">
              <i class="fas fa-music morandi-input-icon"></i>
              <input type="text" id="morandiSearchInput" class="morandi-search-input" placeholder="输入歌名、歌手或关键字..." autocomplete="off" />
              <button id="morandiSearchClear" class="morandi-input-clear" style="display:none;" onclick="window.clearSearchInput()">
                <i class="fas fa-times-circle"></i>
              </button>
            </div>

            <div id="morandiSearchSuggestions" class="morandi-search-suggestions" style="margin-top: 10px;">
              <!-- Dynamically populated live suggestions -->
            </div>
          </div>

          <div class="morandi-search-footer">
            <button class="morandi-btn-cancel" onclick="window.toggleSearch(false)">取消 Cancel</button>
            <button class="morandi-btn-confirm" onclick="window.executeMorandiSearch()">定位单曲 Jump</button>
          </div>
        </div>
      </div>

      <!-- Morandi Floating Toast -->
      <div id="morandiToast" class="morandi-toast">
        <i class="fas fa-compact-disc" style="color:var(--gold);"></i>
        <span id="morandiToastText">已定位到歌曲</span>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // 2. Setup Input and Keyboard Events
    const input = document.getElementById('morandiSearchInput');
    const clearBtn = document.getElementById('morandiSearchClear');

    if (input) {
      input.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (clearBtn) clearBtn.style.display = query ? 'block' : 'none';
        renderSearchSuggestions(query);
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          window.executeMorandiSearch();
        } else if (e.key === 'Escape') {
          window.toggleSearch(false);
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.getElementById('morandiSearchModal');
        if (modal && modal.classList.contains('active')) {
          window.toggleSearch(false);
        }
      }
    });
  }

  function renderSearchSuggestions(query) {
    const list = document.getElementById('morandiSearchSuggestions');
    if (!list) return;

    let filtered = albums;
    if (query) {
      const q = query.toLowerCase();
      filtered = albums.filter(a => 
        (a.title && a.title.toLowerCase().includes(q)) || 
        (a.title_en && a.title_en.toLowerCase().includes(q)) || 
        (a.artist && a.artist.toLowerCase().includes(q)) ||
        (a.lyrics && a.lyrics.toLowerCase().includes(q))
      );
    }

    if (!filtered.length) {
      list.innerHTML = `
        <div style="text-align:center; padding: 20px 10px; color: #9c9083; font-size: 0.85rem;">
          <i class="fas fa-ghost" style="font-size: 1.4rem; margin-bottom: 8px; display:block; opacity:0.6;"></i>
          未找到与「${query}」匹配的单曲，换个关键词试试吧
        </div>
      `;
      return;
    }

    list.innerHTML = filtered.map((a) => {
      const realIdx = albums.findIndex(item => item.id === a.id);
      return `
        <div class="morandi-search-item" onclick="window.selectSearchResult(${realIdx})">
          <div class="morandi-item-left">
            <img src="${a.cover_url || childlikeDoodles[realIdx % childlikeDoodles.length]}" class="morandi-item-thumb" alt="${a.title}" />
            <div>
              <div class="morandi-item-title">${a.title}</div>
              <div class="morandi-item-artist">${a.artist} · ${a.year || '2025'}</div>
            </div>
          </div>
          <div class="morandi-item-badge">
            <i class="fas fa-arrow-right" style="font-size: 0.7rem; margin-right: 4px;"></i> 定位
          </div>
        </div>
      `;
    }).join('');
  }

  window.toggleSearch = function(forceState) {
    initMorandiSearchModal();
    const modal = document.getElementById('morandiSearchModal');
    if (!modal) return;

    const isActive = forceState !== undefined ? forceState : !modal.classList.contains('active');
    modal.classList.toggle('active', isActive);

    if (isActive) {
      const input = document.getElementById('morandiSearchInput');
      const clearBtn = document.getElementById('morandiSearchClear');
      if (input) {
        input.value = '';
        if (clearBtn) clearBtn.style.display = 'none';
        renderSearchSuggestions('');
        setTimeout(() => input.focus(), 60);
      }
    }
  };

  window.clearSearchInput = function() {
    const input = document.getElementById('morandiSearchInput');
    const clearBtn = document.getElementById('morandiSearchClear');
    if (input) {
      input.value = '';
      input.focus();
    }
    if (clearBtn) clearBtn.style.display = 'none';
    renderSearchSuggestions('');
  };

  window.selectSearchResult = function(realIdx) {
    if (realIdx >= 0 && realIdx < albums.length) {
      targetProgress = realIdx;
      updateMetaBar();
      window.toggleSearch(false);
      window.showMorandiToast(`🎵 已定位到单曲：《${albums[realIdx].title}》`);
    }
  };

  window.executeMorandiSearch = function() {
    const input = document.getElementById('morandiSearchInput');
    const query = input ? input.value.trim().toLowerCase() : '';
    
    if (!query) {
      window.toggleSearch(false);
      return;
    }

    const foundIdx = albums.findIndex(a => 
      (a.title && a.title.toLowerCase().includes(query)) || 
      (a.title_en && a.title_en.toLowerCase().includes(query)) || 
      (a.artist && a.artist.toLowerCase().includes(query))
    );

    if (foundIdx !== -1) {
      window.selectSearchResult(foundIdx);
    } else {
      window.showMorandiToast(`⚠️ 未找到与「${query}」相关的单曲`);
    }
  };

  let toastTimer = null;
  window.showMorandiToast = function(msg) {
    initMorandiSearchModal();
    const toast = document.getElementById('morandiToast');
    const text = document.getElementById('morandiToastText');
    if (!toast || !text) return;

    text.innerText = msg;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  };

  // Boot on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
