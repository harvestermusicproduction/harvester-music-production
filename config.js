// Harvester Music - Supabase Configuration (Heartbeat Check)
// Successfully connected to your project: ollfdarbmiahgjaqivpg

const SUPABASE_CONFIG = {
  URL: "https://ollfdarbmiahgjaqivpg.supabase.co",
  ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sbGZkYXJibWlhaGdqYXFpdnBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMTI2OTgsImV4cCI6MjA5MDc4ODY5OH0.hn7JoD3dX3wiQ3ia_A1GQMsGwfRwiNUQ_2Nu4UdstfI"
};

const CLOUDINARY_CONFIG = {
  CLOUD_NAME: "your-cloud-name"
};

// Initialize Supabase Client (Protected Fail-Safe)
let supabaseClient = null;
try {
  if (typeof supabase !== 'undefined' && supabase && typeof supabase.createClient === 'function') {
    supabaseClient = supabase.createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.ANON_KEY);
  }
} catch (e) {
  console.warn("Supabase init deferred/failed:", e);
}
window.supabase = supabaseClient; // Ensure global availability

// --- 2. Google Analytics (GA4) Global Integration ---
// 将下方 GA_MEASUREMENT_ID 替换为你的 Google Analytics 评估 ID（格式如: "G-XXXXXXXXXX"）
const GA_MEASUREMENT_ID = "G-XXXXXXXXXX";

(function initGoogleAnalytics() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  function loadGaTag(measurementId) {
    if (!measurementId || measurementId === "G-XXXXXXXXXX" || window.__gaLoaded) return;
    window.__gaLoaded = true;
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
    document.head.appendChild(script);
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      page_title: document.title,
      page_location: window.location.href
    });
  }

  // 1) Load immediately if configured in config.js
  if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== "G-XXXXXXXXXX") {
    loadGaTag(GA_MEASUREMENT_ID);
  } else if (window.supabase) {
    // 2) Or auto-load from Supabase site_config table (key: 'ga_measurement_id') if configured in cloud
    window.supabase
      .from('site_config')
      .select('value')
      .eq('key', 'ga_measurement_id')
      .maybeSingle()
      .then(({ data }) => {
        if (data && data.value && data.value.startsWith('G-')) {
          loadGaTag(data.value.trim());
        }
      })
      .catch(() => {});
  }
})();

// --- 3. Global Tracking Logic ---
window.trackMusicAction = async function(songId, action) {
    const field = action === 'listen' ? 'listen_count' : 'download_count';
    if (typeof window.gtag === 'function' && window.__gaLoaded) {
        window.gtag('event', action === 'listen' ? 'song_listen' : 'score_download', {
            song_id: songId,
            action_type: action
        });
    }
    const db = window.supabase;
    if (!db) return;

    try {
        // Atomic increment (simplest version for small traffic)
        const { data: song } = await db.from('music_works').select(field).eq('id', songId).single();
        if (song) {
            const newVal = (song[field] || 0) + 1;
            const updateData = {};
            updateData[field] = newVal;
            await db.from('music_works').update(updateData).eq('id', songId);
            console.log(`[Tracker] ${action} updated for ${songId}: ${newVal}`);
        }
    } catch (e) {
        console.error("Tracking Error:", e);
    }
};
