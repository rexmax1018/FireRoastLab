const pickupGrid = document.querySelector("#pickupGrid");
const dateGrid = document.querySelector("#dateGrid");
const slotGrid = document.querySelector("#slotGrid");
const selectedPickupInput = document.querySelector("#selectedPickupLocation");
const selectedDateInput = document.querySelector("#selectedDate");
const selectedSlotInput = document.querySelector("#selectedSlot");
const summaryDate = document.querySelector("#summaryDate");
const summarySlot = document.querySelector("#summarySlot");
const summaryItems = document.querySelector("#summaryItems");
const summaryTotal = document.querySelector("#summaryTotal");
const orderItems = Array.from(document.querySelectorAll("[data-order-item]"));
const subtotalAmountValue = document.querySelector("#subtotalAmountValue");
const orderForm = document.querySelector("#orderForm");
const formMessage = document.querySelector("#formMessage");
const termsAgreement = document.querySelector("#termsAgreement");
const termsModal = document.querySelector("#termsModal");
const openTermsModal = document.querySelector("#openTermsModal");
const closeTermsModal = document.querySelector("#closeTermsModal");
const completionModal = document.querySelector("#completionModal");
const closeCompletionModal = document.querySelector("#closeCompletionModal");
const completionOrderId = document.querySelector("#completionOrderId");
const completionPhone = document.querySelector("#completionPhone");
const completionDate = document.querySelector("#completionDate");
const completionSlot = document.querySelector("#completionSlot");
const completionItems = document.querySelector("#completionItems");
const completionStatus = document.querySelector("#completionStatus");

const orderCalendar = [
  {
    id: "2026-07-01",
    date: "2026/07/01",
    week: "週三",
    label: "晚間開爐",
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
    label: "整天開爐",
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
    label: "晚間開爐",
    slots: [
      {
        id: "2026-07-08-evening",
        time: "18:00 ~ 21:00",
        inventory: 0,
      },
    ],
  },
];

let selectedPickupId = selectedPickupInput?.value || "";
let selectedDateId = selectedDateInput?.value || "";
let selectedSlotId = selectedSlotInput?.value || "";
let termsModalReturnFocus = null;
let completionModalReturnFocus = null;

const setFormMessage = (message) => {
  if (formMessage) {
    formMessage.textContent = message;
  }
};

const formatMoney = (amount) => `${amount.toLocaleString("zh-TW")} 元`;

const getCurrentOrderSelection = () => {
  const selectedDate = orderCalendar.find((date) => date.id === selectedDateId);
  const selectedSlot = selectedDate?.slots.find((slot) => slot.id === selectedSlotId);

  return {
    selectedDate,
    selectedSlot,
  };
};

const createMockOrderId = () => {
  const timestampPart = Date.now().toString().slice(-6);
  const randomPart = Math.floor(Math.random() * 90 + 10);
  return `FRL-${timestampPart}${randomPart}`;
};

orderItems.forEach((item) => {
  const quantityInput = item.querySelector("[data-quantity-input]");
  item.dataset.quantity = quantityInput?.value || item.dataset.quantity || "0";
});

const getOrderItemState = () =>
  orderItems.map((item) => {
    const name = item.dataset.itemName || item.querySelector("strong")?.textContent.trim() || "品項";
    const unitPrice = Number(item.dataset.unitPrice || 0);
    const quantity = Number(item.dataset.quantity || 0);
    const quantityValue = item.querySelector("[data-quantity-value]");
    const quantityInput = item.querySelector("[data-quantity-input]");

    return {
      item,
      name,
      unitPrice,
      quantity,
      quantityInput,
      quantityValue,
    };
  });

const getSelectedOrderItemLines = () =>
  getOrderItemState()
    .filter((item) => item.quantity > 0)
    .map((item) => `${item.name} x ${item.quantity}`);

const getSlotStatus = (slot) => {
  if (slot.inventory > 0) {
    return "尚可預購";
  }

  return "本時段已額滿";
};

