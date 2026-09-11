function onSubscribe(event) {
  event.preventDefault();
  alert("Thank you for subscribing.");
}

function onAddToCart() {
  alert("Item added to the cart.");
}

function onClearCart() {
  alert("Cart cleared.");
}

function onProcessOrder() {
  alert("Thank you for your order.");
}

function onContactSubmit(event) {
  event.preventDefault();
  alert("Thank you for your message.");
}

function init() {
  document.querySelectorAll(".subscribe-button").forEach((btn) => {
    btn.addEventListener("click", onSubscribe);
  });

  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", onAddToCart);
  });

  const clearCartBtn = document.querySelector(".clear-cart");
  if (clearCartBtn) clearCartBtn.addEventListener("click", onClearCart);

  const processOrderBtn = document.querySelector(".process-order");
  if (processOrderBtn) processOrderBtn.addEventListener("click", onProcessOrder);

  document.querySelectorAll(".contact-form").forEach((form) => {
    form.addEventListener("submit", onContactSubmit);
  });
}

document.addEventListener("DOMContentLoaded", init);
