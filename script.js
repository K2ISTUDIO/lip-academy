// ===== HERO VIDEO AUTOPLAY =====
const heroVideo = document.getElementById('hero-video');
if (heroVideo) {
  heroVideo.muted = true;
  const tryPlay = () => {
    heroVideo.play().catch(() => {
      // If blocked, retry on first user interaction
      document.addEventListener('click', () => heroVideo.play(), { once: true });
      document.addEventListener('touchstart', () => heroVideo.play(), { once: true });
    });
  };
  if (heroVideo.readyState >= 2) {
    tryPlay();
  } else {
    heroVideo.addEventListener('canplay', tryPlay, { once: true });
  }
}

// ===== NAV SCROLL =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ===== BURGER / DRAWER =====
const burger = document.getElementById('burger');
const drawer = document.getElementById('nav-drawer');

burger.addEventListener('click', () => {
  const open = drawer.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

drawer.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    drawer.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

// ===== INTERSECTION OBSERVER (fade-up) =====
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

document.querySelectorAll(
  '.benefit-card, .prog-card, .special-card, .planning-block, .tarif-card, .temo-card, .disc-item, .valeur-item, .ep-item, .step-item'
).forEach(el => { el.classList.add('fade-up'); io.observe(el); });

// ===== FORM SUBMIT =====
const form = document.getElementById('contact-form');
form.addEventListener('submit', e => {
  e.preventDefault();
  const btn = form.querySelector('[type="submit"]');
  btn.textContent = 'Demande envoyée — merci !';
  btn.disabled = true;
  btn.style.background = '#2EA09A';
  setTimeout(() => {
    btn.textContent = 'Envoyer ma demande';
    btn.disabled = false;
    btn.style.background = '';
    form.reset();
  }, 4000);
});
