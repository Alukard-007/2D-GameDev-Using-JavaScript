//collision detection

//between 2 rectangles
var rect1 = {x: 5, y: 5, width: 50, height: 50};
var rect2 = {x: 20, y: 10, width: 10, height: 10};

if (rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.width &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect1.y
) {
    //collision detected
} else {
    //no collision
};

//more better code
if (rect1.x > rect2.x + rect2.width ||
    rect1.x + rect1.width < rect2.width ||
    rect1.y > rect2.y + rect2.height ||
    rect1.y + rect1.height < rect1.y
) {
    //no collision
} else {
    //collision detected
};


//between 2 circles
//if the distance between the centres of 2 circles is less than the
//sum of both radii, then collision is true

//to calc distance we consider distance of centres as
//hypotenuse of a right angle triangle and calculate the 
//base and height of that RAT first

const circle1 = {x: 10, y: 10, radius: 300};
const circle2 = {x: 500, y: 500, radius: 150};

let base = circle2.x - circle1.x;
let height = circle2.y - circle1.y;

//calculating hypotenuse from Pythagoras Theorem :)
let distance = Math.sqrt(base*base + height*height);

let radiiSum = circle1.radius + circle2.radius ;

if (distance < radiiSum) {
    //collision detected
} else if (distance === radiiSum){
    //circles touch each other
} else {
    //no collision
};

