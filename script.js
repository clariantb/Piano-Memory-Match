const cardsArray = [
    { name: 'C', sound: 'sounds/C.mp3' },
    { name: 'D', sound: 'sounds/D.mp3' },
    { name: 'E', sound: 'sounds/E.mp3' },
    { name: 'F', sound: 'sounds/F.mp3' },
    { name: 'G', sound: 'sounds/G.mp3' },
    { name: 'A', sound: 'sounds/A.mp3' },
    { name: 'B', sound: 'sounds/B.mp3' },
    { name: 'C2', sound: 'sounds/C2.mp3' }
];

let gameGrid = cardsArray.concat(cardsArray).sort(() => 0.5 - Math.random());

const gameGridElement = document.getElementById('game-grid');
const scoreElement = document.getElementById('score');
const winningScreen = document.getElementById('winning-screen');
const winningMessage = document.getElementById('winning-message');

gameGrid.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.name = item.name;
    card.dataset.sound = item.sound;

    const cardContent = document.createElement('div');
    cardContent.classList.add('card-content');
    cardContent.textContent = item.name;

    card.appendChild(cardContent);
    gameGridElement.appendChild(card);
});

let firstGuess = '';
let secondGuess = '';
let count = 0;
let previousTarget = null;
let delay = 1200;
let correctMatches = 0;
const totalPairs = cardsArray.length;

const match = () => {
    const selected = document.querySelectorAll('.selected');
    selected.forEach(card => {
        card.classList.add('match');
        card.classList.remove('selected');
    });
    correctMatches++;
    if (correctMatches === totalPairs) {
        winningMessage.textContent = 'Congratulations! You Won!';
        winningScreen.classList.add('show');
    }
};

const resetGuesses = () => {
    firstGuess = '';
    secondGuess = '';
    count = 0;
    previousTarget = null;

    const selected = document.querySelectorAll('.selected');
    selected.forEach(card => {
        card.classList.remove('selected');
    });
};

gameGridElement.addEventListener('click', event => {
    const clicked = event.target;
    if (
        clicked.nodeName !== 'DIV' ||
        clicked === previousTarget ||
        clicked.classList.contains('match') ||
        clicked.classList.contains('selected')
    ) {
        return;
    }

    const card = clicked.closest('.card');
    if (!card) {
        return;
    }

    const cardName = card.dataset.name;
    const cardSound = card.dataset.sound;

    if (count < 2) {
        count++;
        if (count === 1) {
            firstGuess = cardName;
            card.classList.add('selected');
        } else {
            secondGuess = cardName;
            card.classList.add('selected');

            if (firstGuess === secondGuess) {
                setTimeout(match, delay);
            }
            setTimeout(resetGuesses, delay);
        }
        previousTarget = card;
    }

    // Play sound and add visual click effect
    const audio = new Audio(cardSound);
    audio.play().then(() => {
        card.classList.add('click');
        setTimeout(() => {
            card.classList.remove('click');
        }, 200); // Match this duration with the click effect animation
    }).catch(error => {
        console.error(`Error playing sound: ${error}`);
    });

    // Update score
    scoreElement.textContent = `Correct: ${correctMatches}`;
});
