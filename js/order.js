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
const checkoutButton = document.querySelector(".checkout-button");
const formMessage = document.querySelector("#formMessage");
const termsAgreement = document.querySelector("#termsAgreement");
const termsModal = document.querySelector("#termsModal");
const termsModalContent = document.querySelector("#termsModalContent");
const openTermsModal = document.querySelector("#openTermsModal");
const closeTermsModal = document.querySelector("#closeTermsModal");
const termsScrollHint = document.querySelector("#termsScrollHint");
const completionModal = document.querySelector("#completionModal");
const closeCompletionModal = document.querySelector("#closeCompletionModal");
const completionOrderId = document.querySelector("#completionOrderId");
const completionPhone = document.querySelector("#completionPhone");
const completionDate = document.querySelector("#completionDate");
const completionSlot = document.querySelector("#completionSlot");
const completionItems = document.querySelector("#completionItems");
const completionStatus = document.querySelector("#completionStatus");
const scheduleError = document.querySelector("#scheduleError");
const orderItemsError = document.querySelector("#orderItemsError");
const termsAgreementError = document.querySelector("#termsAgreementError");
const orderTextControls = orderForm
  ? Array.from(orderForm.querySelectorAll("input[name='familyName'], input[name='givenName'], input[name='phone'], input[name='email'], textarea[name='note']"))
  : [];

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
let hasCompletedTermsReading = false;

const setFormMessage = (message) => {
  if (formMessage) {
    formMessage.textContent = message;
  }
};

const setErrorText = (element, message) => {
  if (element) {
    element.textContent = message;
  }
};

const updateCheckoutButtonState = () => {
  if (checkoutButton) {
    checkoutButton.disabled = !(termsAgreement && termsAgreement.checked);
  }
};

const getOrderControlMessage = (control) => {
  const validity = control.validity;

  if (control.name === "familyName" && validity.valueMissing) {
    return "請輸入姓氏。";
  }

  if (control.name === "givenName" && validity.valueMissing) {
    return "請輸入名字。";
  }

  if (control.name === "phone") {
    if (validity.valueMissing) {
      return "請輸入聯絡電話。";
    }

    if (validity.patternMismatch) {
      return "請輸入 09 開頭的 10 碼手機號碼。";
    }
  }

  if (control.name === "email") {
    if (validity.valueMissing) {
      return "請輸入電子信箱。";
    }

    if (validity.typeMismatch) {
      return "請輸入有效的 Email 格式。";
    }
  }

  if (control.name === "note" && validity.tooLong) {
    return "備註最多 200 個字。";
  }

  return "";
};

const setControlError = (control, message) => {
  const error = orderForm?.querySelector(`[data-error-for="${control.name}"]`);
  setErrorText(error, message);
  control.setAttribute("aria-invalid", String(Boolean(message)));
};

const validateOrderControl = (control) => {
  const message = control.checkValidity() ? "" : getOrderControlMessage(control);
  setControlError(control, message);
  return message;
};

const validateSchedule = () => {
  let message = "";

  if (!selectedPickupId) {
    message = "請先選擇取貨據點。";
  } else if (!selectedDateId) {
    message = "請先選擇取餐日期。";
  } else if (!selectedSlotId) {
    message = "請選擇尚可預購的取餐時段。";
  }

  setErrorText(scheduleError, message);
  return message;
};

const validateOrderItems = () => {
  const hasSelectedItems = getOrderItemState().some((item) => item.quantity > 0);
  const message = hasSelectedItems ? "" : "請至少選擇 1 份餐點。";
  setErrorText(orderItemsError, message);
  return message;
};

const validateTermsAgreement = () => {
  let message = "";

  if (!hasCompletedTermsReading) {
    message = "請先開啟並閱讀預訂須知，捲到底後才能勾選同意。";
  } else if (termsAgreement && !termsAgreement.checked) {
    message = "請先勾選同意預訂須知與個資聲明。";
  }

  setErrorText(termsAgreementError, message);
  termsAgreement?.setAttribute("aria-invalid", String(Boolean(message)));
  termsAgreement?.closest(".terms-consent")?.classList.toggle("is-invalid", Boolean(message));
  return message;
};

