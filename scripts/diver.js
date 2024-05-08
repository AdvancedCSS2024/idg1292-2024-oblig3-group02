// Retrieve necessary elements from the DOM
const main = document.querySelector('#main');
const sprite = document.querySelector('#sprite');
const playerbox = document.querySelector('#playerbox');
const underwater = document.querySelector("#underwater");
const colliders = document.querySelectorAll('.collider');
let transform = 0; 
let mouseOverMain = false

// Define variables for movement and transformation
let prevInputX = 0;
let prevInputY = 0;

function scrollInput() { 
    const spriteRect = sprite.getBoundingClientRect();
    const spriteCenterY = spriteRect.top + spriteRect.height / 2;
    const windowHeight = window.innerHeight;
    const scrollThreshold = window.innerHeight * 0.4; // Adjust this value as needed

    // Scroll up if the sprite is above the threshold
    if (spriteCenterY < scrollThreshold && mouseOverMain) {
        window.scrollBy(0, -3);
    }

    // Scroll down if the sprite is below the threshold
    if (spriteCenterY > windowHeight - scrollThreshold && mouseOverMain) {
        window.scrollBy(0, 3);
    }
}

function handleMouseMove(event) {
    const rect = main.getBoundingClientRect();
    prevInputX = event.clientX - rect.left + Math.abs(transform);
    prevInputY = event.clientY - rect.top;
}

// Function to handle touch movement
function handleTouchMove(event) {
    const rect = main.getBoundingClientRect();
    const touchX = event.touches[0].clientX - rect.left + Math.abs(transform);
    const touchY = event.touches[0].clientY - rect.top;

    prevInputX = touchX;
    prevInputY = touchY;
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
    let colliderEl = null;

    // Check collision for each collider
    for (const collider of colliders) {
        const colliderRect = collider.getBoundingClientRect();
        colliderEl = collider;
        for (const point of points) {
            if (
                point.x >= colliderRect.left &&
                point.x <= colliderRect.right &&
                point.y >= colliderRect.top &&
                point.y <= colliderRect.bottom
            ) {
                // Determine the side the player colided with.
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

    return { xCollision, yCollision, xCollisionSide, yCollisionSide, colliderEl };
}

// Update the player position and handle collisions
function updateDiverPosition() {
    const speed = 0.008; // Movement speed

    // Calculate new position to move the character based on input movement
    const newPosX = (1 - speed) * parseFloat(sprite.style.left || sprite.offsetLeft) + speed * prevInputX;
    const newPosY = (1 - speed) * parseFloat(sprite.style.top || sprite.offsetTop) + speed * prevInputY;
    const dx = prevInputX - parseFloat(sprite.style.left || sprite.offsetLeft);
    const dy = prevInputY - parseFloat(sprite.style.top || sprite.offsetTop);
    const angle = Math.atan2(dy, dx);

    // Set sprite rotation
    sprite.style.transform = `translate(-50%, -50%) rotate(${angle}rad)`;

    // Flip sprite to prevent them from swimming upside down.
    if (angle > Math.PI / 2 || angle < -Math.PI / 2) {
        sprite.style.transform += ' scaleY(-1)';
    }

    // Check if the player has collided and which side they collided on to move the player away from the collider.
    const { xCollision, yCollision, xCollisionSide, yCollisionSide, colliderEl } = checkCollisions();
    const isTrigger = colliderEl.classList.contains('trigger') ? true : false;
    
    let adjustedPosX = newPosX;
    let adjustedPosY = newPosY;

    if (xCollision && !isTrigger) {
        adjustedPosX += xCollisionSide === 'left' ? 5 : -5; // Move the player 5 pixels away from the collider if they collide on x
    }

    if (yCollision && !isTrigger) {
        adjustedPosY += yCollisionSide === 'top' ? 5 : -5; // Move the player 5 pixels away from the collider if they collide on Y
    }

    // Update sprite and playerbox position
    sprite.style.left = adjustedPosX + 'px';
    playerbox.style.left = adjustedPosX + 'px';

    // Adjust player position to prevent peaking over the water edge
    if (adjustedPosY < 150) {
        playerbox.style.top = '150px';
        sprite.style.top = '150px';
    } else {
        playerbox.style.top = adjustedPosY + 'px';
        sprite.style.top = adjustedPosY + 'px';
    }
    
    // Runs the scrollInput function to move the player up or down 
    // depending on the position of the input to the bottom or top of the screen. 


    requestAnimationFrame(updateDiverPosition, scrollInput());
}

main.addEventListener('mouseenter', () => {
    mouseOverMain = true;
});

main.addEventListener('mouseleave', () => {
    mouseOverMain = false;
});

// Event listener for mouse movement
main.addEventListener('mousemove', (e) => {
    handleMouseMove(e);
});

// Event listener for touch start
main.addEventListener('touchstart', (e) => {
    handleTouchMove(e);
});

// Event listener for touch move
main.addEventListener('touchmove', (e) => {
    handleTouchMove(e);
});

// Start updating player position
updateDiverPosition();
