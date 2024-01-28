//board
let board;
let boardWidth = 1500;
let boardHeight = 500;

//player
let playerWidth = 144;
let playerHeight = 188;
let playerX = 100;
let playerY = boardHeight - playerHeight - 25;
let playerImg;

let player = {
    x: playerX,
    y: playerY,
    width: playerWidth,
    height: playerHeight
};

//obstacles
let obstacleArray = [];

let obstacle1Width  = 92;
let obstacle2Width = 192;

let obstacle1Height = 192;
let obstacle2Height = 104;

let obstacleX = 1400;
let obstacle1Y = boardHeight - obstacle1Height - 25;
let obstacle2Y = boardHeight - obstacle2Height - 25;

let obstacle1Img;
let obstacle2Img;

let obstacleHit;

//physics
let velocityX = -9;
let velocityY = 0;
let gravity = .8;

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
        deathUpdate()
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

           setInterval(deathAnimation, 100);

            setTimeout(function() {
                context.fillStyle="white";
                context.font="160px Pixelify Sans";
                context.textAlign="center";
                context.lineWidth=10;           
                context.strokeText("Game Over", boardWidth/2, boardHeight/2);
                context.fillText("Game Over", boardWidth/2, boardHeight/2);
            }, 675)

            setTimeout(function() {
                switch (obstacle.name) {
                    case "cig": 
                        context.fillStyle="black";
                        context.font="40px Pixelify Sans";
                        context.textAlign="center";
                        context.fillText("Your last cigarette got broken. You killed yourself.", boardWidth/2, boardHeight/2 + 100);
                        break;
                    case "zoloft": 
                        context.fillStyle="black";
                        context.font="40px Pixelify Sans";
                        context.textAlign="center";
                        context.fillText("You've been sedated.", boardWidth/2, boardHeight/2 + 100);
                        break;
                }
            }, 675)
        }
    }

    //score
    context.fillStyle="black";
    context.font="40px Pixelify Sans";
    score++;
    context.fillText(score, boardWidth - 150, 40, 140);
}

function deathUpdate() {
    requestAnimationFrame(deathUpdate);
    if (counter > 5){
        return;
    }
    context.clearRect(0, 0, board.width, board.height);
    player.y = playerY;
    context.drawImage(playerImg, player.x, player.y, player.width, player.height);
    context.fillText(score, boardWidth - 150, 40, 140);
}

function movePlayer(e) { 
    if (gameOver) {
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && player.y == playerY) {
        //jump
        velocityY = -22;
    }
}

function placeObstacle() {
    if(gameOver) {
        return;
    }

    let obstacle = {
        img: null,
        x: obstacleX,
        y: null,
        width: null,
        height: null,
        name: null
    }

    let placeObstacleChance = Math.random();

    if(placeObstacleChance > .75) {
        obstacle.img = obstacle2Img;
        obstacle.y = obstacle2Y;
        obstacle.width = obstacle2Width;
        obstacle.height = obstacle2Height;
        obstacle.name = "zoloft";
        obstacleArray.push(obstacle);
    } 
    else if(placeObstacleChance > .50) {
        obstacle.img = obstacle1Img;
        obstacle.y = obstacle1Y;
        obstacle.width = obstacle1Width;
        obstacle.height = obstacle1Height;
        obstacle.name = "cig";
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
    if(gameOver) {
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

function deathAnimation() {
    if (counter === 0 || counter === 1) {
        counter = 2;
    }
    switch (counter) {
        case 2:
            playerImg.src = "./img/playerDead1.png"; 
            counter = 3;
            break;
        case 3:
            playerImg.src = "./img/playerDead2.png";
            counter = 4;
            break;
        case 4: 
            playerImg.src = "./img/playerDead3.png";
            counter = 5;
            break;
        case 5: 
            counter = 6;
            break;
    }
}

