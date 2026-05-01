const canvas = document.querySelector("#motion-canvas");
const ctx = canvas.getContext("2d");
const repoGrid = document.querySelector("#repo-grid");
const tickerTrack = document.querySelector(".ticker-track");

let width = 0;
let height = 0;
let pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2, active: false };

// Premium Canvas Orbs Animation
class Orb {
  constructor(x, y, radius, color, vx, vy) {
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.radius = radius;
    this.color = color;
    this.vx = vx;
    this.vy = vy;
    this.angle = Math.random() * Math.PI * 2;
  }

  update() {
    this.angle += 0.005;
    this.x += Math.cos(this.angle) * this.vx;
    this.y += Math.sin(this.angle) * this.vy;

    // Soft bounds
    if (this.x < -this.radius) this.x = width + this.radius;
    if (this.x > width + this.radius) this.x = -this.radius;
    if (this.y < -this.radius) this.y = height + this.radius;
    if (this.y > height + this.radius) this.y = -this.radius;
    
    // Slow follow pointer if active
    if (pointer.active) {
      this.x += (pointer.x - this.x) * 0.01;
      this.y += (pointer.y - this.y) * 0.01;
    }
  }

  draw(ctx) {
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, 'rgba(13, 14, 16, 0)'); // fade to bg

    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

let orbs = [];
const orbColors = [
  'rgba(59, 130, 246, 0.45)',  // Blue
  'rgba(139, 92, 246, 0.35)',  // Purple
  'rgba(6, 182, 212, 0.4)'     // Cyan
];

// UX: Intersection Observer for scroll animations
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal, .reveal-item').forEach(el => {
  observer.observe(el);
});
document.querySelector('.reveal-header').classList.add('visible');

