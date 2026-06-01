const WAITLIST_ENDPOINT = null;
const GISCUS_SCRIPT_SRC = "https://giscus.app/client.js";
const GISCUS_FALLBACK_MESSAGE =
  "Comments are available once Giscus is configured with a GitHub Discussions repository.";

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

function getGiscusConfig(mount) {
  const config = window.GO160_GISCUS || {};
  return {
    repo: config.repo || mount.dataset.giscusRepo || "",
    repoId: config.repoId || mount.dataset.giscusRepoId || "",
    category: config.category || mount.dataset.giscusCategory || "",
    categoryId: config.categoryId || mount.dataset.giscusCategoryId || "",
    mapping: config.mapping || mount.dataset.giscusMapping || "pathname",
    strict: config.strict ?? mount.dataset.giscusStrict ?? 0,
    reactionsEnabled: config.reactionsEnabled ?? mount.dataset.giscusReactionsEnabled ?? 1,
    emitMetadata: config.emitMetadata ?? mount.dataset.giscusEmitMetadata ?? 0,
    inputPosition: config.inputPosition || mount.dataset.giscusInputPosition || "bottom",
    theme: config.theme || mount.dataset.giscusTheme || "preferred_color_scheme",
    lang:
      config.lang ||
      mount.dataset.giscusLang ||
      (document.documentElement.lang === "zh-Hans" ? "zh-CN" : "en"),
  };
}

function setupComments() {
  const mount = document.querySelector(".giscus");

  if (!mount) {
    return;
  }

  const config = getGiscusConfig(mount);
  const isConfigured = Boolean(config.repo && config.repoId && config.category && config.categoryId);

  if (!isConfigured) {
    mount.innerHTML = `<p class="comment-placeholder">${GISCUS_FALLBACK_MESSAGE}</p>`;
    return;
  }

  if (mount.querySelector("iframe")) {
    return;
  }

  mount.textContent = "";

  const script = document.createElement("script");
  script.src = GISCUS_SCRIPT_SRC;
  script.setAttribute("data-repo", config.repo);
  script.setAttribute("data-repo-id", config.repoId);
  script.setAttribute("data-category", config.category);
  script.setAttribute("data-category-id", config.categoryId);
  script.setAttribute("data-mapping", config.mapping);
  script.setAttribute("data-strict", String(config.strict));
  script.setAttribute("data-reactions-enabled", String(config.reactionsEnabled));
  script.setAttribute("data-emit-metadata", String(config.emitMetadata));
  script.setAttribute("data-input-position", config.inputPosition);
  script.setAttribute("data-theme", config.theme);
  script.setAttribute("data-lang", config.lang);
  script.setAttribute("crossorigin", "anonymous");
  script.async = true;

  mount.appendChild(script);
}

setupMobileNav();
setupWaitlistForm();
setupOutlookVideo();
setupComments();
