let equation = [];
let score = 0;
let round = 1;
let timeLeft = 30;
let timerInterval;
let targetNumber = generateTarget();
let totalRounds = 3;

const timeDisplay = document.getElementById('time');
const scoreDisplay = document.getElementById('score');
const equationDisplay = document.getElementById('equation');
const problemDisplay = document.getElementById('problem');
const submitButton = document.getElementById('submit');
const clearButton = document.getElementById('clear');
const correctSound = document.getElementById('correct-sound');
const startButton = document.getElementById('startButton');
const cardContainer = document.getElementById('cardContainer');

const numberCards = Array.from({ length: 10 }, (_, i) => ({
  type: 'number',
  value: i,
  src: `cards/number_${i}.png`,
  alt: `${i}`,
}));

const operatorCards = [
  { type: 'operator', value: '+', src: 'cards/addition.png', alt: '+' },
  { type: 'operator', value: '-', src: 'cards/subtraction.png', alt: '-' },
  { type: 'operator', value: '*', src: 'cards/multiply.png', alt: '×' },
  { type: 'operator', value: '/', src: 'cards/division.png', alt: '÷' },
];

function generateCards() {
  const cards = [...numberCards, ...operatorCards];

  cards.forEach(card => {
    const div = document.createElement('div');
    div.className = `card ${card.type}`;
    div.setAttribute('data-value', card.value);

    const img = document.createElement('img');
    img.src = card.src;
    img.alt = card.alt;
    img.className = 'card-img';

    div.appendChild(img);
    cardContainer.appendChild(div);

    div.addEventListener('click', () => {
      equation.push(card.value);
      equationDisplay.textContent = `Equation: ${equation.join(' ')}`;
    });
  });
}

clearButton.addEventListener('click', resetEquation);

submitButton.addEventListener('click', () => {
  const joined = equation.join('');

  if (!isValidEquation(joined)) {
    alert('Invalid equation. Make sure to use an operator!');
    return;
  }

  try {
    const result = eval(joined);
    if (result === targetNumber) {
      const operatorCount = (joined.match(/[\+\-\*\/]/g) || []).length;
      const points = operatorCount > 1 ? 2 : 1;
      score += points;
      scoreDisplay.textContent = score;

      correctSound.currentTime = 0;
      correctSound.play();

      alert(`Correct! +${points} point${points > 1 ? 's' : ''}`);
    } else {
      alert('Wrong answer!');
    }
  } catch (err) {
    alert('Error evaluating equation.');
  }

  resetEquation();
  newProblem();
});

startButton.addEventListener('click', () => {
  startButton.style.display = 'none';
  if (musicPlaying) {
    bgMusic.play();
  }
  cardContainer.innerHTML = '';
  generateCards();
  startRound();
});

function isValidEquation(equationStr) {
  return /[\+\-\*\/]/.test(equationStr);
}

function generateTarget() {
  return Math.floor(Math.random() * 20) + 1;
}

function resetEquation() {
  equation = [];
  equationDisplay.textContent = 'Equation: ';
}

function newProblem() {
  targetNumber = generateTarget();
  problemDisplay.textContent = `Target: ${targetNumber}`;
}

function shuffleCards() {
  const cards = Array.from(cardContainer.children);
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  cards.forEach(card => cardContainer.appendChild(card));
}

function startRound() {
  timeLeft = 30;
  timeDisplay.textContent = timeLeft;
  newProblem();
  resetEquation();

  timerInterval = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      nextRound();
    }
  }, 1000);
}

function nextRound() {
  if (round < totalRounds) {
    round++;
    alert(`Round ${round} starts now!`);
    shuffleCards();
    startRound();
  } else {
    endGame();
  }
}

function endGame() {
  alert(`Game over! Final Score: ${score}`);
  submitButton.style.display = 'none';
  clearButton.style.display = 'none';

  const playAgainBtn = document.createElement('button');
  playAgainBtn.textContent = 'Play Again';
  playAgainBtn.style.marginTop = '0.5rem';
  playAgainBtn.style.width = submitButton.offsetWidth + 'px';
  playAgainBtn.style.display = 'block';
  playAgainBtn.style.marginLeft = 'auto';
  playAgainBtn.style.marginRight = 'auto';

  submitButton.parentNode.insertBefore(playAgainBtn, submitButton);

  playAgainBtn.addEventListener('click', () => {
    score = 0;
    round = 1;
    scoreDisplay.textContent = '0';
    playAgainBtn.remove();
    submitButton.style.display = 'inline-block';
    clearButton.style.display = 'inline-block';
    startButton.style.display = 'inline-block';
  });
}

const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('musicToggle');
let musicPlaying = true;

musicToggle.addEventListener('click', () => {
  if (musicPlaying) {
    bgMusic.pause();
    musicToggle.textContent = '🎵 Music: Off';
  } else {
    bgMusic.play();
    musicToggle.textContent = '🎵 Music: On';
  }
  musicPlaying = !musicPlaying;
});

