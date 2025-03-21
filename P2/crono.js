document.addEventListener("DOMContentLoaded", function () {
    console.log("¡crono.js cargado!");

    // Botones del cronómetro
    const startBtn = document.getElementById("start");
    const stopBtn = document.getElementById("stop");
    const resetBtn = document.getElementById("reset");
    const botonesDigito = document.querySelectorAll(".digito");
    const botonMagia = document.getElementById("magia");
    const titulo = document.querySelector("h1");

    let cronometro;
    let tiempo = 0;
    let enMarcha = false;
    let claveSecreta = [];
    let intentosRestantes = 10;
    let ambienteActivo = false;

    // Generar clave secreta
    function generarClaveSecreta() {
        claveSecreta = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10));
        console.log("Clave secreta:", claveSecreta); // Para depuración
    }

    // Iniciar cronómetro
    function iniciarCronometro() {
        if (!enMarcha) {
            enMarcha = true;
            cronometro = setInterval(() => {
                tiempo++;
                const minutos = String(Math.floor(tiempo / 60)).padStart(2, "0");
                const segundos = String(tiempo % 60).padStart(2, "0");
                document.getElementById("cronometro").textContent = `${minutos}:${segundos}`;
            }, 1000);
        }
    }

    // Detener cronómetro
    function detenerCronometro() {
        clearInterval(cronometro);
        enMarcha = false;
    }

    // Reiniciar cronómetro y juego
    function reiniciarCronometro() {
        detenerCronometro();
        tiempo = 0;
        document.getElementById("cronometro").textContent = "00:00";
        intentosRestantes = 10;
        document.getElementById("intentos").textContent = intentosRestantes;
        generarClaveSecreta();
        document.querySelectorAll(".numero").forEach(num => num.textContent = "*");
    }

    // Manejo de los botones de los números
    function manejarDigito(event) {
        if (enMarcha) {
            const digito = parseInt(event.target.textContent);
            let acierto = false;

            claveSecreta.forEach((num, index) => {
                const elementoNumero = document.querySelectorAll(".numero")[index];

                if (num === digito && elementoNumero.textContent === "*") {
                    elementoNumero.textContent = digito;
                    elementoNumero.style.color = "green";
                    acierto = true;
                }
            });

            if (!acierto) {
                intentosRestantes--;
                document.getElementById("intentos").textContent = intentosRestantes;
            }

            if ([...document.querySelectorAll(".numero")].every(num => num.textContent !== "*")) {
                detenerCronometro();
                alert("¡Felicidades! Adivinaste la clave secreta.");
            }

            if (intentosRestantes === 0) {
                detenerCronometro();
                alert("¡Perdiste! Se acabaron los intentos.");
                reiniciarCronometro();
            }
        } else {
            alert("¡Primero dale a START!");
        }
    }

    // Cambiar fondo y color del título con "Magic"
    botonMagia.addEventListener("click", function () {
        document.body.classList.toggle("modo-ambiente");
        titulo.style.color = ambienteActivo ? "#333" : "white";
        botonMagia.textContent = ambienteActivo ? "Magic" : "Boring";
        ambienteActivo = !ambienteActivo;
    });


});
