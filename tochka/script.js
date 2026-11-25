// Scroll progress bar + active nav highlight
const progressBar = document.querySelector('.scroll-progress');
const navLinks = document.querySelectorAll('.site-nav a, .mobile-dock a');
const sections = document.querySelectorAll('section[id]');

function updateScroll() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? Math.min(1, scrollTop / docHeight) : 0;
  if (progressBar) progressBar.style.transform = `scaleX(${pct})`;

  let current = '';
  sections.forEach((sec) => {
    const top = sec.offsetTop - 160;
    if (scrollTop >= top) current = sec.id;
  });
  navLinks.forEach((a) => {
    a.classList.toggle('is-active', a.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', updateScroll, { passive: true });
updateScroll();

// Spotlight card radial glow tracking (fine pointer / desktop only)
if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.spotlight-card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });
}

// Interactive Live Screenshots Switcher
const SHOTS = [
  {
    src: 'screenshots/shot-editor.png',
    title: 'Редактор схем будівель, зонування та потоків НАССР',
    desc: 'Архітектурні стіни, магнітні двері/вікна, гігієнічні зони з площею в м², авто-легенда, компас і штамп підприємства з 4 полями підписів.',
  },
  {
    src: 'screenshots/shot-audit.png',
    title: 'Розумний аудит НАССР у реальному часі',
    desc: 'Автоматична перевірка перетинів брудних і чистих потоків, відстаней між пастками (>15 м / >10 м), родентицидів у чистих зонах та УФ-ламп.',
  },
  {
    src: 'screenshots/shot-custom.png',
    title: '3-рівневий пест-контроль, автонумерація та реєстр точок',
    desc: 'Зовнішній і внутрішній периметри (Рівні 1–3, живоловки, УФ-лампи, повзаючі комахи), автоматичний підрахунок у легенді, налаштування препаратів і миттєвий перехід до кожної пастки.',
  },
  {
    src: 'screenshots/shot-pest.png',
    title: 'Готові шаблони об’єктів для швидкого старту',
    desc: 'Починайте з готового плану (Кафе/Ресторан, Склад із рампою, Харчовий цех, Продуктовий магазин) або завантажуйте власний скан/PDF плану БТІ.',
  },
];

const stageImg = document.getElementById('stage-img');
const stageTitle = document.getElementById('stage-title');
const stageDesc = document.getElementById('stage-desc');
const tabBtns = document.querySelectorAll('.shot-tab');
const thumbBtns = document.querySelectorAll('.shot-thumb');

let currentShotIdx = 0;

function selectShot(idx) {
  const safeIdx = ((idx % SHOTS.length) + SHOTS.length) % SHOTS.length;
  const shot = SHOTS[safeIdx];
  if (!shot || !stageImg) return;
  currentShotIdx = safeIdx;
  stageImg.src = shot.src;
  stageImg.alt = shot.title;
  if (stageTitle) stageTitle.textContent = shot.title;
  if (stageDesc) stageDesc.textContent = shot.desc;
  tabBtns.forEach((b, i) => {
    const active = i === safeIdx;
    b.classList.toggle('active', active);
    if (active && window.innerWidth <= 760) {
      b.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  });
  thumbBtns.forEach((b, i) => b.classList.toggle('active', i === safeIdx));
}

tabBtns.forEach((btn, idx) => btn.addEventListener('click', () => selectShot(idx)));
thumbBtns.forEach((btn, idx) => btn.addEventListener('click', () => selectShot(idx)));

// Touch swipe support for screenshots stage on mobile
let lastSwipeAt = 0;
const stageWrap = document.querySelector('.shots-stage-img');
if (stageWrap) {
  let touchStartX = 0;
  let touchStartY = 0;
  stageWrap.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  stageWrap.addEventListener('touchend', (e) => {
    if (!e.changedTouches.length) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      lastSwipeAt = Date.now();
      selectShot(dx < 0 ? currentShotIdx + 1 : currentShotIdx - 1);
    }
  }, { passive: true });
}

// Fullscreen Lightbox for screenshots
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');

function openLightbox(src, caption) {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  if (lightboxCaption) lightboxCaption.textContent = caption || '';
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-zoom]').forEach((el) => {
  el.addEventListener('click', () => {
    if (Date.now() - lastSwipeAt < 350) return;
    const img = el.querySelector('img');
    if (img) openLightbox(img.src, img.alt);
  });
});

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// FAQ Accordion
document.querySelectorAll('.faq-q').forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    if (item) item.classList.toggle('open');
  });
});
