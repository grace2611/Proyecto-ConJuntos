/* --- Navbar: Scroll y Toggle --- */
const navbar = document.querySelector('.navbar');
const snapContainer = document.querySelector('.snap-container');

snapContainer.addEventListener('scroll', () => {
  if (snapContainer.scrollTop === 0) {
    navbar.classList.remove('scrolled');
  } else {
    navbar.classList.add('scrolled');
  }
});

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});

/* --- Inicialización de Swiper --- */
var thumbnailSwiper = new Swiper('.thumbnail-slider', {
  direction: 'horizontal',
  slidesPerView: 4,
  spaceBetween: 10,
  watchSlidesProgress: true,
  breakpoints: {
    768: {
      direction: 'vertical'
    }
  }
});

var mainSwiper = new Swiper('.main-slider', {
  spaceBetween: 10,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  },
  thumbs: {
    swiper: thumbnailSwiper
  },
  autoplay: {
    delay: 3000,
    disableOnInteraction: false
  }
});

/* --- Integración con Firebase para Donaciones y Voluntariados --- */
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyALeFa7M2E0GjXuQnUN3eCUkyXKkFbr_0",
  authDomain: "donaciones-en-tiempo-real.firebaseapp.com",
  projectId: "donaciones-en-tiempo-real",
  storageBucket: "donaciones-en-tiempo-real.appspot.com",
  messagingSenderId: "542484805974",
  appId: "1:542484805974:web:39083c13e2840eb9077ef7"
};

const appFirebase = initializeApp(firebaseConfig);
const db = getFirestore(appFirebase);
const auth = getAuth(appFirebase);

/* Elementos del DOM para los formularios de donación y voluntariado */
const formDonacion = document.getElementById("form-donacion");
const formVoluntariado = document.getElementById("form-voluntariado");

const inputNombre = document.getElementById("nombre");
const inputEmail = document.getElementById("email");
const selectMoneda = document.getElementById("moneda");
const tipoDonacionRadios = document.getElementsByName("tipo_donacion");
const opcionesMontoDiv = document.getElementById("opciones-monto");
const montoRadios = document.getElementsByName("monto_opcion");
const divOtroMonto = document.getElementById("input-otro-monto");
const inputOtroMonto = document.getElementById("otro-monto");
const textareaMensaje = document.getElementById("mensaje");

/* Mostrar opciones de monto al seleccionar tipo de donación */
tipoDonacionRadios.forEach(radio => {
  radio.addEventListener("change", () => {
    opcionesMontoDiv.style.display = "block";
  });
});

/* Mostrar/ocultar input "Otro" según la selección */
montoRadios.forEach(radio => {
  radio.addEventListener("change", () => {
    if (radio.value === "otro") {
      divOtroMonto.style.display = "block";
    } else {
      divOtroMonto.style.display = "none";
    }
  });
});

/* Envío del formulario de donación */
formDonacion.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = inputNombre.value;
  const email = inputEmail.value;
  const moneda = selectMoneda.value;
  let tipo = "";
  tipoDonacionRadios.forEach(radio => {
    if (radio.checked) {
      tipo = radio.value;
    }
  });
  let montoSeleccionado = "";
  montoRadios.forEach(radio => {
    if (radio.checked) {
      montoSeleccionado = radio.value;
    }
  });
  if (montoSeleccionado === "otro") {
    montoSeleccionado = inputOtroMonto.value;
  }
  const monto = Number(montoSeleccionado);
  const mensaje = textareaMensaje.value;

  try {
    await addDoc(collection(db, "usuarios"), {
      nombre,
      email,
      moneda,
      tipo,
      monto,
      mensaje,
      fecha: serverTimestamp()
    });
    formDonacion.reset();
    opcionesMontoDiv.style.display = "none";
    divOtroMonto.style.display = "none";
    document.getElementById("mensaje-agradecimiento").innerText = `${nombre}, gracias por su donación exitosa.`;
    const modalAgradecimiento = new bootstrap.Modal(document.getElementById("modal-agradecimiento"));
    modalAgradecimiento.show();
  } catch (error) {
    console.error("Error al guardar la donación:", error);
  }
});

/* Envío del formulario de voluntariado */
formVoluntariado.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    await addDoc(collection(db, "voluntariados"), {
      nombre: document.getElementById("nombre-voluntario").value,
      email: document.getElementById("email-voluntario").value,
      telefono: document.getElementById("telefono").value,
      habilidades: document.getElementById("habilidades").value,
      fecha: serverTimestamp()
    });
    formVoluntariado.reset();
    const nombreVoluntario = document.getElementById("nombre-voluntario").value;
    document.getElementById("mensaje-agradecimiento").innerText = `¡Estamos agradecidos de que hayas elegido donar tu tiempo y talento a nuestra organización, ${nombreVoluntario}!`;
    const modalAgradecimiento = new bootstrap.Modal(document.getElementById("modal-agradecimiento"));
    modalAgradecimiento.show();
  } catch (error) {
    console.error("Error al guardar el voluntariado:", error);
  }
});
