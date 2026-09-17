const html = document.documentElement;

const THEME_KEY = "portfolio-theme";
const MOBILE_BREAKPOINT = 768;

/* =========================
   DARK MODE
========================= */

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

const mobileThemeToggle = document.getElementById("mobileThemeToggle");

const mobileThemeIcon = document.getElementById("mobileThemeIcon");

function isDarkMode() {
  return html.classList.contains("dark");
}

function updateThemeIcons() {
  const iconClass = isDarkMode() ? "fa-solid fa-sun" : "fa-solid fa-moon";

  if (themeIcon) {
    themeIcon.className = iconClass;
  }

  if (mobileThemeIcon) {
    mobileThemeIcon.className = `${iconClass} text-sm`;
  }
}

function applyTheme(theme, save = true) {
  html.classList.toggle("dark", theme === "dark");

  if (save) {
    localStorage.setItem(THEME_KEY, theme);
  }

  updateThemeIcons();
}

function initializeTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);

  if (savedTheme === "dark") {
    applyTheme("dark", false);
    return;
  }

  if (savedTheme === "light") {
    applyTheme("light", false);
    return;
  }

  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  applyTheme(systemDark ? "dark" : "light", false);
}

initializeTheme();

themeToggle?.addEventListener("click", () => {
  applyTheme(isDarkMode() ? "light" : "dark");
});

mobileThemeToggle?.addEventListener("click", () => {
  applyTheme(isDarkMode() ? "light" : "dark");
});

/* =========================
   MOBILE NAVBAR
========================= */

const mobileMenuToggle = document.getElementById("mobileMenuToggle");

const mobileMenuPanel = document.getElementById("mobileMenuPanel");

const mobileMenuIcon = document.getElementById("mobileMenuIcon");

function openMobileMenu() {
  if (!mobileMenuToggle || !mobileMenuPanel || !mobileMenuIcon) {
    return;
  }

  mobileMenuPanel.classList.remove(
    "pointer-events-none",
    "scale-95",
    "opacity-0",
  );

  mobileMenuPanel.classList.add(
    "pointer-events-auto",
    "scale-100",
    "opacity-100",
  );

  mobileMenuPanel.setAttribute("aria-hidden", "false");

  mobileMenuToggle.setAttribute("aria-expanded", "true");

  mobileMenuToggle.setAttribute("aria-label", "Close navigation menu");

  mobileMenuIcon.className = "fa-solid fa-xmark text-sm";
}

function closeMobileMenu() {
  if (!mobileMenuToggle || !mobileMenuPanel || !mobileMenuIcon) {
    return;
  }

  mobileMenuPanel.classList.remove(
    "pointer-events-auto",
    "scale-100",
    "opacity-100",
  );

  mobileMenuPanel.classList.add("pointer-events-none", "scale-95", "opacity-0");

  mobileMenuPanel.setAttribute("aria-hidden", "true");

  mobileMenuToggle.setAttribute("aria-expanded", "false");

  mobileMenuToggle.setAttribute("aria-label", "Open navigation menu");

  mobileMenuIcon.className = "fa-solid fa-bars text-sm";
}

