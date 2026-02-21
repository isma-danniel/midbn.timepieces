// ==========================================
// MIDBN CHECKOUT.JS (SECURE + RESTORED FEATURES) + DELI3 PREVIEW
// ✅ Live stock limit (GET ?action=products)
// ✅ Qty +/- controls + Remove + Clear cart
// ✅ Delivery type + district + auto delivery charges
// ✅ Discount code with APPLY button
// ✅ UI Preview supports:
//    - RAMADHAN10 (10% off subtotal, if you want)
//    - DELI3 (delivery fee -$3 when subtotal >= $50, delivery only)
// ✅ Secure: server recalculates totals; client sends only cart + deliveryArea + discountCode
// ==========================================

const API = "https://script.google.com/macros/s/AKfycbzFyPlIK4mbeAVBG4bqrIUkA5Zov-UCo25QUmhyx_G8LPFZEOUpXV6cO51mwJC9u70e/exec";

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

const discountCodeEl = document.getElementById("discountCode");
const discountHintEl = document.getElementById("discountHint");
const applyDiscountBtn = document.getElementById("applyDiscountBtn"); // ✅ Apply button beside input

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let isSubmitting = false;

// live stock cache
let liveStockMap = null;
let lastStockFetchAt = 0;

// discount state (preview only)
let discountPreviewAmount = 0; // item discount preview (percent/fixed)
let deliveryDiscountPreviewAmount = 0; // delivery discount preview (DELI3)
let appliedDiscountCode = "";

// =============================
// Helpers
// =============================
function normId(v){ return String(v ?? "").trim(); }
function toNumber(v){ const n = Number(v); return Number.isFinite(n) ? n : 0; }
function formatBND(n){ return "BND " + toNumber(n).toFixed(2); }

function getQty(item){ return Math.max(1, toNumber(item.qty ?? item.quantity ?? 1)); }
function setQty(item, qty){ item.qty = qty; if ("quantity" in item) item.quantity = qty; }
function saveCart(){ localStorage.setItem("cart", JSON.stringify(cart)); }

function calcSubtotal(){
  return cart.reduce((sum, it) => sum + getQty(it) * toNumber(it.price), 0);
}

