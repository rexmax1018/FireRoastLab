const orderLookupForm = document.querySelector("#orderLookupForm");
const lookupResult = document.querySelector("#lookupResult");
const lookupMessage = document.querySelector("#lookupMessage");
const lookupResultTitle = document.querySelector("#lookupResultTitle");
const lookupResultList = document.querySelector("#lookupResultList");

const mockLookupOrders = [
  {
    orderId: "FRL-102501",
    customerName: "陳小明",
    pickupTime: "10月25日 (五) 18:00",
    items: "招牌炭烤全雞 x 1",
    status: "店家已確認，期待您的光臨！",
  },
  {
    orderId: "FRL-102502",
    customerName: "陳小明",
    pickupTime: "10月25日 (五) 19:00",
    items: "招牌桶烤全雞豪華組合 x 2",
    status: "預約申請已送出，待店家確認",
  },
];

const getCustomerSurnameLabel = (name) => {
  const normalizedName = name.trim();

  if (!normalizedName) {
    return "貴賓";
  }

  return `${normalizedName.slice(0, 1)}先生 / 小姐`;
};

const createResultRow = (label, value, className = "") => {
  const row = document.createElement("div");
  row.className = `lookup-result-row${className ? ` ${className}` : ""}`;

  const term = document.createElement("dt");
  term.textContent = label;

  const description = document.createElement("dd");
  description.textContent = value;

  row.append(term, description);
  return row;
};

const createOrderResultCard = (order) => {
  const card = document.createElement("section");
  card.className = "lookup-order-card";
  card.setAttribute("aria-label", `訂單 ${order.orderId}`);

  const orderId = document.createElement("span");
  orderId.className = "lookup-result__eyebrow";
  orderId.textContent = `訂單編號：${order.orderId}`;

  const statusTitle = document.createElement("h3");
  statusTitle.textContent = order.status.includes("已確認") ? "店家已確認" : "等待店家確認";

  const details = document.createElement("dl");
  details.className = "lookup-result-detail";
  details.append(
    createResultRow("訂購人", getCustomerSurnameLabel(order.customerName)),
    createResultRow("取餐時間", order.pickupTime),
    createResultRow("訂購內容", order.items),
    createResultRow("目前狀態", order.status, "lookup-result-row--status")
  );

  card.append(orderId, statusTitle, details);
  return card;
};

const renderLookupResults = (orders) => {
  if (lookupResultList) {
    lookupResultList.textContent = "";
    orders.forEach((order) => {
      lookupResultList.append(createOrderResultCard(order));
    });
  }

  if (lookupResultTitle) {
    lookupResultTitle.textContent = `找到 ${orders.length} 筆訂單`;
  }

  if (lookupResult) {
    lookupResult.hidden = false;
    lookupResult.classList.add("is-revealed");
  }

  if (lookupMessage) {
    lookupMessage.textContent = orders.length > 0 ? "已完成查詢。" : "查無符合條件的訂單。";
  }

  lookupResult?.scrollIntoView({ block: "nearest", behavior: "smooth" });
};

orderLookupForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!orderLookupForm.reportValidity()) {
    if (lookupMessage) {
      lookupMessage.textContent = "請輸入手機號碼與預定日期。";
    }
    return;
  }

  renderLookupResults(mockLookupOrders);
});
