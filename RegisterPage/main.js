
document.getElementById("registerForm").onsubmit = function() {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    
    if (name === "" || email === "" || password === "") {
        alert("Please fill in all fields.");
        return false;
    }
    
    let user = {
        name: name,
        email: email,
        password: password
    };
    
    localStorage.setItem("user", JSON.stringify(user));
    alert("Thanks for the registration");
    return false;
};