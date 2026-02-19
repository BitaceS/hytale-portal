const CFG_KEY = "portal_cfg_v1";
const LANG_OVERRIDE_PREFIX = "portal_lang_override_";
const OWNER_MODE_KEY = "portal_owner_mode";
const OWNER_CONFIG = window.PORTAL_OWNER_CONFIG || {};
const OWNER_PASSCODE = typeof OWNER_CONFIG.key === "string" ? OWNER_CONFIG.key.trim() : "hytale-owner-portal";
const OWNER_QUERY_PARAM = typeof OWNER_CONFIG.queryParam === "string" && OWNER_CONFIG.queryParam.trim()
  ? OWNER_CONFIG.queryParam.trim()
  : "ownerKey";
const OWNER_SHORTCUT_ENABLED = OWNER_CONFIG.shortcut !== false;
const ASSET_MANIFEST_PATH = "./assets/manifest.json";
const DEFAULT_PANEL_LOGO = "./assets/ui/panel-logo-default.png";
const ENFORCED_STATUS_API_URL = "https://api.bitaces.dev/status.php";

const DEFAULT_CFG = {
  lang: "en",
  title: "Hytale Realm",
  tagline: "Enter the world of adventure, magic and endless creativity.",
  address: "play.example.net",
  players: 685,
  bg: "",
  statusApiUrl: ENFORCED_STATUS_API_URL,
  accent: "#22c1c3",
  accent2: "#2f80ed",
  iconPack: "default",
  panelLogo: DEFAULT_PANEL_LOGO,
  discord: "",
  store: "",
  vote: "",
  joinLink: "",
  footerOverride: ""
};

const LANGUAGE_INPUT_KEYS = [
  "playNow",
  "join",
  "discordTitle",
  "storeTitle",
  "voteTitle",
  "panelTitle",
  "save",
  "reset",
  "refreshStatus",
  "copied",
  "saved",
  "statusOffline",
  "footerDisclaimer"
];

let cfg = { ...DEFAULT_CFG };
let translations = {};
const langCache = {};
let ownerMode = false;
let assetManifest = { backgrounds: [], iconPacks: {} };

const ICON_PACKS = {
  default: {
    discord: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 7.8C8.4 6.9 9.5 6.5 10.3 6.2L10.8 7.2C9.7 7.5 8.9 8 8.1 8.6M17 7.8C15.6 6.9 14.5 6.5 13.7 6.2L13.2 7.2C14.3 7.5 15.1 8 15.9 8.6M6.2 16.8C8.4 18.4 10.7 19 12 19C13.3 19 15.6 18.4 17.8 16.8C18.5 14.6 18.9 12.3 18.8 10C17.2 8.9 15.6 8.2 14 7.8C13.6 8.5 13.3 9.3 13 10.1C12.3 10 11.7 10 11 10.1C10.7 9.3 10.4 8.5 10 7.8C8.4 8.2 6.8 8.9 5.2 10C5.1 12.3 5.5 14.6 6.2 16.8Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="9.5" cy="12.2" r="1" fill="currentColor"/>
      <circle cx="14.5" cy="12.2" r="1" fill="currentColor"/>
    </svg>`,
    store: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 8.5H19L18.2 17.5H5.8L5 8.5ZM8.5 8.5V7.4C8.5 5.8 9.8 4.5 11.4 4.5H12.6C14.2 4.5 15.5 5.8 15.5 7.4V8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M9.5 12.5H14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
    vote: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3.5L14.8 9.2L21 10.1L16.5 14.4L17.6 20.5L12 17.5L6.4 20.5L7.5 14.4L3 10.1L9.2 9.2L12 3.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>`
  },
  fantasy: {
    discord: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3L14.7 6.2L19 6.8L17.5 10.8L18.5 15L14.7 16L12 19L9.3 16L5.5 15L6.5 10.8L5 6.8L9.3 6.2L12 3Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
      <circle cx="9.6" cy="11.2" r="1.1" fill="currentColor"/>
      <circle cx="14.4" cy="11.2" r="1.1" fill="currentColor"/>
      <path d="M9.2 14.2C10 14.9 11 15.2 12 15.2C13 15.2 14 14.9 14.8 14.2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
    </svg>`,
    store: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4.8 9.2L8.2 5H15.8L19.2 9.2L17.8 18.5H6.2L4.8 9.2Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="M9 9.1V7.8C9 6.6 10 5.6 11.2 5.6H12.8C14 5.6 15 6.6 15 7.8V9.1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
      <path d="M10 12.8H14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
    </svg>`,
    vote: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3L14.2 7.8L19.5 8.2L15.4 11.9L16.6 17.2L12 14.6L7.4 17.2L8.6 11.9L4.5 8.2L9.8 7.8L12 3Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="M12 8.8V11.6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
      <circle cx="12" cy="13.7" r="0.9" fill="currentColor"/>
    </svg>`
  },
  pixel: {
    discord: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 5H9V7H11V9H9V11H7V9H5V7H6V5ZM13 7H15V9H13V7ZM16 7H18V9H16V7ZM13 12H18V14H13V12ZM5 15H19V17H5V15ZM7 17H17V19H7V17Z"/>
    </svg>`,
    store: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 4H18V6H20V10H18V19H6V10H4V6H6V4ZM8 6V8H16V6H8ZM8 10V17H16V10H8ZM10 12H14V14H10V12Z"/>
    </svg>`,
    vote: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11 3H13V5H16V7H18V10H16V12H14V14H16V17H14V19H10V17H8V14H10V12H8V10H6V7H8V5H11V3ZM11 7H10V9H8V10H10V12H11V14H10V16H14V14H13V12H14V10H16V9H14V7H13V6H11V7Z"/>
    </svg>`
  }
};