const clearValidationState = () => {
  setErrorText(scheduleError, "");
  setErrorText(orderItemsError, "");
  setErrorText(termsAgreementError, "");
  orderTextControls.forEach((control) => setControlError(control, ""));
  termsAgreement?.setAttribute("aria-invalid", "false");
  termsAgreement?.closest(".terms-consent")?.classList.remove("is-invalid");
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

  if (scheduleError?.textContent) {
    validateSchedule();
  }
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
      if (scheduleError?.textContent) {
        validateSchedule();
      }
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
      if (scheduleError?.textContent) {
        validateSchedule();
      }
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
  clearValidationState();
  hasCompletedTermsReading = false;

  if (termsAgreement) {
    termsAgreement.disabled = true;
    termsAgreement.checked = false;
  }

  updateCheckoutButtonState();

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
  if (!termsModal || !closeTermsModal || !termsModalContent) {
    return;
  }

  termsModalReturnFocus = document.activeElement;
  termsModal.hidden = false;
  document.body.classList.add("terms-modal-open");
  termsModalContent.scrollTop = 0;
  updateTermsCloseState();
  termsModalContent.focus();
};

const closeTermsDialog = () => {
  if (!termsModal || closeTermsModal?.disabled) {
    return;
  }

  termsModal.hidden = true;
  document.body.classList.remove("terms-modal-open");

  if (termsModalReturnFocus instanceof HTMLElement) {
    termsModalReturnFocus.focus();
  }
};

const isTermsScrolledToEnd = () => {
  if (!termsModalContent) {
    return false;
  }

  const remainingScroll =
    termsModalContent.scrollHeight - termsModalContent.scrollTop - termsModalContent.clientHeight;
  return remainingScroll <= 2;
};

function completeTermsReading() {
  hasCompletedTermsReading = true;

  if (termsAgreement) {
    termsAgreement.disabled = false;
  }

  if (termsAgreementError?.textContent) {
    validateTermsAgreement();
  }
}

function updateTermsCloseState() {
  if (!closeTermsModal || !termsScrollHint) {
    return;
  }

  if (isTermsScrolledToEnd()) {
    completeTermsReading();
  }

  closeTermsModal.disabled = !hasCompletedTermsReading;
  termsScrollHint.textContent = hasCompletedTermsReading
    ? "已閱讀完畢，可以關閉。"
    : "請將預訂須知捲到底後即可關閉。";
}

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
termsModalContent?.addEventListener("scroll", updateTermsCloseState);

termsModal?.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  if (event.key === "Tab" && closeTermsModal) {
    event.preventDefault();
    if (closeTermsModal.disabled) {
      termsModalContent?.focus();
    } else {
      closeTermsModal.focus();
    }
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
  validateTermsAgreement();
  updateCheckoutButtonState();
});

termsAgreement?.addEventListener("invalid", () => {
  validateTermsAgreement();
});

orderTextControls.forEach((control) => {
  control.addEventListener("blur", () => {
    validateOrderControl(control);
  });

  control.addEventListener("input", () => {
    if (control.getAttribute("aria-invalid") === "true") {
      validateOrderControl(control);
    }
  });
});

orderItems.forEach((item) => {
  item.querySelectorAll("[data-quantity-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const currentQuantity = Number(item.dataset.quantity || 0);
      const nextQuantity =
        button.dataset.quantityAction === "increase" ? currentQuantity + 1 : Math.max(0, currentQuantity - 1);

      item.dataset.quantity = String(nextQuantity);
      updateOrderSummary();
      if (orderItemsError?.textContent) {
        validateOrderItems();
      }
    });
  });
});

orderForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  setFormMessage("");

  const scheduleMessage = validateSchedule();
  const itemsMessage = validateOrderItems();
  const controlMessages = orderTextControls.map((control) => ({
    control,
    message: validateOrderControl(control),
  }));
  const termsMessage = validateTermsAgreement();
  const firstInvalidControl = controlMessages.find((result) => result.message)?.control;

  if (scheduleMessage || itemsMessage || firstInvalidControl || termsMessage) {
    if (firstInvalidControl) {
      firstInvalidControl.focus();
    } else if (itemsMessage) {
      orderItems[0]?.querySelector("[data-quantity-action='increase']")?.focus();
    } else if (termsMessage) {
      if (hasCompletedTermsReading) {
        termsAgreement?.focus();
      } else {
        openTermsModal?.focus();
      }
    }

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

updateCheckoutButtonState();
