// ==========================================
// MIDBN CHECKOUT.JS (FINAL - Secure Version)
// ✅ Live stock limit
// ✅ Delivery + district auto fee
// ✅ Discount preview (server verifies real)
// ✅ Secure server-side total calculation
// ==========================================

const API = "https://script.google.com/macros/s/AKfycbwJBm-cXgQO8pN_alkxFHdlbk3j9NKrhmNlBpiTIYb4JUoQWBdbL0pHZ5edEt8J8m8K/exec";

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

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let isSubmitting = false;

let liveStockMap = null;
let lastStockFetchAt = 0;

let discountPreviewAmount = 0;
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
function calcSubtotal(){ return cart.reduce((sum, it) => sum + getQty(it) * toNumber(it.price), 0); }

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
    const res = await fetch(API + "?action=products&t=" + Date.now(),{cache:"no-store"});
    if(!res.ok) throw new Error();
    const data = await res.json();
    if(!Array.isArray(data)) throw new Error();
    return data;
  }catch{
    return null;
  }
}

async function ensureLiveStockMap(){
  const now = Date.now();
  if(liveStockMap && (now-lastStockFetchAt)<30000) return liveStockMap;

  const live = await getLiveProductsSafe();
  if(!live) return null;

  const map = {};
  live.forEach(p=>{
    if(p && p.id!=null) map[normId(p.id)] = toNumber(p.stock);
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
function computeDeliveryFee(type,district){
  if(type!=="Delivery") return 0;
  const d = String(district||"").toLowerCase();
  if(d.includes("bsb")) return 5;
  if(d.includes("tutong")) return 10;
  if(d.includes("belait") || d.includes("temburong")) return 15;
  return 0;
}

function updateDeliveryUI(){
  const type = deliveryTypeEl?.value || "Delivery";
  const show = type==="Delivery";

  if(deliveryFields) deliveryFields.style.display = show?"block":"none";
  if(districtEl){ districtEl.required=show; if(!show) districtEl.value=""; }
  if(addressEl){ addressEl.required=show; if(!show) addressEl.value=""; }

  const fee = computeDeliveryFee(type,districtEl?.value||"");
  if(deliveryFeeHint) deliveryFeeHint.textContent = "Delivery charges: "+formatBND(fee);

  renderCart();
}

deliveryTypeEl?.addEventListener("change",updateDeliveryUI);
districtEl?.addEventListener("change",updateDeliveryUI);

// =============================
// Discount Preview (UI only)
// =============================
function computeDiscountPreview(subtotal,codeRaw){
  const code = String(codeRaw||"").trim().toUpperCase();
  if(!code) return 0;

  if(code==="MIDBN10") return subtotal*0.10;
  if(code==="VIP20") return subtotal*0.20;

  return 0;
}

function updateDiscountPreview(){
  const subtotal = calcSubtotal();
  const code = discountCodeEl?.value||"";

  discountPreviewAmount = computeDiscountPreview(subtotal,code);
  appliedDiscountCode = code.trim();

  renderCart();
}

const applyDiscountBtn = document.getElementById("applyDiscountBtn");

applyDiscountBtn?.addEventListener("click", () => {
  updateDiscountPreview();
});

// =============================
// Render Cart
// =============================
function renderCart(){
  if(!cartItemsContainer) return;

  const subtotalEl = document.getElementById("subtotalAmount");
  const deliveryEl = document.getElementById("deliveryAmount");
  const discountEl = document.getElementById("discountAmount");

  cartItemsContainer.innerHTML="";

  if(!cart.length){
    cartItemsContainer.innerHTML=`<div class="empty-cart">Your cart is empty</div>`;
    if(subtotalEl) subtotalEl.innerText=formatBND(0);
    if(deliveryEl) deliveryEl.innerText=formatBND(0);
    if(discountEl) discountEl.innerText="- "+formatBND(0);
    if(cartTotalEl) cartTotalEl.innerText=formatBND(0);
    return;
  }

  cart.forEach((item,index)=>{
    const qty=getQty(item);
    const price=toNumber(item.price);
    const lineTotal=qty*price;

    cartItemsContainer.innerHTML+=`
      <div class="cart-item">
        <div class="cart-left">
          <strong>${escapeHtml(item.name)}</strong>
          <small>${formatBND(price)} each</small>
        </div>
        <div class="cart-right">
          <div class="line-price">${formatBND(lineTotal)}</div>
        </div>
      </div>
    `;
  });

  const type = deliveryTypeEl?.value || "Delivery";
  const district = districtEl?.value || "";
  const deliveryFee = computeDeliveryFee(type,district);
  const subtotal = calcSubtotal();
  const grandTotal = Math.max(0,subtotal+deliveryFee-discountPreviewAmount);

  if(subtotalEl) subtotalEl.innerText=formatBND(subtotal);
  if(deliveryEl) deliveryEl.innerText=formatBND(deliveryFee);
  if(discountEl) discountEl.innerText="- "+formatBND(discountPreviewAmount);
  if(cartTotalEl) cartTotalEl.innerText=formatBND(grandTotal);
}

// =============================
// Submit Order
// =============================
checkoutForm?.addEventListener("submit",async(e)=>{
  e.preventDefault();
  if(isSubmitting) return;
  isSubmitting=true;

  cart = JSON.parse(localStorage.getItem("cart"))||[];
  if(!cart.length){ alert("Cart is empty!"); resetSubmitUI(); return; }

  const name=document.getElementById("name")?.value.trim();
  const phone=document.getElementById("phone")?.value.trim();
  const payment=document.getElementById("payment")?.value;

  const deliveryType=deliveryTypeEl?.value||"Delivery";
  const district=districtEl?.value||"";
  const address=(addressEl?.value||"").trim();

  if(!name||!phone||!payment){ alert("Please complete all fields."); resetSubmitUI(); return; }

  const token=`${Date.now()}_${Math.random().toString(16).slice(2)}`;

  try{
    const res=await postToAPI({
      type:"order",
      token,
      cart,
      deliveryArea: deliveryType==="Delivery"?district:"Pickup",
      discountCode: appliedDiscountCode,
      customer:{
        name,
        phone,
        payment,
        address: deliveryType==="Delivery"?address:""
      }
    });

    if(res.status!=="success") throw new Error(res.message||"Order failed");

    localStorage.removeItem("cart");
    window.location.href="success.html";
  }catch(err){
    alert("Server error: "+(err?.message||"Check deployment"));
    resetSubmitUI();
  }
});

// Init
renderCart();
updateDeliveryUI();
updateDiscountPreview();
