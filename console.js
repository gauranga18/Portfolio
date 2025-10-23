const consoleDiv = document.getElementById("console");
const input = document.getElementById("input");

function printToConsole(text) {
  const div = document.createElement("div");
  div.textContent = `> ${text}`;
  consoleDiv.appendChild(div);
  consoleDiv.scrollTop = consoleDiv.scrollHeight;
}

function handleCommand(cmd) {
  switch (cmd.trim()) {
    case "/help":
      printToConsole("Available commands: /whoami, /projects, /give resume.pdf, /clear");
      break;
    case "/whoami":
      printToConsole("I’m Saurav Jyoti Kalita — a developer, builder, and explorer of ideas.");
      break;
    case "/projects":
      printToConsole("Projects: SkillSync, E-commerce Store, Password Manager, and more!");
      break;
    case "/give resume.pdf":
      printToConsole("Preparing your resume...");
      setTimeout(() => {
        const link = document.createElement("a");
        link.href = "assets/resume.pdf"; // path to your file
        link.download = "Saurav_Jyoti_Resume.pdf";
        link.click();
        printToConsole("Resume downloaded!");
      }, 1000);
      break;
    case "/clear":
      consoleDiv.innerHTML = "";
      break;
    default:
      printToConsole("Unknown command. Type /help for help.");
  }
}

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const cmd = input.value;
    printToConsole(cmd);
    handleCommand(cmd);
    input.value = "";
  }
});
