// ============================================================
// RTG-Raidi Tuning Garage — script.js
// ============================================================

// Hero load-in
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => document.body.classList.add('body-loaded'), 100);
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ===== MOBILE MENU =====
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
  hamburger.setAttribute('aria-expanded', open);
});
document.querySelectorAll('.mobile-menu a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', false);
  });
});

// ===== HERO PARALLAX =====
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      heroBg.style.transform = `scale(1.08) translateY(${window.scrollY * 0.12}px)`;
    }
  }, { passive: true });
}

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1600;
  const steps = 60;
  let step = 0;
  const interval = setInterval(() => {
    step++;
    const progress = step / steps;
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target * 10) / 10;
    el.textContent = prefix + (Number.isInteger(target) ? Math.round(current) : current) + suffix;
    if (step >= steps) {
      el.textContent = prefix + target + suffix;
      clearInterval(interval);
    }
  }, duration / steps);
}

// ===== SCROLL REVEAL + COUNTERS =====
const revealEls = document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
const counterEls = document.querySelectorAll('.counter');
let countersStarted = false;

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObs.observe(el));

const counterObs = new IntersectionObserver((entries) => {
  if (entries.some(e => e.isIntersecting) && !countersStarted) {
    countersStarted = true;
    counterEls.forEach(animateCounter);
    counterObs.disconnect();
  }
}, { threshold: 0.3 });

if (counterEls.length) counterObs.observe(counterEls[0].closest('#stats-bar') || counterEls[0]);

// ===== BEFORE / AFTER SLIDER =====
document.querySelectorAll('.ba-slider').forEach(slider => {
  const before = slider.querySelector('.ba-before');
  const handle = slider.querySelector('.ba-handle');
  let dragging = false;

  function setPos(x) {
    const rect = slider.getBoundingClientRect();
    let pct = ((x - rect.left) / rect.width) * 100;
    pct = Math.min(Math.max(pct, 2), 98);
    before.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    handle.style.left = pct + '%';
  }

  handle.addEventListener('mousedown', e => { dragging = true; e.preventDefault(); });
  handle.addEventListener('touchstart', e => { dragging = true; }, { passive: true });

  window.addEventListener('mousemove', e => { if (dragging) setPos(e.clientX); });
  window.addEventListener('touchmove', e => {
    if (dragging) setPos(e.touches[0].clientX);
  }, { passive: true });
  window.addEventListener('mouseup', () => { dragging = false; });
  window.addEventListener('touchend', () => { dragging = false; });

  slider.addEventListener('click', e => setPos(e.clientX));
});

// ===== GALLERY FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.filter;
    galleryItems.forEach(item => {
      item.classList.toggle('hidden', cat !== 'all' && item.dataset.cat !== cat);
    });
  });
});

// ===== LIGHTBOX =====
const lightbox = document.getElementById('lightbox');
const lbImg = lightbox.querySelector('.lb-img');
let currentIdx = 0;

function getVisible() {
  return [...document.querySelectorAll('.gallery-item:not(.hidden)')];
}
function openLB(idx) {
  currentIdx = idx;
  const visible = getVisible();
  if (!visible[idx]) return;
  lbImg.src = visible[idx].querySelector('img').src;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLB() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
function navLB(dir) {
  const visible = getVisible();
  currentIdx = (currentIdx + dir + visible.length) % visible.length;
  lbImg.src = visible[currentIdx].querySelector('img').src;
}

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const visible = getVisible();
    openLB(visible.indexOf(item));
  });
});
lightbox.querySelector('.lb-close').addEventListener('click', closeLB);
lightbox.querySelector('.lb-prev').addEventListener('click', () => navLB(-1));
lightbox.querySelector('.lb-next').addEventListener('click', () => navLB(1));
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLB(); });
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLB();
  if (e.key === 'ArrowLeft') navLB(-1);
  if (e.key === 'ArrowRight') navLB(1);
});
