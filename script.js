const audioSuccess = new Audio('success_sound.mp3');
const audioSong = new Audio('8_bit_song.mp3');
audioSong.volume = 0.3;
audioSong.loop = true;

const board = document.getElementById('game-board');
const scoreText = document.getElementById('score');

const splashScreen = document.getElementById('splash-screen');
const pausedSplashScreen = document.getElementById('pause-splash-screen');

pausedSplashScreen.style.display = 'none';

const gridSize = 20;

let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let direction = 'right';
let gameInterval;
let gameSpeedDealy = 210;
let gameStarted = false;
let score = 0;

// create & draw HTML elements
function draw() {
  board.innerHTML = '';
  drawSnake();
  drawFood();
}

function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement('div', 'snake');
    printPositionInBoard(snakeElement, segment);
  });
}

function drawFood() {
  const foodElement = createGameElement('div', 'food');
  printPositionInBoard(foodElement, food);
}

function printPositionInBoard(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
  board.appendChild(element);
}

function createGameElement(tag, className) {
  const ele = document.createElement(tag);
  ele.className = className;
  return ele;
}

function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

function move() {
  const head = { ...snake[0] };
  switch (direction) {
    case 'right':
      head.x++;
      break;
    case 'left':
      head.x--;
      break;
    case 'up':
      head.y--;
      break;
    case 'down':
      head.y++;
      break;
  }

  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    audioSuccess.play();
    food = generateFood();
    clearInterval(gameInterval);

    setGameSpeed();
    setScore();

    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDealy);
  } else {
    snake.pop();
  }
}

// game statuses
function startGame() {
  gameStarted = true;
  splashScreen.style.display = 'none';
  pausedSplashScreen.style.display = 'none';
  audioSong.play();

  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDealy);
}

function pauseOrRestartGame() {
  if (gameInterval) {
    pausedSplashScreen.style.display = 'flex';
    audioSong.pause();
    gameInterval = clearInterval(gameInterval);
  } else {
    startGame();
  }
}

function resetGame() {
  location.reload();
}

// key handlers
function handleKeyPress(event) {
  if (event.code === 'space' || event.key === ' ') {
    gameStarted ? pauseOrRestartGame() : startGame();
  } else {
    switch (event.key) {
      case 'ArrowUp':
        if (direction !== 'down') direction = 'up';
        break;
      case 'ArrowDown':
        if (direction !== 'up') direction = 'down';
        break;
      case 'ArrowRight':
        if (direction !== 'left') direction = 'right';
        break;
      case 'ArrowLeft':
        if (direction !== 'right') direction = 'left';
        break;

      default:
        break;
    }
  }
}

// check and setters
function checkCollision() {
  const head = snake[0];

  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

function setGameSpeed() {
  if (gameSpeedDealy >= 150) gameSpeedDealy -= 20;

  if (gameSpeedDealy < 150 && gameSpeedDealy >= 100) gameSpeedDealy -= 10;
  if (gameSpeedDealy < 100 && gameSpeedDealy >= 90) gameSpeedDealy -= 5;

  console.log(gameSpeedDealy);
}

function setScore() {
  score = score + 10;
  scoreText.innerHTML = score;
}

document.addEventListener('keydown', handleKeyPress);
