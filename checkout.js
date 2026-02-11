// ===== GOOGLE APPS SCRIPT WEB APP (MUST BE /exec) =====
const API = "https://script.google.com/macros/s/AKfycbxQAANX3EZIqkXryd4xgudSxo8mx-7WTcT8KdgA8C4Rm5VnQcYXoCDnmaggPzD7BQGD/exec";

const cartItemsContainer = document.getElementById("cartItems");

// IMPORTANT: your HTML uses <div class="cart-total">BND 0</div>
// so we must select it like this (NOT getElementById)
const cartTotalEl = document.querySelector(".cart-total");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ---------- helpers ----------
function money(n) {
  return "BND " + Number(n || 0).toFixed(2);
}

async function postToScript(payload) {
  // ✅ NO "Content-Type: application/json" header -> avoids CORS preflight
  const res = await fetch(API, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  // Sometimes Apps Script returns HTML when not deployed correctly
  const text = await res.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error("API returned non-JSON (deploy/permission issue). Response: " + text.slice(0, 120));
  }

  return data;
}

// ---------- render cart ----------
function renderCart() {
  cartItemsContainer.innerHTML = "";

  if (!cart.length) {
    cartItemsContainer.innerHTML = `<p style="opacity:.6;text-align:center">Your cart is empty</p>`;
    cartTotalEl.textContent = money(0);
    return;
  }

  let total = 0;

  cart.forEach((item) => {
    const line = Number(item.price) * Number(item.qty);
    total += line;

    cartItemsContainer.innerHTML += `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong><br>
          <small>Qty: ${item.qty}</small>
        </div>
        <div>${money(line)}</div>
      </div>
    `;
  });

  cartTotalEl.textContent = money(total);
}

renderCart();

// ---------- checkout submit ----------
document.getElementById("checkoutForm").addEventListener("submit", async function (e) {
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

  const total = cartTotalEl.textContent;

  try {
    // 1) Save order
    const orderRes = await postToScript({
      type: "order",
      cart,
      total,
      customer: { name, phone, address, payment },
    });

    if (orderRes.status !== "success") {
      throw new Error("Order failed: " + JSON.stringify(orderRes));
    }

    // 2) Deduct stock (don’t block user if this step is slow)
    postToScript({ type: "stock", cart }).catch(() => {});

    alert(`Order placed successfully!\nOrder ID: ${orderRes.orderId}`);

    localStorage.removeItem("cart");
    window.location.href = "products.html";
  } catch (err) {
    console.error(err);
    alert(
      "Stock system is unreachable right now.\n" +
      "Please try again in a moment.\n\n" +
      "(If it keeps happening: your Apps Script web app is not deployed for public POST.)"
    );
  }
});
