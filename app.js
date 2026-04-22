
const quizState = {
    currentQuestionIndex: 0,
    score: 0,
    selectedAnswers: [],
    quizStarted: false,
    quizComplete: false,
    totalQuestions: 0
};
function initializeQuiz() {
    quizState.currentQuestionIndex = 0;
    quizState.score = 0;
    quizState.selectedAnswers = [];
    quizState.quizStarted = false;
    quizState.quizComplete = false;
    quizState.totalQuestions = quizQuestions.length;
}
function startQuiz() {
    initializeQuiz();
    showScreen('quizScreen');
    displayQuestion();
}
function displayQuestion() {
    const question = quizQuestions[quizState.currentQuestionIndex];
    document.getElementById('questionText').textContent = question.question;
    document.getElementById('currentQuestion').textContent = quizState.currentQuestionIndex + 1;
    document.getElementById('totalQuestions').textContent = quizState.totalQuestions;
    document.getElementById('currentScore').textContent = quizState.score;
    const progress = ((quizState.currentQuestionIndex) / quizState.totalQuestions) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    renderOptions(question);
    document.getElementById('feedbackSection').classList.add('hidden');
    document.getElementById('optionsContainer').style.display = 'grid';
}
function renderOptions(question) {
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.onclick = () => selectAnswer(index);
        optionElement.innerHTML = `
            <span class="option-indicator"></span>
            <span>${option}</span>
        `;
        optionsContainer.appendChild(optionElement);
    });
}
function selectAnswer(selectedIndex) {
    const question = quizQuestions[quizState.currentQuestionIndex];
    const isCorrect = selectedIndex === question.correctAnswer;
    quizState.selectedAnswers.push({
        questionId: question.id,
        selectedIndex: selectedIndex,
        correct: isCorrect
    });
    if (isCorrect) {
        quizState.score++;
    }
    const options = document.querySelectorAll('.option');
    options.forEach((option, index) => {
        option.classList.add('disabled');
        if (index === question.correctAnswer) {
            option.classList.add('correct');
        }
        else if (index === selectedIndex && !isCorrect) {
            option.classList.add('incorrect');
        }
    });
    showFeedback(isCorrect, question);
}
function showFeedback(isCorrect, question) {
    const feedbackSection = document.getElementById('feedbackSection');
    const feedbackContent = document.getElementById('feedbackContent');
    const feedbackClass = isCorrect ? 'feedback-correct' : 'feedback-incorrect';
    const feedbackMessage = isCorrect ? 'Correct!' : 'Incorrect!';
    feedbackContent.innerHTML = `
        <div class="${feedbackClass}">
            ${feedbackMessage}
        </div>
        <div class="explanation">
            <div class="explanation-label">Explanation:</div>
            ${question.explanation}
        </div>
    `;
    feedbackSection.classList.remove('hidden');
    document.getElementById('optionsContainer').style.display = 'none';
}
function nextQuestion() {
    quizState.currentQuestionIndex++;
    if (quizState.currentQuestionIndex < quizState.totalQuestions) {
        displayQuestion();
    } else {
        showResults();
    }
}
function showResults() {
    const percentage = Math.round((quizState.score / quizState.totalQuestions) * 100);
    const incorrect = quizState.totalQuestions - quizState.score;
    document.getElementById('finalScore').textContent = quizState.score;
    document.getElementById('maxScore').textContent = quizState.totalQuestions;
    document.getElementById('percentageScore').textContent = percentage + '%';
    document.getElementById('correctCount').textContent = quizState.score;
    document.getElementById('incorrectCount').textContent = incorrect;
    document.getElementById('accuracyPercentage').textContent = percentage + '%';
    const performanceText = document.getElementById('performanceText');
    let message = '';
    if (percentage === 100) {
        message = '🏆 Perfect Score! You are a quiz master!';
    } else if (percentage >= 80) {
        message = '⭐ Excellent! You have a great understanding!';
    } else if (percentage >= 60) {
        message = '👍 Good job! Keep learning and improving!';
    } else if (percentage >= 40) {
        message = '💪 Not bad! Review the material and try again!';
    } else {
        message = '📚 Keep practicing! You\'ll improve with study!';
    }
    performanceText.textContent = message;
    renderDetailedReview();
    showScreen('resultsScreen');
}
function renderDetailedReview() {
    const reviewContainer = document.getElementById('reviewContainer');
    reviewContainer.innerHTML = '';
    quizState.selectedAnswers.forEach((answer, index) => {
        const question = quizQuestions[index];
        const reviewItem = document.createElement('div');
        const itemClass = answer.correct ? 'review-item correct' : 'review-item incorrect';
        const correctOption = question.options[question.correctAnswer];
        const userOption = question.options[answer.selectedIndex];
        reviewItem.className = itemClass;
        reviewItem.innerHTML = `
            <div class="review-question">
                Q${index + 1}: ${question.question}
            </div>
            <div class="review-answer user-answer">
                Your answer: ${userOption}
            </div>
            ${!answer.correct ? `<div class="review-answer correct-answer">Correct answer: ${correctOption}</div>` : ''}
        `;
        reviewContainer.appendChild(reviewItem);
    });
}
function restartQuiz() {
    initializeQuiz();
    startQuiz();
}
function goHome() {
    initializeQuiz();
    showScreen('welcomeScreen');
}
function quitQuiz() {
    const confirmQuit = confirm('Are you sure you want to quit? Your progress will be lost.');
    if (confirmQuit) {
        initializeQuiz();
        showScreen('welcomeScreen');
    }
}
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}
document.addEventListener('DOMContentLoaded', function() {
    console.log('Quiz Application Loaded');
    console.log(`Total Questions: ${quizQuestions.length}`);
});
