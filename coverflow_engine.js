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
  // Curated Collection of Childlike Hand-Drawn & Whimsical Crayon / Watercolor Doodle Illustrations
  const childlikeDoodles = [
    "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=900&auto=format&fit=crop&q=80", // colorful whimsical painting
    "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=900&auto=format&fit=crop&q=80", // watercolor splash & doodle
    "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=900&auto=format&fit=crop&q=80", // playful abstract shapes
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=900&auto=format&fit=crop&q=80", // botanical playful sketch
    "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=900&auto=format&fit=crop&q=80", // cute hand-drawn illustration
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&auto=format&fit=crop&q=80", // pastel childlike dream
    "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=900&auto=format&fit=crop&q=80", // creative vibrant brushstrokes
    "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=900&auto=format&fit=crop&q=80", // bright playful colors
    "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=900&auto=format&fit=crop&q=80", // childlike expressive painting
    "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=900&auto=format&fit=crop&q=80", // warm joyful mountains & sun
    "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?w=900&auto=format&fit=crop&q=80", // whimsical starry dream doodle
    "https://images.unsplash.com/photo-1549490349-8643362247b5?w=900&auto=format&fit=crop&q=80"  // pastel crayon art
  ];

  // Default Curated Single Songs (1 Album = 1 Single Track) with Childlike Doodle Art
  const defaultAlbums = [
    {
      id: "song_renew",
      title: "更新敬拜",
      title_en: "Renewed Worship",
      artist: "Harvester Worship",
      genre: "Worship / CCM · 2025",
      year: "2025",
      theme_color: "#1c2b36",
      spine_bg: "#1877F2",
      spine_color: "#ffffff",
      spine_text: "更新敬拜 · Harvester Worship",
      cover_url: childlikeDoodles[0],
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
      theme_color: "#169b9b",
      spine_bg: "#00b894",
      spine_color: "#ffffff",
      spine_text: "灵火 Awakening · Harvester Creative",
      cover_url: childlikeDoodles[1],
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
      theme_color: "#3a2d10",
      spine_bg: "#f39c12",
      spine_color: "#111111",
      spine_text: "因为祢 上帝 · Harvester Worship",
      cover_url: childlikeDoodles[2],
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
      theme_color: "#b06d60",
      spine_bg: "#ea8676",
      spine_color: "#ffffff",
      spine_text: "Im Alive · Harvester Praise",
      cover_url: childlikeDoodles[3],
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
      theme_color: "#182736",
      spine_bg: "#0984e3",
      spine_color: "#ffffff",
      spine_text: "收割的呼召 · Gospel Collective",
      cover_url: childlikeDoodles[4],
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
      theme_color: "#255977",
      spine_bg: "#2d3436",
      spine_color: "#ffffff",
      spine_text: "祢是唯一 · Harvester Acoustic",
      cover_url: childlikeDoodles[5],
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
      theme_color: "#271b16",
      spine_bg: "#e77f67",
      spine_color: "#111111",
      spine_text: "我心所愿 · Strings Ensemble",
      cover_url: childlikeDoodles[6],
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
      theme_color: "#0f1c24",
      spine_bg: "#1b2a4a",
      spine_color: "#ffffff",
      spine_text: "在祢圣所中 · Chamber Choir",
      cover_url: childlikeDoodles[7],
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
      theme_color: "#1f1d36",
      spine_bg: "#6c5ce7",
      spine_color: "#ffffff",
      spine_text: "晨光破晓 · Harvester Ensemble",
      cover_url: childlikeDoodles[8],
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

  let albums = [...defaultAlbums];
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

  // Initialize Engine
  async function init() {
    await fetchSupabaseSongs();
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
            
            return {
              id: s.id,
              title: s.title,
              title_en: customMatch?.title_en || "Harvester Single",
              artist: s.artist || customMatch?.artist || "Harvester Worship",
              genre: customMatch?.genre || "CCM / Worship · 2025",
              year: customMatch?.year || "2025",
              theme_color: customMatch?.theme_color || ["#1c2b36", "#169b9b", "#3a2d10", "#b06d60", "#182736", "#255977", "#271b16", "#0f1c24", "#1f1d36"][idx % 9],
              spine_bg: customMatch?.spine_bg || ["#1877F2", "#00b894", "#f39c12", "#ea8676", "#0984e3", "#2d3436", "#e77f67", "#1b2a4a", "#6c5ce7"][idx % 9],
              spine_color: customMatch?.spine_color || "#ffffff",
              spine_text: customMatch?.spine_text || `${s.title} · ${s.artist || 'Harvester'}`,
              cover_url: s.cover_url || customMatch?.cover_url || doodleFallback,
              duration: "4'15\"",
              audio_url: s.audio_url || "",
              youtube_url: s.audio_url || s.youtube_url || "https://www.youtube.com/@harvestermusic.production",
              spotify_url: s.spotify_url || "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ",
              score_url: s.score_url || "assets/scores/sample.pdf",
              lyrics: s.description ? s.description : `【${s.title}】\n\n词曲：Harvester Music Production\n愿每一首写给神的歌都被听见。\n欢迎下载歌谱使用并在各处传唱。`
            };
          });

          albums = mappedFromDb;
        } else if (customAlbums) {
          albums = customAlbums;
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

    stage.innerHTML = `
      <!-- 1. Top App Navigation Bar -->
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
          <div class="pill-segmented-control">
            <button class="pill-btn active">🎵 单曲 (Singles)</button>
          </div>
        </div>

        <div class="header-right">
          <button class="icon-btn search-trigger" onclick="toggleSearch()" title="搜索歌曲"><i class="fas fa-search"></i></button>
        </div>
      </div>

      <!-- 2. 3D Coverflow Stage (1 Album = 1 Single Track) -->
      <div class="shelf-wrapper" id="shelfWrapper">
        <div class="coverflow-carousel" id="coverflowCarousel" style="touch-action: pan-y; cursor: grab; user-select: none;">
          ${albums.map((album, idx) => `
            <div class="album-3d-box ${idx === currentIndex ? 'active' : ''}" data-index="${idx}" style="transition: opacity 0.3s ease;">
              <div class="album-cube">
                <!-- Front Cover Face (Childlike Doodle Art) -->
                <div class="cube-face cube-front">
                  <img src="${album.cover_url || childlikeDoodles[idx % childlikeDoodles.length]}" alt="${album.title}" draggable="false" onerror="this.src='assets/logo.png'">
                  <div class="album-glass-sheen"></div>
                  <div class="album-inner-border"></div>
                </div>

                <!-- Left Spine (Tactile CD Jewel Case Spine with 3D Depth) -->
                <div class="cube-face cube-spine-left" style="background: ${album.spine_bg || '#1c1815'};">
                  <div class="spine-inner-text">
                    <span class="spine-catalog">HMP-${String(idx + 1).padStart(3, '0')}</span>
                    <span class="spine-title">${album.title}</span>
                    <span class="spine-artist">${album.artist}</span>
                  </div>
                </div>

                <!-- Right Spine (Thickness Edge with Title) -->
                <div class="cube-face cube-spine-right" style="background: ${album.spine_bg || '#1c1815'};">
                  <div class="spine-inner-text">
                    <span class="spine-catalog">HMP-${String(idx + 1).padStart(3, '0')}</span>
                    <span class="spine-title">${album.title}</span>
                    <span class="spine-artist">${album.artist}</span>
                  </div>
                </div>

                <!-- Top Thickness Edge -->
                <div class="cube-face cube-top" style="background: ${album.spine_bg || '#1c1815'}; filter: brightness(1.2);"></div>

                <!-- Bottom Thickness Edge -->
                <div class="cube-face cube-bottom"></div>

                <!-- Back Cover Face -->
                <div class="cube-face cube-back">
                  <div class="cube-back-header">
                    <span class="cube-back-title">${album.title}</span>
                    <span class="cube-back-logo">HARVESTER</span>
                  </div>
                  <div class="cube-back-tracks">
                    <div style="color:var(--gold); font-weight:bold; margin-bottom:6px;">01. ${album.title}</div>
                    <div style="font-size:0.75rem; color:#aaa; line-height:1.4;">${album.artist} · ${album.year || '2025'}</div>
                  </div>
                  <div class="cube-back-footer">
                    <span>© ${album.year || '2025'} HARVESTER</span>
                    <span><i class="fas fa-barcode"></i></span>
                  </div>
                </div>
              </div>

              <!-- 3D Ground Shadow -->
              <div class="album-shadow-3d"></div>
            </div>
          `).join('')}
        </div>

        <!-- Shelf Meta Caption -->
        <div class="coverflow-meta-bar fade-in">
          <button class="cf-nav-btn prev" onclick="navigateCoverFlow(-1)" title="上一首"><i class="fas fa-chevron-left"></i></button>
          <div class="active-album-info" id="activeAlbumInfo">
            <span class="cf-tag font-eng-title" id="cfAlbumYear">${albums[currentIndex]?.year || '2025'} RELEASE</span>
            <h2 class="cf-album-title" id="cfAlbumTitle">${albums[currentIndex]?.title}</h2>
            <p class="cf-album-artist" id="cfAlbumArtist">${albums[currentIndex]?.artist}</p>
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
          <img id="miniCover" src="${albums[0]?.cover_url}" alt="Cover">
          <div class="mini-meta">
            <span id="miniTrackTitle" class="mini-track-name">${albums[0]?.title}</span>
            <span id="miniTrackArtist" class="mini-track-artist">${albums[0]?.artist} · 试听片段</span>
          </div>
        </div>
        <div class="mini-right">
          <button class="mini-play-btn" onclick="event.stopPropagation(); toggleAudioPlay();" title="播放 / 暂停试听">
            <i id="miniPlayIcon" class="fas fa-play"></i>
          </button>
        </div>
      </div>
    `;

    render3DCoverflow();
  }

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

  // Continuous 3D Transform Rendering for All Slabs (Unified 3D Shelf with Visible Spines)
  function render3DCoverflow() {
    const boxes = document.querySelectorAll('.album-3d-box');
    if (!boxes.length) return;

    const isMobile = window.innerWidth <= 768;
    const stepX = isMobile ? 85 : 125;
    const centerGap = isMobile ? 35 : 55;

    const activeIntIdx = Math.round(currentProgress);

    boxes.forEach((box, i) => {
      const offset = i - currentProgress;
      const absOffset = Math.abs(offset);

      // Consistent angled perspective: all albums consistently show their thick left spine
      // Center active album is at -44deg (showing both cover & spine clearly in spotlight)
      // Side albums are at -56deg (neatly stacked along the 3D rack)
      const pActive = Math.max(0, 1 - absOffset);
      const rotY = -56 + 12 * pActive; // -56deg on sides -> -44deg at center

      let x = offset * stepX;
      if (offset < 0) x -= centerGap * (1 - pActive);
      else if (offset > 0) x += centerGap * (1 - pActive);

      const z = 80 * pActive - absOffset * 35;
      const scale = 0.92 + 0.23 * pActive; // 0.92 on sides -> 1.15 at center
      const opacity = Math.max(0.18, 1 - absOffset * 0.1);

      // Stacking order: albums stack from left to right along the rack perspective,
      // with the active spotlight album at the highest priority
      let zIndex = 500 + i * 10;
      if (absOffset < 0.6) {
        zIndex = 1000 + Math.round((0.6 - absOffset) * 200);
      }

      box.classList.toggle('active', i === activeIntIdx);
      box.style.transform = `translateX(${x.toFixed(2)}px) translateZ(${z.toFixed(2)}px) rotateY(${rotY.toFixed(2)}deg) scale(${Math.max(0.5, scale).toFixed(3)})`;
      box.style.zIndex = zIndex;
      box.style.opacity = Math.max(0, Math.min(1, opacity)).toFixed(3);
    });
  }

  // Update Meta Caption for Active Album
  function updateMetaBar() {
    const activeIdx = Math.max(0, Math.min(albums.length - 1, Math.round(currentProgress)));
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

  // Navigate Coverflow Left / Right
  window.navigateCoverFlow = function(dir) {
    let nextIdx = Math.round(targetProgress) + dir;
    nextIdx = Math.max(0, Math.min(albums.length - 1, nextIdx));
    targetProgress = nextIdx;
    updateMetaBar();
  };

  // =================================================================
  // 🖱️ MOUSE DRAG & TOUCH SWIPE ENGINE (SLIK & FLUID)
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

      // Sensitivity: ~160px drag = 1 album
      const pxPerAlbum = window.innerWidth <= 768 ? 120 : 165;
      let newTarget = dragStartProgress - (dx / pxPerAlbum);

      // Elastic resistance on out of bounds
      if (newTarget < 0) {
        newTarget = newTarget * 0.3;
      } else if (newTarget > albums.length - 1) {
        const max = albums.length - 1;
        newTarget = max + (newTarget - max) * 0.3;
      }

      targetProgress = newTarget;
    }

    function handleDragEnd() {
      if (!isDragging) return;
      isDragging = false;
      carousel.style.cursor = 'grab';
      document.body.style.userSelect = '';

      // Project momentum based on release velocity
      const momentum = -dragVelocity * 14;
      let finalTarget = Math.round(targetProgress + momentum);
      finalTarget = Math.max(0, Math.min(albums.length - 1, finalTarget));

      targetProgress = finalTarget;
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

    // Click on individual album slab
    carousel.addEventListener('click', (e) => {
      const box = e.target.closest('.album-3d-box');
      if (!box) return;

      const idx = parseInt(box.dataset.index, 10);
      if (isNaN(idx)) return;

      // If user dragged more than 6px, it was a drag, not a click
      if (hasMovedFar) return;

      if (idx === Math.round(currentProgress)) {
        openSongDetailView(idx);
      } else {
        targetProgress = idx;
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
        targetProgress += delta * 0.003;
        targetProgress = Math.max(0, Math.min(albums.length - 1, targetProgress));

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
      gsap.fromTo(view, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.45, ease: "power3.out" });
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
      <div class="immersive-page page-1 fade-in" style="align-items:stretch; gap:35px;">
        <!-- Left Column: Frameless Poster & Actions (Seamless with Background) -->
        <div class="imm-left-col" style="background:transparent; border:none; box-shadow:none; padding:10px 15px; justify-content:space-between; position:relative;">
          <div style="position:relative; z-index:2;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-family:var(--font-eng-title); font-size:0.75rem; letter-spacing:2px; background:rgba(0,0,0,0.3); padding:3px 10px; border-radius:4px; color:#4ecdc4;">AUDIO ARCHIVE</span>
              <span style="font-family:var(--font-eng-title); font-size:0.8rem; color:var(--gold);">VOL. 01</span>
            </div>

            <div style="margin-top:10px;">
              <h1 style="font-family:var(--font-eng-title); font-size:3rem; font-weight:900; color:#ffffff; line-height:1; letter-spacing:2px; margin:0; text-shadow:0 2px 10px rgba(0,0,0,0.5);">
                MANGO JUMP <span style="font-size:1.5rem; color:#4ecdc4;">&#10022;</span>
              </h1>
              <div style="width:130px; height:5px; background:linear-gradient(to right, #ffd166, #4ecdc4, transparent); border-radius:3px; margin-top:6px;"></div>
            </div>
          </div>

          <!-- Center Band Member Cut-out Sticker -->
          <div style="position:relative; z-index:2; margin:15px 0; text-align:center;">
            <div class="cutout-sticker" style="width:250px; height:250px; margin:0 auto; overflow:hidden; position:relative;">
              <img src="${activeSong.cover_url}" alt="${activeSong.title}" style="width:100%; height:100%; object-fit:cover;">
              <div style="position:absolute; bottom:8px; left:8px; right:8px; background:rgba(0,0,0,0.65); backdrop-filter:blur(8px); padding:5px 12px; border-radius:6px; font-size:0.75rem; color:#fff; display:flex; justify-content:space-between;">
                <span>${activeSong.artist}</span>
                <span style="color:var(--gold); font-family:var(--font-eng-title);">${activeSong.year || '2025'}</span>
              </div>
            </div>

            <div style="margin-top:14px;">
              <h2 style="font-family:var(--font-songti), serif; font-size:1.8rem; font-weight:700; color:#fff; margin:0 0 4px; text-shadow:0 2px 8px rgba(0,0,0,0.6);">
                ${activeSong.title}
              </h2>
              <p style="font-size:0.88rem; color:rgba(255,255,255,0.8); margin:0;">
                ${activeSong.artist} · ${activeSong.genre || '敬拜单曲'}
              </p>
            </div>
          </div>

          <!-- Bottom Action Buttons -->
          <div style="position:relative; z-index:2; display:flex; flex-direction:column; gap:9px; border-top:1px solid rgba(255,255,255,0.15); padding-top:14px;">
            ${activeSong.score_url ? `
              <a href="${activeSong.score_url}" target="_blank" class="imm-pill-btn" style="background:var(--gold); color:#111; font-weight:700; border:none; padding:11px 18px; box-shadow:0 6px 20px rgba(0,0,0,0.35);">
                <i class="fas fa-file-pdf"></i> 下载歌谱 (PDF)
              </a>
            ` : ''}
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
              ${activeSong.youtube_url ? `
                <a href="${activeSong.youtube_url}" target="_blank" class="imm-pill-btn" style="background:rgba(0,0,0,0.4); border-color:rgba(255,255,255,0.25); font-size:0.82rem; padding:9px;">
                  <i class="fab fa-youtube" style="color:#ff4d4d;"></i> YouTube
                </a>
              ` : ''}
              ${activeSong.spotify_url ? `
                <a href="${activeSong.spotify_url}" target="_blank" class="imm-pill-btn" style="background:rgba(0,0,0,0.4); border-color:rgba(255,255,255,0.25); font-size:0.82rem; padding:9px;">
                  <i class="fab fa-spotify" style="color:#1db954;"></i> Spotify
                </a>
              ` : ''}
            </div>
          </div>
        </div>

        <!-- Right Column: Accordion Fold Stage (风琴折展开: 沙色折页 + 勃艮第红折页 + 浅灰麻布折页) -->
        <div class="imm-right-col" style="flex:1; max-width:1050px; overflow-x:auto; padding-bottom:10px;">
          <div class="accordion-booklet-stage">
            
            <!-- FOLD 1: 沙色莫兰迪 (WARM KRAFT SAND CREAM) -->
            <div class="accordion-panel unfold-panel-1" style="background:#dfd5c4; color:#2c241c; border-radius:12px 0 0 12px; padding:24px; border-right:1px solid #c9bda8;">
              <div>
                <!-- Top Polaroid Photo (01 badge) -->
                <div style="width:100%; height:150px; border-radius:8px; overflow:hidden; border:2px solid #c9bda8; position:relative; margin-bottom:16px;">
                  <img src="${activeSong.cover_url}" alt="Art 01" style="width:100%; height:100%; object-fit:cover; filter:grayscale(80%);" onerror="this.src='assets/logo.png'">
                  <div style="position:absolute; bottom:6px; right:6px; background:#000; color:#fff; font-family:var(--font-eng-title); font-size:0.75rem; padding:2px 8px; border-radius:4px; font-weight:700;">01</div>
                </div>

                <div style="border-bottom:1px solid rgba(44,36,28,0.15); padding-bottom:8px; margin-bottom:12px;">
                  <span style="font-family:var(--font-eng-title); font-size:0.75rem; letter-spacing:2px; color:#7c664d;">FOLD 01 · LYRICS</span>
                  <h3 style="margin:2px 0 0; color:#2c241c; font-size:1.3rem; font-family:var(--font-eng-title); font-weight:700;">完整歌词 (LYRICS)</h3>
                </div>

                <div style="font-family:var(--font-songti), serif; font-size:0.98rem; line-height:1.9; color:#3a3025; white-space:pre-wrap; max-height:260px; overflow-y:auto; padding-right:6px;">
${activeSong.lyrics}
                </div>
              </div>

              <div style="border-top:1px solid rgba(44,36,28,0.15); padding-top:12px; display:flex; justify-content:space-between; font-family:var(--font-eng-title); font-size:0.75rem; color:#6e5d48;">
                <span>ORIGINAL MASTER</span>
                <span style="color:#2c241c; font-weight:700;">HARVESTER</span>
              </div>
            </div>

            <!-- FOLD 2: 勃艮第红莫兰迪 (MUTED BURGUNDY / WINE) -->
            <div class="accordion-panel unfold-panel-2" style="background:#5c2734; color:#fae8ec; padding:24px; border-right:1px solid #451c27;">
              <div>
                <div style="border-bottom:1px solid rgba(255,255,255,0.15); padding-bottom:8px; margin-bottom:14px;">
                  <span style="font-family:var(--font-eng-title); font-size:0.75rem; letter-spacing:2px; color:var(--gold);">FOLD 02 · WORSHIP INSPIRATION</span>
                  <h3 style="margin:2px 0 0; color:#fff; font-size:1.3rem; font-family:var(--font-eng-title); font-weight:700;">创作心得与经文 (NOTES)</h3>
                </div>

                <div style="font-family:var(--font-songti), serif; font-size:0.95rem; line-height:1.8; color:#f3d7df; space-y:10px;">
                  <div style="background:rgba(0,0,0,0.25); border-left:3px solid var(--gold); padding:10px 12px; border-radius:4px; font-size:0.85rem; color:var(--gold); margin-bottom:12px;">
                    「神是个灵，所以拜他的必须用心灵和诚实拜他。」—— 约翰福音 4:24
                  </div>
                  <p style="margin:0 0 10px;">
                    在瞬息万变、充满喧嚣的世界里，愿我们每一次开口赞美，都是心灵与圣灵的真实对话。
                  </p>
                  <p style="margin:0;">
                    无论行过高山或低谷，神的爱总如晨曦般恒常守护，指引前行的道路。
                  </p>
                </div>
              </div>

              <!-- Bottom Polaroid photo -->
              <div style="width:100%; height:130px; border-radius:8px; overflow:hidden; border:2px solid rgba(255,255,255,0.2); position:relative; margin-top:16px;">
                <img src="${childlikeDoodles[1] || activeSong.cover_url}" alt="Art 02" style="width:100%; height:100%; object-fit:cover; opacity:0.9;" onerror="this.src='${activeSong.cover_url}'">
                <div style="position:absolute; bottom:6px; left:6px; background:rgba(0,0,0,0.6); backdrop-filter:blur(6px); color:var(--gold); font-family:var(--font-eng-title); font-size:0.7rem; padding:2px 8px; border-radius:4px;">
                  WORSHIP HEART · 02
                </div>
              </div>
            </div>

            <!-- FOLD 3: 浅灰麻布莫兰迪 (MUTED LINEN / STONE GREY) -->
            <div class="accordion-panel unfold-panel-3" style="background:#dedad4; color:#26221f; border-radius:0 12px 12px 0; padding:24px;">
              <div>
                <div style="width:100%; height:150px; border-radius:8px; overflow:hidden; border:2px solid #c6c0b6; position:relative; margin-bottom:16px;">
                  <img src="${childlikeDoodles[2] || activeSong.cover_url}" alt="Art 03" style="width:100%; height:100%; object-fit:cover; filter:grayscale(80%);" onerror="this.src='${activeSong.cover_url}'">
                  <div style="position:absolute; bottom:6px; right:6px; background:#000; color:#fff; font-family:var(--font-eng-title); font-size:0.75rem; padding:2px 8px; border-radius:4px; font-weight:700;">03</div>
                </div>

                <div style="border-bottom:1px solid rgba(38,34,31,0.15); padding-bottom:8px; margin-bottom:12px;">
                  <span style="font-family:var(--font-eng-title); font-size:0.75rem; letter-spacing:2px; color:#665e56;">FOLD 03 · PRODUCTION CREDITS</span>
                  <h3 style="margin:2px 0 0; color:#26221f; font-size:1.3rem; font-family:var(--font-eng-title); font-weight:700;">同工团队 (CREDITS)</h3>
                </div>

                <div style="font-size:0.85rem; space-y:8px; color:#423b35; font-family:var(--font-body);">
                  <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(38,34,31,0.08); padding-bottom:6px;">
                    <span style="color:#756a60;">词曲创作：</span>
                    <span style="font-weight:600; color:#1c1815;">${activeSong.artist}</span>
                  </div>
                  <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(38,34,31,0.08); padding-bottom:6px;">
                    <span style="color:#756a60;">编曲制作：</span>
                    <span style="font-weight:600; color:#1c1815;">Mango Jump & Harvester</span>
                  </div>
                  <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(38,34,31,0.08); padding-bottom:6px;">
                    <span style="color:#756a60;">录音母带：</span>
                    <span style="font-weight:600; color:#1c1815;">Harvester Studio HQ</span>
                  </div>
                </div>
              </div>

              <div style="border-top:1px solid rgba(38,34,31,0.15); padding-top:12px; display:flex; justify-content:space-between; align-items:center;">
                <span style="font-family:var(--font-eng-title); font-size:0.75rem; color:#665e56;">PDF SCORES</span>
                <button onclick="toggleAudioPlay()" class="imm-pill-btn" style="background:#26221f; color:#dedad4; border:none; font-size:0.8rem; padding:6px 14px;">
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

  window.toggleSearch = function() {
    const q = prompt("请输入要搜索的歌曲名称：");
    if (q) {
      const foundIdx = albums.findIndex(a => a.title.toLowerCase().includes(q.toLowerCase()) || a.artist.toLowerCase().includes(q.toLowerCase()));
      if (foundIdx !== -1) {
        targetProgress = foundIdx;
        updateMetaBar();
      } else {
        alert("未找到匹配的歌曲");
      }
    }
  };

  // Boot on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
