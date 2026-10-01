/**
 * 🎵 Harvester 3D Album Cover Flow & Immersive Booklet Engine
 * Pixel-Perfect Replica of Video (ScreenRecording_10-01-2026):
 * 1. 3D Spine-Stacked Album Rack with Fluid Drag/Swipe & Perspective Slabs
 * 2. Immersive Zooming Album Detail Screen with Dynamic Ambient Palette
 * 3. Multi-Panel Extended Booklet Spreads (01|03 Pages, Artist Cutouts & Track Index)
 * 4. Persistent Floating Mini-Player Pill with Real Audio Playback & Visualizer
 */

(function() {
  // Built-in Curated Album Catalog with Distinctive Colored Spines & Rich Content
  const defaultAlbums = [
    {
      id: "album_mission",
      title: "Mission : Heartbeat Defense",
      title_cn: "心跳保卫战",
      artist: "Mango Jump & Harvester",
      artist_short: "Mango Jump",
      genre: "Alternative · 2023",
      year: "2023",
      theme_color: "#169b9b",
      spine_bg: "#00b894",
      spine_color: "#ffffff",
      spine_text: "Mission : Heartbeat Defense Mango Jump",
      cover_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
      artist_image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80",
      description: "充满复古活力与律动的摇滚赞美专辑，点燃青春心跳与对神的火热。",
      tracks: [
        { id: "m_01", track_no: "01", title: "Intro", duration: "0'44\"", audio_url: "https://actions.google.com/sounds/v1/ambiences/humming_room.ogg", youtube_url: "https://www.youtube.com/@harvestermusic.production", spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ", score_url: "assets/scores/sample.pdf", lyrics: "【Intro】\n\nPure vibrant beats leading into the heartbeat of worship." },
        { id: "m_02", track_no: "02", title: "Light", duration: "2'45\"", audio_url: "https://actions.google.com/sounds/v1/science_fiction/deep_whoosh.ogg", youtube_url: "https://www.youtube.com/@harvestermusic.production", spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ", score_url: "assets/scores/sample.pdf", lyrics: "【Light】\n词曲：Harvester\n\n黑夜不能遮蔽祢的光芒\n在黎明破晓前 祢的真光照亮全地\n从今时直到永远\n万民都要看见祢的荣耀！" },
        { id: "m_03", track_no: "03", title: "I Am Not Cool", duration: "3'31\"", audio_url: "", youtube_url: "https://www.youtube.com/@harvestermusic.production", spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ", score_url: "assets/scores/sample.pdf", lyrics: "【I Am Not Cool】\n\n放下世俗的标签 单单以神为夸口！" },
        { id: "m_04", track_no: "04", title: "I'm into You", duration: "3'27\"", audio_url: "", youtube_url: "https://www.youtube.com/@harvestermusic.production", spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ", score_url: "assets/scores/sample.pdf", lyrics: "【I'm into You】\n\n心单单归向祢，全心全意爱慕主！" },
        { id: "m_05", track_no: "05", title: "Before Dawn", duration: "2'45\"", audio_url: "", youtube_url: "https://www.youtube.com/@harvestermusic.production", spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ", score_url: "assets/scores/sample.pdf", lyrics: "【Before Dawn】\n\n晨光破晓前，在内室向主倾心吐意。" },
        { id: "m_06", track_no: "06", title: "Burning Heart", duration: "3'10\"", audio_url: "", youtube_url: "https://www.youtube.com/@harvestermusic.production", spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ", score_url: "assets/scores/sample.pdf", lyrics: "【Burning Heart】\n\n求圣灵的烈火燃烧我们，一生跟随主！" },
        { id: "m_07", track_no: "07", title: "Nyoom", duration: "2'55\"", audio_url: "", youtube_url: "https://www.youtube.com/@harvestermusic.production", spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ", score_url: "assets/scores/sample.pdf", lyrics: "【Nyoom】\n\n奔跑不放弃，向着标杆直跑！" },
        { id: "m_08", track_no: "08", title: "Tasting Loneliness", duration: "3'46\"", audio_url: "", youtube_url: "https://www.youtube.com/@harvestermusic.production", spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ", score_url: "assets/scores/sample.pdf", lyrics: "【Tasting Loneliness】\n\n在孤单安静处，与主面对面。" },
        { id: "m_09", track_no: "09", title: "Sayounara", duration: "4'22\"", audio_url: "", youtube_url: "https://www.youtube.com/@harvestermusic.production", spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ", score_url: "assets/scores/sample.pdf", lyrics: "【Sayounara】\n\n告别旧事已过，一切都变成新的了。" },
        { id: "m_10", track_no: "10", title: "Outro", duration: "0'48\"", audio_url: "", youtube_url: "https://www.youtube.com/@harvestermusic.production", spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ", score_url: "assets/scores/sample.pdf", lyrics: "【Outro】\n\nPeace be upon you in the Lord." },
        { id: "m_11", track_no: "11", title: "My Ankel!! (All ICE 8-Bit Remix)", duration: "2'55\"", audio_url: "", youtube_url: "https://www.youtube.com/@harvestermusic.production", spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ", score_url: "assets/scores/sample.pdf", lyrics: "【My Ankel!! 8-Bit】\n\n8-Bit 像素电子特别混音版！" }
      ]
    },
    {
      id: "album_renew",
      title: "更新敬拜 · Renewed Worship",
      title_cn: "更新敬拜",
      artist: "Harvester Worship",
      artist_short: "Harvester Worship",
      genre: "Worship / CCM · 2025",
      year: "2025",
      theme_color: "#1c2b36",
      spine_bg: "#1877F2",
      spine_color: "#ffffff",
      spine_text: "更新敬拜 · 1976 Harvester",
      cover_url: "assets/logo.png",
      artist_image: "assets/logo.png",
      description: "汇聚原创敬拜诗歌，以真理与圣灵重燃当代敬拜之火。",
      tracks: [
        { id: "rw_01", track_no: "01", title: "更新敬拜", duration: "4'18\"", audio_url: "", youtube_url: "https://www.youtube.com/@harvestermusic.production", spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ", score_url: "assets/scores/sample.pdf", lyrics: "【更新敬拜】\n词曲：Harvester Music Production\n\n在祢的光中 我们得见光\n圣灵的火 燃烧我们心房\n愿祢国度降临 愿祢旨意成全\n在这里 更新我们敬拜\n\n（副歌）\n更新我们 燃烧我们\n以真理和圣灵敬拜祢\n生命献上 作活祭\n一生跟随 荣耀主名" },
        { id: "rw_02", track_no: "02", title: "灵火", duration: "4'52\"", audio_url: "", youtube_url: "https://www.youtube.com/@harvestermusic.production", spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ", score_url: "assets/scores/sample.pdf", lyrics: "【灵火】\n词曲：Harvester\n\n愿圣灵的烈火 洁净我心思\n让我的敬拜 单单归于祢" },
        { id: "rw_03", track_no: "03", title: "因为祢 上帝", duration: "5'10\"", audio_url: "", youtube_url: "https://www.youtube.com/@harvestermusic.production", spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ", score_url: "assets/scores/sample.pdf", lyrics: "【因为祢 上帝】\n\n祢是我坚固台 是我避难所\n我心单单仰望祢" },
        { id: "rw_04", track_no: "04", title: "Im Alive", duration: "3'45\"", audio_url: "", youtube_url: "https://www.youtube.com/@harvestermusic.production", spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ", score_url: "assets/scores/sample.pdf", lyrics: "【Im Alive】\n\nI'm alive in Your love Jesus!" }
      ]
    },
    {
      id: "album_soft_lipa",
      title: "Secrets of Tu Cheng Hsi",
      title_cn: "杜振熙的秘密",
      artist: "Soft Lipa · 蛋堡",
      artist_short: "Soft Lipa",
      genre: "Hip-Hop / Soul · 2024",
      year: "2024",
      theme_color: "#b06d60",
      spine_bg: "#ea8676",
      spine_color: "#ffffff",
      spine_text: "Secrets of Tu Cheng Hsi: Renovate Soft Lipa",
      cover_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80",
      artist_image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80",
      description: "律动灵魂说唱与深邃词曲的碰撞，将信仰与生命真实倾诉。",
      tracks: [
        { id: "sl_01", track_no: "01", title: "少年维持着烦恼", duration: "4'15\"", audio_url: "", youtube_url: "https://www.youtube.com/@harvestermusic.production", spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ", score_url: "assets/scores/sample.pdf", lyrics: "【少年维持着烦恼】\n\n在成长的路口，寻求属天的指引。" },
        { id: "sl_02", track_no: "02", title: "关于小熊", duration: "4'42\"", audio_url: "", youtube_url: "https://www.youtube.com/@harvestermusic.production", spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ", score_url: "assets/scores/sample.pdf", lyrics: "【关于小熊】\n\n时光荏苒，唯有主的爱永不改变。" }
      ]
    },
    {
      id: "album_moonlit",
      title: "A Footprint of Feelings",
      title_cn: "心情足迹",
      artist: "Moonlit Sailor & Collective",
      artist_short: "Moonlit Sailor",
      genre: "Post-Rock / Ambient · 2024",
      year: "2024",
      theme_color: "#182736",
      spine_bg: "#2d3436",
      spine_color: "#74b9ff",
      spine_text: "A Footprint of Feelings Moonlit Sailor",
      cover_url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80",
      artist_image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80",
      description: "如极光般空灵辽阔的后摇敬拜器乐，带你进入浩瀚宇宙中的静默。",
      tracks: [
        { id: "ms_01", track_no: "01", title: "Night Stalker", duration: "4'08\"", audio_url: "", youtube_url: "https://www.youtube.com/@harvestermusic.production", spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ", score_url: "assets/scores/sample.pdf", lyrics: "【Night Stalker】\n\n宁静长夜中的深切盼望。" },
        { id: "ms_02", track_no: "02", title: "Hope", duration: "5'22\"", audio_url: "", youtube_url: "https://www.youtube.com/@harvestermusic.production", spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ", score_url: "assets/scores/sample.pdf", lyrics: "【Hope】\n\n在绝望中看见复活的盼望。" }
      ]
    },
    {
      id: "album_puzzle",
      title: "After Depressed - Single Way",
      title_cn: "拼图之后",
      artist: "Single Way of Puzzle",
      artist_short: "Single Way",
      genre: "Art Rock · 2023",
      year: "2023",
      theme_color: "#111827",
      spine_bg: "#1e272e",
      spine_color: "#f5f6fa",
      spine_text: "After Depressed - Single Way of Puzzle",
      cover_url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80",
      artist_image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80",
      description: "在生命的破碎与拼凑中，体会神完全的医治与修复。",
      tracks: [
        { id: "pz_01", track_no: "01", title: "Puzzle Pieces", duration: "3'50\"", audio_url: "", youtube_url: "https://www.youtube.com/@harvestermusic.production", spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ", score_url: "assets/scores/sample.pdf", lyrics: "【Puzzle Pieces】\n\n每一块破碎的心，都在祂手中重圆。" }
      ]
    },
    {
      id: "album_mary",
      title: "You Will Know - Single",
      title_cn: "你终会明了",
      artist: "Mary See the Future",
      artist_short: "Mary See Future",
      genre: "Indie Pop · 2024",
      year: "2024",
      theme_color: "#255977",
      spine_bg: "#e28743",
      spine_color: "#ffffff",
      spine_text: "You Will Know - Single Mary See the Future",
      cover_url: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=800&auto=format&fit=crop&q=80",
      artist_image: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=800&auto=format&fit=crop&q=80",
      description: "温暖细腻的当代独立乐声，唱出信心的坚韧与平安。",
      tracks: [
        { id: "mr_01", track_no: "01", title: "You Will Know", duration: "4'32\"", audio_url: "", youtube_url: "https://www.youtube.com/@harvestermusic.production", spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ", score_url: "assets/scores/sample.pdf", lyrics: "【You Will Know】\n\n凡等候耶和华的，必从新得力！" }
      ]
    },
    {
      id: "album_adele",
      title: "Adele Collection (21 / 25 / 30)",
      title_cn: "经典之声",
      artist: "Adele · Harvester Tribute",
      artist_short: "Adele Tribute",
      genre: "Soul / Pop · 2023",
      year: "2023",
      theme_color: "#0f1c24",
      spine_bg: "#102027",
      spine_color: "#f6d28a",
      spine_text: "19 Adele · 21 Adele · 30 Adele",
      cover_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
      artist_image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
      description: "深情大气的灵魂唱腔与管弦乐合奏，传递震撼人心的生命力量。",
      tracks: [
        { id: "ad_01", track_no: "01", title: "Rolling in the Grace", duration: "3'48\"", audio_url: "", youtube_url: "https://www.youtube.com/@harvestermusic.production", spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ", score_url: "assets/scores/sample.pdf", lyrics: "【Rolling in the Grace】\n\n主的恩典够我用，在软弱中显出完全。" }
      ]
    },
    {
      id: "album_wangfeng",
      title: "也许我可以无视死亡",
      title_cn: "也许我可以无视死亡",
      artist: "Wang Feng 汪峰",
      artist_short: "Wang Feng",
      genre: "Rock · 2020",
      year: "2020",
      theme_color: "#271b16",
      spine_bg: "#d35400",
      spine_color: "#ffffff",
      spine_text: "2020 Wang Feng 也许我可以无视死亡",
      cover_url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80",
      artist_image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80",
      description: "直面生命与永恒命题的摇滚史诗之作。",
      tracks: [
        { id: "wf_01", track_no: "01", title: "也许我可以无视死亡", duration: "5'12\"", audio_url: "", youtube_url: "https://www.youtube.com/@harvestermusic.production", spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ", score_url: "assets/scores/sample.pdf", lyrics: "【也许我可以无视死亡】\n\n死啊，你得胜的权势在哪里？因基督已经复活！" }
      ]
    },
    {
      id: "album_sea_people",
      title: "人海 (Sea of People)",
      title_cn: "人海",
      artist: "Wang Feng 汪峰",
      artist_short: "Wang Feng",
      genre: "Rock · 2022",
      year: "2022",
      theme_color: "#3a2d10",
      spine_bg: "#f39c12",
      spine_color: "#111111",
      spine_text: "人海 (Sea of People) Wang Feng",
      cover_url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80",
      artist_image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80",
      description: "在茫茫人海中，听见天父寻找浪子的慈爱呼唤。",
      tracks: [
        { id: "sp_01", track_no: "01", title: "人海", duration: "4'50\"", audio_url: "", youtube_url: "https://www.youtube.com/@harvestermusic.production", spotify_url: "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ", score_url: "assets/scores/sample.pdf", lyrics: "【人海】\n\n即便在茫茫人海，祢依然按我的名呼召我。" }
      ]
    }
  ];

  let albums = [...defaultAlbums];
  let currentIndex = 0;
  let activeAlbum = null;
  let activeTrack = null;
  let activeBookletPage = 1; // 1, 2, 3
  let isPlaying = false;
  let audioPlayer = new Audio();

  // Audio Event Listeners
  audioPlayer.addEventListener('ended', () => {
    isPlaying = false;
    updatePlayerUI();
  });
  audioPlayer.addEventListener('timeupdate', () => {
    updateAudioProgress();
  });

  // Initialize Engine
  async function init() {
    await fetchSupabaseSongs();
    renderAppLayout();
    setupEventListeners();
    setupTouchAndDrag();
    renderMiniPlayer();
  }

  // Fetch Dynamic CMS Songs and Custom 3D Albums
  async function fetchSupabaseSongs() {
    try {
      if (window.supabase) {
        // 1. Check custom albums from CMS
        const { data: albumCfg } = await window.supabase.from('site_config').select('value').eq('key', 'cfg_albums_custom_json').maybeSingle();
        if (albumCfg && albumCfg.value) {
          try {
            const custom = JSON.parse(albumCfg.value);
            if (Array.isArray(custom) && custom.length > 0) {
              albums = custom;
            }
          } catch(err) {
            console.warn("Custom albums parse note:", err);
          }
        }

        // 2. Fetch single songs
        const { data: songs } = await window.supabase.from('music_works').select('*').order('created_at', { ascending: false });
        if (songs && songs.length > 0) {
          const dynamicTracks = songs.map((s, idx) => ({
            id: s.id,
            track_no: String(idx + 1).padStart(2, '0'),
            title: s.title,
            duration: "4:15",
            audio_url: s.audio_url || "",
            youtube_url: s.audio_url || s.youtube_url || "https://www.youtube.com/@harvestermusic.production",
            spotify_url: s.spotify_url || "https://open.spotify.com/artist/3b6hpAaCK8ylIO0ylbdhHS?si=aAqsxnpMRyif9zvd2IXecQ",
            score_url: s.score_url || "assets/scores/sample.pdf",
            lyrics: s.description ? s.description : `【${s.title}】\n\n词曲：Harvester Music Production\n愿每一首写给神的歌都被听见。\n欢迎下载歌谱使用并在各处传唱。`
          }));

          if (albums[1]) {
            albums[1].tracks = dynamicTracks;
            if (songs[0]?.cover_url) {
              albums[1].cover_url = songs[0].cover_url;
            }
          }
        }
      }
    } catch(e) {
      console.warn("CoverFlow Supabase Fetch Note:", e);
    }
  }

  // Render App Master Layout (Header, 3D Coverflow, Immersive Detail View, Floating Mini Player)
  function renderAppLayout() {
    const stage = document.getElementById('coverflowStage');
    if (!stage) return;

    stage.innerHTML = `
      <!-- 1. Top App Navigation Bar (Exact Video Match) -->
      <div class="video-app-header">
        <div class="header-left">
          <div class="sound-bars">
            <span class="bar bar-1"></span>
            <span class="bar bar-2"></span>
            <span class="bar bar-3"></span>
            <span class="bar bar-4"></span>
          </div>
          <span class="app-time font-eng-title">HARVESTER MUSIC</span>
        </div>

        <div class="header-center">
          <div class="pill-segmented-control">
            <button class="pill-btn active" onclick="switchFilter('albums')">Albums (专辑)</button>
            <button class="pill-btn" onclick="switchFilter('playlists')">Playlists (精选)</button>
          </div>
        </div>

        <div class="header-right">
          <button class="icon-btn search-trigger" onclick="toggleSearch()" title="搜索音乐"><i class="fas fa-search"></i></button>
        </div>
      </div>

      <!-- 2. 3D Coverflow Stage (Video Shelf with Thick 3D Slabs) -->
      <div class="shelf-wrapper" id="shelfWrapper">
        <div class="coverflow-carousel" id="coverflowCarousel">
          ${albums.map((album, idx) => `
            <div class="album-3d-box ${idx === currentIndex ? 'active' : ''}" data-index="${idx}" onclick="handleAlbumClick(${idx})">
              <div class="album-cube">
                <!-- Front Cover Face -->
                <div class="cube-face cube-front">
                  <img src="${album.cover_url || 'assets/logo.png'}" alt="${album.title}" onerror="this.src='assets/logo.png'">
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
                    ${album.tracks.slice(0, 4).map(t => `<div>${t.track_no}. ${t.title}</div>`).join('')}
                    ${album.tracks.length > 4 ? `<div>... +${album.tracks.length - 4} 首更多</div>` : ''}
                  </div>
                  <div class="cube-back-footer">
                    <span>© ${album.year} HARVESTER</span>
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
          <button class="cf-nav-btn prev" onclick="navigateCoverFlow(-1)" title="上一张"><i class="fas fa-chevron-left"></i></button>
          <div class="active-album-info" id="activeAlbumInfo">
            <span class="cf-tag font-eng-title" id="cfAlbumYear">${albums[currentIndex].year} RELEASE</span>
            <h2 class="cf-album-title" id="cfAlbumTitle">${albums[currentIndex].title}</h2>
            <p class="cf-album-artist" id="cfAlbumArtist">${albums[currentIndex].artist} · ${albums[currentIndex].tracks.length} 首歌曲</p>
            <button class="btn-open-booklet" onclick="openAlbumDetailView(${currentIndex})">
              <i class="fas fa-compact-disc"></i> 进入专辑与歌谱 (Open Album & Scores)
            </button>
          </div>
          <button class="cf-nav-btn next" onclick="navigateCoverFlow(1)" title="下一张"><i class="fas fa-chevron-right"></i></button>
        </div>
      </div>

      <!-- 3. Immersive Zooming Album Detail Screen (Frame 15 & 18 & 22 in Video) -->
      <div id="immersiveAlbumView" class="immersive-album-view" style="display:none;">
        <!-- Top Toolbar -->
        <div class="immersive-top-bar">
          <button class="immersive-back-btn" onclick="closeAlbumDetailView()"><i class="fas fa-chevron-left"></i></button>
          
          <div class="booklet-page-indicator">
            <span class="page-num-pill" id="pagePill">01 | 03</span>
            <div class="booklet-tabs">
              <button class="booklet-tab-btn active" onclick="switchBookletPage(1)">01 专辑曲目</button>
              <button class="booklet-tab-btn" onclick="switchBookletPage(2)">02 艺术写真</button>
              <button class="booklet-tab-btn" onclick="switchBookletPage(3)">03 完整曲目志</button>
            </div>
          </div>

          <button class="immersive-action-btn" onclick="toggleBookletFullscreen()" title="全屏浏览"><i class="fas fa-expand"></i></button>
        </div>

        <!-- Dynamic Content Stages -->
        <div class="immersive-content-stage" id="immersiveStage">
          <!-- Injected dynamically by renderBookletPage -->
        </div>
      </div>

      <!-- 4. Floating Mini-Player Pill (Present in Video) -->
      <div class="floating-mini-player" id="floatingMiniPlayer" onclick="handleMiniPlayerClick()">
        <div class="mini-left">
          <div class="mini-eq-bars" id="miniEqBars">
            <span></span><span></span><span></span>
          </div>
          <img id="miniCover" src="${albums[0].cover_url}" alt="Cover">
          <div class="mini-meta">
            <span id="miniTrackTitle" class="mini-track-name">${albums[0].tracks[0].title}</span>
            <span id="miniTrackArtist" class="mini-track-artist">${albums[0].artist}</span>
          </div>
        </div>
        <div class="mini-right">
          <button class="mini-play-btn" onclick="event.stopPropagation(); toggleAudioPlay();">
            <i id="miniPlayIcon" class="fas fa-play"></i>
          </button>
          <button class="mini-queue-btn" onclick="event.stopPropagation(); openActiveLyricsDrawer();" title="歌词与歌谱">
            <i class="fas fa-bars"></i>
          </button>
        </div>
      </div>

      <!-- 5. Single Song Lyrics & Score Download Drawer/Modal -->
      <div id="songDetailDrawer" class="song-detail-drawer" style="display:none;">
        <div class="drawer-backdrop" onclick="closeLyricsDrawer()"></div>
        <div class="drawer-sheet">
          <button class="drawer-close" onclick="closeLyricsDrawer()">&times;</button>
          <div class="drawer-header">
            <span class="drawer-tag">HARVESTER DIGITAL SCORES</span>
            <h2 id="drawerSongTitle" class="drawer-title">更新敬拜</h2>
            <p id="drawerSongArtist" class="drawer-artist">Harvester Worship</p>
            
            <div class="drawer-action-buttons">
              <a id="drawerBtnScore" href="#" target="_blank" class="btn-song-act btn-act-score">
                <i class="fas fa-file-pdf"></i> 下载歌谱 (PDF)
              </a>
              <a id="drawerBtnYT" href="#" target="_blank" class="btn-song-act btn-act-yt">
                <i class="fab fa-youtube"></i> YouTube 官方 MV
              </a>
              <a id="drawerBtnSp" href="#" target="_blank" class="btn-song-act btn-act-spotify">
                <i class="fab fa-spotify"></i> Spotify 聆听
              </a>
            </div>
          </div>

          <div class="drawer-lyrics-body" id="drawerLyricsContent">
            <!-- Lyrics injected -->
          </div>
        </div>
      </div>
    `;

    updateCoverFlow3DPositions();
  }

  // Update 3D Matrix & Angles (Exact Frame 3 / 10 / 14 Video Alignment)
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
        // Active Center Album: Standing at 65deg slightly turned forward with crisp sheen (Exact Video focal position)
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
      if (artistEl) artistEl.innerText = `${cur.artist} · ${cur.tracks.length} 首歌曲`;
      if (yearEl) yearEl.innerText = `${cur.year} RELEASE`;
    }
  }

  // Handle Album Card Click
  window.handleAlbumClick = function(idx) {
    if (idx === currentIndex) {
      openAlbumDetailView(idx);
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
  // 🌟 IMMERSIVE ALBUM DETAIL VIEW (Exact Frame 15, 18, 22 in Video)
  // =================================================================
  window.openAlbumDetailView = function(albumIdx) {
    activeAlbum = albums[albumIdx] || albums[0];
    activeTrack = activeAlbum.tracks[0];
    activeBookletPage = 1;

    const view = document.getElementById('immersiveAlbumView');
    if (!view) return;

    // Apply dynamic ambient background color from album
    view.style.background = activeAlbum.theme_color || '#169b9b';
    view.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    renderBookletPage(1);

    if (window.gsap) {
      gsap.fromTo(view, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.45, ease: "power3.out" });
    }
  };

  window.closeAlbumDetailView = function() {
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

  window.switchBookletPage = function(pageNum) {
    activeBookletPage = pageNum;
    const pagePill = document.getElementById('pagePill');
    if (pagePill) pagePill.innerText = `0${pageNum} | 03`;

    document.querySelectorAll('.booklet-tab-btn').forEach((btn, idx) => {
      btn.classList.toggle('active', idx + 1 === pageNum);
    });

    renderBookletPage(pageNum);
  };

  // Render Page Content for Booklet
  function renderBookletPage(pageNum) {
    const stage = document.getElementById('immersiveStage');
    if (!stage || !activeAlbum) return;

    if (pageNum === 1) {
      // 📄 Page 1: Main Album Tracklist & Actions (Exact Frame 15)
      const totalSec = activeAlbum.tracks.length * 215;
      const minSummary = Math.floor(totalSec / 60);
      const secSummary = totalSec % 60;

      stage.innerHTML = `
        <div class="immersive-page page-1 fade-in">
          <!-- Left Column: Album Art + Meta + Play Buttons -->
          <div class="imm-left-col">
            <div class="imm-cover-card">
              <img src="${activeAlbum.cover_url}" alt="${activeAlbum.title}">
              <div class="cover-shine"></div>
            </div>

            <div class="imm-album-info">
              <h1 class="imm-album-title">${activeAlbum.title}</h1>
              <p class="imm-album-artist">${activeAlbum.artist}</p>
              <span class="imm-album-genre">${activeAlbum.genre || (activeAlbum.year + ' · Original Worship')}</span>
            </div>

            <div class="imm-action-pills">
              <button class="imm-pill-btn btn-play-all" onclick="playCurrentTrack('${activeAlbum.tracks[0]?.id}')">
                <i class="fas fa-play"></i> Play
              </button>
              <button class="imm-pill-btn btn-shuffle" onclick="playRandomTrack()">
                <i class="fas fa-random"></i> Shuffle
              </button>
            </div>
          </div>

          <!-- Right Column: Clean Tracklist (Frame 15) -->
          <div class="imm-right-col">
            <div class="imm-tracklist">
              ${activeAlbum.tracks.map((t, idx) => `
                <div class="imm-track-row ${t.id === activeTrack?.id ? 'active' : ''}" onclick="selectAndPlayTrack('${t.id}')">
                  <span class="imm-track-no">${t.track_no}</span>
                  <div class="imm-track-name-box">
                    <span class="imm-track-title">${t.title}</span>
                  </div>
                  <div class="imm-track-actions">
                    <button class="btn-track-action" onclick="event.stopPropagation(); openSingleSongDrawer('${t.id}')" title="歌词与歌谱">
                      <i class="fas fa-file-alt"></i>
                    </button>
                  </div>
                  <span class="imm-track-duration">${t.duration}</span>
                </div>
              `).join('')}
            </div>

            <div class="imm-tracklist-summary">
              ${activeAlbum.tracks.length} SONGS, ${minSummary} MIN, ${secSummary} SEC
            </div>
          </div>
        </div>
      `;
    } else if (pageNum === 2) {
      // 📄 Page 2: Extended Multi-Panel Booklet with Artist Cutout (Exact Frame 18)
      stage.innerHTML = `
        <div class="immersive-page page-2 fade-in">
          <!-- Panel 1: Artist Cutout Poster -->
          <div class="booklet-spread-panel panel-poster" style="background-image: url('${activeAlbum.artist_image || activeAlbum.cover_url}');">
            <div class="poster-overlay">
              <h2 class="poster-title">${activeAlbum.artist_short || activeAlbum.artist}</h2>
              <button class="poster-play-btn" onclick="playCurrentTrack('${activeAlbum.tracks[0]?.id}')">PLAY</button>
            </div>
          </div>

          <!-- Panel 2: Parchment Style Column (Tracks 01-10) -->
          <div class="booklet-spread-panel panel-parchment">
            <div class="panel-badge-card">
              <img src="${activeAlbum.cover_url}" alt="Thumbnail">
              <span class="badge-num">01</span>
            </div>
            <div class="column-tracks">
              ${activeAlbum.tracks.slice(0, 10).map(t => `
                <div class="col-track-row" onclick="selectAndPlayTrack('${t.id}')">
                  <span class="col-num">${t.track_no}</span>
                  <span class="col-title">${t.title}</span>
                  <span class="col-dur">${t.duration}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Panel 3: Dark Tone Column (Tracks 11-20) -->
          <div class="booklet-spread-panel panel-dark-red">
            <div class="panel-badge-card">
              <img src="${activeAlbum.cover_url}" alt="Thumbnail">
              <span class="badge-num">11</span>
            </div>
            <div class="column-tracks">
              ${(activeAlbum.tracks.length > 10 ? activeAlbum.tracks.slice(10, 20) : activeAlbum.tracks).map(t => `
                <div class="col-track-row" onclick="selectAndPlayTrack('${t.id}')">
                  <span class="col-num">${t.track_no}</span>
                  <span class="col-title">${t.title}</span>
                  <span class="col-dur">${t.duration}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    } else if (pageNum === 3) {
      // 📄 Page 3: Deep Index Spread (Exact Frame 22)
      stage.innerHTML = `
        <div class="immersive-page page-3 fade-in">
          <div class="booklet-spread-panel panel-dark-plum" style="flex:1;">
            <div class="panel-badge-card">
              <img src="${activeAlbum.cover_url}" alt="Thumbnail">
              <span class="badge-num">21</span>
            </div>
            <div class="column-tracks">
              ${activeAlbum.tracks.map((t, idx) => `
                <div class="col-track-row" onclick="selectAndPlayTrack('${t.id}')">
                  <span class="col-num">${String(idx + 21).padStart(2, '0')}</span>
                  <span class="col-title">${t.title} (Live Worship)</span>
                  <span class="col-dur">${t.duration}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="booklet-spread-panel panel-black-leather" style="flex:1;">
            <div class="panel-badge-card">
              <img src="${activeAlbum.cover_url}" alt="Thumbnail">
              <span class="badge-num">31</span>
            </div>
            <div class="column-tracks">
              ${activeAlbum.tracks.slice(0, 5).map((t, idx) => `
                <div class="col-track-row" onclick="selectAndPlayTrack('${t.id}')">
                  <span class="col-num">${String(idx + 31).padStart(2, '0')}</span>
                  <span class="col-title">${t.title} (Acoustic)</span>
                  <span class="col-dur">${t.duration}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }
  }

  // Select Track and Trigger Playback
  window.selectAndPlayTrack = function(trackId) {
    const t = activeAlbum.tracks.find(x => x.id === trackId) || activeAlbum.tracks[0];
    activeTrack = t;
    playCurrentTrack(trackId);
    
    // Highlight in UI
    document.querySelectorAll('.imm-track-row').forEach(row => {
      row.classList.toggle('active', row.innerText.includes(t.title));
    });
  };

  // Audio Playback Engine
  window.playCurrentTrack = function(trackId) {
    if (!activeAlbum) return;
    const t = activeAlbum.tracks.find(x => x.id === trackId) || activeAlbum.tracks[0];
    activeTrack = t;

    if (t.audio_url) {
      audioPlayer.src = t.audio_url;
      audioPlayer.play().catch(e => console.warn("Audio autoplay policy note:", e));
      isPlaying = true;
    } else {
      // Toggle play state indicator
      isPlaying = true;
    }

    updatePlayerUI();
  };

  window.playRandomTrack = function() {
    if (!activeAlbum || activeAlbum.tracks.length === 0) return;
    const randIdx = Math.floor(Math.random() * activeAlbum.tracks.length);
    selectAndPlayTrack(activeAlbum.tracks[randIdx].id);
  };

  window.toggleAudioPlay = function() {
    if (isPlaying) {
      audioPlayer.pause();
      isPlaying = false;
    } else {
      if (activeTrack?.audio_url) {
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

    if (miniPlayIcon) {
      miniPlayIcon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
    }
    if (miniEqBars) {
      miniEqBars.classList.toggle('playing', isPlaying);
    }
    if (activeAlbum && activeTrack) {
      if (miniCover) miniCover.src = activeAlbum.cover_url;
      if (miniTitle) miniTitle.innerText = activeTrack.title;
      if (miniArtist) miniArtist.innerText = activeAlbum.artist;
    }
  }

  function updateAudioProgress() {
    // Progress hook
  }

  function renderMiniPlayer() {
    updatePlayerUI();
  }

  window.handleMiniPlayerClick = function() {
    if (activeAlbum) {
      openAlbumDetailView(albums.indexOf(activeAlbum) !== -1 ? albums.indexOf(activeAlbum) : 0);
    } else {
      openAlbumDetailView(currentIndex);
    }
  };

  // =================================================================
  // 📖 SINGLE SONG LYRICS & SCORE DOWNLOAD DRAWER
  // =================================================================
  window.openSingleSongDrawer = function(trackId) {
    const t = activeAlbum.tracks.find(x => x.id === trackId) || activeAlbum.tracks[0];
    activeTrack = t;

    const drawer = document.getElementById('songDetailDrawer');
    if (!drawer) return;

    const titleEl = document.getElementById('drawerSongTitle');
    const artistEl = document.getElementById('drawerSongArtist');
    const lyricsEl = document.getElementById('drawerLyricsContent');
    const btnScore = document.getElementById('drawerBtnScore');
    const btnYT = document.getElementById('drawerBtnYT');
    const btnSp = document.getElementById('drawerBtnSp');

    if (titleEl) titleEl.innerText = t.title;
    if (artistEl) artistEl.innerText = activeAlbum.artist;
    if (lyricsEl) lyricsEl.innerHTML = (t.lyrics || "暂无歌词").replace(/\n/g, '<br>');

    if (btnScore) {
      btnScore.href = t.score_url || '#';
      btnScore.style.display = t.score_url ? 'inline-flex' : 'none';
    }
    if (btnYT) {
      btnYT.href = t.youtube_url || '#';
      btnYT.style.display = t.youtube_url ? 'inline-flex' : 'none';
    }
    if (btnSp) {
      btnSp.href = t.spotify_url || '#';
      btnSp.style.display = t.spotify_url ? 'inline-flex' : 'none';
    }

    drawer.style.display = 'block';
    if (window.gsap) {
      gsap.fromTo('.drawer-sheet', { y: '100%' }, { y: '0%', duration: 0.4, ease: "power3.out" });
    }
  };

  window.openActiveLyricsDrawer = function() {
    if (activeTrack) {
      openSingleSongDrawer(activeTrack.id);
    } else if (activeAlbum?.tracks[0]) {
      openSingleSongDrawer(activeAlbum.tracks[0].id);
    }
  };

  window.closeLyricsDrawer = function() {
    const drawer = document.getElementById('songDetailDrawer');
    if (!drawer) return;
    if (window.gsap) {
      gsap.to('.drawer-sheet', { y: '100%', duration: 0.3, onComplete: () => {
        drawer.style.display = 'none';
      }});
    } else {
      drawer.style.display = 'none';
    }
  };

  window.toggleBookletFullscreen = function() {
    const view = document.getElementById('immersiveAlbumView');
    if (!document.fullscreenElement) {
      view.requestFullscreen().catch(err => console.warn(err));
    } else {
      document.exitFullscreen().catch(err => console.warn(err));
    }
  };

  window.switchFilter = function(filter) {
    document.querySelectorAll('.pill-btn').forEach(btn => btn.classList.remove('active'));
    event?.currentTarget?.classList.add('active');
  };

  window.toggleSearch = function() {
    const q = prompt("请输入要搜索的歌曲或专辑名称：");
    if (q) {
      const foundIdx = albums.findIndex(a => a.title.toLowerCase().includes(q.toLowerCase()) || a.tracks.some(t => t.title.toLowerCase().includes(q.toLowerCase())));
      if (foundIdx !== -1) {
        currentIndex = foundIdx;
        updateCoverFlow3DPositions();
      } else {
        alert("未找到匹配的专辑或歌曲");
      }
    }
  };

  // Keyboard, Mouse Wheel and Touch Drag Physics
  function setupEventListeners() {
    window.addEventListener('keydown', (e) => {
      const view = document.getElementById('immersiveAlbumView');
      const isImmersive = view && view.style.display === 'flex';

      if (e.key === 'Escape') {
        if (document.getElementById('songDetailDrawer')?.style.display === 'block') {
          closeLyricsDrawer();
        } else if (isImmersive) {
          closeAlbumDetailView();
        }
        return;
      }

      if (!isImmersive) {
        if (e.key === 'ArrowLeft') navigateCoverFlow(-1);
        if (e.key === 'ArrowRight') navigateCoverFlow(1);
      } else {
        if (e.key === 'ArrowLeft' && activeBookletPage > 1) switchBookletPage(activeBookletPage - 1);
        if (e.key === 'ArrowRight' && activeBookletPage < 3) switchBookletPage(activeBookletPage + 1);
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
