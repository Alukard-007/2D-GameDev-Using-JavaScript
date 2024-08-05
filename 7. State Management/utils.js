//FOR UTILITIES FUNCTIONS
export function drawStatusText(context, input, player){
    context.font = '30px Helvetica';
    context.fillStyle = 'white';
    context.fillText("Last Input: " + input.lastKey, 20, 50);
    context.fillText("Active State: " + player.currentState.state, 512, 50);
};