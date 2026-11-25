const ADMIN_LOGIN = "Chernievsky";
const ADMIN_PASSWORD = "qWE261898";
const SESSION_KEY = "chernievsky-admin-session";

const loginPanel = document.querySelector("#login-panel");
const adminPanel = document.querySelector("#admin-panel");
const loginForm = document.querySelector("#login-form");
const loginError = document.querySelector("#login-error");
const settingsForm = document.querySelector("#settings-form");
const worksEditor = document.querySelector("#works-editor");
const jsonBox = document.querySelector("#json-box");
const statusLine = document.querySelector("#status");

let currentData = window.PortfolioCMS.getData();

function showAdmin() {
  loginPanel.classList.add("is-hidden");
  adminPanel.classList.remove("is-hidden");
  renderForm();
}

function showLogin() {
  adminPanel.classList.add("is-hidden");
  loginPanel.classList.remove("is-hidden");
}

function setStatus(message) {
  statusLine.textContent = message;
  clearTimeout(setStatus.timer);
  setStatus.timer = setTimeout(() => {
    statusLine.textContent = "";
  }, 3500);
}

function renderForm() {
  settingsForm.logo.value = currentData.logo || "";
  settingsForm.heroPhoto.value = currentData.heroPhoto || "";
  settingsForm.whatsapp.value = currentData.contacts.whatsapp || "";
  settingsForm.telegram.value = currentData.contacts.telegram || "";
  renderWorks();
  renderJson();
}

function renderJson() {
  jsonBox.value = JSON.stringify(readFormData(), null, 2);
}

function renderWorks() {
  worksEditor.replaceChildren(
    ...currentData.works.map((work, index) => {
      const card = document.createElement("article");
      card.className = "work-editor-card";
      card.innerHTML = `
        <div class="card-top">
          <h3>Работа ${index + 1}</h3>
          <button class="danger" type="button" data-remove="${index}">Удалить</button>
        </div>
        <div class="fields">
          <label>Название<input data-field="title" data-index="${index}" value="${escapeAttr(work.title || "")}" /></label>
          <label>Ссылка Behance<input data-field="url" data-index="${index}" value="${escapeAttr(work.url || "")}" /></label>
          <label>Категория UK<input data-field="categoryUk" data-index="${index}" value="${escapeAttr(work.categoryUk || "")}" /></label>
          <label>Категория EN<input data-field="categoryEn" data-index="${index}" value="${escapeAttr(work.categoryEn || "")}" /></label>
          <label>Описание UK<input data-field="descriptionUk" data-index="${index}" value="${escapeAttr(work.descriptionUk || "")}" /></label>
          <label>Описание EN<input data-field="descriptionEn" data-index="${index}" value="${escapeAttr(work.descriptionEn || "")}" /></label>
          <label>
            Визуальный стиль
            <select data-field="media" data-index="${index}">
              ${window.PortfolioCMS.mediaClasses.map((name) => `<option value="${name}" ${name === work.media ? "selected" : ""}>${name}</option>`).join("")}
            </select>
          </label>
        </div>
      `;
      return card;
    })
  );
}

function escapeAttr(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function syncWorkField(target) {
  const index = Number(target.dataset.index);
  const field = target.dataset.field;
  if (!field || Number.isNaN(index)) return;
  currentData.works[index][field] = target.value;
  renderJson();
}

function readFormData() {
  return {
    logo: settingsForm.logo.value.trim(),
    heroPhoto: settingsForm.heroPhoto.value.trim(),
    contacts: {
      whatsapp: settingsForm.whatsapp.value.trim(),
      telegram: settingsForm.telegram.value.trim()
    },
    works: currentData.works.map((work) => ({
      title: work.title || "",
      categoryUk: work.categoryUk || "",
      categoryEn: work.categoryEn || "",
      descriptionUk: work.descriptionUk || "",
      descriptionEn: work.descriptionEn || "",
      url: work.url || "",
      media: work.media || "smile-media"
    }))
  };
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const login = document.querySelector("#login").value.trim();
  const password = document.querySelector("#password").value;

  if (login === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, "yes");
    loginError.textContent = "";
    showAdmin();
    return;
  }

  loginError.textContent = "Неверный логин или пароль.";
});

document.querySelector("#logout").addEventListener("click", () => {
  sessionStorage.removeItem(SESSION_KEY);
  showLogin();
});

settingsForm.addEventListener("input", (event) => {
  if (event.target.dataset.field) syncWorkField(event.target);
  renderJson();
});

settingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  currentData = window.PortfolioCMS.saveData(readFormData());
  renderForm();
  setStatus("Сохранено в браузере. На этой машине сайт уже увидит изменения.");
});

worksEditor.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove]");
  if (!button) return;
  const index = Number(button.dataset.remove);
  currentData.works.splice(index, 1);
  renderWorks();
  renderJson();
});

document.querySelector("#add-work").addEventListener("click", () => {
  currentData.works.push({
    title: "New Behance Project",
    categoryUk: "Новий проєкт",
    categoryEn: "New project",
    descriptionUk: "Короткий опис функціоналу або задачі проєкту.",
    descriptionEn: "Short description of project functionality or goal.",
    url: "https://www.behance.net/ichernievsky",
    media: window.PortfolioCMS.mediaClasses[currentData.works.length % 4]
  });
  renderWorks();
  renderJson();
});

document.querySelector("#export-json").addEventListener("click", () => {
  const data = readFormData();
  jsonBox.value = JSON.stringify(data, null, 2);
  navigator.clipboard?.writeText(jsonBox.value).catch(() => {});
  const blob = new Blob([jsonBox.value], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "portfolio-data.json";
  link.click();
  URL.revokeObjectURL(url);
  setStatus("JSON скачан и скопирован. Загрузи portfolio-data.json рядом с index.html.");
});

document.querySelector("#import-json").addEventListener("click", () => {
  try {
    currentData = window.PortfolioCMS.saveData(JSON.parse(jsonBox.value));
    renderForm();
    setStatus("Импортировано и сохранено.");
  } catch {
    setStatus("JSON не читается. Проверь запятые и кавычки.");
  }
});

document.querySelector("#reset-data").addEventListener("click", () => {
  currentData = window.PortfolioCMS.resetData();
  renderForm();
  setStatus("Данные сброшены к исходным.");
});

if (sessionStorage.getItem(SESSION_KEY) === "yes") {
  showAdmin();
} else {
  showLogin();
}
