// ==========================================
// CHECKOUT.JS (FULL) - Apple-style qty control + Remove
// Uses #cartItems, #cartTotal, #clearCartBtn, #checkoutForm
// ==========================================

const API =
  "https://script.google.com/macros/s/AKfycbwPTwgGLqGy75TQ8fY9E-pyKoncCVmbs6BJdzZzfgGBRXv4OKTgLbJaBJ3hB4ZfW2rd/exec";

const cartItemsContainer = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const clearCartBtn = document.getElementById("clearCartBtn");
const checkoutForm = document.getElementById("checkoutForm");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ===============================
// HELPERS
// ===============================
function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}
function formatBND(amount) {
  return "BND " + toNumber(amount).toFixed(2);
}
function ensureStyleOnce() {
  if (document.getElementById("appleQtyStyle")) return;

  const style = document.createElement("style");
  style.id = "appleQtyStyle";
  style.textContent = `
    /* Apple-ish control (glass + pill) */
    .apple-line{
      display:flex; justify-content:space-between; align-items:center; gap:14px;
      padding:14px 14px;
      border-radius:16px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(220,251,255,0.12);
      box-shadow: 0 10px 30px rgba(0,0,0,0.25);
      margin: 10px 0;
    }
    .apple-left{ min-width:0; display:flex; flex-direction:column; gap:6px; }
    .apple-name{
      font-weight:600;
      white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
      letter-spacing: .2px;
    }
    .apple-sub{ opacity:.8; font-size:.9rem; display:flex; gap:8px; align-items:center; }
    .apple-right{ display:flex; flex-direction:column; align-items:flex-end; gap:10px; }
    .apple-price{ font-weight:600; white-space:nowrap; }

    .apple-stepper{
      display:inline-flex; align-items:center; gap:10px;
      padding:6px 8px;
      border-radius:999px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(220,251,255,0.14);
      backdrop-filter: blur(14px) saturate(160%);
    }
    .apple-stepper button{
      width:34px; height:34px;
      display:grid; place-items:center;
      border-radius:999px;
      border: 1px solid rgba(220,251,255,0.18);
      background: rgba(255,255,255,0.06);
      color: inherit;
      cursor:pointer;
      transition: transform .12s ease, background .12s ease, border-color .12s ease;
      user-select:none;
    }
    .apple-stepper button:hover{
      background: rgba(255,255,255,0.10);
      border-color: rgba(220,251,255,0.28);
    }
    .apple-stepper button:active{ transform: scale(0.96); }
    .apple-stepper button:disabled{
      opacity: .35;
      cursor:not-allowed;
    }
    .apple-qty{
      min-width:18px;
      text-align:center;
      font-weight:600;
      letter-spacing:.3px;
    }

    /* Remove (small x) */
    .apple-remove{
      border:none;
      background: transparent;
      color: rgba(255,77,77,0.95);
      cursor:pointer;
      padding: 0;
      font-size: 14px;
      opacity: .9;
      transition: opacity .12s ease, transform .12s ease;
    }
    .apple-remove:hover{ opacity: 1; transform: translateY(-1px); }

    /* Tiny haptic-like pop */
    .pop {
      animation: pop .14s ease;
    }
    @keyframes pop {
      0% { transform: scale(1); }
      50% { transform: scale(1.06); }
      100% { transform: scale(1); }
    }
  `;
  document.head.appendChild(style);
}

// ===============================
// RENDER CART (Apple look)
// ===============================
function renderCart() {
  ensureStyleOnce();
  cartItemsContainer.innerHTML = "";

  if (!cart || cart.length === 0) {
    cartItemsContainer.innerHTML = `<p style="opacity:.6;text-align:center">Your cart is empty</p>`;
    if (cartTotal) cartTotal.innerText = "BND 0";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    item.qty = Math.max(1, toNumber(item.qty));
    const price = toNumber(item.price);
    const lineTotal = price * item.qty;
    total += lineTotal;

    cartItemsContainer.innerHTML += `
      <div class="apple-line">
        <div class="apple-left">
          <div class="apple-name">${item.name || "Item"}</div>
          <div class="apple-sub">
            <span>${formatBND(price)} each</span>
            <span>•</span>
            <button type="button" class="apple-remove" data-action="remove" data-index="${index}">Remove</button>
          </div>
        </div>

        <div class="apple-right">
          <div class="apple-price">${formatBND(lineTotal)}</div>

          <div class="apple-stepper" aria-label="Quantity selector">
            <button type="button" data-action="minus" data-index="${index}" ${item.qty <= 1 ? "disabled" : ""} aria-label="Decrease quantity">−</button>
            <span class="apple-qty" data-qty="${index}">${item.qty}</span>
            <button type="button" data-action="plus" data-index="${index}" aria-label="Increase quantity">+</button>
          </div>
        </div>
      </div>
    `;
  });

  if (cartTotal) cartTotal.innerText = formatBND(total);
}

renderCart();

// ===============================
// CLICK HANDLER (plus/minus/remove)
// ===============================
cartItemsContainer.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const action = btn.dataset.action;
  const index = Number(btn.dataset.index);
  if (!action || !Number.isFinite(index) || index < 0 || index >= cart.length) return;

  if (action === "plus") {
    cart[index].qty = Math.max(1, toNumber(cart[index].qty)) + 1;
  }

  if (action === "minus") {
    const current = Math.max(1, toNumber(cart[index].qty));
    cart[index].qty = Math.max(1, current - 1);
  }

  if (action === "remove") {
    cart.splice(index, 1);
  }

  saveCart();
  renderCart();

  // tiny "pop" on the stepper after update
  const qtyEl = cartItemsContainer.querySelector(`[data-qty="${index}"]`);
  if (qtyEl) {
    qtyEl.classList.add("pop");
    setTimeout(() => qtyEl.classList.remove("pop"), 180);
  }

  if (cart.length === 0) {
    window.location.href = "products.html"; // change to cart.html if you use it
  }
});

// ===============================
// CLEAR CART BUTTON
// ===============================
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

// ===============================
// CHECKOUT FORM SUBMIT
// ===============================
checkoutForm.addEventListener("submit", function (e) {
  e.preventDefault();

  cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
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

  const total = cartTotal ? cartTotal.innerText : "BND 0";

  // 1) SAVE ORDER
  fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "order",
      cart,
      total,
      customer: { name, phone, address, payment }
    })
  })
    .then((res) => res.json())
    .then((orderRes) => {
      if (orderRes.status === "success") {
        // 2) DEDUCT STOCK (fire-and-forget)
        fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "stock", cart })
        });

        localStorage.setItem(
          "lastOrder",
          JSON.stringify({
            orderId: orderRes.orderId,
            customer: { name, phone, address, payment },
            cart: cart,
            total: total
          })
        );

        localStorage.removeItem("cart");
        cart = [];
        window.location.href = "success.html";
      } else {
        alert("Failed to place order, try again!");
      }
    })
    .catch((err) => {
      console.error(err);
      alert("Error connecting to server. Try again.");
    });
});
