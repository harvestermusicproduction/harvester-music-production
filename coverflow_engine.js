/**
 * 🎵 Harvester 3D Album Cover Flow & Immersive Single Song Engine
 * 1. Each 3D Album Box = 1 Single Track (1 Album = 1 Single)
 * 2. Playful, Childlike Hand-Drawn & Whimsical Crayon / Watercolor Covers
 * 3. 3D Spine-Stacked Rack with Thick Slabs, Dynamic Spine Colors & Fluid Momentum
 * 4. Immersive Album Experience Screen with Single Track Focus, Full Lyrics & Scores
 * 5. Floating Glass Mini-Player Pill with Real Audio Playback & Sound Wave Visualizer
 */

(function() {
  // Curated Whimsical & Childlike Hand-Drawn Doodle Illustrations
  const childlikeDoodles = [
    "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80", // colorful whimsical painting
    "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80", // watercolor splash & doodle
    "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop&q=80", // playful abstract shapes
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80", // botanical playful sketch
    "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=800&auto=format&fit=crop&q=80", // cute hand-drawn illustration
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80", // pastel childlike dream
    "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&auto=format&fit=crop&q=80", // creative vibrant brushstrokes
    "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80", // bright playful colors
    "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&auto=format&fit=crop&q=80"  // childlike expressive painting
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
    setupTouchAndDrag();
    renderMiniPlayer();
  }

  // Fetch Dynamic CMS Songs and Map 1:1 to 3D Albums
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
          // Map each single song 1:1 to a 3D Album slab!
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
              theme_color: customMatch?.theme_color || ["#1c2b36", "#169b9b", "#3a2d10", "#b06d60", "#182736", "#255977"][idx % 6],
              spine_bg: customMatch?.spine_bg || ["#1877F2", "#00b894", "#f39c12", "#ea8676", "#0984e3", "#2d3436"][idx % 6],
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
            <button class="pill-btn active">🎵 3D 敬拜诗歌展台 (Single Works)</button>
          </div>
        </div>

        <div class="header-right">
          <button class="icon-btn search-trigger" onclick="toggleSearch()" title="搜索歌曲"><i class="fas fa-search"></i></button>
        </div>
      </div>

      <!-- 2. 3D Coverflow Stage (1 Album = 1 Single Track) -->
      <div class="shelf-wrapper" id="shelfWrapper">
        <div class="coverflow-carousel" id="coverflowCarousel">
          ${albums.map((album, idx) => `
            <div class="album-3d-box ${idx === currentIndex ? 'active' : ''}" data-index="${idx}" onclick="handleAlbumClick(${idx})">
              <div class="album-cube">
                <!-- Front Cover Face (Childlike Doodle Art) -->
                <div class="cube-face cube-front">
                  <img src="${album.cover_url || childlikeDoodles[idx % childlikeDoodles.length]}" alt="${album.title}" onerror="this.src='assets/logo.png'">
                  <div class="album-glass-sheen"></div>
                  <div class="album-inner-border"></div>
                </div>

                <!-- Left Spine (Thick Colored Side Facing Viewer) -->
                <div class="cube-face cube-spine-left" style="background: ${album.spine_bg || '#1c1815'};">
                  <span class="spine-inner-text" style="color: ${album.spine_color || '#ffffff'};">
                    ${album.spine_text || (album.title + ' · ' + album.artist)}
                  </span>
                </div>

                <!-- Right Spine -->
                <div class="cube-face cube-spine-right" style="background: ${album.spine_bg || '#1c1815'};">
                  <span class="spine-inner-text" style="color: ${album.spine_color || '#ffffff'};">
                    ${album.spine_text || (album.title + ' · ' + album.artist)}
                  </span>
                </div>

                <!-- Top Thickness Edge -->
                <div class="cube-face cube-top" style="background: ${album.spine_bg || '#1c1815'}; filter: brightness(1.25);"></div>

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
            <button class="btn-open-booklet" onclick="openSongDetailView(${currentIndex})">
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
          <button class="immersive-back-btn" onclick="closeSongDetailView()"><i class="fas fa-chevron-left"></i></button>
          
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

      <!-- 4. Floating Mini-Player Pill -->
      <div class="floating-mini-player" id="floatingMiniPlayer" onclick="handleMiniPlayerClick()">
        <div class="mini-left">
          <div class="mini-eq-bars" id="miniEqBars">
            <span></span><span></span><span></span>
          </div>
          <img id="miniCover" src="${albums[0]?.cover_url}" alt="Cover">
          <div class="mini-meta">
            <span id="miniTrackTitle" class="mini-track-name">${albums[0]?.title}</span>
            <span id="miniTrackArtist" class="mini-track-artist">${albums[0]?.artist}</span>
          </div>
        </div>
        <div class="mini-right">
          <button class="mini-play-btn" onclick="event.stopPropagation(); toggleAudioPlay();">
            <i id="miniPlayIcon" class="fas fa-play"></i>
          </button>
          <button class="mini-queue-btn" onclick="event.stopPropagation(); openSongDetailView(currentIndex);" title="查看歌谱与歌词">
            <i class="fas fa-file-alt"></i>
          </button>
        </div>
      </div>
    `;

    updateCoverFlow3DPositions();
  }

  // Update 3D Matrix & Angles for Shelf
  function updateCoverFlow3DPositions() {
    const boxes = document.querySelectorAll('.album-3d-box');
    const isMobile = window.innerWidth <= 768;
    const stepX = isMobile ? 48 : 68;
    const centerGap = isMobile ? 32 : 52;

    boxes.forEach((box, i) => {
      const offset = i - currentIndex;
      box.classList.toggle('active', offset === 0);

      let transformStyle = '';
      let zIndex = 100 - Math.abs(offset);
      let opacity = 1;

      if (offset === 0) {
        // Active Center Album: Standing at 65deg slightly turned forward with crisp sheen
        transformStyle = `translateX(0px) translateZ(80px) rotateY(65deg) scale(1.1)`;
        opacity = 1;
      } else if (offset < 0) {
        // Left Side Albums: Tilted +76deg showing thick spine facing viewer-left and cover facing right
        const xOffset = offset * stepX - centerGap;
        const zOffset = Math.abs(offset) * -38;
        const rotY = 76;
        const scale = Math.max(0.72, 1 - Math.abs(offset) * 0.035);
        opacity = Math.max(0.35, 1 - Math.abs(offset) * 0.08);
        transformStyle = `translateX(${xOffset}px) translateZ(${zOffset}px) rotateY(${rotY}deg) scale(${scale})`;
      } else {
        // Right Side Albums: Tilted -76deg showing thick spine facing viewer-right and cover facing left
        const xOffset = offset * stepX + centerGap;
        const zOffset = Math.abs(offset) * -38;
        const rotY = -76;
        const scale = Math.max(0.72, 1 - Math.abs(offset) * 0.035);
        opacity = Math.max(0.35, 1 - Math.abs(offset) * 0.08);
        transformStyle = `translateX(${xOffset}px) translateZ(${zOffset}px) rotateY(${rotY}deg) scale(${scale})`;
      }

      box.style.transform = transformStyle;
      box.style.zIndex = zIndex;
      box.style.opacity = opacity;
    });

    // Update Meta Bar Text
    const cur = albums[currentIndex];
    if (cur) {
      const titleEl = document.getElementById('cfAlbumTitle');
      const artistEl = document.getElementById('cfAlbumArtist');
      const yearEl = document.getElementById('cfAlbumYear');
      if (titleEl) titleEl.innerText = cur.title;
      if (artistEl) artistEl.innerText = cur.artist;
      if (yearEl) yearEl.innerText = `${cur.year || '2025'} RELEASE`;
    }
  }

  // Handle Album Card Click
  window.handleAlbumClick = function(idx) {
    if (idx === currentIndex) {
      openSongDetailView(idx);
    } else {
      currentIndex = idx;
      updateCoverFlow3DPositions();
    }
  };

  // Navigate Coverflow Left / Right
  window.navigateCoverFlow = function(dir) {
    currentIndex += dir;
    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex >= albums.length) currentIndex = albums.length - 1;
    updateCoverFlow3DPositions();
  };

  // =================================================================
  // 🌟 IMMERSIVE SINGLE SONG DETAIL VIEW (1 Album = 1 Single Track)
  // =================================================================
  window.openSongDetailView = function(idx) {
    activeSong = albums[idx] || albums[0];
    currentIndex = idx;

    const view = document.getElementById('immersiveAlbumView');
    if (!view) return;

    // Apply dynamic ambient background color
    view.style.background = activeSong.theme_color || '#1c2b36';
    view.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    renderSingleSongDetail();

    if (window.gsap) {
      gsap.fromTo(view, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.45, ease: "power3.out" });
    }
  };

  window.closeSongDetailView = function() {
    const view = document.getElementById('immersiveAlbumView');
    if (!view) return;
    if (window.gsap) {
      gsap.to(view, { opacity: 0, scale: 0.95, duration: 0.3, onComplete: () => {
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
      <div class="immersive-page page-1 fade-in">
        <!-- Left Column: Childlike Doodle Cover + Play Controls -->
        <div class="imm-left-col">
          <div class="imm-cover-card">
            <img src="${activeSong.cover_url}" alt="${activeSong.title}">
            <div class="cover-shine"></div>
          </div>

          <div class="imm-album-info">
            <h1 class="imm-album-title">${activeSong.title}</h1>
            <p class="imm-album-artist">${activeSong.artist}</p>
            <span class="imm-album-genre">${activeSong.genre || (activeSong.year + ' · Original Worship')}</span>
          </div>

          <!-- Direct Action Buttons: Score Download / YouTube / Spotify -->
          <div class="imm-action-pills" style="flex-wrap:wrap; gap:10px; margin-top:1.5rem;">
            ${activeSong.score_url ? `
              <a href="${activeSong.score_url}" target="_blank" class="imm-pill-btn" style="background:var(--gold); color:#111; font-weight:700;">
                <i class="fas fa-file-pdf"></i> 下载歌谱 (PDF)
              </a>
            ` : ''}
            ${activeSong.youtube_url ? `
              <a href="${activeSong.youtube_url}" target="_blank" class="imm-pill-btn" style="background:rgba(255,0,0,0.2); border-color:#ff4d4d; color:#fff;">
                <i class="fab fa-youtube"></i> YouTube 播放
              </a>
            ` : ''}
            ${activeSong.spotify_url ? `
              <a href="${activeSong.spotify_url}" target="_blank" class="imm-pill-btn" style="background:rgba(29,185,84,0.2); border-color:#1db954; color:#fff;">
                <i class="fab fa-spotify"></i> Spotify 聆听
              </a>
            ` : ''}
          </div>
        </div>

        <!-- Right Column: Full Clean Lyrics Panel -->
        <div class="imm-right-col" style="max-width:700px;">
          <div style="background:rgba(0,0,0,0.35); backdrop-filter:blur(15px); border:1px solid rgba(255,255,255,0.15); border-radius:18px; padding:30px 35px; height:100%; display:flex; flex-direction:column;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:12px; margin-bottom:18px;">
              <div>
                <span style="font-size:0.75rem; letter-spacing:2px; color:var(--gold); font-family:var(--font-eng-title);">LYRICS & WORSHIP NOTES</span>
                <h3 style="margin:4px 0 0; color:#fff; font-size:1.4rem; font-family:var(--font-songti), serif;">《${activeSong.title}》完整歌词</h3>
              </div>
              <button class="imm-pill-btn" style="padding:6px 16px; font-size:0.85rem;" onclick="toggleAudioPlay()">
                <i id="lyricsPlayBtnIcon" class="fas ${isPlaying ? 'fa-pause' : 'fa-play'}"></i> ${isPlaying ? '暂停' : '试听'}
              </button>
            </div>

            <div style="flex:1; overflow-y:auto; font-family:var(--font-songti), serif; font-size:1.1rem; line-height:2.2; color:#f1ebd8; white-space:pre-wrap; padding-right:15px;">
              ${activeSong.lyrics}
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
      const cur = activeSong || albums[currentIndex];
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

    const cur = activeSong || albums[currentIndex];
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
    openSongDetailView(currentIndex);
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
        currentIndex = foundIdx;
        updateCoverFlow3DPositions();
      } else {
        alert("未找到匹配的歌曲");
      }
    }
  };

  // Keyboard, Mouse Wheel and Touch Drag Physics
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

    // Mouse Wheel on Carousel
    const shelf = document.getElementById('shelfWrapper');
    if (shelf) {
      let wheelTimeout;
      shelf.addEventListener('wheel', (e) => {
        e.preventDefault();
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
          if (e.deltaY > 15 || e.deltaX > 15) navigateCoverFlow(1);
          else if (e.deltaY < -15 || e.deltaX < -15) navigateCoverFlow(-1);
        }, 35);
      }, { passive: false });
    }
  }

  // Touch and Drag Physics
  function setupTouchAndDrag() {
    const carousel = document.getElementById('coverflowCarousel');
    if (!carousel) return;

    let startX = 0;
    let isDragging = false;

    carousel.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      const endX = e.changedTouches[0].clientX;
      const diff = endX - startX;
      if (Math.abs(diff) > 40) {
        navigateCoverFlow(diff > 0 ? -1 : 1);
      }
      isDragging = false;
    }, { passive: true });

    carousel.addEventListener('mousedown', (e) => {
      startX = e.clientX;
      isDragging = true;
    });

    window.addEventListener('mouseup', (e) => {
      if (!isDragging) return;
      const diff = e.clientX - startX;
      if (Math.abs(diff) > 50) {
        navigateCoverFlow(diff > 0 ? -1 : 1);
      }
      isDragging = false;
    });
  }

  // Boot on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
