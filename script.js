console.log("Welcome to Tommy's Beauty Essentials");

let cart = JSON.parse(localStorage.getItem("cart")) || [];


// =====================================
// DISCOUNT SYSTEM
// =====================================

let appliedDiscount = 0;
let appliedDiscountCode = "";

const discountCodes = {
    "TOMMY10": {
        type: "percentage",
        value: 10,
        minimum: 4500
    },

    "GLOW500": {
        type: "fixed",
        value: 500,
        minimum: 0
    },

    "WELCOME15": {
        type: "percentage",
        value: 15,
        minimum: 8000
    },

    "GOLD15": {
        type: "percentage",
        value: 15,
        minimum: 4000
    },

    "PRECIOUS15": {
        type: "percentage",
        value: 15,
        minimum: 4000
    }
};


// =====================================
// ADD TO CART
// =====================================

function addToCart(productName, productPrice) {

    const existingProduct = cart.find(
        item => item.name === productName
    );

    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({
            name: productName,
            price: productPrice,
            quantity: 1
        });

    }

    saveCart();

    alert(productName + " has been added to your cart!");

    displayCart();
    displayCheckoutSummary();
    updateCartCount();
}


// =====================================
// SAVE CART
// =====================================

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}


// =====================================
// DISPLAY CART
// =====================================

