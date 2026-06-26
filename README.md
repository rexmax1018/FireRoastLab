# 火候研究所網站

火候研究所是靜態前端網站，使用 HTML、CSS 與少量原生 JavaScript 製作。主要頁面包含首頁、品牌故事、研究菜單、預約搶購與聯絡資訊。

## 專案結構

- `index.html`：首頁與主打商品、特色區塊。
- `about.html`：品牌故事與理念介紹。
- `menu.html`：菜單、組合商品與訂購入口。
- `order.html`：預約流程、日期時段與表單互動。
- `contact.html`：聯絡方式、店址與客服資訊。
- `css/styles.css`：網站主要視覺、版面、響應式與互動樣式。
- `css/tailwind.input.css`：Tailwind 本機編譯入口。
- `css/tailwind.css`：由 Tailwind 產生的基礎樣式檔，頁面會直接引用。
- `js/main.js`：導覽狀態、手機選單、預約表單、滾動動畫與卡片 spotlight 效果。
- `assets/`：圖片、Logo 與網站圖示資源。

## 開發指令

首次安裝相依套件：

```bash
npm install
```

重新編譯 Tailwind CSS：

```bash
npm run build:css
```

開發時監看 Tailwind input：

```bash
npm run watch:css
```

一般 HTML、`css/styles.css` 或 `js/main.js` 修改不需要額外建置；可直接以本機靜態伺服器或瀏覽器開啟頁面檢視。

## 維護備註

- 各頁 hero 圖片使用 `<picture>` 對應桌機與手機圖片，手機版斷點目前由 `css/styles.css` 控制。
- `order.html` 的日期、時段與庫存示意資料目前寫在 `js/main.js` 的 `orderCalendar`。
- 商品與特色卡片的 hover、spotlight 與圖片浮動效果集中在 `css/styles.css` 與 `js/main.js`。
- 圖片資源請集中放在 `assets/` 對應資料夾，頁面只引用既有路徑。
