// TC Scales — Mobile hamburger menu
(function () {
  const hamburger = document.getElementById('nav-hamburger');
  const navEl = document.getElementById('site-nav');
  if (!hamburger || !navEl) return;

  hamburger.addEventListener('click', function (e) {
    e.stopPropagation();
    const isOpen = navEl.classList.toggle('mobile-open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close when any nav link is clicked
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    link.addEventListener('click', function () {
      navEl.classList.remove('mobile-open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!navEl.contains(e.target)) {
      navEl.classList.remove('mobile-open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
})();
