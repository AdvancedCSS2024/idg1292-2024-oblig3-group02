const tetraFish = document.querySelector('#tetraFish');
const header = document.querySelector('#header');

let mouseOverMain = false;

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

const scrollInput = () => {
    if (!mouseOverMain) return;
    const spriteCenterY = sprite.getBoundingClientRect().top + sprite.offsetHeight / 2;
    const windowHeight = window.innerHeight;
    const scrollThreshold = windowHeight * 0.3;

    const scrollAmount = spriteCenterY < scrollThreshold ? -3 : (spriteCenterY > windowHeight - scrollThreshold ? 3 : 0);
    window.scrollBy(0, scrollAmount);
};

const debounce = (callback, delay) => {
    let timer;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timer);
      timer = setTimeout(() => {
        callback.apply(context, args);
      }, delay);
    };
  };

const setScale = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const scale = Math.min(screenWidth, screenHeight) * 0.10 / 100;

    sprite.style.scale = scale;
    playerbox.style.scale = scale;
}

const createBubbles = () => {
    // Create a new element
    var bubble = document.createElement('div');
    bubble.classList.add('underwater__bubble');

    // Generate random position
    var containerWidth = main.offsetWidth;
    var containerHeight = main.offsetHeight;
    var randomX = Math.floor(Math.random() * (containerWidth - 100));
    var randomY = Math.floor(Math.random() * (containerHeight - 200));
    var randomScale = Math.random() * 0.7 + 0.5;

    // Set position
    bubble.style.left = randomX + 'px';
    bubble.style.top = randomY + 'px';
    bubble.style.scale = randomScale;

    // Append to container
    main.appendChild(bubble);

    // Remove the element after animation completes
    bubble.addEventListener('animationend', function() {
        main.removeChild(bubble);
    });
}

setInterval(createBubbles, 400);

main.addEventListener('mousemove', handleMouseMove);
main.addEventListener('touchstart', handleMouseMove);
main.addEventListener('touchmove', handleMouseMove);

main.addEventListener('mouseenter', () => mouseOverMain = true);
main.addEventListener('mouseleave', () => mouseOverMain = false);

window.addEventListener('resize', debounce(setScale, 250));

gsap.fromTo(sprite, { keyframes: keyframes }, { keyframes: keyframes, repeat: -1 });

setScale();
updateDiverPosition();