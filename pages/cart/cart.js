let cartItems = document.getElementById("tableBody");
let cartIds = new XMLHttpRequest();

cartIds.open("GET", "/project.JSON", true);
cartIds.send();

cartIds.addEventListener("loadend", () => {
  let id = JSON.parse(cartIds.response);
  let items = id.users[0].cart;

  // Initialize the total variable
  let total = 0;

  items.forEach((item, index) => {
    let xml = new XMLHttpRequest();
    xml.open("GET", `https://fakestoreapi.com/products/${item}`, true);
    xml.send();

    xml.addEventListener("loadend", () => {
      let data = JSON.parse(xml.response);
      let price = data.price;

      // Calculate the initial subtotal
      let initialSubtotal = price * 1;  // Default to 1 quantity for now

      // Update the cart with new row
      cartItems.innerHTML += `
        <tr>
          <td>
            <div class="imageTitle">
              <div class="image">
                <img src="${data.image}" alt="" />
              </div>
              <p>${data.title}</p>
            </div>
          </td>
          <td>
            <p class="price">${price}$</p>
          </td>
          <td>
            <input type="number" class="quantity" data-price="${price}" data-item="${data.id}" min="1" value="1"/>
          </td>
          <td class="subtotal">${initialSubtotal}$</td>
        </tr>`;

      // Recalculate the total as items are added
      total += initialSubtotal;
      
      // Update the total dynamically after each item is added
      document.getElementById('cart-total').textContent = total.toFixed(2);

      // Attach event listeners to the quantity inputs for updating subtotals
      attachEventListeners();
    });
  });
});

// Function to update the subtotal and cart total dynamically
function updateSubtotal(event) {
  let quantityInput = event.target;
  let price = parseFloat(quantityInput.getAttribute('data-price'));
  let quantity = parseInt(quantityInput.value);
  let subtotalCell = quantityInput.closest('tr').querySelector('.subtotal');
  
  // Update the subtotal for this item
  let subtotal = price * quantity;
  subtotalCell.textContent = `${subtotal.toFixed(2)}$`;

  // Recalculate and update the cart total
  recalculateCartTotal();
}

// Function to recalculate the total for all items
function recalculateCartTotal() {
  let total = 0;
  let subtotals = document.querySelectorAll('.subtotal');

  subtotals.forEach(subtotal => {
    total += parseFloat(subtotal.textContent.replace('$', ''));
  });

  // Update the total in the cart total box
  document.getElementById('cart-total').textContent = total.toFixed(2);
}

// Attach event listeners to quantity inputs after the table is generated
function attachEventListeners() {
  let quantityInputs = document.querySelectorAll('.quantity');
  quantityInputs.forEach(input => {
    input.addEventListener('input', updateSubtotal);
  });
}

// Checkout function
function checkout() {
  alert("Proceeding to checkout!");
}
