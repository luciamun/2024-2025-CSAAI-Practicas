
const canvas = document.getElementById("gameCanvas"); //Oye, búscame ese <canvas> del HTML que 
// tiene id="gameCanvas" porque quiero dibujar (soy absurda lo sé)
const ctx = canvas.getContext("2d"); // ctx es coo el pincel, estamos dibujando en 2d

//Para mover a los aliens en bloque hacemos un array
//let declara una variable y var se pueden cambiar y const no se puede cambiar
//let y const valen en bloque y var para funciones
let aliens = [];
let alienSpeed = 2;
let alienDirection = 1; // 1 = derecha, -1 = izquierda

let bullets = []; //para las balas

// tablero medidas
canvas.width = 800;
canvas.height = 600;

// Dibujar fondo
function drawBackground() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Dibujar jugador
function drawPlayer(x, y) {
    ctx.fillStyle = "blue";
    ctx.fillRect(x, y, 50, 30);
}

// Dibujar alienígenas
function drawAlien(x, y) {
    ctx.fillStyle = "green";
    ctx.fillRect(x, y, 40, 30);
}

// Dibujar una bala
function drawBullet(x, y) {
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, 5, 10);
}

// Función principal de dibujo
//function draw() {
   // drawBackground();
    //drawPlayer(canvas.width / 2 - 25, canvas.height - 60); //mitad del ancho de la pantalla
    //60 pixeles encima del borde inferior
    //drawAlien(100, 100);
  //  drawBullet(120, 90);
//}
function draw() {
    drawBackground();
    drawPlayer(canvas.width / 2 - 25, canvas.height - 60);
    updateBullets(); // Mueve y dibuja las balas //********//
    updateAliens(); // 👈 aquí dibujamos y movemos los aliens
    checkBulletHit(); // Revisa si alguna bala ha golpeado a un alien //********//
    requestAnimationFrame(draw); // esto hace que draw() se repita una y otra vez
}


function initAliens() {
    const rows = 3;
    const cols = 8;
    const startX = 100;
    const startY = 100;
    const spacingX = 60;
    const spacingY = 50;

    aliens = []; // limpiar antes de crear

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let x = startX + col * spacingX;
            let y = startY + row * spacingY;
            aliens.push({ x: x, y: y });
        }
    }
}
// Función para actualizar la posición de las balas
function updateBullets() {
    // Mover todas las balas hacia arriba
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].y -= 5; // Velocidad de la bala hacia arriba

        // Si la bala sale de la pantalla, eliminarla
        if (bullets[i].y < 0) { // si la cordenada y es menor a cero la bala ha salido de arriba
            bullets.splice(i, 1); //borra al elemento i     
            //prueba        
        }
    }

    // Dibujar las balas
    for (let bullet of bullets) {
        drawBullet(bullet.x, bullet.y); //********//
    }
}
function updateAliens() {
    let hitEdge = false;

    // Mover todos los aliens
    for (let alien of aliens) { //recorrer todos los elementos del array
        alien.x += alienSpeed * alienDirection; 

        // Si algún alien toca el borde, lo marcamos
        if (alien.x <= 0 || alien.x + 40 >= canvas.width) {
            hitEdge = true;
        }
    }

    // Si algún alien tocó el borde, cambiar dirección y bajar
    if (hitEdge) {
        alienDirection *= -1;
        for (let alien of aliens) {
            alien.y += 20; // bajar una fila
        }
    }

    // Dibujarlos aliens 

    for (let alien of aliens) {
        drawAlien(alien.x, alien.y); //********//
    }
}

// Comprobar si alguna bala golpea a un alien
function checkBulletHit() {
    for (let i = 0; i < bullets.length; i++) {
        for (let j = 0; j < aliens.length; j++) {
            if (
                bullets[i].x < aliens[j].x + 40 &&
                bullets[i].x + 5 > aliens[j].x &&
                bullets[i].y < aliens[j].y + 30 &&
                bullets[i].y + 10 > aliens[j].y
            ) {
                // El alien fue golpeado, eliminar bala y alien
                aliens.splice(j, 1);
                bullets.splice(i, 1);
                i--; // Ajustar el índice para que no se salte ningún elemento
                break; // Terminar el bucle porque la bala ya ha golpeado a un alien
            }
        }
    }
}


// Llamar a la función de dibujo
draw();
initAliens();

// Evento para disparar al presionar espacio
document.addEventListener("keydown", function (event) {
    if (event.code === "Space") {
        // Agregar una nueva bala siempre que el jugador presione espacio
        bullets.push({ x: canvas.width / 2 - 2, y: canvas.height - 70 });
    }
});