// Localization
const translations = {
  uk: {
    "brand-role": "Графічний дизайнер та веб-дизайнер",
    "nav-work": "Роботи",
    "nav-services": "Послуги",
    "nav-process": "Процес",
    "nav-contact": "Контакти",
    "hero-title-dash": "ГРАФІЧНИЙ<br/><span class=\"grad\">ДИЗАЙНЕР</span><br/>& WEB-DEV",
    "hero-lead-dash": "Створюю логотипи, айдентику, банери, обкладинки, сайти та візуальний стиль для брендів.",
    "btn-view-work": "МОЇ РОБОТИ",
    "btn-contact": "КОНТАКТИ",
    "stat-1-val": "06+",
    "stat-1-label": "РОКІВ ДОСВІДУ",
    "stat-2-val": "45+",
    "stat-2-label": "ПРОЄКТІВ",
    "stat-3-val": "18+",
    "stat-3-label": "КЛІЄНТІВ",
    "badge-available": "ДОСТУПНИЙ ДО РОБОТИ",
    "badge-based": "ЛОКАЦІЯ: УКРАЇНА / СВІТ",
    "expertise-title": "ЕКСПЕРТИЗА",
    "tag-1": "ЛОГОТИПИ",
    "tag-2": "БРЕНДИНГ",
    "tag-3": "БАНЕРИ",
    "tag-4": "САЙТИ",
    "tag-5": "ВЕБ-СЕРВІСИ",
    "footer-tags": "ЛОГОТИПИ · БРЕНДИНГ · САЙТИ",
    "footer-desc": "Створюю айдентику, обкладинки, банери, сайти та веб-сервіси для брендів.",
    "ticker-1": "Логотипи",
    "ticker-2": "Айдентика",
    "ticker-3": "Веб-дизайн",
    "ticker-4": "Поліграфія",
    "ticker-5": "Обкладинки",
    "ticker-6": "Банери",
    "ticker-7": "Промо-сайти",
    "ticker-8": "Брендинг",
    "quick-badge": "Що я роблю",
    "quick-title": "Від айдентики до готового веб-продукту",
    "quick-1-title": "Айдентика та логотипи",
    "quick-1-desc": "Логотип, кольори, типографіка і базова система стилю для бренду.",
    "quick-2-title": "Сайти та лендинги",
    "quick-2-desc": "Адаптивні сторінки, портфоліо, промо-сайти і презентація послуг.",
    "quick-3-title": "E-commerce / web-сервіси",
    "quick-3-desc": "Каталоги, адмінки, CRM/EDMS-інтерфейси, інтерактивні демо та web-продукти.",
    "services-badge": "Послуги",
    "work-title": "Добірка візуальних робіт",
    "work-lead": "Вибрані кейси з Behance: айдентика для дитячого магазину, будівельної компанії, технологічного бренду та ремісничого проєкту.",
    "work-behance-btn": "ДИВИТИСЯ ПРОЄКТИ НА BEHANCE",
    "work-1-cat": "Айдентика дитячого магазину",
    "work-1-title": "SMILE — Brand Identity for Kids Store",
    "work-2-cat": "Брендинг для будівництва",
    "work-2-title": "HORIZON — Branding Identity for Construction Company",
    "work-3-cat": "Корпоративний стиль tech-бренду",
    "work-3-title": "Synapse Technologies — Logo & Corporate Identity Design",
    "work-4-cat": "Айдентика ремісничого бренду",
    "work-4-title": "Artisan Crafts — Handmade Brand Identity",
    "services-title": "Формати роботи, які можна замовити",
    "srv-1-title": "Логотипи та айдентика",
    "srv-1-desc": "Розробляю логотип, кольори, шрифти й базові правила стилю, щоб бренд виглядав впізнавано в соцмережах, на сайті та в рекламі.",
    "srv-2-title": "Банери та промо-графіка",
    "srv-2-desc": "Створюю рекламні банери, обкладинки, афіші, креативи для постів і сторіс, які швидко читаються та тримають єдиний стиль.",
    "srv-3-title": "Сайти та веб-сервіси",
    "srv-3-desc": "Проєктую й збираю лендінги, портфоліо та прості веб-сервіси з чистою структурою, адаптивністю, формами й готовністю до запуску.",
    "srv-4-title": "Редизайн та підготовка",
    "srv-4-desc": "Оновлюю старі макети, приводжу графіку до одного стилю, готую файли для публікації, друку або передачі команді.",
    "github-title": "Останні публічні репозиторії",
    "process-title": "Як народжується проєкт",
    "prc-1-desc": "Швидко фіксуємо мету, аудиторію, настрій та технічні обмеження.",
    "prc-2-desc": "Збираю візуальну систему, макети та інтерактивні стани.",
    "prc-3-desc": "Переношу дизайн у код, адаптую під екрани та додаю рух.",
    "prc-4-desc": "Перевіряємо, поліруємо, публікуємо та залишаємо проєкт готовим до розвитку.",
    "contact-title": "Давайте створимо щось <span class=\"grad\">надзвичайне</span> разом.",
    "contact-btn": "ЗВ'ЯЗАТИСЯ У WHATSAPP",
    "contact-tg-btn": "НАПИСАТИ В TELEGRAM",
    "badge-status": "ГОТОВИЙ ДО НОВИХ ПРОЄКТІВ",
    "footer-copy": "© 2026 Іван Чернієвський",
    "fallback-desc": "Публічний проєкт з GitHub-профілю 0dych.",
    "updated": "Оновлено",
    "open": "Відкрити",
    "status-workflow": "СИСТЕМА: ПРОЦЕС РОБОТИ"
  },
  en: {
    "brand-role": "Graphic Designer & Web Designer",
    "nav-work": "Work",
    "nav-services": "Services",
    "nav-process": "Process",
    "nav-contact": "Contact",
    "hero-title-dash": "GRAPHIC<br/><span class=\"grad\">DESIGNER</span><br/>& WEB-DEV",
    "hero-lead-dash": "I create logos, identity, banners, covers, websites, and visual style for brands.",
    "btn-view-work": "VIEW WORK",
    "btn-contact": "CONTACT",
    "stat-1-val": "06+",
    "stat-1-label": "YEARS EXPERIENCE",
    "stat-2-val": "45+",
    "stat-2-label": "PROJECTS",
    "stat-3-val": "18+",
    "stat-3-label": "CLIENTS",
    "badge-available": "AVAILABLE",
    "badge-based": "BASED IN WORLDWIDE",
    "expertise-title": "EXPERTISE",
    "tag-1": "LOGOS",
    "tag-2": "BRANDING",
    "tag-3": "BANNERS",
    "tag-4": "WEBSITES",
    "tag-5": "WEB SERVICES",
    "footer-tags": "LOGOS · BRANDING · WEBSITES",
    "footer-desc": "Creating identity, covers, banners, websites and web services for brands.",
    "ticker-1": "Logos",
    "ticker-2": "Identity",
    "ticker-3": "Web Design",
    "ticker-4": "Print Design",
    "ticker-5": "Covers",
    "ticker-6": "Banners",
    "ticker-7": "Promo Sites",
    "ticker-8": "Branding",
    "quick-badge": "What I do",
    "quick-title": "From identity to a finished web product",
    "quick-1-title": "Identity & logos",
    "quick-1-desc": "Logo, colors, typography and a basic style system for the brand.",
    "quick-2-title": "Websites & landing pages",
    "quick-2-desc": "Responsive pages, portfolios, promo sites and service presentation.",
    "quick-3-title": "E-commerce / web services",
    "quick-3-desc": "Catalogs, admin panels, CRM/EDMS interfaces, interactive demos and web products.",
    "services-badge": "Services",
    "work-title": "Selected visual work",
    "work-lead": "Selected Behance case studies: identity for a kids store, construction company, technology brand, and artisan craft project.",
    "work-behance-btn": "VIEW PROJECTS ON BEHANCE",
    "work-1-cat": "Kids store identity",
    "work-1-title": "SMILE — Brand Identity for Kids Store",
    "work-2-cat": "Construction branding",
    "work-2-title": "HORIZON — Branding Identity for Construction Company",
    "work-3-cat": "Tech corporate identity",
    "work-3-title": "Synapse Technologies — Logo & Corporate Identity Design",
    "work-4-cat": "Craft brand identity",
    "work-4-title": "Artisan Crafts — Handmade Brand Identity",
    "services-title": "Work formats you can order",
    "srv-1-title": "Logos & Identity",
    "srv-1-desc": "I design logos, colors, type and basic style rules so the brand feels recognizable across social media, websites and advertising.",
    "srv-2-title": "Banners & Promo Graphics",
    "srv-2-desc": "I create ad banners, covers, posters, post and story creatives that read quickly and keep one consistent visual style.",
    "srv-3-title": "Websites & Web Services",
    "srv-3-desc": "I design and build landing pages, portfolios and simple web services with clear structure, responsiveness, forms and launch-ready polish.",
    "srv-4-title": "Redesign & Preparation",
    "srv-4-desc": "I refresh old layouts, align graphics into one style, and prepare files for publishing, print or handoff to a team.",
    "github-title": "Latest repositories",
    "process-title": "How a project is born",
    "prc-1-desc": "Quickly defining the goal, audience, mood, and technical constraints.",
    "prc-2-desc": "Assembling the visual system, layouts, and interactive states.",
    "prc-3-desc": "Translating design into code, adapting for screens, and adding motion.",
    "prc-4-desc": "Testing, polishing, publishing, and leaving the project ready to grow.",
    "contact-title": "Let's build something <span class=\"grad\">extraordinary</span> together.",
    "contact-btn": "GET IN TOUCH ON WHATSAPP",
    "contact-tg-btn": "MESSAGE ON TELEGRAM",
    "badge-status": "READY FOR NEW PROJECTS",
    "footer-copy": "© 2026 Ivan Chernievsky",
    "fallback-desc": "Public project from 0dych GitHub profile.",
    "updated": "Updated",
    "open": "Open",
    "status-workflow": "SYSTEM: EXECUTION PROCESS"
  }
};

