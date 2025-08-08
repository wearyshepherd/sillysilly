const board = document.getElementById('board');
const status = document.getElementById('status');
const resetButton = document.getElementById('reset');
const winnerPopup = document.getElementById('winner-popup');
const winnerAvatar = document.getElementById('winner-avatar');
const winnerText = document.getElementById('winner-text');

let cells = Array(9).fill(null);
let player1 = null;
let player2 = null;
let currentPlayer = null;
let gameActive = false;

// Character Selection
const player1Buttons = document.querySelectorAll('#player1-selection .player-btn');
const player2Buttons = document.querySelectorAll('#player2-selection .player-btn');

const images = {
    "Zaya": "images/zaya.png",
    "Shan": "images/shan.png",
    "Danny": "images/danny.png",
};

// Player selection
player1Buttons.forEach(button => {
    button.addEventListener('click', () => {
        if (gameActive) return;
        player1 = button.dataset.character;
        highlightSelection(player1Buttons, player1);
        checkStartGame();
    });
});

player2Buttons.forEach(button => {
    button.addEventListener('click', () => {
        if (gameActive) return;
        if (player1 && button.dataset.character !== player1) {
            player2 = button.dataset.character;
            highlightSelection(player2Buttons, player2);
            checkStartGame();
        }
    });
});

// Highlight selected character
function highlightSelection(buttons, selectedCharacter) {
    buttons.forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.character === selectedCharacter) {
            btn.classList.add('selected');
        }
    });
}

// Check if both players are selected
function checkStartGame() {
    if (player1 && player2) {
        gameActive = true;
        currentPlayer = player1;
        status.innerText = `${player1} vs ${player2} - ${currentPlayer}'s turn`;
        initializeBoard();
    }
}

// Initialize board
function initializeBoard() {
    board.innerHTML = '';
    cells = Array(9).fill(null);
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handleMove);
        board.appendChild(cell);
    }
}

// Handle a move
function handleMove(event) {
    const index = event.target.dataset.index;
    if (!gameActive || cells[index]) return;

    cells[index] = currentPlayer;
    event.target.innerHTML = `<img src="${images[currentPlayer]}" style="width:90%; height:90%; object-fit:contain;">`;

    if (checkWinner()) return;

    currentPlayer = currentPlayer === player1 ? player2 : player1;
    status.innerText = `${player1} vs ${player2} - ${currentPlayer}'s turn`;
}

// Check for winner
function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
            gameActive = false;
            winnerAvatar.src = images[cells[a]];
            winnerText.innerText = `${cells[a]} Wins!`;
            winnerPopup.style.display = 'block';
            return true;
        }
    }

    if (!cells.includes(null)) {
        status.innerText = "It's a draw!";
        gameActive = false;
        return true;
    }

    return false;
}

// Reset game
resetButton.addEventListener('click', () => {
    initializeBoard();
    gameActive = false;
    winnerPopup.style.display = 'none';
    player1 = null;
    player2 = null;
    status.innerText = "Select players to start";
    player1Buttons.forEach(btn => btn.classList.remove('selected'));
    player2Buttons.forEach(btn => btn.classList.remove('selected'));
});

initializeBoard();
