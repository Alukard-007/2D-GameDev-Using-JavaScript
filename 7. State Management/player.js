import { StandingLeft, StandingRight, SittingLeft, SittingRight, RunningLeft, RunningRight, JumpingLeft, JumpingRight, FallingLeft, FallingRight } from "./state.js";

export default class Player {
    constructor(gameWidth, gameHeight){
        this.gameHeight = gameHeight;
        this.gameWidth = gameWidth;
        this.states = [
            new StandingLeft(this), 
            new StandingRight(this), 
            new SittingLeft(this), 
            new SittingRight(this), 
            new RunningLeft(this), 
            new RunningRight(this), 
            new JumpingLeft(this), 
            new JumpingRight(this),
            new FallingLeft(this),
            new FallingRight(this)
        ]; //states here should have same index as declared in enum from state.js
        this.currentState = this.states[1];
        this.image = dog;
        this.imgWidth = 200;
        this.imgHeight = 181.83;
        this.x = this.gameWidth*0.5 - this.imgWidth*0.5;
        this.y = this.gameHeight - this.imgHeight;
        this.frameX = 0;
        this.maxFrame = 6;
        this.frameY = 0;
        this.speed = 0; //dirX
        this.vy = 0;   //dirY
        this.weight = 0.3;
        this.maxSpeed = 10;
        //delta time helper variables
        this.fps = 30;
        this.frameCounter = 0;
        this.frameInterval = 1000/this.fps; //no. of millisec each frame gets for display
    }
    draw(context, deltaTime){
        if (this.frameCounter > this.frameInterval) {
            this.frameCounter = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        } else {
            this.frameCounter += deltaTime;
        }
        
        context.drawImage(this.image, this.frameX * this.imgWidth, this.frameY * this.imgHeight, this.imgWidth, this.imgHeight, this.x, this.y, this.imgWidth, this.imgHeight);
    }
    update(input){
        this.currentState.handleInput(input);
        this.x += this.speed;
        this.y += this.vy;
        //horizontal boundaries
        if (this.x < 0) this.x = 0
        else if (this.x >= this.gameWidth - this.imgWidth) this.x = this.gameWidth - this.imgWidth;
        //vertical boundaries
        if (this.y < 0) this.y = 0;
        if (!this.onGround()) { //not standing on ground / above ground
            this.vy += this.weight;
        } else {
            //this.vy = 0;
            this.y = this.gameHeight - this.imgHeight;
        }
    }
    setState(state){
        this.currentState = this.states[state];
        this.currentState.enter();
    }
    onGround() {
        return this.y >= this.gameHeight - this.imgHeight;
    }
};