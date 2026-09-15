/** Sync DOM shield — React setState is too late for overlay pointerup/click retargeting. */
let shieldEl: HTMLDivElement | null = null;
let shieldTimer: ReturnType<typeof setTimeout> | undefined;

export function armDismissClickShield(ms = 500) {
  if (typeof document === 'undefined') return;

  if (!shieldEl) {
    shieldEl = document.createElement('div');
    shieldEl.setAttribute('aria-hidden', 'true');
    shieldEl.style.cssText =
      'position:fixed;inset:0;z-index:2147483646;touch-action:none;cursor:default;';
    document.documentElement.appendChild(shieldEl);
  }

  window.clearTimeout(shieldTimer);
  shieldTimer = window.setTimeout(() => {
    shieldEl?.remove();
    shieldEl = null;
  }, ms);
}
