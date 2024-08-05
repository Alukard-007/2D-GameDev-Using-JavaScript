/**@type {HTMLCanvasElement} */

const canvas = document.getElementById('canvas01');
const ctx = canvas.getContext('2d');

const CANVAS_HEIGHT = canvas.height = 1000;
const CANVAS_WIDTH = canvas.width = 500;

const enemyImg = new Image();
enemyImg.src = "../assets/NPCs/enemy4.png";
let gameFrame = 0;

class Enemy {
    constructor(){
        this.speed = Math.random() * 4 + 1;
        this.gameFPS = 0;
        this.frameSmooth = 3;
        this.position = Math.floor(this.gameFPS / this.frameSmooth) % 6;

        this.frameX = 0;
        this.frameY = 0;
        this.enemyImgWidth = 213;
        this.enemyImgHeight = 213;
        this.width = this.enemyImgWidth / 2.5;
        this.height = this.enemyImgHeight / 2.5;

        this.flapSpeed = Math.floor(Math.random() * 3 + 1);

        this.x = Math.random() * (CANVAS_WIDTH - this.width);
        this.y = Math.random() * (CANVAS_HEIGHT - this.height);

        this.newX = Math.random() * (CANVAS_WIDTH - this.width);
        this.newY = Math.random() * (CANVAS_HEIGHT - this.height);

        this.interval = Math.floor(Math.random() * 200 + 50);
    }

    update(){
        if(gameFrame % this.interval === 0) {
            this.newX = Math.random() * (CANVAS_WIDTH - this.width);
            this.newY = Math.random() * (CANVAS_HEIGHT - this.height);
        }

        let dx = this.x - this.newX;
        let dy = this.y - this.newY;

        this.x -= dx / 20;
        this.y -= dy / 20;

        if (this.x + this.width < 0) this.x = CANVAS_WIDTH;

        if (gameFrame % this.flapSpeed === 0) {
            this.gameFPS++;
            if (this.gameFPS > 4) this.gameFPS = 0;
            this.frameX = this.enemyImgWidth * this.gameFPS;
        }
    }

    draw(){
        ctx.drawImage(enemyImg, this.frameX, this.frameY, this.enemyImgWidth, this.enemyImgHeight, this.x, this.y, this.width, this.height);
    }
}

const numberOfEnemies = 30;
const enemiesArray = [];

for(let j = 0; j < numberOfEnemies; j++){
    enemiesArray.push(new Enemy());
}

function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    enemiesArray.forEach(enemy => {
        enemy.draw();
        enemy.update();
    });

    gameFrame++;
    requestAnimationFrame(animate);
}
animate();

















/*
const canvas = document.getElementById('canvas01');
const ctx = canvas.getContext('2d');
//console.log(canvas.width);
const CANVAS_HEIGHT = canvas.height = 1000;
const CANVAS_WIDTH = canvas.width = 500;



const enemyImg = new Image();
enemyImg.src = "../assets/NPCs/enemy4.png";
let gameFrame = 0;
//lets generate enemy blueprints
class Enemy {
    constructor(){
        //this.x = Math.random() * CANVAS_WIDTH; //random position initialization
        //this.y = Math.random() * CANVAS_HEIGHT;
        
        this.speed = Math.random() * 4 + 1; //random speed bw -2 and +2
        
        this.gameFPS = 0;
        this.frameSmooth = 3;
        this.position = Math.floor(this.gameFPS/this.frameSmooth) % 6;

        this.frameX = 0;//coordinates from src img file
        this.frameY = 0;//coordinates from src img file
        //crop single sprite frame from sheet
        this.enemyImgWidth = 213;
        this.enemyImgHeight = 213;
        //selecting drawing size on canvas
        this.width = this.enemyImgWidth/2.5;
        this.height = this.enemyImgHeight/2.5;

        //creating custom flap speed
        this.flapSpeed = Math.floor(Math.random() * 3 + 1);

        //modifying width, height so bots never leave 
        this.x = Math.random() * (CANVAS_WIDTH - this.width); //random position initialization
        this.y = Math.random() * (CANVAS_HEIGHT - this.height);
        
        this.newX = Math.random() * (CANVAS_WIDTH - this.width); //random position initialization
        this.newY = Math.random() * (CANVAS_HEIGHT - this.height);
    
        this.interval = Math.floor(Math.random() * 200 + 50);
    }   

    update(){
        if(gameFrame % this.interval === 0) {
            this.newX = Math.random() * (CANVAS_WIDTH - this.width); //random position initialization
            this.newY = Math.random() * (CANVAS_HEIGHT - this.height);
        }

        //distance variables
        let dx = this.x - this.newX;
        let dy = this.y - this.newY;

        this.x -= dx/20;
        this.y -= dy/20;

        //endless movement from l to r
        if(this.x + this.width < 0) this.x = CANVAS_WIDTH;

        //animating sprites
        if (gameFrame % this.flapSpeed === 0) {
            this.gameFPS++;
            this.gameFPS > 4 ? this.gameFPS = 0: this.gameFPS++;
            this.frameX = this.enemyImgWidth * this.gameFPS;
        }
    }
    draw(){
        //ctx.fillRect(this.x, this.y, this.width, this.height);
        //ctx.drawImage(enemyImg, this.x, this.y);
        ctx.drawImage(enemyImg, this.frameX, this.frameY, this.enemyImgWidth, this.enemyImgHeight, this.x, this.y, this.width, this.height);
    }
};


const numberOfEnemies = 30; //count of all enemies
const enemiesArray = []; //store all enemy objects

for(let j = 0; j < numberOfEnemies; j++){
    enemiesArray.push(new Enemy());
}
//console.log(enemiesArray);



function animate() {
    ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    
    enemiesArray.forEach(enemy => {
        enemy.draw();
        enemy.update();
    });

    /*
    ctx.drawImage(enemyImg, frameX, frameY, enemyImgWidth, enemyImgHeight, 0, 0, enemyImgWidth, enemyImgHeight);
    let position = Math.floor(gameFPS/frameSmooth) % 6;
    frameX = enemyImgWidth * position;
    gameFPS++;*/
    /*
    gameFrame++;
    requestAnimationFrame(animate);
}
animate();

//now that basic movement have been structured
//lets focus on adding images of enemies


*/