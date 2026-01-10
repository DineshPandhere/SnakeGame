const board = document.querySelector('.board');
const StartButton = document.querySelector('.btn-start');
const modal = document.querySelector('.modal');
const startGameModal = document.querySelector('.start-game');
const gameOverModal = document.querySelector('.game-over');
const restartButton = document.querySelector('.btn-restart');

const highScoreElement = document.querySelector("#high-score");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");

const blockWidth = 50;
const blockHeight = 50;

let highScore = localStorage.getItem("highScore") ? parseInt(localStorage.getItem("highScore")) : 0;
highScoreElement.innerText = highScore;

let score = 0
let time = `00-00`




const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);
let intervalId = null;
let timeIntervalId = null;
let food = {x:Math.floor(Math.random()*rows), y:Math.floor(Math.random()*cols)};

const blocks = [];
let snake = [ {x:1 , y:3}]; // Initial snake segments

let direction = 'right';


for (let row = 0; row<rows; row++){
    for (let col = 0; col<cols; col++){
    const block = document.createElement('div');
    block.classList.add("block");
    board.appendChild(block);
    blocks[`${row},${col}`] = block;
    }
}

function render() { 
   


     let head = null

     blocks[`${food.x},${food.y}`].classList.add("food");

    if (direction === 'left') {
        head = { x: snake[0].x, y: snake[0].y - 1 };
    }else if (direction === 'right') {
        head = { x: snake[0].x, y: snake[0].y + 1 };
    }else if (direction === 'up') {
        head = { x: snake[0].x - 1, y: snake[0].y };
    }else if (direction === 'down') {
        head = { x: snake[0].x + 1, y: snake[0].y };
    }

    if(head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) { clearInterval(intervalId)
        modal.style.display = 'flex'
    startGameModal.style.display = 'none'
    gameOverModal.style.display = 'flex'
    return;
    }

       // Render food
    if (head.x == food.x && head.y == food.y) {
        blocks[`${food.x},${food.y}`].classList.remove("food");
        food = {
            x:Math.floor(Math.random()*rows), y:Math.floor(Math.random()*cols)
        }
        blocks[`${food.x},${food.y}`].classList.add("food");snake.unshift(head)// Grow the snake

        score += 10;                         // Increase the variable
    scoreElement.innerText = score;      // Update the Current
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore.toString())
    }

}



    snake.forEach(segment => {
        blocks[`${segment.x},${segment.y}`].classList.remove('fill')
    });
    snake.unshift(head);
    snake.pop();

 


     snake.forEach(segment => {
        blocks[`${segment.x},${segment.y}`].classList.add('fill')
    });
}



function restartGame() {
    clearInterval(intervalId);
    clearInterval(timeIntervalId);
    time = `00-00`
    timeElement.innerText = time;
    
     intervalId = setInterval(() => { render() }, 300)
    timeIntervalId = setInterval(() => {
        let [min, sec] = time.split("-").map(Number)
        if (sec == 59) {
            min += 1
            sec = 0
        } else {
            sec += 1
        }   
        time = `${min}-${sec}`
        timeElement.innerText = time
    }, 1000)
    
    
    // Clear all visual classes from the board
    Object.values(blocks).forEach(block => {
        block.classList.remove('fill', 'food');
    });
        score = 0 
    scoreElement.innerText = score;


    // Reset State
    snake = [{ x: 1, y: 3 }];
    direction = 'right';
    food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };
    

    
    
    modal.style.display = 'none';
    intervalId = setInterval(render, 300);
}restartButton.addEventListener('click', restartGame)


StartButton.addEventListener('click', () => {
    document.querySelector('.modal').style.display = 'none'

    intervalId = setInterval(() => { render() }, 300)
    timeIntervalId = setInterval(() => {
        let [min, sec] = time.split("-").map(Number)
        if (sec == 59) {
            min += 1
            sec = 0
        } else {
            sec += 1
        }   
        time = `${min}-${sec}`
        timeElement.innerText = time
    }, 1000)
})


addEventListener('keydown', (event) => {
    if(event.key == 'ArrowUp'){
        direction = 'up';
    }else if(event.key == 'ArrowDown'){
        direction = 'down';
    }else if(event.key == 'ArrowLeft'){
        direction = 'left';
    }else if(event.key == 'ArrowRight'){
        direction = 'right';
    }
})