mobileMenuToggle?.addEventListener("click", () => {
  const isOpen = mobileMenuToggle.getAttribute("aria-expanded") === "true";

  if (isOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
});

/* =========================
   MOBILE NAV LINKS
========================= */

const mobileNavLinks = document.querySelectorAll("[data-mobile-nav-link]");

mobileNavLinks.forEach((link) => {
  link.addEventListener("click", () => {
    closeMobileMenu();
  });
});

/* =========================
   CLOSE MOBILE MENU
   OUTSIDE CLICK
========================= */

document.addEventListener("click", (event) => {
  if (
    !mobileMenuPanel ||
    !mobileMenuToggle ||
    window.innerWidth >= MOBILE_BREAKPOINT
  ) {
    return;
  }

  const target = event.target;

  if (!mobileMenuPanel.contains(target) && !mobileMenuToggle.contains(target)) {
    closeMobileMenu();
  }
});

/* =========================
   DESKTOP NAVBAR
========================= */

const navItems = document.querySelectorAll("[data-nav-link]");

const sections = Array.from(document.querySelectorAll("main[id], section[id]"));

function setActiveNav(sectionId) {
  navItems.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${sectionId}`;

    if (isActive) {
      link.classList.add("bg-white", "text-black", "shadow-sm");

      link.classList.add("dark:bg-black", "dark:text-white");

      link.classList.remove("text-gray-400", "dark:text-gray-500");
    } else {
      link.classList.remove(
        "bg-white",
        "text-black",
        "shadow-sm",
        "dark:bg-black",
        "dark:text-white",
      );

      link.classList.add("text-gray-400", "dark:text-gray-500");
    }
  });
}

function getCurrentSection() {
  if (!sections.length) {
    return "home";
  }

  const scrollPosition = window.scrollY + 140;

  let currentSection = sections[0].id;

  for (const section of sections) {
    if (section.offsetTop <= scrollPosition) {
      currentSection = section.id;
    }
  }

  return currentSection;
}

function updateActiveNav() {
  setActiveNav(getCurrentSection());
}

window.addEventListener("scroll", updateActiveNav, {
  passive: true,
});

window.addEventListener("resize", updateActiveNav);

window.addEventListener("load", updateActiveNav);

updateActiveNav();

/* =========================
   SMOOTH SCROLL
========================= */

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    if (!targetId || targetId === "#") {
      return;
    }

    const target = document.querySelector(targetId);

    if (!target) {
      return;
    }

    event.preventDefault();

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    target.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });

    history.replaceState(null, "", targetId);
  });
});

/* =========================
   CONTACT FORM
========================= */

const contactForm = document.getElementById("contactForm");

const contactStatus = document.getElementById("contactStatus");

const contactName = document.getElementById("contactName");

const contactEmail = document.getElementById("contactEmail");

const contactMessage = document.getElementById("contactMessage");

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const submitButton = contactForm.querySelector('button[type="submit"]');

  if (!submitButton) {
    return;
  }

  const name = contactName?.value.trim() || "";

  const email = contactEmail?.value.trim() || "";

  const message = contactMessage?.value.trim() || "";

  if (!name || !email || !message) {
    if (contactStatus) {
      contactStatus.textContent = "Please complete all fields.";
    }

    return;
  }

  /* Email validation */
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    if (contactStatus) {
      contactStatus.textContent = "Please enter a valid email address.";
    }

    contactEmail?.focus();

    return;
  }

  const originalButtonContent = submitButton.innerHTML;

  submitButton.disabled = true;

  submitButton.innerHTML = `
      <span>Sending...</span>
      <i
        class="fa-solid fa-spinner fa-spin text-xs"
        aria-hidden="true"
      ></i>
    `;

  if (contactStatus) {
    contactStatus.textContent = "";
  }

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      body: new FormData(contactForm),
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      contactForm.reset();

      if (contactStatus) {
        contactStatus.textContent =
          "Your message has been sent successfully. I'll get back to you soon.";
      }
    } else {
      const data = await response.json().catch(() => null);

      if (contactStatus) {
        contactStatus.textContent =
          data?.errors?.[0]?.message ||
          "Something went wrong. Please try again.";
      }
    }
  } catch (error) {
    console.error("Contact form error:", error);

    if (contactStatus) {
      contactStatus.textContent =
        "Unable to send your message. Please try again later.";
    }
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonContent;
  }
});

/* =========================
   CURRENT YEAR
========================= */

const currentYear = document.getElementById("currentYear");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

/* =========================
   ESCAPE KEY
========================= */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileMenu();
  }
});

/* =========================
   SYSTEM THEME CHANGE
========================= */

const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

function handleSystemThemeChange(event) {
  const savedTheme = localStorage.getItem(THEME_KEY);

  if (savedTheme) {
    return;
  }

  applyTheme(event.matches ? "dark" : "light", false);
}

if (systemTheme.addEventListener) {
  systemTheme.addEventListener("change", handleSystemThemeChange);
} else {
  systemTheme.addListener(handleSystemThemeChange);
}

/* =========================
   INITIAL MOBILE ICON
========================= */

updateThemeIcons();