function displayCart() {

    const cartItems =
        document.getElementById("cart-items");

    const cartTotal =
        document.getElementById("cart-total");

    const checkoutBtn =
        document.getElementById("checkoutBtn");

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

        const subtotal =
            item.price * item.quantity;

        total += subtotal;

        cartItems.innerHTML += `
            <div class="cart-item">

                <h3>${item.name}</h3>

                <p>
                    Price: ₦${item.price}
                </p>

                <div class="quantity-controls">

                    <button onclick="decreaseQuantity(${index})">
                        −
                    </button>

                    <span>${item.quantity}</span>

                    <button onclick="increaseQuantity(${index})">
                        +
                    </button>

                </div>

                <p>
                    <strong>Subtotal:</strong>
                    ₦${subtotal}
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
// CHECKOUT ORDER SUMMARY
// =====================================

function displayCheckoutSummary() {

    const summary =
        document.getElementById("checkout-summary");

    if (!summary) return;

    if (cart.length === 0) {

        summary.innerHTML = `
            <p>Your cart is empty.</p>
        `;

        return;
    }

    let subtotal = 0;
    let summaryHTML = "";

    cart.forEach(item => {

        const itemSubtotal =
            item.price * item.quantity;

        subtotal += itemSubtotal;

        summaryHTML += `
            <div class="checkout-summary-item">

                <span>
                    ${item.name} × ${item.quantity}
                </span>

                <strong>
                    ₦${itemSubtotal}
                </strong>

            </div>
        `;

    });

    const discount =
        Math.min(appliedDiscount, subtotal);

    const total =
        subtotal - discount;

    summaryHTML += `

        <hr>

        <div class="checkout-summary-item">

            <span>
                Subtotal
            </span>

            <strong>
                ₦${subtotal}
            </strong>

        </div>

    `;

    if (discount > 0) {

        summaryHTML += `

            <div class="checkout-summary-item">

                <span>
                    Discount ${appliedDiscountCode
                        ? `(${appliedDiscountCode})`
                        : ""}
                </span>

                <strong>
                    -₦${discount}
                </strong>

            </div>

        `;

    }

    summaryHTML += `

        <div class="checkout-summary-total">

            <strong>
                Total
            </strong>

            <strong>
                ₦${total}
            </strong>

        </div>

    `;

    summary.innerHTML = summaryHTML;

}


// =====================================
// INCREASE QUANTITY
// =====================================

function increaseQuantity(index) {

    if (!cart[index]) return;

    cart[index].quantity++;

    saveCart();

    displayCart();
    displayCheckoutSummary();
    updateCartCount();

}


// =====================================
// DECREASE QUANTITY
// =====================================

function decreaseQuantity(index) {

    if (!cart[index]) return;

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        cart.splice(index, 1);

    }

    saveCart();

    displayCart();
    displayCheckoutSummary();
    updateCartCount();

}


// =====================================
// REMOVE ITEM
// =====================================

function removeItem(index) {

    if (!cart[index]) return;

    cart.splice(index, 1);

    saveCart();

    displayCart();
    displayCheckoutSummary();
    updateCartCount();

}


// =====================================
// CLEAR CART
// =====================================

function clearCart() {

    if (
        confirm(
            "Are you sure you want to clear your cart?"
        )
    ) {

        cart = [];

        appliedDiscount = 0;
        appliedDiscountCode = "";

        saveCart();

        displayCart();
        displayCheckoutSummary();
        updateCartCount();

    }

}


// =====================================
// UPDATE CART COUNT
// =====================================

function updateCartCount() {

    const cartLink =
        document.getElementById("cart-link");

    if (!cartLink) return;

    let count = 0;

    cart.forEach(item => {
        count += item.quantity;
    });

    cartLink.innerHTML =
        `🛒 Cart (${count})`;

}


// =====================================
// CREATE ORDER NUMBER
// =====================================

function generateOrderNumber() {

    const randomNumber =
        Math.floor(
            1000 + Math.random() * 9000
        );

    return (
        "TBE-" +
        new Date().getFullYear() +
        "-" +
        randomNumber
    );

}


// =====================================
// APPLY DISCOUNT
// =====================================

function applyDiscount() {

    const input =
        document.getElementById("discountCode");

    const message =
        document.getElementById("discountMessage");

    if (!input || !message) return;

    const code =
        input.value.trim().toUpperCase();

    if (!code) {

        appliedDiscount = 0;
        appliedDiscountCode = "";

        message.textContent =
            "Please enter a discount code.";

        displayCheckoutSummary();

        return;
    }

    const discount =
        discountCodes[code];

    if (!discount) {

        appliedDiscount = 0;
        appliedDiscountCode = "";

        message.textContent =
            "❌ Invalid discount code.";

        displayCheckoutSummary();

        return;
    }

    let subtotal = 0;

    cart.forEach(item => {

        subtotal +=
            item.price * item.quantity;

    });

    // Check minimum order amount
    if (subtotal < discount.minimum) {

        appliedDiscount = 0;
        appliedDiscountCode = "";

        message.textContent =
            `❌ ${code} requires a minimum order of ₦${discount.minimum}.`;

        displayCheckoutSummary();

        return;
    }

    // Calculate discount
    if (discount.type === "percentage") {

        appliedDiscount =
            subtotal *
            (discount.value / 100);

    } else {

        appliedDiscount =
            discount.value;

    }

    // Discount cannot exceed subtotal
    if (appliedDiscount > subtotal) {
        appliedDiscount = subtotal;
    }

    appliedDiscountCode = code;

    message.textContent =
        `✅ ${code} applied! You saved ₦${appliedDiscount}.`;

    displayCheckoutSummary();

}


// =====================================
// PLACE ORDER
// =====================================

function placeOrder(event) {

    event.preventDefault();

    if (cart.length === 0) {

        alert(
            "Your cart is empty. Please add a product before placing an order."
        );

        window.location.href =
            "cart.html";

        return;
    }

    // ---------------------------------
    // CUSTOMER INFORMATION
    // ---------------------------------

    const nameInput =
        document.querySelector(
            'input[type="text"]'
        );

    const emailInput =
        document.querySelector(
            'input[type="email"]'
        );

    const phoneInput =
        document.querySelector(
            'input[type="tel"]'
        );

    const textareas =
        document.querySelectorAll(
            "textarea"
        );

    const name =
        nameInput
            ? nameInput.value.trim()
            : "";

    const email =
        emailInput
            ? emailInput.value.trim()
            : "";

    const phone =
        phoneInput
            ? phoneInput.value.trim()
            : "";

    const address =
        textareas[0]
            ? textareas[0].value.trim()
            : "";

    const notes =
        textareas[1]
            ? textareas[1].value.trim()
            : "";

    // ---------------------------------
    // VALIDATION
    // ---------------------------------

    if (
        !name ||
        !email ||
        !phone ||
        !address
    ) {

        alert(
            "Please fill in your name, email, phone number and delivery address."
        );

        return;
    }

    // ---------------------------------
    // ORDER NUMBER
    // ---------------------------------

    const orderNumber =
        generateOrderNumber();

    // ---------------------------------
    // CALCULATE ORDER
    // ---------------------------------

    let subtotal = 0;

    let orderDetails = "";

    cart.forEach(item => {

        const itemSubtotal =
            item.price * item.quantity;

        subtotal += itemSubtotal;

        orderDetails +=
            `${item.name} x${item.quantity} - ₦${itemSubtotal}\n`;

    });

    let discountAmount =
        Math.min(
            appliedDiscount,
            subtotal
        );

    const total =
        subtotal - discountAmount;

    // ---------------------------------
    // WHATSAPP MESSAGE
    // ---------------------------------

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

${orderDetails}
--------------------

SUBTOTAL: ₦${subtotal}

DISCOUNT:
${
    appliedDiscountCode
        ? `${appliedDiscountCode} -₦${discountAmount}`
        : "None"
}

TOTAL: ₦${total}

PAYMENT STATUS: AWAITING PAYMENT

Please confirm payment before processing the order.

Thank you!
`;

    // ---------------------------------
    // OPEN WHATSAPP
    // ---------------------------------

    const phoneNumber =
        "2349115180053";

    const whatsappURL =
        `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
            whatsappMessage
        )}`;

    window.open(
        whatsappURL,
        "_blank"
    );

    // ---------------------------------
    // CLEAR CART
    // ---------------------------------

    cart = [];

    appliedDiscount = 0;
    appliedDiscountCode = "";

    saveCart();

    displayCart();
    displayCheckoutSummary();
    updateCartCount();

    // ---------------------------------
    // SUCCESS MESSAGE
    // ---------------------------------

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
        document.querySelectorAll(
            ".product-card"
        );

    products.forEach(product => {

        const title =
            product.querySelector("h3");

        if (!title) return;

        const name =
            title.textContent.toLowerCase();

        product.style.display =
            name.includes(filter)
                ? "block"
                : "none";

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
        document.querySelector(
            ".product-container"
        );

    if (!container) return;

    const cards =
        Array.from(
            container.querySelectorAll(
                ".product-card"
            )
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
                        .replace(
                            /[₦,A-Za-z ]/g,
                            ""
                        )
                )
                : 0;

        const priceB =
            priceElementB
                ? parseInt(
                    priceElementB.textContent
                        .replace(
                            /[₦,A-Za-z ]/g,
                            ""
                        )
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
        document.getElementById(
            "contactName"
        ).value;

    const email =
        document.getElementById(
            "contactEmail"
        ).value;

    const message =
        document.getElementById(
            "contactMessage"
        ).value;

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
        `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
            whatsappMessage
        )}`;

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
        document.getElementById(
            "mainNav"
        );

    if (!nav) return;

    nav.classList.toggle(
        "mobile-menu-open"
    );

}


// =====================================
// LOAD WHEN PAGE OPENS
// =====================================

displayCart();
displayCheckoutSummary();
updateCartCount();