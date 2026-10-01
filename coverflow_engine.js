/**
 * 🎵 Harvester 3D Album Cover Flow & Booklet Engine v1.0
 * Inspired by classic 3D Coverflow & Modern Booklet Album Experience
 */

(function() {
  // Built-in Curated Album Catalog (Enhanced with Supabase Real-time Sync)
  const defaultAlbums = [
    {
      id: "album_renew",
      title: "更新敬拜",
      title_en: "Renewed Worship",
      artist: "Harvester Music Production",
      year: "2025",
      color: "#f6d28a",
      theme_bg: "linear-gradient(135deg, #1f1a14 0%, #12100e 100%)",
      cover_url: "assets/logo.png",
      description: "汇聚原创敬拜诗歌，以真理与圣灵重燃当代敬拜之火。",
      tracks: [
        {
          id: "track_01",
          track_no: "01",
          title: "更新敬拜",
          artist: "Harvester Worship",
          duration: "4:18",
          youtube_url: "https://www.youtube.com/@harvestermusic.production",
          spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ",
          score_url: "assets/scores/sample.pdf",
          audio_preview: "assets/audio/sample.mp3",
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
          id: "track_02",
          track_no: "02",
          title: "灵火",
          artist: "Harvester Worship",
          duration: "4:52",
          youtube_url: "https://www.youtube.com/@harvestermusic.production",
          spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ",
          score_url: "assets/scores/sample.pdf",
          audio_preview: "assets/audio/sample.mp3",
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
在祢爱中 重获自由与新生

（尾奏）
圣灵请来 焚烧我心
点燃生命的祭坛
一生为主发光`
        },
        {
          id: "track_03",
          track_no: "03",
          title: "因为祢 上帝",
          artist: "Harvester Worship",
          duration: "5:10",
          youtube_url: "https://www.youtube.com/@harvestermusic.production",
          spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ",
          score_url: "assets/scores/sample.pdf",
          audio_preview: "assets/audio/sample.mp3",
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
祢的名当受称颂

（副歌二）
因祢的慈爱比生命更好
我的嘴唇要颂赞祢
我还活的时候要这样称颂祢
因祢的名举手赞美`
        },
        {
          id: "track_04",
          track_no: "04",
          title: "Im Alive",
          artist: "Harvester Praise",
          duration: "3:45",
          youtube_url: "https://www.youtube.com/@harvestermusic.production",
          spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ",
          score_url: "assets/scores/sample.pdf",
          audio_preview: "assets/audio/sample.mp3",
          lyrics: `【Im Alive】
Lyrics & Music: Harvester Praise

I'm alive in Your love, Jesus
Every breath I take is by Your grace
From the darkness into Your glorious light
You have set my feet upon the rock

(Chorus)
I'm alive, I will sing
For the victory You bring
No more fear, no more shame
Praise the power of Your name!

(Bridge)
Higher than the mountains
Deeper than the sea
Your love unfailing
Rescued me!`
        }
      ]
    },
    {
      id: "album_fire",
      title: "灵火 Awakening",
      title_en: "Spiritual Fire Awakening",
      artist: "Harvester Creative Team",
      year: "2024",
      color: "#e8a848",
      theme_bg: "linear-gradient(135deg, #24160d 0%, #12100e 100%)",
      cover_url: "assets/placeholder.jpg",
      description: "在旷野与安静中，寻求圣灵的复兴与更新。",
      tracks: [
        {
          id: "track_fire_01",
          track_no: "01",
          title: "灵火 (Acoustic Ver.)",
          artist: "Harvester Team",
          duration: "4:30",
          youtube_url: "https://www.youtube.com/@harvestermusic.production",
          spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ",
          score_url: "assets/scores/sample.pdf",
          lyrics: `【灵火 (Acoustic)】\n木吉他与清澈人声版，带你回到内室的祷告与默想。\n\n愿圣灵的烈火 洁净我心思\n让我的敬拜 单单归于祢\n放下一切重担 紧随祢脚踪\n在祢爱中 重获自由与新生`
        },
        {
          id: "track_fire_02",
          track_no: "02",
          title: "晨星升起",
          artist: "Harvester Team",
          duration: "3:58",
          youtube_url: "https://www.youtube.com/@harvestermusic.production",
          spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ",
          score_url: "assets/scores/sample.pdf",
          lyrics: `【晨星升起】\n黑夜将尽，晨光破晓。\n主耶稣是明亮的晨星，照亮我们前面的道路。`
        },
        {
          id: "track_fire_03",
          track_no: "03",
          title: "安静溪水旁",
          artist: "Harvester Team",
          duration: "5:05",
          youtube_url: "https://www.youtube.com/@harvestermusic.production",
          spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ",
          score_url: "assets/scores/sample.pdf",
          lyrics: `【安静溪水旁】\n诗篇23篇默想诗歌。\n祂使我躺卧在青草地上，领我在可安歇的水边。`
        }
      ]
    },
    {
      id: "album_harvest",
      title: "田野收割精选",
      title_en: "Harvest Field Collection",
      artist: "Harvester Gospel Collective",
      year: "2024",
      color: "#f4be6a",
      theme_bg: "linear-gradient(135deg, #1e1b15 0%, #12100e 100%)",
      cover_url: "assets/logo.png",
      description: "「那人撒种，这人收割」—— 用现代流行音乐播种福音种子。",
      tracks: [
        {
          id: "track_h_01",
          track_no: "01",
          title: "收割的呼召",
          artist: "Gospel Singers",
          duration: "4:15",
          youtube_url: "https://www.youtube.com/@harvestermusic.production",
          spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ",
          score_url: "assets/scores/sample.pdf",
          lyrics: `【收割的呼召】\n庄稼已经熟了，求庄稼的主打发工人出去收祂的庄稼！`
        },
        {
          id: "track_h_02",
          track_no: "02",
          title: "因为祢 上帝 (Live)",
          artist: "Worship Live",
          duration: "5:20",
          youtube_url: "https://www.youtube.com/@harvestermusic.production",
          spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ",
          score_url: "assets/scores/sample.pdf",
          lyrics: `【因为祢 上帝 (现场敬拜版)】\n全会众同心高声合唱，充满恩膏的敬拜现场。`
        }
      ]
    },
    {
      id: "album_alive",
      title: "生命涌流 CCM",
      title_en: "Living Stream Praise",
      artist: "Harvester Praise Band",
      year: "2025",
      color: "#d4a359",
      theme_bg: "linear-gradient(135deg, #171c22 0%, #101214 100%)",
      cover_url: "assets/placeholder.jpg",
      description: "融合流行与节奏布鲁斯现代风格，充满活力的赞美。",
      tracks: [
        {
          id: "track_al_01",
          track_no: "01",
          title: "Im Alive (Radio Edit)",
          artist: "Harvester Band",
          duration: "3:30",
          youtube_url: "https://www.youtube.com/@harvestermusic.production",
          spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ",
          score_url: "assets/scores/sample.pdf",
          lyrics: `【Im Alive (Radio Mix)】\n充满阳光与盼望的现代流行敬拜旋律！`
        },
        {
          id: "track_al_02",
          track_no: "02",
          title: "恩典之路",
          artist: "Harvester Band",
          duration: "4:05",
          youtube_url: "https://www.youtube.com/@harvestermusic.production",
          spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ",
          score_url: "assets/scores/sample.pdf",
          lyrics: `【恩典之路】\n一步又一步，这是恩典之路。\n主的手必亲自搀拉我前行。`
        }
      ]
    }
  ];

  let albums = [...defaultAlbums];
  let currentIndex = 0;
  let activeAlbum = null;
  let activeTrack = null;
  let isPlaying = false;

  // Initialize
  async function init() {
    await fetchSupabaseSongs();
    renderCoverFlow();
    setupEventListeners();
    setupTouchAndDrag();
  }

  // Pull latest songs from Supabase and integrate into album 0
  async function fetchSupabaseSongs() {
    try {
      if (window.supabase) {
        const { data: songs } = await window.supabase.from('music_works').select('*').order('created_at', { ascending: false });
        if (songs && songs.length > 0) {
          // Merge dynamic songs into first album tracks
          const dynamicTracks = songs.map((s, idx) => ({
            id: s.id,
            track_no: String(idx + 1).padStart(2, '0'),
            title: s.title,
            artist: "Harvester Music",
            duration: "4:15",
            youtube_url: s.audio_url || s.youtube_url || "https://www.youtube.com/@harvestermusic.production",
            spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ",
            score_url: s.score_url || "assets/scores/sample.pdf",
            lyrics: s.description ? s.description : `【${s.title}】\n\n词曲：Harvester Music Production\n愿每一首写给神的歌都被听见。\n欢迎下载歌谱使用并在各处传唱。`
          }));

          // Prepend or enrich first album
          albums[0].tracks = dynamicTracks;
          if (songs[0]?.cover_url) {
            albums[0].cover_url = songs[0].cover_url;
          }
        }
      }
    } catch(e) {
      console.warn("CoverFlow Supabase Fetch Note:", e);
    }
  }

  // Render 3D Cover Flow Carousel
  function renderCoverFlow() {
    const stage = document.getElementById('coverflowStage');
    if (!stage) return;

    stage.innerHTML = `
      <div class="coverflow-carousel" id="coverflowCarousel">
        ${albums.map((album, idx) => `
          <div class="album-3d-box" data-index="${idx}" onclick="handleAlbumClick(${idx})">
            <!-- 3D Spine (Box Thickness) -->
            <div class="album-spine">
              <span class="spine-text">${album.title}</span>
            </div>
            <!-- Front Cover -->
            <div class="album-face album-front">
              <img src="${album.cover_url || 'assets/logo.png'}" alt="${album.title}" onerror="this.src='assets/logo.png'">
              <div class="album-glass-sheen"></div>
            </div>
            <!-- Reflection & Floor Shadow -->
            <div class="album-shadow"></div>
          </div>
        `).join('')}
      </div>

      <!-- Active Album Indicator & Navigation -->
      <div class="coverflow-meta-bar fade-in">
        <button class="cf-nav-btn prev" onclick="navigateCoverFlow(-1)" title="上一张 (Previous)"><i class="fas fa-chevron-left"></i></button>
        <div class="active-album-info" id="activeAlbumInfo">
          <span class="cf-tag font-eng-title" id="cfAlbumYear">2025 RELEASE</span>
          <h2 class="cf-album-title" id="cfAlbumTitle">${albums[0].title}</h2>
          <p class="cf-album-artist" id="cfAlbumArtist">${albums[0].artist} · ${albums[0].tracks.length} 首歌曲</p>
          <button class="btn-open-booklet" onclick="openAlbumBooklet(${currentIndex})">
            <i class="fas fa-book-open"></i> 翻开专辑与歌谱 (View Album & Scores)
          </button>
        </div>
        <button class="cf-nav-btn next" onclick="navigateCoverFlow(1)" title="下一张 (Next)"><i class="fas fa-chevron-right"></i></button>
      </div>
    `;

    updateCoverFlow3DPositions();
  }

  // Calculate 3D Matrix & Offset for all albums
  function updateCoverFlow3DPositions() {
    const boxes = document.querySelectorAll('.album-3d-box');
    boxes.forEach((box, i) => {
      const offset = i - currentIndex;
      box.classList.toggle('active', offset === 0);

      let transformStyle = '';
      let zIndex = 100 - Math.abs(offset);
      let opacity = 1;

      if (offset === 0) {
        // Center Active Album: Faces camera directly, lifted forward with shine
        transformStyle = `translateX(0px) translateZ(140px) rotateY(0deg) scale(1.08)`;
      } else if (offset < 0) {
        // Left Albums: Tilted right with depth
        const xOffset = offset * 130 - 70;
        const zOffset = Math.abs(offset) * -85;
        const rotY = 52;
        opacity = Math.max(0.25, 1 - Math.abs(offset) * 0.2);
        transformStyle = `translateX(${xOffset}px) translateZ(${zOffset}px) rotateY(${rotY}deg) scale(${Math.max(0.7, 1 - Math.abs(offset) * 0.08)})`;
      } else {
        // Right Albums: Tilted left with depth
        const xOffset = offset * 130 + 70;
        const zOffset = Math.abs(offset) * -85;
        const rotY = -52;
        opacity = Math.max(0.25, 1 - Math.abs(offset) * 0.2);
        transformStyle = `translateX(${xOffset}px) translateZ(${zOffset}px) rotateY(${rotY}deg) scale(${Math.max(0.7, 1 - Math.abs(offset) * 0.08)})`;
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
      if (artistEl) artistEl.innerText = `${cur.artist} · ${cur.tracks.length} 首歌曲`;
      if (yearEl) yearEl.innerText = `${cur.year} RELEASE`;
    }
  }

  // Navigate Coverflow
  window.navigateCoverFlow = function(dir) {
    currentIndex += dir;
    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex >= albums.length) currentIndex = albums.length - 1;
    updateCoverFlow3DPositions();
  };

  // Click on Album Card
  window.handleAlbumClick = function(idx) {
    if (idx === currentIndex) {
      // Clicked current active album -> open booklet!
      openAlbumBooklet(idx);
    } else {
      // Clicked adjacent album -> focus it!
      currentIndex = idx;
      updateCoverFlow3DPositions();
    }
  };

  // ==========================================
  // 📖 ALBUM BOOKLET MODAL (Matching Image 2)
  // ==========================================
  window.openAlbumBooklet = function(albumIdx) {
    activeAlbum = albums[albumIdx] || albums[0];
    activeTrack = activeAlbum.tracks[0];

    const modal = document.getElementById('albumBookletModal');
    if (!modal) return;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    renderBookletContent();
    gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.4 });
    gsap.fromTo(".booklet-container", { scale: 0.94, opacity: 0, y: 30 }, { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
  };

  window.closeAlbumBooklet = function() {
    const modal = document.getElementById('albumBookletModal');
    if (!modal) return;
    gsap.to(".booklet-container", { scale: 0.94, opacity: 0, y: 20, duration: 0.3 });
    gsap.to(modal, { opacity: 0, duration: 0.3, onComplete: () => {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }});
  };

  function renderBookletContent() {
    if (!activeAlbum) return;

    // 1. Left Artwork Panel
    const leftCover = document.getElementById('bookletCoverImg');
    const leftTitle = document.getElementById('bookletAlbumTitle');
    const leftArtist = document.getElementById('bookletAlbumArtist');
    if (leftCover) leftCover.src = activeAlbum.cover_url || 'assets/logo.png';
    if (leftTitle) leftTitle.innerText = activeAlbum.title;
    if (leftArtist) leftArtist.innerText = activeAlbum.artist;

    // 2. Middle Tracklist Panel
    const trackListContainer = document.getElementById('bookletTrackList');
    if (trackListContainer) {
      trackListContainer.innerHTML = activeAlbum.tracks.map((t, idx) => `
        <div class="track-item ${t.id === activeTrack?.id ? 'active' : ''}" onclick="selectTrack('${t.id}')">
          <span class="track-num font-eng-title">${t.track_no}</span>
          <div class="track-meta">
            <span class="track-name">${t.title}</span>
            <span class="track-artist">${t.artist || activeAlbum.artist}</span>
          </div>
          <span class="track-duration font-eng-title">${t.duration}</span>
        </div>
      `).join('');
    }

    // 3. Right Lyric & Action Panel
    updateActiveTrackPanel();
  }

  window.selectTrack = function(trackId) {
    activeTrack = activeAlbum.tracks.find(t => t.id === trackId) || activeAlbum.tracks[0];
    
    // Update active highlight in tracklist
    document.querySelectorAll('.track-item').forEach(el => el.classList.remove('active'));
    event?.currentTarget?.classList.add('active');

    updateActiveTrackPanel();
  };

  function updateActiveTrackPanel() {
    if (!activeTrack) return;

    const trackTitleEl = document.getElementById('bookletTrackTitle');
    const lyricsBoxEl = document.getElementById('bookletLyricsBox');
    const btnScoreEl = document.getElementById('btnActionScore');
    const btnYtEl = document.getElementById('btnActionYT');
    const btnSpEl = document.getElementById('btnActionSpotify');

    if (trackTitleEl) trackTitleEl.innerText = activeTrack.title;
    if (lyricsBoxEl) {
      lyricsBoxEl.innerHTML = activeTrack.lyrics.replace(/\n/g, '<br>');
      lyricsBoxEl.scrollTop = 0;
    }

    // Download Score PDF
    if (btnScoreEl) {
      btnScoreEl.href = activeTrack.score_url || '#';
      btnScoreEl.style.display = activeTrack.score_url ? 'inline-flex' : 'none';
    }
    // YouTube
    if (btnYtEl) {
      btnYtEl.href = activeTrack.youtube_url || '#';
      btnYtEl.style.display = activeTrack.youtube_url ? 'inline-flex' : 'none';
    }
    // Spotify
    if (btnSpEl) {
      btnSpEl.href = activeTrack.spotify_url || '#';
      btnSpEl.style.display = activeTrack.spotify_url ? 'inline-flex' : 'none';
    }

    // Update Bottom Mini Player Bar
    updateMiniPlayer(activeTrack);
  }

  // Update Bottom Mini Player
  function updateMiniPlayer(track) {
    const playerBar = document.getElementById('miniPlayerBar');
    const miniTitle = document.getElementById('miniPlayerTitle');
    const miniArtist = document.getElementById('miniPlayerArtist');
    const miniCover = document.getElementById('miniPlayerCover');
    if (!playerBar) return;

    if (miniTitle) miniTitle.innerText = track.title;
    if (miniArtist) miniArtist.innerText = track.artist || activeAlbum.artist;
    if (miniCover) miniCover.src = activeAlbum.cover_url || 'assets/logo.png';
  }

  window.toggleAudioPlay = function() {
    const playIcon = document.getElementById('playPauseIcon');
    isPlaying = !isPlaying;
    if (playIcon) {
      playIcon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
    }
  };

  // Keyboard and Wheel navigation
  function setupEventListeners() {
    window.addEventListener('keydown', (e) => {
      const modal = document.getElementById('albumBookletModal');
      if (modal && modal.style.display === 'flex') {
        if (e.key === 'Escape') closeAlbumBooklet();
        return;
      }
      if (e.key === 'ArrowLeft') navigateCoverFlow(-1);
      if (e.key === 'ArrowRight') navigateCoverFlow(1);
    });

    const carousel = document.getElementById('coverflowStage');
    if (carousel) {
      carousel.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaX) > 30 || Math.abs(e.deltaY) > 30) {
          if (e.deltaY > 0 || e.deltaX > 0) navigateCoverFlow(1);
          else navigateCoverFlow(-1);
        }
      }, { passive: true });
    }
  }

  // Mobile Touch & Drag Gestures
  function setupTouchAndDrag() {
    let startX = 0;
    let isDragging = false;
    const stage = document.getElementById('coverflowStage');
    if (!stage) return;

    stage.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    stage.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;
      const endX = e.changedTouches[0].clientX;
      const diff = endX - startX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) navigateCoverFlow(1);
        else navigateCoverFlow(-1);
      }
    }, { passive: true });
  }

  // Auto-init on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', init);
})();
