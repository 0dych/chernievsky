const canvas = document.querySelector("#motion-canvas");
const ctx = canvas.getContext("2d");
const repoGrid = document.querySelector("#repo-grid");
const tickerTrack = document.querySelector(".ticker-track");
const scrollProgressBar = document.querySelector(".scroll-progress");

let width = 0;
let height = 0;
let pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2, active: false };
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

// Ambient Studio Orbs Animation
class Orb {
  constructor(x, y, radius, color, vx, vy) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.vx = vx;
    this.vy = vy;
    this.angle = Math.random() * Math.PI * 2;
  }

  update() {
    this.angle += 0.004;
    this.x += Math.cos(this.angle) * this.vx;
    this.y += Math.sin(this.angle) * this.vy;

    if (this.x < -this.radius) this.x = width + this.radius;
    if (this.x > width + this.radius) this.x = -this.radius;
    if (this.y < -this.radius) this.y = height + this.radius;
    if (this.y > height + this.radius) this.y = -this.radius;

    if (pointer.active && hasFinePointer) {
      this.x += (pointer.x - this.x) * 0.008;
      this.y += (pointer.y - this.y) * 0.008;
    }
  }

  draw(context) {
    const gradient = context.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, "rgba(7, 8, 10, 0)");

    context.beginPath();
    context.fillStyle = gradient;
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fill();
  }
}

let orbs = [];
const orbColors = [
  "rgba(200, 255, 61, 0.16)", // Acid Lime
  "rgba(56, 232, 255, 0.17)", // Ice Cyan
  "rgba(79, 107, 255, 0.14)"  // Studio Indigo
];

// Scroll Reveal Observer
const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  },
  { root: null, rootMargin: "0px 0px -10px 0px", threshold: 0.01 }
);

const heroSection = document.querySelector(".hero-dash");
if (heroSection) heroSection.classList.add("visible");
document.querySelectorAll(".reveal:not(.hero-dash), .reveal-item").forEach((el) => observer.observe(el));
const revealHeader = document.querySelector(".reveal-header");
if (revealHeader) revealHeader.classList.add("visible");

// Ensure anchor jumps immediately reveal target section & its children
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", () => {
    const id = anchor.getAttribute("href").slice(1);
    const target = id ? document.getElementById(id) : null;
    if (target) {
      target.classList.add("visible");
      target.querySelectorAll(".reveal-item").forEach((item) => item.classList.add("visible"));
    }
  });
});

