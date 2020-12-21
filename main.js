//Player e CPU
const player = {
  sprite: document.getElementById("player"),
  position_initial_Y: 150,
  position_initial_X: 15,
  positionY: 0,
  positionX: 0,
  direction: 0,
  speed: 20,
  width: 15,
  height: 110,
  score: 0,
}

const cpu = {
  sprite: document.getElementById("cpu"),
  position_initial_Y: 150,
  position_initial_X: 785,
  positionY: 0,
  positionX: 0,
  direction: 0,
  speed: 20,
  width: 15,
  height: 110,
  score: 0,
}

const ball = {
  sprite: document.getElementById("ball"),
  position_initial_Y: 190,
  position_initial_X: 370,
  positionY: 0,
  positionX: 0,
  directionX: 0,
  directionY: 0,
  speed: 0,
  width: 30,
  height: 30,
}

//Elementos
const score = document.getElementById("points");
const startButton = document.getElementById("startButton");
const topButton = document.getElementById("top");
const downButton = document.getElementById("bottom");

//Variáveis de controle
let game = false, frame;

startButton.addEventListener("click",() => startGame());
topButton.addEventListener("click",() => movePlayer("top"));
downButton.addEventListener("click",() => movePlayer("bottom"));

document.addEventListener("keydown",movePlayer);
document.addEventListener("keyup",stopPlayer);

//Funções principais
function startGame() {
  if(!game) {
    game = true;
    renderGame();
    startMovingBall();
    
    //Posicionando a barra do player
    player.positionY = player.position_initial_Y;
    player.positionX = player.position_initial_X;
    
    //Posicionando a barra da cpu
    cpu.positionY = cpu.position_initial_Y;
    cpu.positionX = cpu.position_initial_X;
    
    //Posicionando a bola
    ball.positionY = ball.position_initial_Y;
    ball.positionX = ball.position_initial_X;
  }
}

function renderGame() {
  player.sprite.style.top = `${player.positionY}px`;
  cpu.sprite.style.top = `${cpu.positionY}px`;
  
  moveCPU();
  moveBall();
  frame = requestAnimationFrame(renderGame);
}

function goal(who) {
  game = false;
  stopBall();
  if(who === "player") player.score++;
  if(who === "cpu") cpu.score++;
  actualizeScore();
  cancelAnimationFrame(frame);
}

function actualizeScore() {
  score.innerHTML = `Jogador ${player.score} x ${cpu.score} Máquina`;
}

//Funções de movimentação
function movePlayer(direction) {
  if(game) {
    let key = event.keyCode;
    
    if(direction === "top") player.direction = -1;
    if(direction === "bottom") player.direction = 1;
    
    if(key === 38) player.direction = -1;
    if(key === 40) player.direction = 1;
    
    player.positionY += player.speed * player.direction;
    
    if(player.positionY <= 10) player.positionY = 15;
    if(player.positionY >= 310) player.positionY = 300;
  }
}

function stopPlayer() {
  if(game) {
    let key = event.keyCode;
    
    if(key === 38) player.direction = 0;
    if(key === 40) player.direction = 0;
    
    player.positionY += player.speed * player.direction;
    
    if(player.positionY <= 10) player.positionY = 15;
    if(player.positionY >= 310) player.positionY = 300;
  }
}

function moveCPU() {
  if(game) {
    if(ball.positionX > (800/2) && ball.directionX > 0) {
      //movimentando para cima
      if((ball.positionY < cpu.positionY + (cpu.height / 2))) {
        if(cpu.positionY > 10) {
          cpu.directionY = -1;
          cpu.positionY += cpu.speed * cpu.directionY;
        }
      }
      
      //movimentando para baixo
      if(ball.positionY > cpu.positionY + (cpu.height / 2)) {
        if(cpu.positionY + cpu.height < 350) {
          cpu.directionY = 1;
          cpu.positionY += cpu.speed * cpu.directionY;
        }
      }
    }
  } else {
    cpu.positionY = cpu.position_initial_Y;
    cpu.positionX = cpu.position_initial_X;
  }
}

function startMovingBall() {
  ball.speed = 5;
  let value = Math.floor(Math.random() * 10);
  if(value > 5) {
    ball.directionX = 1;
    ball.directionY = 0;
  } else {
    ball.directionX = -1;
    ball.directionY = 0;
  }
}

function stopBall() {
  ball.speed = 0;
  ball.positionY = ball.position_initial_Y;
  ball.positionX = ball.position_initial_X;
  
  ball.directionY = 0;
  ball.directionX = 0;
}

function moveBall() {
  ball.positionY += ball.speed * ball.directionY;
  ball.positionX += ball.speed * ball.directionX;
  
  //Colisão com a barra do player
  if(ball.positionX <= (player.positionX + player.width) && ball.positionY >= player.positionY && ball.positionY <= (player.positionY + player.height)) {
    ball.directionY = ((ball.positionY + (ball.height / 2)) - (player.positionY + (player.height / 2)))/32;
    ball.directionX = 1;
  }
  
  //Colisão com a barra da cpu
  if(ball.positionX >= (cpu.positionX - cpu.width) && ball.positionY >= cpu.positionY && ball.positionY <= (cpu.positionY + cpu.height)) {
    ball.directionY = ((ball.positionY + (ball.height / 2)) - (cpu.positionY + (cpu.height / 2)))/32;
    ball.directionX = -1;
  }
  
  //Colisão vertical com a tela 
  if((ball.positionY + ball.height) >= 400 || ball.positionY <= 0) {
    ball.directionY *= -1;
  }
  
  if((ball.positionX) >= 800) goal("player");
  if((ball.positionX) < 0) goal("cpu");
  
  ball.sprite.style.top = `${ball.positionY}px`;
  ball.sprite.style.left = `${ball.positionX}px`;
}