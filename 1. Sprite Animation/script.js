const canvas = document.getElementById('canvas01');
const context = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

//adding sprite sheet
const playerImg = new Image();
playerImg.src = '../assets/sprites/shadow_dog.png';

//sprite sheet dimensions
const spriteWidth = 575; //whole sheet width(6876) /no. of columns(12)
const spriteHeight = 523;

let frameX = 0;
let frameY = 0;

let gameFPS = 0;
let frameSmooth = 4;

function animation(){
    context.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    //context.fillRect(50,50,100,100);

    //context.drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh);
    context.drawImage(playerImg,frameX*spriteWidth,frameY*spriteHeight,spriteWidth,spriteHeight,0,0, spriteWidth,spriteHeight);
    //change in sx --> complete current animation frame by frame
    //change in sy --> jump to another animation

    //jump animation
    if (gameFPS % frameSmooth == 0) {
        if (frameX < 6) frameX++;
        else frameX = 0;
    }
    
    gameFPS++;
    requestAnimationFrame(animation);
};


//array for different animations data
const spriteAnims = [];
const animStates = [
    {
        name: "idle",
        frames: 7,
    },
    {
        name: "jump",
        frames: 7,
    },
    {
        name: "fall",
        frames: 7,
    },
    {
        name: "run",
        frames: 9,
    },
    {
        name: "dizzy",
        frames: 11,
    },
    {
        name: "sit",
        frames: 5,
    },
    {
        name: "roll",
        frames: 7,
    },
    {
        name: "bite",
        frames: 7,
    },
    {
        name: "ko",
        frames: 12,
    },
    {
        name: "getHit",
        frames: 4,
    }
];

animStates.forEach((state, index) => {
    let frames = {
        loc: [],
    }
    for(let j = 0; j < state.frames; j++){
        let positionX = j * spriteWidth;
        let positionY = index * spriteHeight;
        frames.loc.push({x: positionX, y: positionY});
    }
    spriteAnims[state.name] = frames;
});

function animate(){
    context.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    //context.fillRect(50,50,100,100);

    let position = Math.floor(gameFPS/frameSmooth) % spriteAnims[playerState].loc.length;
    let frameX = spriteWidth * position;
    let frameY = spriteAnims[playerState].loc[position].y;
    //context.drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh);
    context.drawImage(playerImg,frameX,frameY,spriteWidth,spriteHeight,0,0, spriteWidth,spriteHeight);
    //change in sx --> complete current animation frame by frame
    //change in sy --> jump to another animation

    
    
    gameFPS++;
    requestAnimationFrame(animate);
};

//connecting with dropdown component
let playerState = "idle";
const dropDown = document.getElementById('animations');
dropDown.addEventListener('change',function(e){
    playerState = e.target.value;
});

animate();

