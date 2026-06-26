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

const initializeFireRoastLab = () => {
markActiveNavigation();

const menuButton = document.querySelector("#menuButton");
const mobileMenu = document.querySelector("#mobileMenu");

if (menuButton && mobileMenu) {
  const closeMenu = () => {
    mobileMenu.hidden = true;
    mobileMenu.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "開啟選單");
  };

  menuButton.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.contains("is-open");
    mobileMenu.hidden = isOpen;
    mobileMenu.classList.toggle("is-open", !isOpen);
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

const dateGrid = document.querySelector("#dateGrid");
const slotGrid = document.querySelector("#slotGrid");
const selectedDateInput = document.querySelector("#selectedDate");
const selectedSlotInput = document.querySelector("#selectedSlot");
const summaryDate = document.querySelector("#summaryDate");
const summarySlot = document.querySelector("#summarySlot");
const summaryQty = document.querySelector("#summaryQty");
const quantityValue = document.querySelector("#quantityValue");
const decreaseQty = document.querySelector("#decreaseQty");
const increaseQty = document.querySelector("#increaseQty");
const orderForm = document.querySelector("#orderForm");
const formMessage = document.querySelector("#formMessage");

const orderCalendar = [
  {
    id: "2026-07-01",
    date: "2026/07/01",
    week: "週三",
    label: "週三晚間開爐",
    slots: [
      {
        id: "2026-07-01-evening",
        time: "18:00 ~ 21:00",
        inventory: 6,
      },
    ],
  },
  {
    id: "2026-07-04",
    date: "2026/07/04",
    week: "週六",
    label: "週六整天開爐",
    slots: [
      {
        id: "2026-07-04-noon",
        time: "12:00 ~ 15:00",
        inventory: 4,
      },
      {
        id: "2026-07-04-afternoon",
        time: "15:00 ~ 18:00",
        inventory: 0,
      },
      {
        id: "2026-07-04-evening",
        time: "18:00 ~ 21:00",
        inventory: 3,
      },
    ],
  },
  {
    id: "2026-07-08",
    date: "2026/07/08",
    week: "週三",
    label: "週三晚間開爐",
    slots: [
      {
        id: "2026-07-08-evening",
        time: "18:00 ~ 21:00",
        inventory: 0,
      },
    ],
  },
];

let selectedDateId = "";
let selectedSlotId = "";
let quantity = 1;

const getSlotStatus = (slot) => {
  if (slot.inventory > 0) {
    return "[🟢 尚可預購]";
  }

  return "[🈵 本時段已額滿]";
};

const updateOrderSummary = () => {
  const selectedDate = orderCalendar.find((date) => date.id === selectedDateId);
  const selectedSlot = selectedDate?.slots.find((slot) => slot.id === selectedSlotId);

  if (summaryDate) {
    summaryDate.textContent = selectedDate
      ? `取餐日期：${selectedDate.date} ${selectedDate.week}`
      : "取餐日期：尚未選擇";
  }

  if (summarySlot) {
    summarySlot.textContent = selectedSlot
      ? `取餐時段：${selectedSlot.time}`
      : "取餐時段：尚未選擇";
  }

  if (summaryQty) {
    summaryQty.textContent = `預約數量：${quantity} 組`;
  }

  if (quantityValue) {
    quantityValue.textContent = String(quantity);
  }

  if (selectedDateInput) {
    selectedDateInput.value = selectedDateId;
  }

  if (selectedSlotInput) {
    selectedSlotInput.value = selectedSlotId;
  }
};

const isDateAvailable = (date) => date.slots.some((slot) => slot.inventory > 0);

const renderDates = () => {
  if (!dateGrid) {
    return;
  }

  dateGrid.innerHTML = "";

  orderCalendar.forEach((date) => {
    const isAvailable = isDateAvailable(date);
    const button = document.createElement("button");
    button.className = "date-card";
    button.type = "button";
    button.dataset.dateId = date.id;
    button.disabled = !isAvailable;
    button.setAttribute("aria-pressed", "false");

    if (!isAvailable) {
      button.classList.add("is-disabled");
    }

    button.innerHTML = `
      <strong>${date.date}</strong>
      <span class="date-week">${date.week} ｜ ${date.label}</span>
      <span class="date-status">${isAvailable ? "可選日期" : "本日已額滿"}</span>
    `;

    button.addEventListener("click", () => {
      if (!isAvailable) {
        return;
      }

      selectedDateId = date.id;
      selectedSlotId = "";
      dateGrid.querySelectorAll(".date-card").forEach((card) => {
        const isSelected = card.dataset.dateId === selectedDateId;
        card.classList.toggle("is-selected", isSelected);
        card.setAttribute("aria-pressed", String(isSelected));
      });
      renderSlots();
    });

    dateGrid.append(button);
  });

  const firstAvailableDate = orderCalendar.find(isDateAvailable);
  if (firstAvailableDate) {
    selectedDateId = firstAvailableDate.id;
    const firstButton = dateGrid.querySelector(`[data-date-id="${firstAvailableDate.id}"]`);
    firstButton?.classList.add("is-selected");
    firstButton?.setAttribute("aria-pressed", "true");
  }
};

const renderSlots = () => {
  if (!slotGrid) {
    return;
  }

  slotGrid.innerHTML = "";

  const selectedDate = orderCalendar.find((date) => date.id === selectedDateId);

  if (!selectedDate) {
    updateOrderSummary();
    return;
  }

  selectedDate.slots.forEach((slot) => {
    const isAvailable = slot.inventory > 0;
    const button = document.createElement("button");
    button.className = "slot-card";
    button.type = "button";
    button.dataset.slotId = slot.id;
    button.disabled = !isAvailable;
    button.setAttribute("aria-pressed", "false");

    if (!isAvailable) {
      button.classList.add("is-disabled");
    }

    button.innerHTML = `
      <strong>${selectedDate.week}</strong>
      <span class="slot-time">${slot.time}</span>
      <span class="slot-status">${getSlotStatus(slot)}</span>
    `;

    button.addEventListener("click", () => {
      if (!isAvailable) {
        return;
      }

      selectedSlotId = slot.id;
      slotGrid.querySelectorAll(".slot-card").forEach((card) => {
        const isSelected = card.dataset.slotId === selectedSlotId;
        card.classList.toggle("is-selected", isSelected);
        card.setAttribute("aria-pressed", String(isSelected));
      });
      updateOrderSummary();
    });

    slotGrid.append(button);
  });

  const firstAvailable = selectedDate.slots.find((slot) => slot.inventory > 0);
  if (firstAvailable) {
    selectedSlotId = firstAvailable.id;
    const firstButton = slotGrid.querySelector(`[data-slot-id="${firstAvailable.id}"]`);
    firstButton?.classList.add("is-selected");
    firstButton?.setAttribute("aria-pressed", "true");
  }

  updateOrderSummary();
};

if (dateGrid && slotGrid) {
  renderDates();
  renderSlots();
}

decreaseQty?.addEventListener("click", () => {
  quantity = Math.max(1, quantity - 1);
  updateOrderSummary();
});

increaseQty?.addEventListener("click", () => {
  quantity += 1;
  updateOrderSummary();
});

orderForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!selectedDateId) {
    formMessage.textContent = "請先選擇想把這隻狠雞帶回家的日期。";
    return;
  }

  if (!selectedSlotId) {
    formMessage.textContent = "請再選一個尚可預購的取餐時段。";
    return;
  }

  if (!orderForm.reportValidity()) {
    formMessage.textContent = "請確認姓名、聯絡電話與電子信箱皆已填寫。";
    return;
  }

  formMessage.textContent = "預約資料已送出，店家確認後才算完成預約。請留意電話或 Email 通知。";
});

  initializeScrollAnimations();
  initializeSpotlightEffects();
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
    ".feature-card, .product-card, .menu-item, .recipe-step, .story-block, .order-step, .contact-panel"
  );

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });
};

initializeFireRoastLab();
