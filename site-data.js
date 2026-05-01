(function () {
  const STORAGE_KEY = "chernievsky-portfolio-data";
  const MEDIA_CLASSES = ["smile-media", "horizon-media", "synapse-media", "artisan-media", "smile-custom-media", "edms-media", "identity-media", "web-media", "code-media"];

  const defaults = {
    logo: "mylogo.png",
    heroPhoto: "https://github.com/0dych.png?size=800",
    contacts: {
      whatsapp: "https://wa.me/380964098097",
      telegram: "https://t.me/epicdramma"
    },
    works: [
      {
        title: "SMILE - Brand Identity for Kids Store",
        categoryUk: "Айдентика дитячого магазину",
        categoryEn: "Kids store identity",
        descriptionUk: "Логотип, кольори та візуальна система для теплого дитячого бренду.",
        descriptionEn: "Logo, colors and visual system for a warm kids brand.",
        url: "https://www.behance.net/gallery/248391417/SMILE-Brand-Identity-for-Kids-Store",
        media: "smile-media"
      },
      {
        title: "HORIZON - Branding Identity for Construction Company",
        categoryUk: "Брендинг для будівництва",
        categoryEn: "Construction branding",
        descriptionUk: "Стримана айдентика для будівельної компанії з акцентом на довіру.",
        descriptionEn: "Restrained identity for a construction company focused on trust.",
        url: "https://www.behance.net/gallery/248388401/HORIZON-Branding-Identity-for-Construction-Company",
        media: "horizon-media"
      },
      {
        title: "Synapse Technologies - Logo & Corporate Identity Design",
        categoryUk: "Корпоративний стиль tech-бренду",
        categoryEn: "Tech corporate identity",
        descriptionUk: "Логотип і корпоративна система для технологічної компанії.",
        descriptionEn: "Logo and corporate system for a technology company.",
        url: "https://www.behance.net/gallery/248386155/Synapse-Technologies-Logo-Corporate-Identity-Design",
        media: "synapse-media"
      },
      {
        title: "Artisan Crafts - Handmade Brand Identity",
        categoryUk: "Айдентика ремісничого бренду",
        categoryEn: "Craft brand identity",
        descriptionUk: "Візуальна система для handmade-проєкту з теплим натуральним настроєм.",
        descriptionEn: "Visual system for a handmade project with a warm natural mood.",
        url: "https://www.behance.net/gallery/247963889/Artisan-Crafts",
        media: "artisan-media"
      },
      {
        title: "SMILE Custom - Clickable Storefront Demo",
        categoryUk: "Клікабельне демо e-commerce",
        categoryEn: "Clickable e-commerce demo",
        descriptionUk: "E-commerce storefront для Smile Custom: Next.js, React, TypeScript, Tailwind CSS, Framer Motion, next-intl для UK/HU локалізації, каталог, сторінка товару, checkout, власна адмінка для керування товарами, банерами й контентом та API-архітектура.",
        descriptionEn: "E-commerce storefront for Smile Custom built with Next.js, React, TypeScript, Tailwind CSS, Framer Motion and next-intl for UK/HU localization, with catalog, product detail, checkout, custom admin panel for products, banners and content management, plus an API-driven architecture.",
        url: "demos/smile-app/index.html",
        media: "smile-custom-media"
      },
      {
        title: "Nexus EDMS - Clickable App Demo",
        categoryUk: "Клікабельне демо EDMS/CRM",
        categoryEn: "Clickable EDMS/CRM demo",
        descriptionUk: "Nexus EDMS/CRM: React, Vite, TypeScript, Tailwind CSS, glass UI, Express/Node.js backend, Prisma + SQLite, JWT/RBAC, Socket.IO та WebRTC для аудіо- і відеодзвінків. Модулі: dashboard, документи, службові записки, задачі, закупівлі, логістика, активи, ролі, чат і сповіщення.",
        descriptionEn: "Nexus EDMS/CRM built with React, Vite, TypeScript, Tailwind CSS, glass UI, Express/Node.js backend, Prisma + SQLite, JWT/RBAC, Socket.IO and WebRTC for audio and video calls. Modules include dashboard, documents, memos, tasks, procurement, logistics, assets, roles, chat and notifications.",
        url: "demos/edms-click/index.html",
        media: "edms-media"
      }
    ]
  };

  function mergeData(base, patch) {
    const demoTitles = new Set(base.works.filter((work) => work.url.includes("smile-app") || work.url.includes("edms-app") || work.url.includes("edms-click")).map((work) => work.title));
    const patchWorks = Array.isArray(patch && patch.works) ? patch.works : null;
    const cleanPatchWorks = patchWorks ? patchWorks.filter((work) => {
      if (work.url === "demos/smile-custom.html" || work.url === "demos/edms.html") return false;
      return !demoTitles.has(work.title);
    }) : null;
    const works = patchWorks
      ? [
          ...cleanPatchWorks,
          ...base.works.filter((baseWork) => !cleanPatchWorks.some((work) => work.url === baseWork.url || work.title === baseWork.title))
        ]
      : base.works;

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

  function applyData(data) {
    const siteData = mergeData(defaults, data || {});
    const lang = document.documentElement.lang === "en" ? "en" : "uk";

    setImage(".brand-mark img, .footer-logo img", siteData.logo);
    setImage(".dash-bg img", siteData.heroPhoto);

    const whatsapp = document.querySelector(".contact-link-dash.whatsapp");
    const telegram = document.querySelector(".contact-link-dash.telegram");
    if (whatsapp) whatsapp.href = siteData.contacts.whatsapp;
    if (telegram) telegram.href = siteData.contacts.telegram;

    const grid = document.querySelector(".featured-work-grid");
    if (!grid) return;

    grid.replaceChildren(
      ...siteData.works.map((work, index) => {
        const card = document.createElement("a");
        card.className = "work-card reveal-item visible";
        card.href = work.url || "#work";
        card.target = "_blank";
        card.rel = "noreferrer";
        card.style.transitionDelay = `${Math.min(index * 100, 400)}ms`;

        const mediaClass = MEDIA_CLASSES.includes(work.media) ? work.media : MEDIA_CLASSES[index % 4];
        const media = document.createElement("div");
        media.className = `card-media ${mediaClass}`;
        const num = document.createElement("span");
        num.textContent = String(index + 1).padStart(2, "0");
        media.append(num);

        const body = document.createElement("div");
        body.className = "work-card-body";
        const category = document.createElement("p");
        category.textContent = lang === "en" ? (work.categoryEn || work.categoryUk || "Brand identity") : (work.categoryUk || work.categoryEn || "Айдентика");
        const title = document.createElement("h3");
        title.textContent = work.title || "Portfolio project";
        body.append(category, title);

        const descriptionText = lang === "en" ? (work.descriptionEn || work.descriptionUk) : (work.descriptionUk || work.descriptionEn);
        if (descriptionText) {
          const description = document.createElement("p");
          description.className = "work-desc";
          description.textContent = descriptionText;
          body.append(description);
        }

        card.append(media, body);
        return card;
      })
    );
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
