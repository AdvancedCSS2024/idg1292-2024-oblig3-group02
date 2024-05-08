const tetraFish = document.getElementById('tetraFish');

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

tetraFish.addEventListener('animationiteration', () => {
    tetraFish.classList.toggle('swim-back');
});

// Start sprite animation
gsap.fromTo(sprite, { keyframes: keyframes }, { keyframes: keyframes, repeat: -1 });