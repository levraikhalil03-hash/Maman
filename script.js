const app = document.getElementById('app');

let gameLoopId = null;
let activeGameCleanup = null;

function stopGameLoop() {
  if (gameLoopId) {
    cancelAnimationFrame(gameLoopId);
    gameLoopId = null;
  }

  if (activeGameCleanup) {
    activeGameCleanup();
    activeGameCleanup = null;
  }
}

function renderHome() {
  stopGameLoop();

  app.innerHTML = `
    <div class="top-actions">
      <button id="miniGameBtn" class="btn mini">mini-jeu</button>
    </div>
    <div class="heart">💖</div>
    <h1>Tu M'AIME ?</h1>
    <div class="buttons">
      <button id="yesBtn" class="btn yes">OUI</button>
      <button id="noBtn" class="btn no">NON</button>
    </div>
  `;

  document.getElementById('yesBtn').addEventListener('click', () => {
    showResult('😄', 'MERCIIIII !!!!!');
  });

  document.getElementById('noBtn').addEventListener('click', () => {
    showResult('😢', 'DOOOOOOOOOOOOOOMAGEEEEEEEEE');
  });

  document.getElementById('miniGameBtn').addEventListener('click', renderMiniGame);
}

function showResult(emoji, text) {
  stopGameLoop();

  app.innerHTML = `
    <section class="result" aria-live="polite">
      <div class="result-top">
        <button id="resetBtn" class="btn reset">actuals</button>
      </div>
      <div class="result-emoji">${emoji}</div>
      <p class="result-text">${text}</p>
    </section>
  `;

  document.getElementById('resetBtn').addEventListener('click', renderHome);
}

function renderMiniGame() {
  stopGameLoop();

  app.innerHTML = `
    <section class="mini-game" aria-label="Mini jeu des blocs qui sautent">
      <div class="result-top">
        <button id="homeBtn" class="btn reset">actuals</button>
      </div>
      <h2 class="game-title">mini-jeu</h2>
      <div class="game-emoji">😆</div>
      <p class="game-text">Clique dans la zone: 1 clic = petit saut, plusieurs clics = gros sauts !</p>
      <div id="gameArea" class="game-area"></div>
    </section>
  `;

  document.getElementById('homeBtn').addEventListener('click', renderHome);

  const gameArea = document.getElementById('gameArea');
  const groundY = 200;
  const gravity = 0.58;
  const speed = 2.2;

  const blocks = [
    { width: 34, height: 95, x: 0, y: groundY - 95, vy: 0 },
    { width: 34, height: 62, x: 170, y: groundY - 62, vy: 0 },
    { width: 34, height: 38, x: 320, y: groundY - 38, vy: 0 },
    { width: 34, height: 10, x: 470, y: groundY - 10, vy: 0 },
    { width: 34, height: 76, x: 620, y: groundY - 76, vy: 0 }
  ];

  blocks.forEach((block) => {
    const element = document.createElement('div');
    element.className = 'jump-block';
    element.style.width = `${block.width}px`;
    element.style.height = `${block.height}px`;
    gameArea.appendChild(element);
    block.element = element;
  });

  let clickPower = 0;
  let clickDecayTimer = null;

  function boostJumpPower() {
    clickPower = Math.min(clickPower + 1, 7);
    if (clickDecayTimer) {
      clearTimeout(clickDecayTimer);
    }
    clickDecayTimer = setTimeout(() => {
      clickPower = 0;
    }, 420);

    const jumpStrength = 4.8 + clickPower * 1.5;
    blocks.forEach((block) => {
      if (Math.abs(block.y - (groundY - block.height)) < 1) {
        block.vy = -jumpStrength;
      }
    });
  }

  gameArea.addEventListener('mousedown', boostJumpPower);

  activeGameCleanup = () => {
    if (clickDecayTimer) {
      clearTimeout(clickDecayTimer);
    }
    gameArea.removeEventListener('mousedown', boostJumpPower);
  };

  function animate() {
    const gameWidth = gameArea.clientWidth;

    blocks.forEach((block) => {
      block.x -= speed;
      if (block.x + block.width < 0) {
        block.x = gameWidth + Math.random() * 180;
      }

      block.vy += gravity;
      block.y += block.vy;

      const floorY = groundY - block.height;
      if (block.y > floorY) {
        block.y = floorY;
        block.vy = 0;
      }

      block.element.style.transform = `translate(${block.x}px, ${block.y}px)`;
    });

    gameLoopId = requestAnimationFrame(animate);
  }

  animate();
}

renderHome();