// Localization
const translations = {
  uk: {
    "brand-role": "Графічний дизайнер та веб-розробник",
    "nav-work": "Роботи",
    "nav-services": "Послуги",
    "nav-process": "Процес",
    "nav-contact": "Контакти",
    "hero-eyebrow": "CREATIVE DESIGN & WEB STUDIO · UA / WORLDWIDE",
    "hero-title-dash": "ГРАФІЧНИЙ<br/><span class=\"grad\">ДИЗАЙНЕР</span><br/><span class=\"amp\">&amp;</span> WEB-DEV",
    "hero-lead-dash": "Створюю логотипи, айдентику, банери, обкладинки, сайти та веб-сервіси з характером для сучасних брендів.",
    "btn-view-work": "МОЇ РОБОТИ",
    "btn-contact": "КОНТАКТИ",
    "stat-1-val": "06+",
    "stat-1-label": "РОКІВ ДОСВІДУ",
    "stat-2-val": "45+",
    "stat-2-label": "ПРОЄКТІВ",
    "stat-3-val": "18+",
    "stat-3-label": "КЛІЄНТІВ",
    "badge-available": "ДОСТУПНИЙ ДО РОБОТИ",
    "badge-based": "УКРАЇНА / СВІТ",
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
    "quick-2-desc": "Адаптивні сторінки, корпоративні сайти, портфоліо і презентація послуг.",
    "quick-3-title": "E-commerce / web-сервіси",
    "quick-3-desc": "Каталоги, адмінки, CRM/EDMS-інтерфейси, інтерактивні демо та web-продукти.",
    "services-badge": "Послуги",
    "work-badge": "Портфоліо · Live & Behance",
    "work-title": "Добірка візуальних і веб-робіт",
    "work-lead": "Реалізовані сайти, інтерактивні веб-демо та бренд-айдентика. Перемикайте фільтри або відкривайте проєкти наживо.",
    "filter-all": "Усі проєкти",
    "filter-web": "Веб-розробка",
    "filter-branding": "Айдентика",
    "work-show-more": "Показати всі проєкти",
    "work-show-less": "Згорнути список",
    "work-behance-btn": "ДИВИТИСЯ ПРОЄКТИ НА BEHANCE",
    "services-title": "Формати роботи, які можна замовити",
    "srv-1-title": "Логотипи та айдентика",
    "srv-1-desc": "Розробляю логотип, кольори, шрифти й базові правила стилю, щоб бренд виглядав впізнавано в соцмережах, на сайті та в рекламі.",
    "srv-2-title": "Банери та промо-графіка",
    "srv-2-desc": "Створюю рекламні банери, обкладинки, афіші, креативи для постів і сторіс, які швидко читаються та тримають єдиний стиль.",
    "srv-3-title": "Сайти та веб-сервіси",
    "srv-3-desc": "Проєктую й збираю лендінги, корпоративні сайти та веб-сервіси з чистою структурою, адаптивністю, формами й готовністю до запуску.",
    "srv-4-title": "Редизайн та підготовка",
    "srv-4-desc": "Оновлюю старі макети, приводжу графіку до одного стилю, готую файли для публікації, друку або передачі команді.",
    "github-title": "Останні публічні репозиторії",
    "process-title": "Як народжується проєкт",
    "prc-1-desc": "Швидко фіксуємо мету, аудиторію, настрій та технічні обмеження.",
    "prc-2-desc": "Збираю візуальну систему, макети та інтерактивні стани.",
    "prc-3-desc": "Переношу дизайн у код, адаптую під екрани та додаю рух.",
    "prc-4-desc": "Перевіряємо, поліруємо, публікуємо та залишаємо проєкт готовим до розвитку.",
    "contact-title": "Давайте створимо щось <span class=\"grad\">надзвичайне</span> разом.",
    "contact-response": "ВІДПОВІДАЮ ПРОТЯГОМ ДНЯ",
    "contact-btn": "ЗВ'ЯЗАТИСЯ У WHATSAPP",
    "contact-tg-btn": "НАПИСАТИ В TELEGRAM",
    "contact-li-btn": "ПРОФІЛЬ У LINKEDIN",
    "badge-status": "ГОТОВИЙ ДО НОВИХ ПРОЄКТІВ",
    "footer-copy": "© 2026 Іван Чернієвський",
    "footer-open": "Відкритий до проєктів",
    "fallback-desc": "Публічний проєкт з GitHub-профілю 0dych.",
    "updated": "Оновлено",
    "open": "Відкрити",
    "status-workflow": "СИСТЕМА: ПРОЦЕС РОБОТИ"
  },
  en: {
    "brand-role": "Graphic Designer & Web Developer",
    "nav-work": "Work",
    "nav-services": "Services",
    "nav-process": "Process",
    "nav-contact": "Contact",
    "hero-eyebrow": "CREATIVE DESIGN & WEB STUDIO · UA / WORLDWIDE",
    "hero-title-dash": "GRAPHIC<br/><span class=\"grad\">DESIGNER</span><br/><span class=\"amp\">&amp;</span> WEB-DEV",
    "hero-lead-dash": "I craft logos, brand identities, banners, covers, websites, and web services with distinct visual character.",
    "btn-view-work": "VIEW WORK",
    "btn-contact": "CONTACT",
    "stat-1-val": "06+",
    "stat-1-label": "YEARS EXPERIENCE",
    "stat-2-val": "45+",
    "stat-2-label": "PROJECTS",
    "stat-3-val": "18+",
    "stat-3-label": "CLIENTS",
    "badge-available": "AVAILABLE FOR WORK",
    "badge-based": "UKRAINE / WORLDWIDE",
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
    "quick-2-desc": "Responsive pages, corporate sites, portfolios and service presentation.",
    "quick-3-title": "E-commerce / web services",
    "quick-3-desc": "Catalogs, admin panels, CRM/EDMS interfaces, interactive demos and web products.",
    "services-badge": "Services",
    "work-badge": "Portfolio · Live & Behance",
    "work-title": "Selected visual & web work",
    "work-lead": "Launched websites, interactive web demos, and brand identity systems. Filter by focus or open projects live.",
    "filter-all": "All projects",
    "filter-web": "Web Development",
    "filter-branding": "Brand Identity",
    "work-show-more": "Show all projects",
    "work-show-less": "Show less",
    "work-behance-btn": "VIEW PROJECTS ON BEHANCE",
    "services-title": "Work formats you can order",
    "srv-1-title": "Logos & Identity",
    "srv-1-desc": "I design logos, colors, type and basic style rules so the brand feels recognizable across social media, websites and advertising.",
    "srv-2-title": "Banners & Promo Graphics",
    "srv-2-desc": "I create ad banners, covers, posters, post and story creatives that read quickly and keep one consistent visual style.",
    "srv-3-title": "Websites & Web Services",
    "srv-3-desc": "I design and build landing pages, corporate sites and web services with clear structure, responsiveness, forms and launch-ready polish.",
    "srv-4-title": "Redesign & Preparation",
    "srv-4-desc": "I refresh old layouts, align graphics into one style, and prepare files for publishing, print or handoff to a team.",
    "github-title": "Latest public repositories",
    "process-title": "How a project is born",
    "prc-1-desc": "Quickly defining the goal, audience, mood, and technical constraints.",
    "prc-2-desc": "Assembling the visual system, layouts, and interactive states.",
    "prc-3-desc": "Translating design into code, adapting for screens, and adding motion.",
    "prc-4-desc": "Testing, polishing, publishing, and leaving the project ready to grow.",
    "contact-title": "Let's build something <span class=\"grad\">extraordinary</span> together.",
    "contact-response": "TYPICALLY REPLIES SAME DAY",
    "contact-btn": "GET IN TOUCH ON WHATSAPP",
    "contact-tg-btn": "MESSAGE ON TELEGRAM",
    "contact-li-btn": "CONNECT ON LINKEDIN",
    "badge-status": "READY FOR NEW PROJECTS",
    "footer-copy": "© 2026 Ivan Chernievsky",
    "footer-open": "Open for projects",
    "fallback-desc": "Public project from 0dych GitHub profile.",
    "updated": "Updated",
    "open": "Open",
    "status-workflow": "SYSTEM: EXECUTION PROCESS"
  }
};