let currentLang = 'uk';
let isInitialLoad = true;

// Katakana + symbols for scramble
const GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニ01!<>-_[]{}=+*?#@%&';

function scrambleText(el, newText, delay) {
  setTimeout(() => {
    let frame = 0;
    const total = 22;
    const iv = setInterval(() => {
      frame++;
      const pct = frame / total;
      el.textContent = [...newText].map((ch, i) =>
        (i < pct * newText.length || ch === ' ') ? ch
        : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
      ).join('');
      if (frame >= total) { el.textContent = newText; clearInterval(iv); }
    }, 28);
  }, delay);
}

function flipElement(el, newHTML, delay) {
  // make sure transform works on inline elements
  const cs = getComputedStyle(el);
  if (cs.display === 'inline') el.style.display = 'inline-block';

  setTimeout(() => {
    el.animate(
      [{ opacity: 1, transform: 'perspective(500px) rotateX(0deg)',  filter: 'blur(0px)' },
       { opacity: 0, transform: 'perspective(500px) rotateX(75deg)', filter: 'blur(5px)' }],
      { duration: 180, easing: 'ease-in', fill: 'forwards' }
    ).onfinish = () => {
      el.innerHTML = newHTML;
      el.animate(
        [{ opacity: 0, transform: 'perspective(500px) rotateX(-55deg)', filter: 'blur(5px)' },
         { opacity: 1, transform: 'perspective(500px) rotateX(0deg)',   filter: 'blur(0px)' }],
        { duration: 340, easing: 'cubic-bezier(0.34, 1.5, 0.64, 1)', fill: 'forwards' }
      );
    };
  }, delay);
}

