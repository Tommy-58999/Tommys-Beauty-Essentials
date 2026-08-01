console.log("Welcome to Tommy's Beauty Essentials");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ADD TO CART
function addToCart(productName, productPrice) {

    const existingProduct = cart.find(item => item.name === productName);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert(productName + " has been added to your cart!");

    displayCart();
    updateCartCount();
}

// DISPLAY CART
function displayCart() {

    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const checkoutBtn = document.getElementById("checkoutBtn");

    if (!cartItems) return;

    cartItems.innerHTML = "";

    // Show empty cart message
    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="cart-item">
                <h2>Your cart is empty 🛒</h2>
                <p>Add some beauty essentials to get started.</p>
            </div>
        `;

        cartTotal.innerHTML = "₦0";

        if (checkoutBtn) {
            checkoutBtn.disabled = true;
        }

        return;
    }

    // Enable checkout if cart has items
    if (checkoutBtn) {
        checkoutBtn.disabled = false;
    }

    let total = 0;

    cart.forEach((item, index) => {

        total += item.price * item.quantity;

        cartItems.innerHTML += `
        <div class="cart-item">

            <h3>${item.name}</h3>

            <p>Price: ₦${item.price}</p>

            <div class="quantity-controls">

                <button onclick="decreaseQuantity(${index})">−</button>

                <span>${item.quantity}</span>

                <button onclick="increaseQuantity(${index})">+</button>

            </div>

            <p><strong>Subtotal:</strong> ₦${item.price * item.quantity}</p>

            <button onclick="removeItem(${index})">🗑 Remove</button>

            <hr>

        </div>
        `;

    });

    cartTotal.innerHTML = "₦" + total;
}

// INCREASE QUANTITY
function increaseQuantity(index) {

    cart[index].quantity++;

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();
    updateCartCount();
}

// DECREASE QUANTITY
function decreaseQuantity(index) {

    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();
    updateCartCount();
}

// REMOVE ITEM
function removeItem(index) {

    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();
    updateCartCount();
}

// CLEAR CART
function clearCart() {

    if (confirm("Are you sure you want to clear your cart?")) {

        cart = [];

        localStorage.setItem("cart", JSON.stringify(cart));

        displayCart();
        updateCartCount();
    }
}

// UPDATE CART NUMBER
function updateCartCount() {

    const cartLink = document.getElementById("cart-link");

    if (!cartLink) return;

    let count = 0;

    cart.forEach(item => {
        count += item.quantity;
    });

    cartLink.innerHTML = `🛒 Cart (${count})`;
}

// PLACE ORDER
function placeOrder(event) {

    event.preventDefault();

    const name = document.querySelector('input[type="text"]').value;
    const email = document.querySelector('input[type="email"]').value;
    const phone = document.querySelector('input[type="tel"]').value;
    const address = document.querySelector('textarea').value;

    let message = `🛍️ NEW ORDER

Name: ${name}

Email: ${email}

Phone: ${phone}

Address:
${address}

--------------------

Order:

`;

    let total = 0;

    cart.forEach(item => {

        message += `${item.name} x${item.quantity} - ₦${item.price * item.quantity}\n`;

        total += item.price * item.quantity;

    });

    message += `

--------------------

TOTAL: ₦${total}
`;

    const phoneNumber = "2349115180053";

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`);

    cart = [];

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();
    updateCartCount();
}

// LOAD WHEN PAGE OPENS
displayCart();
updateCartCount();
function searchProducts() {

    const input = document.getElementById("searchInput");

    if (!input) return;

    const filter = input.value.toLowerCase();

    const products = document.querySelectorAll(".product-card");

    products.forEach(product => {

        const name = product.querySelector("h3").textContent.toLowerCase();

        if (name.includes(filter)) {

            product.style.display = "block";

        } else {

            product.style.display = "none";

        }

    });

}
function sortProducts(){

    const sort = document.getElementById("sort");

    if(!sort) return;

    const container = document.querySelector(".product-container");

    const cards = Array.from(container.querySelectorAll(".product-card"));

    cards.sort((a,b)=>{

        const priceA = parseInt(a.querySelector(".price").textContent.replace(/[₦,A-Za-z ]/g,""));
        const priceB = parseInt(b.querySelector(".price").textContent.replace(/[₦,A-Za-z ]/g,""));

        const nameA = a.querySelector("h3").textContent;
        const nameB = b.querySelector("h3").textContent;

        switch(sort.value){

            case "low-high":
                return priceA-priceB;

            case "high-low":
                return priceB-priceA;

            case "a-z":
                return nameA.localeCompare(nameB);

            case "z-a":
                return nameB.localeCompare(nameA);

            default:
                return 0;
        }

    });

    cards.forEach(card=>container.appendChild(card));

}