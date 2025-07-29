document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("register-form");
    const inputs = form.querySelectorAll("input");
    const registerButton = document.getElementById("register-button");
    const passwordInput = document.getElementById("password");
    const requirementsList = document.getElementById("password-requirements");
    const requirements = {
        length: document.getElementById("pw-length"),
        letter: document.getElementById("pw-letter"),
        number: document.getElementById("pw-number"),
        symbol: document.getElementById("pw-symbol")
    };

    const regex = {
        nombre: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/,
        apellido: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/,
        correo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        cedula: /^[VvEe]{1}-?\d{7,8}$/,
    };

    function validarPassword() {
        const pwd = passwordInput.value;
        const checks = {
            length: pwd.length >= 8,
            letter: /[A-Za-z]/.test(pwd),
            number: /\d/.test(pwd),
            symbol: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd)
        };
        
        Object.keys(checks).forEach(key => {
            requirements[key].classList.toggle('valid', checks[key]);
        });
        
        return Object.values(checks).every(Boolean);
    }

    function validarFormulario() {
        const isNombreValid = regex.nombre.test(form.nombre.value);
        const isApellidoValid = regex.apellido.test(form.apellido.value);
        const isCorreoValid = regex.correo.test(form.correo.value);
        const isCedulaValid = regex.cedula.test(form.cedula.value);
        const isPasswordValid = validarPassword();
        
        registerButton.disabled = !(isNombreValid && isApellidoValid && isCorreoValid && isCedulaValid && isPasswordValid);
    }

    inputs.forEach(input => {
        input.addEventListener("input", validarFormulario);
    });

    passwordInput.addEventListener("focus", () => requirementsList.classList.add("active"));
    passwordInput.addEventListener("blur", () => requirementsList.classList.remove("active"));
    
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!registerButton.disabled) {
            const email = form.correo.value.trim();
            const password = form.password.value;
            const username = form.nombre.value.trim(); 

            const newUser = { email, password, username };
            let users = JSON.parse(localStorage.getItem('users')) || [];
            
            if (users.some(user => user.email === email)) {
                alert("Este correo electrónico ya está registrado. Por favor, inicia sesión.");
                return;
            }

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            alert(`¡Registro exitoso, ${username}! Redirigiendo...`);
            localStorage.setItem('loggedInUsername', username); 
            window.location.href = "homepage/start.html";
        }
    });
});