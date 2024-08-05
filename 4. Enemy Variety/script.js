/** @type {HTMLCanvasElement} */

document.addEventListener('DOMContentLoaded', function(){

    const canvas = document.getElementById('canvas01');
    const ctx = canvas.getContext('2d');
    const CANVAS_WIDTH = canvas.width = 500;
    const CANVAS_HEIGHT = canvas.height = 700;

    class Game {
        constructor(ctx, CANVAS_WIDTH, CANVAS_HEIGHT){
            this.ctx = ctx;
            this.width = CANVAS_WIDTH;
            this.height = CANVAS_HEIGHT;

            this.enemies = [];
            this.enemyTypes = ['worm', 'ghost', 'spider'];

            this.#addNewEnemy();
            this.enemyInterval = 500;
            this.enemyTimer = 0;
            
        }
        update(deltaTime){
            if (this.enemyTimer > this.enemyInterval){
                this.#addNewEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
            this.enemies = this.enemies.filter(object => !object.markedForDeletion);
            this.enemies.forEach(object => object.update(deltaTime));
        }
        draw(){
            this.enemies.forEach(object => object.draw(this.ctx));
        }
        #addNewEnemy(){ //private class that can be only called from within the class
            const randomEnemy = this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];
            if (randomEnemy == 'worm') this.enemies.push(new Worm(this));
            else if (randomEnemy == 'ghost') this.enemies.push(new Ghost(this));
            else if (randomEnemy == 'spider') this.enemies.push(new Spider(this));
            
            
            //this.enemies.push(new Ghost(this));//sending whole obj to enemy so that it can refer all data and public func
            
            this.enemies = this.enemies.sort(function(a, b){
                return a.y - b.y;
            });
        }
    };

    class Enemy {
        constructor(gameObj){
            this.game = gameObj;
            this.markedForDeletion = false;

            this.frameX = 0;
            this.maxFrame = 5;
            this.frameTimer = 0;
            this.frameInterval = 100;
        }
        update(deltaTime){
            this.x -= this.dirX * deltaTime;
            if (this.x < 0 - this.width) this.markedForDeletion = true;
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX < this.maxFrame) this.frameX++
                else this.frameX = 0;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }
        }
        draw(ctx){
            ctx.drawImage(this.image, this.frameX * this.imgWidth, 0, this.imgWidth, this.imgHeight, this.x, this.y, this.width, this.height);
        }
    };

    class Worm extends Enemy {
        constructor(game){
            super(game); //super must be called before creating other member functions/ data members
            this.image = worm;
            this.imgWidth = 229;
            this.imgHeight = 171;

            this.width = this.imgWidth*0.5;
            this.height = this.imgHeight*0.5;
            this.x = this.game.width;
            this.y = (this.game.height - this.height);
            this.dirX = Math.random() * 0.1 + 0.1;
        }
    };

    class Ghost extends Enemy {
        constructor(game){
            super(game); //super must be called before creating other member functions/ data members
            this.image = ghost;
            this.imgWidth = 261;
            this.imgHeight = 209;

            this.width = this.imgWidth*0.5;
            this.height = this.imgHeight*0.5;
            this.x = this.game.width;
            this.y = Math.random() * (this.game.height) * 0.6; //ghosts to cover top 60% of screen
            this.dirX = Math.random() * 0.2 + 0.1;
            this.angle = 0;
            this.curve = Math.random() * 2;

            this.frame = 0;
            this.maxFrame = 4;
        }
        update(deltaTime){
            super.update(deltaTime);
            this.y += Math.sin(this.angle) * this.curve;
            this.angle += 0.04;
        }
        draw(ctx){
            ctx.save();
            ctx.globalAlpha = 0.7;
            super.draw(ctx);
            ctx.restore();
        }
    };

    class Spider extends Enemy {
        constructor(game){
            super(game); //super must be called before creating other member functions/ data members
            this.image = spider;
            this.imgWidth = 310;
            this.imgHeight = 175;

            this.width = this.imgWidth*0.5;
            this.height = this.imgHeight*0.5;
            this.x = Math.random() * (this.game.width);
            this.y = (0 - this.height);
            this.dirX = 0;
            this.dirY = Math.random() * 0.1 + 0.1;
            this.maxdirY = Math.random() * this.game.height;

            this.frame = 0;
            this.maxFrame = 4;
        }
        update(deltaTime){
            super.update(deltaTime);
            this.y += this.dirY * deltaTime;
            if (this.y > this.maxdirY) this.dirY *= -1;
            if (this.y < 0 - (2*this.height)) this.markedForDeletion = true;
        }
        draw(ctx){
            ctx.beginPath();
            ctx.moveTo(this.x + this.width/2, 0);
            ctx.lineTo(this.x + this.width/2, this.y + 50);
            ctx.stroke();
            super.draw(ctx);
        }
    };

    const game = new Game(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);
    let lastTime = 1;
    function animate(timestamp){
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        game.update(deltaTime);
        game.draw();
        
        requestAnimationFrame(animate);
    }
    animate(0);

});