let currentLang = "uk";
let isInitialLoad = true;
let langSwitchToken = 0;
const GLYPHS = "アイウエオカキクケコサシスセソ01!<>-_[]{}=+*?#";

function scrambleText(el, newText, delay, token) {
  setTimeout(() => {
    if (token !== langSwitchToken) return;
    let frame = 0;
    const total = 14;
    const iv = setInterval(() => {
      if (token !== langSwitchToken) {
        clearInterval(iv);
        return;
      }
      frame++;
      const pct = frame / total;
      el.textContent = [...newText]
        .map((ch, i) => (i < pct * newText.length || ch === " " ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
        .join("");
      if (frame >= total) {
        el.textContent = newText;
        clearInterval(iv);
      }
    }, 22);
  }, delay);
}

function flipElement(el, newHTML, delay, token) {
  const cs = getComputedStyle(el);
  if (cs.display === "inline") el.style.display = "inline-block";

  setTimeout(() => {
    if (token !== langSwitchToken) return;
    el.getAnimations().forEach((anim) => anim.cancel());
    const outAnim = el.animate(
      [
        { opacity: 1, transform: "perspective(500px) rotateX(0deg)", filter: "blur(0px)" },
        { opacity: 0, transform: "perspective(500px) rotateX(70deg)", filter: "blur(4px)" }
      ],
      { duration: 130, easing: "ease-in", fill: "forwards" }
    );
    outAnim.onfinish = () => {
      if (token !== langSwitchToken) return;
      el.innerHTML = newHTML;
      el.animate(
        [
          { opacity: 0, transform: "perspective(500px) rotateX(-50deg)", filter: "blur(4px)" },
          { opacity: 1, transform: "perspective(500px) rotateX(0deg)", filter: "blur(0px)" }
        ],
        { duration: 240, easing: "cubic-bezier(0.34, 1.5, 0.64, 1)", fill: "forwards" }
      );
    };
  }, delay);
}

window.changeLang = function (lang) {
  if (lang === currentLang && !isInitialLoad) return;
  const firstLoad = isInitialLoad;
  isInitialLoad = false;
  currentLang = lang;
  const token = ++langSwitchToken;
  document.documentElement.lang = lang;

  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach((el, i) => {
    const key = el.getAttribute("data-i18n");
    const newContent = translations[lang][key];
    if (!newContent) return;

    if (firstLoad || prefersReducedMotion) {
      el.innerHTML = newContent;
      return;
    }

    const hasHTML = /<[a-z][\s\S]*>/i.test(newContent);
    const delay = Math.min(i * 8, 80);
    if (hasHTML) {
      flipElement(el, newContent, delay, token);
    } else {
      scrambleText(el, newContent, delay, token);
    }
  });

  document.querySelectorAll(".lang-switcher button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  loadRepos();
};

// Portfolio Category Filters & Mobile Expand/Collapse
let isMobileWorkExpanded = false;
const MOBILE_WORK_LIMIT = 2;

function syncMobileWorkCollapse() {
  const expandBtn = document.getElementById("work-expand-btn");
  const toggleWrap = document.querySelector(".work-mobile-toggle");
  const cards = [...document.querySelectorAll(".featured-work-grid .work-card")];
  const visibleCards = cards.filter((card) => !card.classList.contains("is-filtered-out"));

  cards.forEach((card) => card.classList.remove("is-mobile-collapsed"));

  const hiddenCount = Math.max(0, visibleCards.length - MOBILE_WORK_LIMIT);
  if (!isMobileWorkExpanded && hiddenCount > 0) {
    visibleCards.slice(MOBILE_WORK_LIMIT).forEach((card) => card.classList.add("is-mobile-collapsed"));
  }

  if (toggleWrap && expandBtn) {
    toggleWrap.classList.toggle("is-hidden", hiddenCount === 0);
    expandBtn.setAttribute("aria-expanded", String(isMobileWorkExpanded));
    const labelEl = expandBtn.querySelector("[data-i18n]");
    const countEl = expandBtn.querySelector(".expand-count");
    const key = isMobileWorkExpanded ? "work-show-less" : "work-show-more";
    if (labelEl) {
      labelEl.setAttribute("data-i18n", key);
      labelEl.textContent = translations[currentLang][key] || labelEl.textContent;
    }
    if (countEl) {
      countEl.textContent = isMobileWorkExpanded ? "↑" : `+${hiddenCount}`;
    }
  }
}

window.syncMobileWorkCollapse = syncMobileWorkCollapse;

function initWorkFilters() {
  const buttons = document.querySelectorAll(".work-filter-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter || "all";
      buttons.forEach((b) => b.classList.toggle("active", b === btn));

      document.querySelectorAll(".featured-work-grid .work-card").forEach((card) => {
        const type = card.dataset.workType || "branding";
        const shouldHide = filter !== "all" && type !== filter;
        card.classList.toggle("is-filtered-out", shouldHide);
      });

      syncMobileWorkCollapse();
    });
  });

  const expandBtn = document.getElementById("work-expand-btn");
  if (expandBtn) {
    expandBtn.addEventListener("click", () => {
      isMobileWorkExpanded = !isMobileWorkExpanded;
      syncMobileWorkCollapse();
    });
  }

  // Mobile Accordion for Service Formats (single-open for compactness)
  const serviceCards = document.querySelectorAll(".services-grid article");
  serviceCards.forEach((card) => {
    card.addEventListener("click", () => {
      if (window.innerWidth > 768) return;
      const willOpen = !card.classList.contains("is-open");
      serviceCards.forEach((c) => c.classList.remove("is-open"));
      if (willOpen) card.classList.add("is-open");
    });
  });
}

