// Mobile navigation toggle
(function initMobileNav() {
  const toggleButton = document.querySelector('.nav-toggle');
  const nav = document.getElementById('nav');
  if (!toggleButton || !nav) return;

  toggleButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggleButton.setAttribute('aria-expanded', String(isOpen));
  });
})();

// Smooth scroll for same-page anchors
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', href);
      }
    });
  });
})();

// Contact form validation (client-side only)
(function initFormValidation() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const fieldSelectors = ['name', 'email', 'message'];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(input, message) {
    const row = input.closest('.form-row');
    const errorEl = row ? row.querySelector('.error') : null;
    if (errorEl) errorEl.textContent = message;
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  form.addEventListener('submit', (e) => {
    let isValid = true;
    fieldSelectors.forEach((name) => {
      const input = form.querySelector(`[name="${name}"]`);
      if (!input) return;
      const value = String(input.value || '').trim();
      if (!value) {
        setError(input, 'This field is required.');
        isValid = false;
      } else if (name === 'email' && !emailRegex.test(value)) {
        setError(input, 'Please enter a valid email.');
        isValid = false;
      } else {
        setError(input, '');
      }
    });

    if (!isValid) {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    // Simulate success (replace with real backend integration)
    form.reset();
    alert('Thanks! Your message has been sent.');
  });
})();

// Year in footer
(function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = String(new Date().getFullYear());
})();

// Theme toggle with persistence
(function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  const root = document.documentElement;
  if (!btn) return;

  function applyTheme(theme) {
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
      btn.setAttribute('aria-pressed', 'true');
    } else {
      root.removeAttribute('data-theme');
      btn.setAttribute('aria-pressed', 'false');
    }
  }

  const saved = localStorage.getItem('theme');
  applyTheme(saved === 'light' ? 'light' : 'dark');

  btn.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    const next = isLight ? 'dark' : 'light';
    localStorage.setItem('theme', next);
    applyTheme(next);
  });
})();

// Background particles (lightweight, theme-aware)
(function initParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const context = canvas.getContext('2d');
  const mediaQueryReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mediaQueryReduced.matches) {
    return; // respect reduced motion
  }

  let devicePixelRatioCap = Math.min(window.devicePixelRatio || 1, 1.5);
  let particles = [];
  let animationFrameId = 0;
  let lastTime = 0;

  function getThemeColors() {
    const styles = getComputedStyle(document.documentElement);
    const brand = styles.getPropertyValue('--brand').trim() || '#4f46e5';
    const brand2 = styles.getPropertyValue('--brand-2').trim() || '#22d3ee';
    const muted = styles.getPropertyValue('--muted').trim() || 'rgba(163,163,163,0.6)';
    return [brand, brand2, muted];
  }

  function resize() {
    devicePixelRatioCap = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.floor(window.innerWidth * devicePixelRatioCap);
    canvas.height = Math.floor(window.innerHeight * devicePixelRatioCap);
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    context.setTransform(devicePixelRatioCap, 0, 0, devicePixelRatioCap, 0, 0);
    initParticles();
  }

  function initParticles() {
    const [c1, c2, c3] = getThemeColors();
    const area = window.innerWidth * window.innerHeight;
    const count = Math.max(24, Math.min(80, Math.floor(area / 32000)));
    particles = new Array(count).fill(null).map((_, i) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      size: 12 + Math.random() * 28,
      color: i % 3 === 0 ? c1 : i % 3 === 1 ? c2 : c3,
      phase: Math.random() * Math.PI * 2
    }));
  }

  function step(timestamp) {
    const elapsed = timestamp - lastTime;
    if (elapsed < 1000 / 30) { // ~30 FPS cap
      animationFrameId = requestAnimationFrame(step);
      return;
    }
    lastTime = timestamp;

    context.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      p.phase += 0.003 * elapsed;
      p.x += p.vx + Math.sin(p.phase) * 0.05;
      p.y += p.vy + Math.cos(p.phase * 0.9) * 0.05;

      // wrap around edges
      if (p.x < -50) p.x = window.innerWidth + 50;
      if (p.x > window.innerWidth + 50) p.x = -50;
      if (p.y < -50) p.y = window.innerHeight + 50;
      if (p.y > window.innerHeight + 50) p.y = -50;

      context.beginPath();
      context.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      context.closePath();
      context.fillStyle = p.color;
      context.globalAlpha = 0.08; // soft
      context.fill();
      context.globalAlpha = 1;
    }

    animationFrameId = requestAnimationFrame(step);
  }

  function start() {
    cancelAnimationFrame(animationFrameId);
    lastTime = 0;
    animationFrameId = requestAnimationFrame(step);
  }

  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrameId);
    } else {
      start();
    }
  });

  resize();
  start();
})();


