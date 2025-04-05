// DOM Elements
const wishlistContainer = document.getElementById('wishlistContainer');
const recommendationsContainer = document.getElementById('recommendationsContainer');
const wishlistCount = document.getElementById('wishlistCount');
const itemCount = document.getElementById('itemCount');
const searchInput = document.getElementById('searchInput');
const seeAllLink = document.getElementById('seeAllLink');
const headerWishlist = document.getElementById('headerWishlist');
const headerWishlistCount = document.getElementById('headerWishlistCount');

// State using your JSON structure
let userData = {
    users: {
        username: "",
        password: "",
        email: "",
        wishlist: [],
        cart: []
    }
};
let allProducts = [];
let recommendations = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
// Load user data from localStorage
const savedData = localStorage.getItem('userData');
if (savedData) {
    userData = JSON.parse(savedData);
} else {
    // Initialize with your structure if no data exists
    localStorage.setItem('userData', JSON.stringify(userData));
}
    
loadWishlist();
fetchProducts();

// Set up search functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    if (searchTerm.length > 2) {
        searchProducts(searchTerm);
    } else if (searchTerm.length === 0) {
        displayWishlist();
    }
});

// Set up "See All" link
seeAllLink.addEventListener('click', (e) => {
    e.preventDefault();
    displayAllProducts();
});

// Set up header wishlist icon click
headerWishlist.addEventListener('click', () => {
    // Scroll to wishlist section
    document.querySelector('.wishlist-header').scrollIntoView({ behavior: 'smooth' });
});
});

// Load wishlist from userData
function loadWishlist() {
    updateWishlistCount();
    displayWishlist();
}

// Save wishlist to userData
function saveWishlist() {
    localStorage.setItem('userData', JSON.stringify(userData));
    updateWishlistCount();
}

// Update all wishlist count displays
function updateWishlistCount() {
const count = userData.users.wishlist.length;
wishlistCount.textContent = count;
itemCount.textContent = count;
headerWishlistCount.textContent = count;

// Pulse animation when count changes
if (count > 0) {
    headerWishlistCount.classList.add('pulse');
    setTimeout(() => {
        headerWishlistCount.classList.remove('pulse');
    }, 500);
}
}

// Fetch products from API using XMLHttpRequest
function fetchProducts() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://fakestoreapi.com/products', true);
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            allProducts = JSON.parse(xhr.responseText);
            generateRecommendations();
            displayWishlist();
        } else {
            console.error('Error fetching products:', xhr.statusText);
            showErrorAlert('Failed to load products. Please try again later.');
            recommendationsContainer.innerHTML = '<div class="empty-wishlist">Failed to load recommendations.</div>';
        }
    };
    
    xhr.onerror = function() {
        console.error('Request failed');
        showErrorAlert('Network error. Please check your connection.');
        recommendationsContainer.innerHTML = '<div class="empty-wishlist">Network error.</div>';
    };
    
    xhr.send();
}

// Generate recommendations (excluding wishlist items)
function generateRecommendations() {
    // Filter out items already in wishlist
    const availableProducts = allProducts.filter(product => 
        !userData.users.wishlist.some(item => item.id === product.id)
    );
    
    // Get random 4 products as recommendations
    recommendations = [];
    const maxRecommendations = Math.min(4, availableProducts.length);
    
    for (let i = 0; i < maxRecommendations; i++) {
        const randomIndex = Math.floor(Math.random() * availableProducts.length);
        recommendations.push(availableProducts[randomIndex]);
        availableProducts.splice(randomIndex, 1);
    }
    
    displayRecommendations();
}

// Display wishlist items
function displayWishlist() {
wishlistContainer.innerHTML = '';
userData.users.wishlist.forEach(product => {
    const discount = Math.random() > 0.5;
    const originalPrice = (product.price * (1 + Math.random() * 0.5)).toFixed(2);
    
    const productElement = document.createElement('div');
    productElement.className = 'wishlist-item';
    productElement.innerHTML = `
        <div class="item-heart" onclick="removeFromWishlist(${product.id}, '${product.title.replace(/'/g, "\\'")}')">
            <i class="fas fa-heart"></i>
        </div>
        <img src="${product.image}" alt="${product.title}">
        <h3>${product.title}</h3>
        <div class="price">
            ${discount ? `<span class="original-price">$${originalPrice}</span>` : ''}
            <span class="discounted-price">$${product.price}</span>
        </div>
        <button>Add to Cart</button>
    `;
    wishlistContainer.appendChild(productElement);
});
}

