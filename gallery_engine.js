/**
 * Gallery Engine v9.0 - EXHIBITION EDITION
 * Minimalist Editorial Layout for Artists & Creators.
 */

let db;
let allArtists = [];

async function initGallery() {
  db = window.supabase;
  if (!db) {
    console.error("Supabase not found");
    return;
  }
  await fetchArtists();
}

async function fetchArtists() {
  try {
    const { data, error } = await db.from('singers').select('*').order('display_order', { ascending: true });
    if (error) throw error;
    allArtists = data || [];
    
    // Check URL params for initial category
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'worship') switchCategory('敬拜');
    else switchCategory('福音'); 
    
  } catch (err) {
    console.error("Gallery Fetch Error:", err);
  }
}

function renderGrid(data) {
  const container = document.getElementById('artist-grid');
  if (!container) return;
  
  container.innerHTML = data.map((artist, i) => `
    <div class="artist-card" onclick="showOverlay(${JSON.stringify(artist).replace(/"/g, '&quot;')})">
      <div class="img-wrapper">
        <img src="${artist.image_url || 'assets/placeholder.jpg'}" alt="${artist.name}" loading="lazy">
      </div>
      <div class="artist-meta">
        <span class="tag">${artist.category === 'gospel' ? 'Gospel Artist' : 'Worship Leader'}</span>
        <h3>${artist.name}</h3>
        <p class="statement">${artist.role || 'Creative Practitioner'}</p>
      </div>
    </div>
  `).join('');

  // Entrance Stagger Animation
  gsap.from(".artist-card", {
    y: 30,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    ease: "power3.out",
    delay: 0.2
  });
}

window.switchCategory = function(cat) {
  // Update Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  let filter = 'all';
  if (cat === '福音') {
    document.getElementById('tab-gospel').classList.add('active');
    filter = 'gospel';
  } else if (cat === '敬拜') {
    document.getElementById('tab-worship').classList.add('active');
    filter = 'worship';
  } else {
    document.getElementById('tab-all').classList.add('active');
  }

  const filtered = filter === 'all' ? allArtists : allArtists.filter(s => s.category === filter);
  
  // Clean Transition
  gsap.to(".artist-card", {
    opacity: 0,
    y: 10,
    duration: 0.3,
    stagger: 0.05,
    onComplete: () => renderGrid(filtered)
  });
};

window.showOverlay = function(artist) {
  const overlay = document.getElementById('detail-overlay');
  document.getElementById('modal-img').src = artist.image_url;
  document.getElementById('modal-name').innerText = artist.name;
  document.getElementById('modal-tag').innerText = artist.category === 'gospel' ? 'Gospel Archive' : 'Worship Archive';
  document.getElementById('modal-bio').innerText = artist.bio || "No description provided.";
  
  overlay.style.display = 'block';
  document.body.style.overflow = 'hidden';
  
  gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.5 });
  gsap.fromTo(".modal-container", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, delay: 0.2, ease: "power4.out" });
};

window.hideOverlay = function() {
  const overlay = document.getElementById('detail-overlay');
  gsap.to(overlay, { opacity: 0, duration: 0.4, onComplete: () => {
    overlay.style.display = 'none';
    document.body.style.overflow = 'auto';
  }});
};

// Start
document.addEventListener('DOMContentLoaded', initGallery);
