import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyALeFa7M2E0GjXuQnUN3eCUkyXKkKfbr_0",
  authDomain: "donaciones-en-tiempo-real.firebaseapp.com",
  projectId: "donaciones-en-tiempo-real",
  storageBucket: "donaciones-en-tiempo-real.firebasestorage.app",
  messagingSenderId: "542484805974",
  appId: "1:542484805974:web:39083c13e2840eb9077ef7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Función para validar el formato de correo
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Toggle para mostrar/ocultar la contraseña
const togglePassword = document.getElementById("togglePassword");
togglePassword.addEventListener("click", () => {
  const passwordInput = document.getElementById("password_login");
  const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);
  // Alterna entre íconos de ojo abierto y cerrado
  togglePassword.querySelector("i").classList.toggle("bi-eye");
  togglePassword.querySelector("i").classList.toggle("bi-eye-slash");
});

// Manejo del inicio de sesión
document.getElementById("formulario_login")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email_login").value;
  const password = document.getElementById("password_login").value;

  // Validar formato de email antes de proceder
  if (!isValidEmail(email)) {
    alert("Has escrito mal el correo, vuelve a escribirlo por favor.");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "../estadisticas.html";
  } catch (error) {
    console.error(error);
    // Manejo de errores según el código devuelto por Firebase
    if (
      error.code === "auth/invalid-email" ||
      error.code === "auth/user-not-found" ||
      error.code === "auth/invalid-login-credentials"
    ) {
      alert("Has ingresado mal los datos, vuelve a ingresarlos, porfavor!");
    } else if (error.code === "auth/wrong-password") {
      alert("Contraseña incorrecta, vuelve a escribirla por favor.");
    } else {
      alert("Error al iniciar sesión: " + error.message);
    }
  }
});

// Manejo del estado de autenticación
onAuthStateChanged(auth, user => {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
    if (document.getElementById("displayName"))
      document.getElementById("displayName").innerText = user.displayName || user.email;
    if (document.getElementById("fotoPerfil"))
      document.getElementById("fotoPerfil").src = user.photoURL || "user.jpg";
  } else {
    localStorage.removeItem("user");
  }
});

// Función para cerrar sesión
document.getElementById("cerrarSesion")?.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      localStorage.removeItem("user");
      window.location.href = 'form.html';
    })
    .catch((error) => {
      console.error("Error al cerrar sesión: ", error);
    });
});
