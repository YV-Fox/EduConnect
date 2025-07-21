document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const loginButton = document.getElementById("login-button");

    function validarCampos() {
        const usuario = usernameInput.value.trim();
        const contraseña = passwordInput.value.trim();

        if (usuario && contraseña) {
            loginButton.disabled = false;
        } else {
            loginButton.disabled = true;
        }
    }

    usernameInput.addEventListener("input", validarCampos);
    passwordInput.addEventListener("input", validarCampos);

    validarCampos();

    form.addEventListener("submit", (e) => {
        if (loginButton.disabled) {
            e.preventDefault();
        }
    });

    const claveInput = document.getElementById("clave");
  const mensaje = document.createElement("div");

  // Estilos base del mensaje
  mensaje.style.fontSize = "0.9rem";
  mensaje.style.marginTop = "6px";

  // Insertamos el mensaje justo después del input
  claveInput.parentNode.appendChild(mensaje);

  // Función de validación en tiempo real
  claveInput.addEventListener("input", () => {
    const clave = claveInput.value;

    const tieneLetra = /[a-zA-Z]/.test(clave);
    const tieneEspecial = /[^a-zA-Z0-9]/.test(clave);
    const longitudValida = clave.length >= 8;

    if (!longitudValida) {
      mensaje.textContent = "Mínimo 8 caracteres.";
      mensaje.style.color = "#f44336";
      claveInput.classList.add("input-error");
    } else if (!tieneLetra) {
      mensaje.textContent = "Debe contener al menos una letra.";
      mensaje.style.color = "#f44336";
      claveInput.classList.add("input-error");
    } else if (!tieneEspecial) {
      mensaje.textContent = "Debe incluir un carácter especial.";
      mensaje.style.color = "#f44336";
      claveInput.classList.add("input-error");
    } else {
      mensaje.textContent = "Clave válida.";
      mensaje.style.color = "#4caf50";
      claveInput.classList.remove("input-error");
    }
  });
});
