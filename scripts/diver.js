// Retrieve necessary elements from the DOM
const sprite = document.querySelector('#sprite');
const main = document.querySelector('#main');
const underwater = document.querySelector("#underwater");
const colliders = document.querySelectorAll('.collider');
const playerbox = document.querySelector('#playerbox');
let transform = 0

// Define variables for movement and transformation
let prevMouseX = 0;
let prevMouseY = 0;

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
    { backgroundPosition: `-201px -271px`, duration: 0.1, ease: "steps(1)" }
];

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
                // Determine the side of collision
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

    // Calculate new position based on mouse movement
    const newPosX = (1 - speed) * parseFloat(sprite.style.left || sprite.offsetLeft) + speed * prevMouseX;
    const newPosY = (1 - speed) * parseFloat(sprite.style.top || sprite.offsetTop) + speed * prevMouseY;
    const dx = prevMouseX - parseFloat(sprite.style.left || sprite.offsetLeft);
    const dy = prevMouseY - parseFloat(sprite.style.top || sprite.offsetTop);
    const angle = Math.atan2(dy, dx);

    // Set sprite rotation
    sprite.style.transform = `translate(-50%, -50%) rotate(${angle}rad)`;

    // Flip sprite if necessary
    if (angle > Math.PI / 2 || angle < -Math.PI / 2) {
        sprite.style.transform += ' scaleY(-1)';
    }

    // Check for collisions
    const { xCollision, yCollision, xCollisionSide, yCollisionSide } = checkCollisions();

    let adjustedPosX = newPosX;
    let adjustedPosY = newPosY;

    if (xCollision) {
        adjustedPosX += xCollisionSide === 'left' ? 5 : -5; // Move a tiny bit away from the collider
    }

    if (yCollision) {
        adjustedPosY += yCollisionSide === 'top' ? 5 : -5; // Move a tiny bit away from the collider
    }

    // Update sprite and playerbox position
    sprite.style.left = adjustedPosX + 'px';
    sprite.style.top = adjustedPosY + 'px';
    playerbox.style.left = adjustedPosX + 'px';
    playerbox.style.top = adjustedPosY + 'px';

    // Request next animation frame
    requestAnimationFrame(updateDiverPosition);
}

// Event listener for mouse movement
main.addEventListener('mousemove', (e) => {
    const rect = main.getBoundingClientRect();
    prevMouseX = e.clientX - rect.left + Math.abs(transform);
    prevMouseY = e.clientY - rect.top;
});

// Start updating player position
updateDiverPosition();

// Start sprite animation
gsap.fromTo(sprite, { keyframes: keyframes }, { keyframes: keyframes, repeat: -1 });

