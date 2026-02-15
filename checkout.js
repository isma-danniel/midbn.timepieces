// ==========================================
// MIDBN CHECKOUT.JS (FULL - Delivery + Email server + Discount Code)
// ✅ Live stock limit (GET ?action=products)
// ✅ Delivery type + district + auto delivery charges
// ✅ Discount code (client preview) + sent to server for verification
// ✅ Server deducts stock + creates PDF + emails seller
// ==========================================

const API = "https://script.google.com/macros/s/AKfycbxPsVPZF7sqTyb6e0ywQerFcI-WkDEX2Jbx9hpbT2yqBbhF3AbuxTz9DWOVvZtBZjLxaw/exec"; // <-- your /exec URL

const cartItemsContainer = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const clearCartBtn = document.getElementById("clearCartBtn");
const checkoutForm = document.getElementById("checkoutForm");
const placeOrderBtn = document.getElementById("placeOrderBtn");

const deliveryTypeEl = document.getElementById("deliveryType");
const deliveryFields = document.getElementById("deliveryFields");
const districtEl = document.getElementById("district");
const addressEl = document.getElementById("address");
const deliveryFeeHint = document.getElementById("deliveryFeeHint");

// ✅ Discount UI (requires these IDs in HTML)
const discountCodeEl = document.getElementById("discountCode");
const discountHintEl = document.getElementById("discountHint");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let isSubmitting = false;

let liveStockMap = null;
let lastStockFetchAt = 0;

// ✅ Discount state
let discountAmount = 0;
let appliedDiscountCode = "";

function normId(v){ return String(v ?? "").trim(); }
function toNumber(v){ const n = Number(v); return Number.isFinite(n) ? n : 0; }
function formatBND(n){ return "BND " + toNumber(n).toFixed(2); }

function getQty(item){ return Math.max(1, toNumber(item.qty ?? item.quantity ?? 1)); }
function setQty(item, qty){ item.qty = qty; if ("quantity" in item) item.quantity = qty; }
function saveCart(){ localStorage.setItem("cart", JSON.stringify(cart)); }
function calcSubtotal(){ return cart.reduce((sum, it) => sum + getQty(it) * toNumber(it.price), 0); }

