// ==========================================
// MIDBN script-products.js (COMPLETE + STOCK SYNC UPGRADE)
// - Requires watchlist.js loaded FIRST (window.products)
// - Live stock/price from Code.gs: ?action=products
// - Sold out separator + badge (based on AVAILABLE stock)
// - Cart count bottom button
// - FIX: Available stock = product.stock (live) - qty already in cart
// ==========================================

const API =
  "https://script.google.com/macros/s/AKfycbyovzomINZnABB1-DatSQgIA_OHu7OjuRD-D2yGMWU7i-xD7irSsXR1p2frILSv02eNxg/exec";

// ---------- Helpers ----------
function normId(v){ return String(v ?? "").trim(); }
function toNumber(v){ const n = Number(v); return Number.isFinite(n) ? n : 0; }

// ---------- Safety: watchlist.js must load first ----------
if (!Array.isArray(window.products)) {
  console.error("watchlist.js not loaded or window.products is not an array");
  window.products = [];
}

// ==========================================
// DOM
// ==========================================
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const brandFilter = document.getElementById("brandFilter");
const categoryFilter = document.getElementById("categoryFilter");
const gradeFilter = document.getElementById("gradeFilter");
const minPrice = document.getElementById("minPrice");
const maxPrice = document.getElementById("maxPrice");

const hamburger = document.getElementById("hamburger");
const filters = document.getElementById("filters");

const quickViewModal = document.getElementById("quickViewModal");
const modalImg = document.getElementById("modalImg");
const modalName = document.getElementById("modalName");
const modalPrice = document.getElementById("modalPrice");
const modalStock = document.getElementById("modalStock");
const modalDetails = document.getElementById("modalDetails");
const closeModal = document.getElementById("closeModal");
const modalAddCart = document.getElementById("modalAddCart");
const goCheckoutBottom = document.getElementById("goCheckoutBottom");

// ==========================================
// State
// ==========================================
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentQuickProduct = null;

// ==========================================
// STOCK SYNC (Available stock = Live stock - Qty in cart)
// ==========================================
function refreshCartFromStorage(){
  cart = JSON.parse(localStorage.getItem("cart")) || [];
}

function getCartQtyById(id){
  const cid = normId(id);
  const c = JSON.parse(localStorage.getItem("cart")) || [];
  return c.reduce((sum, it) => sum + (normId(it.id) === cid ? toNumber(it.qty || 0) : 0), 0);
}

function availableStock(product){
  return Math.max(0, toNumber(product.stock) - getCartQtyById(product.id));
}

// ==========================================
// CART COUNT
// ==========================================
function cartCount(){
  refreshCartFromStorage();
  return cart.reduce((sum, it) => sum + toNumber(it.qty || 0), 0);
}

function updateCheckoutButton(){
  if(!goCheckoutBottom) return;
  const count = cartCount();
  goCheckoutBottom.textContent = count > 0 ? `🛒 (${count}) Go to Checkout` : `🛒 Go to Checkout`;
}
updateCheckoutButton();

// ==========================================
// HAMBURGER TOGGLE
// ==========================================
function toggleFilters(){ filters?.classList.toggle("active"); }

if(hamburger && filters){
  hamburger.addEventListener("click", toggleFilters);
  hamburger.addEventListener("keydown", (e)=>{
    if(e.key === "Enter" || e.key === " "){
      e.preventDefault();
      toggleFilters();
    }
  });
}

// ==========================================
// RENDER (SOLD OUT SEPARATOR + BADGE) - based on AVAILABLE stock
// ==========================================
function renderProducts(list){
  if(!productGrid) return;
  productGrid.innerHTML = "";

  if(!list.length){
    productGrid.innerHTML = `<p style="opacity:.6;text-align:center;padding:20px;">No products found.</p>`;
    return;
  }

  const inStock = [];
  const soldOut = [];
  list.forEach(p => (availableStock(p) > 0 ? inStock : soldOut).push(p));

  function makeCard(p, isSold){
    const card = document.createElement("div");
    card.className = "product-card" + (isSold ? " soldout" : "");
    card.dataset.id = p.id;

    const labelHtml = isSold
      ? `<div class="label soldout-badge">SOLD OUT</div>`
      : (p.label ? `<div class="label">${p.label}</div>` : "");

    card.innerHTML = `
      <div class="img-wrap">
        <img src="${p.img}" alt="${p.name}" loading="lazy" decoding="async">
        ${labelHtml}
      </div>

      <div class="card-body">
        <div class="brand">${p.brand || ""}</div>
        <div class="name product-name">${p.name || ""}</div>
        <div class="price">BND ${toNumber(p.price).toFixed(2)}</div>
        <div class="stock">Stock: ${availableStock(p)}</div>
        <a href="#" class="more-details-btn">${isSold ? "View Details →" : "More Details →"}</a>
      </div>
    `;

    card.querySelector("img")?.addEventListener("click", ()=>openQuickView(p));
    card.querySelector(".more-details-btn")?.addEventListener("click", (e)=>{
      e.preventDefault();
      openQuickView(p);
    });

    return card;
  }

  inStock.forEach(p => productGrid.appendChild(makeCard(p, false)));

  if(soldOut.length){
    const sep = document.createElement("div");
    sep.className = "soldout-sep";
    sep.textContent = "SOLD OUT";
    productGrid.appendChild(sep);

    soldOut.forEach(p => productGrid.appendChild(makeCard(p, true)));
  }
}

