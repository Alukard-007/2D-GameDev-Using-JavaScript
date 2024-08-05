/**@type {HTMLCanvasElement} */

const canvas = document.getElementById('canvas01');
const ctx = canvas.getContext('2d');
//console.log(canvas.width);
const CANVAS_HEIGHT = canvas.height = 1000;
const CANVAS_WIDTH = canvas.width = 500;
//console.log(canvas.width);

//lets create a temporary enemy object
/*
const enemy1 = {
    x: 0,
    y: 0,
    width: 200,
    height: 200,
};*/

function animation(){
    ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    ctx.fillRect(enemy1.x, enemy1.y, enemy1.width, enemy1.height);
    requestAnimationFrame(animation);
    //enemy1.x++;
}
//animation();

const enemyImg = new Image();
enemyImg.src = "../assets/NPCs/enemy3.png";
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
        this.enemyImgWidth = 218;
        this.enemyImgHeight = 177;
        //selecting drawing size on canvas
        this.width = this.enemyImgWidth/2.5;
        this.height = this.enemyImgHeight/2.5;

        //creating custom flap speed
        this.flapSpeed = Math.floor(Math.random() * 3 + 1);

        //modifying width, height so bots never leave 
        this.x = Math.random() * (CANVAS_WIDTH - this.width); //random position initialization
        this.y = Math.random() * (CANVAS_HEIGHT - this.height);

        //for sine wave movement
        this.angle = 0;
        //this.angle = Math.random() * 2;
        this.angleSpeed = Math.random() * 2 + 0.5;
        this.curveFactor = Math.random() * 200 + 50;
    }
    update(){
        //normal movement
        //this.x += this.speed;
        //this.y += this.speed;

        //wiggle movement
        //this.x -= this.speed;
        //this.y += Math.random() * 5 - 2.5;

        //endless movement from l to r
        if(this.x + this.width < 0) this.x = CANVAS_WIDTH;

        //wavy movement ==> sine wave like 
        //this.y += this.curveFactor * Math.sin(this.angle); //to make the curves more prominent, scale it by a multiplied factor (here, curveFactor)
        //this.angle += this.angleSpeed;

        //for horizontal direction randomness
        this.x = this.curveFactor * Math.sin(this.angle * Math.PI/90) + (CANVAS_WIDTH/2 - this.width/2);
        //this.angle += this.angleSpeed;


        //implementing cosine also in y
        // if we divide PI by same number in both x and y updations, we get even circular movement
        //but to get unique movements, keep them diff
        this.y = this.curveFactor * Math.cos(this.angle * Math.PI/500) + (CANVAS_HEIGHT/2 - this.height/2);
        this.angle += this.angleSpeed;




        //////////////////////////////////////////
        //sprite animation-technique 1
        /*
        this.gameFPS ++;
        this.position = Math.floor(this.gameFPS/this.frameSmooth) % 6;
        this.frameX = this.enemyImgWidth * this.position;*/

        //technique 2
        //this.gameFPS++
        //this.gameFPS >4 ? this.gameFPS = 0: this.gameFPS++;
        //this.frameX = this.enemyImgWidth * Math.floor(this.gameFPS/this.frameSmooth);

        
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

const enemy1 = new Enemy();
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
    gameFrame++;
    requestAnimationFrame(animate);
}
animate();

//now that basic movement have been structured
//lets focus on adding images of enemies


