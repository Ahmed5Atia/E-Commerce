window.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");
    const rememberCheckbox = document.getElementById("check");
  
    // Autofill saved email
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      emailInput.value = savedEmail;
      rememberCheckbox.checked = true;
    }
  });
  
  document.getElementById('signForm').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('check').checked;
    const error = document.getElementById('wrong_data');
  
    // Sample credentials
    const validEmail = "admin@example.com";
    const validPassword = "1234";
  
    // Check for empty fields
    if (email === validEmail && password === validPassword) {
        error.style.display = "none";
      
        // Save login session
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);
      
        // Handle remember me
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }
      
        this.submit();
      }
       else {
      error.textContent = "Sign-in failed. Invalid email or password.";
      error.style.display = "block";
    }
  });
  
  document.getElementById('showPassword').addEventListener('click', function () {
    const passwordInput = document.getElementById('password');
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");
  });
  