const el = {
  heroBg: document.getElementById("heroBg"),
  serverTitle: document.getElementById("serverTitle"),
  serverTagline: document.getElementById("serverTagline"),
  footerText: document.getElementById("footerText"),
  discordCard: document.getElementById("discordCard"),
  storeCard: document.getElementById("storeCard"),
  voteCard: document.getElementById("voteCard"),
  discordIcon: document.getElementById("discordIcon"),
  storeIcon: document.getElementById("storeIcon"),
  voteIcon: document.getElementById("voteIcon"),
  joinBtn: document.getElementById("joinBtn"),
  addressBtn: document.getElementById("addressBtn"),
  addressText: document.getElementById("addressText"),
  statusDot: document.getElementById("statusDot"),
  statusLabel: document.getElementById("statusLabel"),
  playersLabelText: document.getElementById("playersLabelText"),
  toastWrap: document.getElementById("toastWrap"),
  panelToggle: document.getElementById("panelToggle"),
  panelToggleLogo: document.getElementById("panelToggleLogo"),
  panelClose: document.getElementById("panelClose"),
  configPanel: document.getElementById("configPanel"),
  advancedToggle: document.getElementById("advancedToggle"),
  advancedSettings: document.getElementById("advancedSettings"),
  tabButtons: Array.from(document.querySelectorAll(".tab-btn")),
  tabSettings: document.getElementById("tab-settings"),
  tabLanguage: document.getElementById("tab-language"),
  cfgLang: document.getElementById("cfgLang"),
  cfgTitle: document.getElementById("cfgTitle"),
  cfgTagline: document.getElementById("cfgTagline"),
  cfgAddress: document.getElementById("cfgAddress"),
  cfgBgPreset: document.getElementById("cfgBgPreset"),
  cfgBg: document.getElementById("cfgBg"),
  queryTestBtn: document.getElementById("queryTestBtn"),
  queryTestResult: document.getElementById("queryTestResult"),
  cfgAccent: document.getElementById("cfgAccent"),
  cfgAccent2: document.getElementById("cfgAccent2"),
  cfgIconPack: document.getElementById("cfgIconPack"),
  cfgDiscord: document.getElementById("cfgDiscord"),
  cfgStore: document.getElementById("cfgStore"),
  cfgVote: document.getElementById("cfgVote"),
  cfgJoinLink: document.getElementById("cfgJoinLink"),
  cfgPanelLogo: document.getElementById("cfgPanelLogo"),
  cfgFooterOverride: document.getElementById("cfgFooterOverride"),
  saveCfgBtn: document.getElementById("saveCfgBtn"),
  resetCfgBtn: document.getElementById("resetCfgBtn"),
  refreshStatusBtn: document.getElementById("refreshStatusBtn"),
  langEditorSelect: document.getElementById("langEditorSelect"),
  langEditorJson: document.getElementById("langEditorJson"),
  saveLangOverrideBtn: document.getElementById("saveLangOverrideBtn"),
  resetLangOverrideBtn: document.getElementById("resetLangOverrideBtn"),
  langInputs: Array.from(document.querySelectorAll("[data-lang-key]"))
};