// Scroll Progress + Active Nav Spy
function initScrollExperience() {
  const sections = ["services", "work", "process", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  function updateScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;

    if (scrollProgressBar) {
      scrollProgressBar.style.transform = `scaleX(${progress / 100})`;
    }

    let activeId = "";
    const triggerY = scrollTop + window.innerHeight * 0.35;
    for (const sec of sections) {
      if (sec.offsetTop <= triggerY) {
        activeId = sec.id;
      }
    }

    document.querySelectorAll(".site-nav a, .mobile-dock a").forEach((link) => {
      link.classList.toggle("is-active", link.dataset.section === activeId);
    });
  }

  window.addEventListener("scroll", updateScroll, { passive: true });
  updateScroll();
}

// Subtle Spotlight & 3D Tilt on Desktop
function initSpotlightAndTilt() {
  if (!hasFinePointer || prefersReducedMotion) return;

  document.addEventListener("pointermove", (e) => {
    document.querySelectorAll(".spotlight-card").forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mx", `${x}px`);
      card.style.setProperty("--my", `${y}px`);
    });
  });

  const tiltCard = document.querySelector("[data-tilt]");
  if (tiltCard) {
    tiltCard.addEventListener("pointermove", (e) => {
      const rect = tiltCard.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      tiltCard.style.transform = `perspective(1000px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg)`;
    });
    tiltCard.addEventListener("pointerleave", () => {
      tiltCard.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg)";
    });
  }
}

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const scale = Math.max(width, 600);
  orbs = [
    new Orb(width * 0.18, height * 0.22, scale * 0.44, orbColors[0], 1.4, 1.1),
    new Orb(width * 0.82, height * 0.56, scale * 0.4, orbColors[1], -1.2, 1.5),
    new Orb(width * 0.48, height * 0.84, scale * 0.48, orbColors[2], 0.9, -0.9)
  ];
}

