//Change direction
canvas.onmousemove = e => {
    var x1 = window.innerWidth / 2; //Center
    var y1 = window.innerHeight / 2; //Center
    var x2 = e.clientX;
    var y2 = e.clientY;
    var dx = x2 - x1;
    var dy = y2 - y1;
    var direction = Math.atan2(dy, dx)*(180/Math.PI) + 90;
    if (direction < 0) direction = direction + 360;
    direction = Math.floor(direction);
    playerAction("changeDirection", direction);
};

//Speed boost
canvas.oncontextmenu = e => {
    e.preventDefault();
    playerAction("speedBoost");
};

//Shooting
var shooting = false;
canvas.onmousedown = e => {
    if (e.button === 0) shooting = true;
};
canvas.onmouseup = e => {
    if (e.button === 0) shooting = false;
};
setInterval(() => {
    if (shooting) playerAction("shoot");
}, 100);

//Scroll for Zoom
canvas.onwheel = e => {
    if (e.deltaY < 0) {
        if (zoom < 1.5) zoom = (zoom * 10 + 1) / 10;
    } else {
        if (zoom > 0.6) zoom = (zoom * 10 - 1) / 10;
    }
};