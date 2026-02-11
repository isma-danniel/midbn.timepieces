// ==========================================
// CHECKOUT.JS (FULL)
// ==========================================

const API = "https://script.google.com/macros/s/AKfycbwPTwgGLqGy75TQ8fY9E-pyKoncCVmbs6BJdzZzfgGBRXv4OKTgLbJaBJ3hB4ZfW2rd/exec"; 
// ^ replace with your latest Apps Script URL if you changed it

const cartItemsContainer = document.getElementById("cartItems");
// IMPORTANT: your HTML must have id="cartTotal" on the total element
const cartTotal = document.getElementById("cartTotal");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ===============================
// RENDER CART
// ===============================
function renderCart() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p style="opacity:.6;text-align:center">Your cart is empty</p>`;
    if (cartTotal) cartTotal.innerText = "BND 0";
    return;
  }

  let total = 0;

  cart.forEach(item => {
    const qty = Number(item.qty || 0);
    const price = Number(item.price || 0);
    total += price * qty;

    cartItemsContainer.innerHTML += `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong><br>
          <small>Qty: ${qty}</small>
        </div>
        <div>BND ${(price * qty).toFixed(2)}</div>
      </div>
    `;
  });

  if (cartTotal) cartTotal.innerText = "BND " + total.toFixed(2);
}

renderCart();

// ===============================
// CHECKOUT FORM SUBMIT
// ===============================
document.getElementById("checkoutForm").addEventListener("submit", function (e) {
  e.preventDefault();

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const payment = document.getElementById("payment").value;

  // This is what your Apps Script will store as total (string)
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
    .then(res => res.json())
    .then(orderRes => {
      if (orderRes.status === "success") {

        // 2) DEDUCT STOCK
        fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "stock", cart })
        });

        // ✅ SAVE ORDER SUMMARY FOR success.html
        localStorage.setItem("lastOrder", JSON.stringify({
          orderId: orderRes.orderId,
          customer: { name, phone, address, payment },
          cart: cart,
          total: total
        }));

        // ✅ CLEAR CART
        localStorage.removeItem("cart");

        // ✅ GO TO SUCCESS PAGE
        window.location.href = "success.html";

      } else {
        alert("Failed to place order, try again!");
      }
    })
    .catch(err => {
      console.error(err);
      alert("Error connecting to server. Try again.");
    });
});
