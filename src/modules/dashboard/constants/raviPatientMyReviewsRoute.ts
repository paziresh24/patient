/** Hamdast Ravi app still publishes this menu key; patient list is on ravi-front. */
export function isRaviPatientMyReviewsMenu(appKey?: string, menuKey?: string): boolean {
  return appKey === 'ravi' && menuKey === 'my_feedbacks';
}

/**
 * Parent «نظرات» must expand only when it has children.
 * Its hamdast home key is my_feedbacks, which hard-redirects to ravi-front and would skip the submenu.
 */
export function raviAppParentLink(
  appKey: string,
  homeKey: string | undefined,
  hasSubMenu: boolean,
): string | undefined {
  if (appKey === 'ravi' && hasSubMenu) return undefined;
  if (!homeKey) return undefined;
  return `/dashboard/apps/${appKey}/${homeKey}/`;
}
