// ==========================================
// MIDBN CHECKOUT.JS - FINAL (FIXED)
// - Correct products endpoint: GET ?action=products
// - Live stock limit on +/- and submit
// - Anti double submit (client)
// - Supports server fields: receiptPdfUrl (and pdfUrl fallback)
// ==========================================

const API =
  "https://script.google.com/macros/s/AKfycbxIEBzhxDsw_ovkvHLWWNmsxqVwp45UkUW8owkVJ77CaJfye6-NomyUMU0tsJXAy9nAVQ/exec";

const cartItemsContainer = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const clearCartBtn = document.getElementById("clearCartBtn");
const checkoutForm = document.getElementById("checkoutForm");
const placeOrderBtn = document.getElementById("placeOrderBtn");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// --- Anti double submit (client) ---
let isSubmitting = false;

// --- Live stock cache ---
let liveStockMap = null; // { "id": stockNumber }
let lastStockFetchAt = 0;

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
  return cart.reduce((sum, it) => sum + getQty(it) * toNumber(it.price), 0);
}
function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ---------- Safari-safe POST ----------
function postToAPI(data) {
  return fetch(API, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(data)
  }).then((res) => res.json());
}

// ---------- GET live products (MUST use ?action=products) ----------
async function getLiveProductsSafe() {
  try {
    const res = await fetch(API + "?action=products", { method: "GET", cache: "no-store" });
    if (!res.ok) throw new Error("API not ok");
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("API not array");
    return data;
  } catch (err) {
    return null;
  }
}

async function ensureLiveStockMap() {
  // refresh every 30 seconds
  const now = Date.now();
  if (liveStockMap && (now - lastStockFetchAt) < 30000) return liveStockMap;

  const live = await getLiveProductsSafe();
  if (!live) return null;

  const map = {};
  live.forEach((p) => {
    if (p && p.id != null) map[String(p.id)] = toNumber(p.stock);
  });

  liveStockMap = map;
  lastStockFetchAt = now;
  return map;
}

function getMaxStockForItem(item) {
  const id = String(item.id ?? "");
  if (liveStockMap && id in liveStockMap) return liveStockMap[id];

  // fallback: if item has stock field
  const fallback = toNumber(item.stock);
  return fallback > 0 ? fallback : Infinity;
}

// ========================
// Render Cart (clamp + disable plus)
// ========================
function renderCart() {
  cartItemsContainer.innerHTML = "";

  if (!cart.length) {
    cartItemsContainer.innerHTML = `<div class="empty-cart">Your cart is empty</div>`;
    cartTotalEl.innerText = "BND 0";
    return;
  }

  cart.forEach((item, index) => {
    let qty = getQty(item);

    const maxStock = getMaxStockForItem(item);

    // clamp qty if maxStock known
    if (maxStock !== Infinity && qty > maxStock) {
      qty = Math.max(1, maxStock);
      setQty(item, qty);
      saveCart();
    }

    const price = toNumber(item.price);
    const lineTotal = qty * price;

    const minusDisabled = qty <= 1;
    const plusDisabled = (maxStock !== Infinity) ? qty >= maxStock : false;

    const stockHint =
      (maxStock !== Infinity)
        ? `<small>${formatBND(price)} each • Stock ${maxStock}</small>`
        : `<small>${formatBND(price)} each</small>`;

    cartItemsContainer.innerHTML += `
      <div class="cart-item">
        <div class="cart-left">
          <strong>${escapeHtml(item.name)}</strong>
          ${stockHint}
        </div>

        <div class="cart-right">
          <div class="line-price">${formatBND(lineTotal)}</div>

          <div class="qty-controls" aria-label="Quantity controls">
            <button type="button" class="qty-btn" data-action="minus" data-index="${index}" ${minusDisabled ? "disabled" : ""}>−</button>
            <span class="qty-number" aria-live="polite">${qty}</span>
            <button type="button" class="qty-btn" data-action="plus" data-index="${index}" ${plusDisabled ? "disabled" : ""}>+</button>
            <button type="button" class="remove-btn" data-action="remove" data-index="${index}">Remove</button>
          </div>
        </div>
      </div>
    `;
  });

  cartTotalEl.innerText = formatBND(calcTotal());
}

