// Mobile navigation toggle
(function initMobileNav() {
  const toggleButton = document.querySelector('.nav-toggle');
  const nav = document.getElementById('nav');
  const header = document.querySelector('.site-header');
  if (!toggleButton || !nav) return;

  toggleButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggleButton.setAttribute('aria-expanded', String(isOpen));
  });

  // Shrink header on scroll
  const updateHeader = () => {
    const scrolled = (window.scrollY || document.documentElement.scrollTop || 0) > 6;
    if (header) header.classList.toggle('scrolled', scrolled);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
})();
// Scroll progress bar and back-to-top visibility
(function initScrollUI() {
  const progressBar = document.querySelector('.scroll-progress__bar');
  const backToTop = document.getElementById('backToTop');
  const update = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
    if (backToTop) backToTop.classList.toggle('show', scrollTop > 300);
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// Reveal on scroll using IntersectionObserver
(function initRevealOnScroll() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window) || items.length === 0) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach((el) => observer.observe(el));
})();

// Subtle 3D tilt on hover for elements with data-tilt
(function initTilt() {
  const items = document.querySelectorAll('[data-tilt]');
  if (!items.length) return;
  function handle(e) {
    const rect = this.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const tiltX = (y - 0.5) * -6; // degrees
    const tiltY = (x - 0.5) * 6;
    this.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  }
  function reset() { this.style.transform = ''; }
  items.forEach((el) => {
    el.addEventListener('mousemove', handle);
    el.addEventListener('mouseleave', reset);
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

// Highlight active nav link based on scroll position
(function initActiveNavLink() {
  const sectionIds = ['home', 'about', 'projects', 'skills', 'contact'];
  const links = new Map(sectionIds.map((id) => [id, document.querySelector(`.site-nav a[href="#${id}"]`)]));

  const handle = () => {
    let active = 'home';
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom > 100) { active = id; break; }
    }
    links.forEach((a, id) => {
      if (!a) return;
      const isActive = id === active;
      a.classList.toggle('active', isActive);
      if (isActive) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  handle();
  window.addEventListener('scroll', handle, { passive: true });
  window.addEventListener('resize', handle);
})();

// Contact form validation (client-side only)
(function initFormValidation() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const fieldSelectors = ['name', 'email', 'message'];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(input, message) {
    const row = input.closest('.field');
    const errorEl = row ? row.querySelector('.error') : null;
    if (errorEl) errorEl.textContent = message;
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (row) row.classList.toggle('valid', !message);
  }

  form.addEventListener('submit', async (e) => {
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

    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton ? submitButton.textContent : '';
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.value.trim(),
          email: form.email.value.trim(),
          message: form.message.value.trim(),
          company: form.company ? String(form.company.value || '').trim() : '',
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Apply field-level errors if provided
        if (data && data.errors) {
          Object.entries(data.errors).forEach(([key, msg]) => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) setError(input, String(msg));
          });
        }
        throw new Error(data.error || 'Failed to send message');
      }

      form.reset();
      // Toast success (non-blocking)
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.textContent = 'Thanks! Your message has been sent.';
      document.body.appendChild(toast);
      requestAnimationFrame(() => toast.classList.add('show'));
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 250);
      }, 2400);
    } catch (err) {
      alert('Sorry, something went wrong. Please try again later.');
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalText || 'Send';
      }
    }
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


// Dynamically render projects with thumbnails
(function renderProjects() {
  const grid = document.getElementById('projectsGrid');
  if (!grid || grid.getAttribute('data-static') === 'true') return; // static HTML present

  const projects = [
    {
      title: 'Project One',
      description: 'A brief description of your project, what it does and why it’s cool.',
      live: '#',
      code: '#',
      image: 'assets/images/project-1.jpg?v=20250810-1',
    },
    {
      title: 'Project Two',
      description: 'Another short summary that highlights the tech stack and outcomes.',
      live: '#',
      code: '#',
      image: 'assets/images/project-2.jpg?v=20250810-1',
    },
    {
      title: 'Project Three',
      description: 'Include impact, metrics or anything that demonstrates value.',
      live: '#',
      code: '#',
      image: 'assets/images/project-3.jpg?v=20250810-1',
    },
    {
      title: 'Project Four',
      description: 'Performance-focused feature with measurable impact and clean API.',
      live: '#',
      code: '#',
      image: 'assets/images/project-4.jpg?v=20250810-1',
    },
    {
      title: 'Project Five',
      description: 'A11y-first UI components with robust test coverage and docs.',
      live: '#',
      code: '#',
      image: 'assets/images/project-5.jpg?v=20250810-1',
    },
    {
      title: 'Project Six',
      description: 'Full-stack app integrating external APIs and realtime features.',
      live: '#',
      code: '#',
      image: 'assets/images/project-6.jpg?v=20250810-1',
    },
  ];

  const fragment = document.createDocumentFragment();
  for (const p of projects) {
    const article = document.createElement('article');
    article.className = 'card';
    article.innerHTML = `
      <div class="project-thumb">
        <img src="${p.image}" alt="${p.title} preview" loading="lazy" onerror="this.onerror=null;this.src='assets/images/project-1.svg'" />
      </div>
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <div class="card-actions">
        <a href="${p.live}" class="btn small" target="_blank" rel="noopener">Live</a>
        <a href="${p.code}" class="btn small" target="_blank" rel="noopener">Code</a>
      </div>`;
    fragment.appendChild(article);
  }
  grid.appendChild(fragment);
})();

// Register service worker for basic offline support
(function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(function(err){
      // eslint-disable-next-line no-console
      console.warn('SW registration failed', err);
    });
  }
})();

