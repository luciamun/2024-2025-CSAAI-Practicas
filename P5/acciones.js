// Variables de trabajo
const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');

let redAleatoria;
let nodoOrigen = 0, nodoDestino = 0;
let rutaMinimaConRetardos;

const nodeRadius = 40;
const numNodos = 5;
const nodeConnect = 2;
const nodeRandomDelay = 1000;

// Localizando elementos en el DOM
const btnCNet = document.getElementById("btnNet");
const btnMinPath = document.getElementById("btnMinPath");

// Clase para representar un nodo en el grafo
class Nodo {
  constructor(id, x, y, delay) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.delay = delay;
    this.conexiones = [];
  }

  conectar(nodo, peso) {
    this.conexiones.push({ nodo, peso });
  }

  isconnected(idn) {
    return this.conexiones.some(({ nodo }) => nodo.id === idn);
  }

  node_distance(nx, ny) {
    const a = nx - this.x;
    const b = ny - this.y;
    return Math.floor(Math.sqrt(a * a + b * b));
  }

  far_node(nodos) {
    let distn = 0;
    let pos = 0;
    let npos = 0;

    nodos.forEach((nodo, index) => {
      const distaux = this.node_distance(nodo.x, nodo.y);
      if (distaux !== 0 && distaux > distn) {
        distn = distaux;
        npos = index;
      }
    });

    return {
      pos: npos,
      id: nodos[npos].id,
      distance: distn,
    };
  }

  close_node(nodos) {
    let { distance: distn } = this.far_node(nodos);
    let npos = 0;

    nodos.forEach((nodo, index) => {
      const distaux = this.node_distance(nodo.x, nodo.y);
      if (distaux !== 0 && distaux <= distn) {
        distn = distaux;
        npos = index;
      }
    });

    return {
      pos: npos,
      id: nodos[npos].id,
      distance: distn,
    };
  }
}

// Función para generar retardo aleatorio
function generarRetardo() {
  return Math.random() * nodeRandomDelay;
}

// Generar número aleatorio entre min y max
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// Crear red aleatoria
function crearRedAleatoriaConCongestion(numNodos, numConexiones) {
  const nodos = [];
  const xs = Math.floor(canvas.width / numNodos);
  const ys = Math.floor(canvas.height / 2);
  const xr = canvas.width - nodeRadius;
  const yr = canvas.height - nodeRadius;
  let xp = nodeRadius;
  let yp = nodeRadius;
  let xsa = xs;
  let ysa = ys;

  for (let i = 0; i < numNodos; i++) {
    if (Math.random() < 0.5) {
      yp = nodeRadius;
      ysa = ys;
    } else {
      yp = ys;
      ysa = yr;
    }

    const x = randomNumber(xp, xsa);
    const y = randomNumber(yp, ysa);
    xp = xsa;
    xsa += xs;

    if (xsa > xr && xsa <= canvas.width) xsa = xr;
    if (xsa > xr && xsa < canvas.width) {
      xp = nodeRadius;
      xsa = xs;
    }

    const delay = generarRetardo();
    nodos.push(new Nodo(i, x, y, delay));
  }

  for (const nodo of nodos) {
    const clonedArray = [...nodos];

    for (let j = 0; j < numConexiones; j++) {
      const close_node = nodo.close_node(clonedArray);

      if (
        !nodo.isconnected(close_node.id) &&
        !clonedArray[close_node.pos].isconnected(nodo.id)
      ) {
        nodo.conectar(clonedArray[close_node.pos], close_node.distance);
      }

      clonedArray.splice(close_node.pos, 1);
    }
  }

  return nodos;
}

function drawNet(nnodes) {
  // Dibujar conexiones
  nnodes.forEach(nodo => {
    nodo.conexiones.forEach(({ nodo: conexion, peso }) => {
      ctx.beginPath();
      ctx.moveTo(nodo.x, nodo.y);
      ctx.lineTo(conexion.x, conexion.y);
      ctx.strokeStyle = '#999'; // color gris para líneas de conexión
      ctx.stroke();

      ctx.font = '12px Arial';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      const label = "N" + nodo.id + " pw " + peso;
      const midX = Math.floor((nodo.x + conexion.x) / 2);
      const midY = Math.floor((nodo.y + conexion.y) / 2);
      ctx.fillText(label, midX, midY);
    });
  });

  // Dibujar nodos
  nnodes.forEach(nodo => {
    ctx.beginPath();
    ctx.arc(nodo.x, nodo.y, nodeRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#ff94c2';       // Relleno del nodo (rosita)
    ctx.fill();
    ctx.strokeStyle = '#ff69b4';     // Borde rosa fuerte
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = '12px Arial';
    ctx.fillStyle = 'white';         // Color del texto
    ctx.textAlign = 'center';
    const desc = "N" + nodo.id + " delay " + Math.floor(nodo.delay);
    ctx.fillText(desc, nodo.x, nodo.y + 5);
  });
}


// Evento para generar red
btnCNet.onclick = () => {
  redAleatoria = crearRedAleatoriaConCongestion(numNodos, nodeConnect);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawNet(redAleatoria);
};

// Evento para calcular ruta
btnMinPath.onclick = () => {
  nodoOrigen = redAleatoria[0];
  nodoDestino = redAleatoria[numNodos - 1];
  rutaMinimaConRetardos = dijkstraConRetardos(redAleatoria, nodoOrigen, nodoDestino);
  console.log("Ruta mínima con retrasos:", rutaMinimaConRetardos);
};
