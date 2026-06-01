const WAITLIST_ENDPOINT = null;
const VALINE_FALLBACK_MESSAGE =
  "Comments are available once Valine is configured with LeanCloud credentials.";

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

function getWaitlistPayload(form) {
  const formData = new FormData(form);
  return {
    ...Object.fromEntries(formData.entries()),
    language: form.dataset.language || document.documentElement.lang || "en",
    sourcePage: window.location.pathname || "/",
    submittedAt: new Date().toISOString(),
  };
}

async function submitWaitlist(form, status) {
  const payload = getWaitlistPayload(form);
  const successMessage = form.dataset.success || "Submitted successfully.";
  const localSuccessMessage = form.dataset.localSuccess || successMessage;

  if (WAITLIST_ENDPOINT) {
    const response = await fetch(WAITLIST_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(form.dataset.error || "Unable to submit right now.");
    }

    if (status) {
      status.textContent = successMessage;
    }

    return;
  }

  let existing = [];
  try {
    existing = JSON.parse(localStorage.getItem("go160-waitlist") || "[]");
  } catch {
    existing = [];
  }

  const submissions = Array.isArray(existing) ? existing : [existing];
  submissions.push(payload);
  localStorage.setItem("go160-waitlist", JSON.stringify(submissions));

  if (status) {
    status.textContent = localSuccessMessage;
  }
}

function setupWaitlistForm() {
  const form = document.querySelector("[data-waitlist-form]");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = form.querySelector("[data-form-status]");
    const submitButton = form.querySelector('button[type="submit"]');

    if (status) {
      status.textContent = "";
    }

    if (submitButton) {
      submitButton.disabled = true;
    }

    try {
      await submitWaitlist(form, status);
      form.reset();
    } catch (error) {
      if (status) {
        status.textContent = error instanceof Error ? error.message : form.dataset.error || "Unable to submit right now.";
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}

function setupOutlookVideo() {
  const shell = document.querySelector("[data-outlook-shell]");
  const button = document.querySelector("[data-outlook-fullscreen]");
  const video = document.querySelector("[data-outlook-video]");

  if (!shell || !button || !video) return;

  button.addEventListener("click", async () => {
    try {
      if (shell.requestFullscreen && document.fullscreenElement !== shell) {
        await shell.requestFullscreen();
      }
    } catch {
      // Fullscreen is optional; playback still proceeds.
    }

    try {
      await video.play();
    } catch {
      // Some browsers block playback until the user taps the player controls.
    }
  });
}

function setupComments() {
  const mount = document.querySelector("#vcomment.comment");

  if (!mount) {
    return;
  }

  const commentConfig = window.GO160_VALINE || {};
  const appId = commentConfig.appId || mount.dataset.valineAppId || "";
  const appKey = commentConfig.appKey || mount.dataset.valineAppKey || "";

  if (!window.Valine || !appId || !appKey) {
    mount.innerHTML = `<p class="comment-placeholder">${VALINE_FALLBACK_MESSAGE}</p>`;
    return;
  }

  new window.Valine({
    el: "#vcomment",
    path: window.location.pathname,
    appId,
    appKey,
    placeholder:
      commentConfig.placeholder ||
      mount.dataset.valinePlaceholder ||
      "Share a thought, question, or suggestion.",
    notify: commentConfig.notify ?? false,
    verify: commentConfig.verify ?? false,
    enableQQ: commentConfig.enableQQ ?? true,
    recordIP: commentConfig.recordIP ?? false,
    pageSize: commentConfig.pageSize ?? 10,
    avatar: commentConfig.avatar ?? "retro",
  });
}

setupMobileNav();
setupWaitlistForm();
setupOutlookVideo();
setupComments();
