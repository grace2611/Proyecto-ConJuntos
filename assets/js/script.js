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
  slidesPerView: 7,
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

/* --- Slideshow para Snap Item 2: "¿Quienes somos?" --- */
document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll("#snap2 .slide");
  let currentIndex = 0;

  function showSlide(index) {
    slides[currentIndex].classList.remove("active");
    currentIndex = index;
    slides[currentIndex].classList.add("active");
  }

  function changeSlide() {
    showSlide((currentIndex + 1) % slides.length);
  }

  let slideInterval = setInterval(changeSlide, 6000);

  // Flechas de navegación manual
  const prevArrow = document.querySelector("#snap2 .arrow.prev");
  const nextArrow = document.querySelector("#snap2 .arrow.next");

  if (prevArrow && nextArrow) {
    prevArrow.addEventListener("click", () => {
      clearInterval(slideInterval);
      const newIndex = (currentIndex - 1 + slides.length) % slides.length;
      showSlide(newIndex);
      slideInterval = setInterval(changeSlide, 6000);
    });

    nextArrow.addEventListener("click", () => {
      clearInterval(slideInterval);
      const newIndex = (currentIndex + 1) % slides.length;
      showSlide(newIndex);
      slideInterval = setInterval(changeSlide, 6000);
    });
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

/* Mostrar/ocultar input "Otro" según la selección y hacerlo obligatorio */
montoRadios.forEach(radio => {
  radio.addEventListener("change", () => {
    if (radio.value === "otro") {
      divOtroMonto.style.display = "block";
      inputOtroMonto.required = true;
    } else {
      divOtroMonto.style.display = "none";
      inputOtroMonto.required = false;
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
    if (inputOtroMonto.value.trim() === "") {
      alert("Por favor, ingrese un monto en la opción 'otro'.");
      return;
    }
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
    const modalDonacionEl = document.getElementById("modal-donacion");
    const modalDonacionInstance = bootstrap.Modal.getInstance(modalDonacionEl);
    if (modalDonacionInstance) {
      modalDonacionInstance.hide();
    }
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
    const modalVoluntariadoEl = document.getElementById("modal-voluntariado");
    const modalVoluntariadoInstance = bootstrap.Modal.getInstance(modalVoluntariadoEl);
    if (modalVoluntariadoInstance) {
      modalVoluntariadoInstance.hide();
    }
    const nombreVoluntario = document.getElementById("nombre-voluntario").value;
    document.getElementById("mensaje-agradecimiento").innerText = `¡Estamos agradecidos de que hayas elegido donar tu tiempo y talento a nuestra organización, ${nombreVoluntario}!`;
    const modalAgradecimiento = new bootstrap.Modal(document.getElementById("modal-agradecimiento"));
    modalAgradecimiento.show();
  } catch (error) {
    console.error("Error al guardar el voluntariado:", error);
  }
});

// Inicializar tooltips de Bootstrap para elementos con data-bs-toggle="tooltip"
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});

// Al hacer click en el icono de acceso de administrador, se redirige directamente a login.html
document.getElementById('admin-access').addEventListener('click', () => {
  window.location.href = 'login.html';
});
