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
    const scrollThreshold = windowHeight * 0.4;

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

const throttle = (callback, delay) => {
    let previousCall = new Date().getTime();
    return function() {
      const time = new Date().getTime();
      if ((time - previousCall) >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  };

const setScale = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const scale = Math.min(screenWidth, screenHeight) * 0.10 / 100;

    sprite.style.scale = scale;
    playerbox.style.scale = scale;
}

main.addEventListener('mousemove', throttle(handleMouseMove, 10));
main.addEventListener('touchstart', throttle(handleMouseMove, 10));
main.addEventListener('touchmove', throttle(handleMouseMove, 10));

main.addEventListener('mouseenter', () => throttle(mouseOverMain = true, 50));
main.addEventListener('mouseleave', () => throttle(mouseOverMain = false, 50));

window.addEventListener('resize', debounce(setScale, 250));

gsap.fromTo(sprite, { keyframes: keyframes }, { keyframes: keyframes, repeat: -1 });

setScale();
updateDiverPosition();