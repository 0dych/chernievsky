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

// Spotlight card radial glow tracking
document.querySelectorAll('.spotlight-card').forEach((card) => {
  card.addEventListener('pointermove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  });
});

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

function selectShot(idx) {
  const shot = SHOTS[idx];
  if (!shot || !stageImg) return;
  stageImg.src = shot.src;
  stageImg.alt = shot.title;
  if (stageTitle) stageTitle.textContent = shot.title;
  if (stageDesc) stageDesc.textContent = shot.desc;
  tabBtns.forEach((b, i) => b.classList.toggle('active', i === idx));
  thumbBtns.forEach((b, i) => b.classList.toggle('active', i === idx));
}

tabBtns.forEach((btn, idx) => btn.addEventListener('click', () => selectShot(idx)));
thumbBtns.forEach((btn, idx) => btn.addEventListener('click', () => selectShot(idx)));

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
