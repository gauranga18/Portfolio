window.addEventListener("load", () => {
  // === Boot Message ===
  const msg = [
    "Vertex OS v0.1 booting...",
    "Loading modules...",
    "Access granted ✅",
    "Welcome, Stranger."
  ];
  let i = 0;

  function nextLine() {
    if (i < msg.length) {
      console.log(msg[i]);
      i++;
      setTimeout(nextLine, 600);
    }
  }
  nextLine();

  // === Time-based Greeting ===
  const greetingEl = document.getElementById("greeting");
  const now = new Date();
  const currentHour = now.getHours();
  let greeting = "Hello";

  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Good Morning, Traveller ☀️";
  } else if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good Afternoon, Traveller 🌿";
  } else if (currentHour >= 17 && currentHour < 21) {
    greeting = "Good Evening, Traveller 🌇";
  } else {
    greeting = "How was your day? 🌙";
  }
  if (greetingEl) greetingEl.textContent = greeting;
});

// === Hamburger Menu Toggle ===
function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

// === Scroll Progress Bar ===
window.addEventListener('scroll', () => {
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
  }

  // === Back to Top Button ===
  const btn = document.getElementById('backToTop');
  if (btn) {
    btn.style.display = window.scrollY > 200 ? 'block' : 'none';
  }
});

// === Back to Top Smooth Scroll ===
const btn = document.getElementById('backToTop');
if (btn) {
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// === Console functionality ===
document.addEventListener('DOMContentLoaded', function() {
  const consoleToggle = document.getElementById('console-toggle');
  const consoleWindow = document.getElementById('console-window');
  const consoleClose = document.getElementById('console-close');
  const consoleInput = document.getElementById('console-input');
  const consoleDiv = document.getElementById('console');
  
  // Open console
  consoleToggle.addEventListener('click', function() {
    consoleWindow.classList.remove('console-hidden');
    consoleToggle.style.display = 'none';
    consoleInput.focus();
  });
  
  // Close console
  consoleClose.addEventListener('click', function() {
    consoleWindow.classList.add('console-hidden');
    consoleToggle.style.display = 'block';
  });
  
  // Close console with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !consoleWindow.classList.contains('console-hidden')) {
      consoleClose.click();
    }
  });
  
  // Handle console commands
  consoleInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      const command = consoleInput.value.trim();
      if (command !== '') {
        processCommand(command);
      }
      consoleInput.value = '';
    }
  });
  
  function processCommand(command) {
    // Display the command
    const output = document.createElement('div');
    output.textContent = '> ' + command;
    output.style.color = '#ffffff';
    output.style.marginBottom = '4px';
    consoleDiv.appendChild(output);
    
    let response = '';
    
    switch (command.toLowerCase()) {
      case '/whoami':
        response = 'I am Saurav, the fearless developer of digital realms ⚔️';
        break;
      case '/projects':
        response = '⚒️ Projects: Vertex';
        break;
      case '/give resume.pdf':
        response = '📜 Summoning your resume...';
        setTimeout(() => {
          window.open('assets/resume.pdf', '_blank');
        }, 1000);
        break;
      case '/help':
        response = 'Available commands: /whoami, /projects, /give resume.pdf, /help';
        break;
      case '/clear':
        consoleDiv.innerHTML = '';
        return;
      default:
        response = 'Unknown command. Try /help';
    }
    
    // Display the response
    const reply = document.createElement('div');
    reply.textContent = response;
    reply.style.color = '#00a700ff';
    reply.style.marginBottom = '12px';
    consoleDiv.appendChild(reply);
    
    // Scroll to bottom
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
  }
});
