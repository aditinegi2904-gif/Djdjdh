/**
 * RoboMind AI — Main JS
 * Navbar scroll, hamburger menu, hero particles
 */

// ─── Navbar scroll effect ───────────────────────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  });
}

// ─── Hamburger menu ──────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
  });
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.textContent = '☰';
    }
  });
}

// ─── Hero Particles ──────────────────────────────────────────
const particleContainer = document.getElementById('particles');
if (particleContainer) {
  const COUNT = 30;
  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left     = `${Math.random() * 100}vw`;
    p.style.animationDuration = `${6 + Math.random() * 10}s`;
    p.style.animationDelay   = `${Math.random() * 8}s`;
    p.style.opacity           = Math.random() * 0.6;
    // Occasional bright green particle
    if (Math.random() > 0.8) p.style.background = '#39ff14';
    particleContainer.appendChild(p);
  }
}

// ─── Intersection Observer for card entrance animations ──────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.feature-card, .step, .card').forEach((el, i) => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;
  observer.observe(el);
});
