/** @type {HTMLCanvasElement} */

import Player from "./player.js";
import inputHandler from "./input.js";
import {drawStatusText} from "./utils.js";

window.addEventListener('load', function(){ //till the assets are loaded, loading screen will appear
    
    const loadText = this.document.getElementById('loading');
    loadText.style.display = 'none';

    const canvas = document.getElementById('canvas01');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const player = new Player(canvas.width, canvas.height);
    const input = new inputHandler();

    let lastTime = 0;
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawStatusText(ctx, input, player);
        player.update(input.lastKey);
        player.draw(ctx, deltaTime);
        requestAnimationFrame(animate);
    }
    animate(0);




});


