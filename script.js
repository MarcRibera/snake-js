// create audio elements
const audioSuccess = new Audio('success_sound.mp3');
const audioSong = new Audio('8_bit_song.mp3');

// get html elements
const board = document.getElementById('game-board');
const scoreText = document.getElementById('score');
const splashScreen = document.getElementById('splash-screen');
const pausedSplashScreen = document.getElementById('pause-splash-screen');

// const
const GRID_SIZE = 20;

// vars
let snake;
let food;
let direction;
let gameInterval;
let gameSpeedDealy;
let gameStatus; // new / started / paused / over
let score;

function init() {
  document.addEventListener('keydown', handleKeyPress);

  pausedSplashScreen.style.display = 'none';
  audioSong.volume = 0.3;
  audioSong.loop = true;

  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = 'right';
  gameStatus = 'new';
  score = 0;
  gameSpeedDealy = 210;
}

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
  const x = Math.floor(Math.random() * GRID_SIZE) + 1;
  const y = Math.floor(Math.random() * GRID_SIZE) + 1;
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
  //gameStarted = true;
  splashScreen.style.display = 'none';
  pausedSplashScreen.style.display = 'none';
  audioSong.play();

  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDealy);
}

function pauseGame() {
  gameInterval = clearInterval(gameInterval);
  pausedSplashScreen.style.display = 'flex';
  audioSong.pause();
}

function gameOver() {
  clearInterval(gameInterval);
  audioSong.pause();
  gameStatus = 'over';
}

function resetGame() {
  location.reload();
}

// key handlers
function handleKeyPress(event) {
  if (event.code === 'space' || event.key === ' ') onPressSpace();
  onPressArrow();
}

function onPressSpace() {
  switch (gameStatus) {
    case 'new':
      gameStatus = 'started';
      startGame();
      break;
    case 'started':
      gameStatus = 'paused';
      pauseGame();
      break;
    case 'paused':
      gameStatus = 'started';
      startGame();
      break;
    case 'over':
      resetGame();
      gameStatus = 'new';
      break;
  }
}

function onPressArrow() {
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
  }
}

// check and setters
function checkCollision() {
  const head = snake[0];

  if (head.x < 1 || head.x > GRID_SIZE || head.y < 1 || head.y > GRID_SIZE) {
    gameOver();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOver();
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

init();
