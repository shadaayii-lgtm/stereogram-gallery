// =====================
// UNLOCK STATE
// =====================
let isPremiumUnlocked = false;

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
  container.innerHTML = '';
  sampleImages.forEach((img) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${img.file}" alt="${img.title}" onerror="this.src='https://placehold.co/200x160?text=Free'"/>
      <div class="card-label">${img.title}</div>
    `;
    card.addEventListener('click', () => openLightbox(img.file, img.title));
    container.appendChild(card);
  });
}

// =====================
// BUILD PAID GALLERY
// =====================
function buildPaidGallery() {
  const container = document.getElementById('paidGallery');
  container.innerHTML = '';
  paidImages.forEach((img) => {
    const card = document.createElement('div');

    if (isPremiumUnlocked) {
      // Show full image
      card.className = 'card';
      card.innerHTML = `
        <img src="${img.file}" alt="${img.title}" onerror="this.src='https://placehold.co/200x160?text=Premium'"/>
        <div class="card-label">${img.title}</div>
      `;
      card.addEventListener('click', () => openLightbox(img.file, img.title));
    } else {
      // Show locked/blurred card
      card.className = 'locked-card';
      card.innerHTML = `
        <img src="${img.file}" alt="Locked" onerror="this.src='https://placehold.co/200x160?text=🔒'"/>
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

  // If premium tab clicked → open paywall
  if (tabName === 'paid') {
    setTimeout(() => showPaywall(), 300);
    return;
  }

  // If free tab clicked → scroll to gallery and open first image
  if (tabName === 'samples') {
    setTimeout(() => {
      document.getElementById('samples').scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => openLightbox(sampleImages, 0), 600);
    }, 100);
  }
}

// =====================
// LIGHTBOX
// =====================
// =====================
// UNLOCK STATE
// =====================
let isPremiumUnlocked = false;

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
  container.innerHTML = '';
  sampleImages.forEach((img) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${img.file}" alt="${img.title}" onerror="this.src='https://placehold.co/200x160?text=Free'"/>
      <div class="card-label">${img.title}</div>
    `;
    card.addEventListener('click', () => openLightbox(img.file, img.title));
    container.appendChild(card);
  });
}

// =====================
// BUILD PAID GALLERY
// =====================
function buildPaidGallery() {
  const container = document.getElementById('paidGallery');
  container.innerHTML = '';
  paidImages.forEach((img) => {
    const card = document.createElement('div');

    if (isPremiumUnlocked) {
      // Show full image
      card.className = 'card';
      card.innerHTML = `
        <img src="${img.file}" alt="${img.title}" onerror="this.src='https://placehold.co/200x160?text=Premium'"/>
        <div class="card-label">${img.title}</div>
      `;
      card.addEventListener('click', () => openLightbox(img.file, img.title));
    } else {
      // Show locked/blurred card
      card.className = 'locked-card';
      card.innerHTML = `
        <img src="${img.file}" alt="Locked" onerror="this.src='https://placehold.co/200x160?text=🔒'"/>
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

  // If premium tab clicked → open paywall
  if (tabName === 'paid') {
    setTimeout(() => showPaywall(), 300);
    return;
  }

  // If free tab clicked → scroll to gallery and open first image
  if (tabName === 'samples') {
    setTimeout(() => {
      document.getElementById('samples').scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => openLightbox(sampleImages, 0), 600);
    }, 100);
  }
}

// =====================
// LIGHTBOX
// =====================
function openLightbox(images, startIndex) {
  const wrapper = document.getElementById('swiperWrapper');
  wrapper.innerHTML = '';
  images.forEach((img) => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.innerHTML = `
      <div class="slide-container">
        <img loading="lazy" src="${img.file}" alt="${img.title}"
          onerror="this.src='https://placehold.co/400x300?text=Stereogram'"/>
        <div class="slide-actions">
          <button class="share-btn" onclick="shareImage('${img.file}', '${img.title}')">
            📤 Share
          </button>
        </div>
      </div>
    `;
    wrapper.appendChild(slide);
  });

  document.getElementById('lightbox-title').textContent = images[startIndex].title;
  document.getElementById('lightbox').classList.remove('hidden');

  if (swiperInstance) {
    swiperInstance.destroy(true, true);
    swiperInstance = null;
  }

  setTimeout(() => {
    swiperInstance = new Swiper('.lightbox-swiper', {
      initialSlide: startIndex,
      pagination: { el: '.swiper-pagination', clickable: true },
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

// =====================
// PAYWALL
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
  setTimeout(() => {
    openLightbox(sampleImages, 0);
  }, 800);
}
function showPaywall() {
  document.getElementById('paywall').classList.remove('hidden');
}

function closePaywall() {
  document.getElementById('paywall').classList.add('hidden');
}

document.getElementById('paywall').addEventListener('click', function(e) {
  if (e.target === this) closePaywall();
});

// Simulate purchase (replace this with real payment later)
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
    theme: {
      color: "#a78bfa"
    }
  };
  var rzp = new Razorpay(options);
  rzp.open();
}

// =====================
// INIT
// =====================
buildFreeGallery();
buildPaidGallery();

// =====================
// PAYWALL
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
  setTimeout(() => {
    openLightbox(sampleImages, 0);
  }, 800);
}
function showPaywall() {
  document.getElementById('paywall').classList.remove('hidden');
}

function closePaywall() {
  document.getElementById('paywall').classList.add('hidden');
}

document.getElementById('paywall').addEventListener('click', function(e) {
  if (e.target === this) closePaywall();
});

// Simulate purchase (replace this with real payment later)
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
    theme: {
      color: "#a78bfa"
    }
  };
  var rzp = new Razorpay(options);
  rzp.open();
}

// =====================
// INIT
// =====================
buildFreeGallery();
buildPaidGallery();
