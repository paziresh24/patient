/**
 * Hide (do not delete) Plasmic «پیگیری تأخیر پزشک» + «درخواست پشتیبانی این نوبت».
 * Those live as `dialog2` and its following siblings in the same freeBox.
 */
export function hideLegacySupportAndDelayButtons(root: HTMLElement | null) {
  if (!root) return;
  const dialog2 = root.querySelector('[data-plasmic-name="dialog2"]');
  if (!(dialog2 instanceof HTMLElement)) return;
  dialog2.style.display = 'none';
  let sibling = dialog2.nextElementSibling;
  while (sibling) {
    if (sibling instanceof HTMLElement) sibling.style.display = 'none';
    sibling = sibling.nextElementSibling;
  }
}
