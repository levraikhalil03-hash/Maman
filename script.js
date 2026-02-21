const app = document.getElementById('app');

function renderHome() {
  app.innerHTML = `
    <div class="heart">💖</div>
    <h1>Tu M'AIME ?</h1>
    <div class="buttons">
      <button id="yesBtn" class="btn yes">OUI</button>
      <button id="noBtn" class="btn no">NON</button>
    </div>
  `;

  const yesBtn = document.getElementById('yesBtn');
  const noBtn = document.getElementById('noBtn');

  yesBtn.addEventListener('click', () => {
    showResult('😄', 'MERCIIIII !!!!!');
  });

  noBtn.addEventListener('click', () => {
    showResult('😢', 'DOOOOOOOOOOOOOOMAGEEEEEEEEE');
  });
}

function showResult(emoji, text) {
  app.innerHTML = `
    <section class="result" aria-live="polite">
      <div class="result-top">
        <button id="resetBtn" class="btn reset">actuals</button>
      </div>
      <div class="result-emoji">${emoji}</div>
      <p class="result-text">${text}</p>
    </section>
  `;

  const resetBtn = document.getElementById('resetBtn');
  resetBtn.addEventListener('click', renderHome);
}

renderHome();
