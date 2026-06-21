// 手機選單控制：同步選單顯示狀態與按鈕的 aria 屬性。
const menuButton = document.querySelector("#menuButton");
const mobileMenu = document.querySelector("#mobileMenu");

if (menuButton && mobileMenu) {
  // 關閉選單時一併還原輔助閱讀狀態，避免視覺與 aria 狀態不同步。
  const closeMenu = () => {
    mobileMenu.classList.add("hidden");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "開啟選單");
  };

  menuButton.addEventListener("click", () => {
    // Tailwind 的 hidden class 是目前選單顯示狀態的單一依據。
    const isOpen = !mobileMenu.classList.contains("hidden");

    mobileMenu.classList.toggle("hidden", isOpen);
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "開啟選單" : "關閉選單");
  });

  // 點選錨點後收合手機選單，避免導覽完成後仍覆蓋畫面。
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // 提供鍵盤使用者用 Escape 快速關閉選單。
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}
