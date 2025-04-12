// DOM Elements
const wishlistContainer = document.getElementById("wishlistContainer");
const recommendationsContainer = document.getElementById(
  "recommendationsContainer"
);
const wishlistCount = document.getElementById("wishlistCount");
const itemCount = document.getElementById("itemCount");
const searchInput = document.getElementById("searchInput");
const seeAllLink = document.getElementById("seeAllLink");
const headerWishlist = document.getElementById("headerWishlist");
const headerWishlistCount = document.getElementById("headerWishlistCount");

let userData = []; // This will be an object from localStorage/users
let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

// Load userData from localStorage if currentUser is available
if (!currentUser) {
  let jsonxml = new XMLHttpRequest();
  jsonxml.open("GET", "../../project.JSON", true);
  jsonxml.send();
  jsonxml.addEventListener("loadend", () => {
    let response = JSON.parse(jsonxml.response);
    userData = response.users[0];
    if (!userData.wishlist) userData.wishlist = [];
  });
} else {
  let currentUsers = JSON.parse(localStorage.getItem("users")) || [];
  console.log("Users from localStorage:", currentUsers);
  for (let i = 0; i < currentUsers.length; i++) {
    if (
      currentUser === currentUsers[i].userName ||
      currentUser === currentUsers[i].email
    ) {
      userData = currentUsers[i];
      break;
    }
  }
}

let allProducts = [];
let recommendations = [];

document.addEventListener("DOMContentLoaded", () => {
  // Optionally update userData from localStorage.users if available
  const savedData = localStorage.getItem("users");
  if (savedData) {
    let users = JSON.parse(savedData);
    let found = users.find(
      (u) => currentUser === u.userName || currentUser === u.email
    );
    if (found) userData = found;
  }
  loadWishlist();
  fetchProducts();

  if (seeAllLink) {
    seeAllLink.addEventListener("click", (e) => {
      e.preventDefault();
      displayAllProducts();
    });
  }

  if (headerWishlist) {
    headerWishlist.addEventListener("click", () => {
      document
        .querySelector(".wishlist-header")
        .scrollIntoView({ behavior: "smooth" });
    });
  }
});

function loadWishlist() {
  updateWishlistCount();
  displayWishlist();
}

function saveWishlist() {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  for (let i = 0; i < users.length; i++) {
    if (currentUser === users[i].userName || currentUser === users[i].email) {
      users[i] = userData;
      break;
    }
  }
  localStorage.setItem("users", JSON.stringify(users));
  updateWishlistCount();
}

function updateWishlistCount() {
  const count = userData?.wishlist?.length || 0;
  wishlistCount.textContent = count;
  itemCount.textContent = count;
  if (headerWishlistCount) headerWishlistCount.textContent = count;

  if (count > 0 && headerWishlistCount) {
    headerWishlistCount.classList.add("pulse");
    setTimeout(() => {
      headerWishlistCount.classList.remove("pulse");
    }, 500);
  }
}

function fetchProducts() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "https://dummyjson.com/products/");

  xhr.onload = function () {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      allProducts = response.products.map((product) => {
        if (product.thumbnail && !product.thumbnail.startsWith("http")) {
          product.thumbnail = `https://dummyjson.com${product.thumbnail}`;
        }
        if (product.image && !product.image.startsWith("http")) {
          product.image = `https://dummyjson.com${product.image}`;
        }
        return product;
      });
      generateRecommendations();
      displayWishlist(); // Refresh wishlist now that products are loaded
    } else {
      console.error("Error fetching products:", xhr.statusText);
      showErrorAlert("Failed to load products. Please try again later.");
      recommendationsContainer.innerHTML =
        '<div class="empty-wishlist">Failed to load recommendations.</div>';
    }
  };

  xhr.onerror = function () {
    console.error("Request failed");
    showErrorAlert("Network error. Please check your connection.");
    recommendationsContainer.innerHTML =
      '<div class="empty-wishlist">Network error.</div>';
  };

  xhr.send();
}

// Helper: Fetch single product by ID from the API.
function fetchProductById(productId) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `https://dummyjson.com/products/${productId}`);
    xhr.onload = function () {
      if (xhr.status === 200) {
        let product = JSON.parse(xhr.responseText);
        if (product.thumbnail && !product.thumbnail.startsWith("http")) {
          product.thumbnail = `https://dummyjson.com${product.thumbnail}`;
        }
        resolve(product);
      } else {
        reject(new Error("Product not found"));
      }
    };
    xhr.onerror = function () {
      reject(new Error("Network error"));
    };
    xhr.send();
  });
}

function displayWishlist() {
  wishlistContainer.innerHTML = "";
  // If wishlist is empty, display a message
  if (!userData?.wishlist?.length) {
    wishlistContainer.innerHTML =
      '<div class="empty-wishlist">Your wishlist is empty</div>';
    return;
  }

  // For each productId in the wishlist, try to render its card.
  userData.wishlist.forEach((id) => {
    // Try to find the product in the already fetched products.
    let product = allProducts.find((p) => p.id === id);

    if (product) {
      renderProductCard(product, wishlistContainer, /*isWishlist*/ true);
    } else {
      // If not found, attempt to fetch it.
      fetchProductById(id)
        .then((fetchedProduct) => {
          // Push it into our local list so it is used subsequently.
          allProducts.push(fetchedProduct);
          renderProductCard(
            fetchedProduct,
            wishlistContainer,
            /*isWishlist*/ true
          );
        })
        .catch((error) => {
          console.error("Failed to fetch product with ID", id, error);
          // Optionally, remove the unavailable product ID from the wishlist.
          userData.wishlist = userData.wishlist.filter((pid) => pid !== id);
          saveWishlist();
        });
    }
  });
}

