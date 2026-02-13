// Contact form validation and terminal-style feedback

(function () {
  const form = document.getElementById("contact-form");
  const statusEl = document.getElementById("form-status");
  const spinner = document.querySelector(".ascii-spinner");

  if (!form || !statusEl || !spinner) return;

  const fields = {
    name: {
      el: document.getElementById("name"),
      error: document.getElementById("error-name"),
      message: "Please provide a name.",
    },
    email: {
      el: document.getElementById("email"),
      error: document.getElementById("error-email"),
      message: "Please provide a valid email address.",
    },
    message: {
      el: document.getElementById("message"),
      error: document.getElementById("error-message"),
      message: "Please tell me a bit more in the message.",
    },
  };

  function setError(fieldKey, text) {
    const field = fields[fieldKey];
    if (!field) return;
    field.error.textContent = text || "";
  }

  function clearErrors() {
    Object.keys(fields).forEach((key) => setError(key, ""));
  }

  function asciiSpinStart() {
    const frames = ["-", "\\", "|", "/"];
    let i = 0;
    spinner.textContent = frames[0];
    spinner.dataset.spinning = "true";

    function step() {
      if (spinner.dataset.spinning !== "true") return;
      i = (i + 1) % frames.length;
      spinner.textContent = frames[i];
      setTimeout(step, 120);
    }

    setTimeout(step, 120);
  }

  function asciiSpinStop() {
    spinner.dataset.spinning = "false";
    spinner.textContent = "-";
  }

  function validateEmail(value) {
    // Simple but robust email pattern
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validateForm() {
    clearErrors();
    let valid = true;

    if (!fields.name.el.value.trim()) {
      setError("name", fields.name.message);
      valid = false;
    }

    const email = fields.email.el.value.trim();
    if (!email || !validateEmail(email)) {
      setError("email", fields.email.message);
      valid = false;
    }

    if (!fields.message.el.value.trim()) {
      setError("message", fields.message.message);
      valid = false;
    }

    return valid;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validateForm()) {
      statusEl.textContent = "FORM CHECK FAILED :: Correct the highlighted fields.";
      return;
    }

    statusEl.textContent = "QUEUING PACKET...";
    asciiSpinStart();

    // Simulate async send; real implementation should send to backend with CSRF and rate limiting.
    setTimeout(() => {
      asciiSpinStop();
      statusEl.textContent =
        "PACKET SENT (SIMULATED) :: Hook this form up to your backend of choice.";
      form.reset();
    }, 1000);
  });
})();

