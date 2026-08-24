function vreg() {
    const username = document.getElementById("uname").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("pass").value;
    const error = document.getElementById("errmsg");

    const usernameRegex = /^[A-Za-z0-9_]{3,20}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const phoneRegex = /^\d{10}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

    if (!usernameRegex.test(username)) {
        error.textContent = "Username must be 3–20 characters and contain only letters, numbers, or _.";
        return false;
    }

    if (!emailRegex.test(email)) {
        error.textContent = "Enter a valid email address.";
        return false;
    }

    if (!phoneRegex.test(phone)) {
        error.textContent = "Phone number must contain exactly 10 digits.";
        return false;
    }

    if (!passwordRegex.test(password)) {
        error.textContent =
            "Password must be at least 8 characters with uppercase, lowercase, number, and special character.";
        return false;
    }

    error.textContent = "";
     window.location.href = "dash.html";
    return true;
}

function vlogin() {
    const username = document.getElementById("loginUname").value.trim();
    const password = document.getElementById("loginPass").value;
    const error = document.getElementById("loginErrmsg");

    const usernameRegex = /^[A-Za-z0-9_]{3,20}$/;

    if (!usernameRegex.test(username)) {
        error.textContent = "Enter a valid username.";
        return false;
    }

    if (password.length === 0) {
        error.textContent = "Password is required.";
        return false;
    }

    error.textContent = "";
    window.location.href = "dash.html";
    return true;
}
