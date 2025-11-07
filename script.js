/* ========== Theme Handling ========== */
const root = document.documentElement;
const toggle = document.getElementById('themeToggle');

const getStoredTheme = () => localStorage.getItem('theme-mode') || 'auto';

function applyTheme(mode) {
  if (mode === 'light' || mode === 'dark') {
    root.setAttribute('data-theme', mode);
  } else {
    root.setAttribute('data-theme', 'auto');
  }
  if (toggle) toggle.textContent = mode[0].toUpperCase() + mode.slice(1);
}

function cycleTheme() {
  const current = getStoredTheme();
  const next = current === 'auto' ? 'light' : current === 'light' ? 'dark' : 'auto';
  localStorage.setItem('theme-mode', next);
  applyTheme(next);
}

if (toggle) {
  toggle.addEventListener('click', cycleTheme);
  applyTheme(getStoredTheme());
}

/* ========== Placeholders for mounts ========== */
function mountAnimationDemo() {
  const el = document.getElementById('animationMount');
  if (!el) return;
  el.innerHTML = '';
  const dot = document.createElement('div');
  dot.style.width = '16px';
  dot.style.height = '16px';
  dot.style.borderRadius = '50%';
  dot.style.background = 'var(--accent)';
  dot.style.position = 'relative';
  dot.style.left = '0';
  dot.style.transition = 'left 400ms linear';
  el.appendChild(dot);

  let dir = 1;
  setInterval(() => {
    const max = el.clientWidth - 16;
    const current = parseFloat(dot.style.left) || 0;
    let next = current + dir * 24;
    if (next <= 0 || next >= max) dir *= -1;
    dot.style.left = Math.max(0, Math.min(max, next)) + 'px';
  }, 450);
}

function mountExperienceDemo() {
  const el = document.getElementById('experienceMount');
  if (!el) return;
  el.innerHTML = `
    <ul style="margin:0; padding-left: 18px;">
      <li>Place your experience module here</li>
      <li>Swap this list for a timeline, cards, etc.</li>
    </ul>
  `;
}

/* ========== Header text fitting (full-bleed, ~98% inner width, never wraps) ========== */
(function fitHeader() {
  const title = document.getElementById('headerTitle');
  const header = document.getElementById('header');
  if (!title || !header) return;

  // Ensure intrinsic measuring
  title.style.whiteSpace = 'nowrap';
  title.style.display = 'inline-block';
  title.style.width = 'auto';

  function innerWidth() {
    // Fit to header content box (clientWidth minus paddings)
    const cs = getComputedStyle(header);
    const padL = parseFloat(cs.paddingLeft) || 0;
    const padR = parseFloat(cs.paddingRight) || 0;
    return header.clientWidth - padL - padR; // ≈ 98% of viewport thanks to 1vw gutters
  }

  function fit() {
    const maxW = innerWidth();
    if (maxW <= 0) return;

    // Seed measurable size
    title.style.fontSize = '50px';

    // Binary search precise font-size in px
    let low = 6;       // px
    let high = 2400;   // allow ultra-wide screens
    for (let i = 0; i < 22; i++) {
      const mid = (low + high) / 2;
      title.style.fontSize = mid + 'px';
      const w = title.scrollWidth;
      if (w > maxW) high = mid; else low = mid;
    }
    // Nudge under to avoid subpixel overflow
    title.style.fontSize = (low - 0.5) + 'px';
  }

  // Observe the header box (handles viewport size + full-bleed changes)
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(fit);
    ro.observe(header);
  } else {
    window.addEventListener('resize', fit, { passive: true });
  }

  // Refit after fonts load (ensures Angkor metrics are used)
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fit);
  } else {
    setTimeout(fit, 0);
  }

  // Re-run after tab becomes visible
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) fit();
  });

  // Initial
  fit();
})();

/* ========== Mount demos on DOM ready ========== */
document.addEventListener('DOMContentLoaded', () => {
  mountAnimationDemo();
  mountExperienceDemo();
});
