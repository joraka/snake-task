const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score-display");
const highScoreElement = document.querySelector(".high-score");

const gridLimit = 30;
const foodList = new Map();
let score = 0;

function setBlockPosition(block, x, y) {
  block.style.gridArea = `${x}/${y}`;
}

function addScore(scoreToAdd) {
  score += scoreToAdd;
  scoreElement.innerText = score;
}

class Player {
  constructor(x, y) {
    this.posX = x;
    this.posY = y;

    this.tail = [];

    this.faceToX = 1;
    this.faceToY = 0;

    this.headEl = playBoard.appendChild(document.createElement("div"));
    this.headEl.classList.add("head");

    this.animate();
  }

  addTail(x, y) {
    const newTailBlock = playBoard.appendChild(document.createElement("div"));
    newTailBlock.classList.add("tail");

    if (this.tail.length > 0) {
      const lastTailBlockObj = this.tail[0];
      x = lastTailBlockObj.x;
      y = lastTailBlockObj.y;
    }

    setBlockPosition(newTailBlock, x, y);

    this.tail.unshift({
      el: newTailBlock,
      x,
      y,
    });
  }

  facePlayer(x, y) {
    this.faceToX = x;
    this.faceToY = y;
  }

  animate() {
    const lastHeadPosX = this.posX;
    const lastHeadPosY = this.posY;

    this.posX = this.posX + this.faceToX;
    if (this.posX < 1) {
      this.posX = gridLimit;
    } else if (this.posX > gridLimit) {
      this.posX = 1;
    }

    this.posY = this.posY + this.faceToY;
    if (this.posY < 1) {
      this.posY = gridLimit;
    } else if (this.posY > gridLimit) {
      this.posY = 1;
    }

    setBlockPosition(this.headEl, this.posY, this.posX);

    if (this.tail.length > 0) {
      if (this.tail.length > 1) {
        //more than 1 tail block
        const lastTailBlock = this.tail.shift();
        setBlockPosition(lastTailBlock.el, lastHeadPosY, lastHeadPosX);
        lastTailBlock.x = lastHeadPosY;
        lastTailBlock.y = lastHeadPosX;
        this.tail.push(lastTailBlock);
      } else {
        // 1 tail block
        const tailBlock = this.tail[0];
        setBlockPosition(tailBlock.el, lastHeadPosY, lastHeadPosX);
        tailBlock.x = lastHeadPosY;
        tailBlock.y = lastHeadPosX;
      }
    }

    checkCollision(this.posX, this.posY);
  }
}

class Food {
  constructor(x, y) {
    this.posX = x;
    this.posY = y;

    this.el = playBoard.appendChild(document.createElement("div"));
    this.el.classList.add("food");

    this.el.style.gridArea = `${this.posY}/${this.posX}`;

    foodList.set(`${this.posX}/${this.posY}`, this);
  }

  static addRandomFood() {
    new Food(Math.floor(Math.random() * gridLimit) + 1, Math.floor(Math.random() * gridLimit) + 1);
  }
}

function checkCollision(x, y) {
  const coordsKey = `${x}/${y}`;

  //check food
  if (foodList.has(coordsKey)) {
    const food = foodList.get(coordsKey);
    food.el.remove();
    foodList.delete(coordsKey);
    console.log(`deleted food at ${coordsKey}`);

    player.addTail(y, x);

    Food.addRandomFood();

    addScore(1);
  }
}

const player = new Player(Math.floor(gridLimit / 2), Math.floor(gridLimit / 2));
Food.addRandomFood();

new Food(Math.floor(gridLimit / 2) + 4, Math.floor(gridLimit / 2));
new Food(Math.floor(gridLimit / 2) + 5, Math.floor(gridLimit / 2));

//handle controlls
window.addEventListener("keyup", (e) => {
  const { faceToX, faceToY } = player;
  if (e.key === "ArrowUp" && faceToY !== 1) {
    player.facePlayer(0, -1);
  } else if (e.key === "ArrowDown" && faceToY !== -1) {
    player.facePlayer(0, 1);
  } else if (e.key === "ArrowLeft" && faceToX !== 1) {
    player.facePlayer(-1, 0);
  } else if (e.key === "ArrowRight" && faceToY !== -1) {
    player.facePlayer(1, 0);
  }
});

//start player
player.animate();
setInterval(() => {
  player.animate();
}, 500);
