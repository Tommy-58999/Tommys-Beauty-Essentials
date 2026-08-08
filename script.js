console.log("Welcome to Tommy's Beauty Essentials");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// =====================================
// EMAILJS SETTINGS
// =====================================

const EMAILJS_SERVICE_ID = "service_cyaiimf";
const EMAILJS_TEMPLATE_ID = "template_dq9jlhe";
const CUSTOMER_EMAIL_TEMPLATE_ID = "template_nwxhjw4";
const EMAILJS_PUBLIC_KEY = "PASTE_THE_COPIED_PUBLIC_KEY_HERE";

// =====================================
// ADD TO CART
// =====================================

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

// =====================================
// DISPLAY CART
// =====================================

function displayCart() {

    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const checkoutBtn = document.getElementById("checkoutBtn");

    if (!cartItems) return;

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="cart-item">
                <h2>Your cart is empty 🛒</h2>
                <p>Add some beauty essentials to get started.</p>
            </div>
        `;

        if (cartTotal) {
            cartTotal.innerHTML = "₦0";
        }

        if (checkoutBtn) {
            checkoutBtn.disabled = true;
        }

        return;
    }

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

            <p>
                <strong>Subtotal:</strong>
                ₦${item.price * item.quantity}
            </p>

            <button onclick="removeItem(${index})">
                🗑 Remove
            </button>

            <hr>

        </div>
        `;
    });

    if (cartTotal) {
        cartTotal.innerHTML = "₦" + total;
    }
}

// =====================================
// INCREASE QUANTITY
// =====================================

function increaseQuantity(index) {

    cart[index].quantity++;

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();
    updateCartCount();
}

// =====================================
// DECREASE QUANTITY
// =====================================

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

// =====================================
// REMOVE ITEM
// =====================================

function removeItem(index) {

    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();
    updateCartCount();
}

// =====================================
// CLEAR CART
// =====================================

function clearCart() {

    if (confirm("Are you sure you want to clear your cart?")) {

        cart = [];

        localStorage.setItem("cart", JSON.stringify(cart));

        displayCart();
        updateCartCount();
    }
}

// =====================================
// UPDATE CART NUMBER
// =====================================

function updateCartCount() {

    const cartLink = document.getElementById("cart-link");

    if (!cartLink) return;

    let count = 0;

    cart.forEach(item => {
        count += item.quantity;
    });

    cartLink.innerHTML = `🛒 Cart (${count})`;
}

// =====================================
// CREATE ORDER NUMBER
// =====================================

function generateOrderNumber() {

    const randomNumber =
        Math.floor(1000 + Math.random() * 9000);

    return "TBE-" +
        new Date().getFullYear() +
        "-" +
        randomNumber;
}

// =====================================
// PLACE ORDER
// =====================================

