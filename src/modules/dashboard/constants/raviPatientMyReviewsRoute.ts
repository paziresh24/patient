/** Hamdast Ravi app still publishes this menu key; patient list is on ravi-front. */
export function isRaviPatientMyReviewsMenu(appKey?: string, menuKey?: string): boolean {
  return appKey === 'ravi' && menuKey === 'my_feedbacks';
}
