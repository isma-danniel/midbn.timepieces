// ==========================================
// CHECKOUT.JS (FULL) - MIDBN Glass + Apple stepper + Stock limit + iOS Safari fix
// Notes:
// - Uses your CSS classes (cart-left/right, qty-controls, qty-btn, remove-btn)
// - Stock limit supported if item has stock/available/inventory/maxStock/max/remaining
// - IMPORTANT: Uses text/plain to avoid iOS/Safari CORS preflight issues with Apps Script
// ==========================================

const API =
  "https://script.google.com/macros/s/AKfycbwzKvHmOeestXmMxg-_mQitkAELdSSxZdz1TMTnSUABdmZu7YenCD2zLDBESHV5wBbX/exec";

const cartItemsContainer = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const clearCartBtn = document.getElementById("clearCartBtn");
const checkoutForm = document.getElementById("checkoutForm");
const placeOrderBtn = document.getElementById("placeOrderBtn");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// -------------------- Helpers --------------------
function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function formatBND(n) {
  return "BND " + toNumber(n).toFixed(2);
}

// Qty fields compatibility (qty / quantity)
function getQty(item) {
  const q = item.qty ?? item.quantity ?? 1;
  return Math.max(1, toNumber(q));
}
function setQty(item, qty) {
  item.qty = qty;
  if ("quantity" in item) item.quantity = qty;
}

// Stock field compatibility (stock / available / inventory / maxStock)
function getStock(item) {
  const s =
    item.stock ??
    item.available ??
    item.inventory ??
    item.maxStock ??
    item.max ??
    item.remaining;
  const n = toNumber(s);
  return n > 0 ? n : Infinity; // if no stock value, treat as unlimited
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function calcTotal() {
  return cart.reduce((sum, it) => {
    const qty = getQty(it);
    const price = toNumber(it.price);
    return sum + price * qty;
  }, 0);
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// iOS/Safari-friendly POST to Apps Script (avoid CORS preflight)
function postToAPI(payload) {
  return fetch(API, {
    method: "POST",
    redirect: "follow",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  }).then(async (res) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      throw new Error("Server returned non-JSON: " + text.slice(0, 160));
    }
  });
}

// -------------------- Render --------------------
function renderCart() {
  cartItemsContainer.innerHTML = "";

  if (!cart.length) {
    cartItemsContainer.innerHTML = `<div class="empty-cart">Your cart is empty</div>`;
    if (cartTotalEl) cartTotalEl.innerText = "BND 0";
    return;
  }

  cart.forEach((item, index) => {
    const name = item.name || item.title || "Item";
    const qty = getQty(item);
    const price = toNumber(item.price);
    const stock = getStock(item);

    const lineTotal = price * qty;

    const minusDisabled = qty <= 1;
    const plusDisabled = qty >= stock;

    // show only when meaningful
    let stockHint = "";
    if (stock !== Infinity) {
      if (stock <= 3) stockHint = ` • Only ${stock} left`;
      else stockHint = ` • ${stock} available`;
    }

    cartItemsContainer.innerHTML += `
      <div class="cart-item">
        <div class="cart-left">
          <strong>${escapeHtml(name)}</strong>
          <small>${formatBND(price)} each${stockHint}</small>
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

  if (cartTotalEl) cartTotalEl.innerText = formatBND(calcTotal());
}

renderCart();

// -------------------- Actions --------------------
cartItemsContainer.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const action = btn.dataset.action;
  const index = Number(btn.dataset.index);
  if (!action || !Number.isFinite(index) || index < 0 || index >= cart.length) return;

  const item = cart[index];
  const stock = getStock(item);
  let qty = getQty(item);

  if (action === "plus") {
    if (qty < stock) qty += 1;
  } else if (action === "minus") {
    qty = Math.max(1, qty - 1);
  } else if (action === "remove") {
    cart.splice(index, 1);
    saveCart();
    renderCart();
    if (!cart.length) window.location.href = "products.html";
    return;
  }

  setQty(item, qty);
  saveCart();
  renderCart();
});

// Clear cart
if (clearCartBtn) {
  clearCartBtn.addEventListener("click", () => {
    if (!cart.length) return;
    const ok = confirm("Clear all items in cart?");
    if (!ok) return;

    cart = [];
    localStorage.removeItem("cart");
    renderCart();
    window.location.href = "products.html";
  });
}

// -------------------- Checkout Submit --------------------
checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();

  cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!cart.length) {
    alert("Your cart is empty!");
    return;
  }

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const payment = document.getElementById("payment").value;

  if (!name || !phone || !address || !payment) {
    alert("Please complete customer details.");
    return;
  }

  const totalText = cartTotalEl ? cartTotalEl.innerText : "BND 0";

  if (placeOrderBtn) {
    placeOrderBtn.disabled = true;
    placeOrderBtn.textContent = "Processing…";
  }

  // 1) SAVE ORDER
  postToAPI({
    type: "order",
    cart,
    total: totalText,
    customer: { name, phone, address, payment },
  })
    .then((orderRes) => {
      if (orderRes.status === "success") {
        // 2) DEDUCT STOCK (fire-and-forget)
        postToAPI({ type: "stock", cart }).catch(console.error);

        // Save summary for success.html
        localStorage.setItem(
          "lastOrder",
          JSON.stringify({
            orderId: orderRes.orderId,
            customer: { name, phone, address, payment },
            cart,
            total: totalText,
          })
        );

        localStorage.removeItem("cart");
        cart = [];

        window.location.href = "success.html";
      } else {
        alert("Failed to place order: " + (orderRes.message || "Try again"));
        if (placeOrderBtn) {
          placeOrderBtn.disabled = false;
          placeOrderBtn.textContent = "Place Order";
        }
      }
    })
    .catch((err) => {
      console.error(err);
      alert("Error connecting to server: " + err.message);
      if (placeOrderBtn) {
        placeOrderBtn.disabled = false;
        placeOrderBtn.textContent = "Place Order";
      }
    });
});