window.changeLang = function(lang) {
  if (lang === currentLang && !isInitialLoad) return;
  const firstLoad = isInitialLoad;
  isInitialLoad = false;
  currentLang = lang;
  document.documentElement.lang = lang;

  const elements = document.querySelectorAll('[data-i18n]');

  elements.forEach((el, i) => {
    const key = el.getAttribute('data-i18n');
    const newContent = translations[lang][key];
    if (!newContent) return;

    // On first page load — just set content, no animation
    if (firstLoad) {
      el.innerHTML = newContent;
      return;
    }

    const hasHTML = /<[a-z][\s\S]*>/i.test(newContent);
    const delay = Math.min(i * 12, 120); // stagger capped at 120ms

    if (hasHTML) {
      flipElement(el, newContent, delay);
    } else {
      scrambleText(el, newContent, delay);
    }
  });

  document.querySelectorAll('.lang-switcher button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  loadRepos();
};

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  // Initialize 3 large orbs
  orbs = [
    new Orb(width * 0.2, height * 0.3, width * 0.5, orbColors[0], 2, 1.5),
    new Orb(width * 0.8, height * 0.6, width * 0.4, orbColors[1], -1.5, 2),
    new Orb(width * 0.5, height * 0.8, width * 0.6, orbColors[2], 1, -1)
  ];
}

function drawMotion() {
  ctx.clearRect(0, 0, width, height);

  // Use global composite operation for premium blend mode
  ctx.globalCompositeOperation = 'screen';

  orbs.forEach(orb => {
    orb.update();
    orb.draw(ctx);
  });

  ctx.globalCompositeOperation = 'source-over';
  requestAnimationFrame(drawMotion);
}

function duplicateTickerItems() {
  tickerTrack.innerHTML += tickerTrack.innerHTML;
}

