const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

const inr = (paise: number, sign = '') =>
  sign + '₹' + (paise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Counts a `data-count="<paise>"` element up from zero, keeping its sign prefix. */
function countUp(el: HTMLElement) {
  const target = Number(el.dataset.count);
  const sign = el.dataset.sign ?? '';
  if (!Number.isFinite(target) || reduced()) return;
  const duration = 1400;
  const start = performance.now();
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 4);
    el.textContent = inr(Math.round(target * eased), sign);
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/** Reveals `[data-reveal]` blocks as they scroll into view and starts their count-ups. */
export function initReveal() {
  const blocks = document.querySelectorAll<HTMLElement>('[data-reveal]');
  const counters = document.querySelectorAll<HTMLElement>('[data-count]');

  if (!('IntersectionObserver' in window)) {
    blocks.forEach((b) => b.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        io.unobserve(el);
        if (el.hasAttribute('data-count')) countUp(el);
        else el.classList.add('is-in');
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
  );

  blocks.forEach((b) => io.observe(b));
  counters.forEach((c) => io.observe(c));
}