// initial render
renderCart();

// boot live stock once
(async function bootStock() {
  await ensureLiveStockMap();
  renderCart();
})();

// ========================
// Qty & Remove Controls
// ========================
cartItemsContainer.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const action = btn.dataset.action;
  const index = Number(btn.dataset.index);
  if (!Number.isFinite(index) || index < 0) return;

  cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!cart[index]) return;

  await ensureLiveStockMap();

  const item = cart[index];
  const maxStock = getMaxStockForItem(item);

  let qty = getQty(item);

  if (action === "plus") {
    if (maxStock !== Infinity && qty + 1 > maxStock) {
      alert("Maximum stock reached.");
      return;
    }
    qty += 1;
  }

  if (action === "minus") qty = Math.max(1, qty - 1);

  if (action === "remove") {
    cart.splice(index, 1);
    saveCart();
    renderCart();
    return;
  }

  if (maxStock !== Infinity && qty > maxStock) qty = Math.max(1, maxStock);

  setQty(item, qty);
  saveCart();
  renderCart();
});

// ========================
// Clear Cart
// ========================
if (clearCartBtn) {
  clearCartBtn.addEventListener("click", () => {
    if (!cart.length) return;
    const ok = confirm("Clear all items in cart?");
    if (!ok) return;
    cart = [];
    localStorage.removeItem("cart");
    renderCart();
  });
}

// ========================
// Submit Order (anti duplicate + stock recheck)
// ========================
checkoutForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (isSubmitting) return;
  isSubmitting = true;

  cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!cart.length) {
    alert("Cart is empty!");
    isSubmitting = false;
    return;
  }

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const payment = document.getElementById("payment").value;

  if (!name || !phone || !address || !payment) {
    alert("Please complete all fields.");
    isSubmitting = false;
    return;
  }

  await ensureLiveStockMap();

  // Validate all items against live stock
  for (const it of cart) {
    const maxStock = getMaxStockForItem(it);
    const qty = getQty(it);

    if (maxStock !== Infinity && maxStock <= 0) {
      alert(`Out of stock: ${it.name}`);
      renderCart();
      isSubmitting = false;
      return;
    }
    if (maxStock !== Infinity && qty > maxStock) {
      alert(`Quantity exceeds stock for: ${it.name} (Stock ${maxStock})`);
      renderCart();
      isSubmitting = false;
      return;
    }
  }

  const total = formatBND(calcTotal());

  placeOrderBtn.disabled = true;
  placeOrderBtn.textContent = "Processing...";

  // unique token for anti duplicate server
  const submitToken = `${Date.now()}_${Math.random().toString(16).slice(2)}`;

  try {
    const orderRes = await postToAPI({
      type: "order",
      token: submitToken, // server uses token/clientOrderId
      cart,
      total,
      customer: { name, phone, address, payment },
      sellerSignature: "MIDBN Official",
      status: "Pending Verification"
    });

    // IMPORTANT: your server returns "receiptPdfUrl"
    const pdfUrl = orderRes.receiptPdfUrl || orderRes.pdfUrl || "";

    if (orderRes.status === "duplicate") {
      localStorage.setItem("lastOrder", JSON.stringify({
        orderId: orderRes.orderId,
        pdfUrl,
        customer: { name, phone, address, payment },
        cart,
        total
      }));
      localStorage.removeItem("cart");
      window.location.href = "success.html";
      return;
    }

    if (orderRes.status !== "success") {
      throw new Error(orderRes.message || "Order failed");
    }

    localStorage.setItem("lastOrder", JSON.stringify({
      orderId: orderRes.orderId,
      pdfUrl,
      customer: { name, phone, address, payment },
      cart,
      total
    }));

    localStorage.removeItem("cart");
    window.location.href = "success.html";
  } catch (err) {
    console.error(err);
    alert("Server error. Check deployment / permissions.");
    placeOrderBtn.disabled = false;
    placeOrderBtn.textContent = "Place Order";
    isSubmitting = false;
  }
});