function mergeTranslations(base, override) {
  return { ...(base || {}), ...(override || {}) };
}

function loadCfg() {
  try {
    const raw = localStorage.getItem(CFG_KEY);
    if (!raw) {
      cfg = { ...DEFAULT_CFG };
      cfg.statusApiUrl = ENFORCED_STATUS_API_URL;
      return cfg;
    }
    const parsed = JSON.parse(raw);
    cfg = { ...DEFAULT_CFG, ...(parsed || {}) };
    cfg.statusApiUrl = ENFORCED_STATUS_API_URL;
  } catch (error) {
    cfg = { ...DEFAULT_CFG };
    cfg.statusApiUrl = ENFORCED_STATUS_API_URL;
  }
  return cfg;
}

function saveCfg() {
  localStorage.setItem(CFG_KEY, JSON.stringify(cfg));
}

function hexToRgb(hex) {
  const normalized = String(hex || "")
    .trim()
    .replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return "34, 193, 195";
  }
  const n = Number.parseInt(normalized, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `${r}, ${g}, ${b}`;
}

function applyThemeColors() {
  const accent = cfg.accent || DEFAULT_CFG.accent;
  const accent2 = cfg.accent2 || DEFAULT_CFG.accent2;
  document.documentElement.style.setProperty("--accent", accent);
  document.documentElement.style.setProperty("--accent2", accent2);
  document.documentElement.style.setProperty("--accent-rgb", hexToRgb(accent));
  document.documentElement.style.setProperty("--accent2-rgb", hexToRgb(accent2));
}

function normalizeAssetPath(pathValue) {
  if (!pathValue) {
    return "";
  }
  if (/^(https?:)?\/\//i.test(pathValue) || pathValue.startsWith("./") || pathValue.startsWith("/")) {
    return pathValue;
  }
  return `./${pathValue.replace(/^\/+/, "")}`;
}

function createAssetIconMarkup(pathValue) {
  const safePath = normalizeAssetPath(pathValue);
  return `<img src="${safePath}" alt="" loading="lazy" decoding="async" draggable="false" />`;
}

function getBackgroundByPath(pathValue) {
  return assetManifest.backgrounds.find((item) => item.path === pathValue);
}

function updateBackgroundCustomOptionLabel() {
  const customOption = el.cfgBgPreset.querySelector('option[value="__custom__"]');
  if (customOption) {
    customOption.textContent = t("bgPresetCustom");
  }
}

function populateBackgroundPresetOptions() {
  el.cfgBgPreset.innerHTML = "";
  const customOption = document.createElement("option");
  customOption.value = "__custom__";
  customOption.textContent = t("bgPresetCustom");
  el.cfgBgPreset.appendChild(customOption);

  assetManifest.backgrounds.forEach((bg) => {
    const option = document.createElement("option");
    option.value = bg.path;
    option.textContent = bg.label || bg.id || bg.path;
    el.cfgBgPreset.appendChild(option);
  });
}

function populateIconPackOptions() {
  const previous = cfg.iconPack || DEFAULT_CFG.iconPack;
  el.cfgIconPack.innerHTML = "";
  Object.keys(ICON_PACKS).forEach((packName) => {
    const option = document.createElement("option");
    option.value = packName;

    const i18nKey = `iconPack${packName.charAt(0).toUpperCase()}${packName.slice(1)}`;
    option.textContent = t(i18nKey) !== i18nKey ? t(i18nKey) : packName;
    el.cfgIconPack.appendChild(option);
  });

  if (ICON_PACKS[previous]) {
    el.cfgIconPack.value = previous;
  } else {
    el.cfgIconPack.value = DEFAULT_CFG.iconPack;
  }
}

function registerManifestAssets(manifest) {
  assetManifest = {
    backgrounds: Array.isArray(manifest.backgrounds)
      ? manifest.backgrounds
          .filter((item) => item && item.path)
          .map((item) => ({
            id: item.id || item.label || item.path,
            label: item.label || item.id || item.path,
            path: normalizeAssetPath(item.path)
          }))
      : [],
    iconPacks: manifest.iconPacks && typeof manifest.iconPacks === "object" ? manifest.iconPacks : {}
  };

  Object.entries(assetManifest.iconPacks).forEach(([packName, pack]) => {
    if (!pack || !pack.discord || !pack.store || !pack.vote) {
      return;
    }
    ICON_PACKS[packName] = {
      type: "asset",
      discord: normalizeAssetPath(pack.discord),
      store: normalizeAssetPath(pack.store),
      vote: normalizeAssetPath(pack.vote)
    };
  });
}

