// =====================
// UNLOCK STATE
// =====================
let isPremiumUnlocked = false;
let swiperInstance = null;

// =====================
// IMAGE DATA
// =====================
const sampleImages = Array.from({ length: 20 }, (_, i) => ({
  file: `images/Samples/sample${i + 1}.jpg`,
  title: `Sample Stereogram ${i + 1}`
}));

const paidImages = Array.from({ length: 100 }, (_, i) => ({
  file: `images/paid/paid${i + 1}.jpg`,
  title: `Premium Stereogram ${i + 1}`
}));

// =====================
// BUILD FREE GALLERY
// =====================
function buildFreeGallery() {
  const container = document.getElementById('samplesGallery');
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
  document.getElementById(tabName).classList.add('active');
  btn.classList.add('active');
  
  if (tabName === 'paid') {
    setTimeout(() => showPaywall(), 300);
    return;
  }
  if (tabName === 'samples') {
    setTimeout(() => {
      document.getElementById('samples').scrollIntoView({ behavior: 'smooth' });
    }, 100);
    /* FIXED: Removed the automated openLightbox(sampleImages, 0) popup rule from here */
  }
}

// =====================
// TRY FREE SAMPLE
// =====================
function tryFreeSample() {
  const freeBtn = document.querySelector('.tab-btn');
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('samples').classList.add('active');
  freeBtn.classList.add('active');
  
  setTimeout(() => {
    document.getElementById('samples').scrollIntoView({ behavior: 'smooth' });
  }, 100);
  /* FIXED: Removed the automated openLightbox(sampleImages, 0) popup rule from here */
}

// =====================
// LIGHTBOX WITH SWIPER
// =====================
function openLightbox(images, startIndex) {
  const wrapper = document.getElementById('swiperWrapper');
  if (!wrapper) return;
  wrapper.innerHTML = '';

  images.forEach((img) => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.innerHTML = `
      <div class="swiper-zoom-container">
        <img loading="lazy" src="${img.file}" alt="${img.title}"
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

  document.getElementById('lightbox-title').textContent = images[startIndex].title;
  document.getElementById('lightbox').classList.remove('hidden');
  document.body.classList.add('lightbox-open');

  if (swiperInstance) {
    swiperInstance.destroy(true, true);
    swiperInstance = null;
  }

  setTimeout(() => {
    swiperInstance = new Swiper('.lightbox-swiper', {
      initialSlide: startIndex,
      slidesPerView: 1,
      spaceBetween: 0,
      zoom: {
        maxRatio: 3,
        minRatio: 1,
      },
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
          document.getElementById('lightbox-title').textContent = images[this.activeIndex].title;
        }
      }
    });
  }, 200);
}

function closeLightbox() {
  document.getElementById('lightbox').classList.add('hidden');
  document.body.classList.remove('lightbox-open');
  if (swiperInstance) {
    swiperInstance.destroy(true, true);
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
  document.getElementById('paywall').classList.remove('hidden');
}

function closePaywall() {
  document.getElementById('paywall').classList.add('hidden');
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
