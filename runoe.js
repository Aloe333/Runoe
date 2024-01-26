//board
let board;
let boardWidth = 750;
let boardHeight = 250;

//player
let playerWidth = 72;
let playerHeight = 96;
let playerX = 50;
let playerY = boardHeight - playerHeight;
let playerImg;

let player = {
    x: playerX,
    y: playerY,
    width: playerWidth,
    height: playerHeight
};

//obstacles
let obstacleArray = [];

let obstacle1Width  = 46;
let obstacle2Width = 96;

let obstacle1Height = 96;
let obstacle2Height = 52;

let obstacleX = 700;
let obstacle1Y = boardHeight - obstacle1Height;
let obstacle2Y = boardHeight - obstacle2Height

let obstacle1Img;
let obstacle2Img;

//physics
let velocityX = -5;
let velocityY = 0;
let gravity = .4;

//game
let gameOver = false;
let score = 0;
let counter = 0;


window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d");

    //draw player
    playerImg = new Image();
    playerImg.src = "./img/player.png";
    playerImg.onload = function() {
        context.drawImage(playerImg, player.x, player.y, player.width, player.height);
    }

    obstacle1Img = new Image();
    obstacle1Img.src = "./img/obstacle1.png";

    obstacle2Img = new Image();
    obstacle2Img.src = "./img/obstacle2.png";

    requestAnimationFrame(update);
    setInterval(placeObstacle, 1000);
    setInterval(playerAnimation, 125);
    document.addEventListener("keydown", movePlayer)
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    //player
    velocityY += gravity;
    player.y = Math.min(player.y + velocityY, playerY);
    context.drawImage(playerImg, player.x, player.y, player.width, player.height);

    //obstacle
    for(let i = 0; i < obstacleArray.length; i++) {
        let obstacle = obstacleArray[i];
        obstacle.x += velocityX;
        context.drawImage(obstacle.img, obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        if (detectCollision(player, obstacle)) {
            gameOver = true;

            playerImg.src = "./img/playerDead.png"; 
            playerImg.onload = function() {
                context.drawImage(playerImg, player.x, player.y, player.width, player.height);
            }
            
            setTimeout(function() {
                context.fillStyle="white";
                context.font="80px Pixelify Sans";
                context.textAlign="center";
                context.lineWidth=10;           
                context.strokeText("Game Over", boardWidth/2, boardHeight/2);
                context.fillText("Game Over", boardWidth/2, boardHeight/2);
            }, 500)
        }
    }

    //score
    context.fillStyle="black";
    context.font="20px Pixelify Sans";
    score++;
    context.fillText(score, boardWidth - 75, 20, 70);
}

function movePlayer(e) { 
    if (gameOver) {
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && player.y == playerY) {
        //jump
        velocityY = -11;
    }
}

function placeObstacle() {
    if (gameOver) {
        return;
    }

    let obstacle = {
        img: null,
        x: obstacleX,
        y: null,
        width: null,
        height: null
    }

    let placeObstacleChance = Math.random();

    if(placeObstacleChance > .75) {
        obstacle.img = obstacle2Img;
        obstacle.y = obstacle2Y;
        obstacle.width = obstacle2Width;
        obstacle.height = obstacle2Height;
        obstacleArray.push(obstacle);
    } 
    else if(placeObstacleChance > .50) {
        obstacle.img = obstacle1Img;
        obstacle.y = obstacle1Y;
        obstacle.width = obstacle1Width;
        obstacle.height = obstacle1Height;
        obstacleArray.push(obstacle);
    }

    if (obstacleArray.length > 5) {
        obstacleArray.shift();
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width && 
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;

}

function playerAnimation() {
    if (gameOver) {
        return;
    }
    if(counter === 0) {
        playerImg.src = "./img/player2.png"; 
        counter = 1;
    } 
    else {
        playerImg.src = "./img/player.png"; 
        counter = 0;
    }
}

