(function () {
  const STORAGE_KEY = "chernievsky-portfolio-data";
  const MEDIA_CLASSES = [
    "tochka-media",
    "profdezzak-media",
    "smile-media",
    "horizon-media",
    "synapse-media",
    "artisan-media",
    "smile-custom-media",
    "edms-media",
    "identity-media",
    "web-media",
    "code-media"
  ];

  const defaults = {
    logo: "mylogo.png",
    heroPhoto: "https://github.com/0dych.png?size=800",
    contacts: {
      whatsapp: "https://wa.me/380964098097",
      telegram: "https://t.me/epicdramma",
      linkedin: "https://www.linkedin.com/in/7chernievsky/"
    },
    works: [
      {
        title: "Tochka НАССР — Desktop App (Windows)",
        categoryUk: "Власний продукт · Windows App",
        categoryEn: "Own Product · Windows Desktop App",
        descriptionUk:
          "Професійний офлайн-редактор схем будівель, 3-рівневого пест-контролю та потоків НАССР: багатоповерховий PDF, Розумний аудит, Журнал моніторингу, QR-наліпки на пастки та захист Ed25519.",
        descriptionEn:
          "Professional offline Windows CAD editor for building plans, 3-level pest control, and HACCP flows: multi-page PDF, Smart HACCP Audit, Monitoring Log, QR trap labels, and Ed25519 licensing.",
        url: "tochka/index.html",
        media: "tochka-media",
        type: "web",
        featured: true
      },
      {
        title: "PROFDEZZAK — Corporate Website",
        categoryUk: "Веб-розробка · Live сайт",
        categoryEn: "Web development · Live site",
        descriptionUk:
          "Розробка корпоративного сайту для профільної санітарної служби Закарпаття (дезінфекція, дезінсекція, дератизація, пест-контроль HACCP, озонація та асенізація). Чітка структура послуг, швидкий зв'язок та адаптив під мобільні.",
        descriptionEn:
          "Corporate website developed for a regional sanitary & pest-control service in Zakarpattia (disinfection, HACCP pest control, ozonation, and sanitation). Clear service structure, fast contact flow, and responsive mobile UX.",
        url: "https://profdezzak.com.ua/",
        media: "profdezzak-media",
        type: "web",
        featured: true
      },
      {
        title: "SMILE Custom - Clickable Storefront Demo",
        categoryUk: "Клікабельне демо e-commerce",
        categoryEn: "Clickable e-commerce demo",
        descriptionUk:
          "E-commerce storefront для Smile Custom: Next.js, React, TypeScript, Tailwind CSS, Framer Motion, next-intl для UK/HU локалізації, каталог, сторінка товару, checkout, власна адмінка для керування товарами, банерами й контентом та API-архітектура.",
        descriptionEn:
          "E-commerce storefront for Smile Custom built with Next.js, React, TypeScript, Tailwind CSS, Framer Motion and next-intl for UK/HU localization, with catalog, product detail, checkout, custom admin panel for products, banners and content management, plus an API-driven architecture.",
        url: "demos/smile-app/index.html",
        media: "smile-custom-media",
        type: "web"
      },
      {
        title: "Nexus EDMS - Clickable App Demo",
        categoryUk: "Клікабельне демо EDMS/CRM",
        categoryEn: "Clickable EDMS/CRM demo",
        descriptionUk:
          "Nexus EDMS/CRM: React, Vite, TypeScript, Tailwind CSS, glass UI, Express/Node.js backend, Prisma + SQLite, JWT/RBAC, Socket.IO та WebRTC для аудіо- і відеодзвінків. Модулі: dashboard, документи, службові записки, задачі, закупівлі, логістика, активи, ролі, чат і сповіщення.",
        descriptionEn:
          "Nexus EDMS/CRM built with React, Vite, TypeScript, Tailwind CSS, glass UI, Express/Node.js backend, Prisma + SQLite, JWT/RBAC, Socket.IO and WebRTC for audio and video calls. Modules include dashboard, documents, memos, tasks, procurement, logistics, assets, roles, chat and notifications.",
        url: "demos/edms-click/index.html",
        media: "edms-media",
        type: "web"
      },
      {
        title: "SMILE - Brand Identity for Kids Store",
        categoryUk: "Айдентика дитячого магазину",
        categoryEn: "Kids store identity",
        descriptionUk: "Логотип, кольори та візуальна система для теплого дитячого бренду.",
        descriptionEn: "Logo, colors and visual system for a warm kids brand.",
        url: "https://www.behance.net/gallery/248391417/SMILE-Brand-Identity-for-Kids-Store",
        media: "smile-media",
        type: "branding"
      },
      {
        title: "HORIZON - Branding Identity for Construction Company",
        categoryUk: "Брендинг для будівництва",
        categoryEn: "Construction branding",
        descriptionUk: "Стримана айдентика для будівельної компанії з акцентом на довіру.",
        descriptionEn: "Restrained identity for a construction company focused on trust.",
        url: "https://www.behance.net/gallery/248388401/HORIZON-Branding-Identity-for-Construction-Company",
        media: "horizon-media",
        type: "branding"
      },
      {
        title: "Synapse Technologies - Logo & Corporate Identity Design",
        categoryUk: "Корпоративний стиль tech-бренду",
        categoryEn: "Tech corporate identity",
        descriptionUk: "Логотип і корпоративна система для технологічної компанії.",
        descriptionEn: "Logo and corporate system for a technology company.",
        url: "https://www.behance.net/gallery/248386155/Synapse-Technologies-Logo-Corporate-Identity-Design",
        media: "synapse-media",
        type: "branding"
      },
      {
        title: "Artisan Crafts - Handmade Brand Identity",
        categoryUk: "Айдентика ремісничого бренду",
        categoryEn: "Craft brand identity",
        descriptionUk: "Візуальна система для handmade-проєкту з теплим натуральним настроєм.",
        descriptionEn: "Visual system for a handmade project with a warm natural mood.",
        url: "https://www.behance.net/gallery/247963889/Artisan-Crafts",
        media: "artisan-media",
        type: "branding"
      }
    ]
  };

  function inferWorkType(work) {
    if (work.type) return work.type;
    const url = (work.url || "").toLowerCase();
    if (url.includes("profdezzak") || url.includes("demos/") || work.media === "web-media" || work.media === "code-media") {
      return "web";
    }
    return "branding";
  }

  function getWorkBadge(work, lang) {
    const url = (work.url || "").toLowerCase();
    if (url.includes("tochka/")) {
      return { text: lang === "en" ? "WINDOWS APP · LAUNCH" : "WINDOWS APP · 3 499 ₴", kind: "live" };
    }
    if (url.includes("profdezzak")) {
      return { text: lang === "en" ? "LIVE WEBSITE" : "LIVE САЙТ", kind: "live" };
    }
    if (url.includes("demos/")) {
      return { text: lang === "en" ? "INTERACTIVE DEMO" : "ІНТЕРАКТИВНЕ ДЕМО", kind: "demo" };
    }
    if (url.includes("behance.net")) {
      return { text: "BEHANCE", kind: "behance" };
    }
    return { text: lang === "en" ? "CASE STUDY" : "КЕЙС", kind: "default" };
  }

  function mergeData(base, patch) {
    const demoTitles = new Set(
      base.works
        .filter((work) => work.url.includes("smile-app") || work.url.includes("edms-app") || work.url.includes("edms-click"))
        .map((work) => work.title)
    );
    const patchWorks = Array.isArray(patch && patch.works) ? patch.works : null;
    const cleanPatchWorks = patchWorks
      ? patchWorks.filter((work) => {
          if (work.url === "demos/smile-custom.html" || work.url === "demos/edms.html") return false;
          return !demoTitles.has(work.title);
        })
      : null;

    let works;
    if (patchWorks) {
      const missingBase = base.works.filter(
        (baseWork) => !cleanPatchWorks.some((work) => work.url === baseWork.url || work.title === baseWork.title)
      );
      const profdezBase = missingBase.filter((w) => (w.url || "").includes("profdezzak"));
      const restBase = missingBase.filter((w) => !(w.url || "").includes("profdezzak"));
      works = [...profdezBase, ...cleanPatchWorks, ...restBase];
    } else {
      works = base.works;
    }

    return {
      ...base,
      ...patch,
      contacts: { ...base.contacts, ...(patch && patch.contacts) },
      works
    };
  }

  function getStoredData() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return stored ? mergeData(defaults, stored) : defaults;
    } catch {
      return defaults;
    }
  }

  function getLocalPatch() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch {
      return null;
    }
  }

  function saveData(data) {
    const nextData = mergeData(defaults, data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData, null, 2));
    applyData(nextData);
    return nextData;
  }

  function setImage(selector, src) {
    document.querySelectorAll(selector).forEach((img) => {
      img.src = src;
    });
  }

  function createMediaPreview(mediaClass, work) {
    const frag = document.createDocumentFragment();
    if (mediaClass === "tochka-media") {
      const wrap = document.createElement("div");
      wrap.style.cssText = "position:absolute;inset:0;overflow:hidden;background:#0f1117;";
      wrap.innerHTML = `<img src="tochka/screenshots/shot-editor.png" alt="Tochka НАССР" style="width:100%;height:100%;object-fit:cover;object-position:center top;opacity:0.92;" />`;
      frag.append(wrap);
      return frag;
    }
    if (mediaClass === "profdezzak-media") {
      const browser = document.createElement("div");
      browser.className = "preview-browser";
      browser.setAttribute("aria-hidden", "true");
      browser.innerHTML = `
        <div class="pb-bar">
          <span class="pb-dots"><i></i><i></i><i></i></span>
          <span class="pb-url">profdezzak.com.ua</span>
        </div>
        <div class="pb-body">
          <div class="pb-shield">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
          </div>
          <div class="pb-copy">
            <strong>ПРОФДЕЗ ЗАКАРПАТТЯ</strong>
            <span>HACCP · Дезінфекція · Пест-контроль 24/7</span>
          </div>
          <div class="pb-pills">
            <span>Дезінсекція</span>
            <span>Озонація</span>
            <span>Асенізація</span>
          </div>
        </div>
      `;
      frag.append(browser);
    }
    return frag;
  }

  function applyData(data) {
    const siteData = mergeData(defaults, data || {});
    const lang = document.documentElement.lang === "en" ? "en" : "uk";

    setImage(".brand-mark img, .footer-logo img", siteData.logo);
    setImage(".dash-bg img", siteData.heroPhoto);

    const whatsapp = document.querySelector(".contact-link-dash.whatsapp");
    const telegram = document.querySelector(".contact-link-dash.telegram");
    const linkedin = document.querySelector(".contact-link-dash.linkedin");
    const footerLinkedin = document.querySelector('.footer-icons a[aria-label="LinkedIn"]');
    if (whatsapp) whatsapp.href = siteData.contacts.whatsapp;
    if (telegram) telegram.href = siteData.contacts.telegram;
    if (linkedin && siteData.contacts.linkedin) linkedin.href = siteData.contacts.linkedin;
    if (footerLinkedin && siteData.contacts.linkedin) footerLinkedin.href = siteData.contacts.linkedin;

    const grid = document.querySelector(".featured-work-grid");
    if (!grid) return;

    const activeFilterBtn = document.querySelector(".work-filter-btn.active");
    const activeFilter = activeFilterBtn ? activeFilterBtn.dataset.filter : "all";

    grid.replaceChildren(
      ...siteData.works.map((work, index) => {
        const workType = inferWorkType(work);
        const isFeatured = Boolean(work.featured || (work.url || "").includes("profdezzak"));
        const badgeInfo = getWorkBadge(work, lang);

        const card = document.createElement("a");
        card.className = `work-card reveal-item visible${isFeatured ? " is-featured" : ""}`;
        card.dataset.workType = workType;
        if (activeFilter !== "all" && workType !== activeFilter) {
          card.classList.add("is-filtered-out");
        }
        card.href = work.url || "#work";
        card.target = "_blank";
        card.rel = "noreferrer";
        card.style.transitionDelay = `${Math.min(index * 70, 320)}ms`;

        const mediaClass = MEDIA_CLASSES.includes(work.media) ? work.media : MEDIA_CLASSES[index % 4];
        const media = document.createElement("div");
        media.className = `card-media ${mediaClass}`;

        const topRow = document.createElement("div");
        topRow.className = "card-media-top";
        const pill = document.createElement("span");
        pill.className = `work-pill work-pill--${badgeInfo.kind}`;
        pill.textContent = badgeInfo.text;
        const arrow = document.createElement("span");
        arrow.className = "work-arrow";
        arrow.textContent = "↗";
        topRow.append(pill, arrow);

        const num = document.createElement("span");
        num.className = "card-index";
        num.textContent = String(index + 1).padStart(2, "0");

        media.append(topRow, createMediaPreview(mediaClass, work), num);

        const body = document.createElement("div");
        body.className = "work-card-body";
        const category = document.createElement("p");
        category.className = "work-cat";
        category.textContent =
          lang === "en"
            ? work.categoryEn || work.categoryUk || "Brand identity"
            : work.categoryUk || work.categoryEn || "Айдентика";

        const title = document.createElement("h3");
        title.textContent = work.title || "Portfolio project";
        body.append(category, title);

        const descriptionText =
          lang === "en" ? work.descriptionEn || work.descriptionUk : work.descriptionUk || work.descriptionEn;
        if (descriptionText) {
          const description = document.createElement("p");
          description.className = "work-desc";
          description.textContent = descriptionText;
          body.append(description);
        }

        if (isFeatured) {
          const cta = document.createElement("span");
          cta.className = "work-live-link";
          cta.textContent = lang === "en" ? "Visit profdezzak.com.ua ↗" : "Відкрити profdezzak.com.ua ↗";
          body.append(cta);
        }

        card.append(media, body);
        return card;
      })
    );

    if (typeof window.syncMobileWorkCollapse === "function") {
      window.syncMobileWorkCollapse();
    }
  }

  async function loadData() {
    let data = defaults;
    try {
      const response = await fetch("portfolio-data.json", { cache: "no-store" });
      if (response.ok) data = mergeData(data, await response.json());
    } catch {
      // Static hosts may not have a JSON file yet. Local admin data still works.
    }

    const localPatch = getLocalPatch();
    if (localPatch) data = mergeData(data, localPatch);
    applyData(data);
  }

  window.PortfolioCMS = {
    defaults,
    mediaClasses: MEDIA_CLASSES,
    getData: getStoredData,
    saveData,
    applyData,
    resetData() {
      localStorage.removeItem(STORAGE_KEY);
      applyData(defaults);
      return defaults;
    }
  };

  const originalChangeLang = window.changeLang;
  if (typeof originalChangeLang === "function") {
    window.changeLang = function (lang) {
      originalChangeLang(lang);
      window.PortfolioCMS.applyData(window.PortfolioCMS.getData());
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadData);
  } else {
    loadData();
  }
})();