async function loadAssetManifest() {
  try {
    const response = await fetch(ASSET_MANIFEST_PATH, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("manifest not found");
    }
    const data = await response.json();
    registerManifestAssets(data || {});
  } catch (error) {
    registerManifestAssets({});
  }
}

function applyIconPack(packName) {
  const resolvedPackName = ICON_PACKS[packName] ? packName : "default";
  const pack = ICON_PACKS[resolvedPackName];
  document.body.dataset.iconPack = resolvedPackName;
  if (pack.type === "asset") {
    el.discordIcon.innerHTML = createAssetIconMarkup(pack.discord);
    el.storeIcon.innerHTML = createAssetIconMarkup(pack.store);
    el.voteIcon.innerHTML = createAssetIconMarkup(pack.vote);
  } else {
    el.discordIcon.innerHTML = pack.discord;
    el.storeIcon.innerHTML = pack.store;
    el.voteIcon.innerHTML = pack.vote;
  }
}

function applyCfg() {
  applyThemeColors();

  el.serverTitle.textContent = cfg.title;
  el.serverTagline.textContent = cfg.tagline;
  el.addressText.textContent = cfg.address || DEFAULT_CFG.address;

  el.discordCard.href = cfg.discord || "#";
  el.storeCard.href = cfg.store || "#";
  el.voteCard.href = cfg.vote || "#";
  el.joinBtn.href = cfg.joinLink || "#";
  el.panelToggleLogo.src = normalizeAssetPath(cfg.panelLogo || DEFAULT_PANEL_LOGO);
  applyIconPack(cfg.iconPack);

  if (cfg.bg) {
    el.heroBg.style.backgroundImage = `url("${cfg.bg}")`;
  } else {
    el.heroBg.style.backgroundImage =
      'url("https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=2200&q=80")';
  }

  if (cfg.footerOverride && cfg.footerOverride.trim()) {
    el.footerText.textContent = cfg.footerOverride.trim();
  } else {
    el.footerText.textContent = t("footerDisclaimer");
  }
}

function loadOverrides(lang) {
  try {
    const raw = localStorage.getItem(`${LANG_OVERRIDE_PREFIX}${lang}`);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    return {};
  }
}

async function loadLanguageFile(lang) {
  if (langCache[lang]) {
    return langCache[lang];
  }
  const response = await fetch(`./lang/${lang}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load language file: ${lang}`);
  }
  const data = await response.json();
  langCache[lang] = data;
  return data;
}

async function loadLanguage() {
  const base = await loadLanguageFile(cfg.lang);
  const overrides = loadOverrides(cfg.lang);
  translations = mergeTranslations(base, overrides);
}

function t(key) {
  return translations[key] ?? key;
}

function openConfigPanel() {
  el.configPanel.classList.add("open");
  el.configPanel.setAttribute("aria-hidden", "false");
}

function closeConfigPanel() {
  el.configPanel.classList.remove("open");
  el.configPanel.setAttribute("aria-hidden", "true");
}

function removeOwnerParamsFromUrl(params) {
  const next = new URLSearchParams(params);
  next.delete(OWNER_QUERY_PARAM);
  next.delete("owner");
  const qs = next.toString();
  const nextUrl = `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash || ""}`;
  window.history.replaceState({}, "", nextUrl);
}

function evaluateOwnerAccess() {
  const params = new URLSearchParams(window.location.search);
  const ownerToggle = params.get("owner");
  const ownerKeyFromQuery = params.get(OWNER_QUERY_PARAM);

  if (ownerToggle === "0" || ownerToggle === "off" || ownerToggle === "false") {
    ownerMode = false;
    localStorage.removeItem(OWNER_MODE_KEY);
    removeOwnerParamsFromUrl(params);
    return;
  }

  if ((ownerToggle === "1" || ownerToggle === "on" || ownerToggle === "true") && ownerKeyFromQuery === OWNER_PASSCODE) {
    localStorage.setItem(OWNER_MODE_KEY, "1");
    ownerMode = true;
    removeOwnerParamsFromUrl(params);
    return;
  }

  if (ownerKeyFromQuery && ownerKeyFromQuery === OWNER_PASSCODE) {
    localStorage.setItem(OWNER_MODE_KEY, "1");
    ownerMode = true;
    removeOwnerParamsFromUrl(params);
  } else {
    ownerMode = localStorage.getItem(OWNER_MODE_KEY) === "1";
  }
}

