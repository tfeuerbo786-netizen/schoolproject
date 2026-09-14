// ---- Cart helpers (sessionStorage) ----

const CART_KEY = "bookHavenCart";

function getCart() {
  const raw = sessionStorage.getItem(CART_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  sessionStorage.setItem(CART_KEY, JSON.stringify(items));
}

function addToCart(item) {
  const items = getCart();
  items.push(item);
  saveCart(items);
}

function clearCart() {
  sessionStorage.removeItem(CART_KEY);
}

// ---- Cart UI ----

function onAddToCart(event) {
  const button = event.currentTarget;
  const article = button.closest(".product-item");
  if (!article) return;
  const heading = article.querySelector("h3");
  const img = article.querySelector("img");
  const name = heading ? heading.textContent.trim() : "Unknown item";
  const imgSrc = img ? img.getAttribute("src") : "";
  addToCart({ name: name, imgSrc: imgSrc, addedAt: Date.now() });
  alert('"' + name + '" was added to your cart.');
}

function renderCartItems() {
  const list = document.getElementById("cart-items-list");
  const emptyMsg = document.getElementById("cart-empty-message");
  const summary = document.getElementById("cart-summary");
  const totalSpan = document.getElementById("cart-total-count");
  if (!list || !emptyMsg || !summary || !totalSpan) return;

  const items = getCart();

  list.innerHTML = "";

  if (items.length === 0) {
    emptyMsg.hidden = false;
    summary.hidden = true;
    return;
  }

  emptyMsg.hidden = true;
  summary.hidden = false;

  items.forEach(function (item, index) {
    const li = document.createElement("li");
    li.className = "cart-item";

    const img = document.createElement("img");
    img.className = "cart-item-img";
    if (item.imgSrc) {
      img.src = item.imgSrc;
    }
    img.alt = item.name;

    const info = document.createElement("div");
    info.className = "cart-item-info";

    const title = document.createElement("p");
    title.className = "cart-item-title";
    title.textContent = item.name;

    info.appendChild(title);

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "cart-item-remove";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", function () {
      removeFromCart(index);
    });

    li.appendChild(img);
    li.appendChild(info);
    li.appendChild(removeBtn);
    list.appendChild(li);
  });

  totalSpan.textContent = String(items.length);
}

function removeFromCart(index) {
  const items = getCart();
  items.splice(index, 1);
  saveCart(items);
  renderCartItems();
}

function openCartModal() {
  const modal = document.getElementById("cart-modal");
  if (!modal) return;
  renderCartItems();
  modal.hidden = false;
}

function closeCartModal() {
  const modal = document.getElementById("cart-modal");
  if (!modal) return;
  modal.hidden = true;
}

function onClearCart() {
  clearCart();
  renderCartItems();
  alert("Cart cleared.");
}

function onProcessOrder() {
  const items = getCart();
  if (items.length === 0) {
    alert("Your cart is empty. Add some items first!");
    return;
  }
  const names = items.map(function (i) { return i.name; }).join(", ");
  alert("Thank you for your order! Items: " + names);
  clearCart();
  renderCartItems();
  closeCartModal();
}

// ---- Contact form (localStorage) ----

const CONTACT_KEY = "bookHavenContact";
const FEEDBACK_KEY = "bookHavenFeedback";

function onContactSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const data = {
    name: form.querySelector("#contact-name").value,
    email: form.querySelector("#contact-email").value,
    phone: form.querySelector("#contact-phone").value,
    message: form.querySelector("#contact-message").value,
    submittedAt: Date.now(),
  };
  const existing = [];
  try {
    const raw = localStorage.getItem(CONTACT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) existing.push.apply(existing, parsed);
    }
  } catch {
    // ignore corrupted data
  }
  existing.push(data);
  localStorage.setItem(CONTACT_KEY, JSON.stringify(existing));
  form.reset();
  alert("Thank you for your message. Your contact info has been saved.");
}

function onFeedbackSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const data = {
    orderNumber: form.querySelector("#order-number").value,
    feedback: form.querySelector("#feedback").value,
    submittedAt: Date.now(),
  };
  const existing = [];
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) existing.push.apply(existing, parsed);
    }
  } catch {
    // ignore corrupted data
  }
  existing.push(data);
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(existing));
  form.reset();
  alert("Thank you for your feedback. It has been saved.");
}

// ---- Newsletter subscribe ----

function onSubscribe(event) {
  event.preventDefault();
  alert("Thank you for subscribing.");
}

// ---- Init ----

function init() {
  document.querySelectorAll(".subscribe-button").forEach(function (btn) {
    btn.addEventListener("click", onSubscribe);
  });

  document.querySelectorAll(".add-to-cart").forEach(function (btn) {
    btn.addEventListener("click", onAddToCart);
  });

  var viewCartBtn = document.querySelector(".view-cart-btn");
  if (viewCartBtn) viewCartBtn.addEventListener("click", openCartModal);

  var closeBtn = document.querySelector(".cart-close-btn");
  if (closeBtn) closeBtn.addEventListener("click", closeCartModal);

  var cartOverlay = document.getElementById("cart-modal");
  if (cartOverlay) {
    cartOverlay.addEventListener("click", function (event) {
      if (event.target === cartOverlay) closeCartModal();
    });
  }

  document.querySelectorAll(".clear-cart").forEach(function (btn) {
    btn.addEventListener("click", onClearCart);
  });

  document.querySelectorAll(".process-order").forEach(function (btn) {
    btn.addEventListener("click", onProcessOrder);
  });

  document.querySelectorAll(".contact-form").forEach(function (form) {
    form.addEventListener("submit", onContactSubmit);
  });

  var feedbackForms = document.querySelectorAll(".feedback-card .about-form");
  feedbackForms.forEach(function (form) {
    form.addEventListener("submit", onFeedbackSubmit);
  });
}

document.addEventListener("DOMContentLoaded", init);
