/**
 * 🎵 Harvester 3D Album Cover Flow & Booklet Engine v2.0
 * Fully matching Image 1 (3D Stacked Album Shelf with Thick Spines) & Image 2 (Interactive Booklet)
 */

(function() {
  // Built-in Curated Album Catalog with Distinctive Colored Spines (Matching Image 1)
  const defaultAlbums = [
    {
      id: "album_renew",
      title: "更新敬拜",
      title_en: "Renewed Worship",
      artist: "Harvester Music Production",
      artist_short: "HARVESTER",
      year: "2025",
      spine_bg: "linear-gradient(180deg, #2b241e 0%, #171310 100%)",
      color: "#f6d28a",
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
在祢爱中 重获自由与新生`
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
祢的名当受称颂`
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
Praise the power of Your name!`
        }
      ]
    },
    {
      id: "album_fire",
      title: "灵火 Awakening",
      title_en: "Spiritual Fire Awakening",
      artist: "Harvester Creative Team",
      artist_short: "AWAKENING",
      year: "2024",
      spine_bg: "linear-gradient(180deg, #137a6b 0%, #0a473e 100%)",
      color: "#2dd4bf",
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
      artist_short: "HARVEST FIELD",
      year: "2024",
      spine_bg: "linear-gradient(180deg, #1f4f89 0%, #112d52 100%)",
      color: "#60a5fa",
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
      artist_short: "LIVING STREAM",
      year: "2025",
      spine_bg: "linear-gradient(180deg, #42291a 0%, #20130b 100%)",
      color: "#fb923c",
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
    },
    {
      id: "album_you_are_all",
      title: "祢是唯一",
      title_en: "You Are My All",
      artist: "Harvester Acoustic",
      artist_short: "YOU ARE MY ALL",
      year: "2024",
      spine_bg: "linear-gradient(180deg, #eceae4 0%, #cac6bd 100%)",
      color: "#181411",
      cover_url: "assets/logo.png",
      description: "纯净钢琴与弦乐，向主倾心吐意的深情告白。",
      tracks: [
        {
          id: "track_all_01",
          track_no: "01",
          title: "祢是唯一",
          artist: "Harvester Acoustic",
          duration: "4:40",
          youtube_url: "https://www.youtube.com/@harvestermusic.production",
          spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ",
          score_url: "assets/scores/sample.pdf",
          lyrics: `【祢是唯一】\n在天地之间，唯有祢是我心所慕，是我永远的福分。`
        },
        {
          id: "track_all_02",
          track_no: "02",
          title: "主祢是我的一切",
          artist: "Harvester Acoustic",
          duration: "4:12",
          youtube_url: "https://www.youtube.com/@harvestermusic.production",
          spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ",
          score_url: "assets/scores/sample.pdf",
          lyrics: `【主祢是我的一切】\n除祢以外，在天上我有谁呢？除祢以外，在地上我也没有所爱慕的。`
        }
      ]
    },
    {
      id: "album_heart_desire",
      title: "心愿诗歌",
      title_en: "Heart's Desire",
      artist: "Harvester Strings Ensemble",
      artist_short: "HEART'S DESIRE",
      year: "2025",
      spine_bg: "linear-gradient(180deg, #d9534f 0%, #8c2320 100%)",
      color: "#f87171",
      cover_url: "assets/placeholder.jpg",
      description: "当代灵修弦乐诗歌，温暖抚慰每一个疲惫的心灵。",
      tracks: [
        {
          id: "track_hd_01",
          track_no: "01",
          title: "我心所愿",
          artist: "Strings Ensemble",
          duration: "4:55",
          youtube_url: "https://www.youtube.com/@harvestermusic.production",
          spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ",
          score_url: "assets/scores/sample.pdf",
          lyrics: `【我心所愿】\n愿我的祷告如香陈列在祢面前，愿我举手祈求如献晚祭。`
        }
      ]
    },
    {
      id: "album_sanctuary",
      title: "圣所之中",
      title_en: "In The Sanctuary",
      artist: "Harvester Chamber Choir",
      artist_short: "SANCTUARY",
      year: "2024",
      spine_bg: "linear-gradient(180deg, #2b4566 0%, #15263a 100%)",
      color: "#93c5fd",
      cover_url: "assets/logo.png",
      description: "庄严大气的圣殿敬拜，重现古老诗篇的荣美回响。",
      tracks: [
        {
          id: "track_sc_01",
          track_no: "01",
          title: "在祢圣所中",
          artist: "Chamber Choir",
          duration: "5:30",
          youtube_url: "https://www.youtube.com/@harvestermusic.production",
          spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ",
          score_url: "assets/scores/sample.pdf",
          lyrics: `【在祢圣所中】\n神啊，祢是我的神，我要切切地寻求祢。`
        }
      ]
    },
    {
      id: "album_disciple",
      title: "十字架的传人",
      title_en: "Disciple of The Cross",
      artist: "Harvester Mission Team",
      artist_short: "DISCIPLE",
      year: "2025",
      spine_bg: "linear-gradient(180deg, #96562b 0%, #542b10 100%)",
      color: "#fdba74",
      cover_url: "assets/placeholder.jpg",
      description: "立志委身、背起十架跟随基督的宣教呼召之歌。",
      tracks: [
        {
          id: "track_dc_01",
          track_no: "01",
          title: "十字架的传人",
          artist: "Mission Team",
          duration: "4:48",
          youtube_url: "https://www.youtube.com/@harvestermusic.production",
          spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ",
          score_url: "assets/scores/sample.pdf",
          lyrics: `【十字架的传人】\n背起十字架，跟随主脚踪。无论海角天涯，坚守使命到底。`
        }
      ]
    },
    {
      id: "album_grace",
      title: "恩典洋溢",
      title_en: "Abundant Grace",
      artist: "Harvester Worship Collective",
      artist_short: "ABUNDANT GRACE",
      year: "2025",
      spine_bg: "linear-gradient(180deg, #741728 0%, #3e0b14 100%)",
      color: "#f472b6",
      cover_url: "assets/logo.png",
      description: "诉说神在生命每一步奇妙带领与丰盛恩典。",
      tracks: [
        {
          id: "track_gr_01",
          track_no: "01",
          title: "恩典洋溢",
          artist: "Worship Collective",
          duration: "4:22",
          youtube_url: "https://www.youtube.com/@harvestermusic.production",
          spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ",
          score_url: "assets/scores/sample.pdf",
          lyrics: `【恩典洋溢】\n祢以恩典为年岁的冠冕，祢的路径都滴下脂油。`
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

  // Render 3D Cover Flow Carousel with Full 3D Slabs (Thick Spines - Image 1)
  function renderCoverFlow() {
    const stage = document.getElementById('coverflowStage');
    if (!stage) return;

    stage.innerHTML = `
      <div class="coverflow-carousel" id="coverflowCarousel">
        ${albums.map((album, idx) => `
          <div class="album-3d-box" data-index="${idx}" onclick="handleAlbumClick(${idx})">
            <div class="album-cube">
              <!-- 1. Front Artwork Face -->
              <div class="cube-face cube-front">
                <img src="${album.cover_url || 'assets/logo.png'}" alt="${album.title}" onerror="this.src='assets/logo.png'">
                <div class="album-glass-sheen"></div>
                <div class="album-inner-border"></div>
              </div>

              <!-- 2. Left Spine (Thick Side Facing Viewer - Image 1) -->
              <div class="cube-face cube-spine-left" style="background: ${album.spine_bg || '#1a1816'};">
                <div class="spine-content" style="color: ${album.id === 'album_you_are_all' ? '#111' : '#fff'};">
                  <span class="spine-logo"><i class="fas fa-compact-disc"></i></span>
                  <span class="spine-title">${album.title}</span>
                  <span class="spine-artist">${album.artist_short || 'HARVESTER'}</span>
                </div>
              </div>

              <!-- 3. Right Spine -->
              <div class="cube-face cube-spine-right" style="background: ${album.spine_bg || '#1a1816'};">
                <div class="spine-content" style="color: ${album.id === 'album_you_are_all' ? '#111' : '#fff'};">
                  <span class="spine-logo"><i class="fas fa-compact-disc"></i></span>
                  <span class="spine-title">${album.title}</span>
                  <span class="spine-artist">${album.artist_short || 'HARVESTER'}</span>
                </div>
              </div>

              <!-- 4. Top Thickness Edge -->
              <div class="cube-face cube-top" style="background: ${album.spine_bg || '#1a1816'}; filter: brightness(1.25);"></div>

              <!-- 5. Bottom Thickness Edge -->
              <div class="cube-face cube-bottom"></div>

              <!-- 6. Back Cover Face -->
              <div class="cube-face cube-back">
                <div class="cube-back-header">
                  <span class="cube-back-title">${album.title}</span>
                  <span class="cube-back-logo">HARVESTER</span>
                </div>
                <div class="cube-back-tracks">
                  ${album.tracks.slice(0, 4).map(t => `<div>${t.track_no}. ${t.title}</div>`).join('')}
                  ${album.tracks.length > 4 ? `<div>... +${album.tracks.length - 4} 首更多</div>` : ''}
                </div>
                <div class="cube-back-footer">
                  <span>© ${album.year} HARVESTER</span>
                  <span><i class="fas fa-barcode"></i></span>
                </div>
              </div>
            </div>

            <!-- Floor 3D Drop Shadow -->
            <div class="album-shadow-3d"></div>
          </div>
        `).join('')}
      </div>

      <!-- Active Album Indicator & Navigation Bar -->
      <div class="coverflow-meta-bar fade-in">
        <button class="cf-nav-btn prev" onclick="navigateCoverFlow(-1)" title="上一张 (Previous)"><i class="fas fa-chevron-left"></i></button>
        <div class="active-album-info" id="activeAlbumInfo">
          <span class="cf-tag font-eng-title" id="cfAlbumYear">${albums[0].year} RELEASE</span>
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

  // Calculate 3D Matrix & Offset for all albums (Matching Image 1 Perspective)
  function updateCoverFlow3DPositions() {
    const boxes = document.querySelectorAll('.album-3d-box');
    boxes.forEach((box, i) => {
      const offset = i - currentIndex;
      box.classList.toggle('active', offset === 0);

      let transformStyle = '';
      let zIndex = 100 - Math.abs(offset);
      let opacity = 1;

      if (offset === 0) {
        // Active Center Album: Tilted slightly at -18deg so user sees both the front artwork AND the 3D thick spine!
        transformStyle = `translateX(0px) translateZ(120px) rotateY(-18deg) scale(1.12)`;
        opacity = 1;
      } else if (offset < 0) {
        // Left Side Albums: Tilted +64deg showing the front cover slanted right and thick spine facing forward
        const xOffset = offset * 85 - 130;
        const zOffset = Math.abs(offset) * -55;
        const rotY = 64;
        const scale = Math.max(0.72, 1 - Math.abs(offset) * 0.05);
        opacity = Math.max(0.35, 1 - Math.abs(offset) * 0.12);
        transformStyle = `translateX(${xOffset}px) translateZ(${zOffset}px) rotateY(${rotY}deg) scale(${scale})`;
      } else {
        // Right Side Albums: Tilted -64deg showing the front cover slanted left and thick spine facing forward
        const xOffset = offset * 85 + 130;
        const zOffset = Math.abs(offset) * -55;
        const rotY = -64;
        const scale = Math.max(0.72, 1 - Math.abs(offset) * 0.05);
        opacity = Math.max(0.35, 1 - Math.abs(offset) * 0.12);
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
      // Clicked current active album -> open booklet modal (Image 2)
      openAlbumBooklet(idx);
    } else {
      // Clicked adjacent album in stack -> focus it!
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
    if (window.gsap) {
      gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.35 });
      gsap.fromTo(".booklet-container", { scale: 0.94, opacity: 0, y: 30 }, { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: "power3.out" });
    }
  };

  window.closeAlbumBooklet = function() {
    const modal = document.getElementById('albumBookletModal');
    if (!modal) return;
    if (window.gsap) {
      gsap.to(".booklet-container", { scale: 0.94, opacity: 0, y: 20, duration: 0.25 });
      gsap.to(modal, { opacity: 0, duration: 0.25, onComplete: () => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }});
    } else {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
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
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