function updateOwnerUiState() {
  el.panelToggle.hidden = !ownerMode;
  el.panelToggle.classList.toggle("locked", !ownerMode);
  el.panelToggle.setAttribute("title", ownerMode ? "Owner mode enabled" : "Owner panel locked");
  if (!ownerMode) {
    closeConfigPanel();
  }
}

function requestOwnerAccess() {
  const entered = window.prompt("Owner key:");
  if (!entered) {
    return false;
  }
  if (entered === OWNER_PASSCODE) {
    ownerMode = true;
    localStorage.setItem(OWNER_MODE_KEY, "1");
    updateOwnerUiState();
    openConfigPanel();
    showToast(t("ownerAccessGranted"));
    return true;
  }
  showToast(t("ownerAccessDenied"));
  return false;
}

function requireOwnerAccess() {
  if (ownerMode) {
    return true;
  }
  showToast(t("ownerAccessRequired"));
  return false;
}

function applyTranslations() {
  document.documentElement.lang = cfg.lang;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  updateBackgroundCustomOptionLabel();
  populateIconPackOptions();
  updateAdvancedToggleLabel();

  if (cfg.footerOverride && cfg.footerOverride.trim()) {
    el.footerText.textContent = cfg.footerOverride.trim();
  }

  setStatus({
    online: !el.statusDot.classList.contains("offline"),
    players: 0,
    address: el.addressText.textContent || cfg.address
  });
}

function setStatus(data) {
  const online = !!data.online;
  const players = Number.isFinite(Number(data.players)) ? Number(data.players) : 0;
  const address = data.address || cfg.address || DEFAULT_CFG.address;

  el.statusDot.classList.toggle("online", online);
  el.statusDot.classList.toggle("offline", !online);
  el.statusLabel.textContent = online ? t("onlineLabel") : t("offlineLabel");
  el.playersLabelText.textContent = (t("playersOnlinePattern") || "{players} players online").replace(
    "{players}",
    String(players)
  );
  el.addressText.textContent = address;
}

