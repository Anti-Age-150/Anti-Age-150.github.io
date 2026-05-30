const WAITLIST_ENDPOINT = null;

function setupMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("[data-site-nav]");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("is-open");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 820px)").matches) {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      }
    });
  });
}

async function submitWaitlist(form, status) {
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  if (WAITLIST_ENDPOINT) {
    const response = await fetch(WAITLIST_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Waitlist submission failed.");
    }

    if (status) {
      status.textContent = "Submitted successfully.";
    }

    return;
  }

  try {
    localStorage.setItem("go160-waitlist", JSON.stringify({ ...payload, submittedAt: new Date().toISOString() }));
    if (status) {
      status.textContent = "Saved locally. Connect WAITLIST_ENDPOINT in site.js to send submissions.";
    }
  } catch {
    if (status) {
      status.textContent = "Saved in memory for this session. Local storage is unavailable.";
    }
  }
}

function setupWaitlistForm() {
  const form = document.querySelector("[data-waitlist-form]");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = document.querySelector("[data-form-status]");

    try {
      await submitWaitlist(form, status);
      form.reset();
    } catch (error) {
      if (status) {
        status.textContent = error instanceof Error ? error.message : "Unable to submit form.";
      }
    }
  });
}

function setupHeroFullscreen() {
  const shell = document.querySelector("[data-fullscreen-target]");
  const button = document.querySelector("[data-fullscreen-button]");
  const video = shell?.querySelector("video");

  if (!shell || !button || !video) return;

  button.addEventListener("click", async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    if (shell.requestFullscreen) {
      await shell.requestFullscreen();
      return;
    }

    if (video.webkitEnterFullscreen) {
      video.webkitEnterFullscreen();
    }
  });
}

setupMobileNav();
setupWaitlistForm();
setupHeroFullscreen();
