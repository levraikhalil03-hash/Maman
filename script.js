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
        <button id="resetBtn" class="btn reset">Accueil</button>
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
    <section class="mini-game" aria-label="Mini jeu runner">
      <div class="result-top">
        <button id="homeBtn" class="btn reset">Accueil</button>
      </div>
      <h2 class="game-title">mini-jeu</h2>
      <div class="game-text">Clique pour faire sauter l'emoji : 1 clic = petit saut, clics rapides = grand saut.</div>
      <div id="gameArea" class="game-area">
        <div class="runner" id="runner">😆</div>
      </div>
    </section>
  `;

  document.getElementById('homeBtn').addEventListener('click', renderHome);

  const gameArea = document.getElementById('gameArea');
  const runnerEl = document.getElementById('runner');

  const groundY = 176;
  const gravity = 0.64;
  const obstacleSpeed = 4.1;
  let groundOffset = 0;

  const runner = {
    x: 92,
    y: groundY,
    vy: 0
  };

  const obstacles = [];

  function createObstacle(x) {
    const heightBlocks = Math.floor(Math.random() * 3) + 1;
    const obstacle = {
      x,
      width: 38,
      heightBlocks,
      element: document.createElement('div')
    };
    obstacle.element.className = 'obstacle';
    obstacle.element.style.height = `${heightBlocks * 34}px`;
    gameArea.appendChild(obstacle.element);
    obstacles.push(obstacle);
  }

  const areaWidth = gameArea.clientWidth;
  createObstacle(areaWidth + 140);
  createObstacle(areaWidth + 420);
  createObstacle(areaWidth + 710);

  let clickPower = 0;
  let clickDecayTimer = null;

  function jump() {
    clickPower = Math.min(clickPower + 1, 7);
    if (clickDecayTimer) {
      clearTimeout(clickDecayTimer);
    }
    clickDecayTimer = setTimeout(() => {
      clickPower = 0;
    }, 400);

    if (Math.abs(runner.y - groundY) < 1) {
      runner.vy = -(7 + clickPower * 1.35);
    }
  }

  gameArea.addEventListener('mousedown', jump);

  activeGameCleanup = () => {
    if (clickDecayTimer) {
      clearTimeout(clickDecayTimer);
    }
    gameArea.removeEventListener('mousedown', jump);
  };

  function animate() {
    const width = gameArea.clientWidth;

    groundOffset = (groundOffset + obstacleSpeed) % 40;
    gameArea.style.setProperty('--ground-offset', `${groundOffset}px`);

    runner.vy += gravity;
    runner.y += runner.vy;
    if (runner.y > groundY) {
      runner.y = groundY;
      runner.vy = 0;
    }

    runnerEl.style.transform = `translate(${runner.x}px, ${runner.y}px)`;

    obstacles.forEach((obstacle) => {
      obstacle.x -= obstacleSpeed;
      if (obstacle.x + obstacle.width < 0) {
        obstacle.x = width + 160 + Math.random() * 260;
        obstacle.heightBlocks = Math.floor(Math.random() * 3) + 1;
        obstacle.element.style.height = `${obstacle.heightBlocks * 34}px`;
      }
      obstacle.element.style.transform = `translate(${obstacle.x}px, 0)`;
    });

    gameLoopId = requestAnimationFrame(animate);
  }

  animate();
}

renderHome();