function parseServerHost(address) {
  if (!address) {
    return "";
  }
  return String(address).trim().replace(/^https?:\/\//i, "").split(":")[0].split("/")[0];
}

function parseStatusPayload(data) {
  if (!data || typeof data !== "object") {
    return {
      online: false,
      players: 0,
      address: cfg.address,
      playersKnown: false
    };
  }

  let playersValue = data.players;
  if (playersValue && typeof playersValue === "object") {
    if (Number.isFinite(Number(playersValue.online))) {
      playersValue = Number(playersValue.online);
    } else {
      playersValue = 0;
    }
  }

  return {
    online: typeof data.online === "boolean" ? data.online : Number(data.players || 0) > 0,
    players: Number.isFinite(Number(playersValue)) ? Number(playersValue) : 0,
    address: data.address || cfg.address,
    playersKnown: data.playersKnown === false ? false : true
  };
}

function isAdvancedOpen() {
  return el.advancedSettings.classList.contains("open");
}

function updateAdvancedToggleLabel() {
  el.advancedToggle.textContent = isAdvancedOpen() ? t("advancedToggleHide") : t("advancedToggle");
}

function parseServerEndpoint(addressValue) {
  const raw = String(addressValue || "")
    .trim()
    .replace(/^[a-z]+:\/\//i, "")
    .split("/")[0];

  if (!raw) {
    return null;
  }

  let host = raw;
  let port = 5521;

  if (raw.startsWith("[")) {
    const closeIdx = raw.indexOf("]");
    if (closeIdx === -1) {
      return null;
    }
    host = raw.slice(1, closeIdx);
    const portPart = raw.slice(closeIdx + 1);
    if (portPart.startsWith(":")) {
      const parsedPort = Number.parseInt(portPart.slice(1), 10);
      if (!Number.isFinite(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
        return null;
      }
      port = parsedPort;
    }
  } else if (raw.includes(":")) {
    const parts = raw.split(":");
    if (parts.length !== 2) {
      return null;
    }
    host = parts[0];
    const parsedPort = Number.parseInt(parts[1], 10);
    if (!Number.isFinite(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
      return null;
    }
    port = parsedPort;
  }

  const domainLike = /^[a-z0-9.-]+$/i.test(host);
  const ipv4Like = /^(?:\d{1,3}\.){3}\d{1,3}$/.test(host);
  const ipv6Like = /^[0-9a-f:]+$/i.test(host);
  if (!domainLike && !ipv4Like && !ipv6Like) {
    return null;
  }

  return { host, port };
}

function setQueryTestResult(status, message) {
  const className = status === "ok" || status === "warn" || status === "error" ? status : "neutral";
  el.queryTestResult.classList.remove("ok", "warn", "error", "neutral");
  el.queryTestResult.classList.add(className);
  el.queryTestResult.textContent = message;
}

async function fetchStatusFromCentralApi() {
  const apiUrl = ENFORCED_STATUS_API_URL;
  const endpoint = parseServerEndpoint(cfg.address);
  if (!apiUrl || !endpoint) {
    throw new Error("Missing status API or server endpoint");
  }
  const separator = apiUrl.includes("?") ? "&" : "?";
  const url = `${apiUrl}${separator}host=${encodeURIComponent(endpoint.host)}&port=${encodeURIComponent(endpoint.port)}`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Central status API failed");
  }
  return response.json();
}

async function runQueryDiagnostics() {
  const apiUrl = ENFORCED_STATUS_API_URL;
  const address = (el.cfgAddress.value || cfg.address || "").trim();
  const endpoint = parseServerEndpoint(address);
  if (!apiUrl || !endpoint) {
    setQueryTestResult("error", t("queryTestInvalid"));
    return;
  }

  setQueryTestResult("neutral", t("queryTestRunning"));

  try {
    const separator = apiUrl.includes("?") ? "&" : "?";
    const response = await fetch(
      `${apiUrl}${separator}host=${encodeURIComponent(endpoint.host)}&port=${encodeURIComponent(endpoint.port)}`,
      { cache: "no-store" }
    );
    if (!response.ok) {
      setQueryTestResult("error", t("queryTestBridgeError"));
      return;
    }
    const data = await response.json();

    const status = parseStatusPayload(data);
    if (status.online || status.players >= 0) {
      setQueryTestResult("ok", t("queryTestOk"));
      return;
    }
    setQueryTestResult("warn", t("queryTestUnsupported"));
  } catch (error) {
    setQueryTestResult("error", t("queryTestBridgeError"));
  }
}

async function fetchStatus() {
  if (!parseServerEndpoint(cfg.address)) {
    setStatus({
      online: true,
      players: 0,
      address: cfg.address
    });
    return;
  }

  try {
    const status = parseStatusPayload(await fetchStatusFromCentralApi());
    setStatus(status);
    showToast(t("refreshed"));
  } catch (error) {
    setStatus({
      online: false,
      players: 0,
      address: cfg.address
    });
    showToast(t("statusOffline"));
  }
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  el.toastWrap.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 2200);
}

async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
    showToast(t("copied"));
  } catch (error) {
    const textArea = document.createElement("textarea");
    textArea.value = value;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
    showToast(t("copied"));
  }
}

function activateTab(tabName) {
  el.tabButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tabName);
  });
  el.tabSettings.classList.toggle("active", tabName === "settings");
  el.tabLanguage.classList.toggle("active", tabName === "language");
}

function fillPanel() {
  el.cfgLang.value = cfg.lang;
  el.cfgTitle.value = cfg.title;
  el.cfgTagline.value = cfg.tagline;
  el.cfgAddress.value = cfg.address;
  el.cfgBg.value = cfg.bg;
  const selectedBg = getBackgroundByPath(cfg.bg);
  el.cfgBgPreset.value = selectedBg ? selectedBg.path : "__custom__";
  el.cfgAccent.value = cfg.accent;
  el.cfgAccent2.value = cfg.accent2;
  el.cfgIconPack.value = ICON_PACKS[cfg.iconPack] ? cfg.iconPack : DEFAULT_CFG.iconPack;
  el.cfgDiscord.value = cfg.discord;
  el.cfgStore.value = cfg.store;
  el.cfgVote.value = cfg.vote;
  el.cfgJoinLink.value = cfg.joinLink;
  el.cfgPanelLogo.value = cfg.panelLogo || DEFAULT_PANEL_LOGO;
  el.cfgFooterOverride.value = cfg.footerOverride;
}

