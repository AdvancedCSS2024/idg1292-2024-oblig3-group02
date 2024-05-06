const sprite = document.querySelector('#sprite');
const main = document.querySelector('#main');
const underwater = document.querySelector("#underwater");
const colliders = document.querySelectorAll('.collider');

let intervalId;
let movementSpeed = 10;
let offset = 50;
let maxTransform = 0;
let minTransform = -underwater.offsetWidth + window.innerWidth;
let transform = 0;
let prevMouseX = 0;
let prevMouseY = 0;

const keyframes = [
    { backgroundPosition: `-205px 0px`, duration: 0.1, ease: "steps(1)" },
    { backgroundPosition: `-410px 0px`, duration: 0.1, ease: "steps(1)" },
    { backgroundPosition: `-610px 0px`, duration: 0.1, ease: "steps(1)" },
    { backgroundPosition: `7px -133px`, duration: 0.1, ease: "steps(1)" },
    { backgroundPosition: `-209px -128px`, duration: 0.1, ease: "steps(1)" },
    { backgroundPosition: `-410px -128px`, duration: 0.1, ease: "steps(1)" },
    { backgroundPosition: `-613px -123px`, duration: 0.1, ease: "steps(1)" },
    { backgroundPosition: `6px -271px`, duration: 0.1, ease: "steps(1)" },
    { backgroundPosition: `-201px -271px`, duration: 0.1, ease: "steps(1)" }
];

// Function to continuously move the underwater container
function moveUnderwater(direction) {
    // Check collision with all colliders before moving
    if (!checkCollisions()) {
        // Move the diver only if there's no collision with any collider
        if (direction === 'left' && transform < maxTransform) {
            transform = Math.min(maxTransform, transform + movementSpeed);
        } else if (direction === 'right' && transform > minTransform) {
            transform = Math.max(minTransform, transform - movementSpeed);
        }
        underwater.style.transform = "translateX(" + transform + "px)";
    }
}

// Define the checkCollisions function
function checkCollisions() {
    const spriteBound = sprite.getBoundingClientRect();

    // Loop through all colliders
    for (const collider of colliders) {
        const colliderBound = collider.getBoundingClientRect();

        // Calculate the center of the sprite
        const spriteCenterX = spriteBound.left + spriteBound.width * 0.5;
        const spriteCenterY = spriteBound.top + spriteBound.height * 0.5;

        // Calculate the center of the collider
        const colliderCenterX = colliderBound.left + colliderBound.width * 0.5;
        const colliderCenterY = colliderBound.top + colliderBound.height * 0.5;

        // Calculate the width and height offsets
        const wOff = (spriteBound.width + colliderBound.width) * 0.5;
        const hOff = (spriteBound.height + colliderBound.height) * 0.5;

        // Collision occurs when sprite and collider are separated on neither x nor y axes
        if (Math.abs(spriteCenterX - colliderCenterX) < wOff && Math.abs(spriteCenterY - colliderCenterY) < hOff) {
            return true;
        }
    }
    return false;
}

// Event listener for mouse movement
document.addEventListener("mousemove", function(event) {
    var mouseX = event.clientX;
    var screenWidth = window.innerWidth;

    if (mouseX < offset) {
        clearInterval(intervalId); // Clear the previous interval (if any)
        intervalId = setInterval(function() {
            moveUnderwater('left');
        }, 50); // Adjust the interval duration as needed
    } else if (mouseX > screenWidth - offset) {
        clearInterval(intervalId); // Clear the previous interval (if any)
        intervalId = setInterval(function() {
            moveUnderwater('right');
        }, 50); // Adjust the interval duration as needed
    } else {
        clearInterval(intervalId); // Clear the interval if mouse is not close to the edges
    }
});

main.addEventListener('mousemove', (e) => {
    const rect = main.getBoundingClientRect();
    prevMouseX = e.clientX - rect.left + Math.abs(transform);
    prevMouseY = e.clientY - rect.top;
});

// Function to update diver position and animate it
function updateDiverPosition() {
    // Define speed
    const speed = 0.004; // Adjust speed as needed

    // Smooth out the movement
    const newPosX = (1 - speed) * parseFloat(sprite.style.left || sprite.offsetLeft) + speed * prevMouseX;
    const newPosY = (1 - speed) * parseFloat(sprite.style.top || sprite.offsetTop) + speed * prevMouseY;

    // Calculate angle towards the previous mouse cursor position
    const dx = prevMouseX - parseFloat(sprite.style.left || sprite.offsetLeft);
    const dy = prevMouseY - parseFloat(sprite.style.top || sprite.offsetTop);
    let angle = Math.atan2(dy, dx);

    // Rotate the diver to face the previous mouse cursor position
    sprite.style.transform = `translate(-50%, -50%) rotate(${angle}rad)`;

    // Flip the diver horizontally if the angle is too large
    if (angle > Math.PI / 2 || angle < -Math.PI / 2) {
        sprite.style.transform += ' scaleY(-1)';
    }

    sprite.style.left = newPosX + 'px';
    sprite.style.top = newPosY + 'px';
    // Update sprite's position
    if (!checkCollisions()) {
        sprite.style.border = '3px solid green';
    } else {
        sprite.style.border = '3px solid red';
    }

    requestAnimationFrame(updateDiverPosition, checkCollisions);
}

// Call the function to start updating diver position and animation
updateDiverPosition();

// GSAP animation
gsap.fromTo(sprite, { keyframes: keyframes }, { keyframes: keyframes, repeat: -1 });
