const audioElement = new Audio('success_sound.mp3');
const audioSong = new Audio('8_bit_song.mp3');

const board = document.getElementById('game-board');
const scoreText = document.getElementById('score');

const splashScreen = document.getElementById('splash-screen');

const gridSize = 20;

let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let direction = 'right';
let gameInterval;
let gameSpeedDealy = 210;
let gameStarted = false;
let score = 0;

function draw() {
  board.innerHTML = '';
  drawSnake();
  drawFood();
}

function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement('div', 'snake');
    setPosition(snakeElement, segment);

    board.appendChild(snakeElement);
  });
}

function drawFood() {
  const foodElement = createGameElement('div', 'food');
  setPosition(foodElement, food);
  board.appendChild(foodElement);
}

function createGameElement(tag, className) {
  const ele = document.createElement(tag);
  ele.className = className;

  return ele;
}

function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

function generateFood() {
  const x = Math.floor(Math.random() * gridSize) * 1;
  const y = Math.floor(Math.random() * gridSize) * 1;
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
    audioElement.play();
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

function startGame() {
  gameStarted = true;
  splashScreen.style.display = 'none';
  audioSong.play();

  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDealy);
}

function resetGame() {
  location.reload();
}

function handleKeyPress(event) {
  if (
    (!gameStarted && event.code === 'space') ||
    (!gameStarted && event.key === ' ')
  ) {
    startGame();
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