function readPanel() {
  const selectedBgValue = el.cfgBgPreset.value && el.cfgBgPreset.value !== "__custom__" ? el.cfgBgPreset.value : "";
  const finalBg = selectedBgValue || el.cfgBg.value.trim();

  cfg = {
    ...cfg,
    lang: el.cfgLang.value,
    title: el.cfgTitle.value.trim() || DEFAULT_CFG.title,
    tagline: el.cfgTagline.value.trim() || DEFAULT_CFG.tagline,
    address: el.cfgAddress.value.trim() || DEFAULT_CFG.address,
    players: Number(cfg.players) || DEFAULT_CFG.players,
    bg: finalBg,
    statusApiUrl: ENFORCED_STATUS_API_URL,
    accent: el.cfgAccent.value || DEFAULT_CFG.accent,
    accent2: el.cfgAccent2.value || DEFAULT_CFG.accent2,
    iconPack: el.cfgIconPack.value || DEFAULT_CFG.iconPack,
    discord: el.cfgDiscord.value.trim(),
    store: el.cfgStore.value.trim(),
    vote: el.cfgVote.value.trim(),
    joinLink: el.cfgJoinLink.value.trim(),
    panelLogo: el.cfgPanelLogo.value.trim() || DEFAULT_PANEL_LOGO,
    footerOverride: el.cfgFooterOverride.value.trim()
  };
}

function savePanelDraft({ applyVisuals = true } = {}) {
  if (!ownerMode) {
    return;
  }
  readPanel();
  saveCfg();
  if (applyVisuals) {
    applyCfg();
  }
}

async function fillLanguageEditor() {
  const lang = el.langEditorSelect.value;
  const base = await loadLanguageFile(lang);
  const override = loadOverrides(lang);
  const merged = mergeTranslations(base, override);

  el.langInputs.forEach((input) => {
    const key = input.dataset.langKey;
    input.value = merged[key] ?? "";
  });
  el.langEditorJson.value = JSON.stringify(merged, null, 2);
}

async function saveLanguageOverrides() {
  if (!requireOwnerAccess()) {
    return;
  }

  const lang = el.langEditorSelect.value;
  const base = await loadLanguageFile(lang);
  let parsedJson = {};

  try {
    parsedJson = JSON.parse(el.langEditorJson.value || "{}");
  } catch (error) {
    showToast(t("invalidJson"));
    return;
  }

  const edited = mergeTranslations(base, parsedJson);
  el.langInputs.forEach((input) => {
    const key = input.dataset.langKey;
    if (input.value.trim()) {
      edited[key] = input.value.trim();
    }
  });

  localStorage.setItem(`${LANG_OVERRIDE_PREFIX}${lang}`, JSON.stringify(edited));
  showToast(t("saved"));
  await fillLanguageEditor();

  if (lang === cfg.lang) {
    await loadLanguage();
    applyTranslations();
    applyCfg();
  }
}

async function resetLanguageOverrides() {
  if (!requireOwnerAccess()) {
    return;
  }

  const lang = el.langEditorSelect.value;
  localStorage.removeItem(`${LANG_OVERRIDE_PREFIX}${lang}`);
  showToast(t("resetDone"));
  await fillLanguageEditor();

  if (lang === cfg.lang) {
    await loadLanguage();
    applyTranslations();
    applyCfg();
  }
}

