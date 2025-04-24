const selectors = {
    gridContainer: document.querySelector('.grid-container'),
    movimientos: document.querySelector('.movimientos'),
    timer: document.querySelector('.timer'),
    comenzar: document.getElementById('start-button'),
    reiniciar: document.getElementById('reset-button'),
    sizeButton: document.getElementById('size-button'),
    sizeOptions: document.querySelector('.dropdown-options'),
    tablero: document.querySelector('.tablero'),
    win: document.querySelector('.win')
}

const state = {
    gameStarted: false,
    flippedCards: [],
    totalFlips: 0,
    totalTime: 0,
    loop: null,
    lockBoard: false,
    dimension: 4
}

const generateGame = () => {
    selectors.win.style.display = 'none';
    selectors.gridContainer.classList.remove('flipped');
    selectors.win.style.display = 'none';

    state.flippedCards = [];
    state.totalFlips = 0;
    state.totalTime = 0;
    state.lockBoard = false;
    state.gameStarted = false;

    selectors.movimientos.innerText = `0 movimientos`;
    selectors.timer.innerText = `tiempo: 0`;

    if (state.loop) clearInterval(state.loop);

    const img = ['album.jpeg', 'alphaville.jpeg', 'direstraits.jpeg', 'recy.jpeg', 
        'scorpions.jpeg', 'gun.jpeg', 'walls.jpeg', 'lhaine.jpg', 'malaika.jpg', 
        'rels.jpg', 'choco.jpg', 'dela.jpg', 'ultimo.jpeg', 'capri.jpg',
        'dela 2.jpg', 'cruz.jpg', 'oasis.jpg', 'turtles.jpg'];
    const picks = pickRandom(img, (state.dimension * state.dimension) / 2);
    const items = shuffle([...picks, ...picks]);

    const cards = `
        <div class="tablero" style="grid-template-columns: repeat(${state.dimension}, auto)" grid-dimension="${state.dimension}">
            ${items.map(item => `
                <div class="card" data-back="${item}">
                    <div class="card-front"></div>
                    <div class="card-back"><img src="${item}" alt="imagen"></div>
                </div>
            `).join('')}
        </div>
    `;

    const parser = new DOMParser().parseFromString(cards, 'text/html');
    const newTablero = parser.querySelector('.tablero');
    selectors.tablero.replaceWith(newTablero);
    selectors.tablero = newTablero;
    selectors.gridContainer = document.querySelector('.grid-container');
    selectors.win = document.querySelector('.win');

    attachEventListeners();
}

const pickRandom = (array, items) => {
    const clonedArray = [...array];
    const randomPicks = [];

    for (let i = 0; i < items; i++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length);
        randomPicks.push(clonedArray[randomIndex]);
        clonedArray.splice(randomIndex, 1);
    }

    return randomPicks;
}

const shuffle = array => {
    const clonedArray = [...array];
    for (let i = clonedArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [clonedArray[i], clonedArray[j]] = [clonedArray[j], clonedArray[i]];
    }
    return clonedArray;
}

const attachEventListeners = () => {
    selectors.tablero.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            if (state.lockBoard || card.classList.contains('flipped') || card.classList.contains('matched')) return;
            flipCard(card);
        });
    });
}

selectors.comenzar.addEventListener('click', () => {
    startGame();
    selectors.comenzar.classList.add('disabled');
});

selectors.reiniciar.addEventListener('click', () => {
    location.reload();
});

selectors.sizeButton.addEventListener('click', () => {
    selectors.sizeOptions.classList.toggle('hidden');
});

selectors.sizeOptions.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', (e) => {
        const size = parseInt(e.target.dataset.size);
        state.dimension = size;
        generateGame();
        selectors.sizeOptions.classList.add('hidden');
    });
});

const startGame = () => {
    if (state.gameStarted) return;
    state.gameStarted = true;

    state.loop = setInterval(() => {
        state.totalTime++;
        selectors.movimientos.innerText = `${state.totalFlips} movimientos`;
        selectors.timer.innerText = `tiempo: ${state.totalTime}`;
    }, 1000);
}

const flipCard = card => {
    if (!state.gameStarted) startGame();

    card.classList.add('flipped');
    state.flippedCards.push(card);
    state.totalFlips++;

    if (state.flippedCards.length === 2) {
        const [first, second] = state.flippedCards;
        const isMatch = first.getAttribute('data-back') === second.getAttribute('data-back');
        state.lockBoard = true;

        if (isMatch) {
            first.classList.add('matched');
            second.classList.add('matched');
            resetFlippedCards();
            checkVictory();
        } else {
            setTimeout(() => {
                first.classList.remove('flipped');
                second.classList.remove('flipped');
                resetFlippedCards();
            }, 1000);
        }
    }
}

const resetFlippedCards = () => {
    state.flippedCards = [];
    state.lockBoard = false;
}

const checkVictory = () => {
    const matched = document.querySelectorAll('.card.matched').length;
    const total = document.querySelectorAll('.card').length;
    
    if (matched === total) {
        clearInterval(state.loop);
        victory();
    }
}


const victory = () => {
    // Voltear el tablero
    selectors.gridContainer.classList.add('flipped');
    
    // Mostrar mensaje de victoria
    selectors.win.style.display = 'flex';
    
    // Obtener imágenes únicas de los álbumes
    const cards = Array.from(document.querySelectorAll('.card'));
    const uniqueImages = [...new Set(cards.map(card => card.getAttribute('data-back')))];
    
    // Crear cuadrícula de álbumes
    const albumsHTML = uniqueImages.map(img => `
        <div class="album" data-audio="${img.split('.')[0]}">
            <img src="${img}" alt="álbum">
        </div>
    `).join('');
    
    // Mostrar pantalla de victoria
    selectors.win.innerHTML = `
        <div class="win-simple">
            <h1>¡VICTORIA!</h1>
            <h2>ELIGE UN ÁLBUM</h2>
            <div class="albums-grid">${albumsHTML}</div>
        </div>
    `;
    
    // Reproducir pista al hacer clic
    document.querySelectorAll('.album').forEach(album => {
        album.addEventListener('click', () => {
            const nombreAlbum = album.getAttribute('data-audio');
            new Audio(`audios/${nombreAlbum}.mp3`).play();
        });
    });
    
    // Parar el temporizador
    clearInterval(state.loop);
}

generateGame();