function renderProductCard(product, container, isWishlist = false) {
  const discount = Math.random() > 0.5;
  const originalPrice = (product.price * (1 + Math.random() * 0.5)).toFixed(2);

  const productElement = document.createElement("div");
  productElement.className = "wishlist-item";
  productElement.innerHTML = `
    <div class="item-heart" onclick="${
      isWishlist
        ? `removeFromWishlist(${product.id}, '${product.title.replace(
            /'/g,
            "\\'"
          )}')`
        : `addToWishlist(${product.id}, '${product.title.replace(
            /'/g,
            "\\'"
          )}')`
    }">
      <i class="fas fa-heart"></i>
    </div>
    <img src="${product.thumbnail || product.image}" 
      alt="${product.title}" 
      onerror="this.onerror=null;this.src='https://via.placeholder.com/150?text=No+Image';">
    <h3>${product.title}</h3>
    <div class="price">
      ${discount ? `<span class="original-price">$${originalPrice}</span>` : ""}
      <span class="discounted-price">$${product.price}</span>
    </div>
    <button>Add to Cart</button>
  `;
  container.appendChild(productElement);
}

function generateRecommendations() {
  // Build recommendations from products not already in the wishlist.
  const availableProducts = allProducts.filter(
    (product) => !userData?.wishlist?.includes(product.id)
  );

  recommendations = [];
  const maxRecommendations = Math.min(4, availableProducts.length);

  for (let i = 0; i < maxRecommendations; i++) {
    const randomIndex = Math.floor(Math.random() * availableProducts.length);
    recommendations.push(availableProducts[randomIndex]);
    availableProducts.splice(randomIndex, 1);
  }

  displayRecommendations();
}

function displayRecommendations() {
  if (recommendations.length === 0) {
    recommendationsContainer.innerHTML =
      '<div class="empty-wishlist">No recommendations available at this time.</div>';
    return;
  }

  recommendationsContainer.innerHTML = "";
  recommendations.forEach((product) => {
    const discount = Math.random() > 0.5;
    const originalPrice = (product.price * (1 + Math.random() * 0.5)).toFixed(
      2
    );
    const isInWishlist = userData?.wishlist?.includes(product.id);

    const productElement = document.createElement("div");
    productElement.className = "wishlist-item";
    productElement.innerHTML = `
      <div class="item-heart" onclick="${
        isInWishlist
          ? `removeFromWishlist(${product.id}, '${product.title.replace(
              /'/g,
              "\\'"
            )}')`
          : `addToWishlist(${product.id}, '${product.title.replace(
              /'/g,
              "\\'"
            )}')`
      }">
        <i class="fas fa-heart"></i>
      </div>
      <img src="${product.thumbnail || product.image}" 
        alt="${product.title}" 
        onerror="this.onerror=null;this.src='https://via.placeholder.com/150?text=No+Image';">
      <h3>${product.title}</h3>
      <div class="price">
        ${
          discount
            ? `<span class="original-price">$${originalPrice}</span>`
            : ""
        }
        <span class="discounted-price">$${product.price}</span>
      </div>
      <button>Add to Cart</button>
    `;
    recommendationsContainer.appendChild(productElement);
  });
}

function displayAllProducts() {
  recommendationsContainer.innerHTML =
    '<div class="loading">Loading all products...</div>';

  setTimeout(() => {
    recommendationsContainer.innerHTML = "";
    allProducts.forEach((product) => {
      if (!userData?.wishlist?.includes(product.id)) {
        renderProductCard(product, recommendationsContainer, false);
      }
    });

    if (recommendationsContainer.children.length === 0) {
      recommendationsContainer.innerHTML =
        '<div class="empty-wishlist">No products available.</div>';
    }
  }, 500);
}

function addToWishlist(productId, productTitle) {
  if (userData?.wishlist?.includes(productId)) {
    showInfoAlert("This product is already in your wishlist!");
    return;
  }
  userData.wishlist.push(productId);
  saveWishlist();
  // Refresh wishlist display, and update recommendations
  displayWishlist();
  generateRecommendations();
  showSuccessAlert(`${productTitle} added to wishlist!`);
  animateHeartIcon();
}

function removeFromWishlist(productId, productTitle) {
  Swal.fire({
    title: "Are you sure?",
    text: `Remove ${productTitle} from your wishlist?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e63946",
    cancelButtonColor: "#333",
    confirmButtonText: "Yes, remove it!",
  }).then((result) => {
    if (result.isConfirmed) {
      userData.wishlist = userData.wishlist.filter((id) => id !== productId);
      saveWishlist();
      displayWishlist();
      generateRecommendations();
      showSuccessAlert(`${productTitle} removed from wishlist!`);
    }
  });
}

function animateHeartIcon() {
  if (!headerWishlist) return;
  const heart = headerWishlist.querySelector("i");
  if (!heart) return;
  heart.classList.add("animate");
  setTimeout(() => {
    heart.classList.remove("animate");
  }, 1000);
}

function showSuccessAlert(message) {
  Swal.fire({
    icon: "success",
    title: "Success!",
    text: message,
    confirmButtonColor: "#000",
    timer: 2000,
  });
}

function showErrorAlert(message) {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: message,
    confirmButtonColor: "#e63946",
  });
}

function showInfoAlert(message) {
  Swal.fire({
    icon: "info",
    title: "Info",
    text: message,
    confirmButtonColor: "#0d6efd",
    timer: 2000,
  });
}
