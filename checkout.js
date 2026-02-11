// ✅ checkout.js (FULL) with LIVE STOCK LIMIT (+/−/Remove/Clear + submit stock re-check)

const API = "https://script.google.com/macros/s/AKfycbwPTwgGLqGy75TQ8fY9E-pyKoncCVmbs6BJdzZzfgGBRXv4OKTgLbJaBJ3hB4ZfW2rd/exec";

const cartItemsContainer = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const form = document.getElementById("checkoutForm");
const placeOrderBtn = document.getElementById("placeOrderBtn");
const clearCartBtn = document.getElementById("clearCartBtn");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// stockMap: { "1": 3, "2": 7, ... }
let stockMap = {};
let stockLoaded = false;

// ============ WATERFALL (optional) ============
const particleContainer = document.getElementById("particleContainer");
if (particleContainer) {
  const particleCount = 35;
  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const startX = Math.random() * window.innerWidth;
    const size = Math.random() * 3 + 2;
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * 10;

    p.style.left = startX + "px";
    p.style.width = size + "px";
    p.style.height = size + "px";
    p.style.animationDuration = duration + "s";
    p.style.animationDelay = delay + "s";
    particleContainer.appendChild(p);
  }
}

// ============ HELPERS ============
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function setSubmitting(isSubmitting) {
  if (!placeOrderBtn) return;
  placeOrderBtn.disabled = isSubmitting;
  placeOrderBtn.innerText = isSubmitting ? "Placing Order..." : "Place Order";
}

async function postJSON(url, payload) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify(payload)
  });
  return await res.json();
}

async function fetchStockMap() {
  // returns true if fetched successfully, false otherwise
  try {
    const res = await fetch(API);
    const data = await res.json();

    const map = {};
    data.forEach(p => {
      map[String(p.id)] = Number(p.stock || 0);
    });

    stockMap = map;
    stockLoaded = true;
    return true;
  } catch (e) {
    console.warn("Stock fetch failed:", e);
    stockLoaded = false;
    return false;
  }
}

function getStockFor(id) {
  const key = String(id);
  if (!stockLoaded) return null; // unknown
  if (!(key in stockMap)) return 0; // not found -> treat as 0
  return stockMap[key];
}

function calculateTotal() {
  let total = 0;
  cart.forEach(item => {
    const qty = Number(item.qty || 0);
    const price = Number(item.price || 0);
    total += qty * price;
  });
  return total;
}

// ============ CART RENDER ============
function renderCart() {
  cartItemsContainer.innerHTML = "";

  if (!cart || cart.length === 0) {
    cartItemsContainer.innerHTML = `<p class="empty-cart">Your cart is empty</p>`;
    cartTotal.innerText = "BND 0.00";
    return;
  }

  cart.forEach((item) => {
    const id = String(item.id);
    const qty = Number(item.qty || 0);
    const price = Number(item.price || 0);
    const line = qty * price;

    const liveStock = getStockFor(id); // number OR null
    const stockText =
      liveStock === null ? "" : ` / Stock: ${liveStock}`;

    const plusDisabled =
      liveStock !== null && qty >= liveStock;

    cartItemsContainer.innerHTML += `
      <div class="cart-item" data-id="${id}">
        <div class="cart-left">
          <strong>${item.name}</strong>
          <small>BND ${price.toFixed(2)} each${stockText}</small>
        </div>

        <div class="cart-right">
          <div class="line-price">BND ${line.toFixed(2)}</div>

          <div class="qty-controls">
            <button class="qty-btn qty-minus" type="button" ${qty <= 1 ? "disabled" : ""}>−</button>
            <div class="qty-number">${qty}</div>
            <button class="qty-btn qty-plus" type="button" ${plusDisabled ? "disabled" : ""}>+</button>
            <button class="remove-btn remove-item" type="button">Remove</button>
          </div>
        </div>
      </div>
    `;
  });

  cartTotal.innerText = "BND " + calculateTotal().toFixed(2);
}

// initial render (will update again after stock load)
renderCart();

