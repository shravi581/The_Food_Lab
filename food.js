// ===============================
// 🔹 SCROLL REVEAL
// ===============================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, {
  threshold: 0.2
});

document.querySelectorAll(".reveal").forEach(el => {
  observer.observe(el);
});


// ===============================
// 🔹 COUNTER ANIMATION
// ===============================
let counterStarted = false;

function runCounters() {

  if (counterStarted) return;

  const section = document.querySelector(".stats");

  if (!section) return;

  const top = section.getBoundingClientRect().top;

  if (top < window.innerHeight - 50) {

    counterStarted = true;

    animateCounter("customers", 1000, 0);
    animateCounter("rating", 4.8, 1);
  }
}

function animateCounter(id, target, decimal = 0) {

  let count = 0;

  const increment = target / 100;

  const interval = setInterval(() => {

    count += increment;

    if (count >= target) {
      count = target;
      clearInterval(interval);
    }

    document.getElementById(id).innerText =
      decimal ? count.toFixed(decimal) : Math.floor(count) + "+";

  }, 20);
}

window.addEventListener("scroll", runCounters);
window.addEventListener("load", runCounters);


// ===============================
// 🔹 TESTIMONIAL SLIDER
// ===============================
let current = 0;

const reviews = document.querySelectorAll(".review");

function showReview(index) {

  reviews.forEach(r => r.classList.remove("active"));

  if (reviews.length > 0) {
    reviews[index].classList.add("active");
  }
}

function autoSlide() {

  current = (current + 1) % reviews.length;

  showReview(current);
}

if (reviews.length > 0) {
  setInterval(autoSlide, 2500);
}


// ===============================
// 🔹 FEATURE HOVER EFFECT
// ===============================
document.querySelectorAll(".feature").forEach(card => {

  card.addEventListener("mouseenter", () => {

    card.style.transform = "translateY(-5px) scale(1.05)";
    card.style.boxShadow = "0 10px 20px rgba(0,0,0,0.15)";
  });

  card.addEventListener("mouseleave", () => {

    card.style.transform = "translateY(0) scale(1)";
    card.style.boxShadow = "none";
  });

});


// ===============================
// 🔹 CART SYSTEM
// ===============================

// LOAD CART
let cart = JSON.parse(localStorage.getItem("cart")) || [];


// ===============================
// 🔹 CART BADGE
// ===============================
const cartLink = document.getElementById("cart-link");

if (cartLink) {

  const cartWrapper = document.createElement("span");

  cartWrapper.style.position = "relative";
  cartWrapper.style.display = "inline-block";
  cartWrapper.style.marginLeft = "8px";

  const cartIcon = document.createElement("span");

  cartIcon.innerText = "🛒";
  cartIcon.style.fontSize = "20px";

  const cartBadge = document.createElement("span");

  cartBadge.style.position = "absolute";
  cartBadge.style.top = "-8px";
  cartBadge.style.right = "-10px";
  cartBadge.style.background = "#ff5e62";
  cartBadge.style.color = "white";
  cartBadge.style.borderRadius = "50%";
  cartBadge.style.padding = "2px 6px";
  cartBadge.style.fontSize = "12px";
  cartBadge.style.display = "none";

  cartWrapper.appendChild(cartIcon);
  cartWrapper.appendChild(cartBadge);

  cartLink.appendChild(cartWrapper);

  window.cartBadge = cartBadge;
}


// ===============================
// 🔹 ADD TO CART
// ===============================
document.querySelectorAll(".cart-btn").forEach(btn => {

  btn.addEventListener("click", function () {

    let card = this.closest(".card");

    let name = card.querySelector("h3").innerText;

    let priceElement = card.querySelector(".price");

    let price = 0;

    if (priceElement) {

      price = Number(
        priceElement.innerText.replace("₹", "").trim()
      );
    }

    let item = cart.find(i => i.name === name);

    if (item) {
      item.qty++;
    } else {
      cart.push({
        name,
        price,
        qty: 1
      });
    }

    saveCart();

    updateUI();

    this.innerText = "Added ✓";

    setTimeout(() => {
      this.innerText = "Add to Cart";
    }, 800);

  });

});


// ===============================
// 🔹 SAVE CART
// ===============================
function saveCart() {

  localStorage.setItem("cart", JSON.stringify(cart));
}


