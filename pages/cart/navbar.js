document.addEventListener("DOMContentLoaded", function () {
  const navbarHTML = `
  <nav class="navbar">
      <div class="logo">Exclusive</div>
      <div class="hamburger">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul class="nav-links">
        <li><a href="../../index.html">Home</a></li>
        <li><a href="#contact">Contact</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#signup">Sign Up</a></li>
      </ul>
      <div class="icons">
        <a href="/pages/wishlist/wishlist.html" class="icon fav" data-count="0"
          ><i class="fas fa-heart" style="color: #ff4d4d"></i
        ></a>
        <a href="/pages/cart/cart.html" class="icon cart" data-count="0"
          ><i class="fas fa-shopping-cart"></i
        ></a>
        <a href="#" class="icon"><i class="fas fa-user"></i></a>
      </div>
    </nav>
  `;

  document.getElementById("navbar-container").innerHTML = navbarHTML;
});

const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("active");
});

navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
  }
});
