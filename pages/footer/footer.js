// Update links based on environment
document.addEventListener("DOMContentLoaded", function () {
  const isLocal =
    window.location.hostname === "localhost" ||
    window.location.protocol === "file:" ||
    window.location.host === "127.0.0.1:5500";

  const basePath = isLocal ? "" : "https://ahmed5atia.github.io//E-Commerce/";

  const navbarHTML = `
  <div class="footer">
      <div class="footer2">
        <h2>Exclusive Price</h2>
        <h3>Subscribe</h3>
        <p>Get 10% off your first order</p>
        <div class="email-box">
          <input placeholder="Enter your email" />
          <button><i class="bi bi-send-fill"></i></button>
        </div>
      </div>

      <div class="footer2">
        <h3>Support</h3>
        <p>ITI Sohag ,<br />The New Sohag Place.</p>
        <p>ITI@gmail.com</p>
        <p>+20934778888</p>
      </div>

      <div class="footer2">
        <h3>Account</h3>
        <div class="links">
          <a href="#">My Account</a>
          <a href="#">Login/Register</a>
          <a href="#">Cart</a>
          <a href="#">Wishlist</a>
          <a href="#">Contact</a>
        </div>
      </div>

      <div class="footer2">
        <h3>Terms</h3>
        <div class="links">
          <a href="#">Privacy Policy</a>
          <a href="#">FAQ</a>
        </div>
      </div>

      <div class="footer2">
        <h3>Download App</h3>
        <p>Save $3 with App</p>
        <p>
          <a href="#"><i class="bi bi-google-play"></i> Google Play</a>
        </p>
        <p>
          <a href="#"><i class="bi bi-apple"></i> App Store</a>
        </p>
      </div>

      <div class="copyright">
        <p>© 2025 ITI Sohag</p>
      </div>
    </div>
  `;

  document.getElementById("footer").innerHTML = navbarHTML;
});
