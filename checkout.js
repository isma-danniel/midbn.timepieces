// ==========================================
// MIDBN CHECKOUT.JS - FINAL (Works with Order + Stock)
// ==========================================

const API =
  "https://script.google.com/macros/s/AKfycbwzKvHmOeestXmMxg-_mQitkAELdSSxZdz1TMTnSUABdmZu7YenCD2zLDBESHV5wBbX/exec";

const cartItemsContainer = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const clearCartBtn = document.getElementById("clearCartBtn");
const checkoutForm = document.getElementById("checkoutForm");
const placeOrderBtn = document.getElementById("placeOrderBtn");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ========================
// Helpers
// ========================
function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function formatBND(n) {
  return "BND " + toNumber(n).toFixed(2);
}

function getQty(item) {
  return Math.max(1, toNumber(item.qty ?? item.quantity ?? 1));
}

function setQty(item, qty) {
  item.qty = qty;
  if ("quantity" in item) item.quantity = qty;
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function calcTotal() {
  return cart.reduce((sum, it) => {
    return sum + getQty(it) * toNumber(it.price);
  }, 0);
}

// ========================
// Render Cart
// ========================
function renderCart() {
  cartItemsContainer.innerHTML = "";

  if (!cart.length) {
    cartItemsContainer.innerHTML = `<div class="empty-cart">Your cart is empty</div>`;
    cartTotalEl.innerText = "BND 0";
    return;
  }

  cart.forEach((item, index) => {
    const qty = getQty(item);
    const price = toNumber(item.price);
    const lineTotal = qty * price;

    cartItemsContainer.innerHTML += `
      <div class="cart-item">
        <div class="cart-left">
          <strong>${item.name}</strong>
          <small>${formatBND(price)} each</small>
        </div>

        <div class="cart-right">
          <div class="line-price">${formatBND(lineTotal)}</div>

          <div class="qty-controls">
            <button class="qty-btn" data-action="minus" data-index="${index}" ${qty <= 1 ? "disabled" : ""}>−</button>
            <span class="qty-number">${qty}</span>
            <button class="qty-btn" data-action="plus" data-index="${index}">+</button>
            <button class="remove-btn" data-action="remove" data-index="${index}">Remove</button>
          </div>
        </div>
      </div>
    `;
  });

  cartTotalEl.innerText = formatBND(calcTotal());
}

renderCart();

// ========================
// Qty & Remove Controls
// ========================
cartItemsContainer.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const action = btn.dataset.action;
  const index = Number(btn.dataset.index);
  if (!Number.isFinite(index)) return;

  let qty = getQty(cart[index]);

  if (action === "plus") qty += 1;
  if (action === "minus") qty = Math.max(1, qty - 1);
  if (action === "remove") {
    cart.splice(index, 1);
    saveCart();
    renderCart();
    return;
  }

  setQty(cart[index], qty);
  saveCart();
  renderCart();
});

// ========================
// Clear Cart
// ========================
if (clearCartBtn) {
  clearCartBtn.addEventListener("click", () => {
    cart = [];
    localStorage.removeItem("cart");
    renderCart();
  });
}

// ========================
// Safari-safe POST
// ========================
function postToAPI(data) {
  return fetch(API, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

// ========================
// Submit Order
// ========================
checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!cart.length) {
    alert("Cart is empty!");
    return;
  }

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const payment = document.getElementById("payment").value;

  if (!name || !phone || !address || !payment) {
    alert("Please complete all fields.");
    return;
  }

  const total = formatBND(calcTotal());

  placeOrderBtn.disabled = true;
  placeOrderBtn.textContent = "Processing...";

  // 1️⃣ Save Order
  postToAPI({
    type: "order",
    cart,
    total,
    customer: { name, phone, address, payment }
  })
  .then(orderRes => {
    if (orderRes.status !== "success") throw new Error("Order failed");

    // 2️⃣ Deduct Stock
    return postToAPI({
      type: "stock",
      cart
    }).then(() => orderRes);
  })
  .then(orderRes => {
    localStorage.setItem("lastOrder", JSON.stringify({
      orderId: orderRes.orderId,
      customer: { name, phone, address, payment },
      cart,
      total
    }));

    localStorage.removeItem("cart");
    window.location.href = "success.html";
  })
  .catch(err => {
    console.error(err);
    alert("Server error. Check deployment.");
    placeOrderBtn.disabled = false;
    placeOrderBtn.textContent = "Place Order";
  });
});