const renderCompletionSummary = () => {
  const formData = orderForm ? new FormData(orderForm) : null;
  const phone = formData?.get("phone")?.toString().trim() || "尚未填寫";
  const { selectedDate, selectedSlot } = getCurrentOrderSelection();
  const itemLines = getSelectedOrderItemLines();

  if (completionOrderId) {
    completionOrderId.textContent = createMockOrderId();
  }

  if (completionPhone) {
    completionPhone.textContent = phone;
  }

  if (completionDate) {
    completionDate.textContent = selectedDate ? `${selectedDate.date} ${selectedDate.week}` : "尚未選擇";
  }

  if (completionSlot) {
    completionSlot.textContent = selectedSlot?.time || "尚未選擇";
  }

  if (completionItems) {
    completionItems.textContent = itemLines.length > 0 ? itemLines.join("\n") : "尚未選擇品項";
  }

  if (completionStatus) {
    completionStatus.textContent = "預約申請已送出，待店家確認";
  }
};

const updateOrderSummary = () => {
  const { selectedDate, selectedSlot } = getCurrentOrderSelection();

  if (summaryDate) {
    summaryDate.textContent = selectedDate
      ? `取餐日期：${selectedDate.date} ${selectedDate.week}`
      : "取餐日期：尚未選擇";
  }

  if (summarySlot) {
    summarySlot.textContent = selectedSlot ? `取餐時段：${selectedSlot.time}` : "取餐時段：尚未選擇";
  }

  const itemState = getOrderItemState();
  const selectedItemLines = getSelectedOrderItemLines();
  const subtotalAmount = itemState.reduce((total, item) => total + item.unitPrice * item.quantity, 0);

  if (summaryItems) {
    summaryItems.textContent = "";

    if (selectedItemLines.length === 0) {
      summaryItems.textContent = "訂購內容：尚未選擇品項";
    } else {
      const heading = document.createElement("p");
      heading.textContent = "訂購內容：";
      summaryItems.append(heading);

      selectedItemLines.forEach((line) => {
        const itemLine = document.createElement("p");
        itemLine.textContent = line;
        summaryItems.append(itemLine);
      });
    }
  }

  if (summaryTotal) {
    summaryTotal.textContent = `合計金額：${formatMoney(subtotalAmount)}`;
  }

  itemState.forEach((item) => {
    if (item.quantityInput) {
      item.quantityInput.value = String(item.quantity);
    }

    if (item.quantityValue) {
      item.quantityValue.textContent = String(item.quantity);
    }
  });

  if (selectedPickupInput) {
    selectedPickupInput.value = selectedPickupId;
  }

  if (subtotalAmountValue) {
    subtotalAmountValue.textContent = formatMoney(subtotalAmount);
  }

  if (selectedDateInput) {
    selectedDateInput.value = selectedDateId;
  }

  if (selectedSlotInput) {
    selectedSlotInput.value = selectedSlotId;
  }
};

const isDateAvailable = (date) => date.slots.some((slot) => slot.inventory > 0);

const selectPickupCard = (pickupId) => {
  if (!pickupGrid) {
    return;
  }

  const pickupCards = Array.from(pickupGrid.querySelectorAll("[data-pickup-id]"));
  const nextPickupId = pickupCards.some((card) => card.dataset.pickupId === pickupId)
    ? pickupId
    : pickupCards[0]?.dataset.pickupId || "";

  selectedPickupId = nextPickupId;

  pickupCards.forEach((card) => {
    const isSelected = card.dataset.pickupId === selectedPickupId;
    card.classList.toggle("is-selected", isSelected);
    card.setAttribute("aria-pressed", String(isSelected));
  });

  updateOrderSummary();
};

const initializePickupCards = () => {
  if (!pickupGrid) {
    return;
  }

  pickupGrid.querySelectorAll("[data-pickup-id]").forEach((card) => {
    card.addEventListener("click", () => {
      selectPickupCard(card.dataset.pickupId || "");
    });
  });

  selectPickupCard(selectedPickupId);
};

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

  const selectedDate = orderCalendar.find((date) => date.id === selectedDateId && isDateAvailable(date));
  const firstAvailableDate = selectedDate || orderCalendar.find(isDateAvailable);
  if (firstAvailableDate) {
    selectedDateId = firstAvailableDate.id;
    const firstButton = dateGrid.querySelector(`[data-date-id="${selectedDateId}"]`);
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
      <strong>${slot.time}</strong>
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

  const selectedSlot = selectedDate.slots.find((slot) => slot.id === selectedSlotId && slot.inventory > 0);
  const firstAvailable = selectedSlot || selectedDate.slots.find((slot) => slot.inventory > 0);
  if (firstAvailable) {
    selectedSlotId = firstAvailable.id;
    const firstButton = slotGrid.querySelector(`[data-slot-id="${firstAvailable.id}"]`);
    firstButton?.classList.add("is-selected");
    firstButton?.setAttribute("aria-pressed", "true");
  }

  updateOrderSummary();
};

