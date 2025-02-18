document.addEventListener("DOMContentLoaded", function() {
    let opciones = document.querySelectorAll(".opcion");

    opciones.forEach((opcion, index) => {
        setTimeout(() => {
            opcion.style.opacity = "1";
            opcion.style.transform = "translateY(0)";
        }, index * 300);
    });
});

