// ==========================================
// MIDBN script-products.js (NO-FLICKER STOCK LINE)
// - Renders products immediately
// - Hides ONLY stock line until live stock loaded
// - Available stock = live stock - qty in cart
// - Requires watchlist.js first (window.products)
// ==========================================

const API =
  "https://script.google.com/macros/s/AKfycbyovzomINZnABB1-DatSQgIA_OHu7OjuRD-D2yGMWU7i-xD7irSsXR1p2frILSv02eNxg/exec";

// ---------- Helpers ----------
function normId(v){ return String(v ?? "").trim(); }
function toNumber(v){ const n = Number(v); return Number.isFinite(n) ? n : 0; }

// ---------- Safety ----------
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

// IMPORTANT: controls flicker
let liveReady = false;   // false until live stock fetched (or failed)

// ==========================================
// Cart helpers
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
// RENDER (stock line hidden until liveReady)
// ==========================================
function renderProducts(list){
  if(!productGrid) return;
  productGrid.innerHTML = "";

  if(!list.length){
    productGrid.innerHTML = `<p style="opacity:.6;text-align:center;padding:20px;">No products found.</p>`;
    return;
  }

  // If live not ready yet, we DO NOT separate sold out (because stock not trusted yet).
  // Once liveReady=true, we separate properly using availableStock.
  const inStock = [];
  const soldOut = [];

  if(!liveReady){
    // keep original order, no sold out section yet
    list.forEach(p => inStock.push(p));
  }else{
    list.forEach(p => (availableStock(p) > 0 ? inStock : soldOut).push(p));
  }

  function makeCard(p, isSold){
    const card = document.createElement("div");
    card.className = "product-card" + (isSold ? " soldout" : "");
    card.dataset.id = p.id;

    const labelHtml = (liveReady && isSold)
      ? `<div class="label soldout-badge">SOLD OUT</div>`
      : (p.label ? `<div class="label">${p.label}</div>` : "");

    const stockHtml = liveReady
      ? `Stock: ${availableStock(p)}`
      : `Stock: —`; // placeholder

    // hide ONLY stock line until liveReady
    const stockStyle = liveReady ? "" : `style="opacity:0; height:0; margin:0; padding:0; overflow:hidden;"`;

    card.innerHTML = `
      <div class="img-wrap">
        <img src="${p.img}" alt="${p.name}" loading="lazy" decoding="async">
        ${labelHtml}
      </div>

      <div class="card-body">
        <div class="brand">${p.brand || ""}</div>
        <div class="name product-name">${p.name || ""}</div>
        <div class="price">BND ${toNumber(p.price).toFixed(2)}</div>
        <div class="stock" ${stockStyle}>${stockHtml}</div>
        <a href="#" class="more-details-btn">${(liveReady && isSold) ? "View Details →" : "More Details →"}</a>
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

  if(liveReady && soldOut.length){
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

  // Only do stock-based sorting AFTER liveReady
  if(liveReady){
    filtered.sort(inStockFirstComparator);
  }

  if(sortSelect?.value === "az"){
    filtered.sort((a,b)=>{
      if(liveReady){
        const pri = inStockFirstComparator(a,b);
        if(pri !== 0) return pri;
      }
      return String(a.name || "").localeCompare(String(b.name || ""));
    });
  }

  if(sortSelect?.value === "priceLow"){
    filtered.sort((a,b)=>{
      if(liveReady){
        const pri = inStockFirstComparator(a,b);
        if(pri !== 0) return pri;
      }
      return toNumber(a.price) - toNumber(b.price);
    });
  }

  if(sortSelect?.value === "inStock" && liveReady){
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

// Render immediately (no flicker — stock hidden)
filterSortProducts();

// ==========================================
// QUICK VIEW MODAL (uses availableStock once liveReady)
// ==========================================
function openQuickView(product){
  currentQuickProduct = product;
  refreshCartFromStorage();

  if(modalImg) modalImg.src = product.img || "";
  if(modalName) modalName.textContent = product.name || "";
  if(modalPrice) modalPrice.textContent = `BND ${toNumber(product.price).toFixed(2)}`;

  // show stock only if liveReady, else show “Checking…”
  if(modalStock){
    modalStock.textContent = liveReady
      ? `Stock: ${availableStock(product)}`
      : `Stock: Checking…`;
  }

  if(modalDetails) modalDetails.textContent = product.details || "";

  if(modalAddCart){
    // disable add to cart until liveReady (prevents wrong add)
    if(!liveReady){
      modalAddCart.disabled = true;
      modalAddCart.textContent = "Checking stock…";
      modalAddCart.classList.remove("added");
    }else{
      const out = availableStock(product) <= 0;
      modalAddCart.disabled = out;
      modalAddCart.textContent = out ? "Out of Stock" : "+ Add to Cart";
      modalAddCart.classList.remove("added");
    }
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
// ADD TO CART (only when liveReady)
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
    existing.stock = toNumber(product.stock);
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
  filterSortProducts();
  return true;
}

if(modalAddCart){
  modalAddCart.addEventListener("click", ()=>{
    if(!currentQuickProduct) return;

    if(!liveReady){
      alert("Checking stock… please wait a moment.");
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
// LIVE STOCK/PRICE OVERRIDE (fast timeout)
// ==========================================
function fetchWithTimeout(url, ms){
  return Promise.race([
    fetch(url, { method:"GET", cache:"no-store" }),
    new Promise((_, reject)=>setTimeout(()=>reject(new Error("timeout")), ms))
  ]);
}

async function getLiveProductsSafe(){
  try{
    const res = await fetchWithTimeout(`${API}?action=products&t=${Date.now()}`, 2500);
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
  if(!live || !Array.isArray(window.products)){
    // even if failed, mark ready so UI stops hiding forever
    liveReady = true;
    filterSortProducts();
    return;
  }

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

  liveReady = true;

  // Now stock line appears + sold out separator works
  filterSortProducts();
})();
