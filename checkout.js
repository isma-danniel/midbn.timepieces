// ==========================================
// MIDBN CHECKOUT.JS - FINAL+ (FULL)
// - Anti duplicate submit (client + server token)
// - Live stock qty limit on +/- and on submit
// - Safari-safe response parsing (fixes “Server error…” when JSON parse fails)
// - Receives pdfUrl from Apps Script and stores in lastOrder
// ==========================================

const API =
  "https://script.google.com/macros/s/AKfycbxq1nZ9s4SnQu2hOsC_6caxWjCVl0h9psWF-GnpNphMLITMsfMJnfEzrT3K21XdF6ILAw/exec";

const cartItemsContainer = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const clearCartBtn = document.getElementById("clearCartBtn");
const checkoutForm = document.getElementById("checkoutForm");
const placeOrderBtn = document.getElementById("placeOrderBtn");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ---------- Anti duplicate (client) ----------
let isSubmitting = false;

// ---------- Live stock cache ----------
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

// ---------- Safari-safe POST (TEXT -> JSON) ----------
function postToAPI(data) {
  return fetch(API, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(data),
  })
    .then((res) => res.text())
    .then((text) => {
      try {
        return JSON.parse(text);
      } catch (e) {
        console.error("Invalid JSON response from server:", text);
        throw new Error("Invalid JSON from server");
      }
    });
}

// ---------- Fetch live products (GET) ----------
async function getLiveProductsSafe() {
  try {
    // Your Code.gs supports action=products (based on your screenshot)
    const url = API + "?action=products";
    const res = await fetch(url, { method: "GET", cache: "no-store" });
    if (!res.ok) throw new Error("API not ok");
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("API not array");
    return data;
  } catch (err) {
    console.warn("Live products fetch failed:", err);
    return null;
  }
}

async function ensureLiveStockMap() {
  // refresh every 30 seconds
  const now = Date.now();
  if (liveStockMap && now - lastStockFetchAt < 30000) return liveStockMap;

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

  // fallback: if cart item has stock already, use it, else unknown
  const fallback = toNumber(item.stock);
  return fallback > 0 ? fallback : Infinity;
}

// ========================
// Render Cart (stock clamp + disable plus)
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

    // clamp qty to stock if known
    if (maxStock !== Infinity && qty > maxStock) {
      qty = Math.max(1, maxStock);
      setQty(item, qty);
      saveCart();
    }

    const price = toNumber(item.price);
    const lineTotal = qty * price;

    const minusDisabled = qty <= 1;
    const plusDisabled = maxStock !== Infinity ? qty >= maxStock : false;

    const stockHint =
      maxStock !== Infinity
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
            <button
              type="button"
              class="qty-btn"
              data-action="minus"
              data-index="${index}"
              ${minusDisabled ? "disabled" : ""}
              aria-label="Decrease quantity"
            >−</button>

            <span class="qty-number" aria-live="polite">${qty}</span>

            <button
              type="button"
              class="qty-btn"
              data-action="plus"
              data-index="${index}"
              ${plusDisabled ? "disabled" : ""}
              aria-label="Increase quantity"
            >+</button>

            <button
              type="button"
              class="remove-btn"
              data-action="remove"
              data-index="${index}"
              aria-label="Remove item"
            >Remove</button>
          </div>
        </div>
      </div>
    `;
  });

  cartTotalEl.innerText = formatBND(calcTotal());
}

// initial render
renderCart();

// load live stock once (so checkout clamp works)
(async function bootStock() {
  await ensureLiveStockMap();
  renderCart();
})();

// ========================
// Qty & Remove Controls (live stock enforced)
// ========================
cartItemsContainer.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const action = btn.dataset.action;
  const index = Number(btn.dataset.index);
  if (!Number.isFinite(index) || index < 0 || index >= cart.length) return;

  // always reload cart from storage to avoid mismatch
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!cart[index]) return;

  const item = cart[index];
  let qty = getQty(item);

  // refresh stock before changing
  await ensureLiveStockMap();
  const maxStock = getMaxStockForItem(item);

  if (action === "plus") {
    const nextQty = qty + 1;

    if (maxStock !== Infinity && nextQty > maxStock) {
      alert("Maximum stock reached.");
      renderCart();
      return;
    }

    qty = nextQty;
    setQty(item, qty);
    saveCart();
    renderCart();
    return;
  }

  if (action === "minus") {
    qty = Math.max(1, qty - 1);
    setQty(item, qty);
    saveCart();
    renderCart();
    return;
  }

  if (action === "remove") {
    cart.splice(index, 1);
    saveCart();
    renderCart();
    return;
  }
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
// Submit Order
// - Anti duplicate (client + token)
// - Stock recheck for ALL items before submit
// ========================
checkoutForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (isSubmitting) return; // anti double tap
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

  // refresh live stock and validate ALL items before submit
  await ensureLiveStockMap();
  for (const it of cart) {
    const maxStock = getMaxStockForItem(it);

    if (maxStock !== Infinity && maxStock <= 0) {
      alert(`Out of stock: ${it.name}`);
      renderCart();
      isSubmitting = false;
      return;
    }

    if (maxStock !== Infinity && getQty(it) > maxStock) {
      alert(`Quantity exceeds stock for: ${it.name} (Stock ${maxStock})`);
      renderCart();
      isSubmitting = false;
      return;
    }
  }

  const total = formatBND(calcTotal());

  placeOrderBtn.disabled = true;
  placeOrderBtn.textContent = "Processing...";

  // unique client token helps server anti-duplicate too
  const submitToken = `${Date.now()}_${Math.random().toString(16).slice(2)}`;

  try {
    // 1) Save order (server generates PDF + returns pdfUrl)
    const orderRes = await postToAPI({
      type: "order",
      token: submitToken, // ✅ anti duplicate key
      cart,
      total,
      customer: { name, phone, address, payment },
      sellerSignature: "MIDBN Official", // sheet only
      status: "Pending Verification", // sheet only
    });

    // Server-side duplicate handling
    if (orderRes && orderRes.status === "duplicate") {
      alert("This order was already submitted. Opening your receipt.");

      localStorage.setItem(
        "lastOrder",
        JSON.stringify({
          orderId: orderRes.orderId,
          pdfUrl: orderRes.pdfUrl || "",
          customer: { name, phone, address, payment },
          cart,
          total,
        })
      );

      localStorage.removeItem("cart");
      window.location.href = "success.html";
      return;
    }

    if (!orderRes || orderRes.status !== "success") {
      throw new Error(orderRes?.message || "Order failed");
    }

    // 2) Deduct stock
    const stockRes = await postToAPI({ type: "stock", cart });
    if (stockRes && stockRes.status && stockRes.status !== "success" && stockRes.status !== "ok") {
      // some scripts return "ok" for stock; accept both
      console.warn("Stock response:", stockRes);
    }

    // Save for success
    localStorage.setItem(
      "lastOrder",
      JSON.stringify({
        orderId: orderRes.orderId,
        pdfUrl: orderRes.pdfUrl || "",
        customer: { name, phone, address, payment },
        cart,
        total,
      })
    );

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
