(function () {
  const STORAGE_KEY = "sjk-root-keys";
  const REQUIRED_KEYS = 5;

  function loadKeys() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveKeys(keys) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
    } catch {
      // ignore
    }
  }

  const keys = new Set(loadKeys());

  const accessLevelEl = document.getElementById("access-level");
  const rootSection = document.getElementById("root-access");

  function renderAccess() {
    if (!accessLevelEl) return;
    const count = keys.size;
    const totalBlocks = 10;
    const filledBlocks = Math.max(
      0,
      Math.min(totalBlocks, Math.round((count / REQUIRED_KEYS) * totalBlocks))
    );
    const bar = "▰".repeat(filledBlocks) + "▱".repeat(totalBlocks - filledBlocks);
    accessLevelEl.textContent = `ACCESS LEVEL: ${bar} ${count}/${REQUIRED_KEYS} KEYS`;

    if (rootSection && count >= REQUIRED_KEYS) {
      rootSection.hidden = false;
    }
  }

  function registerKey(id) {
    if (!id) return;
    if (!keys.has(id)) {
      keys.add(id);
      saveKeys(Array.from(keys));
      renderAccess();
    }
  }

  // Expose for other modules (e.g. secret commands)
  window.sjkRootAccess = {
    registerKey,
  };

  // Attach listeners to key elements
  document.querySelectorAll("[data-key]").forEach((el) => {
    const id = el.getAttribute("data-key");
    if (!id) return;
    if (el.getAttribute("data-key-hover") === "true") {
      el.addEventListener("mouseenter", () => registerKey(id), { once: true });
    } else {
      el.addEventListener("click", () => registerKey(id));
    }
  });

  // Also reward first time scanlines enabled
  const scanToggle = document.getElementById("scanline-toggle");
  if (scanToggle) {
    scanToggle.addEventListener("click", () => {
      if (scanToggle.getAttribute("aria-pressed") === "true") {
        registerKey("scanlines");
      }
    });
  }

  renderAccess();
})();

