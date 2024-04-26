const gameContainer = document.getElementById('gameContainer');

function spawnTarget() {
  const target = document.createElement('div');
  target.className = 'target';
  target.style.left = Math.random() * (window.innerWidth - 30) + 'px';
  target.style.top = Math.random() * (window.innerHeight - 30) + 'px';

  target.addEventListener('click', () => {
    gameContainer.removeChild(target);
  });

  gameContainer.appendChild(target);
}

// Spawn targets every second
setInterval(spawnTarget, 1000);

// Create custom crosshair
const crosshair = document.createElement('div');
crosshair.className = 'crosshair';
document.body.appendChild(crosshair);

// Update crosshair position based on mouse movement
document.addEventListener('mousemove', (e) => {
  crosshair.style.left = e.clientX - 15 + 'px'; // Adjust for crosshair size
  crosshair.style.top = e.clientY - 15 + 'px'; // Adjust for crosshair size
});