function drawMotion() {
  ctx.clearRect(0, 0, width, height);
  ctx.globalCompositeOperation = "screen";

  orbs.forEach((orb) => {
    orb.update();
    orb.draw(ctx);
  });

  ctx.globalCompositeOperation = "source-over";
  if (!prefersReducedMotion) {
    requestAnimationFrame(drawMotion);
  }
}

function duplicateTickerItems() {
  if (tickerTrack) {
    tickerTrack.innerHTML += tickerTrack.innerHTML;
  }
}

function formatDate(value) {
  const localeStr = currentLang === "uk" ? "uk-UA" : "en-US";
  return new Intl.DateTimeFormat(localeStr, {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

function createRepoCard(repo) {
  const article = document.createElement("article");
  article.className = "repo-card spotlight-card visible";

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
    <p class="repo-meta repo-meta-foot">
      <span class="update-text">${textUpdated} ${formatDate(repo.updated_at)}</span>
      <a href="${repo.html_url}" target="_blank" rel="noreferrer" class="open-btn">${textOpen} ↗</a>
    </p>
  `;

  return article;
}

function renderFallbackRepos() {
  const fallback = [
    {
      name: "Creative portfolio",
      description:
        currentLang === "uk"
          ? "Сайти, візуальні концепти та експерименти з інтерфейсами."
          : "Sites, visual concepts and UI experiments.",
      language: "Design",
      stargazers_count: 0,
      updated_at: new Date().toISOString(),
      html_url: "https://github.com/0dych"
    },
    {
      name: "Frontend work",
      description:
        currentLang === "uk"
          ? "Верстка, JavaScript, адаптивність та інтерактивні деталі."
          : "Layout, JavaScript, responsive and interactive details.",
      language: "JavaScript",
      stargazers_count: 0,
      updated_at: new Date().toISOString(),
      html_url: "https://github.com/0dych"
    },
    {
      name: "Visual systems",
      description:
        currentLang === "uk"
          ? "Айдентика, UI-композиції та графіка для цифрових продуктів."
          : "Identity, UI composites and graphics for digital products.",
      language: "UI",
      stargazers_count: 0,
      updated_at: new Date().toISOString(),
      html_url: "https://www.behance.net/ichernievsky"
    }
  ];

  repoGrid.replaceChildren(...fallback.map(createRepoCard));
}

async function loadRepos() {
  try {
    const response = await fetch("https://api.github.com/users/0dych/repos?sort=updated&per_page=6");
    if (!response.ok) throw new Error("GitHub API error");

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
initWorkFilters();
initScrollExperience();
initSpotlightAndTilt();

// --- Liquid Gooey Lava Lamp (Signature Acid-Lime + Ice-Cyan) ---
(function () {
  const liquidCanvas = document.getElementById("liquid-canvas");
  if (!liquidCanvas) return;
  liquidCanvas.style.filter = "url('#goo')";
  const lCtx = liquidCanvas.getContext("2d");
  let lWidth = 0;
  let lHeight = 0;
  let balls = [];

  class Ball {
    constructor() {
      this.x = Math.random() * lWidth;
      this.y = Math.random() * lHeight;
      this.vx = (Math.random() - 0.5) * 1.4;
      this.vy = (Math.random() - 0.5) * 1.4;
      this.baseRadius = 28 + Math.random() * 38;
      this.radius = this.baseRadius;
      this.phase = Math.random() * Math.PI * 2;
      this.color = Math.random() > 0.45 ? "#c8ff3d" : "#38e8ff";
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.phase += 0.015;
      this.radius = this.baseRadius + Math.sin(this.phase) * 10;

      if (pointer.active && hasFinePointer) {
        const rect = liquidCanvas.getBoundingClientRect();
        const mx = pointer.x - rect.left;
        const my = pointer.y - rect.top;
        const dx = mx - this.x;
        const dy = my - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 220) {
          const force = (220 - dist) / 220;
          this.vx += dx * force * 0.0014;
          this.vy += dy * force * 0.0014;
        }
      }

      if (this.x < -this.radius * 1.4) this.x = lWidth + this.radius * 1.4;
      if (this.x > lWidth + this.radius * 1.4) this.x = -this.radius * 1.4;
      if (this.y < -this.radius * 1.4) this.y = lHeight + this.radius * 1.4;
      if (this.y > lHeight + this.radius * 1.4) this.y = -this.radius * 1.4;

      this.vx *= 0.985;
      this.vy *= 0.985;
    }

    draw() {
      lCtx.beginPath();
      const grad = lCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
      grad.addColorStop(0, this.color);
      grad.addColorStop(1, this.color + "00");
      lCtx.fillStyle = grad;
      lCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      lCtx.fill();
    }
  }

  function init() {
    lWidth = liquidCanvas.width = liquidCanvas.offsetWidth || 280;
    lHeight = liquidCanvas.height = liquidCanvas.offsetHeight || 280;
    balls = [];
    for (let i = 0; i < 9; i++) {
      balls.push(new Ball());
    }
  }

  function animate() {
    lCtx.clearRect(0, 0, lWidth, lHeight);
    balls.forEach((b) => {
      b.update();
      b.draw();
    });

    if (pointer.active && hasFinePointer) {
      const rect = liquidCanvas.getBoundingClientRect();
      const mx = pointer.x - rect.left;
      const my = pointer.y - rect.top;
      if (mx >= -40 && mx <= lWidth + 40 && my >= -40 && my <= lHeight + 40) {
        lCtx.beginPath();
        const mGrad = lCtx.createRadialGradient(mx, my, 0, mx, my, 52);
        mGrad.addColorStop(0, "#c8ff3d");
        mGrad.addColorStop(1, "rgba(200, 255, 61, 0)");
        lCtx.fillStyle = mGrad;
        lCtx.arc(mx, my, 52, 0, Math.PI * 2);
        lCtx.fill();
      }
    }

    if (!prefersReducedMotion) {
      requestAnimationFrame(animate);
    }
  }

  window.addEventListener("resize", init);
  init();
  animate();
})();
