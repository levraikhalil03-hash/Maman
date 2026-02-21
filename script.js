const app = document.getElementById('app');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');

function showResult(emoji, text) {
  app.innerHTML = `
    <section class="result" aria-live="polite">
      <div class="result-emoji">${emoji}</div>
      <p class="result-text">${text}</p>
    </section>
  `;
}

yesBtn.addEventListener('click', () => {
  showResult('😄', 'MERCIIIII !!!!!');
});

noBtn.addEventListener('click', () => {
  showResult('😢', 'DOOOOOOOOOOOOOOMAGEEEEEEEEE');
});
