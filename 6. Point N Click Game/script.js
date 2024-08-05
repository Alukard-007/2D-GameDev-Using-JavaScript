/**@type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas01');
const ctx = canvas.getContext('2d');
CANVAS_WIDTH = canvas.width = window.innerWidth;
CANVAS_HEIGHT = canvas.height = window.innerHeight;

const collisionCanvas = document.getElementById('collisionDetect');
const ctx2 = collisionCanvas.getContext('2d');
CANVAS2_WIDTH = collisionCanvas.width = window.innerWidth;
CANVAS2_HEIGHT = collisionCanvas.height = window.innerHeight;

let ravens = [];
let score = 0;
let gameOver = false;
ctx.font = '50px Impact';
//time management for frames
let timeToNextRaven = 0;
let ravenInterval = 500; //value in milisec
let lastTime = 0;

class Raven {
    constructor(){
        this.width = 100;
        this.height = 50;
        this.x = CANVAS_WIDTH;
        this.y = Math.random() * (CANVAS_HEIGHT - this.height);
        this.directionX = Math.random() * 5 + 3;
        this.directionY = Math.random() * 5 - 2.5;
        this.markedForDeletion = false; //boolean for discarding ravens that have left the screen to avoid endlessly increasing ravens arr

        this.image = new Image();
        //this.image.src = '../assets/pointNclick/raven.png';
        this.image.src = "./raven.png";
        this.spriteWidth = 271;
        this.spriteHeight = 194;
        this.sizeModifier = Math.random() * 0.6 + 0.4;
        this.imgWidth = this.spriteWidth * this.sizeModifier;
        this.imgHeight = this.spriteHeight * this.sizeModifier;
        this.frame = 0;
        this.maxFrame = 4;
        this.timeSinceFlap = 0;
        this.flapInterval = Math.random() + 50 + 50;

        //trials for colour detection
        this.randomColour = [Math.floor(Math.random()*255), Math.floor(Math.random()*255), Math.floor(Math.random()*255)];
        this.colour = 'rgb(' + this.randomColour[0] + ',' + this.randomColour[1] + ',' + this.randomColour[2] + ')';

        //particle effect
        this.hasTrail = Math.random() > 0.5; //50% of ravens to have particles
    }
    update(deltaTime){
        this.x -= this.directionX;

        if (this.y < 0 || this.y > CANVAS_HEIGHT - this.imgHeight){
            this.directionY = this.directionY * (-1);
        }

        this.y += this.directionY;
        if (this.x < 0 - (this.imgWidth)) this.markedForDeletion = true;
        
        this.timeSinceFlap += deltaTime;
        if (this.timeSinceFlap > this.flapInterval) {
            if (this.frame > this.maxFrame) this.frame = 0;
            else this.frame++;
            this.timeSinceFlap = 0;
            if(this.hasTrail){
                for(let i = 0; i < 5; i++){
                    particles.push(new Particles(this.x, this.y, this.imgWidth, this.colour));
                }
            }
        };

        //game over!
        if (this.x < 0 - this.width) gameOver = true;
    }
    draw(){
        ctx2.fillStyle = this.colour;
        ctx2.fillRect(this.x, this.y, this.imgWidth, this.imgHeight);
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.imgWidth, this.imgHeight);
    }
}

let explosions = [];

class Explosion {
    constructor(x, y, size){
        this.image = new Image;
        this.image.src = './boom.png';
        this.spriteWidth = 200;
        this.spriteHeight = 179;

        this.x = x;
        this.y = y;
        this.size = size;
        this.markedForDeletion = false;

        this.frame = 0;
        this.timeSinceLastFrame = 0;
        this.frameInterval = 75;

        this.sound = new Audio();
        this.sound.src = './boom.wav';
    }
    update(deltaTime){
        if (this.frame === 0) this.sound.play();
        this.timeSinceLastFrame += deltaTime;
        if (this.timeSinceLastFrame > this.frameInterval) {
            this.frame++;
            if (this.frame > 4) this.markedForDeletion = true;
            this.timeSinceLastFrame = 0;
        }
    }
    draw(){
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y - this.size/4, this.size, this.size);
    }
};

let particles = [];

class Particles {
    constructor(x, y, size, colour){
        this.size = size;
        this.x = x + this.size/2 + Math.random() * 50 - 25;
        this.y = y + this.size/3 + Math.random() * 50 - 25;
        this.colour = colour;

        this.radius = Math.random() * this.size/10;
        this.maxRadius = Math.random() * 20 + 35;
        this.markedForDeletion = false;
        this.speedX = Math.random() * 1 + 0.5;
    }
    update(){
        this.x += this.speedX;
        this.radius += 0.5;
        if (this.radius > this.maxRadius - 5) this.markedForDeletion = true;
    }
    draw(){
        ctx.save();
        ctx.globalAlpha = 1 - this.radius/this.maxRadius;
        ctx.beginPath();
        ctx.fillStyle = this.colour;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); // last 2 arguments 0, Math.PI*2 denote start and end angles
        ctx.fill();
        ctx.restore(); // use save() and restore() so as to apply globalAlhpa() property to only this section
    }
};

function drawScore(){
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 20, 60);
    ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + score, 24, 64);
}

function drawGameOver(){
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText('GAME OVER, your score is ' + score, canvas.width/2, canvas.height/2);
    ctx.fillStyle = 'white';
    ctx.fillText('GAME OVER, your score is ' + score, canvas.width/2 + 5, canvas.height/2 + 5);
};

window.addEventListener('click', function(e){
    //collision detection based on colour
    const detectPixelColour = ctx2.getImageData(e.x, e.y, 1, 1);//last 2 arguments 1,1 denote area of scan
    console.log(detectPixelColour);
    const pixelColour = detectPixelColour.data;
    ravens.forEach(object => {
        if (object.randomColour[0] === pixelColour[0] &&
            object.randomColour[1] === pixelColour[1] &&
            object.randomColour[2] === pixelColour[2]
        ){
            object.markedForDeletion = true;
            score++;
            explosions.push(new Explosion(object.x, object.y, object.imgWidth));
        }
    })
})

function animate(timestamp){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx2.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    timeToNextRaven += deltaTime;
    if (timeToNextRaven > ravenInterval){
        ravens.push(new Raven());
        timeToNextRaven = 0;
        ravens.sort(function(a, b){
            return a.imgWidth - b.imgWidth;
        });//create correct sense of depth in layers
    };
    //[] -> array literal
    //... -> spread operator
    //above both combined helps us to expand already existing array
    [...particles, ...ravens, ...explosions].forEach(object => object.update(deltaTime));//object denotes iterable; each element in arr
    [...particles, ...ravens, ...explosions].forEach(object => object.draw());
    //why expand array?
    //we can expand several other arrays into one 
    //and have common update and draw function calls at the same time
    //note that bottom most layer corresponds to first array expanded in this array and so on
    // #CleanCode

    //deleting passed ravens
    ravens = ravens.filter(object => !object.markedForDeletion); //since here we're re-assigning the ravens arr, it should not be a const
    explosions = explosions.filter(object => !object.markedForDeletion);
    particles = particles.filter(object => !object.markedForDeletion);
    drawScore();
    if (!gameOver) requestAnimationFrame(animate);
    else drawGameOver();
}
animate(0);//sending 0 since timestamp value send by requestAnimationFrame and thus for the first run, timestamp is undefined


//consider computer's capability to serve frames