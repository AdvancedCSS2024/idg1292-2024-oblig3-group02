
// const sprite = document.querySelector('.sprite');
const sprite = document.querySelector('.sprite');

// Define keyframes
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

const main = document.querySelector('main');

// Variables to store the previous mouse position
let prevMouseX = 0;
let prevMouseY = 0;

main.addEventListener('mousemove', (e) => {
  const rect = main.getBoundingClientRect();
  prevMouseX = e.clientX - rect.left;
  prevMouseY = e.clientY - rect.top;
});

function updateDiverPosition() {
  // Define speed
  const speed = 0.004; // Adjust speed as needed

  // Smooth out the movement
  const newPosX = (1 - speed) * parseFloat(sprite.style.left || sprite.offsetLeft) + speed * prevMouseX;
  const newPosY = (1 - speed) * parseFloat(sprite.style.top || sprite.offsetTop) + speed * prevMouseY;

  // Calculate angle towards the previous mouse cursor position
  const dx = prevMouseX - parseFloat(sprite.style.left || sprite.offsetLeft);
  const dy = prevMouseY - parseFloat(sprite.style.top || sprite.offsetTop);
  const angle = Math.atan2(dy, dx);

  // Rotate the diver to face the previous mouse cursor position
  sprite.style.transform = `translate(-50%, -50%) rotate(${angle}rad)`;

  // Update sprite's position
  sprite.style.left = newPosX + 'px';
  sprite.style.top = newPosY + 'px';

  requestAnimationFrame(updateDiverPosition);
}

updateDiverPosition();
gsap.fromTo(sprite, { keyframes: keyframes }, { keyframes: keyframes, repeat: -1 });
