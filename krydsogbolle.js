let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let againstAI = true;

const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const scores = {
    X: -1,
    O: 1,
    tie: 0
};

function handleCellClick(clickedCell, clickedCellIndex) {
    if (!gameActive || gameState[clickedCellIndex] !== '') {
        return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer);
    checkResult();

    if (againstAI && gameActive && currentPlayer === 'X') {
        // AI Player's turn
        const bestMove = findBestMove();
        gameState[bestMove] = 'O';
        const aiCell = document.getElementById(`cell-${bestMove}`);
        aiCell.textContent = 'O';
        aiCell.classList.add('O');

        checkResult();
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

function checkResult() {
    let roundWon = false;
    let winningPlayer = currentPlayer === 'X' ? 'O' : 'X';

    for (let i = 0; i < winCombinations.length; i++) {
        const [a, b, c] = winCombinations[i];
        if (
            gameState[a] !== '' &&
            gameState[a] === gameState[b] &&
            gameState[a] === gameState[c]
        ) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        announceResult(`${winningPlayer} vandt!`);
        gameActive = false;
        return;
    }

    if (!gameState.includes('')) {
        announceResult("Det stod lige! :/");
        gameActive = false;
        return;
    }
}

function announceResult(message) {
    document.getElementById('result').textContent = message;
}

function resetGame() {
    currentPlayer = 'X';
    gameActive = true;
    gameState = ['', '', '', '', '', '', '', '', ''];

    document.querySelectorAll('.cell').forEach((cell) => {
        cell.textContent = '';
        cell.classList.remove('X', 'O');
    });

    document.getElementById('result').textContent = '';
}

function toggleAgainstAI() {
    againstAI = !againstAI;
    const aiButton = document.getElementById('ai-button');
    aiButton.textContent = againstAI ? 'Spil imod anden spiller' : 'Spil imod AI';
    resetGame();
}

document.querySelectorAll('.cell').forEach((cell, index) => {
    cell.addEventListener('click', () => handleCellClick(cell, index));
});

document.getElementById('reset').addEventListener('click', () => resetGame());

document.getElementById('open-popup').addEventListener('click', () => {
    document.getElementById('popup-container').style.display = 'block';
    resetGame();
});

document.getElementById('ai-button').addEventListener('click', toggleAgainstAI);

function closeGamePopupKryds() {
    document.getElementById('popup-container').style.display = 'none';
}

function findBestMove() {
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < 9; i++) {
        if (gameState[i] === '') {
            gameState[i] = 'O';
            let score = minimax(gameState, 0, false);
            gameState[i] = '';

            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    return bestMove;
}

function minimax(state, depth, isMaximizingPlayer) {
    let result = checkGameResult();

    if (result !== null) {
        return scores[result];
    }

    if (isMaximizingPlayer) {
        let bestScore = -Infinity;

        for (let i = 0; i < 9; i++) {
            if (state[i] === '') {
                state[i] = 'O';
                let score = minimax(state, depth + 1, false);
                state[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }

        return bestScore;
    } else {
        let bestScore = Infinity;

        for (let i = 0; i < 9; i++) {
            if (state[i] === '') {
                state[i] = 'X';
                let score = minimax(state, depth + 1, true);
                state[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }

        return bestScore;
    }
}

function checkGameResult() {
    for (let i = 0; i < winCombinations.length; i++) {
        const [a, b, c] = winCombinations[i];
        if (
            gameState[a] !== '' &&
            gameState[a] === gameState[b] &&
            gameState[a] === gameState[c]
        ) {
            return gameState[a];
        }
    }

    if (!gameState.includes('')) {
        return 'tie';
    }

    return null;
}