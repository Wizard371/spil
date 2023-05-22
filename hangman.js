const words = ['kaffe', 'bil', 'bog', 'hund', 'hus', 'computer']; // Danish words

let chosenWord = '';
let guessedLetters = [];
let wrongLetters = [];
let remainingGuesses = 6;
let currentStep = 0;

function openHangmanGame() {
    const modal = document.getElementById('hangmanModal');
    modal.style.display = 'block';
    initializeGame();
}

function closeHangmanGame() {
    const modal = document.getElementById('hangmanModal');
    modal.style.display = 'none';
}

function initializeGame() {
    chosenWord = words[Math.floor(Math.random() * words.length)];
    guessedLetters = [];
    wrongLetters = [];
    remainingGuesses = 6;
    currentStep = 0;
    updateWordContainer();
    updateMessage('');
    updateWrongLetters();
    resetHangmanImage();
}

function updateWordContainer() {
    const wordContainer = document.querySelector('.word-container');
    wordContainer.innerHTML = '';
    for (let letter of chosenWord) {
        const span = document.createElement('span');
        if (guessedLetters.includes(letter)) {
            span.textContent = letter;
        }
        wordContainer.appendChild(span);
    }
}

function updateMessage(message) {
    const messageElement = document.querySelector('.message');
    messageElement.textContent = message;
}

function updateHangmanImage() {
    const hangmanParts = document.querySelectorAll('.hangman div');
    if (currentStep < hangmanParts.length) {
        hangmanParts[currentStep].style.display = 'block';
        currentStep++;
    }
}

function resetHangmanImage() {
    const hangmanParts = document.querySelectorAll('.hangman div');
    hangmanParts.forEach((part) => {
        part.style.display = 'none';
    });
}

function updateWrongLetters() {
    const wrongLettersContainer = document.querySelector('.wrong-letters');
    wrongLettersContainer.textContent = `Forkerte bogstav(er): ${wrongLetters.join(', ')}`;
}

function guessLetter() {
    const inputElement = document.querySelector('.guess-container input');
    const letter = inputElement.value.toLowerCase().trim();
    inputElement.value = '';

    if (!letter.match(/^[a-zæøå]$/)) {
        updateMessage('Skriv venligst et bogstav');
        return;
    }

    if (guessedLetters.includes(letter) || wrongLetters.includes(letter)) {
        updateMessage('Du har allerede gættet dette bogstav.');
        return;
    }

    guessedLetters.push(letter);

    let correctLettersCount = 0;
    for (let i = 0; i < chosenWord.length; i++) {
        if (chosenWord[i] === letter) {
            correctLettersCount++;
            const wordContainer = document.querySelectorAll('.word-container span')[i];
            wordContainer.textContent = letter;
        }
    }

    if (correctLettersCount === 0) {
        wrongLetters.push(letter);
        remainingGuesses--;
        updateHangmanImage();
        if (remainingGuesses === 0) {
            updateMessage(`Game over! Ordet var: "${chosenWord}".`);
            return;
        }
    }

    if (guessedLetters.length === new Set(chosenWord).size) {
        updateMessage('Du gættede det rigtige ord!');
        return;
    }

    updateMessage(`Gæt tilbage: ${remainingGuesses}`);
    updateWrongLetters();
}