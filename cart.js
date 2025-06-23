// cart.js
let cart = JSON.parse(localStorage.getItem("cart") || "[]");
let lastCartBackup = [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function addToCart(name, size, price, qty = 1) {
  cart = getCart(); // Refresh cart
  const exists = cart.find(item => item.name === name && item.size === size);
  if (exists) {
    showCartNotification(`${name} (Size ${size}) is already in cart.`);
    return;
  }
  cart.push({ name, size, price, qty });
  saveCart();
  updateCartCount();
  showCartNotification(`${name} (Size ${size}) added to cart.`);
}

function updateCartCount() {
  cart = getCart();
  const el = document.getElementById("cartCount");
  if (el) el.textContent = cart.length;
}

function removeFromCart(index) {
  cart = getCart();
  cart.splice(index, 1);
  saveCart();
  toggleCart();
  updateCartCount();
}

function clearCart() {
  document.getElementById('overlay').style.display = 'block';
  document.getElementById('confirmPopup').style.display = 'block';
}

function confirmClearCartAction() {
  lastCartBackup = getCart();
  localStorage.removeItem("cart");
  updateCartCount();
  toggleCart();
  closeConfirmPopup();
  showCartNotification("All items removed!");
  document.getElementById("undoClearBtn").style.display = "block";
  setTimeout(() => {
    document.getElementById("undoClearBtn").style.display = "none";
  }, 5000);
}

function undoClearCart() {
  if (lastCartBackup.length > 0) {
    localStorage.setItem("cart", JSON.stringify(lastCartBackup));
    updateCartCount();
    toggleCart();
    lastCartBackup = [];
    document.getElementById("undoClearBtn").style.display = "none";
  }
}

function toggleCart() {
  const cart = getCart();
  const popup = document.getElementById("cartPopup");
  const itemsContainer = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  const phone = '919996210141';

  itemsContainer.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    itemsContainer.innerHTML = '<li>Your cart is empty.</li>';
    totalEl.textContent = '';
    document.getElementById('checkoutLink').style.display = 'none';
    document.getElementById('clearCartBtn').style.display = 'none';
  } else {
    document.getElementById('checkoutLink').style.display = 'block';
    document.getElementById('clearCartBtn').style.display = 'block';
    let message = "Hi! I want to order the following items from Krishan Attire:%0A";

    cart.forEach((item, i) => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${item.name} (Size: ${item.size}, Qty: ${item.qty}) - ₹${item.price * item.qty}
        <button onclick="removeFromCart(${i})" style="margin-left: 10px; background: red; color: white; border: none; padding: 2px 6px; cursor: pointer;">X</button>
      `;
      itemsContainer.appendChild(li);
      message += `${i + 1}. ${item.name} (Size: ${item.size}, Qty: ${item.qty}) - ₹${item.price * item.qty}%0A`;
      total += item.price * item.qty;
    });

    const deliveryCharge = 150;
    const grandTotal = total + deliveryCharge;
    totalEl.innerHTML = `
      Items Total: ₹${total}<br>
      Delivery Charges: ₹${deliveryCharge}<br>
      <strong>Grand Total: ₹${grandTotal}</strong>
    `;
    message += `%0AItems Total: ₹${total}%0ADelivery Charges: ₹${deliveryCharge}%0AGrand Total: ₹${grandTotal}`;
    document.getElementById("checkoutLink").href = `https://wa.me/${phone}?text=${message}`;
  }

  popup.style.display = 'block';
}

function closeCart() {
  document.getElementById("cartPopup").style.display = "none";
}

function closeConfirmPopup() {
  document.getElementById('confirmPopup').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
}

function showCartNotification(message) {
  const notification = document.getElementById("cartNotification");
  notification.textContent = message;
  notification.style.display = "block";

  setTimeout(() => {
    notification.style.opacity = "1";
  }, 50);

  setTimeout(() => {
    notification.style.opacity = "0";
  }, 2000);

  setTimeout(() => {
    notification.style.display = "none";
  }, 2700);
}

document.addEventListener("DOMContentLoaded", updateCartCount);
