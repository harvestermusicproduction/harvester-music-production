// Harvester Music - Supabase Configuration
// Successfully connected to your project: ollfdarbmiahgjaqivpg

const SUPABASE_CONFIG = {
  URL: "https://ollfdarbmiahgjaqivpg.supabase.co",
  ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sbGZkYXJibWlhaGdqYXFpdnBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMTI2OTgsImV4cCI6MjA5MDc4ODY5OH0.hn7JoD3dX3wiQ3ia_A1GQMsGwfRwiNUQ_2Nu4UdstfI"
};

const CLOUDINARY_CONFIG = {
  CLOUD_NAME: "your-cloud-name"
};

// Initialize Supabase Client
const supabaseClient = supabase.createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.ANON_KEY);
window.supabase = supabaseClient; // Ensure global availability

// --- 2. Global Tracking Logic ---
window.trackMusicAction = async function(songId, action) {
    const field = action === 'listen' ? 'listen_count' : 'download_count';
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
