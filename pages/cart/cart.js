let cartItems = document.getElementById("tableBody");
let cartIds = new XMLHttpRequest();
let returnToHome = document.getElementById("returnToHome");
returnToHome.addEventListener("click", () => {
  window.location.href = "../../index.html";
});
cartIds.open("GET", "/project.JSON", true);
cartIds.send();

cartIds.addEventListener("loadend", () => {
  let id = JSON.parse(cartIds.response);
  let items = id.users[0].cart;

  if (!items || items.length === 0) {
    displayEmptyCart();
    updateCartTotal(0);
    return;
  }

  let total = 0;

  items.forEach((item) => {
    let xml = new XMLHttpRequest();
    xml.open("GET", `https://fakestoreapi.com/products/${item}`, true);
    xml.send();

    xml.addEventListener("loadend", () => {
      let data = JSON.parse(xml.response);
      let price = data.price;
      let initialSubtotal = price * 1;

      total += initialSubtotal;

      // Update the total dynamically
      updateCartTotal(total);

      // Insert row with delete button
      let row = document.createElement("tr");
      row.innerHTML = `
        <td>
          <div class="imageTitle">
            <div class="image">
              <img src="${data.image}" alt="" id="trans" />
            </div>
            <p>${data.title}</p>
          </div>
        </td>
        <td>
          <p class="price">${price}$</p>
        </td>
        <td>
          <input type="number" class="quantity" data-price="${price}" min="1" value="1"/>
        </td>
        <td class="subtotal">${initialSubtotal}$</td>
        <td>
          <button class="delete-btn" data-id="${item}">X</button>
        </td>`;

      cartItems.appendChild(row);

      // Attach event listeners after adding items
      attachEventListeners();
    });
  });
});

// Function to display empty cart message
function displayEmptyCart() {
  cartItems.innerHTML = `
    <tr>
      <td colspan="5" style="text-align: center; padding: 20px;">
        No items in the cart
      </td>
    </tr>
  `;
}

// Function to update the cart total
function updateCartTotal(total) {
  document.getElementById("cart-total").textContent = total.toFixed(2);
}

// Function to update subtotal and cart total dynamically
function updateSubtotal(event) {
  let input = event.target;
  let price = parseFloat(input.getAttribute("data-price"));
  let quantity = parseInt(input.value);
  let subtotalCell = input.closest("tr").querySelector(".subtotal");

  let subtotal = price * quantity;
  subtotalCell.textContent = `${subtotal.toFixed(2)}$`;

  recalculateCartTotal();
}

// Function to recalculate the cart total
function recalculateCartTotal() {
  let total = 0;
  document.querySelectorAll(".subtotal").forEach((subtotal) => {
    total += parseFloat(subtotal.textContent.replace("$", ""));
  });

  updateCartTotal(total);
}

// Function to remove item from the cart
function deleteItem(event) {
  if (event.target.classList.contains("delete-btn")) {
    let row = event.target.closest("tr");
    let subtotal = parseFloat(
      row.querySelector(".subtotal").textContent.replace("$", "")
    );
    row.remove();

    // Check if cart is empty after deletion
    if (document.querySelectorAll("#tableBody tr").length === 0) {
      displayEmptyCart();
    }

    // Update the total after deleting
    let total = parseFloat(document.getElementById("cart-total").textContent);
    total -= subtotal;
    updateCartTotal(total);

    // Remove from JSON file (simulated)
    removeFromJson(event.target.getAttribute("data-id"));
  }
}

// Function to remove the item from project.JSON (simulated here)
function removeFromJson(itemId) {
  console.log(`Removing item ID: ${itemId} from JSON`);
}

function attachEventListeners() {
  document.querySelectorAll(".quantity").forEach((input) => {
    input.addEventListener("input", updateSubtotal);
  });

  document.getElementById("tableBody").addEventListener("click", deleteItem);
}

function checkout() {
  alert("Proceeding to checkout!");
}
