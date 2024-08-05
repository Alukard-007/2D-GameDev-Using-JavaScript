/**@type {HTMLCanvasElement} */

const canvas = document.getElementById('canvas01');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 500;
const CANVAS_HEIGHT = canvas.height = 700;
const canvasPosition = canvas.getBoundingClientRect();//returns obj having info of size and position of element
//console.log(canvasPosition);

//ctx.fillStyle = 'white';
//ctx.fillRect(50, 50, 100, 150);

const explosions = [];

class Explosion {
    constructor(x, y){
        this.xOG = x;
        this.yOG = y;
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.width = this.spriteWidth/2;
        this.height = this.spriteHeight/2;
        this.x = this.xOG - this.width/2;
        this.y = this.yOG - this.height/2;
        this.image = new Image();
        this.image.src = '../assets/collisions/boom.png';
        this.frame = 0//to jump horizontally from frames
        this.timer = 0;
        this.rotateAngle = Math.random() * 6.2;
        //adding sounds
        this.sound = new Audio();
        this.sound.src = '../assets/collisions/boom.wav';
    }
    update(){
        if (this.frame === 0) this.sound.play();
        this.timer++;
        if (this.timer % 6 === 0){
            this.frame++;
        }
    }
    draw(){
        ctx.save();
        ctx.translate(this.xOG, this.yOG);
        ctx.rotate(this.rotateAngle);
        //ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, 0 - this.width/2, 0 - this.height/2, this.width, this.height);
        ctx.restore();
    }
}


/*
window.addEventListener('click', function(e){
    //console.log(e);
    ctx.fillStyle = 'white';
    let width = 10;
    let height = 10;
    //ctx.fillRect(e.x, e.y, 10, 10); 
    //in the above code snippet, the coordinates are absolute to whole page and not canvas so we need to offset them relative to canvas position
    ctx.fillRect(e.x - canvasPosition.left - (0.5*width), e.y - canvasPosition.top - (0.5*height), width, height); // offset of (0.5*height) and same for width is for creating rect at centre of click
});*/

//similarly, we'll animate the explosions on clicks
window.addEventListener('click', function(e){
    explode(e);
});
/*
window.addEventListener('mousemove', function(e){
    explode(e);
});*/
//console.log(explosions)

function explode(e){
    let positionX = e.x - canvasPosition.left;
    let positionY = e.y - canvasPosition.top;
    explosions.push(new Explosion(positionX, positionY));
};

function animate(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    for (let i = 0; i < explosions.length; i++){
        explosions[i].update();
        explosions[i].draw();
        if(explosions[i].frames > 5){
            explosions.splice(i, 1); //splice(startIndex, noOfElementsToRemove)
            i--;
        }
    }
    requestAnimationFrame(animate);
}
animate();




//Note To Self
//the explosions array stores new explosion objects but 
//once after each object's animation
//sol added: delete explosion obj after its frame exceeds 5 










//TRIALS
/*
const e1 = new Explosion(30,30);

function animate(){
    e1.draw();
    requestAnimationFrame(animate);
}
animate();*/