function escapeHtml(str){
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function resetSubmitUI(){
  isSubmitting = false;
  if(placeOrderBtn){
    placeOrderBtn.disabled = false;
    placeOrderBtn.textContent = "Place Order";
  }
}

function postToAPI(data){
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

async function getLiveProductsSafe(){
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

async function ensureLiveStockMap(){
  const now = Date.now();
  if (liveStockMap && (now - lastStockFetchAt) < 30000) return liveStockMap;

  const live = await getLiveProductsSafe();
  if(!live) return null;

  const map = {};
  live.forEach(p=>{
    if(!p || p.id == null) return;
    map[normId(p.id)] = toNumber(p.stock);
  });

  liveStockMap = map;
  lastStockFetchAt = now;
  return map;
}

function getMaxStockForItem(item){
  const id = normId(item.id);
  if(liveStockMap && Object.prototype.hasOwnProperty.call(liveStockMap, id)){
    return toNumber(liveStockMap[id]);
  }
  return 0; // safe default
}

// --------------------
// Delivery charges (client)
// --------------------
function computeDeliveryFee(deliveryType, district){
  if(deliveryType !== "Delivery") return 0;
  const d = String(district || "").toLowerCase().trim();
  if(d === "bsb" || d === "bandar seri begawan") return 5;
  if(d === "tutong") return 10;
  if(d === "belait" || d === "kuala belait" || d === "temburong") return 15;
  return 0;
}

function updateDeliveryUI(){
  const deliveryType = deliveryTypeEl?.value || "Delivery";
  const show = deliveryType === "Delivery";

  if(deliveryFields) deliveryFields.style.display = show ? "block" : "none";

  if(districtEl){
    districtEl.required = show;
    if(!show) districtEl.value = "";
  }
  if(addressEl){
    addressEl.required = show;
    if(!show) addressEl.value = "";
  }

  const fee = computeDeliveryFee(deliveryType, districtEl?.value || "");
  if(deliveryFeeHint) deliveryFeeHint.textContent = "Delivery charges: " + formatBND(fee);

  renderCart();
}

deliveryTypeEl?.addEventListener("change", updateDeliveryUI);
districtEl?.addEventListener("change", updateDeliveryUI);

// --------------------
// Discount (client preview)
// IMPORTANT: Server MUST verify for real.
// --------------------
function computeDiscount(subtotal, codeRaw){
  const code = String(codeRaw || "").trim().toUpperCase();
  if(!code) return { amount: 0, label: "" };

  // ✅ Example codes (replace with your real private codes)
  if(code === "MIDBN10") return { amount: subtotal * 0.10, label: "10% discount applied" };
  if(code === "VIP20")   return { amount: subtotal * 0.20, label: "20% VIP discount applied" };

  return { amount: 0, label: "Code will be verified" };
}

function updateDiscountPreview(){
  const subtotal = calcSubtotal();
  const code = discountCodeEl?.value || "";

  const res = computeDiscount(subtotal, code);
  discountAmount = Math.max(0, toNumber(res.amount));
  appliedDiscountCode = String(code || "").trim();

  if(discountHintEl && res.label) discountHintEl.textContent = res.label;
  renderCart();
}

discountCodeEl?.addEventListener("input", updateDiscountPreview);

// --------------------
// Render cart
// --------------------
function renderCart(){
  if(!cartItemsContainer) return;

  cartItemsContainer.innerHTML = "";

  if(!cart.length){
    cartItemsContainer.innerHTML = `<div class="empty-cart">Your cart is empty</div>`;
    if(cartTotalEl) cartTotalEl.innerText = formatBND(0);
    return;
  }

  cart.forEach((item, index)=>{
    let qty = getQty(item);
    const maxStock = getMaxStockForItem(item);

    if(qty > Math.max(1, maxStock)){
      qty = Math.max(1, maxStock);
      setQty(item, qty);
      saveCart();
    }

    const price = toNumber(item.price);
    const lineTotal = qty * price;

    const minusDisabled = qty <= 1;
    const plusDisabled = qty >= maxStock;

    cartItemsContainer.innerHTML += `
      <div class="cart-item">
        <div class="cart-left">
          <strong>${escapeHtml(item.name)}</strong>
          <small>${formatBND(price)} each • Stock ${maxStock}</small>
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

  const deliveryType = deliveryTypeEl?.value || "Delivery";
  const district = districtEl?.value || "";
  const deliveryFee = computeDeliveryFee(deliveryType, district);

  const subtotal = calcSubtotal();
  const grandTotal = Math.max(0, subtotal + deliveryFee - discountAmount);

  if(cartTotalEl) cartTotalEl.innerText = formatBND(grandTotal);

  if(discountHintEl){
    if(discountAmount > 0){
      discountHintEl.textContent = `Discount: -${formatBND(discountAmount)}`;
    } else if ((discountCodeEl?.value || "").trim()){
      // keep it simple
      if(discountHintEl.textContent.trim() === "") discountHintEl.textContent = "Code will be verified";
    } else {
      discountHintEl.textContent = "";
    }
  }
}

// initial render + load stock
renderCart();
(async function bootStock(){
  await ensureLiveStockMap();
  renderCart();
  updateDeliveryUI();
  updateDiscountPreview();
})();

// qty controls
cartItemsContainer?.addEventListener("click", async (e)=>{
  const btn = e.target.closest("button");
  if(!btn) return;

  const action = btn.dataset.action;
  const index = Number(btn.dataset.index);
  if(!Number.isFinite(index) || index < 0 || index >= cart.length) return;

  cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart[index];
  let qty = getQty(item);

  await ensureLiveStockMap();
  const maxStock = getMaxStockForItem(item);

  if(action === "plus") qty += 1;
  if(action === "minus") qty = Math.max(1, qty - 1);

  if(action === "remove"){
    cart.splice(index, 1);
    saveCart();
    updateDiscountPreview();
    renderCart();
    return;
  }

  if(qty > maxStock){
    alert("Maximum stock reached.");
    qty = Math.max(1, maxStock);
  }

  setQty(item, qty);
  saveCart();
  updateDiscountPreview();
  renderCart();
});

// clear cart
clearCartBtn?.addEventListener("click", ()=>{
  if(!cart.length) return;
  if(!confirm("Clear all items in cart?")) return;
  cart = [];
  localStorage.removeItem("cart");
  updateDiscountPreview();
  renderCart();
});

// submit order
checkoutForm?.addEventListener("submit", async (e)=>{
  e.preventDefault();
  if(isSubmitting) return;
  isSubmitting = true;

  cart = JSON.parse(localStorage.getItem("cart")) || [];
  if(!cart.length){
    alert("Cart is empty!");
    resetSubmitUI();
    return;
  }

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const payment = document.getElementById("payment").value;

  const deliveryType = deliveryTypeEl?.value || "Delivery";
  const district = districtEl?.value || "";
  const address = (addressEl?.value || "").trim();

  const discountCode = String(discountCodeEl?.value || "").trim();

  if(!name || !phone || !payment){
    alert("Please complete all fields.");
    resetSubmitUI();
    return;
  }

  if(deliveryType === "Delivery"){
    if(!district){
      alert("Please select district.");
      resetSubmitUI();
      return;
    }
    if(!address){
      alert("Please enter delivery address.");
      resetSubmitUI();
      return;
    }
  }

  // ensure live stock for strict validate
  const map = await ensureLiveStockMap();
  if(!map){
    alert("Unable to load live stock. Please try again.");
    resetSubmitUI();
    return;
  }

  for(const it of cart){
    const id = normId(it.id);
    if(!Object.prototype.hasOwnProperty.call(map, id)){
      alert(`Stock not found in sheet for ID: ${id} (${it.name}).\nPlease fix the ID in Google Sheet.`);
      resetSubmitUI();
      return;
    }
    const maxStock = toNumber(map[id]);
    const q = getQty(it);

    if(maxStock <= 0){
      alert(`Out of stock: ${it.name}`);
      renderCart();
      resetSubmitUI();
      return;
    }
    if(q > maxStock){
      alert(`Quantity exceeds stock for: ${it.name} (Stock ${maxStock})`);
      renderCart();
      resetSubmitUI();
      return;
    }
  }

  const subtotal = calcSubtotal();
  const deliveryFee = computeDeliveryFee(deliveryType, district);

  // recompute discount based on current subtotal
  const dRes = computeDiscount(subtotal, discountCode);
  discountAmount = Math.max(0, toNumber(dRes.amount));
  appliedDiscountCode = discountCode;

  const grandTotal = Math.max(0, subtotal + deliveryFee - discountAmount);

  if(placeOrderBtn){
    placeOrderBtn.disabled = true;
    placeOrderBtn.textContent = "Processing...";
  }

  const token = `${Date.now()}_${Math.random().toString(16).slice(2)}`;

  try{
    const res = await postToAPI({
      type: "order",
      token,
      cart,
      subtotal,
      deliveryFee,
      discountCode: appliedDiscountCode,
      discountAmount,
      grandTotal,
      customer: {
        name,
        phone,
        payment,
        deliveryType,
        district,
        address
      }
    });

    if(res.status === "duplicate"){
      alert("This order was already submitted.");
    } else if(res.status !== "success"){
      throw new Error(res.message || "Order failed");
    }

    const pdfUrl = res.pdfUrl || "";
    localStorage.setItem("lastOrder", JSON.stringify({
      orderId: res.orderId || "-",
      pdfUrl,
      customer: { name, phone, payment, deliveryType, district, address },
      cart,
      total: formatBND(grandTotal),
      discountCode: appliedDiscountCode,
      discountAmount: formatBND(discountAmount)
    }));

    localStorage.removeItem("cart");
    window.location.href = "success.html";
  }catch(err){
    console.error(err);
    alert("Server error: " + (err?.message || "Check deployment / permissions."));
    resetSubmitUI();
  }
});
