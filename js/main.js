const menuButton = document.querySelector("#menuButton");
const mobileMenu = document.querySelector("#mobileMenu");

if (menuButton && mobileMenu) {
  const closeMenu = () => {
    mobileMenu.classList.add("hidden");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "開啟選單");
  };

  menuButton.addEventListener("click", () => {
    const isOpen = !mobileMenu.classList.contains("hidden");

    mobileMenu.classList.toggle("hidden", isOpen);
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "開啟選單" : "關閉選單");
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}
