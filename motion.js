(() => {
  'use strict';
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = value => Math.max(0, Math.min(1, value));
  const easeOutCubic = value => 1 - (1 - value) ** 3;
  const easeInOutCubic = value => value < 0.5 ? 4 * value ** 3 : 1 - (-2 * value + 2) ** 3 / 2;

  // A short, distance-aware scroll keeps the journey between sections visible.
  let scrollFrame = 0;
  function cancelSectionScroll() {
    cancelAnimationFrame(scrollFrame);
    scrollFrame = 0;
  }
  function focusSection(target) {
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }
  function scrollToSection(target) {
    cancelSectionScroll();
    const startY = window.scrollY;
    const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const endY = Math.min(maxY, Math.max(0, target.getBoundingClientRect().top + startY - padding));
    const distance = endY - startY;
    if (motionPreference.matches || Math.abs(distance) < 2) {
      window.scrollTo({ top: endY, behavior: 'instant' });
      focusSection(target);
      return;
    }
    const duration = Math.min(680, Math.max(320, Math.abs(distance) * 0.12));
    const began = performance.now();
    function step(now) {
      const progress = clamp((now - began) / duration);
      window.scrollTo({ top: startY + distance * easeInOutCubic(progress), behavior: 'instant' });
      if (progress < 1) scrollFrame = requestAnimationFrame(step);
      else { scrollFrame = 0; focusSection(target); }
    }
    scrollFrame = requestAnimationFrame(step);
  }
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const hash = link.getAttribute('href');
      const target = document.getElementById(hash.slice(1));
      if (!target) return;
      event.preventDefault();
      if (window.location.hash !== hash) history.pushState(null, '', hash);
      scrollToSection(target);
    });
  });
  window.addEventListener('wheel', cancelSectionScroll, { passive: true });
  window.addEventListener('touchstart', cancelSectionScroll, { passive: true });
  window.addEventListener('pointerdown', cancelSectionScroll, { passive: true });
  window.addEventListener('keydown', event => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) cancelSectionScroll();
  });

  // Sample the real hero geometry and lettering so particles assemble its actual artwork.
  const hero = document.querySelector('.strange-feature');
  const canvas = document.getElementById('hero-particles');
  const replay = document.getElementById('replay-hero');
  if (!hero || !canvas || !replay) return;
  let introFrame = 0;
  let introRun = 0;
  function clearHeroIntro() {
    cancelAnimationFrame(introFrame);
    introFrame = 0;
    introRun++;
    hero.classList.remove('intro-running', 'intro-reveal');
    canvas.hidden = true;
    canvas.style.opacity = '';
    replay.disabled = false;
  }
  function buildHeroTargets(bounds) {
    const points = [];
    const push = (x, y, color) => {
      if (Number.isFinite(x) && Number.isFinite(y) && x >= 0 && y >= 0 && x <= bounds.width && y <= bounds.height) points.push({ x, y, color });
    };
    const svg = hero.querySelector('.orbital svg');
    svg.querySelectorAll('path, circle, ellipse').forEach(shape => {
      if (typeof shape.getTotalLength !== 'function') return;
      const matrix = shape.getScreenCTM();
      if (!matrix) return;
      const length = shape.getTotalLength();
      const scale = Math.hypot(matrix.a, matrix.b);
      const count = Math.max(5, Math.min(90, Math.ceil(length * scale / 9)));
      const stroke = shape.getAttribute('stroke');
      const color = stroke?.startsWith('#') ? stroke : '#bda6e5';
      for (let i = 0; i <= count; i++) {
        const point = shape.getPointAtLength(length * i / count);
        push(matrix.a * point.x + matrix.c * point.y + matrix.e - bounds.left,
          matrix.b * point.x + matrix.d * point.y + matrix.f - bounds.top, color);
      }
    });
    // Lightweight text masks include the top caption, project name and arrow button.
    hero.querySelectorAll('.art-top .micro, .art-bottom .micro, .art-bottom h3, .art-bottom p, .circle-button, .floating-label').forEach(element => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      const mask = document.createElement('canvas');
      mask.width = Math.max(1, Math.ceil(rect.width));
      mask.height = Math.max(1, Math.ceil(rect.height));
      const context = mask.getContext('2d');
      if (!context) return;
      context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      context.textBaseline = 'middle';
      context.fillStyle = '#fff';
      const centered = element.classList.contains('circle-button');
      context.textAlign = centered ? 'center' : 'left';
      context.fillText(element.textContent.trim(), centered ? rect.width / 2 : 0, rect.height / 2);
      const pixels = context.getImageData(0, 0, mask.width, mask.height).data;
      const spacing = parseFloat(style.fontSize) > 18 ? 5 : 3;
      for (let y = 0; y < mask.height; y += spacing) {
        for (let x = 0; x < mask.width; x += spacing) {
          if (pixels[(y * mask.width + x) * 4 + 3] > 80) push(rect.left - bounds.left + x, rect.top - bounds.top + y, '#7b5b9f');
        }
      }
    });
    // The border and action circle converge with the visual instead of appearing separately.
    for (let x = 14; x < bounds.width - 14; x += 18) { push(x, 1, '#a98ccf'); push(x, bounds.height - 1, '#a98ccf'); }
    for (let y = 14; y < bounds.height - 14; y += 18) { push(1, y, '#a98ccf'); push(bounds.width - 1, y, '#a98ccf'); }
    const button = hero.querySelector('.circle-button').getBoundingClientRect();
    for (let i = 0; i < 28; i++) {
      const angle = i / 28 * Math.PI * 2;
      push(button.left - bounds.left + button.width / 2 + Math.cos(angle) * button.width / 2,
        button.top - bounds.top + button.height / 2 + Math.sin(angle) * button.height / 2, '#d9f5a8');
    }
    // Cap work per frame on small devices while retaining points throughout the panel.
    const stride = Math.max(1, Math.ceil(points.length / 620));
    return points.filter((_, index) => index % stride === 0);
  }
  function playHeroIntro() {
    clearHeroIntro();
    if (motionPreference.matches) return;
    const context = canvas.getContext('2d');
    const bounds = hero.getBoundingClientRect();
    if (!context || !bounds.width || !bounds.height) return;
    let targets;
    try { targets = buildHeroTargets(bounds); } catch (_) { return; }
    if (!targets.length) return;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.ceil(bounds.width * pixelRatio);
    canvas.height = Math.ceil(bounds.height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    const particles = targets.map((target, index) => {
      const angle = index * 2.399963;
      const spread = bounds.width * (0.72 + Math.random() * 0.45);
      return { ...target, angle, fromX: target.x + Math.cos(angle) * spread,
        fromY: target.y + Math.sin(angle) * spread, delay: Math.random() * 260, radius: 0.8 + Math.random() * 0.8 };
    });
    const run = ++introRun;
    const began = performance.now();
    replay.disabled = true;
    canvas.hidden = false;
    canvas.style.opacity = '1';
    hero.classList.add('intro-running');
    function step(now) {
      if (run !== introRun) return;
      const elapsed = now - began;
      try {
        context.clearRect(0, 0, bounds.width, bounds.height);
        for (const particle of particles) {
          const progress = clamp((elapsed - particle.delay) / 1450);
          const arrive = easeOutCubic(progress);
          const curl = Math.sin(progress * Math.PI) * 28;
          const x = particle.fromX + (particle.x - particle.fromX) * arrive + Math.cos(particle.angle + progress * Math.PI) * curl;
          const y = particle.fromY + (particle.y - particle.fromY) * arrive + Math.sin(particle.angle + progress * Math.PI) * curl;
          context.beginPath();
          context.fillStyle = particle.color;
          context.arc(x, y, particle.radius, 0, Math.PI * 2);
          context.fill();
        }
        if (elapsed >= 1300) hero.classList.add('intro-reveal');
        canvas.style.opacity = String(1 - clamp((elapsed - 1450) / 650));
        if (elapsed < 2200) introFrame = requestAnimationFrame(step);
        else clearHeroIntro();
      } catch (_) { clearHeroIntro(); }
    }
    introFrame = requestAnimationFrame(step);
  }
  replay.addEventListener('click', playHeroIntro);
  window.addEventListener('resize', clearHeroIntro, { passive: true });
  window.addEventListener('pagehide', () => { clearHeroIntro(); cancelSectionScroll(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) clearHeroIntro(); });
  motionPreference.addEventListener?.('change', event => {
    if (event.matches) { clearHeroIntro(); cancelSectionScroll(); }
  });
  // One entrance per page load; replay is the only way to start it again.
  requestAnimationFrame(playHeroIntro);
})();