// ===============================
// 🔹 UPDATE UI
// ===============================
function updateUI() {

  // UPDATE BADGE
  let totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  if (window.cartBadge) {

    if (totalItems > 0) {

      cartBadge.style.display = "block";

      cartBadge.innerText = totalItems;

    } else {

      cartBadge.style.display = "none";
    }
  }


  // UPDATE CART PAGE
  const cartSection = document.getElementById("cart");

  if (!cartSection) return;

  let html = `
    <h2>Your Cart 🛒</h2>
    <div style="max-width:700px;margin:auto;">
  `;

  if (cart.length === 0) {

    html += `
      <p>No items in cart.</p>
    `;

  } else {

    let total = 0;

    let totalItemsCount = 0;

    cart.forEach((item, index) => {

      total += item.price * item.qty;

      totalItemsCount += item.qty;

      html += `
      
      <div style="
        background:white;
        margin:15px 0;
        padding:15px;
        border-radius:10px;
        display:flex;
        justify-content:space-between;
        align-items:center;
        box-shadow:0 3px 10px rgba(0,0,0,0.1);
      ">

        <div>
          <h3>${item.name}</h3>
          <p>₹${item.price} × ${item.qty}</p>
        </div>

        <div>

          <button onclick="decrease('${item.name}')">-</button>

          <span style="margin:0 10px;">
            ${item.qty}
          </span>

          <button onclick="increase('${item.name}')">+</button>

          <button 
            onclick="removeItem(${index})"
            style="
              margin-left:10px;
              background:red;
              color:white;
              border:none;
              padding:5px 8px;
              border-radius:5px;
            ">
            ✖
          </button>

        </div>

      </div>
      `;
    });

    // DISCOUNT
    let discount = 0;

    let discountMsg = "";

    if (total >= 2000) {

      discount = total * 0.15;

      discountMsg = "🎉 15% discount applied";

    } else if (total >= 1000) {

      discount = total * 0.10;

      discountMsg = "🎉 10% discount applied";

    } else if (total >= 500) {

      discount = total * 0.05;

      discountMsg = "🎉 5% discount applied";
    }

    let finalTotal = total - discount;

    html += `
    
    <div style="
      background:white;
      padding:20px;
      border-radius:10px;
      margin-top:20px;
      box-shadow:0 3px 10px rgba(0,0,0,0.1);
    ">

      <h3>Total Items: ${totalItemsCount}</h3>

      <h3>Subtotal: ₹${total}</h3>

      ${
        discount > 0
        ?
        `
        <h3 style="color:green;">
          Discount: -₹${discount.toFixed(0)}
        </h3>

        <p style="color:green;">
          ${discountMsg}
        </p>
        `
        :
        `
        <p>Add more items for discount 🎁</p>
        `
      }

      <h2 style="color:#ff5e62;">
        Final Total: ₹${finalTotal.toFixed(0)}
      </h2>

      <button
        onclick="checkout()"
        style="
          width:100%;
          padding:12px;
          background:#ff5e62;
          color:white;
          border:none;
          border-radius:6px;
          cursor:pointer;
        ">
        Checkout
      </button>

    </div>
    `;
  }

  html += `</div>`;

  cartSection.innerHTML = html;
}


// ===============================
// 🔹 INCREASE ITEM
// ===============================
function increase(name) {

  let item = cart.find(i => i.name === name);

  item.qty++;

  saveCart();

  updateUI();
}


// ===============================
// 🔹 DECREASE ITEM
// ===============================
function decrease(name) {

  let item = cart.find(i => i.name === name);

  if (item.qty > 1) {

    item.qty--;

  } else {

    cart = cart.filter(i => i.name !== name);
  }

  saveCart();

  updateUI();
}


// ===============================
// 🔹 REMOVE ITEM
// ===============================
function removeItem(index) {

  cart.splice(index, 1);

  saveCart();

  updateUI();
}


// ===============================
// 🔹 CHECKOUT
// ===============================
function checkout() {

  alert("Order placed successfully 🎉");

  cart = [];

  saveCart();

  updateUI();
}


// ===============================
// 🔹 SEARCH
// ===============================
const searchInput = document.querySelector(".nav-left input");

if (searchInput) {

  searchInput.addEventListener("keyup", function () {

    let value = this.value.toLowerCase();

    document.querySelectorAll(".card").forEach(card => {

      let name = card.querySelector("h3")
        .innerText
        .toLowerCase();

      if (name.includes(value)) {

        card.style.display = "block";

      } else {

        card.style.display = "none";
      }
    });

  });

}


// ===============================
// 🔹 ORDER BUTTON
// ===============================
const orderBtn = document.querySelector(".order-btn");

if (orderBtn) {

  orderBtn.addEventListener("click", () => {

    window.location.href = "menu.html";

  });

}


// ===============================
// 🔹 INIT
// ===============================
updateUI();