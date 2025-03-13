  // Este archivo controlará el cronómetro

// Variable para almacenar el intervalo del cronómetro
let cronometro;
// Variable para contar los segundos
let tiempo = 0;
// Variable para saber si el cronómetro está en marcha
let enMarcha = false;

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
}

// Nos aseguramos de que el código se ejecute después de que la página se cargue
window.onload = function() {
  console.log("¡crono.js cargado!"); // Mensaje para saber que el archivo se ha cargado correctamente

  // Capturamos los botones
  const startBtn = document.getElementById('start');
  const stopBtn = document.getElementById('stop');
  const resetBtn = document.getElementById('reset');

  // Les decimos que hagan algo cuando los pulsemos
  startBtn.addEventListener('click', iniciarCronometro);
  stopBtn.addEventListener('click', detenerCronometro);
  resetBtn.addEventListener('click', reiniciarCronometro);
}
