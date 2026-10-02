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
  // Curated Collection of Modern Morandi Aesthetic Graphic & Abstract Art (No Portraits)
  const morandiPhotos = [
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
      theme_color: "#182222",
      spine_bg: "#607272",
      spine_color: "#F6F4F0",
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
      theme_color: "#211b27",
      spine_bg: "#6c6374",
      spine_color: "#F6F4F0",
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
      theme_color: "#210e14",
      spine_bg: "#52222e",
      spine_color: "#F6F4F0",
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
      theme_color: "#1b241d",
      spine_bg: "#556958",
      spine_color: "#F6F4F0",
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
      theme_color: "#241b1f",
      spine_bg: "#755963",
      spine_color: "#F6F4F0",
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
      theme_color: "#182222",
      spine_bg: "#607272",
      spine_color: "#F6F4F0",
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
      theme_color: "#211b27",
      spine_bg: "#6c6374",
      spine_color: "#F6F4F0",
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
      theme_color: "#210e14",
      spine_bg: "#52222e",
      spine_color: "#F6F4F0",
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
      theme_color: "#1b241d",
      spine_bg: "#556958",
      spine_color: "#F6F4F0",
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

  // Audio Event Listeners (15s Preview Limit & UI Lifecycle)
  audioPlayer.addEventListener('timeupdate', () => {
    // Exact 15-second preview cap as requested by user
    if (isPlaying && audioPlayer.currentTime >= 15.5) {
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
      isPlaying = false;
      updatePlayerUI();
      if (typeof window.showMorandiToast === 'function') {
        window.showMorandiToast('✨ 15 秒试听结束，欢迎翻开唱片内页查看完整作品与歌谱');
      }
    }
  });

  audioPlayer.addEventListener('ended', () => {
    isPlaying = false;
    audioPlayer.currentTime = 0;
    updatePlayerUI();
  });

  audioPlayer.addEventListener('error', (e) => {
    console.warn("Audio playback error:", e);
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
    allAlbums = allAlbums.map((a, idx) => {
      const pal = a.palette || getMorandiFivePalette(a, idx);
      return {
        ...a,
        palette: pal,
        theme_color: a.theme_color || pal.theme_color,
        spine_bg: a.spine_bg || pal.spine_bg,
        glow: pal.glow
      };
    });
    allAlbums = sortAlbumsByYear(allAlbums);
    albums = [...allAlbums];
    renderAppLayout();
    setupEventListeners();
    setupInteractiveDrag();
    renderMiniPlayer();
    startPhysicsLoop();
  }

  // Fetch Dynamic CMS Songs and Map 1:1 to 3D Albums with Morandi Artwork
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
            const songYear = customMatch?.year || s.year || "2025";
            const pal = getMorandiFivePalette(customMatch || s, idx);
            
            return {
              id: s.id,
              title: s.title,
              title_en: customMatch?.title_en || "Harvester Single",
              artist: customMatch?.artist || s.artist || "Harvester Worship",
              genre: customMatch?.genre || `Worship / CCM · ${songYear}`,
              year: songYear,
              palette_id: customMatch?.palette_id || pal.id,
              palette: pal,
              theme_color: customMatch?.theme_color || pal.theme_color,
              spine_bg: customMatch?.spine_bg || pal.spine_bg,
              spine_color: customMatch?.spine_color || pal.spine_color || "#FDF9EE",
              spine_text: customMatch?.spine_text || s.title,
              cover_url: s.cover_url || customMatch?.cover_url || doodleFallback,
              duration: "4'15\"",
              audio_url: (function() {
                const raw = customMatch?.preview_audio_url || customMatch?.audio_url || s.audio_url || "";
                return (raw && !raw.includes('youtube.com') && !raw.includes('youtu.be')) ? raw : (customMatch?.preview_audio_url || "");
              })(),
              preview_audio_url: (function() {
                const raw = customMatch?.preview_audio_url || customMatch?.audio_url || s.audio_url || "";
                return (raw && !raw.includes('youtube.com') && !raw.includes('youtu.be')) ? raw : (customMatch?.preview_audio_url || "");
              })(),
              youtube_url: customMatch?.youtube_url || (s.audio_url && (s.audio_url.includes('youtube.com') || s.audio_url.includes('youtu.be')) ? s.audio_url : (s.youtube_url || "https://www.youtube.com/@harvestermusic.production")),
              spotify_url: customMatch?.spotify_url || s.spotify_url || "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ",
              score_url: s.score_url || "assets/scores/sample.pdf",
              lyrics: s.description ? s.description : `【${s.title}】\n\n词曲：Harvester Music Production\n愿每一首写给神的歌都被听见。\n欢迎下载歌谱使用并在各处传唱。`,
              key_bpm: customMatch?.key_bpm || "KEY: C · 72 BPM",
              scripture: customMatch?.scripture || "「神是个灵，所以拜他的必须用心灵和诚实拜他。」—— 约翰福音 4:24",
              notes: customMatch?.notes || "在瞬息万变、充满喧嚣的世界里，愿我们每一次开口赞美，都是心灵与圣灵的真实对话。",
              composer: customMatch?.composer || customMatch?.artist || s.artist || "Harvester Worship",
              arrangement: customMatch?.arrangement || "Harvester Music Production",
              vocals: (customMatch?.vocals !== undefined ? customMatch.vocals : (s.vocals || "")).trim(),
              mixing: (customMatch?.mixing !== undefined ? customMatch.mixing : (s.mixing || "")).trim(),
              photo_1: customMatch?.photo_1 || s.cover_url || doodleFallback,
              photo_2: customMatch?.photo_2 || childlikeDoodles[1],
              photo_3: customMatch?.photo_3 || childlikeDoodles[2]
            };
          });

          allAlbums = sortAlbumsByYear(mappedFromDb);
        } else if (customAlbums) {
          allAlbums = sortAlbumsByYear(customAlbums.map(c => {
            const raw = c.preview_audio_url || c.audio_url || "";
            const isDirect = raw && !raw.includes('youtube.com') && !raw.includes('youtu.be');
            return {
              ...c,
              audio_url: isDirect ? raw : (c.preview_audio_url || ""),
              preview_audio_url: isDirect ? raw : (c.preview_audio_url || "")
            };
          }));
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
      <!-- 1. Unified Parallel Header (Title + Dynamic Year Filters + Search) -->
      <div class="music-unified-header fade-in">
        <div class="unified-header-left">
          <div class="ppt-line"></div>
          <h1 class="ppt-title">音乐与歌谱集</h1>
          <p class="ppt-subtitle">OUR WORSHIP & DIGITAL SCORE COLLECTION</p>
        </div>

        <div class="unified-header-right">
          <div class="pill-segmented-control" id="yearFilterControl">
            <button class="pill-btn ${currentYearFilter === 'ALL' ? 'active' : ''}" onclick="window.filterByYear('ALL')">
              <span>全部 (All)</span>
            </button>
            ${years.map(yr => `
              <button class="pill-btn ${currentYearFilter === yr ? 'active' : ''}" onclick="window.filterByYear('${yr}')">
                <span>${yr} 年</span>
              </button>
            `).join('')}
          </div>

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
            <span id="miniTrackArtist" class="mini-track-artist">${albums[0]?.artist || 'Harvester Worship'} · 15秒试听</span>
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

  // =========================================================================
  // 🎨 5 SIGNATURE MORANDI COLOR PALETTES (时光密语 · 五大高定治愈色系)
  // 1. 鼠尾草灰绿 (#C1C2A7, #778585, #EBD6CE, #FDF9EE)
  // 2. 雾霭薰衣紫 (#C6B7CF, #7C7582, #D5DEDD, #FDF9EE)
  // 3. 尤加利草木 (#B4C2B6, #857979, #E0CEE0, #FDF9EE)
  // 4. 烟粉豆沙灰 (#CFB7BC, #858479, #D6DAEB, #FDF9EE)
  // 5. 勃艮第夜幕 (#5c2734, #dfd5c4, #dedad4, #FDF9EE)
  // =========================================================================
  // 🎨 5 SPECIFIC MORANDI HARMONIC PALETTES (5 套严格莫兰迪专属色彩方案)
  // 1. 鼠尾草灰绿 (Spine: #607272, Theme: #182222)
  // 2. 雾霭薰衣紫 (Spine: #6c6374, Theme: #211b27)
  // 3. 尤加利草木 (Spine: #556958, Theme: #1b241d)
  // 4. 烟粉豆沙灰 (Spine: #755963, Theme: #241b1f)
  // 5. 勃艮第夜幕 (Spine: #52222e, Theme: #210e14)
  // =========================================================================
  const MORANDI_FIVE_PALETTES = [
    {
      id: "palette_1_sage",
      name: "时光密语 · 鼠尾草灰绿",
      primary: "#778585",
      accent: "#C1C2A7",
      soft: "#EBD6CE",
      cream: "#FDF9EE",
      spine_bg: "#607272",
      theme_color: "#182222",
      bg_center: "#384a4a",
      bg_mid: "#222e2e",
      bg_outer: "#131b1b",
      glow: "rgba(193, 194, 167, 0.45)",
      fold1_bg: "#EBD6CE",
      fold1_text: "#2c3434",
      fold2_bg: "#687676",
      fold2_text: "#FDF9EE",
      fold3_bg: "#C1C2A7",
      fold3_text: "#222a2a"
    },
    {
      id: "palette_2_lavender",
      name: "时光密语 · 雾霭薰衣紫",
      primary: "#7C7582",
      accent: "#C6B7CF",
      soft: "#D5DEDD",
      cream: "#FDF9EE",
      spine_bg: "#6c6374",
      theme_color: "#211b27",
      glow: "rgba(198, 183, 207, 0.45)",
      bg_center: "#42374b",
      bg_mid: "#2a2231",
      bg_outer: "#17121b",
      fold1_bg: "#D5DEDD",
      fold1_text: "#2a2330",
      fold2_bg: "#6c6473",
      fold2_text: "#FDF9EE",
      fold3_bg: "#C6B7CF",
      fold3_text: "#221a28"
    },
    {
      id: "palette_3_eucalyptus",
      name: "时光密语 · 尤加利草木",
      primary: "#857979",
      accent: "#B4C2B6",
      soft: "#E0CEE0",
      cream: "#FDF9EE",
      spine_bg: "#556958",
      theme_color: "#1b241d",
      glow: "rgba(180, 194, 182, 0.45)",
      bg_center: "#37493b",
      bg_mid: "#233026",
      bg_outer: "#141c16",
      fold1_bg: "#E0CEE0",
      fold1_text: "#2a2323",
      fold2_bg: "#7a6d6d",
      fold2_text: "#FDF9EE",
      fold3_bg: "#B4C2B6",
      fold3_text: "#1c241e"
    },
    {
      id: "palette_4_dusty_rose",
      name: "时光密语 · 烟粉豆沙灰",
      primary: "#858479",
      accent: "#CFB7BC",
      soft: "#D6DAEB",
      cream: "#FDF9EE",
      spine_bg: "#755963",
      theme_color: "#241b1f",
      glow: "rgba(207, 183, 188, 0.45)",
      bg_center: "#48343b",
      bg_mid: "#2d2025",
      bg_outer: "#191114",
      fold1_bg: "#D6DAEB",
      fold1_text: "#2b2326",
      fold2_bg: "#79786d",
      fold2_text: "#FDF9EE",
      fold3_bg: "#CFB7BC",
      fold3_text: "#261b20"
    },
    {
      id: "palette_5_burgundy_wine",
      name: "时光密语 · 勃艮第夜幕",
      primary: "#5c2734",
      accent: "#dfd5c4",
      soft: "#dedad4",
      cream: "#FDF9EE",
      spine_bg: "#52222e",
      theme_color: "#210e14",
      glow: "rgba(180, 70, 95, 0.45)",
      bg_center: "#481a25",
      bg_mid: "#2d0f17",
      bg_outer: "#19080d",
      fold1_bg: "#dfd5c4",
      fold1_text: "#2c241c",
      fold2_bg: "#5c2734",
      fold2_text: "#fae8ec",
      fold3_bg: "#dedad4",
      fold3_text: "#26221f"
    }
  ];

  // 🎲 Deterministic Assignment Matching Spine Color or Theme Color First
  function getMorandiFivePalette(song, index = 0) {
    if (song?.palette_id) {
      const match = MORANDI_FIVE_PALETTES.find(p => p.id === song.palette_id);
      if (match) return match;
    }
    const spine = (song?.spine_bg || '').trim().toLowerCase();
    const theme = (song?.theme_color || '').trim().toLowerCase();
    if (spine) {
      const match = MORANDI_FIVE_PALETTES.find(p => p.spine_bg.toLowerCase() === spine);
      if (match) return match;
    }
    if (theme) {
      const match = MORANDI_FIVE_PALETTES.find(p => p.theme_color.toLowerCase() === theme || (p.bg_mid && p.bg_mid.toLowerCase() === theme));
      if (match) return match;
    }
    const key = String(song?.id || song?.title || index);
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash * 31 + key.charCodeAt(i)) & 0xFFFFFFFF;
    }
    const palIdx = Math.abs(hash + (index * 7)) % MORANDI_FIVE_PALETTES.length;
    return MORANDI_FIVE_PALETTES[palIdx];
  }

  function getAlbumPalette(album, idx = 0) {
    if (album) {
      if (album.spine_bg || album.theme_color) {
        return getMorandiFivePalette(album, idx);
      }
      if (album.palette) return album.palette;
    }
    return getMorandiFivePalette(album, idx);
  }

  let activeAmbientLayer = 'A';
  let lastActiveSongId = null;

  function updateDynamicAmbientBackground(album, idx) {
    if (!album) return;
    const albumKey = album.id || album.title;
    if (albumKey === lastActiveSongId) return;
    lastActiveSongId = albumKey;

    const pal = getAlbumPalette(album, idx);
    const grad = `radial-gradient(ellipse 95% 75% at 50% 36%, ${pal.bg_center} 0%, ${pal.theme_color} 65%, ${pal.bg_outer} 100%)`;

    // 1. Direct Page & HTML Background Transition (Forced !important override)
    document.body.style.setProperty('background', pal.theme_color, 'important');
    document.body.style.setProperty('background-color', pal.theme_color, 'important');
    document.body.style.setProperty('background-image', 'none', 'important');
    document.body.style.transition = 'background-color 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
    document.documentElement.style.setProperty('background', pal.theme_color, 'important');
    document.documentElement.style.setProperty('background-color', pal.theme_color, 'important');
    document.documentElement.style.transition = 'background-color 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';

    // 2. Ensure ambient container exists in DOM
    let ambientEl = document.getElementById('coverflowDynamicAmbient');
    if (!ambientEl) {
      ambientEl = document.createElement('div');
      ambientEl.id = 'coverflowDynamicAmbient';
      ambientEl.className = 'coverflow-dynamic-ambient';
      ambientEl.innerHTML = `
        <div id="ambientLayerA" class="ambient-layer active" style="background: ${grad};"></div>
        <div id="ambientLayerB" class="ambient-layer"></div>
        <div class="ambient-vignette"></div>
      `;
      document.body.prepend(ambientEl);
    }

    const layerA = document.getElementById('ambientLayerA');
    const layerB = document.getElementById('ambientLayerB');

    if (layerA && layerB) {
      if (activeAmbientLayer === 'A') {
        layerB.style.background = grad;
        layerB.classList.add('active');
        layerA.classList.remove('active');
        activeAmbientLayer = 'B';
      } else {
        layerA.style.background = grad;
        layerA.classList.add('active');
        layerB.classList.remove('active');
        activeAmbientLayer = 'A';
      }
    }

    const cfSection = document.querySelector('.coverflow-section');
    if (cfSection) {
      cfSection.style.background = 'transparent';
    }

    // Set CSS custom variables on root / body for synchronized accents
    document.documentElement.style.setProperty('--active-album-accent', pal.accent);
    document.documentElement.style.setProperty('--active-album-glow', pal.glow);
    document.documentElement.style.setProperty('--active-album-theme', pal.theme_color);
    document.documentElement.style.setProperty('--active-album-spine', pal.spine_bg);
    document.body.style.setProperty('--active-album-accent', pal.accent);
    document.body.style.setProperty('--active-album-glow', pal.glow);
    document.body.style.setProperty('--active-album-theme', pal.theme_color);
    document.body.style.setProperty('--active-album-spine', pal.spine_bg);
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

    carousel.innerHTML = virtualList.map(({ album, origIdx, vIdx }) => {
      const pal = getAlbumPalette(album, origIdx);
      const spineColor = pal.spine_bg;
      return `
      <div class="album-3d-box ${origIdx === currentIndex && vIdx === 0 ? 'active' : ''}" data-vindex="${vIdx}" data-real-index="${origIdx}">
        <div class="album-cube">
          
          <!-- 1. Front Outer Cover (现代加长画册封套) -->
          <div class="cube-face cube-front sleeve-outer-front">
            <img src="${album.cover_url || childlikeDoodles[origIdx % childlikeDoodles.length]}" alt="${album.title}" draggable="false" onerror="this.src='assets/logo.png'">
            
            <!-- Left Spine Fold Crease -->
            <div class="album-spine-crease"></div>
            
            <!-- Modern Satin Specular Reflection -->
            <div class="album-glass-sheen"></div>

            <!-- Modern Editorial Hype Badge -->
            <div class="vinyl-hype-sticker">
              <span class="hype-badge-top">HARVESTER ORIGINALS</span>
              <span class="hype-badge-main">${album.year || '2025'} EDITION</span>
              <span class="hype-badge-code">CAT-${(origIdx + 1).toString().padStart(2, '0')}</span>
            </div>

            <!-- Bottom Right Audio Badge -->
            <div class="sleeve-barcode-badge">
              <i class="fas fa-wave-square" style="font-size:0.55rem; color:var(--gold); margin-right:3px;"></i> HI-RES AUDIO
            </div>
          </div>

          <!-- 2. Left Spine (Slim Refined 16px Spine - 纤细修长优雅书脊，严格对应5套莫兰迪色系，无文字纯色极简设计) -->
          <div class="cube-face cube-spine-left" style="background: ${spineColor} !important;"></div>

          <!-- Top Sealed Edge -->
          <div class="cube-face cube-top" style="background: ${spineColor} !important; filter: brightness(1.2);"></div>

          <!-- Bottom Sealed Edge -->
          <div class="cube-face cube-bottom"></div>

          <!-- Back Outer Face -->
          <div class="cube-face cube-back sleeve-outer-back">
            <img src="${album.cover_url || childlikeDoodles[origIdx % childlikeDoodles.length]}" alt="${album.title}" draggable="false" onerror="this.src='assets/logo.png'">
            <div class="album-glass-sheen"></div>
            <div class="vinyl-hype-sticker" style="left:auto; right:12px;">
              <span class="hype-badge-top">HARVESTER MUSIC</span>
              <span class="hype-badge-main">${album.year || '2025'} RELEASE</span>
            </div>
          </div>
        </div>

        <!-- 🌟 Multi-Stage Physical Floor Shadow -->
        <div class="album-shadow-3d"></div>
      </div>
    `}).join('');
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

  let lastReportedActiveIdx = -1;

  // Continuous 3D Transform Rendering for Spine-Facing Curved Bookshelf / Display Rack
  function render3DCoverflow() {
    const boxes = document.querySelectorAll('.album-3d-box');
    if (!boxes.length || !albums.length) return;

    const N = boxes.length;
    const M = albums.length;
    const isSmallMobile = window.innerWidth <= 480;
    const isMobile = window.innerWidth <= 768;
    
    // Spacing: comfortable, breathable distance like a real physical display shelf
    const stepX = isSmallMobile ? 54 : (isMobile ? 70 : 106);
    const activeRealIdx = ((Math.round(currentProgress) % M) + M) % M;

    if (activeRealIdx !== lastReportedActiveIdx) {
      lastReportedActiveIdx = activeRealIdx;
      updateMetaBar();
    }

    boxes.forEach((box, i) => {
      // Modulo wrap circular distance to [-N/2, N/2]
      let rawDiff = i - currentProgress;
      let offset = ((rawDiff % N) + N) % N;
      if (offset > N / 2) {
        offset -= N;
      }

      const absOffset = Math.abs(offset);
      const pActive = Math.max(0, 1 - absOffset); // 1.0 at center, 0.0 when >= 1 unit away

      // 📚 Spine-Facing Curved Display Rack Rotation
      const rotY = 78 + Math.tanh(offset * 0.55) * 28;

      // 📏 Smooth X Spacing
      const x = offset * stepX;

      // 🌌 3D Arc Depth (Z): Center elevated closest to the viewer
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

  // Update Meta Caption & Dynamic Ambient Background for Active Album
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

      // 🌈 Dynamically transition ambient background color and glowing accents to match central album
      updateDynamicAmbientBackground(cur, activeIdx);

      // Keep mini-player info synced to active album when not playing
      if (!isPlaying) {
        const miniCover = document.getElementById('miniCover');
        const miniTitle = document.getElementById('miniTrackTitle');
        const miniArtist = document.getElementById('miniTrackArtist');
        if (miniCover) miniCover.src = cur.cover_url;
        if (miniTitle) miniTitle.innerText = cur.title;
        if (miniArtist) miniArtist.innerText = `${cur.artist || 'Harvester Worship'} · 15秒试听`;
      }
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
      gsap.set(view, { opacity: 1, scale: 1 });
      
      const panel1 = view.querySelector('.unfold-panel-1');
      const panel2 = view.querySelector('.unfold-panel-2');
      const panel3 = view.querySelector('.unfold-panel-3');

      if (panel1 && panel2 && panel3) {
        gsap.killTweensOf([panel1, panel2, panel3]);

        // Phase 0: Start with ONLY Page 1 visible! Pages 2 & 3 start folded shut (No whole-paper fade-in)
        gsap.set(panel1, { 
          opacity: 1, 
          width: 340, 
          flexBasis: "340px", 
          flexGrow: 0, 
          flexShrink: 0, 
          rotateY: 0, 
          paddingLeft: 26, 
          paddingRight: 26, 
          transformOrigin: 'left center', 
          boxShadow: '-6px 0 20px rgba(0,0,0,0.35)' 
        });

        gsap.set(panel2, { 
          opacity: 1, 
          width: 0, 
          flexBasis: "0px", 
          flexGrow: 0, 
          flexShrink: 0, 
          paddingLeft: 0, 
          paddingRight: 0, 
          rotateY: -90, 
          transformOrigin: 'left center', 
          boxShadow: '-20px 0 35px rgba(0,0,0,0.7)' 
        });

        gsap.set(panel3, { 
          opacity: 1, 
          width: 0, 
          flexBasis: "0px", 
          flexGrow: 0, 
          flexShrink: 0, 
          paddingLeft: 0, 
          paddingRight: 0, 
          rotateY: -90, 
          transformOrigin: 'left center', 
          boxShadow: '-20px 0 35px rgba(0,0,0,0.7)' 
        });

        const tl = gsap.timeline({ delay: 0.32 });

        // Step 1: Fold 2 smoothly unfolds towards the right from Fold 1 (physical swing & unroll, NO fade-in)
        tl.to(panel2, { 
          width: 340, 
          flexBasis: "340px", 
          paddingLeft: 26, 
          paddingRight: 26, 
          rotateY: 0, 
          boxShadow: '-6px 0 20px rgba(0,0,0,0.35)', 
          duration: 0.85, 
          ease: "power2.out" 
        })
        // Step 2: Fold 3 smoothly unfolds from Fold 2 towards the right (physical swing & unroll, NO fade-in)
        .to(panel3, { 
          width: 340, 
          flexBasis: "340px", 
          paddingLeft: 26, 
          paddingRight: 26, 
          rotateY: 0, 
          boxShadow: '-6px 0 20px rgba(0,0,0,0.35)', 
          duration: 0.85, 
          ease: "power2.out" 
        }, "-=0.20");
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

    const photo1 = activeSong.photo_1 || activeSong.cover_url || childlikeDoodles[0];
    const photo2 = activeSong.photo_2 || activeSong.cover_url || childlikeDoodles[1];
    const photo3 = activeSong.photo_3 || activeSong.cover_url || childlikeDoodles[2];
    const pal = activeSong.palette || getMorandiFivePalette(activeSong);

    stage.innerHTML = `
      <div class="immersive-page page-1" style="align-items:stretch; gap:24px;">
        <!-- Left Column: Frameless Poster & Actions (Seamless with Background) -->
        <div class="imm-left-col" style="background:transparent; border:none; box-shadow:none; padding:6px 10px; justify-content:space-between; position:relative;">
          <div style="position:relative; z-index:2;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-family:var(--font-times); font-size:0.75rem; letter-spacing:2px; background:rgba(0,0,0,0.3); padding:3px 8px; border-radius:4px; color:${pal.accent};">AUDIO ARCHIVE</span>
              <span style="font-family:var(--font-times); font-size:0.78rem; color:var(--gold);">VOL. 01</span>
            </div>

            <div style="margin-top:6px;">
              <h1 style="font-family:var(--font-eng-title); font-size:1.65rem; font-weight:900; color: #F6F4F0; line-height:1.15; letter-spacing:1px; margin:0; text-shadow:0 2px 10px rgba(0,0,0,0.5);">
                HARVESTER <br><span style="font-size:1.15rem; font-weight:700; color:var(--gold); letter-spacing:2px;">MUSIC PRODUCTION</span> <span style="font-size:1rem; color:${pal.accent};">&#10022;</span>
              </h1>
              <div style="width:110px; height:3px; background:linear-gradient(to right, ${pal.accent}, var(--gold), transparent); margin-top:6px;"></div>
            </div>
          </div>

          <!-- Center Band Member Cut-out Sticker -->
          <div style="position:relative; z-index:2; margin:10px 0; text-align:center;">
            <div class="cutout-sticker" style="width:190px; height:190px; margin:0 auto; overflow:hidden; position:relative;">
              <img src="${activeSong.cover_url}" alt="${activeSong.title}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='${childlikeDoodles[0]}'">
              <div style="position:absolute; bottom:6px; left:6px; right:6px; background:rgba(0,0,0,0.65); backdrop-filter:blur(8px); padding:4px 10px; border-radius:6px; font-size:0.7rem; color: #F6F4F0; display:flex; justify-content:space-between;">
                <span>${activeSong.artist}</span>
                <span style="color:var(--gold); font-family:var(--font-times);">${activeSong.year || '2025'}</span>
              </div>
            </div>

            <div style="margin-top:10px;">
              <h2 style="font-family:var(--font-gaoduanhei), sans-serif; font-size:1.45rem; font-weight:700; color: #F6F4F0; margin:0 0 3px; text-shadow:0 2px 8px rgba(0,0,0,0.6);">
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

        <!-- Right Column: Accordion Fold Stage (风琴折展开: 动态莫兰迪三折页) -->
        <div class="imm-right-col">
          <div class="accordion-booklet-stage">
            
            <!-- FOLD 1: 莫兰迪一折页 (LYRICS) -->
            <div class="accordion-panel unfold-panel-1" style="background:${pal.fold1_bg}; color:${pal.fold1_text}; border-radius:0; padding:24px 26px; border-right:1px solid rgba(0,0,0,0.1);">
              <div style="width:100%; max-width:100%; box-sizing:border-box; height:100%; display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                  <!-- Top Polaroid Photo (01 badge) -->
                  <div style="width:100%; height:140px; border-radius:0; overflow:hidden; border:1px solid rgba(0,0,0,0.15); position:relative; margin-bottom:14px; background:${pal.fold3_bg};">
                    <img src="${photo1}" alt="Art 01" style="width:100%; height:100%; object-fit:cover; filter:grayscale(80%);" onerror="this.onerror=null; this.src='${childlikeDoodles[0]}'">
                    <div style="position:absolute; bottom:6px; right:6px; background:${pal.primary}; color: #F6F4F0; font-family:var(--font-times); font-size:0.75rem; padding:2px 8px; border-radius:0; font-weight:700;">01</div>
                  </div>

                  <div style="border-bottom:1px solid rgba(0,0,0,0.12); padding-bottom:8px; margin-bottom:12px;">
                    <span style="font-family:var(--font-times); font-size:0.75rem; letter-spacing:2px; color:${pal.primary};">FOLD 01 · LYRICS</span>
                    <h3 style="margin:2px 0 0; color:${pal.fold1_text}; font-size:1.35rem; font-family:var(--font-gaoduanhei), var(--font-brand), sans-serif; font-weight:700;">完整歌词 (LYRICS)</h3>
                  </div>

                  <div style="font-family:var(--font-songti), serif; font-size:1rem; line-height:1.9; color:${pal.fold1_text}; white-space:pre-wrap; max-height:270px; overflow-y:auto; padding-right:6px;">
${activeSong.lyrics}
                  </div>
                </div>

                <div style="border-top:1px solid rgba(0,0,0,0.12); padding-top:14px; display:flex; justify-content:space-between; font-family:var(--font-times); font-size:0.75rem; color:${pal.fold1_text}; opacity:0.85;">
                  <span>${activeSong.key_bpm || 'KEY: C · 72 BPM'}</span>
                  <span style="color:${pal.fold1_text}; font-weight:700;">ORIGINAL MASTER</span>
                </div>
              </div>
            </div>

            <!-- FOLD 2: 莫兰迪二折页 (WORSHIP INSPIRATION / NOTES) -->
            <div class="accordion-panel unfold-panel-2" style="background:${pal.fold2_bg}; color:${pal.fold2_text}; border-radius:0; padding:24px 26px; border-right:1px solid rgba(0,0,0,0.18);">
              <div style="width:100%; max-width:100%; box-sizing:border-box; height:100%; display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                  <div style="border-bottom:1px solid rgba(255,255,255,0.18); padding-bottom:8px; margin-bottom:14px;">
                    <span style="font-family:var(--font-times); font-size:0.75rem; letter-spacing:2px; color:${pal.cream};">FOLD 02 · WORSHIP INSPIRATION</span>
                    <h3 style="margin:2px 0 0; color: #F6F4F0; font-size:1.35rem; font-family:var(--font-gaoduanhei), var(--font-brand), sans-serif; font-weight:700;">创作心得与经文 (NOTES)</h3>
                  </div>

                  <div style="font-family:var(--font-songti), serif; font-size:0.98rem; line-height:1.85; color:${pal.fold2_text}; space-y:10px;">
                    ${activeSong.scripture ? `
                      <div style="background:rgba(0,0,0,0.22); border-left:3px solid ${pal.cream}; padding:10px 12px; border-radius:0; font-size:0.88rem; color:${pal.cream}; margin-bottom:12px;">
                        ${activeSong.scripture}
                      </div>
                    ` : ''}
                    <div style="white-space:pre-wrap; max-height:200px; overflow-y:auto; color:${pal.fold2_text};">
                      ${activeSong.notes || '在瞬息万变、充满喧嚣的世界里，愿我们每一次开口赞美，都是心灵与圣灵的真实对话。'}
                    </div>
                  </div>
                </div>

                <!-- Bottom Polaroid photo -->
                <div style="width:100%; height:140px; border-radius:0; overflow:hidden; border:1px solid rgba(255,255,255,0.2); position:relative; margin-top:16px; background:rgba(0,0,0,0.3);">
                  <img src="${photo2}" alt="Art 02" style="width:100%; height:100%; object-fit:cover; opacity:0.9;" onerror="this.onerror=null; this.src='${childlikeDoodles[1]}'">
                  <div style="position:absolute; bottom:6px; left:6px; background:rgba(0,0,0,0.6); backdrop-filter:blur(6px); color:${pal.cream}; font-family:var(--font-times); font-size:0.7rem; padding:2px 8px; border-radius:0;">
                    WORSHIP HEART · 02
                  </div>
                </div>
              </div>
            </div>

            <!-- FOLD 3: 莫兰迪三折页 (PRODUCTION CREDITS) -->
            <div class="accordion-panel unfold-panel-3" style="background:${pal.fold3_bg}; color:${pal.fold3_text}; border-radius:0; padding:24px 26px;">
              <div style="width:100%; max-width:100%; box-sizing:border-box; height:100%; display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                  <div style="width:100%; height:150px; border-radius:0; overflow:hidden; border:1px solid rgba(0,0,0,0.12); position:relative; margin-bottom:16px; background:${pal.fold1_bg};">
                    <img src="${photo3}" alt="Art 03" style="width:100%; height:100%; object-fit:cover; filter:grayscale(80%);" onerror="this.onerror=null; this.src='${childlikeDoodles[2]}'">
                    <div style="position:absolute; bottom:6px; right:6px; background:${pal.primary}; color: #F6F4F0; font-family:var(--font-times); font-size:0.75rem; padding:2px 8px; border-radius:0; font-weight:700;">03</div>
                  </div>

                  <div style="border-bottom:1px solid rgba(0,0,0,0.12); padding-bottom:8px; margin-bottom:12px;">
                    <span style="font-family:var(--font-times); font-size:0.75rem; letter-spacing:2px; color:${pal.primary};">FOLD 03 · PRODUCTION CREDITS</span>
                    <h3 style="margin:2px 0 0; color:${pal.fold3_text}; font-size:1.35rem; font-family:var(--font-gaoduanhei), var(--font-brand), sans-serif; font-weight:700;">同工团队 (CREDITS)</h3>
                  </div>

                  <div style="font-size:0.88rem; space-y:8px; color:${pal.fold3_text}; font-family:var(--font-body);">
                    ${(activeSong.composer || activeSong.artist) ? `
                    <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(0,0,0,0.06); padding-bottom:6px;">
                      <span style="opacity:0.75;">词曲创作：</span>
                      <span style="font-weight:600; color:${pal.fold3_text};">${activeSong.composer || activeSong.artist}</span>
                    </div>` : ''}
                    ${(activeSong.arrangement && activeSong.arrangement.trim() !== '') ? `
                    <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(0,0,0,0.06); padding-bottom:6px;">
                      <span style="opacity:0.75;">编曲制作：</span>
                      <span style="font-weight:600; color:${pal.fold3_text};">${activeSong.arrangement}</span>
                    </div>` : ''}
                    ${(activeSong.vocals && activeSong.vocals.trim() !== '') ? `
                      <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(0,0,0,0.06); padding-bottom:6px;">
                        <span style="opacity:0.75;">人声主唱：</span>
                        <span style="font-weight:600; color:${pal.fold3_text};">${activeSong.vocals.trim()}</span>
                      </div>
                    ` : ''}
                    ${(activeSong.mixing && activeSong.mixing.trim() !== '') ? `
                    <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(0,0,0,0.06); padding-bottom:6px;">
                      <span style="opacity:0.75;">录音混音母带：</span>
                      <span style="font-weight:600; color:${pal.fold3_text};">${activeSong.mixing.trim()}</span>
                    </div>` : ''}
                  </div>
                </div>

                <div style="border-top:1px solid rgba(0,0,0,0.12); padding-top:14px; display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-family:var(--font-times); font-size:0.75rem; color:${pal.fold3_text}; opacity:0.8;">PDF SCORES</span>
                  <button onclick="toggleAudioPlay()" class="imm-pill-btn" style="background:${pal.primary}; color:#F6F4F0; border:none; font-size:0.82rem; padding:7px 16px; font-family:var(--font-times); box-shadow:0 4px 12px rgba(0,0,0,0.25);">
                    <i id="lyricsPlayBtnIcon" class="fas ${isPlaying ? 'fa-pause' : 'fa-play'}"></i> ${isPlaying ? '暂停试听' : '15s 试听'}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    `;
  }

  // Audio Playback Engine (15s Preview Mode)
  window.toggleAudioPlay = function() {
    if (!albums || albums.length === 0) return;
    const M = albums.length;
    const activeIdx = ((Math.round(currentProgress) % M) + M) % M;
    const cur = activeSong || albums[activeIdx];

    if (isPlaying) {
      audioPlayer.pause();
      isPlaying = false;
      updatePlayerUI();
    } else {
      const audioSrc = cur?.preview_audio_url || cur?.audio_url;
      const isValidAudio = audioSrc && !audioSrc.includes('youtube.com') && !audioSrc.includes('youtu.be');

      if (isValidAudio) {
        if (audioPlayer.src !== audioSrc) {
          audioPlayer.src = audioSrc;
          audioPlayer.currentTime = 0;
        }
        audioPlayer.play().then(() => {
          isPlaying = true;
          updatePlayerUI();
          if (typeof window.showMorandiToast === 'function') {
            window.showMorandiToast(`🎵 正在试听：《${cur.title}》（15秒精选片段）`);
          }
        }).catch(err => {
          console.warn("Audio playback error:", err);
          isPlaying = false;
          updatePlayerUI();
          if (typeof window.showMorandiToast === 'function') {
            window.showMorandiToast('⚠️ 音频无法播放，请在后台确认试听音频格式');
          }
        });
      } else {
        isPlaying = false;
        updatePlayerUI();
        if (typeof window.showMorandiToast === 'function') {
          window.showMorandiToast('🎵 该单曲暂未上传 15 秒试听音频，请在后台“音乐与歌谱集”上传');
        } else {
          alert('🎵 该单曲暂未上传 15 秒试听音频，请在后台“音乐与歌谱集”上传');
        }
      }
    }
  };

  function updatePlayerUI() {
    const miniPlayIcon = document.getElementById('miniPlayIcon');
    const miniEqBars = document.getElementById('miniEqBars');
    const miniCover = document.getElementById('miniCover');
    const miniTitle = document.getElementById('miniTrackTitle');
    const miniArtist = document.getElementById('miniTrackArtist');
    const lyricsPlayBtnIcon = document.getElementById('lyricsPlayBtnIcon');

    if (miniPlayIcon) miniPlayIcon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
    if (lyricsPlayBtnIcon) {
      lyricsPlayBtnIcon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
      if (lyricsPlayBtnIcon.parentElement) {
        lyricsPlayBtnIcon.parentElement.innerHTML = `<i id="lyricsPlayBtnIcon" class="fas ${isPlaying ? 'fa-pause' : 'fa-play'}"></i> ${isPlaying ? '暂停' : '15s 试听'}`;
      }
    }
    if (miniEqBars) miniEqBars.classList.toggle('playing', isPlaying);

    if (albums && albums.length > 0) {
      const M = albums.length;
      const activeIdx = ((Math.round(currentProgress) % M) + M) % M;
      const cur = activeSong || albums[activeIdx];
      if (cur) {
        if (miniCover) miniCover.src = cur.cover_url;
        if (miniTitle) miniTitle.innerText = cur.title;
        if (miniArtist) miniArtist.innerText = `${cur.artist || 'Harvester Worship'} · 15秒试听`;
      }
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
