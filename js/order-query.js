const orderLookupForm = document.querySelector("#orderLookupForm");
const lookupResult = document.querySelector("#lookupResult");
const lookupMessage = document.querySelector("#lookupMessage");
const lookupResultTitle = document.querySelector("#lookupResultTitle");
const lookupResultList = document.querySelector("#lookupResultList");
const lookupDate = document.querySelector("#lookupDate");
const lookupControls = orderLookupForm
  ? Array.from(orderLookupForm.querySelectorAll("input[name='phone'], input[name='reservedDate']"))
  : [];

const mockLookupOrders = [
  {
    orderId: "FRL-102501",
    customerName: "陳小明",
    pickupTime: "10月25日 (五) 18:00",
    pickupLocation: "創始店｜桃園市桃園區民生路547號",
    items: "招牌炭烤全雞 x 1",
    statusKey: "confirmed",
    status: "店家已確認，期待您的光臨！",
  },
  {
    orderId: "FRL-102502",
    customerName: "陳小明",
    pickupTime: "10月25日 (五) 19:00",
    pickupLocation: "創始店｜桃園市桃園區民生路547號",
    items: "招牌桶烤全雞豪華組合 x 2",
    statusKey: "pending",
    status: "預約申請已送出，待店家確認",
  },
  {
    orderId: "FRL-102503",
    customerName: "陳小明",
    pickupTime: "10月25日 (五) 19:30",
    pickupLocation: "藝文店｜桃園市桃園區中正路1188號",
    items: "蒜香奶油半雞 x 1",
    statusKey: "preparing",
    status: "爐火已開，餐點製作中",
  },
  {
    orderId: "FRL-102504",
    customerName: "陳小明",
    pickupTime: "10月25日 (五) 20:00",
    pickupLocation: "中壢店｜桃園市中壢區中央西路88號",
    items: "招牌炭烤全雞家庭組 x 1",
    statusKey: "ready",
    status: "餐點已完成，可前往取貨",
  },
  {
    orderId: "FRL-102505",
    customerName: "陳小明",
    pickupTime: "10月24日 (四) 18:30",
    pickupLocation: "創始店｜桃園市桃園區民生路547號",
    items: "桶烤雞腿排 x 4",
    statusKey: "completed",
    status: "訂單已完成取貨",
  },
  {
    orderId: "FRL-102506",
    customerName: "陳小明",
    pickupTime: "10月24日 (四) 19:30",
    pickupLocation: "藝文店｜桃園市桃園區中正路1188號",
    items: "炭烤雞翅分享盒 x 2",
    statusKey: "cancelled",
    status: "訂單已取消",
  },
];

const orderStatusMeta = {
  pending: {
    label: "等待店家確認",
    icon: "...",
  },
  confirmed: {
    label: "店家已確認",
    icon: "OK",
  },
  preparing: {
    label: "製作中",
    icon: "火",
  },
  ready: {
    label: "可取貨",
    icon: "取",
  },
  completed: {
    label: "已完成",
    icon: "✓",
  },
  cancelled: {
    label: "已取消",
    icon: "!",
  },
};

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

const createStatusBadge = (order) => {
  const statusKey = order.statusKey || "pending";
  const meta = orderStatusMeta[statusKey] || orderStatusMeta.pending;
  const badge = document.createElement("span");
  badge.className = `lookup-status lookup-status--${statusKey}`;

  const icon = document.createElement("span");
  icon.className = "lookup-status__icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = meta.icon;

  const text = document.createElement("span");
  text.className = "lookup-status__text";
  text.textContent = order.status;

  badge.append(icon, text);
  return badge;
};

const createStatusResultRow = (order) => {
  const row = document.createElement("div");
  row.className = "lookup-result-row lookup-result-row--status";

  const term = document.createElement("dt");
  term.textContent = "目前狀態";

  const description = document.createElement("dd");
  description.append(createStatusBadge(order));

  row.append(term, description);
  return row;
};

const createOrderResultCard = (order) => {
  const statusKey = order.statusKey || "pending";
  const card = document.createElement("section");
  card.className = `lookup-order-card lookup-order-card--${statusKey}`;
  card.setAttribute("aria-label", `訂單 ${order.orderId}`);

  const orderId = document.createElement("span");
  orderId.className = "lookup-result__eyebrow";
  orderId.textContent = `訂單編號：${order.orderId}`;

  const details = document.createElement("dl");
  details.className = "lookup-result-detail";
  details.append(
    createResultRow("訂購人", getCustomerSurnameLabel(order.customerName)),
    createResultRow("取餐時間", order.pickupTime),
    createResultRow("取貨地點", order.pickupLocation),
    createResultRow("訂購內容", order.items),
    createStatusResultRow(order)
  );

  card.append(orderId, details);
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

const setLookupControlError = (control, message) => {
  const error = orderLookupForm?.querySelector(`[data-error-for="${control.name}"]`);

  if (error) {
    error.textContent = message;
  }

  control.setAttribute("aria-invalid", String(Boolean(message)));
};

const getLookupControlMessage = (control) => {
  const validity = control.validity;

  if (control.name === "phone") {
    if (validity.valueMissing) {
      return "請輸入手機號碼。";
    }

    if (validity.patternMismatch) {
      return "請輸入 09 開頭的 10 碼手機號碼。";
    }
  }

  if (control.name === "reservedDate" && validity.valueMissing) {
    return "請選擇預定日期。";
  }

  return "";
};

const validateLookupControl = (control) => {
  const message = control.checkValidity() ? "" : getLookupControlMessage(control);
  setLookupControlError(control, message);
  return message;
};

const validateLookupForm = () => {
  const results = lookupControls.map((control) => ({
    control,
    message: validateLookupControl(control),
  }));

  return results.find((result) => result.message) || null;
};

lookupControls.forEach((control) => {
  control.addEventListener("blur", () => {
    validateLookupControl(control);
  });

  control.addEventListener("input", () => {
    if (control.getAttribute("aria-invalid") === "true") {
      validateLookupControl(control);
    }
  });
});

if (lookupDate && window.flatpickr) {
  flatpickr(lookupDate, {
    locale: {
      ...flatpickr.l10ns.zh_tw,
      firstDayOfWeek: 1,
      weekdays: {
        shorthand: ["日", "一", "二", "三", "四", "五", "六"],
        longhand: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
      },
    },
    dateFormat: "Y-m-d",
    minDate: "today",
    allowInput: false,
    disableMobile: true,
    clickOpens: true,
    onReady: (_, __, instance) => {
      instance.input.setAttribute("readonly", "readonly");
    },
    onChange: () => {
      if (lookupDate.getAttribute("aria-invalid") === "true") {
        validateLookupControl(lookupDate);
      }
    },
  });
}

orderLookupForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const firstInvalidResult = validateLookupForm();

  if (firstInvalidResult) {
    if (lookupMessage) {
      lookupMessage.textContent = "請修正上方標示的欄位後再查詢。";
    }
    firstInvalidResult.control.focus();
    return;
  }

  renderLookupResults(mockLookupOrders);
});
