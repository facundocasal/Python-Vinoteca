document.addEventListener("DOMContentLoaded", () => {
  loginButton.style.display = "none";
});

let registerTab = document.getElementById("registerTab");
let loginTab = document.getElementById("loginTab");
let registerButton = document.getElementById("register");
let loginButton = document.getElementById("login");
let nameInput = document.getElementById("nameInput");
let lastNameInput = document.getElementById("lastNameInput");
let title = document.getElementById("title");
let emailInput = document.getElementById("emailInput");
let passwordInput = document.getElementById("passwordInput");
let msj = document.getElementById("msj");



loginTab.onclick = function () {
  nameInput.style.display = "none";
  lastNameInput.style.display = "none";
  registerButton.style.display = "none";
  loginButton.style.display = "block";
  title.innerHTML = "Login";
  registerTab.classList.add("disable");
  loginTab.classList.remove("disable");
};

registerTab.onclick = function () {
  nameInput.style.display = "block";
  lastNameInput.style.display = "block";
  registerButton.style.display = "block";
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  email.value = "";
  password.value = "";
  loginButton.style.display = "none";
  title.innerHTML = "Registro";
  registerTab.classList.remove("disable");
  loginTab.classList.add("disable");
};

registerButton.addEventListener("click", () => {
  const name = document.getElementById("name");
  const lastName = document.getElementById("lastName");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  if (name.value == "") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Por favor escriba su Nombre.",
    });
    name.focus();
    return;
  }
  if (lastName.value == "") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Por favor escriba su Apellido.",
    });
    lastName.focus();
    return;
  }
  const validateEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
  if (!validateEmail.test(email.value)) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Por favor escriba un email valido",
    });
    email.focus();
    return;
  }

  if (password.value.length < 4) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "La contraseña debe contar con 4 caracteres",
    });
    password.focus();
    return;
  }
  const data = {
    name: name.value,
    lastName: lastName.value,
    email: email.value,
    password: password.value,
  };
  console.log(data);
  fetch("http://127.0.0.1:5000/createUser", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.response == "Email ya utilizado") {
        Swal.fire({
          icon: "error",
          title: data.response,
          text: "Inice sesion con su contraseña.",
        });
        lastName.value = "";
        name.value = "";
        email.value = "";
        password.value = "";
        nameInput.style.display = "none";
        lastNameInput.style.display = "none";
        registerButton.style.display = "none";
        loginButton.style.display = "block";
        title.innerHTML = "Login";
        return;
      }
      Swal.fire({
        icon: "success",
        title: data.response,
        text: "Ya puedes iniciar sesión.",
      });

      lastName.value = "";
      name.value = "";
      email.value = "";
      password.value = "";
      nameInput.style.display = "none";
      lastNameInput.style.display = "none";
      registerButton.style.display = "none";
      loginButton.style.display = "block";
      title.innerHTML = "Login";
    })
    .catch((error) => {
      if (error) {
        msj.classList.add("msj-error");
        msj.innerText =
          "En este momento no podes crear su cuenta , intente en otro momento";
      }
      setTimeout(() => {
        msj.innerText = "";
      }, "4000");
    });
});

loginButton.addEventListener("click", () => {
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const validateEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
  if (!validateEmail.test(email.value)) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Por favor escriba un email valido",
    });
    document.validation.email.focus();
    return;
  }

  if (password.value.length < 4) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "La contraseña debe contar con 4 caracteres",
    });
    document.validation.password.focus();
    return;
  }
  const data = {
    email: email.value,
    password: password.value,
  };
  console.log(data);
  fetch("http://127.0.0.1:5000/login", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.response) {
        msj.classList.add("msj-error");
        msj.innerText = data.response;
        setTimeout(() => {
          msj.innerText = "";
        }, "4000");
        return;
      }
      localStorage.setItem("id", JSON.stringify(data.id));
      document.location.href = "../V3.0-master/infoUser.html";
    })
    .catch((error) => {
      if (error) {
        msj.classList.add("msj-error");
        msj.innerText =
          "En este momento no podes iniciar seccion, por favor intenta en otro momento";
      }
      setTimeout(() => {
        msj.innerText = "";
      }, "4000");
    });
});