// Display recommendations
function displayRecommendations() {
if (recommendations.length === 0) {
    recommendationsContainer.innerHTML = '<div class="empty-wishlist">No recommendations available at this time.</div>';
    return;
}

recommendationsContainer.innerHTML = '';
recommendations.forEach(product => {
    const discount = Math.random() > 0.5;
    const originalPrice = (product.price * (1 + Math.random() * 0.5)).toFixed(2);
    const isInWishlist = userData.users.wishlist.some(item => item.id === product.id);
    
    const productElement = document.createElement('div');
    productElement.className = 'wishlist-item';
    productElement.innerHTML = `
    <div class="item-heart" onclick="${isInWishlist ? 
        `removeFromWishlist(${product.id}, '${product.title.replace(/'/g, "\\'")}')` : 
        `addToWishlist(${product.id}, '${product.title.replace(/'/g, "\\'")}')`}">
        <i class="fas ${isInWishlist ? 'fa-heart' : 'fa-heart'}"></i>
    </div>
    <img src="${product.image}" alt="${product.title}">
    <h3>${product.title}</h3>
    <div class="price">
        ${discount ? `<span class="original-price">$${originalPrice}</span>` : ''}
        <span class="discounted-price">$${product.price}</span>
    </div>
    <button>Add to Cart</button>
`;
    recommendationsContainer.appendChild(productElement);
});
}

// Display all products
function displayAllProducts() {
recommendationsContainer.innerHTML = '<div class="loading">Loading all products...</div>';

setTimeout(() => {
    recommendationsContainer.innerHTML = '';
    allProducts.forEach(product => {
    if (!userData.users.wishlist.some(item => item.id === product.id)) {
        const discount = Math.random() > 0.5;
        const originalPrice = (product.price * (1 + Math.random() * 0.5)).toFixed(2);
        
        const productElement = document.createElement('div');
        productElement.className = 'wishlist-item';
        productElement.innerHTML = `
            <div class="item-heart" onclick="addToWishlist(${product.id}, '${product.title.replace(/'/g, "\\'")}')">
                <i class="fas fa-heart"></i>
            </div>
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <div class="price">
                ${discount ? `<span class="original-price">$${originalPrice}</span>` : ''}
                <span class="discounted-price">$${product.price}</span>
            </div>
            <button>Add to Cart</button>
        `;
        recommendationsContainer.appendChild(productElement);
    }
    });
    
    if (recommendationsContainer.children.length === 0) {
        recommendationsContainer.innerHTML = '<div class="empty-wishlist">No products available.</div>';
    }
}, 500);
}

// Search products
function searchProducts(term) {
const filtered = allProducts.filter(product => 
    product.title.toLowerCase().includes(term) ||
    product.description.toLowerCase().includes(term)
);

recommendationsContainer.innerHTML = '';

if (filtered.length === 0) {
    recommendationsContainer.innerHTML = '<div class="empty-wishlist">No products found matching your search.</div>';
    return;
}

filtered.forEach(product => {
const isInWishlist = userData.users.wishlist.some(item => item.id === product.id);
const productElement = document.createElement('div');
productElement.className = 'wishlist-item';
productElement.innerHTML = `
    <div class="item-heart" onclick="${isInWishlist ? 
        `removeFromWishlist(${product.id}, '${product.title.replace(/'/g, "\\'")}')` : 
        `addToWishlist(${product.id}, '${product.title.replace(/'/g, "\\'")}')`}">
        <i class="fas ${isInWishlist ? 'fa-heart' : 'fa-heart-o'}"></i>
    </div>
    <img src="${product.image}" alt="${product.title}">
    <h3>${product.title}</h3>
    <div class="price">
        <span class="discounted-price">$${product.price}</span>
    </div>
    <button>Add to Cart</button>
`;
recommendationsContainer.appendChild(productElement);
});
}

// Show success alert with SweetAlert
function showSuccessAlert(message) {
    Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: message,
        confirmButtonColor: '#000',
        timer: 2000
    });
}

// Show error alert with SweetAlert
function showErrorAlert(message) {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message,
        confirmButtonColor: '#e63946'
    });
}

// Show info alert with SweetAlert
function showInfoAlert(message) {
    Swal.fire({
        icon: 'info',
        title: 'Info',
        text: message,
        confirmButtonColor: '#0d6efd',
        timer: 2000
    });
}

// Add product to wishlist
function addToWishlist(productId, productTitle) {
if (userData.users.wishlist.some(item => item.id === productId)) {
    showInfoAlert('This product is already in your wishlist!');
    return;
}

let productToAdd = allProducts.find(product => product.id === productId);

if (productToAdd) {
    userData.users.wishlist.push(productToAdd);
    saveWishlist();
    displayWishlist();
    generateRecommendations();
    showSuccessAlert(`${productTitle} added to wishlist!`);
    
    // Animate heart icon
    animateHeartIcon();
} else {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://fakestoreapi.com/products/${productId}`, true);
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            productToAdd = JSON.parse(xhr.responseText);
            userData.users.wishlist.push(productToAdd);
            saveWishlist();
            displayWishlist();
            generateRecommendations();
            showSuccessAlert(`${productToAdd.title} added to wishlist!`);
            
            // Animate heart icon
            animateHeartIcon();
        }
    };
    
    xhr.send();
}
}

// Remove product from wishlist
function removeFromWishlist(productId, productTitle) {
    Swal.fire({
        title: 'Are you sure?',
        text: `Remove ${productTitle} from your wishlist?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e63946',
        cancelButtonColor: '#333',
        confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
        if (result.isConfirmed) {
            userData.users.wishlist = userData.users.wishlist.filter(item => item.id !== productId);
            saveWishlist();
            displayWishlist();
            generateRecommendations();
            showSuccessAlert(`${productTitle} removed from wishlist!`);
        }
    });
}

// Animate heart icon in header
function animateHeartIcon() {
    const heart = headerWishlist.querySelector('i');
    heart.classList.add('animate');
    setTimeout(() => {
        heart.classList.remove('animate');
    }, 1000);
}