function escapeHtml(str){
  return String(str ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function resetSubmitUI(){
  isSubmitting = false;
  if(placeOrderBtn){
    placeOrderBtn.disabled = false;
    placeOrderBtn.textContent = "Place Order";
  }
}

function postToAPI(data){
  return fetch(API,{
    method:"POST",
    headers:{ "Content-Type":"text/plain;charset=utf-8" },
    body: JSON.stringify(data)
  }).then(async(res)=>{
    const json = await res.json().catch(()=>({}));
    if(!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
    return json;
  });
}

// =============================
// Stock
// =============================
async function getLiveProductsSafe(){
  try{
    const res = await fetch(API + "?action=products&t=" + Date.now(), { cache:"no-store" });
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
  if(liveStockMap && (now - lastStockFetchAt) < 30000) return liveStockMap;

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
  if(liveStockMap && Object.prototype.hasOwnProperty.call(liveStockMap,id)){
    return toNumber(liveStockMap[id]);
  }
  return 0;
}

// =============================
// Delivery
// =============================
function computeDeliveryFee(type, district){
  if(type !== "Delivery") return 0;
  const d = String(district || "").toLowerCase().trim();
  if(d === "bsb" || d.includes("bandar")) return 5;
  if(d.includes("tutong")) return 10;
  if(d.includes("belait") || d.includes("kuala belait")) return 15;
  if(d.includes("temburong")) return 15;
  return 0;
}

function updateDeliveryUI(){
  const type = deliveryTypeEl?.value || "Delivery";
  const show = (type === "Delivery");

  if(deliveryFields) deliveryFields.style.display = show ? "block" : "none";
  if(districtEl){ districtEl.required = show; if(!show) districtEl.value = ""; }
  if(addressEl){ addressEl.required = show; if(!show) addressEl.value = ""; }

  // show base fee hint (renderCart will show final fee after discount)
  const fee = computeDeliveryFee(type, districtEl?.value || "");
  if(deliveryFeeHint) deliveryFeeHint.textContent = "Delivery charges: " + formatBND(fee);

  renderCart(); // update totals
}

deliveryTypeEl?.addEventListener("change", updateDeliveryUI);
districtEl?.addEventListener("change", updateDeliveryUI);

// =============================
// Discount Preview (UI ONLY)
// Server must verify for real
// Supports:
//   - RAMADHAN10: 10% off subtotal (optional)
//   - DELI3: delivery fee -3 when subtotal>=50 (delivery only)
// =============================
function computeDiscountPreview(subtotal, codeRaw){
  const code = String(codeRaw || "").trim().toUpperCase();
  if(!code) return 0;

  // ✅ percent-off example
  if(code === "RAMADHAN10") return subtotal * 0.10;

  // DELI3 is delivery discount (handled separately)
  if(code === "HK42") return 0;

  return 0;
}

function computeDeliveryDiscountPreview(subtotal, deliveryType, district, codeRaw){
  const code = String(codeRaw || "").trim().toUpperCase();
  if(code !== "HK42") return 0;
  if(toNumber(subtotal) < 50) return 0;
  if(deliveryType !== "Delivery") return 0;

  const baseFee = computeDeliveryFee(deliveryType, district);
  return Math.min(3, baseFee); // -3 max, never exceed delivery fee
}

function setDiscountHint(status, msg){
  if(!discountHintEl) return;
  discountHintEl.classList.remove("success","error");
  discountHintEl.textContent = msg || "";
  if(status) discountHintEl.classList.add(status);
}

// Apply button = “confirm”
function applyDiscount(){
  const subtotal = calcSubtotal();
  const code = String(discountCodeEl?.value || "").trim();

  appliedDiscountCode = code; // always send what user typed; server verifies

  // preview amounts
  discountPreviewAmount = Math.max(0, computeDiscountPreview(subtotal, code));
  deliveryDiscountPreviewAmount = Math.max(
    0,
    computeDeliveryDiscountPreview(
      subtotal,
      deliveryTypeEl?.value || "Delivery",
      districtEl?.value || "",
      code
    )
  );

  if(!code){
    setDiscountHint("", "");
  } else if(discountPreviewAmount > 0 || deliveryDiscountPreviewAmount > 0){
    setDiscountHint("success", "Code Applied ✅");
  } else {
    // not necessarily invalid; could be server-only code
    setDiscountHint("error", "Please select your districy first ❌");
  }

  renderCart();
}

applyDiscountBtn?.addEventListener("click", (e)=>{
  e.preventDefault();
  applyDiscount();
});

// If user edits input after apply, mark as not applied yet (optional UX)
discountCodeEl?.addEventListener("input", ()=>{
  const typed = String(discountCodeEl?.value || "").trim();
  if(typed !== String(appliedDiscountCode || "").trim()){
    discountPreviewAmount = 0;
    deliveryDiscountPreviewAmount = 0;
    setDiscountHint("", "");
    renderCart();
  }
});

// =============================
// Render Cart + Breakdown totals
// Requires HTML IDs:
//   #subtotalAmount, #deliveryAmount, #discountAmount, #cartTotal
// =============================
function renderCart(){
  if(!cartItemsContainer) return;

  const subtotalEl = document.getElementById("subtotalAmount");
  const deliveryEl = document.getElementById("deliveryAmount");
  const discountEl = document.getElementById("discountAmount");

  cartItemsContainer.innerHTML = "";

  if(!cart.length){
    cartItemsContainer.innerHTML = `<div class="empty-cart">Your cart is empty</div>`;
    if(subtotalEl) subtotalEl.innerText = formatBND(0);
    if(deliveryEl) deliveryEl.innerText = formatBND(0);
    if(discountEl) discountEl.innerText = "- " + formatBND(0);
    if(cartTotalEl) cartTotalEl.innerText = formatBND(0);
    if(deliveryFeeHint) deliveryFeeHint.textContent = "Delivery charges: " + formatBND(0);
    return;
  }

  // enforce max stock if we have it
  cart.forEach((item, index)=>{
    let qty = getQty(item);
    const maxStock = getMaxStockForItem(item);

    if(maxStock > 0 && qty > maxStock){
      qty = Math.max(1, maxStock);
      setQty(item, qty);
      saveCart();
    }

    const price = toNumber(item.price);
    const lineTotal = qty * price;

    const minusDisabled = qty <= 1;
    const plusDisabled = (maxStock > 0) ? (qty >= maxStock) : false;

    cartItemsContainer.innerHTML += `
      <div class="cart-item">
        <div class="cart-left">
          <strong>${escapeHtml(item.name)}</strong>
          <small>
            ${formatBND(price)} each
            ${maxStock >= 0 ? ` • Stock ${maxStock}` : ``}
          </small>
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

  const type = deliveryTypeEl?.value || "Delivery";
  const district = districtEl?.value || "";

  const subtotal = calcSubtotal();

  // base delivery fee then apply delivery discount preview
  const baseDeliveryFee = computeDeliveryFee(type, district);
  const deliveryDiscount = Math.max(
    0,
    computeDeliveryDiscountPreview(subtotal, type, district, appliedDiscountCode)
  );
  const finalDeliveryFee = Math.max(0, baseDeliveryFee - deliveryDiscount);

  // item discount preview (eg RAMADHAN10)
  const itemDiscount = Math.max(0, computeDiscountPreview(subtotal, appliedDiscountCode));

  // totals
  const grandTotal = Math.max(0, subtotal + finalDeliveryFee - itemDiscount);

  if(subtotalEl) subtotalEl.innerText = formatBND(subtotal);
  if(deliveryEl) deliveryEl.innerText = formatBND(finalDeliveryFee);

  // show combined discount line (delivery discount + item discount)
  const totalDiscountShown = Math.max(0, deliveryDiscount + itemDiscount);
  if(discountEl) discountEl.innerText = "- " + formatBND(totalDiscountShown);

  if(cartTotalEl) cartTotalEl.innerText = formatBND(grandTotal);

  if(deliveryFeeHint){
    // show final fee with discount applied
    deliveryFeeHint.textContent = "Delivery charges: " + formatBND(finalDeliveryFee);
  }
}

// =============================
// Qty / Remove controls
// =============================
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

    // recompute preview because subtotal changed
    const subtotal = calcSubtotal();
    discountPreviewAmount = Math.max(0, computeDiscountPreview(subtotal, appliedDiscountCode));
    deliveryDiscountPreviewAmount = Math.max(
      0,
      computeDeliveryDiscountPreview(
        subtotal,
        deliveryTypeEl?.value || "Delivery",
        districtEl?.value || "",
        appliedDiscountCode
      )
    );

    renderCart();
    return;
  }

  if(maxStock > 0 && qty > maxStock){
    alert("Maximum stock reached.");
    qty = Math.max(1, maxStock);
  }

  setQty(item, qty);
  saveCart();

  const subtotal = calcSubtotal();
  discountPreviewAmount = Math.max(0, computeDiscountPreview(subtotal, appliedDiscountCode));
  deliveryDiscountPreviewAmount = Math.max(
    0,
    computeDeliveryDiscountPreview(
      subtotal,
      deliveryTypeEl?.value || "Delivery",
      districtEl?.value || "",
      appliedDiscountCode
    )
  );

  renderCart();
});

// =============================
// Clear cart
// =============================
clearCartBtn?.addEventListener("click", ()=>{
  if(!cart.length) return;
  if(!confirm("Clear all items in cart?")) return;
  cart = [];
  localStorage.removeItem("cart");
  discountPreviewAmount = 0;
  deliveryDiscountPreviewAmount = 0;
  appliedDiscountCode = "";
  if(discountCodeEl) discountCodeEl.value = "";
  setDiscountHint("", "");
  renderCart();
});

// =============================
// Submit Order (server verifies coupon + totals)
// =============================
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

  const name = document.getElementById("name")?.value.trim();
  const phone = document.getElementById("phone")?.value.trim();
  const payment = document.getElementById("payment")?.value;

  const deliveryType = deliveryTypeEl?.value || "Delivery";
  const district = districtEl?.value || "";
  const address = (addressEl?.value || "").trim();

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

  // strict stock validation before submit
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
      resetSubmitUI();
      return;
    }
    if(q > maxStock){
      alert(`Quantity exceeds stock for: ${it.name} (Stock ${maxStock})`);
      resetSubmitUI();
      return;
    }
  }

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

      // ✅ server uses this for fee lookup
      deliveryArea: (deliveryType === "Delivery") ? district : "Pickup",

      // ✅ send code (server verifies + applies)
      discountCode: String(appliedDiscountCode || "").trim(),

      customer: {
        name,
        phone,
        payment,
        address: (deliveryType === "Delivery") ? address : ""
      }
    });

    if(res.status !== "success"){
      throw new Error(res.message || "Order failed");
    }

    const pdfUrl = res.pdfUrl || "";

    localStorage.setItem("lastOrder", JSON.stringify({
      orderId: res.orderId || "-",
      pdfUrl,
      customer: { name, phone, payment, deliveryType, district, address },
      cart
    }));

    localStorage.removeItem("cart");
    window.location.href = "success.html";
  }catch(err){
    console.error(err);
    alert("Server error: " + (err?.message || "Check deployment / permissions."));
    resetSubmitUI();
  }
});

// =============================
// Boot
// =============================
renderCart();
(async function boot(){
  await ensureLiveStockMap();
  renderCart();
  updateDeliveryUI();
  // do not auto-apply coupon; user must click Apply
})();
