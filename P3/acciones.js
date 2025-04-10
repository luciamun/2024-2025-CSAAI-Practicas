
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
let playerX = canvas.width / 2 - 25; // Posición inicial del jugador
const playerSpeed = 10; // Velocidad de movimiento del jugador
const playerImage = new Image();
playerImage.src = "navejugador.webp";
const alienImage = new Image();
alienImage.src = "alien1.png"
let gameOver = false;
let explosions = [];
const explosionImage = new Image();
explosionImage.src = "explosion.gif";
//const bulletSound = new Audio("disparo.mp3"); prueba 1, no suena cada vez que disparo
const explosionSound = new Audio("explosion.mp3");
//PUNTOS
let score = 0;
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
    //ctx.fillStyle = "blue";
    ctx.drawImage(playerImage,x, y, 50, 50);
}

// Dibujar alienígenas
function drawAlien(x, y) {
    ctx.fillStyle = "green";
    ctx.drawImage(alienImage, x, y, 40, 30);
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
    if (gameOver) return;

    drawBackground();
    drawPlayer(playerX, canvas.height - 60);
    updateBullets(); // Mueve y dibuja las balas 
    updateAliens(); //aquí dibujamos y movemos los aliens
    updateExplosions(); //explosioness
    checkBulletHit(); // Revisa si alguna bala ha golpeado a un alien 
    checkGameStatus(); //GANAR O PERDER
    drawScore(); //LOS PUNTOS
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
                {
                    // Añade la explosión en la posición del alien
                    explosions.push({
                        x: aliens[j].x,
                        y: aliens[j].y,
                        timer: 10 // duración en frames
                        
                    });
                    const explosion = new Audio("explosion.mp3"); //prueba2 
                    explosion.play();
                    canvas.classList.remove("defeat"); // NO SE VA EL VERDE, 
                    canvas.classList.remove("default-glow"); // PRUEBA 1 QUITANDOLO
                    canvas.classList.add("flash-border");

                    setTimeout(() => {
                        canvas.classList.remove("flash-border");
                        canvas.classList.add("default-glow"); // restauramos el glow verde
                    }, 200);
    
                // El alien fue golpeado, eliminar bala y alien
                score += 10;
                aliens.splice(j, 1);
                bullets.splice(i, 1);
                i--; // Ajustar el índice para que no se salte ningún elemento
                break; // Terminar el bucle porque la bala ya ha golpeado a un alien
            }
        }
    }
}
}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "20px 'Upheaval'"; 
    ctx.textAlign = "left";
    ctx.fillText("Puntos: " + score, 10, 30); // Esquina superior izquierda
}

function checkGameStatus() {
    if (aliens.length === 0) {
        showEndMessage("VICTORY");
        const victoriaSound = new Audio('victoria.mp3')
        victoriaSound.play()
        gameOver = true;
    }

    for (let alien of aliens) {
        if (alien.y + 100 >= canvas.height) { // 100 = altura del alien
            showEndMessage("GAME OVER");
            const derrotaSound = new Audio('derrota.mp3')
            derrotaSound.play()
            gameOver = true;
            break;
        }
    }
}

function updateExplosions() {
    for (let i = 0; i < explosions.length; i++) {
        let exp = explosions[i];
        ctx.drawImage(explosionImage, exp.x, exp.y, 50, 50);
        exp.timer--;

        // Elimina cuando se acabe el tiempo
        if (exp.timer <= 0) {
            explosions.splice(i, 1);
            i--;
        }
    }
}
//******** VICTORIA/DERROTA ********//
function showEndMessage(text) {
    //ctx.fillStyle = "white";//
    if (text === "GAME OVER") {
        canvas.classList.add("defeat");
        ctx.fillStyle = "red";
    }
    else {
        ctx.fillStyle = "white";

    }

    ctx.font = "100px 'Upheaval'";
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    
}


initAliens();
draw();


// Evento para disparar al presionar espacio
document.addEventListener("keydown", function (event) {
    if (event.code === "Space") {
        Disparar();
    }
    //Para mover al jugador:
    if (event.code === "ArrowLeft") {
        //playerX -= playerSpeed; 
        moverIzquierda();
    }

    if (event.code === "ArrowRight") {
        //playerX += playerSpeed; 
        moverDerecha();
    }

    //Para que el jugador no salga de la pantalla:

    //if (playerX < 0) {
      //   playerX= 0
    //}

    

    
});
document.getElementById("botonizquierda").addEventListener("click", function () {
    moverIzquierda();})

document.getElementById("botonderecha").addEventListener("click", function () {
    moverDerecha();})

document.getElementById("piupiu").addEventListener("click", function () {
    Disparar();})




function Disparar(){
    // Agregar una nueva bala siempre que el jugador presione espacio
    bullets.push({ x: playerX + 22, y: canvas.height - 70 }) //22 porque con 25 no queda tan centrado
    //70 para que salga de 10 pixeles por encima del jugador, que esta en el 60 (+10 = 70)
    const bullet = new Audio("disparo.mp3");
    bullet.play();
    
}

function moverIzquierda() {
    playerX -= playerSpeed;
    
    // Limitar para que no salga de la pantalla
    if (playerX < 0) {
        playerX = 0;
    }
}

function moverDerecha() {
    playerX += playerSpeed; 

    // Limitar para que no salga de la pantalla
    if (playerX + 50 > canvas.width) { //el rectangulo de prueba mide 50, hay que tenerlo en cuenta
        playerX= canvas.width-50
   }
}