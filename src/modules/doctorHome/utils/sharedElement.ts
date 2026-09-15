export type OriginRect = { x: number; y: number; width: number; height: number };

export const captureOriginRect = (el: EventTarget | Element | null): OriginRect | null => {
  if (!el || !(el instanceof Element)) return null;
  const node = el instanceof HTMLElement ? el : el.parentElement;
  if (!node) return null;
  const r = node.getBoundingClientRect();
  if (r.width < 2 || r.height < 2) return null;
  return { x: r.left, y: r.top, width: r.width, height: r.height };
};

export const originTransformOrigin = (origin: OriginRect, panel: OriginRect) => {
  const ox = origin.x + origin.width / 2 - panel.x;
  const oy = origin.y + origin.height / 2 - panel.y;
  return `${ox}px ${oy}px`;
};

/** Approximate Vaul sheet header (fullHeight 90dvh). */
export const mobileSheetHeaderTarget = (): OriginRect => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  return { x: 0, y: h * 0.1, width: w, height: 56 };
};

export const desktopSheetHeaderTarget = (fullHeight: boolean): OriginRect => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const maxW = fullHeight ? Math.min(42 * 16, vw - 40) : Math.min(28 * 16, vw - 40);
  const panelH = fullHeight ? Math.min(vh * 0.88, vh - 40) : Math.min(vh * 0.85, 36 * 16);
  return {
    x: (vw - maxW) / 2 + 52,
    y: (vh - panelH) / 2,
    width: Math.max(120, maxW - 52),
    height: 64,
  };
};
