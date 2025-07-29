document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const emailInput = document.getElementById("email"); 
    const passwordInput = document.getElementById("password");
    const loginButton = document.getElementById("login-button");
    let users = [];

    async function loadUsers() {
        try {
            const response = await fetch('users.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const baseUsers = await response.json();
            
            const registeredUsers = JSON.parse(localStorage.getItem('users')) || [];
            
            users = [...baseUsers, ...registeredUsers];

        } catch (error) {
            console.error("Error al cargar los usuarios base:", error);
            const registeredUsers = JSON.parse(localStorage.getItem('users')) || [];
            users = registeredUsers;
        }
    }

    function validateForm() {
        const isEmailValid = emailInput.value.trim() !== "";
        const isPasswordValid = passwordInput.value.trim() !== "";
        loginButton.disabled = !(isEmailValid && isPasswordValid);
    }

    loadUsers();

    emailInput.addEventListener("input", validateForm);
    passwordInput.addEventListener("input", validateForm);

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();
        if (loginButton.disabled) return;

        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const foundUser = users.find(user => user.email === email && user.password === password);

        if (foundUser) {
            localStorage.setItem('loggedInUsername', foundUser.username);
            window.location.href = "homepage/start.html";
        } else {
            alert("Correo electrónico o contraseña incorrectos.");
        }
    });
});