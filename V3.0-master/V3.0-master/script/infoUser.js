const nameUser = document.getElementById("name");
const lastName = document.getElementById("lastName");
const email = document.getElementById("email");
const password = document.getElementById("password");
const logOut = document.getElementById("logOut");
const updateButton = document.getElementById("updateUser");
const deleteButton = document.getElementById("deleteUser");
const id = JSON.parse(localStorage.getItem("id")) || null;

async function traerData(id) {
    if (!id) {
        document.location.href = "../V3.0-master/registro.html";
    }
    const data = await fetch("http://127.0.0.1:5000/getUser/" + id);
    return data.json();
}
document.addEventListener("DOMContentLoaded", async () => {
    const dataJson = await traerData(id);
    nameUser.value = dataJson.name;
    lastName.value = dataJson.lastName;
    email.value = dataJson.email;
    password.value = dataJson.password;
});
logOut.addEventListener("click", () => {
    localStorage.removeItem("id");
    Swal.fire({
        icon: "success",
        title: "vuelve pronto !!",
        showConfirmButton: false,
        timer: 1500,
    });
    setTimeout(() => {
        document.location.href = "/V3.0-master/V3.0-master";
    }, "1500");
});
updateButton.addEventListener("click", async () => {
    if (nameUser.value == "") {
        Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor escriba su Nombre.",
        });
        nameUser.focus();
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
    Swal.fire({
        title: "Desea modificar sus datos ? ",
        text: "Precione continuar para aceptar los cambios",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Continuar",
        cancelButtonText : "Cancelar"
    }).then(async (result) => {
        if (result.isConfirmed) {
        const data = {
            name: nameUser.value,
            lastName: lastName.value,
            email: email.value,
            password: password.value,
        };
        try {
            let response = await fetch("http://127.0.0.1:5000/updateUser/" + id, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
            });
            response = await response.json();
            Swal.fire({
                icon: "success",
                title: `${response.response}`,
                showConfirmButton: false,
                timer: 1500,
            });      
            setTimeout(() => {
                document.location.reload();
            }, "1500");
        } catch (error) {
            console.log(error)
            Swal.fire({
                icon: "error",
                title: error,
                showConfirmButton: false,
                timer: 1500,
                });;
        }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
            title: "Cancelado",
            text: "Usuario no modificado",
            icon: "error",
        });
        }
    });
});

deleteButton.addEventListener("click", async () => {
    Swal.fire({
        title: "Desea eliminar su cuenta ? ",
        text: "Precione aceptar para eliminar su cuenta ",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Aceptar",
        cancelButtonText : "Cancelar"
    }).then(async (result) => {
        if (result.isConfirmed) {
        try {
            let response = await fetch("http://127.0.0.1:5000/deleteUser/" + id, {
            method: "DELETE",
            });
            response = await response.json();
            localStorage.removeItem("id");
            console.log(response.response)
            Swal.fire({
            icon: "success",
            title: `Cuenta eliminada`,
            showConfirmButton: false,
            timer: 1500,
            });
            setTimeout(() => {
                document.location.href = "/V3.0-master/V3.0-master";
            }, "1500");
        } catch (error) {
            console.log(error)
            Swal.fire({
                icon: "error",
                title: error,
                showConfirmButton: false,
                timer: 1500,
                });;
        }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
            title: "Cancelado",
            text: "Usuario no borrado",
            icon: "error",
        });
        }
    });
});
