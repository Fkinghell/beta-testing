const products = [
  { name: "White Mushroom", price: 60, image: "https://i.imgur.com/pJtRzGQ.jpg" },
  { name: "Tomato", price: 20, image: "https://i.imgur.com/0Hx1Xy5.jpg" },
  { name: "Broccoli", price: 60, image: "https://i.imgur.com/l3KrOCz.jpg" },
  { name: "Chicken Breast", price: 220, image: "https://i.imgur.com/CrQMF6D.jpg" },
  { name: "Capsicum", price: 40, image: "https://i.imgur.com/6pD6XmV.jpg" }
];

let cart = [], rewardPoints = 0, discount = false;

function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'cart') renderCart();
}

function renderProducts() {
  const c = document.getElementById('product-list');
  c.innerHTML = '';
  products.forEach((p, i) => {
    const cartItem = cart.find(x => x.name === p.name);
    const qty = cartItem ? cartItem.qty : 0;

    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}"/>
      <h4>${p.name}</h4><p>₹${p.price}</p>
      <div class="qty-btns">
        ${qty === 0 ? 
          `<button class="btn-add" onclick="addToCart(${i})">Add to Cart</button>` :
          `
          <button onclick="updateQty(${i}, -1)">−</button>
          <span>${qty}</span>
          <button onclick="updateQty(${i}, 1)">+</button>
          `
        }
      </div>`;
    c.appendChild(div);
  });
}

function addToCart(i) {
  cart.push({ ...products[i], qty: 1 });
  updateCount();
  renderProducts();
}

function updateQty(i, delta) {
  const product = products[i];
  const idx = cart.findIndex(x => x.name === product.name);
  if (idx >= 0) {
    cart[idx].qty += delta;
    if (cart[idx].qty <= 0) cart.splice(idx, 1);
  }
  updateCount();
  renderProducts();
}

function updateCount() {
  document.getElementById('cart-count').innerText = cart.reduce((s, x) => s + x.qty, 0);
}

function renderCart() {
  const list = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  list.innerHTML = '';
  let total = 0;

  cart.forEach((item, i) => {
    const itemTotal = item.qty * item.price;
    total += itemTotal;

    const div = document.createElement('div');
    div.className = 'cart-card';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div class="cart-info">
        <h4>${item.name}</h4>
        <p>₹${item.price} × ${item.qty} = ₹${itemTotal}</p>
        <div class="qty-btns">
          <button onclick="updateQty(${products.findIndex(p => p.name === item.name)}, -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="updateQty(${products.findIndex(p => p.name === item.name)}, 1)">+</button>
          <button onclick="removeItem('${item.name}')">🗑️</button>
        </div>
      </div>
    `;
    list.appendChild(div);
  });

  if (discount) total *= 0.8;
  totalEl.innerText = `Total: ₹${total.toFixed(0)}`;
}

function removeItem(n) {
  cart = cart.filter(x => x.name !== n);
  renderCart(); renderProducts(); updateCount();
}

function applyCoupon() {
  const code = document.getElementById('coupon-input').value.trim();
  discount = code === 'RAJV33R';
  document.getElementById('coupon-msg').innerText = discount ? '20% discount applied!' : 'Invalid coupon';
  renderCart();
}

function placeOrder() {
  const pin = document.getElementById('pincode').value.trim();
  if (cart.length === 0) { alert('Cart empty'); showSection('home'); return; }
  if (pin.length !== 6 || isNaN(pin)) { alert('Enter valid 6-digit PIN'); return; }

  cart = []; discount = false;
  rewardPoints += 10;
  updateCount();
  document.getElementById('checkout-msg').innerText = "Order placed! You've earned reward points.";
  showSection('track');
}

function trackOrder() {
  const id = document.getElementById('track-input').value.trim();
  document.getElementById('track-msg').innerText = id ? `Order ${id} is out for delivery` : "Enter Order ID";
}

function login() {
  document.getElementById('login-msg').innerText = "Logged in!";
  showSection('home');
}

renderProducts();
showSection('home');
