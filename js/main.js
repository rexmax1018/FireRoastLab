const currentPage = document.body.dataset.page || "home";

const markActiveNavigation = () => {
  document.querySelectorAll(`[data-nav-id="${currentPage}"]`).forEach((link) => {
    link.setAttribute("aria-current", "page");

    if (link.classList.contains("nav-link")) {
      link.classList.add("nav-link--active");
    }

    if (link.classList.contains("mobile-nav__link")) {
      link.classList.add("mobile-nav__link--active");
    }
  });
};

const initializeMobileNavigation = () => {
  const menuButton = document.querySelector("#menuButton");
  const mobileMenu = document.querySelector("#mobileMenu");

  if (!menuButton || !mobileMenu) {
    return;
  }

  if (mobileMenu.parentElement !== document.body) {
    document.body.append(mobileMenu);
  }

  const closeMenu = () => {
    mobileMenu.classList.remove("is-open");
    mobileMenu.hidden = true;
    mobileMenu.setAttribute("hidden", "");
    document.body.classList.remove("mobile-nav-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "開啟選單");
  };

  const openMenu = () => {
    mobileMenu.hidden = false;
    mobileMenu.removeAttribute("hidden");
    mobileMenu.classList.add("is-open");
    document.body.classList.add("mobile-nav-open");
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "關閉選單");
  };

  menuButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const isOpen = menuButton.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  document.addEventListener("click", (event) => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    const target = event.target;

    if (!isOpen || !(target instanceof Node)) {
      return;
    }

    if (!mobileMenu.contains(target) && !menuButton.contains(target)) {
      closeMenu();
    }
  });

  mobileMenu.addEventListener("click", (event) => {
    if (event.target === mobileMenu) {
      closeMenu();
    }
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
};

const initializeScrollAnimations = () => {
  const elements = document.querySelectorAll(".scroll-reveal");
  if (elements.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  elements.forEach((el) => observer.observe(el));
};

const initializeSpotlightEffects = () => {
  const cards = document.querySelectorAll(
    ".feature-card, .product-card, .menu-package-card, .menu-item, .recipe-step, .story-block, .order-step, .contact-panel, .lookup-panel, .lookup-result"
  );

  cards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });
};

const initializeBackToTopButton = () => {
  if (document.querySelector(".back-to-top")) {
    return;
  }

  const button = document.createElement("button");
  button.type = "button";
  button.className = "back-to-top";
  button.setAttribute("aria-label", "回到頁面頂端");
  button.setAttribute("title", "回到頁面頂端");
  button.setAttribute("aria-hidden", "true");
  button.tabIndex = -1;
  button.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 19V5m0 0-6 6m6-6 6 6" />
    </svg>
  `;

  document.body.append(button);

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const updateVisibility = () => {
    const pageCanScroll = document.documentElement.scrollHeight > window.innerHeight + 120;
    const shouldShow = pageCanScroll && window.scrollY > 320;

    button.classList.toggle("is-visible", shouldShow);
    button.setAttribute("aria-hidden", shouldShow ? "false" : "true");
    button.tabIndex = shouldShow ? 0 : -1;
  };

  button.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    });
  });

  window.addEventListener("scroll", updateVisibility, { passive: true });
  window.addEventListener("resize", updateVisibility);
  updateVisibility();
};

markActiveNavigation();
initializeMobileNavigation();
initializeScrollAnimations();
initializeSpotlightEffects();
initializeBackToTopButton();
