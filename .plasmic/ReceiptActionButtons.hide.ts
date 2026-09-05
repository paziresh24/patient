/**
 * Hide (do not delete) Plasmic «پیگیری تاخیر پزشک» + «درخواست پشتیبانی این نوبت».
 *
 * Plasmic wraps both in one freeBox: Dialog(dialog2) + support Button as siblings.
 * `data-plasmic-name="dialog2"` often lands on an inner node (not the visible trigger),
 * so hiding dialog2 alone left the CTAs visible next to the new «پشتیبانی» button.
 */
const LEGACY_LABELS = ['پیگیری تاخیر پزشک', 'پیگیری تأخیر پزشک', 'درخواست پشتیبانی این نوبت'] as const;

const normalizeLabel = (text: string) => text.replace(/\s+/g, ' ').trim();

const textMatchesLegacyLabel = (text: string) => {
  const normalized = normalizeLabel(text);
  return LEGACY_LABELS.some(label => normalized === label || normalized.startsWith(label));
};

export function hideLegacySupportAndDelayButtons(root: HTMLElement | null) {
  if (!root) return;

  const dialog2 = root.querySelector('[data-plasmic-name="dialog2"]');
  if (dialog2 instanceof HTMLElement) {
    const box = dialog2.parentElement;
    if (box instanceof HTMLElement && box !== root) {
      box.style.display = 'none';
      return;
    }
    dialog2.style.display = 'none';
  }

  const candidates = root.querySelectorAll('button, a, [role="button"]');
  candidates.forEach(node => {
    if (!(node instanceof HTMLElement)) return;
    if (!textMatchesLegacyLabel(node.textContent ?? '')) return;
    node.style.display = 'none';
    const parent = node.parentElement;
    // If parent only wraps this CTA (+ timer chips), hide the row too.
    if (parent instanceof HTMLElement && parent !== root && parent.childElementCount <= 2) {
      const parentText = normalizeLabel(parent.textContent ?? '');
      if (LEGACY_LABELS.some(label => parentText.includes(label))) {
        parent.style.display = 'none';
      }
    }
  });
}
