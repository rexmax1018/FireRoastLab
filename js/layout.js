const currentPage = document.body.dataset.page || "home";

const partialFallbacks = {
  "header.html": `
<header class="site-header">
  <nav class="site-nav" aria-label="主選單">
    <a class="brand-link" href="index.html" aria-label="火侯研究所首頁">
      <img src="assets/images/logo/logo-symbol-trans.png" alt="" />
      <img src="assets/images/logo/logo-wordmark-2-trans.png" alt="火侯研究所 Fire Roast Lab" />
    </a>
    <div class="desktop-nav">
      <a class="nav-link" data-nav-id="home" href="index.html">首頁</a>
      <a class="nav-link" data-nav-id="about" href="about.html">品牌故事</a>
      <a class="nav-link" data-nav-id="menu" href="menu.html">研究菜單</a>
      <a class="nav-link nav-link--cta" data-nav-id="order" href="order.html">預約訂購</a>
      <a class="nav-link" data-nav-id="contact" href="contact.html">聯絡情報</a>
    </div>
    <button class="menu-toggle" id="menuButton" type="button" aria-controls="mobileMenu" aria-expanded="false" aria-label="開啟選單">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    </button>
  </nav>
  <div class="mobile-nav" id="mobileMenu" hidden>
    <a class="mobile-nav__link" data-nav-id="home" href="index.html">首頁</a>
    <a class="mobile-nav__link" data-nav-id="about" href="about.html">品牌故事</a>
    <a class="mobile-nav__link" data-nav-id="menu" href="menu.html">研究菜單</a>
    <a class="mobile-nav__link mobile-nav__link--cta" data-nav-id="order" href="order.html">預約訂購</a>
    <a class="mobile-nav__link" data-nav-id="contact" href="contact.html">聯絡情報</a>
  </div>
</header>`,
  "footer.html": `
<footer class="site-footer">
  <div class="footer-grid page-shell">
    <div>
      <a class="footer-brand" href="index.html">
        <img src="assets/images/logo/logo-symbol-trans.png" alt="" />
        <span>火侯研究所</span>
      </a>
      <p>Fire Roast Lab</p>
    </div>
    <div>
      <h2>快速路徑</h2>
      <nav aria-label="頁尾選單">
        <a href="index.html">首頁</a>
        <a href="about.html">品牌故事</a>
        <a href="menu.html">研究菜單</a>
        <a href="order.html">預約訂購</a>
        <a href="contact.html">聯絡情報</a>
      </nav>
    </div>
    <div>
      <h2>取貨地點</h2>
      <p>桃園市桃園區民生路547號（北埔路口）</p>
      <a class="text-link" href="https://maps.app.goo.gl/ybCiiogqwrYkVEhq6" target="_blank" rel="noreferrer">Google 地圖導航</a>
    </div>
  </div>
  <div class="footer-bottom page-shell">
    <p>© 2026 火侯研究所 Fire Roast Lab. All Rights Reserved.</p>
    <p>本站產品皆採線上預約當日現烤，不提供電話與現場隨到隨點，敬請見諒。</p>
  </div>
</footer>`,
};

const fetchPartial = async (path) => {
  try {
    const response = await fetch(path, { cache: "no-cache" });

    if (!response.ok) {
      throw new Error(`無法載入 ${path}`);
    }

    return await response.text();
  } catch (error) {
    console.warn(`${path} 載入失敗，改用內建版面備援。`, error);
    return partialFallbacks[path] || "";
  }
};

const injectPartial = (selector, html) => {
  const target = document.querySelector(selector);

  if (target && html) {
    target.outerHTML = html;
  }
};

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

window.fireRoastLayoutReady = (async () => {
  const [headerHtml, footerHtml] = await Promise.all([
    fetchPartial("header.html"),
    fetchPartial("footer.html"),
  ]);

  injectPartial("[data-layout-header]", headerHtml);
  injectPartial("[data-layout-footer]", footerHtml);

  markActiveNavigation();
  document.dispatchEvent(new CustomEvent("fireRoastLayoutReady"));
})();