function resetOrderForm() {
  orderForm?.reset();

  setFormMessage("");
  termsAgreement?.setCustomValidity("");

  selectedPickupId = selectedPickupInput?.defaultValue || "";
  selectedDateId = selectedDateInput?.defaultValue || "";
  selectedSlotId = selectedSlotInput?.defaultValue || "";

  orderItems.forEach((item) => {
    const quantityInput = item.querySelector("[data-quantity-input]");
    const defaultQuantity = quantityInput?.defaultValue || "0";

    item.dataset.quantity = defaultQuantity;

    if (quantityInput) {
      quantityInput.value = defaultQuantity;
    }
  });

  selectPickupCard(selectedPickupId);
  renderDates();
  renderSlots();
}

const openTermsDialog = () => {
  if (!termsModal || !closeTermsModal) {
    return;
  }

  termsModalReturnFocus = document.activeElement;
  termsModal.hidden = false;
  document.body.classList.add("terms-modal-open");
  closeTermsModal.focus();
};

const closeTermsDialog = () => {
  if (!termsModal) {
    return;
  }

  termsModal.hidden = true;
  document.body.classList.remove("terms-modal-open");

  if (termsModalReturnFocus instanceof HTMLElement) {
    termsModalReturnFocus.focus();
  }
};

const openCompletionDialog = () => {
  if (!completionModal || !closeCompletionModal) {
    return;
  }

  renderCompletionSummary();
  completionModalReturnFocus = document.activeElement;
  completionModal.hidden = false;
  document.body.classList.add("completion-modal-open");
  closeCompletionModal.focus();
};

const closeCompletionDialog = () => {
  if (!completionModal) {
    return;
  }

  completionModal.hidden = true;
  document.body.classList.remove("completion-modal-open");
  resetOrderForm();

  if (completionModalReturnFocus instanceof HTMLElement) {
    completionModalReturnFocus.focus();
  }
};

openTermsModal?.addEventListener("click", openTermsDialog);
closeTermsModal?.addEventListener("click", closeTermsDialog);
closeCompletionModal?.addEventListener("click", closeCompletionDialog);

termsModal?.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  if (event.key === "Tab" && closeTermsModal) {
    event.preventDefault();
    closeTermsModal.focus();
  }
});

completionModal?.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  if (event.key !== "Tab") {
    return;
  }

  const focusableElements = completionModal.querySelectorAll("button, a[href]");
  if (focusableElements.length === 0) {
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
});

termsAgreement?.addEventListener("change", () => {
  termsAgreement.setCustomValidity("");
});

termsAgreement?.addEventListener("invalid", () => {
  setFormMessage("請先勾選同意預訂須知與個資聲明。");
});

orderItems.forEach((item) => {
  item.querySelectorAll("[data-quantity-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const currentQuantity = Number(item.dataset.quantity || 0);
      const nextQuantity =
        button.dataset.quantityAction === "increase" ? currentQuantity + 1 : Math.max(0, currentQuantity - 1);

      item.dataset.quantity = String(nextQuantity);
      updateOrderSummary();
    });
  });
});

orderForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!selectedPickupId) {
    setFormMessage("請先選擇取貨據點。");
    return;
  }

  if (!selectedDateId) {
    setFormMessage("請先選擇想把這隻狠雞帶回家的日期。");
    return;
  }

  if (!selectedSlotId) {
    setFormMessage("請再選一個尚可預購的取餐時段。");
    return;
  }

  if (termsAgreement && !termsAgreement.checked) {
    termsAgreement.setCustomValidity("請先勾選同意火候研究所預訂須知與個資聲明。");
    orderForm.reportValidity();
    setFormMessage("請先勾選同意預訂須知與個資聲明。");
    termsAgreement.focus();
    return;
  }

  if (!orderForm.reportValidity()) {
    setFormMessage("請確認姓、名、聯絡電話與電子信箱皆已填寫。");
    return;
  }

  setFormMessage("");
  openCompletionDialog();
});

initializePickupCards();

if (dateGrid && slotGrid) {
  renderDates();
  renderSlots();
}