// ==========================================
// FILTER + SORT
// ==========================================
function inStockFirstComparator(a, b){
  const aIn = availableStock(a) > 0 ? 1 : 0;
  const bIn = availableStock(b) > 0 ? 1 : 0;
  if (aIn !== bIn) return bIn - aIn;
  return 0;
}

function filterSortProducts(){
  const list = Array.isArray(window.products) ? window.products : [];

  let filtered = list.filter(p=>{
    const q = (searchInput?.value || "").toLowerCase().trim();
    const searchMatch = !q || ((p.name + " " + p.brand).toLowerCase().includes(q));

    const brandMatch = !brandFilter?.value || p.brand === brandFilter.value;
    const categoryMatch = !categoryFilter?.value || p.category === categoryFilter.value;
    const gradeMatch = !gradeFilter?.value || p.grade === gradeFilter.value;

    const min = (minPrice?.value ?? "") === "" ? null : Number(minPrice.value);
    const max = (maxPrice?.value ?? "") === "" ? null : Number(maxPrice.value);

    const minMatch = min === null || toNumber(p.price) >= min;
    const maxMatch = max === null || toNumber(p.price) <= max;

    return searchMatch && brandMatch && categoryMatch && gradeMatch && minMatch && maxMatch;
  });

  // Default: in stock first (based on available)
  filtered.sort(inStockFirstComparator);

  if(sortSelect?.value === "az"){
    filtered.sort((a,b)=>{
      const pri = inStockFirstComparator(a,b);
      if(pri !== 0) return pri;
      return String(a.name || "").localeCompare(String(b.name || ""));
    });
  }

  if(sortSelect?.value === "priceLow"){
    filtered.sort((a,b)=>{
      const pri = inStockFirstComparator(a,b);
      if(pri !== 0) return pri;
      return toNumber(a.price) - toNumber(b.price);
    });
  }

  if(sortSelect?.value === "inStock"){
    filtered.sort(inStockFirstComparator);
  }

  renderProducts(filtered);
}

searchInput?.addEventListener("input", filterSortProducts);
sortSelect?.addEventListener("change", filterSortProducts);
brandFilter?.addEventListener("change", filterSortProducts);
categoryFilter?.addEventListener("change", filterSortProducts);
gradeFilter?.addEventListener("change", filterSortProducts);
minPrice?.addEventListener("input", filterSortProducts);
maxPrice?.addEventListener("input", filterSortProducts);

// Initial render from watchlist immediately
filterSortProducts();

// ==========================================
// QUICK VIEW MODAL (uses AVAILABLE stock)
// ==========================================
function openQuickView(product){
  currentQuickProduct = product;

  refreshCartFromStorage();

  if(modalImg) modalImg.src = product.img || "";
  if(modalName) modalName.textContent = product.name || "";
  if(modalPrice) modalPrice.textContent = `BND ${toNumber(product.price).toFixed(2)}`;
  if(modalStock) modalStock.textContent = `Stock: ${availableStock(product)}`;
  if(modalDetails) modalDetails.textContent = product.details || "";

  if(modalAddCart){
    const out = availableStock(product) <= 0;
    modalAddCart.disabled = out;
    modalAddCart.textContent = out ? "Out of Stock" : "+ Add to Cart";
    modalAddCart.classList.remove("added");
  }

  if(quickViewModal){
    quickViewModal.style.display = "flex";
    quickViewModal.setAttribute("aria-hidden","false");
  }
}

closeModal?.addEventListener("click", ()=>{
  if(!quickViewModal) return;
  quickViewModal.style.display = "none";
  quickViewModal.setAttribute("aria-hidden","true");
});

