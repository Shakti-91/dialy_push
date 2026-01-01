const board = document.querySelector(".board");
const scoreEl = document.querySelectorAll(".info")[1];
const highScoreEl = document.querySelectorAll(".info")[0];
const timeEl = document.querySelectorAll(".info")[2];

const CELL_SIZE = 30;
let COLS = 0;
let ROWS = 0;
let cells = [];

let snake = [];
let direction = { x: 1, y: 0 };
let food = {};
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;

let gameInterval;
let timeInterval;
let seconds = 0;

highScoreEl.innerText = `HighScore: ${highScore}`;

// ---------- CREATE BOARD ----------
function createBoard() {
  board.innerHTML = "";

  const boardWidth = board.clientWidth;
  const boardHeight = board.clientHeight;

  COLS = Math.floor(boardWidth / CELL_SIZE);
  ROWS = Math.floor(boardHeight / CELL_SIZE);

  cells = [];

  for (let i = 0; i < COLS * ROWS; i++) {
    const cell = document.createElement("div");
    cell.classList.add("block");
    board.appendChild(cell);
    cells.push(cell);
  }
}

// ---------- DRAW ----------
function draw() {
  cells.forEach(cell => cell.classList.remove("fill", "food"));

  snake.forEach(part => {
    const index = part.y * COLS + part.x;
    if (cells[index]) cells[index].classList.add("fill");
  });

  const foodIndex = food.y * COLS + food.x;
  if (cells[foodIndex]) cells[foodIndex].classList.add("food");
}

// ---------- FOOD ----------
function generateFood() {
  food = {
    x: Math.floor(Math.random() * COLS),
    y: Math.floor(Math.random() * ROWS),
  };

  if (snake.some(s => s.x === food.x && s.y === food.y)) {
    generateFood();
  }
}

// ---------- MOVE ----------
function moveSnake() {
  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };

  // Wall collision
  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
    return gameOver();
  }

  // Self collision
  if (snake.some(p => p.x === head.x && p.y === head.y)) {
    return gameOver();
  }

  snake.unshift(head);

  // Eat food
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.innerText = `Score: ${score}`;
    generateFood();
  } else {
    snake.pop();
  }

  draw();
}

// ---------- CONTROLS ----------
document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -1 };
  if (e.key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: 1 };
  if (e.key === "ArrowLeft" && direction.x === 0) direction = { x: -1, y: 0 };
  if (e.key === "ArrowRight" && direction.x === 0) direction = { x: 1, y: 0 };
});

// ---------- TIMER ----------
function startTimer() {
  timeInterval = setInterval(() => {
    seconds++;
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    timeEl.innerText = `Time: ${m}:${s}`;
  }, 1000);
}

// ---------- GAME OVER ----------
function gameOver() {
  clearInterval(gameInterval);
  clearInterval(timeInterval);

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }

  alert("Game Over!");
  location.reload();
}

// ---------- START GAME ----------
function startGame() {
  createBoard();

  snake = [{
    x: Math.floor(COLS / 2),
    y: Math.floor(ROWS / 2)
  }];

  direction = { x: 1, y: 0 };

  generateFood();
  draw();

  gameInterval = setInterval(moveSnake, 300); // ⏱ slower speed
  startTimer();
}

startGame();