function bindPanelEvents() {
  el.panelToggle.addEventListener("click", () => {
    if (!ownerMode && !requestOwnerAccess()) {
      return;
    }
    openConfigPanel();
  });

  el.panelClose.addEventListener("click", () => {
    closeConfigPanel();
  });

  el.tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      activateTab(btn.dataset.tab);
    });
  });

  el.advancedToggle.addEventListener("click", () => {
    if (!requireOwnerAccess()) {
      return;
    }
    el.advancedSettings.classList.toggle("open");
    updateAdvancedToggleLabel();
  });

  el.saveCfgBtn.addEventListener("click", async () => {
    if (!requireOwnerAccess()) {
      return;
    }
    readPanel();
    saveCfg();
    await loadLanguage();
    applyTranslations();
    applyCfg();
    await fetchStatus();
    await fillLanguageEditor();
    showToast(t("saved"));
  });

  el.resetCfgBtn.addEventListener("click", async () => {
    if (!requireOwnerAccess()) {
      return;
    }
    cfg = { ...DEFAULT_CFG };
    saveCfg();
    fillPanel();
    await loadLanguage();
    applyTranslations();
    applyCfg();
    await fetchStatus();
    await fillLanguageEditor();
    showToast(t("resetDone"));
  });

  el.refreshStatusBtn.addEventListener("click", async () => {
    if (!requireOwnerAccess()) {
      return;
    }
    savePanelDraft({ applyVisuals: true });
    await fetchStatus();
  });

  el.cfgLang.addEventListener("change", async () => {
    if (!requireOwnerAccess()) {
      return;
    }
    readPanel();
    saveCfg();
    await loadLanguage();
    applyTranslations();
    applyCfg();
    await fillLanguageEditor();
  });

  el.cfgBgPreset.addEventListener("change", () => {
    if (!requireOwnerAccess()) {
      return;
    }
    const selected = el.cfgBgPreset.value;
    if (selected && selected !== "__custom__") {
      el.cfgBg.value = selected;
    }
    savePanelDraft({ applyVisuals: true });
  });

  el.cfgIconPack.addEventListener("change", () => {
    if (!requireOwnerAccess()) {
      return;
    }
    applyIconPack(el.cfgIconPack.value);
    savePanelDraft({ applyVisuals: false });
  });

  const autoSaveIds = [
    "cfgTitle",
    "cfgTagline",
    "cfgAddress",
    "cfgBg",
    "cfgAccent",
    "cfgAccent2",
    "cfgDiscord",
    "cfgStore",
    "cfgVote",
    "cfgJoinLink",
    "cfgPanelLogo",
    "cfgFooterOverride"
  ];
  autoSaveIds.forEach((id) => {
    const node = document.getElementById(id);
    if (!node) {
      return;
    }
    node.addEventListener("change", () => {
      if (!ownerMode) {
        return;
      }
      savePanelDraft({ applyVisuals: true });
    });
    node.addEventListener("blur", () => {
      if (!ownerMode) {
        return;
      }
      savePanelDraft({ applyVisuals: true });
    });
  });

  el.queryTestBtn.addEventListener("click", async () => {
    if (!requireOwnerAccess()) {
      return;
    }
    await runQueryDiagnostics();
  });

  el.langEditorSelect.addEventListener("change", async () => {
    await fillLanguageEditor();
  });

  el.saveLangOverrideBtn.addEventListener("click", async () => {
    await saveLanguageOverrides();
  });

  el.resetLangOverrideBtn.addEventListener("click", async () => {
    await resetLanguageOverrides();
  });
}

function bindUiEvents() {
  el.addressBtn.addEventListener("click", () => {
    copyText(el.addressText.textContent.trim());
  });
}

function bindMotionEffects() {
  const cards = Array.from(document.querySelectorAll(".link-card"));
  cards.forEach((card, idx) => {
    card.style.setProperty("--card-delay", `${idx * 120}ms`);
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((centerY - y) / centerY) * 5;
      const rotateY = ((x - centerX) / centerX) * 6;
      card.style.transform = `translateY(-6px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

function bindOwnerUnlockShortcut() {
  if (!OWNER_SHORTCUT_ENABLED) {
    return;
  }
  window.addEventListener("keydown", (event) => {
    const hasPrimaryKey = event.ctrlKey || event.metaKey;
    const isUnlockCombo = hasPrimaryKey && event.shiftKey && event.key.toLowerCase() === "o";
    if (!isUnlockCombo) {
      return;
    }
    event.preventDefault();
    requestOwnerAccess();
  });
}

async function init() {
  loadCfg();
  evaluateOwnerAccess();
  await loadAssetManifest();
  await loadLanguage();
  populateBackgroundPresetOptions();
  populateIconPackOptions();
  applyTranslations();
  applyCfg();
  fillPanel();
  updateOwnerUiState();
  bindPanelEvents();
  bindUiEvents();
  bindMotionEffects();
  bindOwnerUnlockShortcut();
  await fillLanguageEditor();
  await fetchStatus();
  setQueryTestResult("neutral", t("queryTestIdle"));
}

init();