async function placeOrder(event) {

    event.preventDefault();

    // ---------------------------------
    // CHECK CART
    // ---------------------------------

    if (cart.length === 0) {

        alert(
            "Your cart is empty. Please add a product before placing an order."
        );

        window.location.href = "cart.html";

        return;
    }

    // ---------------------------------
    // GET CUSTOMER INFORMATION
    // ---------------------------------

    const nameInput =
        document.querySelector('input[type="text"]');

    const emailInput =
        document.querySelector('input[type="email"]');

    const phoneInput =
        document.querySelector('input[type="tel"]');

    const textareas =
        document.querySelectorAll("textarea");

    const name =
        nameInput ? nameInput.value.trim() : "";

    const email =
        emailInput ? emailInput.value.trim() : "";

    const phone =
        phoneInput ? phoneInput.value.trim() : "";

    const address =
        textareas[0]
            ? textareas[0].value.trim()
            : "";

    const notes =
        textareas[1]
            ? textareas[1].value.trim()
            : "";

    // ---------------------------------
    // VALIDATE CUSTOMER INFORMATION
    // ---------------------------------

    if (!name || !email || !phone || !address) {

        alert(
            "Please fill in your name, email, phone number and delivery address."
        );

        return;
    }

    // ---------------------------------
    // CREATE ORDER NUMBER
    // ---------------------------------

    const orderNumber =
        generateOrderNumber();

    // ---------------------------------
    // CREATE ORDER DETAILS
    // ---------------------------------

    let orderItems = "";

    let whatsappMessage =
`🛍️ NEW ORDER - TOMMY'S BEAUTY ESSENTIALS

Order Number: ${orderNumber}

Name: ${name}

Email: ${email}

Phone: ${phone}

Delivery Address:
${address}

Order Notes:
${notes || "None"}

--------------------

ORDER DETAILS:

`;

    let total = 0;

    cart.forEach(item => {

        const subtotal =
            item.price * item.quantity;

        orderItems +=
            `${item.name} x${item.quantity} - ₦${subtotal}\n`;

        whatsappMessage +=
            `${item.name} x${item.quantity} - ₦${subtotal}\n`;

        total += subtotal;
    });

    whatsappMessage +=
`
--------------------

TOTAL: ₦${total}

PAYMENT STATUS: AWAITING PAYMENT

Please confirm payment before processing the order.

Thank you!
`;

    // ---------------------------------
    // EMAIL TEMPLATE DATA
    // ---------------------------------

    const templateParams = {

        order_number: orderNumber,

        customer_name: name,

        customer_email: email,

        customer_phone: phone,

        delivery_address: address,

        order_items: orderItems,

        order_total: "₦" + total
    };

    // =====================================
    // EMAILJS
    // =====================================

    if (typeof emailjs !== "undefined") {

        emailjs.init({
            publicKey: EMAILJS_PUBLIC_KEY
        });

        // ---------------------------------
        // SEND EMAIL TO TOMMY
        // ---------------------------------

        try {

            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams
            );

            console.log(
                "Order notification email sent to Tommy."
            );

        } catch (error) {

            console.error(
                "Tommy email failed:",
                error
            );

        }

        // ---------------------------------
        // SEND EMAIL TO CUSTOMER
        // ---------------------------------

        try {

            await emailjs.send(
                EMAILJS_SERVICE_ID,
                CUSTOMER_EMAIL_TEMPLATE_ID,
                templateParams
            );

            console.log(
                "Customer confirmation email sent."
            );

        } catch (error) {

            console.error(
                "Customer confirmation email failed:",
                error
            );
        }

    } else {

        console.error(
            "EmailJS is not loaded."
        );
    }

    // =====================================
    // OPEN WHATSAPP
    // =====================================

    const phoneNumber =
        "2349115180053";

    const whatsappURL =
        `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    window.open(
        whatsappURL,
        "_blank"
    );

    // =====================================
    // CLEAR CART
    // =====================================

    cart = [];

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    displayCart();
    updateCartCount();

    // =====================================
    // SUCCESS MESSAGE
    // =====================================

    alert(
        `Order ${orderNumber} has been submitted successfully!`
    );
}

// =====================================
// SEARCH PRODUCTS
// =====================================

function searchProducts() {

    const input =
        document.getElementById("searchInput");

    if (!input) return;

    const filter =
        input.value.toLowerCase();

    const products =
        document.querySelectorAll(".product-card");

    products.forEach(product => {

        const title =
            product.querySelector("h3");

        if (!title) return;

        const name =
            title.textContent.toLowerCase();

        if (name.includes(filter)) {

            product.style.display = "block";

        } else {

            product.style.display = "none";
        }
    });
}

// =====================================
// SORT PRODUCTS
// =====================================

function sortProducts() {

    const sort =
        document.getElementById("sort");

    if (!sort) return;

    const container =
        document.querySelector(".product-container");

    if (!container) return;

    const cards =
        Array.from(
            container.querySelectorAll(".product-card")
        );

    cards.sort((a, b) => {

        const priceElementA =
            a.querySelector(".price");

        const priceElementB =
            b.querySelector(".price");

        const priceA =
            priceElementA
                ? parseInt(
                    priceElementA.textContent
                        .replace(/[₦,A-Za-z ]/g, "")
                )
                : 0;

        const priceB =
            priceElementB
                ? parseInt(
                    priceElementB.textContent
                        .replace(/[₦,A-Za-z ]/g, "")
                )
                : 0;

        const nameA =
            a.querySelector("h3")
                ? a.querySelector("h3").textContent
                : "";

        const nameB =
            b.querySelector("h3")
                ? b.querySelector("h3").textContent
                : "";

        switch (sort.value) {

            case "low-high":
                return priceA - priceB;

            case "high-low":
                return priceB - priceA;

            case "a-z":
                return nameA.localeCompare(nameB);

            case "z-a":
                return nameB.localeCompare(nameA);

            default:
                return 0;
        }
    });

    cards.forEach(card => {
        container.appendChild(card);
    });
}

// =====================================
// CONTACT FORM → WHATSAPP
// =====================================

function sendContactMessage(event) {

    event.preventDefault();

    const name =
        document.getElementById("contactName").value;

    const email =
        document.getElementById("contactEmail").value;

    const message =
        document.getElementById("contactMessage").value;

    const whatsappMessage =
`💬 NEW WEBSITE MESSAGE

Name: ${name}

Email: ${email}

Message:
${message}

--------------------
Sent from Tommy's Beauty Essentials website.
`;

    const phoneNumber =
        "2349115180053";

    const whatsappURL =
        `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    window.open(
        whatsappURL,
        "_blank"
    );
}

// =====================================
// MOBILE NAVIGATION
// =====================================

function toggleMenu() {

    const nav =
        document.getElementById("mainNav");

    if (!nav) return;

    nav.classList.toggle(
        "mobile-menu-open"
    );
}

// =====================================
// LOAD WHEN PAGE OPENS
// =====================================

displayCart();
updateCartCount();