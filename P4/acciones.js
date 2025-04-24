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
    selectors.win.innerHTML = ""
    selectors.gridContainer.classList.remove('flipped')
    state.flippedCards = []
    state.totalFlips = 0
    state.totalTime = 0
    state.lockBoard = false

    selectors.movimientos.innerText = `0 movimientos`
    selectors.timer.innerText = `tiempo: 0   `

    if (state.loop) clearInterval(state.loop)

    const img = ['album.jpeg', 'alphaville.jpeg', 'direstraits.jpeg', 'recy.jpeg', 
        'scorpions.jpeg', 'gun.jpeg', 'walls.jpeg', 'lhaine.jpg', 'malaika.jpg', 
        'rels.jpg', 'choco.jpg', 'dela.jpg', 'ultimo.jpeg']
    const picks = pickRandom(img, (state.dimension * state.dimension) / 2)
    const items = shuffle([...picks, ...picks])

    const cards = `
        <div class="tablero" style="grid-template-columns: repeat(${state.dimension}, auto)" grid-dimension="${state.dimension}">
            ${items.map(item => `
                <div class="card" data-back="${item}">
                    <div class="card-front"></div>
                    <div class="card-back"><img src="${item}" alt="imagen"></div>
                </div>
            `).join('')}
        </div>
    `

    const parser = new DOMParser().parseFromString(cards, 'text/html')
    const newTablero = parser.querySelector('.tablero')
    selectors.tablero.replaceWith(newTablero)
    selectors.tablero = newTablero

    attachEventListeners()
}

const pickRandom = (array, items) => {
    const clonedArray = [...array]
    const randomPicks = []

    for (let i = 0; i < items; i++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length)
        randomPicks.push(clonedArray[randomIndex])
        clonedArray.splice(randomIndex, 1)
    }

    return randomPicks
}

const shuffle = array => {
    const clonedArray = [...array]
    for (let i = clonedArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[clonedArray[i], clonedArray[j]] = [clonedArray[j], clonedArray[i]]
    }
    return clonedArray
}

const attachEventListeners = () => {
    selectors.tablero.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            if (state.lockBoard || card.classList.contains('flipped') || card.classList.contains('matched')) return
            flipCard(card)
        })
    })
}

selectors.comenzar.addEventListener('click', () => {
    startGame()
    selectors.comenzar.classList.add('disabled')
})

selectors.reiniciar.addEventListener('click', () => {
    location.reload()
})

selectors.sizeButton.addEventListener('click', () => {
    selectors.sizeOptions.classList.toggle('hidden')
})

selectors.sizeOptions.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', (e) => {
        const size = parseInt(e.target.dataset.size)
        state.dimension = size
        generateGame()
        selectors.sizeOptions.classList.add('hidden')
    })
})

const startGame = () => {
    if (state.gameStarted) return
    state.gameStarted = true

    state.loop = setInterval(() => {
        state.totalTime++
        selectors.movimientos.innerText = `${state.totalFlips} movimientos`
        selectors.timer.innerText = `tiempo: ${state.totalTime}`
    }, 1000)
}

const flipCard = card => {
    if (!state.gameStarted) startGame()

    card.classList.add('flipped')
    state.flippedCards.push(card)
    state.totalFlips++

    if (state.flippedCards.length === 2) {
        const [first, second] = state.flippedCards
        const isMatch = first.getAttribute('data-back') === second.getAttribute('data-back')
        state.lockBoard = true

        if (isMatch) {
            first.classList.add('matched')
            second.classList.add('matched')
            resetFlippedCards()
        } else {
            setTimeout(() => {
                first.classList.remove('flipped')
                second.classList.remove('flipped')
                resetFlippedCards()
            }, 1000)
        }
    }

    if (document.querySelectorAll('.card.matched').length === document.querySelectorAll('.card').length) {
        setTimeout(() => {
            selectors.gridContainer.classList.add('flipped')
            selectors.win.innerHTML = `
                <span class="win-text">
                    ¡Has ganado!<br />
                    con <span class="highlight">${state.totalFlips}</span> movimientos<br />
                    en un tiempo de <span class="highlight">${state.totalTime}</span> segundos
                </span>
            `
            clearInterval(state.loop)
        }, 1000)
    }
}

const resetFlippedCards = () => {
    state.flippedCards = []
    state.lockBoard = false
}

generateGame()
