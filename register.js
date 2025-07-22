document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");
  const inputs = form.querySelectorAll("input");
  const registerButton = document.getElementById("register-button");

  const passwordInput = document.getElementById("password");
  const passwordRequirements = document.getElementById("password-requirements");
  const pwLength = document.getElementById("pw-length");
  const pwLetter = document.getElementById("pw-letter");
  const pwNumber = document.getElementById("pw-number");
  const pwSymbol = document.getElementById("pw-symbol");

  const regex = {
    nombre: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
    apellido: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
    correo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    cedula: /^[A-Za-z]{1}-?\d+$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
  };

  function validarCampo(input, expresion) {
    const valor = input.value.trim();
    if (valor === "") {
      input.classList.remove("input-error");
      return false;
    }
    if (!expresion.test(valor)) {
      input.classList.add("input-error");
      return false;
    } else {
      input.classList.remove("input-error");
      return true;
    }
  }

  function validarPassword() {
    const pwd = passwordInput.value;
    const validLength = pwd.length >= 8;
    const hasLetter = /[A-Za-z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd);

    if (pwd.length > 0) {
      passwordRequirements.classList.add("active");
    } else {
      passwordRequirements.classList.remove("active");
    }

    pwLength.classList.toggle("valid", validLength);
    pwLetter.classList.toggle("valid", hasLetter);
    pwNumber.classList.toggle("valid", hasNumber);
    pwSymbol.classList.toggle("valid", hasSymbol);

    const cumpleTodo = validLength && hasLetter && hasNumber && hasSymbol;

    if (pwd.length > 0 && !cumpleTodo) {
      passwordInput.classList.add("input-error");
    } else {
      passwordInput.classList.remove("input-error");
    }

    return cumpleTodo;
  }

  function validarFormulario() {
    const nombreValido = validarCampo(form.nombre, regex.nombre);
    const apellidoValido = validarCampo(form.apellido, regex.apellido);
    const correoValido = validarCampo(form.correo, regex.correo);
    const cedulaValida = validarCampo(form.cedula, regex.cedula);
    const passwordValida = validarPassword();

    const todosValidos = nombreValido && apellidoValido && correoValido && cedulaValida && passwordValida;

    registerButton.disabled = !todosValidos;
  }

  inputs.forEach(input => {
    input.addEventListener("input", () => {
      validarFormulario();
    });
  });

  passwordInput.addEventListener("focus", () => {
    passwordRequirements.classList.add("active");
  });

  passwordInput.addEventListener("blur", () => {
    if (passwordInput.value.trim() === "") {
      passwordRequirements.classList.remove("active");
    }
  });
  let requirementsTimeout;

passwordInput.addEventListener("focus", () => {
  clearTimeout(requirementsTimeout);
  passwordRequirements.classList.add("active");
});

passwordInput.addEventListener("blur", () => {
  requirementsTimeout = setTimeout(() => {
    passwordRequirements.classList.remove("active");

    }, 150); 
    });
});
