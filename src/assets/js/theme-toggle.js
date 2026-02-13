// Theme toggle + scanlines
// - Respects prefers-color-scheme
// - Persists explicit preference in localStorage
// - Announces changes to screen readers

(function () {
  const STORAGE_KEY = "sjk-theme";
  const SCANLINES_KEY = "sjk-scanlines";

  const html = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const scanlineToggle = document.getElementById("scanline-toggle");
  const themeStatus = document.getElementById("theme-status");

  if (!html || !themeToggle) return;

  const prefersDark = window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)");

  function getSystemTheme() {
    return prefersDark && prefersDark.matches ? "dark" : "light";
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }

  function getStoredScanlines() {
    try {
      return localStorage.getItem(SCANLINES_KEY);
    } catch {
      return null;
    }
  }

  function storeScanlines(state) {
    try {
      localStorage.setItem(SCANLINES_KEY, state);
    } catch {
      // ignore
    }
  }

  function applyTheme(theme, announce) {
    // theme: 'light' | 'dark' | 'auto'
    html.setAttribute("data-theme", theme);

    let effective = theme === "auto" ? getSystemTheme() : theme;
    html.setAttribute("data-effective-theme", effective);

    const isDark = effective === "dark";

    themeToggle.setAttribute("aria-checked", String(isDark));

    if (themeStatus && announce) {
      const msg =
        effective === "dark"
          ? "Theme set to dark CRT mode."
          : "Theme set to light paper mode.";
      themeStatus.textContent = msg;
    }
  }

  function initTheme() {
    const stored = getStoredTheme();
    const initial = stored || "auto";
    applyTheme(initial, false);

    // Listen for system changes if user hasn't forced a theme
    if (!stored && prefersDark && typeof prefersDark.addEventListener === "function") {
      prefersDark.addEventListener("change", () => {
        applyTheme("auto", true);
      });
    }
  }

  function cycleTheme() {
    const current = html.getAttribute("data-theme") || "auto";
    const next = current === "auto" ? "dark" : current === "dark" ? "light" : "auto";
    applyTheme(next, true);

    if (next === "auto") {
      storeTheme("");
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    } else {
      storeTheme(next);
    }
  }

  themeToggle.addEventListener("click", cycleTheme);
  themeToggle.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      cycleTheme();
    }
  });

  // Scanlines toggle
  if (scanlineToggle) {
    function applyScanlines(state, announce) {
      if (state === "on") {
        html.setAttribute("data-scanlines", "on");
        scanlineToggle.setAttribute("aria-pressed", "true");
        if (announce && themeStatus) {
          themeStatus.textContent = "CRT scanlines enabled.";
        }
      } else {
        html.removeAttribute("data-scanlines");
        scanlineToggle.setAttribute("aria-pressed", "false");
        if (announce && themeStatus) {
          themeStatus.textContent = "CRT scanlines disabled.";
        }
      }
    }

    const storedScanlines = getStoredScanlines() || "off";
    applyScanlines(storedScanlines, false);

    function toggleScanlines() {
      const next =
        scanlineToggle.getAttribute("aria-pressed") === "true" ? "off" : "on";
      applyScanlines(next, true);
      storeScanlines(next);
    }

    scanlineToggle.addEventListener("click", toggleScanlines);
    scanlineToggle.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        toggleScanlines();
      }
    });
  }

  initTheme();
})();

