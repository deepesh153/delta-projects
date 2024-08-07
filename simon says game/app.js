// SIMON SAYS GAME

let gameSeq = [];
let userSeq = [];
let btns = ["yellow", "green", "purple", "red"];

let started = false;
let level = 0;
let highScore = 0;
let score =[];

let heading = document.querySelector("h2");
let allBtns = document.querySelectorAll(".btn");

document.addEventListener("keypress", function () {
  if (started == false) {
    console.log("game started");
    started = true;
    levelUp();
  }
});

function gameFlash(btn) {
  btn.classList.add("flash");
  setTimeout(function () {
    btn.classList.remove("flash");
  }, 300);
}
function userFlash(btn) {
  btn.classList.add("userflash");
  setTimeout(function () {
    btn.classList.remove("userflash");
  }, 100);
}

function levelUp() {
  userSeq = [];
  level++;
  heading.innerText = `Level ${level}`;
  // random button choose
  let randIdx = Math.floor(Math.random() * 4);
  let randomColor = btns[randIdx];
  let randBtn = document.querySelector(`.${randomColor}`);
  gameSeq.push(randomColor);
  console.log(gameSeq);
  gameFlash(randBtn);
  getScore();
}

function checkAns(idx) {
  // let idx = level-1;
  if (userSeq[idx] === gameSeq[idx]) {
    if (userSeq.length == gameSeq.length) {
      setTimeout(levelUp(), 1000);
    }

  }
  else {
    heading.innerHTML = `Game Over! Your score was <b>${level}</b> and your highest score was ${highScore} <br>  Press any key to start.`;
    document.querySelector("body").style.backgroundColor = "red"
    setTimeout(function () {
      document.querySelector("body").style.backgroundColor = "white"
    }, 150);
    
    reset();
  }
  // console.log("curr level:", level);
}

function getScore(){
  score.push(level);
  for(let i=0; i<=score.length;i++){
    if(score[i] > highScore){
      highScore = score[i];
    }
  }
}

function btnPress() {
  // console.log(this);
  let btn = this;
  userFlash(btn);
  userColor = btn.getAttribute("id");
  console.log(userColor);
  userSeq.push(userColor);
  checkAns(userSeq.length - 1);
}

for (btn of allBtns) {
  btn.addEventListener("click", btnPress);
}
function reset() {
  started = false;
  gameSeq = [];
  userSeq = [];
  level = 0;
}
