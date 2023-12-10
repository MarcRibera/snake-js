const board = document.getElementById('game-board');

const gridSize = 20;

let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let direction = 'right';

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
  snake.pop();
  console.log(snake);
}

setInterval(() => {
  move();
  draw();
}, 200);
