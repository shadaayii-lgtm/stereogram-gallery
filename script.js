// =====================
// UNLOCK STATE
// =====================
let isPremiumUnlocked = false;
let swiperInstance = null;

// =====================
// IMAGE DATA
// =====================
const sampleImages = Array.from({length: 20}, (_, i) => ({
  file: `sample${i + 1}.jpg`,
  title: `Sample Stereogram ${i + 1}`
}));

const paidImages = Array.from({length: 100}, (_, i) => ({
  file: `paid${i + 1}.jpg`,
  title: `Premium Stereogram ${i + 1}`
}));

// =====================
// BUILD FREE GALLERY
// =====================
function buildFreeGallery() {
  const container = document.getElementById('samplesGallery');
  if (!container) return;
  container.innerHTML = '';
  sampleImages.forEach((img, i) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img loading="lazy" src="${img.file}" alt="${img.title}" 
        onerror="this.src='https://placehold.co/200x160?text=Free'"/>
      <div class="card-label">${img.title}</div>
    `;
    card.addEventListener('click', () => openLightbox(sampleImages, i));
    container.appendChild(card);
  });
}

// =====================
// BUILD PAID GALLERY
// =====================
function buildPaidGallery() {
  const container = document.getElementById('paidGallery');
  if (!container) return;
  container.innerHTML = '';
  paidImages.forEach((img, i) => {
    const card = document.createElement('div');
    if (isPremiumUnlocked) {
      card.className = 'card';
      card.innerHTML = `
        <img loading="lazy" src="${img.file}" alt="${img.title}" 
          onerror="this.src='https://placehold.co/200x160?text=Premium'"/>
        <div class="card-label">${img.title}</div>
      `;
      card.addEventListener('click', () => openLightbox(paidImages, i));
    } else {
      card.className = 'locked-card';
      card.innerHTML = `
        <img loading="lazy" src="${img.file}" alt="Locked" 
          onerror="this.src='https://placehold.co/200x160?text=🔒'"/>
        <div class="lock-overlay">
          <span class="lock-icon">🔒</span>
          <span class="lock-text">Premium Only</span>
        </div>
        <div class="card-label">💎 ${img.title}</div>
      `;
      card.addEventListener('click', () => showPaywall());
    }
    container.appendChild(card);
  });
}

// =====================
// TAB SWITCHING
// =====================
function showTab(tabName, btn) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  
  const activeTab = document.getElementById(tabName);
  if (activeTab) activeTab.classList.add('active');
  if (btn) btn.classList.add('active');
  
  if (tabName === 'paid') {
    setTimeout(() => showPaywall(), 300);
    return;
  }
  if (tabName === 'samples') {
    setTimeout(() => {
      const sampleEl = document.getElementById('samples');
      if (sampleEl) sampleEl.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }
}

// =====================
// TRY FREE SAMPLE
// =====================
function tryFreeSample() {
  const freeBtn = document.querySelector('.tab-btn');
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  
  const sampleEl = document.getElementById('samples');
  if (sampleEl) sampleEl.classList.add('active');
  if (freeBtn) freeBtn.classList.add('active');
  
  setTimeout(() => {
    if (sampleEl) sampleEl.scrollIntoView({ behavior: 'smooth' });
  }, 100);
}

// =====================
// LIGHTBOX WITH SWIPER
// =====================
function openLightbox(images, startIndex) {
  const lightboxEl = document.getElementById('lightbox');
  const wrapper = document.getElementById('swiperWrapper');
  if (!lightboxEl || !wrapper) return;
  
  // 1. Completely destroy previous swiper engine instance if it exists
  if (swiperInstance) {
    try {
      swiperInstance.destroy(true, true);
    } catch(e) {
      console.log("Swiper cleanup notice");
    }
    swiperInstance = null;
  }
  
  // 2. Empty container slides and load fresh ones
  wrapper.innerHTML = '';
  images.forEach((img) => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.innerHTML = `
      <div class="swiper-zoom-container">
        <img src="${img.file}" alt="${img.title}"
          onerror="this.src='https://placehold.co/400x300?text=Stereogram'"/>
      </div>
      <div class="slide-actions">
        <button class="share-btn" onclick="shareImage('${img.file}', '${img.title}')">
          📤 Share
        </button>
      </div>
    `;
    wrapper.appendChild(slide);
  });

  // 3. Make lightbox modal instantly visible
  lightboxEl.classList.remove('hidden');
  document.body.classList.add('lightbox-open');
  
  const targetIndex = parseInt(startIndex, 10) || 0;
  document.getElementById('lightbox-title').textContent = images[targetIndex].title;

  // 4. Fire Swiper Initialization safely with manual SlideTo enforcement
  setTimeout(() => {
    swiperInstance = new Swiper('.lightbox-swiper', {
      initialSlide: targetIndex,
      slidesPerView: 1,
      spaceBetween: 0,
      observer: true,
      observeParents: true,
      zoom: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      on: {
        slideChange: function() {
          if (images[this.activeIndex]) {
            document.getElementById('lightbox-title').textContent = images[this.activeIndex].title;
          }
        }
      }
    });
    
    // FORCE JUMP ACTION: Overrides initialization engine errors by calling API method directly
    setTimeout(() => {
      if (swiperInstance) {
        swiperInstance.slideTo(targetIndex, 0, false);
      }
    }, 50);

  }, 100);
}

function closeLightbox() {
  const lightboxEl = document.getElementById('lightbox');
  if (lightboxEl) lightboxEl.classList.add('hidden');
  document.body.classList.remove('lightbox-open');
  if (swiperInstance) {
    try {
      swiperInstance.destroy(true, true);
    } catch(e) {}
    swiperInstance = null;
  }
}

document.getElementById('lightbox').addEventListener('click', function(e) {
  if (e.target === this) closeLightbox();
});

// =====================
// SHARE IMAGE
// =====================
async function shareImage(src, title) {
  try {
    if (navigator.share) {
      await navigator.share({
        title: 'Stereogram Gallery',
        text: `Check out this amazing hidden 3D image! - ${title}`,
        url: 'https://stereogram-gallery.vercel.app'
      });
    } else {
      navigator.clipboard.writeText('https://stereogram-gallery.vercel.app');
      alert('Link copied! Share it with friends 🎯');
    }
  } catch (err) {
    console.log('Share cancelled');
  }
}

// =====================
// PAYWALL
// =====================
function showPaywall() {
  const paywallEl = document.getElementById('paywall');
  if (paywallEl) paywallEl.classList.remove('hidden');
}

function closePaywall() {
  const paywallEl = document.getElementById('paywall');
  if (paywallEl) paywallEl.classList.add('hidden');
}

document.getElementById('paywall').addEventListener('click', function(e) {
  if (e.target === this) closePaywall();
});

// =====================
// RAZORPAY PAYMENT
// =====================
function simulatePurchase() {
  var options = {
    key: "rzp_live_Srex5oMP9i7MlE",
    amount: 49900,
    currency: "INR",
    name: "Stereogram Gallery",
    description: "Premium Access - 100 Stereograms",
    handler: function(response) {
      isPremiumUnlocked = true;
      closePaywall();
      buildPaidGallery();
      alert('🎉 Payment successful! All 100 stereograms unlocked!');
    },
    theme: { color: "#a78bfa" }
  };
  var rzp = new Razorpay(options);
  rzp.open();
}

// =====================
// COUNTDOWN TIMER
// =====================
function startCountdown() {
  let minutes = 9;
  let seconds = 59;
  const timer = setInterval(() => {
    const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    const el = document.getElementById('countdown');
    if (el) el.textContent = display;
    if (seconds === 0) {
      if (minutes === 0) { minutes = 9; seconds = 59; }
      else { minutes--; seconds = 59; }
    } else { seconds--; }
  }, 1000);
}

startCountdown();

// =====================
// INIT
// =====================
buildFreeGallery();
buildPaidGallery();
