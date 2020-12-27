var startquizEl = document.querySelector("#start-quiz");
var optionsEl = document.querySelector("#options");
var intro = document.querySelector("#intro");
var questionEl = document.querySelector("#questions");
var timerEl = document.querySelector("#timer");
var answersEl = document.querySelector("#answers");
var responseEl = document.querySelector("#response");
var response2El = document.querySelector("#response2");
var initialsEl = document.querySelector("#initials");
var initialsForm = document.querySelector("#initials-form");
var viewHighscoresEl = document.querySelector("#viewHighscores");
var highscoresEl = document.querySelector("#highscores");

// Initializing global values
var correctAnswers = 0;     // Number of answers user got right
var timer = 75;
var stopGame = false;       // Stops timer when set to true
var questionNum = 0;
var highscores = [];

// Array containing each questions and answers with the correct response
var questions = [
    {
        question: "Commonly used data types DO NOT include:",
        answer: ["alerts", "booleans", "strings", "numbers"],
        correct: "0"
    },
    {
        question: "The conidition in an if / else statement is enclosed within _____",
        answer: ["quotes", "curly brackets", "parentheses", "square brackets"],
        correct: "2"
    },
    {
        question: "Arrays in JavaScript can be used to store ______",
        answer: ["numbers and strings", "other arrays", "booleans", "all of the above"],
        correct: "3"
    },
    {
        question: "String values must be enclosed within ______ when being assigned to variables",
        answer: ["commas", "curly brackets", "quotes", "parentheses"],
        correct: "2"
    },
    {
        question: "A very useful too used during development and debugging for printing content to the debugger is:",
        answer: ["JavaScript", "terminal / bash", "for loops", "console.log"],
        correct: "3"
    }
];

// The main startup screen
function init() {
    intro.style.display = "block";
    startquizEl.style.display = "block";
    initialsEl.style.display = "none";
    highscoresEl.style.display = "none";
    optionsEl.style.display = "none";

    // Resets global values
    questionNum = 0;
    stopGame = false;
    correctAnswers = 0;
    timer = 75;

    // Obtains current highscores from storage
    var storedScores = JSON.parse(localStorage.getItem("highscores"));

    if (storedScores !== null) {
        highscores = storedScores;
    } else highscores = [];

    questionEl.textContent = "Coding Quiz Challange";
    intro.textContent = "Try to answer the following code-related questions within the time limit. Keep in mind that incorrect answers will penalize your score/time by then seconds!";
}

// Cycles through each question from the questions array
function quizQuestion() {
    answersEl.innerHTML = "";
    
    // Ends the game after the last question is reached
    if (questionNum === questions.length) {
        return endGame();
    }
    questionEl.textContent = questions[questionNum].question;

    // Creates multiple choice answers
    for (i = 0; i < questions[questionNum].answer.length; i++) {
        var btn = document.createElement("button");
        btn.className = "btn btn-primary";
        btn.textContent = questions[questionNum].answer[i];
        btn.setAttribute("data-index", i);

        var li = document.createElement("li");
        li.appendChild(btn);
        answersEl.appendChild(li);
    }
}

function startQuiz() {
    intro.style.display = "none";
    startquizEl.style.display = "none";
    initialsEl.style.display = "none";
    answersEl.style.display = "block";

    quizQuestion();
    
    // Starts the timer and ticks down
    var timerInterval = setInterval(function() {

        if (stopGame) clearInterval(timerInterval);     // Stops timer if user answers last question

        
        timerEl.textContent = "Time left: " + timer;

        timer--;
    
        // Ends game when timer hits 0
        if(timer === 0) {
          clearInterval(timerInterval);
          endGame();
        }  
    }, 1000);
}

function compareAnswers(x) {
    var i = 1;

    if (x === questions[questionNum].correct) {
        correctAnswers++;
        response2El.textContent = "Correct!";
    } else {
        response2El.textContent = "Incorrect";
        timer -= 10;
    }

    responseEl.style.display = "block";

    var reponseInterval = setInterval(function() {
        i--;
        
        if(i === 0) {
          clearInterval(reponseInterval);
          responseEl.style.display = "none";
        }  
    }, 1000);

    questionNum++;
    quizQuestion();
}

function answerButton(event) {
    var element = event.target;

    if (element.matches("button") === true) {
        var index = element.getAttribute("data-index");
        if (index !== null) compareAnswers(index);
    }
}

function endGame() {
    stopGame = true;

    answersEl.style.display = "none";
    questionEl.textContent = "All done!";
    intro.textContent = "Your final score is " + correctAnswers + "/" + questions.length;
    intro.style.display = "block";
    initialsEl.style.display = "block";

}

function highScores(event) {
    event.preventDefault();

    var initials = initialsForm.value.trim();

    // Checks if the initials the user inputed are valid

    if (initials === "") {
        return;
    }

    if (initials.length !== 2) {
        alert("Initials must be 2 characters");
        return;
    }

    // Adds score and intials to highscores array
    highscores.push(initials);
    highscores.push(correctAnswers);
    localStorage.setItem("highscores", JSON.stringify(highscores));

    viewHighscores();
}

function clearScores() {
    highscores = [];
    localStorage.setItem("highscores", JSON.stringify(highscores));
    viewHighscores();
}

function viewHighscores() {
    initialsEl.style.display = "none";
    intro.style.display = "none";
    startquizEl.style.display = "none";
    answersEl.style.display = "none";
    highscoresEl.style.display = "block";
    optionsEl.style.display = "block";
    questionEl.textContent = "Highscores";

    stopGame = true;

    highscoresEl.innerHTML = "";

    // Creates the list of highscores from the highscores array
    for (i = 0; i < highscores.length; i += 2) {
        var initials = highscores[i];       // User initials are on the array's even numbers
        var score = highscores[i+1];        // Scores are on the array's odd numbers

        var li = document.createElement("li");
        li.setAttribute("id", "highscoreList");
        li.textContent = initials + " - " + score + "/5";
        highscoresEl.appendChild(li);

        highscoresEl.appendChild(document.createElement("hr"));
    }
}

function options(event) {
    event.preventDefault();
    if(event.target.matches("button")) {
        if (event.target.id === "goBack") {
            init();
        }
        if (event.target.id === "clearScores") {
            clearScores();
        }
    }
}

answersEl.addEventListener("click", answerButton);
startquizEl.addEventListener("click", startQuiz);
initialsEl.addEventListener("submit", highScores);
viewHighscoresEl.addEventListener("click", viewHighscores);
optionsEl.addEventListener("click", options);
init();