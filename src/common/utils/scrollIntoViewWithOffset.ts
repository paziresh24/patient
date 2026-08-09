export const scrollIntoViewWithOffset = (selector: string, offset: number) => {
  const el = typeof document !== 'undefined' ? document.querySelector(selector) : null;
  if (!el) return;

  const top = el.getBoundingClientRect().top - document.body.getBoundingClientRect().top - offset;
  if (!Number.isFinite(top)) return;

  window.scrollTo({
    behavior: 'smooth',
    top,
  });
};

export default scrollIntoViewWithOffset;
