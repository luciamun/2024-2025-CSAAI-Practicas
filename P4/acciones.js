const selectors = {
    gridContainer: document.querySelector('.grid-container'),
    tablero: document.querySelector('.tablero'),
    movimientos: document.querySelector('.movimientos'),
    timer: document.querySelector('.timer'),
    comenzar: document.querySelector('#startBtn'),
    resetBtn: document.querySelector('#resetBtn'),
    sizeBtn: document.querySelector('#sizeBtn'),
    sizeSelect: document.querySelector('#sizeSelect'),
    win: document.querySelector('.win')
}

const state = {
    gameStarted: false,
    flippedCards: [],
    totalFlips: 0,
    totalTime: 0,
    loop: null,
    lockBoard: false
}

const generateGame = () => {
    const dimensions = parseInt(selectors.tablero.getAttribute('grid-dimension'))

    if (dimensions % 2 !== 0) {
        throw new Error("Las dimensiones del tablero deben ser un número par.")
    }

    const img = ['album.jpeg', 'alphaville.jpeg', 'direstraits.jpeg', 'recy.jpeg', 
        'scorpions.jpeg', 'gun.jpeg', 'walls.jpeg', 'lhaine.jpg', 'malaika.jpg', 
        'rels.jpg', 'choco.jpg', 'dela.jpg']
    const picks = pickRandom(img, (dimensions * dimensions) / 2)
    const items = shuffle([...picks, ...picks])

    const cards = `
        <div class="tablero" style="grid-template-columns: repeat(${dimensions}, auto)" grid-dimension="${dimensions}">
            ${items.map(item => `
                <div class="card" data-back="${item}">
                    <div class="card-front"></div>
                    <div class="card-back"><img src="${item}" alt="imagen"></div>
                </div>
            `).join('')}
        </div>
    `

    const parser = new DOMParser().parseFromString(cards, 'text/html')
    selectors.tablero.replaceWith(parser.querySelector('.tablero'))
    selectors.tablero = document.querySelector('.tablero')
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
    document.addEventListener('click', event => {
        const card = event.target.closest('.card')
        const id = event.target.id

        if (id === 'startBtn' && !selectors.comenzar.classList.contains('disabled')) {
            startGame()
        }

        if (id === 'resetBtn') {
            resetGame()
        }

        if (id === 'sizeBtn') {
            selectors.sizeSelect.classList.toggle('hidden')
        }

        if (event.target.classList.contains('option')) {
            const newSize = event.target.getAttribute('data-size')
            selectors.tablero.setAttribute('grid-dimension', newSize)
            selectors.sizeSelect.classList.add('hidden')
            resetGame()
        }

        if (!card || state.lockBoard || card.classList.contains('flipped') || card.classList.contains('matched')) return

        flipCard(card)
    })
}

const startGame = () => {
    state.gameStarted = true
    selectors.comenzar.classList.add('disabled')

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

const resetGame = () => {
    clearInterval(state.loop)
    state.gameStarted = false
    state.flippedCards = []
    state.totalFlips = 0
    state.totalTime = 0
    state.lockBoard = false
    selectors.comenzar.classList.remove('disabled')
    selectors.movimientos.innerText = '0 movimientos'
    selectors.timer.innerText = 'tiempo: 0'
    selectors.gridContainer.classList.remove('flipped')
    selectors.win.innerHTML = ''
    generateGame()
}

generateGame()
attachEventListeners()
