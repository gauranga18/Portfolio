(function () {
  const cpuBarEl = document.getElementById("sys-cpu-bar");
  const cpuTextEl = document.getElementById("sys-cpu-text");
  const memTextEl = document.getElementById("sys-mem-text");
  const uptimeEl = document.getElementById("sys-uptime");
  const connEl = document.getElementById("sys-connections");

  if (!cpuBarEl || !cpuTextEl || !memTextEl || !uptimeEl || !connEl) {
    return;
  }

  const SESSION_KEY = "sjk-session-start";

  let start = Date.now();
  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed)) {
        start = parsed;
      }
    } else {
      sessionStorage.setItem(SESSION_KEY, String(start));
    }
  } catch {
    // ignore
  }

  let cpu = 40 + Math.random() * 20;
  let memUsed = 4 + Math.random() * 2; // MB
  let connections = 2 + Math.floor(Math.random() * 3);

  function barForPercent(percent) {
    const blocks = 10;
    const filled = Math.round((percent / 100) * blocks);
    const full = "▰".repeat(Math.min(blocks, filled));
    const empty = "▱".repeat(Math.max(0, blocks - filled));
    return full + empty;
  }

  function formatUptime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  function update() {
    // random walks for pseudo metrics
    cpu += (Math.random() - 0.5) * 10;
    cpu = Math.max(5, Math.min(98, cpu));

    memUsed += (Math.random() - 0.5) * 0.2;
    memUsed = Math.max(3.2, Math.min(7.5, memUsed));

    if (Math.random() < 0.1) {
      connections += Math.random() < 0.5 ? -1 : 1;
      connections = Math.max(1, Math.min(5, connections));
    }

    const now = Date.now();
    const uptime = now - start;

    cpuBarEl.textContent = barForPercent(cpu);
    cpuTextEl.textContent = ` ${Math.round(cpu)}%`;
    memTextEl.textContent = `PROJECT LOAD: ${memUsed.toFixed(1)}MB / 8MB`;

    uptimeEl.textContent = formatUptime(uptime);

    const labels = ["human", "bot", "recruiter", "peer"];
    const active = [];
    for (let i = 0; i < Math.min(connections, labels.length); i++) {
      active.push(labels[i]);
    }
    connEl.textContent = `${connections} (${active.join(", ")})`;
  }

  update();
  setInterval(update, 1000);
})();

