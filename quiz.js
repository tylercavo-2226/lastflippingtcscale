// TC Scales — Free Growth Audit Quiz
(function () {
  const overlay    = document.getElementById('quiz-overlay');
  const closeBtn   = document.getElementById('quiz-close');
  const trigger    = document.getElementById('quiz-trigger');
  if (!overlay || !trigger) return;

  const steps      = document.querySelectorAll('.quiz-step');
  const progFill   = document.getElementById('quiz-progress-fill');
  const progLabel  = document.getElementById('quiz-progress-label');
  const headerTitle = document.getElementById('quiz-header-title');
  const TOTAL_Q    = 4;
  let currentStep  = 0;
  const answers    = {};

  const stepTitles = [
    "Find Out What's Holding Your Brand Back",
    'Tell Us About Your Business',
    "What's Your Biggest Challenge?",
    'Set Your Growth Target',
    "What's Your Marketing Budget?",
    'Get Your Free Blueprint',
    'Blueprint Sent!'
  ];

  function openQuiz() {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeQuiz() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function goToStep(n) {
    steps[currentStep].classList.remove('active');
    currentStep = n;
    steps[currentStep].classList.add('active');
    const qStep = Math.max(0, currentStep - 1);
    const pct = currentStep === 0 ? 0 : Math.min(100, Math.round((qStep / TOTAL_Q) * 100));
    progFill.style.width = pct + '%';
    if (currentStep === 0) {
      progLabel.textContent = 'Takes about 1 minute';
    } else if (currentStep <= TOTAL_Q) {
      progLabel.textContent = `Question ${currentStep} of ${TOTAL_Q}`;
    } else if (currentStep === TOTAL_Q + 1) {
      progLabel.textContent = 'Almost done!';
      progFill.style.width = '100%';
    } else {
      progLabel.textContent = 'Complete ✓';
      progFill.style.width = '100%';
    }
    if (headerTitle) headerTitle.textContent = stepTitles[currentStep] || '';
  }

  trigger.addEventListener('click', openQuiz);
  closeBtn.addEventListener('click', closeQuiz);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeQuiz(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeQuiz(); });

  document.getElementById('quiz-start').addEventListener('click', () => goToStep(1));

  document.querySelectorAll('.quiz-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const q = opt.dataset.q;
      document.querySelectorAll(`.quiz-option[data-q="${q}"]`).forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      answers[`q${q}`] = opt.dataset.val;
      const step = opt.closest('.quiz-step');
      const nextBtn = step.querySelector('.quiz-next-btn');
      if (nextBtn) nextBtn.disabled = false;
      setTimeout(() => {
        const stepNum = parseInt(step.dataset.step);
        goToStep(stepNum + 1);
        const newStep = document.querySelector(`.quiz-step[data-step="${stepNum + 1}"]`);
        if (newStep) {
          const nb = newStep.querySelector('.quiz-next-btn');
          const qNum = stepNum + 1;
          if (nb && !answers[`q${qNum}`]) nb.disabled = true;
        }
      }, 350);
    });
  });

  document.querySelectorAll('.quiz-next-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const step = btn.closest('.quiz-step');
      goToStep(parseInt(step.dataset.step) + 1);
    });
  });

  document.querySelectorAll('.quiz-back-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const step = btn.closest('.quiz-step');
      goToStep(Math.max(0, parseInt(step.dataset.step) - 1));
    });
  });

  document.getElementById('quiz-submit').addEventListener('click', () => {
    const name  = document.getElementById('quiz-name').value.trim();
    const email = document.getElementById('quiz-email').value.trim();
    if (!name || !email || !email.includes('@')) {
      document.getElementById('quiz-email').focus();
      return;
    }
    answers.name  = name;
    answers.email = email;
    answers._subject = 'New Free Growth Audit Submission';
    fetch('https://formspree.io/f/mdawnkkk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(answers)
    });
    goToStep(6);
  });
})();
