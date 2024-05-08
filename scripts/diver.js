// Retrieve necessary elements from the DOM
const main = document.querySelector('#main');
const sprite = document.querySelector('#sprite');
const playerbox = document.querySelector('#playerbox');
const underwater = document.querySelector("#underwater");
const colliders = document.querySelectorAll('.collider');
let transform = 0

// Define variables for movement and transformation
let prevMouseX = 0;
let prevMouseY = 0;

let mouseY = 0;

// Keyframes for sprite animation
const keyframes = [
    { backgroundPosition: `-205px 0px`, duration: 0.1, ease: "steps(1)" },
    { backgroundPosition: `-410px 0px`, duration: 0.1, ease: "steps(1)" },
    { backgroundPosition: `-610px 0px`, duration: 0.1, ease: "steps(1)" },
    { backgroundPosition: `7px -133px`, duration: 0.1, ease: "steps(1)" },
    { backgroundPosition: `-209px -128px`, duration: 0.1, ease: "steps(1)" },
    { backgroundPosition: `-410px -128px`, duration: 0.1, ease: "steps(1)" },
    { backgroundPosition: `-613px -123px`, duration: 0.1, ease: "steps(1)" },
    { backgroundPosition: `6px -271px`, duration: 0.1, ease: "steps(1)" },
];

function scrollMouse() { 
    if (mouseY < 100) {
        window.scrollBy(0, -3);
    }

    if (mouseY > window.innerHeight - 100) {
        window.scrollBy(0, 3);
    }
}

// Function to check for collisions between player and colliders
function checkCollisions() {
    const pRect = playerbox.getBoundingClientRect();
    const points = [
        { x: pRect.left, y: pRect.top },
        { x: pRect.right, y: pRect.top },
        { x: pRect.right, y: pRect.bottom },
        { x: pRect.left, y: pRect.bottom }
    ];

    let xCollision = false;
    let yCollision = false;
    let xCollisionSide = null; // Side of x-axis collision ('left' or 'right')
    let yCollisionSide = null; // Side of y-axis collision ('top' or 'bottom')

    // Check collision for each collider
    for (const collider of colliders) {
        const colliderRect = collider.getBoundingClientRect();
        for (const point of points) {
            if (
                point.x >= colliderRect.left &&
                point.x <= colliderRect.right &&
                point.y >= colliderRect.top &&
                point.y <= colliderRect.bottom
            ) {
                // Determine the side the player colided with. this is also known as nightmare fuel
                const dx = Math.min(Math.abs(point.x - colliderRect.left), Math.abs(point.x - colliderRect.right));
                const dy = Math.min(Math.abs(point.y - colliderRect.top), Math.abs(point.y - colliderRect.bottom));
                if (dx < dy) {
                    xCollision = true; // Collision along the x-axis
                    xCollisionSide = point.x < (colliderRect.left + colliderRect.right) / 2 ? 'right' : 'left';
                } else {
                    yCollision = true; // Collision along the y-axis
                    yCollisionSide = point.y < (colliderRect.top + colliderRect.bottom) / 2 ? 'bottom' : 'top';
                }
            }
        }
    }

    return { xCollision, yCollision, xCollisionSide, yCollisionSide };
}

// Update the player position and handle collisions
function updateDiverPosition() {
    const speed = 0.008; // Movement speed

    // Calculate new position to move the caracter based on mouse movement
    const newPosX = (1 - speed) * parseFloat(sprite.style.left || sprite.offsetLeft) + speed * prevMouseX;
    const newPosY = (1 - speed) * parseFloat(sprite.style.top || sprite.offsetTop) + speed * prevMouseY;
    const dx = prevMouseX - parseFloat(sprite.style.left || sprite.offsetLeft);
    const dy = prevMouseY - parseFloat(sprite.style.top || sprite.offsetTop);
    const angle = Math.atan2(dy, dx);

    // Set sprite rotation
    sprite.style.transform = `translate(-50%, -50%) rotate(${angle}rad)`;

    // Flip sprite to prevent them from swimming upside down.
    if (angle > Math.PI / 2 || angle < -Math.PI / 2) {
        sprite.style.transform += ' scaleY(-1)';
    }

    // Check if the player has colided and wich side they colided on to move the player away from the colider. 
    // The reason we are getting the collition side and doing all that is in hope to try to make the colitions feel better.
    // previously i just locked the players movement on colition and it made the coliders feel sticky.
    const { xCollision, yCollision, xCollisionSide, yCollisionSide } = checkCollisions();

    let adjustedPosX = newPosX;
    let adjustedPosY = newPosY;

    if (xCollision) {
        adjustedPosX += xCollisionSide === 'left' ? 5 : -5; // Move the player 5 pixels away from the collider if they collide on x
    }

    if (yCollision) {
        adjustedPosY += yCollisionSide === 'top' ? 5 : -5; // Move the player 5 pixels away from the collider if they collide on Y
    }

    // Update sprite and playerbox position
    sprite.style.left = adjustedPosX + 'px';
    playerbox.style.left = adjustedPosX + 'px';

    // this is just a stupid fix to stop the player from peaking over the water edge.
    if (adjustedPosY < 150) {
        playerbox.style.top = '150px';
        sprite.style.top = '150px';
    } else {
        playerbox.style.top = adjustedPosY + 'px';
        sprite.style.top = adjustedPosY + 'px';
    }
    
    // runs the scroll mouse function to move the player up or down 
    // depending on the position of the mouse to the bottom or top of the screen. 
    scrollMouse()

    requestAnimationFrame(updateDiverPosition);
}

// Event listener for mouse movement
main.addEventListener('mousemove', (e) => {
    const rect = main.getBoundingClientRect();
    prevMouseX = e.clientX - rect.left + Math.abs(transform);
    prevMouseY = e.clientY - rect.top;
    mouseY = e.clientY;
});

// Start updating player position
updateDiverPosition();

// Start sprite animation
gsap.fromTo(sprite, { keyframes: keyframes }, { keyframes: keyframes, repeat: -1 });


const tetraFish = document.getElementById('tetraFish');
tetraFish.addEventListener('animationiteration', () => {
    tetraFish.classList.toggle('swim-back');
});

