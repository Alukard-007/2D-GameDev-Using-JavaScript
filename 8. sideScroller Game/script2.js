/** @type {HTMLCanvasElement} */

window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas01');
    const ctx = canvas.getContext('2d');
    canvas.width = 1400;
    canvas.height = 720;

    let enemies = [];
    let score = 0;
    let gameOver = false;

    //to handle keyboard inputs
    class InputHandler { //will contain event listeners for the game
        constructor() {
            //keep track of multiple key presses
            this.keys = []; //add/remove keys as they are being pressed/released
            this.touchY = ''; //store initial touch start vertical coordinate
            this.touchThreshold = 30; // for listening actual swipes and not just short taps
            //thus, start and end touch points should be atleast 30 pixels apart for swipe event

            window.addEventListener('keydown', e => {
                if ((   e.key === 'ArrowDown' || 
                        e.key === 'ArrowUp'   ||
                        e.key === 'ArrowLeft' ||
                        e.key === 'ArrowRight' )
                        && this.keys.indexOf(e.key) === -1) {
                    this.keys.push(e.key);
                } else if (e.key === 'Enter' && gameOver) {
                    restartGame();
                }
            });

            window.addEventListener('keyup', e => {
                if (    e.key === 'ArrowDown' || 
                        e.key === 'ArrowUp'   ||
                        e.key === 'ArrowLeft' ||
                        e.key === 'ArrowRight' ) {
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                };
            });

            window.addEventListener('touchstart', e => {
                this.touchY = e.changedTouches[0].pageY;
            });

            window.addEventListener('touchmove', e => {
                const swipeDistance = e.changedTouches[0].pageY - this.touchY;
                if (swipeDistance < - this.touchThreshold && this.keys.indexOf('SwipeUp') === -1) this.keys.push('SwipeUp');
                else if (swipeDistance > this.touchThreshold && this.keys.indexOf('SwipeDown') === -1) {
                    this.keys.push('SwipeDown');
                    if (gameOver) restartGame();
                }
            });

            window.addEventListener('touchend', e => {
                //console.log(this.keys);
                this.keys.splice(this.keys.indexOf('SwipeUp'), 1);
                this.keys.splice(this.keys.indexOf('SwipeDown'), 1);
            });
        }
    };

    class Player {
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight - 15;
            this.image = player;
            this.imgWidth = 200;
            this.imgHeight = 200;
            this.x = 100;
            this.y = gameHeight - this.imgHeight;
            
            this.frameX = 0;
            this.maxFrame = 8;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000/this.fps;
            this.frameY = 0;
            
            this.speed = 0;
            this.dirY = 0;
            this.weight = 1;
        }
        restart(){
            this.x = 100;
            this.y = this.gameHeight - this.imgHeight;
            this.maxFrame = 8;
            this.frameY = 0;

        }
        update(input, deltaTime, enemies){
            //collision detetcion
            enemies.forEach(enemy => {
                const base = (this.x + (this.imgWidth/2)) - (enemy.x + ((enemy.imgWidth/2)-20));
                const height = (this.y + ((this.imgHeight/2)+20)) - (enemy.y + (enemy.imgHeight/2));
                const distance = Math.sqrt(base*base + height*height);
                const radius01 = this.imgWidth/3;
                const radius02 = enemy.imgWidth/3;
                if (distance <= radius01 + radius02){
                    gameOver = true;
                }
            })

            //sprite animations
            if (this.frameTimer > this.frameInterval){
                this.frameTimer = 0;
                if (this.frameX >= this.maxFrame){
                    this.frameX = 0;
                } else {
                    this.frameX++;
                }
            } else {
                this.frameTimer += deltaTime;
            }
            
            //key listens
            if (input.keys.indexOf('ArrowRight') != -1) {
                this.speed = 5;
            } 
            else if (input.keys.indexOf('ArrowLeft') != -1) {
                this.speed = -5;
            }
            else if ((input.keys.indexOf('ArrowUp') != -1 || input.keys.indexOf('SwipeUp') != -1) && this.onGround()) {
                this.dirY -= 30;
            }
            else {
                this.speed = 0;
            };

            //horizontal movement
            this.x += this.speed;
            //setting boundaries
            if (this.x < 0) this.x = 0;
            else if (this.x + this.imgHeight > this.gameWidth) this.x = this.gameWidth - this.imgWidth;

            //vertical movement
            this.y += this.dirY;
            //gravity check
            if(!this.onGround()) {
                this.dirY += this.weight;
                this.frameY = 1;
                this.maxFrame = 5;
            } else {
                this.dirY = 0;
                this.frameY = 0;
                this.maxFrame = 8;
            }
            //setting vertical boundaries
            if (this.y > this.gameHeight - this.imgHeight) this.y = this.gameHeight - this.imgHeight;
            
        }
        draw(context){
            /*          
            context.strokeStyle = 'white';
            context.strokeRect(this.x, this.y, this.imgWidth, this.imgHeight);
            context.beginPath();
            context.arc(this.x + this.imgWidth/2, this.y + this.imgHeight/2 + 20, this.imgWidth/3, 0, Math.PI * 2);
            context.stroke();
            */
            context.drawImage(this.image, this.frameX * this.imgWidth, this.frameY * this.imgHeight, this.imgWidth, this.imgHeight, this.x, this.y, this.imgWidth, this.imgHeight);
        }
        onGround(){
            //return this.y + this.imgHeight === this.gameHeight;
            return this.y >= this.gameHeight - this.imgHeight;
        }
    };

    class Background {
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = bg;
            this.imgWidth = 2400;
            this.imgHeight = 720;
            this.x = 0;
            this.y = 0;
            this.x2 = this.imgWidth;
            this.speed = 7;
        }
        restart(){
            this.x = 0;
        }
        draw(context){
            context.drawImage(bg,this.x, this.y, this.imgWidth, this.imgHeight);
            context.drawImage(bg,this.x + this.imgWidth - this.speed, this.y, this.imgWidth, this.imgHeight);
        }
        update(){
            this.x -= this.speed;
            if (this.x < 0 - this.imgWidth) this.x = 0;
        }
    };

    class Enemy {
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = enemy;
            this.imgWidth = 160;
            this.imgHeight = 119;
            this.x = this.gameWidth;
            this.y = this.gameHeight - this.imgHeight - 18;
            this.frameX = 0;
            this.maxFrame = 5;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000/this.fps;
            this.speed = Math.random() * 7 + 8;
            this.markedForDeletion = false;
        }
        draw(context){
            /*
            context.strokeStyle = 'white';
            context.strokeRect(this.x, this.y, this.imgWidth, this.imgHeight);
            context.beginPath();
            context.arc(this.x + this.imgWidth/2 - 20, this.y + this.imgHeight/2, this.imgWidth/3, 0, Math.PI * 2);
            context.stroke();
            */
            context.drawImage(this.image, this.frameX * this.imgWidth, 0, this.imgWidth, this.imgHeight, this.x, this.y, this.imgWidth, this.imgHeight);
        }
        update(deltaTime){
            if (this.frameTimer > this.frameInterval){
                this.frameTimer = 0
                if (this.frameX >= this.maxFrame){
                    this.frameX = 0;
                } else {
                    this.frameX++;
                }
            } else {
                this.frameTimer += deltaTime;
            }
        
            this.x -= this.speed;

            if (this.x < 0 - this.imgWidth) {
                this.markedForDeletion = true;
                score++;
            };
        }
    };

    let enemyTimer = 0;
    let enemyInterval = 1000 * 2; //2 milli seconds
    //let randomEnemyInterval = Math.round() * 1000 + 500;

    function handleEnemies(deltaTime) {
        if(enemyTimer > enemyInterval + (Math.random() * 1000 + 500)) {
            // /console.log(Math.random() * 3000 + 100, enemyTimer);
            enemies.push(new Enemy(canvas.width, canvas.height));
            console.log(enemies);
            enemyTimer = 0;
        } else {
            enemyTimer += deltaTime;
        }
        enemies = enemies.filter(object => !object.markedForDeletion);
        enemies.forEach(object => {
            object.draw(ctx);
            object.update(deltaTime);
        });
    };

    function displayStatusText(context) {
        context.textAlign = 'left';
        context.fillStyle = 'black';
        context.font = '40px Helvetica';
        context.fillText('Score: ' + score, 20, 50);

        if (gameOver) {
            context.textAlign = 'center';
            context.fillStyle = 'black';
            context.fillText('GAME OVER', canvas.width * 0.5, 135);
            context.fillText('Press Enter or Swipe Down To Restart', canvas.width * 0.5, 172);
        };
    };

    function restartGame(){
        enemies = [];
        score = 0;
        gameOver = false;

        p1.restart();
        bg1.restart();
        animate(0);
    };

    function toggleFullScreen(){
        console.log(document.fullscreenElement);
        if(!document.fullscreenElement) {
            canvas.requestFullscreen().then().catch(err => {
                alert(`Error! Cant Enable Fullscreen Mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };
    const fullScreenButton = document.getElementById('fullScreenButton');
    //fullScreenButton.addEventListener('click', toggleFullScreen());

    const input = new InputHandler();
    const p1 = new Player(canvas.width, canvas.height);
    const bg1 = new Background(canvas.width, canvas.height);
    
    let lastTime = 0;
    function animate(timestamp) {
        let deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        bg1.draw(ctx);
        bg1.update();
        p1.draw(ctx);
        p1.update(input, deltaTime, enemies);
        handleEnemies(deltaTime);
        displayStatusText(ctx);
        if (!gameOver) requestAnimationFrame(animate);
    };
    animate(0);
})