// ==========================================
// MIDBN CHECKOUT.JS - FINAL (UPDATED + EMAIL)
// ==========================================

const API =
  "https://script.google.com/macros/s/AKfycbyovzomINZnABB1-DatSQgIA_OHu7OjuRD-D2yGMWU7i-xD7irSsXR1p2frILSv02eNxg/exec";

const cartItemsContainer = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const clearCartBtn = document.getElementById("clearCartBtn");
const checkoutForm = document.getElementById("checkoutForm");
const placeOrderBtn = document.getElementById("placeOrderBtn");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let isSubmitting = false;

let liveStockMap = null;
let lastStockFetchAt = 0;

function normId(v){ return String(v ?? "").trim(); }
function toNumber(v){ const n = Number(v); return Number.isFinite(n) ? n : 0; }
function formatBND(n){ return "BND " + toNumber(n).toFixed(2); }
function getQty(item){ return Math.max(1, toNumber(item.qty ?? item.quantity ?? 1)); }
function setQty(item, qty){ item.qty = qty; if ("quantity" in item) item.quantity = qty; }
function saveCart(){ localStorage.setItem("cart", JSON.stringify(cart)); }
function calcTotal(){ return cart.reduce((sum, it) => sum + getQty(it) * toNumber(it.price), 0); }

function escapeHtml(str){
  return String(str ?? "")
    .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
    .replaceAll('"',"&quot;").replaceAll("'","&#039;");
}

function resetSubmitUI(){
  isSubmitting = false;
  if (placeOrderBtn){
    placeOrderBtn.disabled = false;
    placeOrderBtn.textContent = "Place Order";
  }
}

function postToAPI(data) {
  return fetch(API, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(data)
  }).then(async (res) => {
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
    return json;
  });
}

async function getLiveProductsSafe() {
  try{
    const url = API + "?action=products&t=" + Date.now();
    const res = await fetch(url, { method:"GET", cache:"no-store" });
    if(!res.ok) throw new Error("API not ok");
    const data = await res.json();
    if(!Array.isArray(data)) throw new Error("API not array");
    return data;
  }catch{
    return null;
  }
}

async function ensureLiveStockMap() {
  const now = Date.now();
  if (liveStockMap && (now - lastStockFetchAt) < 30000) return liveStockMap;

  const live = await getLiveProductsSafe();
  if (!live) return null;

  const map = {};
  live.forEach(p=>{
    if(!p || p.id == null) return;
    map[normId(p.id)] = toNumber(p.stock);
  });

  liveStockMap = map;
  lastStockFetchAt = now;
  return map;
}

function getMaxStockForItem(item) {
  const id = normId(item.id);
  if (liveStockMap && Object.prototype.hasOwnProperty.call(liveStockMap, id)) {
    return toNumber(liveStockMap[id]);
  }
  return 0;
}

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
    if (qty > Math.max(1, maxStock)) {
      qty = Math.max(1, maxStock);
      setQty(item, qty);
      saveCart();
    }

    const price = toNumber(item.price);
    const lineTotal = qty * price;

    const minusDisabled = qty <= 1;
    const plusDisabled = qty >= maxStock;

    const stockHint = `<small>${formatBND(price)} each • Stock ${maxStock}</small>`;

    cartItemsContainer.innerHTML += `
      <div class="cart-item">
        <div class="cart-left">
          <strong>${escapeHtml(item.name)}</strong>
          ${stockHint}
        </div>

        <div class="cart-right">
          <div class="line-price">${formatBND(lineTotal)}</div>

          <div class="qty-controls">
            <button type="button" class="qty-btn" data-action="minus" data-index="${index}" ${minusDisabled ? "disabled" : ""}>−</button>
            <span class="qty-number">${qty}</span>
            <button type="button" class="qty-btn" data-action="plus" data-index="${index}" ${plusDisabled ? "disabled" : ""}>+</button>
            <button type="button" class="remove-btn" data-action="remove" data-index="${index}">Remove</button>
          </div>
        </div>
      </div>
    `;
  });

  cartTotalEl.innerText = formatBND(calcTotal());
}

renderCart();

(async function bootStock() {
  await ensureLiveStockMap();
  renderCart();
})();

cartItemsContainer.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const action = btn.dataset.action;
  const index = Number(btn.dataset.index);
  if (!Number.isFinite(index) || index < 0 || index >= cart.length) return;

  cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart[index];
  let qty = getQty(item);

  await ensureLiveStockMap();
  const maxStock = getMaxStockForItem(item);

  if (action === "plus") qty += 1;
  if (action === "minus") qty = Math.max(1, qty - 1);

  if (action === "remove") {
    cart.splice(index, 1);
    saveCart();
    renderCart();
    return;
  }

  if (qty > maxStock) {
    alert("Maximum stock reached.");
    qty = Math.max(1, maxStock);
  }

  setQty(item, qty);
  saveCart();
  renderCart();
});

if (clearCartBtn) {
  clearCartBtn.addEventListener("click", () => {
    if (!cart.length) return;
    if (!confirm("Clear all items in cart?")) return;
    cart = [];
    localStorage.removeItem("cart");
    renderCart();
  });
}

checkoutForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (isSubmitting) return;
  isSubmitting = true;

  cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!cart.length) {
    alert("Cart is empty!");
    resetSubmitUI();
    return;
  }

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = (document.getElementById("email")?.value || "").trim(); // NEW
  const address = document.getElementById("address").value.trim();
  const payment = document.getElementById("payment").value;

  if (!name || !phone || !address || !payment) {
    alert("Please complete all fields.");
    resetSubmitUI();
    return;
  }

  const map = await ensureLiveStockMap();
  if (!map) {
    alert("Unable to load live stock. Please try again.");
    resetSubmitUI();
    return;
  }

  for (const it of cart) {
    const id = normId(it.id);

    if (!Object.prototype.hasOwnProperty.call(map, id)) {
      alert(`Stock not found in sheet for ID: ${id} (${it.name}).`);
      resetSubmitUI();
      return;
    }

    const maxStock = toNumber(map[id]);
    const q = getQty(it);

    if (maxStock <= 0) {
      alert(`Out of stock: ${it.name}`);
      renderCart();
      resetSubmitUI();
      return;
    }
    if (q > maxStock) {
      alert(`Quantity exceeds stock for: ${it.name} (Stock ${maxStock})`);
      renderCart();
      resetSubmitUI();
      return;
    }
  }

  placeOrderBtn.disabled = true;
  placeOrderBtn.textContent = "Processing...";

  const token = `${Date.now()}_${Math.random().toString(16).slice(2)}`;

  try {
    const res = await postToAPI({
      type: "order",
      token,
      cart,
      customer: { name, phone, email, address, payment } // NEW
    });

    const pdfUrl = res.pdfUrl || res.receiptPdfUrl || "";

    if (res.status === "duplicate") {
      alert("This order was already submitted. Opening your receipt.");
    } else if (res.status !== "success") {
      throw new Error(res.message || "Order failed");
    }

    localStorage.setItem("lastOrder", JSON.stringify({
      orderId: res.orderId || "-",
      pdfUrl,
      customer: { name, phone, email, address, payment },
      cart,
      total: res.total || ""
    }));

    localStorage.removeItem("cart");
    window.location.href = "success.html";
  } catch (err) {
    console.error(err);
    alert("Server error: " + (err?.message || "Check deployment / permissions."));
    resetSubmitUI();
  }
});
