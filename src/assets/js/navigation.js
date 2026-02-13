// Navigation, keyboard shortcuts, and command palette

(function () {
  const palette = document.getElementById("command-palette");
  const trigger = document.querySelector(".command-palette-trigger");
  const closeBtn = palette
    ? palette.querySelector(".command-palette-close")
    : null;
  const input = palette
    ? palette.querySelector("#command-input")
    : null;
  const list = palette
    ? palette.querySelector("#command-list")
    : null;

  let lastFocus = null;

  function openPalette() {
    if (!palette || !input) return;
    lastFocus = document.activeElement;
    palette.setAttribute("aria-hidden", "false");
    input.value = "";
    updateSelection(0);
    palette.scrollTop = 0;
    input.focus();
  }

  function closePalette() {
    if (!palette) return;
    palette.setAttribute("aria-hidden", "true");
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  }

  function getOptions() {
    if (!list) return [];
    return Array.from(list.querySelectorAll("li"));
  }

  function updateSelection(index) {
    const options = getOptions();
    options.forEach((opt, i) => {
      opt.setAttribute("aria-selected", i === index ? "true" : "false");
    });
  }

  function navigateToOption(index) {
    const options = getOptions();
    const opt = options[index];
    if (!opt) return;
    const target = opt.getAttribute("data-target");
    if (target) {
      const el = document.querySelector(target);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    closePalette();
  }

  function filterOptions(query) {
    const q = query.trim().toLowerCase();
    const options = getOptions();
    options.forEach((opt) => {
      const text = opt.textContent.toLowerCase();
      const match = !q || text.includes(q);
      opt.style.display = match ? "" : "none";
    });
    // Set selection to first visible option
    const firstVisibleIndex = options.findIndex(
      (opt) => opt.style.display !== "none"
    );
    updateSelection(firstVisibleIndex === -1 ? 0 : firstVisibleIndex);
  }

  // Trigger via button
  if (trigger) {
    trigger.addEventListener("click", openPalette);
  }

  // Keyboard shortcuts: Ctrl+P and Ctrl+K
  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && (event.key === "p" || event.key === "k")) {
      event.preventDefault();
      openPalette();
      return;
    }

    if (palette && palette.getAttribute("aria-hidden") === "false") {
      if (event.key === "Escape") {
        event.preventDefault();
        closePalette();
        return;
      }

      // Handle hidden config commands like :set colors=amber
      if (event.key === "Enter" && input) {
        const value = input.value.trim();
        if (value.startsWith(":")) {
          event.preventDefault();
          if (
            window.sjkThemeConfig &&
            typeof window.sjkThemeConfig.handleCommand === "function"
          ) {
            window.sjkThemeConfig.handleCommand(value);
          }
          if (
            value === ":root" &&
            window.sjkRootAccess &&
            typeof window.sjkRootAccess.registerKey === "function"
          ) {
            window.sjkRootAccess.registerKey("root-command");
          }
          closePalette();
          return;
        }
      }

      const options = getOptions();
      const visibleOptions = options.filter(
        (opt) => opt.style.display !== "none"
      );

      if (!visibleOptions.length) {
        return;
      }

      const currentIndex = options.findIndex(
        (opt) => opt.getAttribute("aria-selected") === "true"
      );
      let visibleIndex = visibleOptions.indexOf(options[currentIndex]);

      if (event.key === "ArrowDown") {
        event.preventDefault();
        visibleIndex = (visibleIndex + 1 + visibleOptions.length) % visibleOptions.length;
        updateSelection(options.indexOf(visibleOptions[visibleIndex]));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        visibleIndex = (visibleIndex - 1 + visibleOptions.length) % visibleOptions.length;
        updateSelection(options.indexOf(visibleOptions[visibleIndex]));
      } else if (event.key === "Enter") {
        event.preventDefault();
        navigateToOption(options.indexOf(visibleOptions[visibleIndex]));
      }
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      closePalette();
    });
  }

  if (input) {
    input.addEventListener("input", () => {
      filterOptions(input.value);
    });
  }

  if (list) {
    list.addEventListener("click", (e) => {
      const li = e.target.closest("li");
      if (!li) return;
      const options = getOptions();
      const index = options.indexOf(li);
      if (index >= 0) {
        navigateToOption(index);
      }
    });
  }

  // Back to top button
  const backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      const threshold = 200;
      if (window.scrollY > threshold) {
        backToTop.classList.add("back-to-top--visible");
      } else {
        backToTop.classList.remove("back-to-top--visible");
      }
    });

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();

