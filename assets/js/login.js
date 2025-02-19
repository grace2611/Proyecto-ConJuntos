// Importar las funciones necesarias desde los CDN de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";

// Configuración de Firebase
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyALeFa7M2E0GjXuQnUN3eCUkyXKkKfbr_0",
    authDomain: "donaciones-en-tiempo-real.firebaseapp.com",
    projectId: "donaciones-en-tiempo-real",
    storageBucket: "donaciones-en-tiempo-real.firebasestorage.app",
    messagingSenderId: "542484805974",
    appId: "1:542484805974:web:39083c13e2840eb9077ef7"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);



// Manejo del inicio de sesión
document.getElementById("formulario_login")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email_login").value;
    const password = document.getElementById("password_login").value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "../estadisticas.html";
    } catch (error) {
        console.error(error);
        alert("Error al iniciar sesión");
    }
});


// Manejo del estado de autenticación
onAuthStateChanged(auth, user => {
    if (user) {
        localStorage.setItem("user", JSON.stringify(user)); // Guardar el usuario en el localStorage
        document.getElementById("displayName").innerText = user.displayName || user.email
        document.getElementById("fotoPerfil").src = user.photoURL || "user.jpg"; // Foto de perfil
    } else {
        localStorage.removeItem("user"); // Eliminar del localStorage si no hay usuario
    }
});

// Cerrar sesión
document.getElementById("cerrarSesion")?.addEventListener("click", () => {
    signOut(auth).then(() => {
        localStorage.removeItem("user");
        window.location.href = 'form.html'; // Redirige a la página de inicio
    }).catch((error) => {
        console.error("Error al cerrar sesión: ", error);
    })
});