// load stock in background then re-render (no “wait”, just updates when ready)
fetchStockMap().then(() => {
  // If any cart qty already exceeds stock, clamp it down
  if (stockLoaded) {
    let changed = false;
    cart.forEach(item => {
      const s = getStockFor(item.id);
      if (s !== null && Number(item.qty || 0) > s) {
        item.qty = Math.max(1, s);
        changed = true;
      }
      if (s !== null && s <= 0) {
        // remove out-of-stock items automatically (optional)
        // comment this block if you prefer to keep and show warning
        // cart = cart.filter(i => String(i.id) !== String(item.id));
      }
    });
    if (changed) saveCart();
  }
  renderCart();
});

// ============ QTY + REMOVE HANDLING ============
cartItemsContainer.addEventListener("click", async (e) => {
  const row = e.target.closest(".cart-item");
  if (!row) return;

  const id = row.dataset.id;
  const item = cart.find(i => String(i.id) === String(id));
  if (!item) return;

  // always try to refresh stock when user presses +
  // (fast enough for small sheet; keeps it accurate)
  const wantPlus = e.target.classList.contains("qty-plus");
  if (wantPlus) {
    await fetchStockMap(); // best-effort
    const stock = getStockFor(id);

    if (stock === 0) {
      alert("Out of stock");
      return;
    }

    if (stock !== null && Number(item.qty || 0) + 1 > stock) {
      alert(`Not enough stock. Available: ${stock}`);
      renderCart();
      return;
    }

    item.qty = Number(item.qty || 0) + 1;
    saveCart();
    renderCart();
    return;
  }

  if (e.target.classList.contains("qty-minus")) {
    const current = Number(item.qty || 0);
    item.qty = Math.max(1, current - 1);
    saveCart();
    renderCart();
    return;
  }

  if (e.target.classList.contains("remove-item")) {
    cart = cart.filter(i => String(i.id) !== String(id));
    saveCart();
    renderCart();
    return;
  }
});

// ============ CLEAR CART ============
clearCartBtn?.addEventListener("click", () => {
  if (!cart || cart.length === 0) return;
  if (!confirm("Clear all items in cart?")) return;
  cart = [];
  saveCart();
  renderCart();
});

// ============ SUBMIT ORDER (WITH STOCK RE-CHECK) ============
form.addEventListener("submit", async function(e){
  e.preventDefault();

  cart = JSON.parse(localStorage.getItem("cart")) || [];

  if(cart.length === 0){
    alert("Your cart is empty!");
    return;
  }

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const payment = document.getElementById("payment").value;

  if (!name || !phone || !address || !payment) {
    alert("Please complete all fields.");
    return;
  }

  // 1) re-check stock before placing order
  const ok = await fetchStockMap();
  if (!ok) {
    // API down: block order to prevent oversell (safer)
    alert("Stock system is unreachable right now. Please try again in a moment.");
    return;
  }

  // validate each cart item vs stock
  const issues = [];
  cart.forEach(item => {
    const stock = getStockFor(item.id);
    const qty = Number(item.qty || 0);

    if (stock === 0) issues.push(`${item.name} is out of stock`);
    else if (stock !== null && qty > stock) issues.push(`${item.name} only has ${stock} left`);
  });

  if (issues.length) {
    alert("Stock issue:\n\n" + issues.join("\n"));
    // clamp quantities to stock (optional helpful behavior)
    cart = cart.map(item => {
      const stock = getStockFor(item.id);
      if (stock !== null && stock > 0) {
        return { ...item, qty: Math.min(Number(item.qty || 0), stock) };
      }
      return item;
    }).filter(item => {
      const stock = getStockFor(item.id);
      return stock === null ? true : stock > 0; // remove out-of-stock
    });

    saveCart();
    renderCart();
    return;
  }

  const total = "BND " + calculateTotal().toFixed(2);

  try {
    setSubmitting(true);

    // 2) Save order
    const orderRes = await postJSON(API, {
      type: "order",
      cart,
      total,
      customer: { name, phone, address, payment }
    });

    if(orderRes.status !== "success"){
      alert("Failed to place order, try again!");
      return;
    }

    // 3) Deduct stock
    try {
      await postJSON(API, { type:"stock", cart });
    } catch (_) {
      // if stock update fails, you can still keep order saved
    }

    alert(`Order placed successfully!\nOrder ID: ${orderRes.orderId}`);

    localStorage.removeItem("cart");
    window.location.href = "products.html";

  } catch (err) {
    console.error(err);
    alert("Network error. Please try again.");
  } finally {
    setSubmitting(false);
  }
});
