// ===== USERS (STORE YOUR 3 LOGINS HERE) =====
const users = [
    { username: "shravi", password: "5678" },
    { username: "divyanshi", password: "abcd" },
    { username: "pranjal", password: "1234" },
    
];

// ===== LOGIN FORM =====
const form = document.querySelector("form");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.querySelector("input[type='text']").value;
    const password = document.querySelector("input[type='password']").value;

    // check user
    const validUser = users.find(function (user) {
        return user.username === username && user.password === password;
    });

    if (validUser) {
        alert("Login successful!");
        window.location.href = "food.html"; 
    } else {
        alert("Invalid username or password");
    }
});