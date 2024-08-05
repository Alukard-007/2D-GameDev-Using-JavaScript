const canvas = document.getElementById('canvas01');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 800;
const CANVAS_HEIGHT = canvas.height = 450;

let gameSpeed = 5; 

//loading the background layers
const bg1 = new Image();
bg1.src = 'MorningLayer6.png';
const bg2 = new Image();
bg2.src = 'MorningLayer5.png';
const bg3 = new Image();
bg3.src = 'MorningLayer4.png';
const bg4 = new Image();
bg4.src = 'MorningLayer3.png';
const bg5 = new Image();
bg5.src = 'MorningLayer2.png';
const bg6 = new Image();
bg6.src = 'MorningLayer1.png';

let x = 0;
let x2 = 800;

function animation(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(bg3, x, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(bg3, x2, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    if (x < -800) x = 800 + x2 - gameSpeed;
    else x -= gameSpeed;
    if (x2 < -800) x2 = 800 + x - gameSpeed;
    else x2 -= gameSpeed;
    
    requestAnimationFrame(animation);
}
//animation();

class layer {
    constructor(image, speedModifier){
        this.x = 0;
        this.y = 0;
        this.width = 800;
        this.height = 450;

        this.x2 = this.width;
        this.image = image;
        this.speedModifier = speedModifier;
        this.speed = gameSpeed * this.speedModifier;
    }
    update(){
        this.speed = gameSpeed * this.speedModifier;
        if(this.x <= -this.width){
            this.x = this.width + this.x2 - this.speed;
        }
        if(this.x2 <= -this.width){
            this.x2 = this.width + this.x - this.speed;
        }
        this.x = Math.floor(this.x - this.speed);
        this.x2 = Math.floor(this.x2 - this.speed);
    }
    draw(){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x2, this.y, this.width, this.height);
    }
};

const layer1 = new layer(bg1, 0.2);
const layer2 = new layer(bg2, 0.2);
const layer3 = new layer(bg3, 0.4);
const layer4 = new layer(bg4, 0.6);
const layer5 = new layer(bg5, 0.8);
const layer6 = new layer(bg6, 1);

const allLayers = [layer1, layer2, layer3, layer4, layer5, layer6];

function animate(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    /*
    layer1.update();
    layer1.draw();
    layer2.update();
    layer2.draw();
    layer3.update();
    layer3.draw();
    layer4.update();
    layer4.draw();
    layer5.update();
    layer5.draw();
    layer6.update();
    layer6.draw();
    we shall simplify these lines*/

    allLayers.forEach(object => {
        object.update();
        object.draw();
    });
    requestAnimationFrame(animate);
}


//connecting slider component
//first we connect element that displays game speed
const showGameSpeed = document.getElementById('showGameSpeed');
showGameSpeed.innerHTML = gameSpeed;

const slider = document.getElementById('slider');
slider.addEventListener('change',function(e){
    gameSpeed = e.target.value; //another way: slider.value = gameSpeed;
    showGameSpeed.innerHTML = gameSpeed;
});


animate();