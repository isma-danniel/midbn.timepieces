// ==========================================
// CONFIG
// ==========================================
const API = "https://script.google.com/macros/s/AKfycbxPBR09YFOCTy_YTWn-gCybE8B5awe09zDS7ArXKpWthULDerPpqDGzunViAoPKH3nr/exec";

// ==========================================
// PRODUCT DATA (YOUR REAL PRODUCTS)
// ==========================================
const products = [
  // ===== MEN (Rolex) =====
  {id:1,  name:"Daytona (Black/Gold)", brand:"Rolex", category:"mens", grade:"A", price:25, stock:0, label:"NEW", img:"images/men/men-1.png", details:"Quartz, stainless steel case, men watch, Grade A"},
  {id:2,  name:"Daytona (Gold)",       brand:"Rolex", category:"mens", grade:"A", price:25, stock:0, label:"NEW", img:"images/men/men-2.png", details:"Quartz, stainless steel case, men watch, Grade A"},
  {id:3,  name:"Daytona (Black)",      brand:"Rolex", category:"mens", grade:"A", price:25, stock:0, label:"NEW", img:"images/men/unknown.png", details:"Quartz, stainless steel case, men watch, Grade A"},
  {id:4,  name:"Daytona (White)",      brand:"Rolex", category:"mens", grade:"A", price:25, stock:0, label:"NEW", img:"images/men/unknown.png", details:"Quartz, stainless steel case, men watch, Grade A"},
  {id:5,  name:"GMT Master II (Batman)",brand:"Rolex",category:"mens", grade:"A", price:25, stock:0, label:"NEW", img:"images/men/men-5.png", details:"Quartz, rubber strap, men watch, Grade A"},
  {id:6,  name:"GMT Master II (Black)", brand:"Rolex",category:"mens", grade:"A", price:25, stock:0, label:"NEW", img:"images/men/men-6.png", details:"Quartz, rubber strap, men watch, Grade A"},
  {id:7,  name:"GMT Master II (Pepsi)", brand:"Rolex",category:"mens", grade:"A", price:25, stock:0, label:"NEW", img:"images/men/men-7.png", details:"Quartz, rubber strap, men watch, Grade A"},
  {id:8,  name:"GMT Master II (Coke)",  brand:"Rolex",category:"mens", grade:"A", price:25, stock:0, label:"NEW", img:"images/men/unknown.png", details:"Quartz, rubber strap, men watch, Grade A"},

  // ===== MEN (Patek Philippe) =====
  {id:9,  name:"Nautilus (Blue)",  brand:"Patek Philippe", category:"mens", grade:"A", price:25, stock:0, label:"NEW", img:"images/men/men-9.png",  details:"Quartz, stainless steel case, men watch, Grade A"},
  {id:10, name:"Nautilus (Black)", brand:"Patek Philippe", category:"mens", grade:"A", price:25, stock:0, label:"NEW", img:"images/men/men-10.png", details:"Quartz, stainless steel case, men watch, Grade A"},
  {id:11, name:"Nautilus (White)", brand:"Patek Philippe", category:"mens", grade:"A", price:25, stock:1, label:"NEW", img:"images/men/men-11.png", details:"Quartz, stainless steel case, men watch, Grade A"},

  // ===== WOMEN (Franck Muller) =====
  {id:12, name:"Vanguard (White)", brand:"Franck Muller", category:"womens", grade:"A", price:25, stock:1, label:"NEW", img:"images/women/women-1.png", details:"Quartz, leather strap, women watch, Grade A"},
  {id:13, name:"Vanguard (Black)", brand:"Franck Muller", category:"womens", grade:"A", price:25, stock:1, label:"NEW", img:"images/women/women-2.png", details:"Quartz, leather strap, women watch, Grade A"},
  {id:14, name:"Vanguard (Pink)",  brand:"Franck Muller", category:"womens", grade:"A", price:25, stock:0, label:"NEW", img:"images/men/unknown.png", details:"Quartz, leather strap, women watch, Grade A"},
  {id:15, name:"Cintree Curvex (Black)", brand:"Franck Muller", category:"womens", grade:"A", price:25, stock:1, label:"NEW", img:"images/women/women-4.png", details:"Quartz, leather strap, women watch, Grade A"},
  {id:16, name:"Master Square", brand:"Franck Muller", category:"womens", grade:"A", price:25, stock:2, label:"NEW", img:"images/women/women-5.png", details:"Quartz, leather strap, women watch, Grade A"},
  {id:17, name:"Cintree Curvex (Pink)", brand:"Franck Muller", category:"womens", grade:"A", price:25, stock:0, label:"NEW", img:"images/men/unknown.png", details:"Quartz, leather strap, women watch, Grade A"},
  {id:18, name:"Oalet (Black)", brand:"Franck Muller", category:"womens", grade:"A", price:25, stock:0, label:"NEW", img:"images/men/unknown.png", details:"Quartz, leather strap, women watch, Grade A"},

  // ===== CARTIER =====
  {id:19, name:"Santos (White)",    brand:"Cartier", category:"mens",   grade:"A", price:25, stock:1, label:"NEW", img:"images/women/women-8.png",  details:"Quartz, stainless steel case, men watch, Grade A"},
  {id:20, name:"Santos (Black)",    brand:"Cartier", category:"mens",   grade:"A", price:25, stock:1, label:"NEW", img:"images/women/women-9.png",  details:"Quartz, stainless steel case, men watch, Grade A"},
  {id:21, name:"Santos (Sapphire)", brand:"Cartier", category:"mens",   grade:"A", price:25, stock:1, label:"NEW", img:"images/women/women-10.png", details:"Quartz, stainless steel case, men watch, Grade A"},
  {id:22, name:"Santos (Emerald)",  brand:"Cartier", category:"mens",   grade:"A", price:25, stock:1, label:"NEW", img:"images/women/women-11.png", details:"Quartz, stainless steel case, men watch, Grade A"},
  {id:23, name:"Santos (Gold/Black)",   brand:"Cartier", category:"womens", grade:"A", price:25, stock:1, label:"NEW", img:"images/women/women-12.png", details:"Quartz, stainless steel case, women watch, Grade A"},
  {id:24, name:"Santos (Silver/White)", brand:"Cartier", category:"womens", grade:"A", price:25, stock:0, label:"NEW", img:"images/women/women-13.png", details:"Quartz, stainless steel case, women watch, Grade A"},
  {id:25, name:"Santos (Silver/Black)", brand:"Cartier", category:"womens", grade:"A", price:25, stock:1, label:"NEW", img:"images/women/women-14.png", details:"Quartz, stainless steel case, women watch, Grade A"},
  {id:26, name:"Santos (Gold/White)",   brand:"Cartier", category:"womens", grade:"A", price:25, stock:0, label:"NEW", img:"images/women/women-15.png", details:"Quartz, stainless steel case, women watch, Grade A"},

  // ===== MICHAEL KORS =====
  {id:27, name:"Slim Runaway (Silver)", brand:"Michael Kors", category:"mens", grade:"A", price:25, stock:1, label:"NEW", img:"images/women/women-17.png", details:"Quartz, stainless steel case, men watch, Grade A"},
  {id:28, name:"Slim Runaway (Blue)",   brand:"Michael Kors", category:"mens", grade:"A", price:25, stock:1, label:"NEW", img:"images/women/women-18.png", details:"Quartz, stainless steel case, men watch, Grade A"},
  {id:29, name:"Portia (White)",        brand:"Michael Kors", category:"womens", grade:"A", price:25, stock:2, label:"NEW", img:"images/women/women-19.png", details:"Quartz, stainless steel case, women watch, Grade A"},
  {id:30, name:"Portia (Gold)",         brand:"Michael Kors", category:"womens", grade:"A", price:25, stock:1, label:"NEW", img:"images/women/women-20.png", details:"Quartz, stainless steel case, women watch, Grade A"},
  {id:31, name:"Portia (Black)",        brand:"Michael Kors", category:"womens", grade:"A", price:25, stock:1, label:"NEW", img:"images/women/women-21.png", details:"Quartz, stainless steel case, women watch, Grade A"},

  // ===== AUDEMARS PIGUET =====
  {id:32, name:"Royal Oak (Black)", brand:"Audemars Piguet", category:"mens", grade:"A", price:25, stock:0, label:"NEW", img:"images/men/men-12.png", details:"Quartz, rubber strap, men watch, Grade A"},
  {id:33, name:"Royal Oak (White)", brand:"Audemars Piguet", category:"mens", grade:"A", price:25, stock:0, label:"NEW", img:"images/men/unknown.png", details:"Quartz, stainless steel case, men watch, Grade A"},

  // ===== COUPLE (Rolex) =====
  {id:34, name:"Couple (Red)",          brand:"Rolex", category:"couple", grade:"A", price:40, stock:0, label:"NEW", img:"images/couple/couple-1.png", details:"Quartz, stainless steel case, couple watch, Grade A"},
  {id:35, name:"Couple (Green)",        brand:"Rolex", category:"couple", grade:"A", price:40, stock:1, label:"NEW", img:"images/couple/couple-2.png", details:"Quartz, stainless steel case, couple watch, Grade A"},
  {id:36, name:"Couple (Black)",        brand:"Rolex", category:"couple", grade:"A", price:40, stock:0, label:"NEW", img:"images/couple/couple-3.png", details:"Quartz, stainless steel case, couple watch, Grade A"},
  {id:37, name:"Couple (White/Silver)", brand:"Rolex", category:"couple", grade:"A", price:40, stock:0, label:"NEW", img:"images/couple/couple-4.png", details:"Quartz, stainless steel case, couple watch, Grade A"},
  {id:38, name:"Couple (Yellow)",       brand:"Rolex", category:"couple", grade:"A", price:40, stock:1, label:"NEW", img:"images/couple/couple-5.png", details:"Quartz, stainless steel case, couple watch, Grade A"},

  // ===== COMING SOON =====
  {id:39, name:"GA2100 (Manga Green)", brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/unknown.png", details:"Rubber, complete with box & paper bag, Grade Premium"},

  // ===== DEFECTS / PROMO =====
  {id:67, name:"Nautilus (Black) — Defect", brand:"Patek Philippe", category:"promo", grade:"A", price:15, stock:1, label:"DEFECT", img:"images/defect/defect-1.PNG", details:"Complete with box, Grade A (Slight dent)"},
  {id:68, name:"Lexington (Bronze) — Defect", brand:"Michael Kors", category:"promo", grade:"A", price:15, stock:1, label:"DEFECT", img:"images/defect/defect-4.PNG", details:"Complete with box, Grade A (Slight dirty inside)"},
  {id:69, name:"Oalet (Black) — Defect", brand:"Franck Muller", category:"promo", grade:"A", price:15, stock:1, label:"DEFECT", img:"images/defect/defect-5.PNG", details:"Complete with box, Grade A (Scratch on the glass)"},
  {id:70, name:"Nautilus (Blue) — Defect", brand:"Patek Philippe", category:"promo", grade:"A", price:15, stock:1, label:"DEFECT", img:"images/defect/defect-2.PNG", details:"Complete with box, Grade A (Faded colour & scratches)"},
  {id:71, name:"Royal Oak (White) — Defect", brand:"Audemars Piguet", category:"promo", grade:"A", price:15, stock:1, label:"DEFECT", img:"images/defect/defect-3.PNG", details:"Complete with box, Grade A (Faded colour & scratches)"},
];

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

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentQuickProduct = null;

// ==========================================
// CART COUNT (Upgrade #2)
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
function toggleFilters(){ filters.classList.toggle("active"); }
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
// RENDER
// ==========================================
function renderProducts(list){
  productGrid.innerHTML = "";

  if(!list.length){
    productGrid.innerHTML = `<p style="opacity:.6;text-align:center;padding:20px;">No products found.</p>`;
    return;
  }

  list.forEach(p=>{
    const card = document.createElement("div");
    card.className = "product-card";
    card.dataset.id = p.id;

    card.innerHTML = `
      <div class="img-wrap">
        <img src="${p.img}" alt="${p.name}" loading="lazy" decoding="async">
        ${p.label ? `<div class="label">${p.label}</div>` : ""}
      </div>

      <div class="card-body">
        <div class="brand">${p.brand}</div>
        <div class="name product-name">${p.name}</div>
        <div class="price">BND ${Number(p.price).toFixed(2)}</div>
        <div class="stock">Stock: ${p.stock}</div>
        <a href="#" class="more-details-btn">More Details →</a>
      </div>
    `;

    card.querySelector("img").addEventListener("click", ()=>openQuickView(p));
    card.querySelector(".more-details-btn").addEventListener("click", (e)=>{
      e.preventDefault();
      openQuickView(p);
    });

    productGrid.appendChild(card);
  });
}

// ==========================================
// FILTER + SORT
// ==========================================
function inStockFirstComparator(a, b){
  const aIn = Number(a.stock) > 0 ? 1 : 0;
  const bIn = Number(b.stock) > 0 ? 1 : 0;
  if (aIn !== bIn) return bIn - aIn;
  return 0;
}

function filterSortProducts(){
  let filtered = products.filter(p=>{
    const q = (searchInput.value || "").toLowerCase().trim();
    const searchMatch = !q || (p.name + " " + p.brand).toLowerCase().includes(q);

    const brandMatch = !brandFilter.value || p.brand === brandFilter.value;
    const categoryMatch = !categoryFilter.value || p.category === categoryFilter.value;
    const gradeMatch = !gradeFilter.value || p.grade === gradeFilter.value;

    const min = minPrice.value === "" ? null : Number(minPrice.value);
    const max = maxPrice.value === "" ? null : Number(maxPrice.value);

    const minMatch = min === null || Number(p.price) >= min;
    const maxMatch = max === null || Number(p.price) <= max;

    return searchMatch && brandMatch && categoryMatch && gradeMatch && minMatch && maxMatch;
  });

  filtered.sort(inStockFirstComparator);

  if(sortSelect.value === "az"){
    filtered.sort((a,b)=>{
      const pri = inStockFirstComparator(a,b);
      if(pri !== 0) return pri;
      return a.name.localeCompare(b.name);
    });
  }
  if(sortSelect.value === "priceLow"){
    filtered.sort((a,b)=>{
      const pri = inStockFirstComparator(a,b);
      if(pri !== 0) return pri;
      return Number(a.price) - Number(b.price);
    });
  }

  renderProducts(filtered);
}

searchInput.addEventListener("input", filterSortProducts);
sortSelect.addEventListener("change", filterSortProducts);
brandFilter.addEventListener("change", filterSortProducts);
categoryFilter.addEventListener("change", filterSortProducts);
gradeFilter.addEventListener("change", filterSortProducts);
minPrice.addEventListener("input", filterSortProducts);
maxPrice.addEventListener("input", filterSortProducts);

filterSortProducts();

// ==========================================
// QUICK VIEW MODAL
// ==========================================
function openQuickView(product){
  currentQuickProduct = product;

  modalImg.src = product.img;
  modalName.textContent = product.name;
  modalPrice.textContent = `BND ${Number(product.price).toFixed(2)}`;
  modalStock.textContent = `Stock: ${product.stock}`;
  modalDetails.textContent = product.details || "";

  if(modalAddCart){
    const out = Number(product.stock) <= 0;
    modalAddCart.disabled = out;
    modalAddCart.textContent = out ? "Out of Stock" : "+ Add to Cart";
    modalAddCart.classList.remove("added");
  }

  quickViewModal.style.display = "flex";
  quickViewModal.setAttribute("aria-hidden","false");
}

closeModal.addEventListener("click", ()=>{
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
// ADD TO CART (Upgrade #1 - instant, no delay)
// ==========================================
function addToCartInstant(product){
  if(!product) return;

  // enforce local stock (fast)
  const stock = Number(product.stock || 0);
  if(stock <= 0){
    alert("Out of stock");
    return false;
  }

  const existing = cart.find(i => String(i.id) === String(product.id));
  const currentQty = existing ? Number(existing.qty || 0) : 0;

  if(currentQty + 1 > stock){
    alert("Not enough stock");
    return false;
  }

  if(existing){
    existing.qty = currentQty + 1;
  }else{
    cart.push({ id:Number(product.id), name:product.name, price:Number(product.price), qty:1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCheckoutButton();
  return true;
}

if(modalAddCart){
  modalAddCart.addEventListener("click", ()=>{
    if(!currentQuickProduct) return;

    const ok = addToCartInstant(currentQuickProduct);
    if(!ok) return;

    modalAddCart.classList.add("added");
    modalAddCart.textContent = "✓ Added";
    modalAddCart.disabled = true;

    setTimeout(()=>{
      modalAddCart.classList.remove("added");
      modalAddCart.textContent = "+ Add to Cart";
      modalAddCart.disabled = false;
    }, 650);
  });
}

// ==========================================
// CHECKOUT BUTTON
// ==========================================
if(goCheckoutBottom){
  goCheckoutBottom.addEventListener("click", ()=>{
    const cartNow = JSON.parse(localStorage.getItem("cart")) || [];
    if(cartNow.length === 0){
      alert("Your cart is empty!");
      return;
    }
    window.location.href = "checkout.html";
  });
}

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
// LIVE STOCK/PRICE OVERRIDE ON LOAD (kept)
// ==========================================
async function getLiveProductsSafe(){
  try{
    const res = await fetch(API, { method:"GET" });
    if(!res.ok) throw new Error("API not ok");
    const data = await res.json();
    if(!Array.isArray(data)) throw new Error("API not array");
    return data;
  }catch(err){
    return null;
  }
}

(async function applyLiveStock(){
  const live = await getLiveProductsSafe();
  if(!live) return;

  live.forEach(lp=>{
    const local = products.find(p=> String(p.id) === String(lp.id));
    if(!local) return;
    if(lp.price != null) local.price = Number(lp.price);
    if(lp.stock != null) local.stock = Number(lp.stock);
  });

  filterSortProducts();
})();
