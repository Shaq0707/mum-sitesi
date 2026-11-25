// Edit this list to change products. Prices are in GBP.
const PRODUCTS = [
  { id: 1, name: "Vanilla & Amber", desc: "Warm, creamy and comforting.", price: 14.0, emoji: "🕯️", color: "#f6e7c8" },
  { id: 2, name: "Lavender Fields", desc: "Soft floral notes to unwind.", price: 14.0, emoji: "💜", color: "#e6dcf3" },
  { id: 3, name: "Fresh Linen", desc: "Clean, airy, just-washed cotton.", price: 13.0, emoji: "🤍", color: "#e3eef5" },
  { id: 4, name: "Cinnamon & Orange", desc: "Spiced citrus for cosy evenings.", price: 15.0, emoji: "🍊", color: "#fbdcc0" },
  { id: 5, name: "Sandalwood", desc: "Deep, woody and grounding.", price: 16.0, emoji: "🪵", color: "#e9d9c6" },
  { id: 6, name: "Sea Salt & Sage", desc: "Coastal freshness with herbal depth.", price: 15.0, emoji: "🌿", color: "#dcebdc" },
];

const ORDER_EMAIL = "hello@example.com"; // change to your email

const money = n => "£" + n.toFixed(2);
let cart = JSON.parse(localStorage.getItem("cart") || "{}");

const $ = id => document.getElementById(id);

function save() { localStorage.setItem("cart", JSON.stringify(cart)); render(); }

function renderProducts() {
  $("products").innerHTML = PRODUCTS.map(p => `
    <article class="card">
      <div class="thumb" style="background:${p.color}">${p.emoji}</div>
      <div class="card-body">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <span class="price">${money(p.price)}</span>
        <button class="btn" data-add="${p.id}">Add to basket</button>
      </div>
    </article>`).join("");
}

function render() {
  const ids = Object.keys(cart);
  $("cartCount").textContent = ids.reduce((s, id) => s + cart[id], 0);
  let total = 0;
  $("cartItems").innerHTML = ids.length ? ids.map(id => {
    const p = PRODUCTS.find(x => x.id == id);
    total += p.price * cart[id];
    return `<div class="item"><div><strong>${p.name}</strong><br>${money(p.price)}</div>
      <div class="qty"><button data-dec="${id}">−</button><span>${cart[id]}</span><button data-inc="${id}">+</button></div></div>`;
  }).join("") : '<p class="empty">Your basket is empty.</p>';
  $("cartTotal").textContent = money(total);
  const lines = ids.map(id => {
    const p = PRODUCTS.find(x => x.id == id);
    return `${cart[id]} x ${p.name} (${money(p.price * cart[id])})`;
  });
  const body = encodeURIComponent("Hi, I'd like to order:\n\n" + lines.join("\n") + "\n\nTotal: " + money(total) + "\n\nName:\nDelivery address:");
  $("checkout").href = ids.length ? `mailto:${ORDER_EMAIL}?subject=${encodeURIComponent("Candle order")}&body=${body}` : "#";
}

function toggleCart(open) {
  $("cart").classList.toggle("open", open);
  $("overlay").classList.toggle("show", open);
  $("cart").setAttribute("aria-hidden", !open);
}

document.addEventListener("click", e => {
  const t = e.target;
  if (t.dataset.add) { cart[t.dataset.add] = (cart[t.dataset.add] || 0) + 1; save(); toggleCart(true); }
  if (t.dataset.inc) { cart[t.dataset.inc]++; save(); }
  if (t.dataset.dec) { if (--cart[t.dataset.dec] <= 0) delete cart[t.dataset.dec]; save(); }
});
$("cartBtn").onclick = () => toggleCart(true);
$("closeCart").onclick = $("overlay").onclick = () => toggleCart(false);
$("year").textContent = new Date().getFullYear();

renderProducts();
render();
