(function () {
  const STORAGE_KEY = "sjk-theme-config";
  const html = document.documentElement;
  const themeStatus = document.getElementById("theme-status");

  function loadConfig() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }

  function saveConfig(cfg) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
    } catch {
      // ignore
    }
  }

  const config = loadConfig();

  function applyColors(value) {
    const v = (value || "").toLowerCase();
    let color = "#00ff00";
    if (v === "amber") color = "#ffb000";
    else if (v === "white") color = "#f8f8f8";
    else if (v === "blue") color = "#00ccff";

    html.style.setProperty("--color-accent", color);
    html.style.setProperty("--color-terminal-green", color);
    config.colors = v || "green";
  }

  function applyBloom(value) {
    const v = (value || "").toLowerCase();
    const level = v === "high" || v === "medium" || v === "low" ? v : "medium";
    html.setAttribute("data-bloom", level);
    config.bloom = level;
  }

  function applyMode(value) {
    const v = (value || "").toLowerCase();
    if (v === "dirty") {
      html.setAttribute("data-terminal-mode", "dirty");
      // also ensure scanlines are on for full effect
      html.setAttribute("data-scanlines", "on");
    } else {
      html.removeAttribute("data-terminal-mode");
    }
    config.mode = v || "clean";
  }

  // Apply existing config on load
  if (config.colors) applyColors(config.colors);
  if (config.bloom) applyBloom(config.bloom);
  if (config.mode) applyMode(config.mode);

  function announceSaved() {
    if (themeStatus) {
      themeStatus.textContent = "CONFIG SAVED TO NVRAM.";
    }
  }

  function handleCommand(raw) {
    if (!raw || raw[0] !== ":") return false;
    const trimmed = raw.trim();
    if (!trimmed.startsWith(":set")) return false;

    const argString = trimmed.slice(4).trim(); // after ":set"
    if (!argString) return false;

    // Simple parser: colors=amber, bloom=high, mode=dirty
    const parts = argString.split(/\s+/);
    parts.forEach((part) => {
      const [key, valueRaw] = part.split("=");
      if (!key || !valueRaw) return;
      const value = valueRaw.replace(/[\[\]]/g, "");
      const k = key.toLowerCase();
      if (k === "colors" || k === "color") {
        applyColors(value);
      } else if (k === "bloom") {
        applyBloom(value);
      } else if (k === "mode" || k === "terminal") {
        applyMode(value);
      }
    });

    saveConfig(config);
    announceSaved();
    return true;
  }

  window.sjkThemeConfig = {
    handleCommand,
  };
})();

