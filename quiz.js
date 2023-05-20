let currentQuestionIndex = 0;
let score = 0;
let gameActive = false;
const webhookUrl = 'https://discord.com/api/webhooks/1108967767513763922/ypvkHBAi43Bse3EZpZuakepm1Y60BAVMGptKxdyU1i54SVw_nxNYzxln1faUgNfAY1dt';

function sendWebhookMessage(correctAnswers, wrongAnswers) {
    const message = {
        embeds: [{
            title: 'Quiz Færdig',
            description: 'Resultater:',
            color: 0x00ff00,
            fields: [{
                    name: 'Korrekte Svar',
                    value: correctAnswers.toString(),
                },
                {
                    name: 'Forkerte Svar',
                    value: wrongAnswers.toString(),
                }
            ]
        }]
    };

    fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        })
        .then(() => {
            console.log('Webhook sendt! :)');
        })
        .catch(error => {
            console.error('Fejl:', error);
        });
}

function fetchQuestions() {
    fetch('https://opentdb.com/api.php?amount=15&category=9&difficulty=medium', {
            headers: {
                'Accept-Charset': 'utf-8'
            }
        })
        .then(response => response.json())
        .then(data => {
            handleQuestions(data.results);
            showQuestion(currentQuestionIndex);
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
        });
}

function handleQuestions(questions) {
    window.quizQuestions = questions;
}

function showQuestion(questionIndex) {
    const questionContainer = document.getElementById('question-container');
    const optionsContainer = document.getElementById('options-container');
    const submitButton = document.getElementById('submit-button');
    const nextButton = document.getElementById('next-button');
    const startButton = document.querySelector('.start-btn');
    const questionsRemaining = window.quizQuestions.length - currentQuestionIndex;
    const questionsAnswered = currentQuestionIndex;

    questionContainer.innerHTML = '';
    optionsContainer.innerHTML = '';

    if (questionIndex >= window.quizQuestions.length) {
        questionContainer.innerText = 'Quiz færdig!';
        submitButton.disabled = true;
        nextButton.disabled = true;
        showScore();
    } else {
        const question = window.quizQuestions[questionIndex].question;
        const correctAnswer = window.quizQuestions[questionIndex].correct_answer;
        const wrongAnswers = window.quizQuestions[questionIndex].incorrect_answers;
        questionContainer.innerHTML = he.decode(question);

        const allAnswers = [...wrongAnswers, correctAnswer];
        const shuffledAnswers = shuffleArray(allAnswers);

        shuffledAnswers.forEach(answer => {
            const radioDiv = document.createElement('div');
            radioDiv.classList.add('radio-item');

            const radioBtn = document.createElement('input');
            radioBtn.type = 'radio';
            radioBtn.name = 'answer';
            radioBtn.value = answer;

            const label = document.createElement('label');
            label.innerHTML = answer;

            radioDiv.appendChild(radioBtn);
            radioDiv.appendChild(label);
            optionsContainer.appendChild(radioDiv);
        });

        submitButton.disabled = false;
        nextButton.disabled = true;

        resetAnswerColors();

        const radioButtons = document.querySelectorAll('input[name="answer"]');
        radioButtons.forEach(radioBtn => {
            radioBtn.addEventListener('click', function() {
                if (submitButton.disabled) {
                    radioBtn.checked = false;
                }
            });
        });

        questionContainer.innerHTML += ` (Questions Remaining: ${questionsRemaining}, Questions Answered: ${questionsAnswered})`;
    }

    startButton.disabled = true;
}

function resetAnswerColors() {
    const answerOptions = document.querySelectorAll('label');
    answerOptions.forEach(option => {
        option.style.color = 'black';
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function submitAnswer() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    const submitButton = document.getElementById('submit-button');
    const nextButton = document.getElementById('next-button');
    const optionsContainer = document.getElementById('options-container');
    const resultContainer = document.getElementById('result-container');

    if (selectedAnswer) {
        const radioButtons = document.querySelectorAll('input[name="answer"]');
        radioButtons.forEach(radioBtn => {
            radioBtn.disabled = true;
        });

        const answer = selectedAnswer.value;
        const currentQuestion = window.quizQuestions[currentQuestionIndex];

        const resultText = document.createElement('p');
        if (answer === currentQuestion.correct_answer) {
            selectedAnswer.parentNode.classList.add('correct');
            score++;
            resultText.innerText = 'KORREKT!';
            resultText.style.color = 'green';
        } else {
            selectedAnswer.parentNode.classList.add('wrong');
            const correctOption = document.querySelector(`input[value="${currentQuestion.correct_answer}"]`);
            correctOption.parentNode.classList.add('correct');
            radioButtons.forEach(radioBtn => {
                if (radioBtn.value !== currentQuestion.correct_answer) {
                    radioBtn.parentNode.classList.add('wrong');
                }
            });
            resultText.innerText = 'FORKERT! :(';
            resultText.style.color = 'red';
        }

        resultContainer.innerHTML = '';
        resultContainer.appendChild(resultText);

        submitButton.disabled = true;
        nextButton.disabled = false;

        const answerOptions = document.querySelectorAll('label');
        answerOptions.forEach(option => {
            if (option.classList.contains('correct')) {
                option.style.color = 'green';
            } else if (option.classList.contains('wrong')) {
                option.style.color = 'red';
            }
        });

        nextQuestion(); // Automatically go to the next question
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    showQuestion(currentQuestionIndex);
    resetAnswerColors();
}

function showScore() {
    const scoreContainer = document.getElementById('score-container');
    const totalQuestions = window.quizQuestions.length;
    const correctAnswers = score;
    const wrongAnswers = totalQuestions - correctAnswers;

    scoreContainer.innerHTML = `Korrekte: ${correctAnswers}<br>Forkerte svar: ${wrongAnswers}`;
    sendWebhookMessage(correctAnswers, wrongAnswers);
}

function openGamePopup() {
    document.getElementById('game-popup').style.display = 'block';
    document.getElementById('game-container').style.display = 'block';
    fetchQuestions();
}

function closeGamePopup() {
    document.getElementById('game-popup').style.display = 'none';
    document.getElementById('game-container').style.display = 'none';
}