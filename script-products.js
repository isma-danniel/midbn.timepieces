// ==========================================
// MIDBN script-products.js (FULL + FIX 1-3 + HEADER SYNC PILL)
// ✅ Requires watchlist.js loaded FIRST (window.products)
// ✅ FIX 1: Render instantly, then sync live stock AFTER first paint (less lag)
// ✅ FIX 2: Particles delayed + fewer on mobile + resize throttle (faster load)
// ✅ FIX 3: Image fetchpriority=low (smoother decode)
// ✅ NEW: Header stock syncing pill w/ 3s timer + synced/fail message + auto hide
// ✅ Sold out separator + badge
// ✅ Cart count bottom button
// ✅ Filters + sort
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

// ✅ Header sync pill from your HTML
const syncNotice = document.getElementById("stockSyncNotice");
const syncTimer = document.getElementById("syncTimer");

// ==========================================
// State
// ==========================================
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentQuickProduct = null;

// ==========================================
// HEADER SYNC PILL (SAFE)
// ==========================================
let __syncInterval = null;
let __syncFadeTimeout = null;

function setSyncText(text){
  if(!syncNotice) return;
  // Your HTML: <div><span>Syncing latest stock</span><span id="syncTimer">3</span></div>
  const firstSpan = syncNotice.querySelector("span");
  if(firstSpan) firstSpan.textContent = text;
}

function startHeaderSyncPill(){
  if(!syncNotice || !syncTimer) return;

  // reset
  syncNotice.style.opacity = "1";
  syncNotice.style.transform = "none";
  syncNotice.classList.remove("done");
  setSyncText("Syncing latest stock");

  let count = 3;
  syncTimer.textContent = String(count);

  clearInterval(__syncInterval);
  clearTimeout(__syncFadeTimeout);

  __syncInterval = setInterval(() => {
    count -= 1;
    syncTimer.textContent = String(Math.max(0, count));
    if(count <= 0){
      clearInterval(__syncInterval);
      // keep showing until we actually finish sync (success/fail)
    }
  }, 1000);
}

function finishHeaderSyncPill(success){
  if(!syncNotice || !syncTimer) return;

  clearInterval(__syncInterval);
  clearTimeout(__syncFadeTimeout);

  if(success){
    syncNotice.classList.add("done");
    setSyncText("Stock synced");
  }else{
    // no extra css needed, just text
    setSyncText("Sync failed");
  }

  // hide after a moment
  __syncFadeTimeout = setTimeout(() => {
    syncNotice.style.opacity = "0";
    syncNotice.style.transform = "translateY(-6px)";
  }, 900);
}

// ==========================================
// CART COUNT
// ==========================================
function cartCount(){
  return cart.reduce((sum, it) => sum + Number(it.qty || 0), 0);
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
// RENDER (SOLD OUT SEPARATOR + BADGE)
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
  list.forEach(p => (toNumber(p.stock) > 0 ? inStock : soldOut).push(p));

  function makeCard(p, isSold){
    const card = document.createElement("div");
    card.className = "product-card" + (isSold ? " soldout" : "");
    card.dataset.id = p.id;

    const labelHtml = isSold
      ? `<div class="label soldout-badge">SOLD OUT</div>`
      : (p.label ? `<div class="label">${p.label}</div>` : "");

    card.innerHTML = `
      <div class="img-wrap">
        <img src="${p.img}" alt="${p.name}" loading="lazy" decoding="async" fetchpriority="low">
        ${labelHtml}
      </div>

      <div class="card-body">
        <div class="brand">${p.brand || ""}</div>
        <div class="name product-name">${p.name || ""}</div>
        <div class="price">BND ${toNumber(p.price).toFixed(2)}</div>
        <div class="stock">Stock: ${toNumber(p.stock)}</div>
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
  const aIn = toNumber(a.stock) > 0 ? 1 : 0;
  const bIn = toNumber(b.stock) > 0 ? 1 : 0;
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

// ==========================================
// QUICK VIEW MODAL
// ==========================================
function openQuickView(product){
  currentQuickProduct = product;

  if(modalImg) modalImg.src = product.img || "";
  if(modalName) modalName.textContent = product.name || "";
  if(modalPrice) modalPrice.textContent = `BND ${toNumber(product.price).toFixed(2)}`;
  if(modalStock) modalStock.textContent = `Stock: ${toNumber(product.stock)}`;
  if(modalDetails) modalDetails.textContent = product.details || "";

  if(modalAddCart){
    const out = toNumber(product.stock) <= 0;
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
// ADD TO CART
// ==========================================
function addToCartInstant(product){
  if(!product) return false;

  const stock = toNumber(product.stock);
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
    existing.stock = stock;
    existing.brand = product.brand || existing.brand || "";
    existing.img = product.img || existing.img || "";
  }else{
    cart.push({
      id: toNumber(product.id),
      name: product.name,
      price: toNumber(product.price),
      qty: 1,
      stock,
      brand: product.brand || "",
      img: product.img || ""
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCheckoutButton();
  return true;
}

if(modalAddCart){
  modalAddCart.addEventListener("click", ()=>{
    if(!currentQuickProduct) return;

    if(toNumber(currentQuickProduct.stock) <= 0){
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
      if(toNumber(currentQuickProduct.stock) <= 0){
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
// FIX 2: WATERFALL PARTICLES (delay + fewer on mobile + throttle)
// ==========================================
const particleContainer = document.getElementById("particleContainer");
const __particleCount = window.innerWidth < 768 ? 28 : 55;

function spawnParticles(){
  if(!particleContainer) return;
  particleContainer.innerHTML = "";

  const w = window.innerWidth;

  for(let i=0;i<__particleCount;i++){
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

setTimeout(() => spawnParticles(), 300);

window.addEventListener("resize", () => {
  clearTimeout(window.__pt);
  window.__pt = setTimeout(spawnParticles, 200);
});

// ==========================================
// FIX 1: FAST FIRST RENDER + LIVE STOCK SYNC
// ==========================================
let hasRenderedOnce = false;

function safeInitialRender(){
  if(hasRenderedOnce) return;
  hasRenderedOnce = true;

  // ✅ Start header pill immediately
  startHeaderSyncPill();

  // Instant render from watchlist.js
  filterSortProducts();
}
safeInitialRender();

async function getLiveProductsSafe(){
  try{
    const res = await fetch(`${API}?action=products&t=${Date.now()}`, {
      method:"GET",
      cache:"no-store"
    });
    if(!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) ? data : null;
  }catch(e){
    return null;
  }
}

function buildLiveMap(liveArr){
  const map = {};
  liveArr.forEach(lp=>{
    if(!lp || lp.id == null) return;
    map[normId(lp.id)] = lp;
  });
  return map;
}

// fetch AFTER first paint
requestAnimationFrame(() => {
  requestAnimationFrame(async () => {
    const live = await getLiveProductsSafe();
    if(!live || !Array.isArray(window.products)) {
      finishHeaderSyncPill(false);
      return;
    }

    const map = buildLiveMap(live);
    let changed = false;

    window.products.forEach(p=>{
      const lp = map[normId(p.id)];
      if(!lp) return;

      const newStock = (lp.stock != null) ? toNumber(lp.stock) : toNumber(p.stock);
      const newPrice = (lp.price != null) ? toNumber(lp.price) : toNumber(p.price);

      if(toNumber(p.stock) !== newStock){ p.stock = newStock; changed = true; }
      if(toNumber(p.price) !== newPrice){ p.price = newPrice; changed = true; }
    });

    if(changed) filterSortProducts();

    finishHeaderSyncPill(true);
  });
});
