// Este archivo controlará el cronómetro

// Variable para almacenar el intervalo del cronómetro
let cronometro;
// Variable para contar los segundos
let tiempo = 0;
// Variable para saber si el cronómetro está en marcha
let enMarcha = false;
// Clave secreta aleatoria
let claveSecreta = [];
// Intentos restantes
let intentosRestantes = 10;

// Esta función genera la clave secreta
function generarClaveSecreta() {
  claveSecreta = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10));
  console.log("Clave secreta:", claveSecreta); // Solo para depuración
}

// Esta función inicia el cronómetro
function iniciarCronometro() {
  if (!enMarcha) { // Solo inicia si no está en marcha
    enMarcha = true;
    cronometro = setInterval(() => {
      tiempo++;
      const minutos = String(Math.floor(tiempo / 60)).padStart(2, '0');
      const segundos = String(tiempo % 60).padStart(2, '0');
      document.getElementById('cronometro').textContent = `${minutos}:${segundos}`;
    }, 1000); // 1000 milisegundos = 1 segundo
  }
}

// Esta función detiene el cronómetro
function detenerCronometro() {
  clearInterval(cronometro); // Para el intervalo
  enMarcha = false; // Cambiamos el estado
}

// Esta función reinicia el cronómetro
function reiniciarCronometro() {
  detenerCronometro(); // Primero lo detenemos
  tiempo = 0; // Reiniciamos el tiempo a cero
  document.getElementById('cronometro').textContent = '00:00'; // Mostramos el tiempo en cero
  intentosRestantes = 10;
  document.getElementById('intentos').textContent = intentosRestantes;
  generarClaveSecreta();
  document.querySelectorAll('.numero').forEach(num => num.textContent = '*');
}

// Función para manejar los clics en los botones de dígitos
function manejarDigito(event) {
  if (enMarcha) {
    const digito = parseInt(event.target.textContent);

    let acierto = false;

    claveSecreta.forEach((num, index) => {
      const elementoNumero = document.querySelectorAll('.numero')[index];

      if (num === digito && elementoNumero.textContent === '*') {
        elementoNumero.textContent = digito;
        elementoNumero.style.color = 'green';
        acierto = true;
      }
    });

    if (!acierto) {
      intentosRestantes--;
      document.getElementById('intentos').textContent = intentosRestantes;
    }

    if (Array.from(document.querySelectorAll('.numero')).every(num => num.textContent !== '*')) {
      detenerCronometro();
      alert("¡Felicidades! Adivinaste la clave secreta.");
    }

    if (intentosRestantes === 0) {
      detenerCronometro();
      alert("¡Perdiste! Se acabaron los intentos.");
      reiniciarJuego();
    }
  } else {
    alert("¡Primero dale a START!");
  }
}

// Nos aseguramos de que el código se ejecute después de que la página se cargue
window.onload = function() {
  console.log("¡crono.js cargado!"); // Mensaje para saber que el archivo se ha cargado correctamente

  // Capturamos los botones
  const startBtn = document.getElementById('start');
  const stopBtn = document.getElementById('stop');
  const resetBtn = document.getElementById('reset');
  const botonesDigito = document.querySelectorAll('.digito');

  // Les decimos que hagan algo cuando los pulsemos
  startBtn.addEventListener('click', iniciarCronometro);
  stopBtn.addEventListener('click', detenerCronometro);
  resetBtn.addEventListener('click', reiniciarCronometro);

  // Añadimos evento a los botones de los números
  botonesDigito.forEach(boton => {
    boton.addEventListener('click', manejarDigito);
  });

  // Generar clave secreta al cargar la página
  generarClaveSecreta();
}