window.addEventListener("click", (e)=>{
  if(e.target === quickViewModal){
    quickViewModal.style.display = "none";
    quickViewModal.setAttribute("aria-hidden","true");
  }
});

// ==========================================
// ADD TO CART (uses AVAILABLE stock + refresh UI)
// ==========================================
function addToCartInstant(product){
  if(!product) return false;

  refreshCartFromStorage();

  const stock = availableStock(product);
  if(stock <= 0){
    alert("Out of stock");
    return false;
  }

  const existing = cart.find(i => normId(i.id) === normId(product.id));
  const currentQty = existing ? toNumber(existing.qty || 0) : 0;

  if(currentQty + 1 > stock){
    alert("Not enough stock");
    return false;
  }

  if(existing){
    existing.qty = currentQty + 1;
    existing.price = toNumber(product.price);
    existing.stock = toNumber(product.stock); // raw live stock fallback
    existing.brand = product.brand || existing.brand || "";
    existing.img = product.img || existing.img || "";
  }else{
    cart.push({
      id: toNumber(product.id),
      name: product.name,
      price: toNumber(product.price),
      qty: 1,
      stock: toNumber(product.stock),
      brand: product.brand || "",
      img: product.img || ""
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCheckoutButton();
  filterSortProducts(); // refresh visible stock instantly
  return true;
}

if(modalAddCart){
  modalAddCart.addEventListener("click", ()=>{
    if(!currentQuickProduct) return;

    refreshCartFromStorage();

    if(availableStock(currentQuickProduct) <= 0){
      modalAddCart.disabled = true;
      modalAddCart.textContent = "Out of Stock";
      return;
    }

    const ok = addToCartInstant(currentQuickProduct);
    if(!ok) return;

    modalAddCart.classList.add("added");
    modalAddCart.textContent = "✓ Added";
    modalAddCart.disabled = true;

    setTimeout(()=>{
      refreshCartFromStorage();
      if(availableStock(currentQuickProduct) <= 0){
        modalAddCart.disabled = true;
        modalAddCart.textContent = "Out of Stock";
        modalAddCart.classList.remove("added");
        return;
      }
      modalAddCart.classList.remove("added");
      modalAddCart.textContent = "+ Add to Cart";
      modalAddCart.disabled = false;
    }, 650);
  });
}

// ==========================================
// CHECKOUT BUTTON
// ==========================================
goCheckoutBottom?.addEventListener("click", ()=>{
  const cartNow = JSON.parse(localStorage.getItem("cart")) || [];
  if(cartNow.length === 0){
    alert("Your cart is empty!");
    return;
  }
  window.location.href = "checkout.html";
});

// ==========================================
// WATERFALL PARTICLES
// ==========================================
const particleContainer = document.getElementById("particleContainer");
const particleCount = 55;

function spawnParticles(){
  if(!particleContainer) return;
  particleContainer.innerHTML = "";

  const w = window.innerWidth;

  for(let i=0;i<particleCount;i++){
    const p = document.createElement("div");
    p.className = "particle";

    const x = Math.random() * w;
    const size = (Math.random() * 2.5 + 2).toFixed(2);
    const duration = (Math.random() * 10 + 8).toFixed(2);
    const delay = (Math.random() * 8).toFixed(2);

    p.style.left = x + "px";
    p.style.width = size + "px";
    p.style.height = size + "px";
    p.style.animationDuration = duration + "s";
    p.style.animationDelay = delay + "s";

    particleContainer.appendChild(p);
  }
}
spawnParticles();
window.addEventListener("resize", spawnParticles);

// ==========================================
// LIVE STOCK/PRICE OVERRIDE ON LOAD (FIXED)
// ==========================================
async function getLiveProductsSafe(){
  try{
    const res = await fetch(`${API}?action=products&t=${Date.now()}`, {
      method:"GET",
      cache:"no-store"
    });
    if(!res.ok) throw new Error("API not ok");
    const data = await res.json();
    if(!Array.isArray(data)) throw new Error("API not array");
    return data;
  }catch(err){
    console.warn("Live fetch failed:", err);
    return null;
  }
}

(async function applyLiveStock(){
  const live = await getLiveProductsSafe();
  if(!live || !Array.isArray(window.products)) return;

  const map = {};
  live.forEach(lp => {
    if (!lp || lp.id == null) return;
    map[normId(lp.id)] = lp;
  });

  window.products.forEach(p=>{
    const lp = map[normId(p.id)];
    if(!lp) return;
    if(lp.price != null) p.price = toNumber(lp.price);
    if(lp.stock != null) p.stock = toNumber(lp.stock);
  });

  filterSortProducts();
})();