function formatDate(value) {
  const localeStr = currentLang === 'uk' ? 'uk-UA' : 'en-US';
  return new Intl.DateTimeFormat(localeStr, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function createRepoCard(repo) {
  const article = document.createElement("article");
  article.className = "repo-card visible"; 

  const description = repo.description || translations[currentLang]["fallback-desc"];
  const language = repo.language || "Code";
  const stars = repo.stargazers_count || 0;
  
  const textUpdated = translations[currentLang]["updated"];
  const textOpen = translations[currentLang]["open"];

  article.innerHTML = `
    <div>
      <p class="repo-meta">
        <span class="badge lang-badge">${language}</span>
        <span class="badge star-badge">${stars} ★</span>
      </p>
      <h3>${repo.name}</h3>
      <p>${description}</p>
    </div>
    <p class="repo-meta" style="align-items: center; justify-content: space-between;">
      <span class="update-text">${textUpdated} ${formatDate(repo.updated_at)}</span>
      <a href="${repo.html_url}" target="_blank" rel="noreferrer" class="button ghost open-btn">${textOpen}</a>
    </p>
  `;

  return article;
}

function renderFallbackRepos() {
  const fallback = [
    {
      name: "Creative portfolio",
      description: currentLang === 'uk' ? "Сайти, візуальні концепті та експерименти з інтерфейсами." : "Sites, visual concepts and UI experiments.",
      language: "Design",
      stargazers_count: 0,
      updated_at: new Date().toISOString(),
      html_url: "https://github.com/0dych",
    },
    {
      name: "Frontend work",
      description: currentLang === 'uk' ? "Верстка, JavaScript, адаптивність та інтерактивні деталі." : "Layout, JavaScript, responsive and interactive details.",
      language: "JavaScript",
      stargazers_count: 0,
      updated_at: new Date().toISOString(),
      html_url: "https://github.com/0dych",
    },
    {
      name: "Visual systems",
      description: currentLang === 'uk' ? "Айдентика, UI-композиції та графіка для цифрових продуктів." : "Identity, UI composites and graphics for digital products.",
      language: "UI",
      stargazers_count: 0,
      updated_at: new Date().toISOString(),
      html_url: "https://www.behance.net/ichernievsky",
    },
  ];

  repoGrid.replaceChildren(...fallback.map(createRepoCard));
}

async function loadRepos() {
  try {
    const response = await fetch("https://api.github.com/users/0dych/repos?sort=updated&per_page=6");

    if (!response.ok) {
      throw new Error("GitHub API error");
    }

    const repos = await response.json();
    const visibleRepos = repos.filter((repo) => !repo.fork).slice(0, 3);

    if (!visibleRepos.length) {
      renderFallbackRepos();
      return;
    }

    repoGrid.replaceChildren(...visibleRepos.map(createRepoCard));
  } catch {
    renderFallbackRepos();
  }
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("pointermove", (event) => {
  pointer = { x: event.clientX, y: event.clientY, active: true };
});
window.addEventListener("pointerleave", () => {
  pointer.active = false;
});

duplicateTickerItems();
resizeCanvas();
changeLang(currentLang);
drawMotion();
loadRepos();

// --- Simple & Robust Liquid Lava Lamp ---
const lavaAnimation = (function() {
  const canvas = document.getElementById('liquid-canvas');
  canvas.style.filter = "url('#goo')";
  const ctx = canvas.getContext('2d');
  let width, height, balls = [];

  class Ball {
    constructor(x, y, radius) {
      this.x = x || Math.random() * width;
      this.y = y || Math.random() * height;
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = (Math.random() - 0.5) * 1.5;
      this.baseRadius = radius || 35 + Math.random() * 45;
      this.radius = this.baseRadius;
      this.phase = Math.random() * Math.PI * 2;
      this.color = Math.random() > 0.5 ? '#06b6d4' : '#8b5cf6';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.phase += 0.015;
      this.radius = this.baseRadius + Math.sin(this.phase) * 12;

      // Mouse Pull Effect
      if (pointer.active) {
        const rect = canvas.getBoundingClientRect();
        const mx = pointer.x - rect.left;
        const my = pointer.y - rect.top;
        const dx = mx - this.x;
        const dy = my - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 250) {
          const force = (250 - dist) / 250;
          this.vx += dx * force * 0.0015;
          this.vy += dy * force * 0.0015;
        }
      }

      if (this.x < -this.radius * 1.5) this.x = width + this.radius * 1.5;
      if (this.x > width + this.radius * 1.5) this.x = -this.radius * 1.5;
      if (this.y < -this.radius * 1.5) this.y = height + this.radius * 1.5;
      if (this.y > height + this.radius * 1.5) this.y = -this.radius * 1.5;

      this.vx *= 0.985; // Natural friction
      this.vy *= 0.985;
    }

    draw() {
      ctx.beginPath();
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
      gradient.addColorStop(0, this.color);
      gradient.addColorStop(1, this.color + '00');
      
      ctx.fillStyle = gradient;
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function init() {
    width = canvas.width = canvas.offsetWidth || 320;
    height = canvas.height = canvas.offsetHeight || 320;
    balls = [];
    for (let i = 0; i < 10; i++) {
      balls.push(new Ball());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw "blobs"
    balls.forEach(ball => {
      ball.update();
      ball.draw();
    });

    // Mouse "blob"
    if (pointer.active) {
      const rect = canvas.getBoundingClientRect();
      const mx = pointer.x - rect.left;
      const my = pointer.y - rect.top;
      
      ctx.beginPath();
      const mGradient = ctx.createRadialGradient(mx, my, 0, mx, my, 60);
      mGradient.addColorStop(0, '#8b5cf6'); // Purple
      mGradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
      ctx.fillStyle = mGradient;
      ctx.arc(mx, my, 60, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', init);
  init();
  animate();
})();
