localStorage.setItem("users", JSON.stringify([]));

document.getElementById("registerForm").onsubmit = function () {
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  let users = JSON.parse(localStorage.getItem("users"));

  let user = {
    userName: name,
    email: email,
    password: password,
    wishlist: [],
    cart: [],
  };
  users.push(user);

  if (name === "" || email === "" || password === "") {
    alert("Please fill in all fields.");
    return false;
  }

  localStorage.setItem("users", JSON.stringify(users));
  alert("Thanks for the registration");
  //window.location.href = "../../index.html";
  return false;
};
