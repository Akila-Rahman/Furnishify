const DELIVERY_CHARGE = 120;

// Add items to the cart with name and price
function addToCart(itemName, itemPrice) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    itemPrice = parseFloat(itemPrice); // Ensure itemPrice is a number

    let itemIndex = cart.findIndex(item => item.name === itemName);

    if (itemIndex > -1) {
        // If item exists, increment the quantity
        cart[itemIndex].quantity += 1;
    } else {
        // Add a new item to the cart
        cart.push({ name: itemName, quantity: 1, price: itemPrice });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${itemName} has been added to your cart!`);
}

// Display cart items and calculate prices
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const totalAmountElement = document.getElementById('total-amount');
    const grandTotalElement = document.getElementById('grand-total');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalAmount = 0;

    cartItemsContainer.innerHTML = ''; // Clear previous items

    if (cart.length === 0) {
        // Display empty cart message
        emptyCartMessage.style.display = 'block';
        cartItemsContainer.style.display = 'none';
        totalAmountElement.textContent = `Total: $0.00`;
        grandTotalElement.textContent = `Grand Total: $${DELIVERY_CHARGE.toFixed(2)}`;
        return;
    }

    emptyCartMessage.style.display = 'none';
    cartItemsContainer.style.display = 'block';

    cart.forEach((item, index) => {
        const itemPrice = parseFloat(item.price);
        const itemQuantity = parseInt(item.quantity);
        const itemTotalPrice = itemPrice * itemQuantity;

        // Update the total amount
        totalAmount += itemTotalPrice;

        // Create a cart item element
        let itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <p><strong>${item.name}</strong></p>
            <p>Price per item: $${itemPrice.toFixed(2)}</p>
            <label>Quantity: 
                <input type="number" value="${itemQuantity}" min="1" onchange="updateQuantity(${index}, this.value)">
            </label>
            <p>Total: $${itemTotalPrice.toFixed(2)}</p>
            <button onclick="removeFromCart(${index})">Remove</button>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    // Update total and grand total
    totalAmountElement.textContent = `Total: $${totalAmount.toFixed(2)}`;
    const grandTotal = totalAmount + DELIVERY_CHARGE;
    grandTotalElement.textContent = `Grand Total: $${grandTotal.toFixed(2)}`;
}

// Update the quantity of an item in the cart
function updateQuantity(index, newQuantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    newQuantity = parseInt(newQuantity);

    if (newQuantity > 0) {
        cart[index].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
    } else {
        alert('Quantity must be at least 1.');
    }
}

// Remove an item from the cart
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1); // Remove item at the specified index
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
}

// Clear the entire cart
function clearCart() {
    localStorage.removeItem('cart');
    displayCartItems();
}

// Handle checkout submission
function handleCheckout(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const address = document.getElementById('address').value.trim();
    const paymentMethod = document.getElementById('payment-method').value;

    if (!name || !address || !paymentMethod) {
        alert('Please fill out all fields.');
        return;
    }

    alert(`Thank you for your order, ${name}! Your furniture will be delivered to ${address}.`);
    localStorage.removeItem('cart');
    displayCartItems();
}

// Initialize the cart page
if (window.location.pathname.includes('cart.html')) {
    displayCartItems();
}
