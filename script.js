document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const loginButton = document.getElementById("login-button");
    let users = [];

    async function loadUsers() {
        try {
            const response = await fetch('users.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            users = await response.json();
        } catch (error) {
            console.error("Error al cargar los usuarios:", error);
            loginButton.disabled = true;
        }
    }

    function validateForm() {
        const isUsernameValid = usernameInput.value.trim() !== "";
        const isPasswordValid = passwordInput.value.trim() !== "";
        loginButton.disabled = !(isUsernameValid && isPasswordValid);
    }

    loadUsers();

    // Validar en cada input del usuario
    usernameInput.addEventListener("input", validateForm);
    passwordInput.addEventListener("input", validateForm);

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();
        if (loginButton.disabled) return;

        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const foundUser = users.find(user => user.username === username && user.password === password);

        if (foundUser) {
            localStorage.setItem('loggedInUsername', foundUser.username);
            window.location.href = "homepage/start.html";
        } else {
            alert("Nombre de usuario o contraseña incorrectos.");
        }
    });
});