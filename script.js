// get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// load ninja images
const ninjaImages = {
    still: new Image(),
    right: [],
    left: [],
}
// set source for each image
ninjaImages.still.src = 'ninja-animations/ninja-still.png';
for (let i = 1; i < 5; i++) {
    // loads right animations onto right array
    const rightImg = new Image();
    rightImg.src = `ninja-animations/ninja-right${i}.png`;
    ninjaImages.right.push(rightImg);

    const leftImg = new Image();
    leftImg.src = `ninja-animations/ninja-left${i}.png`;
    ninjaImages.left.push(leftImg);

}

// game properties
const gameProperties = {
    gravity: 9.8
}
// ninja properties
const ninja = {
    x: 150, // Initial x
    y: canvas.height - 60, // Initial y
    width: 50,
    height: 50,
    //movement
    speed: 5, // movement speed
    canJump: true,
    jumpStart: 0,
    jumpHeight: 150, // maximum height of the jump
    jumpSpeed: 10, // speed of the jump
    jumping: false, // jumping state
    direction: 'still', // initial direction
    movingLeft: false,
    movingRight: false
}


// game environment properties
const gameEnvironment = {
    floorY: canvas.height-10,
    floorHeight: 10,
    scrollSpeed: 3
}

const platform = {
    x: 500,
    y: 310,
    width: 200,
    height: 1
}
// keyboard movement
document.addEventListener('keydown', (event) => {

    if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
        ninja.movingLeft = true;
        ninja.direction = 'left'; // Update direction when moving left
    } else if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
        ninja.movingRight = true;
        ninja.direction = 'right'; // Update direction when moving right
    } else if ((event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W' || event.key === ' ') && ninja.canJump) {
        ninja.jumping = true;
        ninja.jumpStart = ninja.y;
        ninja.canJump = false;
    }

});

// when key released
document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
        ninja.movingLeft = false;
    } else if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
        ninja.movingRight = false;
    }
});

function drawPlatform() {
    ctx.fillStyle = 'brown';
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
}

function collisions() {
    ninja.hCenter = ninja.x + (ninja.width / 2);
    ninja.feet = ninja.y + ninja.height;
    console.log("ninja center:", ninja.hCenter, "ninja feet:", ninja.feet);
    // left/right bounds
    if (ninja.x < 0) {
        ninja.x = 0;
    } else if (ninja.x + ninja.width > canvas.width) {
        ninja.x = canvas.width - ninja.width;
    }


    // down bounds
    if (ninja.feet >= gameEnvironment.floorY) { // Ensure ninja cannot go below the floor
        ninja.y = gameEnvironment.floorY - ninja.height;
        ninja.canJump = true;
    } else if (ninja.feet >= platform.y && ninja.hCenter >= platform.x && ninja.hCenter <= platform.x + platform.width) {
        ninja.y = platform.y - ninja.height;
        ninja.canJump = true;
    }

    // Land ninja on platform
    // only when falling down and when (ninja.y + ninja.height = platform.y)


}

function movement() {
    // gravity
    // scrolling


    // movement
    if (ninja.movingLeft) {
        ninja.x -= ninja.speed;
    }
    else if (ninja.movingRight) {
        ninja.x += ninja.speed;
    }

    // jump
    if (ninja.jumping) {
        ninja.y -= ninja.jumpSpeed;
        ninja.collides = false;
        if (ninja.y <= ninja.jumpStart - ninja.jumpHeight) {
            ninja.jumping = false;
        }
    } else {
        ninja.y += gameProperties.gravity;
    }

    console.log("ninja.jumping", ninja.jumping);


}
// update game logic
function update() {
    movement();
    collisions();
    document.getElementById('ninjax').textContent = 'ninja x: ' + ninja.x;
    document.getElementById('ninjay').textContent = 'ninja y: ' + ninja.y;
    document.getElementById('ninjajumping').textContent = 'ninja jumping: ' + ninja.jumping;
    document.getElementById('ninjacanjump').textContent = 'ninja can jump: ' + ninja.canJump;
    document.getElementById('ninjahcenter').textContent = 'ninja hCenter: ' + ninja.hCenter;
    document.getElementById('ninjafeet').textContent = 'ninja feet y: ' + ninja.feet;
}

let currentFrameIndex = 0;
function drawNinja () {
    let currentNinjaImg; // Variable to hold the current ninja image

    if (ninja.direction === 'left') {
        currentNinjaImg = ninjaImages.left[currentFrameIndex]; // Get the current left-facing ninja image
    } else if (ninja.direction === 'right') {
        currentNinjaImg = ninjaImages.right[currentFrameIndex]; // Get the current right-facing ninja image
    } else if (ninja.direction === 'still') {
        // If the ninja is not moving, use the still image
        currentNinjaImg = ninjaImages.still;
    }

    // Draw the current ninja image at the current position
    ctx.drawImage(currentNinjaImg, ninja.x, ninja.y, ninja.width, ninja.height);
    ctx.strokeStyle = 'red';
    ctx.strokeRect(ninja.x, ninja.y, ninja.width, ninja.height);

    // Increment the frame index for the next iteration
    currentFrameIndex++;
    // Reset the frame index to 0 when it reaches the last frame
    if (currentFrameIndex >= 4) {
        currentFrameIndex = 0;
    }
}
// draw game
function draw() {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw floor
    ctx.fillStyle = 'grey';
    ctx.fillRect(0, gameEnvironment.floorY, canvas.width, gameEnvironment.floorHeight);
    drawNinja();
    drawPlatform();

}

// game loop
function gameLoop() {

    update();

    draw();

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

