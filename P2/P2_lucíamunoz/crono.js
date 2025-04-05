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

    // Agregar audio opcional (si quieres música en modo ambiente)
    const musica = new Audio("ruta-de-tu-audio.mp3"); // Reemplaza con tu archivo de música

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

            const numeros = document.querySelectorAll(".numero");
            if (numeros.length > 0 && [...numeros].every(num => num.textContent !== "*")) {
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

    // Cambiar fondo y color del título con "Magic" y manejar música
    botonMagia.textContent = "Music"; // Por defecto, el botón dirá "Music"

    botonMagia.addEventListener("click", function () {
        document.body.classList.toggle("modo-ambiente");
        ambienteActivo = !ambienteActivo;
        
        // Cambiar texto del botón
        botonMagia.textContent = ambienteActivo ? "Boring" : "Music";

        // Cambiar color del título
        titulo.style.color = ambienteActivo ? "white" : "#333";

        // Manejo de música
        if (ambienteActivo) {
            musica.loop = true;
            musica.play().catch(err => console.log("Error al reproducir música:", err));
        } else {
            musica.pause();
            musica.currentTime = 0;
        }
    });

    // Agregar eventos a los botones
    startBtn.addEventListener("click", iniciarCronometro);
    stopBtn.addEventListener("click", detenerCronometro);
    resetBtn.addEventListener("click", reiniciarCronometro);

    // Agregar eventos a los botones de los números
    botonesDigito.forEach(boton => {
        boton.addEventListener("click", manejarDigito);
    });

    // Inicializar juego
    generarClaveSecreta();
    document.getElementById("intentos").textContent = intentosRestantes;
});
