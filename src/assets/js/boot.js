// Boot / loading screen with terminal-style sequence
// - Shows once, then caches completion in localStorage
// - Respects prefers-reduced-motion and can be skipped

(function () {
  const BOOT_KEY = "sjk-boot-complete";

  const bootScreen = document.getElementById("boot-screen");
  const bootLog = document.getElementById("boot-log");
  const skipBtn = document.getElementById("boot-skip");

  if (!bootScreen || !bootLog) return;

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function hideBoot(immediate) {
    try {
      localStorage.setItem(BOOT_KEY, "1");
    } catch {
      // ignore
    }

    if (immediate) {
      bootScreen.classList.add("boot-screen--hidden");
      return;
    }

    bootScreen.classList.add("boot-screen--hidden");
  }

  function shouldSkipAnimation() {
    try {
      return localStorage.getItem(BOOT_KEY) === "1";
    } catch {
      return false;
    }
  }

  // If user already saw intro or prefers reduced motion, skip animation.
  if (prefersReducedMotion || shouldSkipAnimation()) {
    hideBoot(true);
    return;
  }

  const lines = [
    "VERTEX-OS v0.3  (c) SAURAV JYOTI KALITA",
    "CPU CHECK        ............... OK",
    "MEMORY MAP       ............... OK",
    "DISK /dev/projects             OK",
    "MOUNT /var/projects            OK",
    "LOAD profile:saurav            OK",
    "INIT dev-infra toolchain       OK",
    "",
    "HANDOFF -> UI                  READY"
  ];

  let lineIndex = 0;
  let charIndex = 0;
  let currentLine = "";

  function step() {
    const line = lines[lineIndex];
    if (typeof line !== "string") {
      hideBoot(false);
      return;
    }

    if (charIndex <= line.length) {
      currentLine = line.slice(0, charIndex);
      const previous = lines.slice(0, lineIndex).join("\n");
      bootLog.textContent =
        (previous ? previous + "\n" : "") + currentLine + "█";
      charIndex += 1;
      setTimeout(step, 25);
    } else {
      // Move to next line
      lineIndex += 1;
      charIndex = 0;

      if (lineIndex >= lines.length) {
        // Final pause, then hide
        setTimeout(() => hideBoot(false), 400);
      } else {
        setTimeout(step, 120);
      }
    }
  }

  if (skipBtn) {
    skipBtn.addEventListener("click", () => hideBoot(true));
    skipBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        hideBoot(true);
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      hideBoot(true);
    }
  });

  step();
})();

