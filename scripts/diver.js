const main = document.querySelector('main');
const sprite = document.querySelector('#sprite');
const playerbox = document.querySelector('#playerbox');
const colliders = document.querySelectorAll('.collider');
const gradient = document.getElementById('gradient-overlay');

let prevInputX = 0;
let prevInputY = 0;

const triggerText = (collider, trigger) => {
    if (trigger) {
        collider.classList.add('active');

        setTimeout(function() {
            collider.classList.remove('active');
        }, 20000);
    }
}

const handleMouseMove = (event) => {
    const rect = main.getBoundingClientRect();
    prevInputX = event.clientX - rect.left;
    prevInputY = event.clientY - rect.top;
};

const handleTouchMove = (event) => {
    const rect = main.getBoundingClientRect();
    prevInputX = event.touches[0].clientX - rect.left;
    prevInputY = event.touches[0].clientY - rect.top;
};

const checkCollisions = () => {
    const pRect = playerbox.getBoundingClientRect();
    const points = [
        { x: pRect.left, y: pRect.top },
        { x: pRect.right, y: pRect.top },
        { x: pRect.right, y: pRect.bottom },
        { x: pRect.left, y: pRect.bottom }
    ];

    let collision = { x: false, y: false };
    let collisionSide = { x: null, y: null };
    let colliderEl = null;

    for (const collider of colliders) {
        const colliderRect = collider.getBoundingClientRect();
        for (const point of points) {
            if (isPointInsideElement(point, colliderRect)) {
                const dx = Math.min(Math.abs(point.x - colliderRect.left), Math.abs(point.x - colliderRect.right));
                const dy = Math.min(Math.abs(point.y - colliderRect.top), Math.abs(point.y - colliderRect.bottom));
                if (dx < dy) {
                    collision.x = true;
                    collisionSide.x = point.x < (colliderRect.left + colliderRect.right) / 2 ? 'right' : 'left';
                } else {
                    collision.y = true;
                    collisionSide.y = point.y < (colliderRect.top + colliderRect.bottom) / 2 ? 'bottom' : 'top';
                }
                colliderEl = collider;
            }
        }
    }

    return { collision, collisionSide, colliderEl };
};

const isPointInsideElement = (point, rect) => {
    return (
        point.x >= rect.left &&
        point.x <= rect.right &&
        point.y >= rect.top &&
        point.y <= rect.bottom
    );
};

const updateDiverPosition = () => {
    const speed = 0.03;
    const dx = prevInputX - (parseFloat(sprite.style.left) || sprite.offsetLeft);
    const dy = prevInputY - (parseFloat(sprite.style.top) || sprite.offsetTop);
    const angle = Math.atan2(dy, dx);
    const newX = (1 - speed) * (parseFloat(sprite.style.left) || sprite.offsetLeft) + speed * prevInputX;
    const newY = (1 - speed) * (parseFloat(sprite.style.top) || sprite.offsetTop) + speed * prevInputY;

    sprite.style.transform = `translate(-50%, -50%) rotate(${angle}rad)${(angle > Math.PI / 2 || angle < -Math.PI / 2) ? ' scaleY(-1)' : ''}`;

    const { collision, collisionSide, colliderEl } = checkCollisions();
    const isTrigger = colliderEl?.classList.contains('trigger');
    let [adjustedX, adjustedY] = [newX, newY];

    adjustedX += collision.x && !isTrigger ? (collisionSide.x === 'left' ? 10 : -10) : 0;
    adjustedY += collision.y && !isTrigger ? (collisionSide.y === 'top' ? 10 : -10) : 0;

    triggerText(colliderEl, isTrigger)

    const gradientX = (newX / main.offsetWidth) * 100;
    const gradientY =  (newY / main.offsetHeight ) * 100;
    const gradientStrength = gradientY / main.offsetHeight * 50;


    gradient.style.background = `radial-gradient(circle at ${gradientX}% ${gradientY}%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, ${gradientStrength}) 10%)`;

    const mainOffsetY = main.offsetHeight;
    const pbOffsetY = playerbox.offsetHeight;

    sprite.style.left = playerbox.style.left = adjustedX + 'px';
    playerbox.style.top = sprite.style.top = (
        (adjustedY < pbOffsetY) ? 
            (pbOffsetY + 'px') :
            ((adjustedY > mainOffsetY - pbOffsetY) ? 
                (mainOffsetY - pbOffsetY  + 'px') :
                (adjustedY + 'px')
            )
    );
    
    requestAnimationFrame(updateDiverPosition, scrollInput());
};
