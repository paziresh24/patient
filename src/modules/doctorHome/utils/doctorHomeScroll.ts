/** Preserve window scroll across doctor-home sheet open/close (incl. history.back). */

let savedScrollY = 0;
let restoreRaf: number | null = null;
let restoreTimeouts: ReturnType<typeof setTimeout>[] = [];

export const captureDoctorHomeScroll = () => {
  if (typeof window === 'undefined') return;
  const y = window.scrollY || window.pageYOffset || 0;
  // Vaul/iOS pin body with position:fixed and report scrollY=0 — don't clobber a real offset.
  if (y === 0 && savedScrollY > 0) return;
  savedScrollY = y;
};

export const getSavedDoctorHomeScroll = () => savedScrollY;

const scrollToSaved = () => {
  if (typeof window === 'undefined') return;
  const y = savedScrollY;
  const html = document.documentElement;
  const body = document.body;

  // Avoid smooth scroll fighting our restore.
  const prevHtmlBehavior = html.style.scrollBehavior;
  const prevBodyBehavior = body.style.scrollBehavior;
  html.style.scrollBehavior = 'auto';
  body.style.scrollBehavior = 'auto';

  window.scrollTo(0, y);
  html.scrollTop = y;
  body.scrollTop = y;

  html.style.scrollBehavior = prevHtmlBehavior;
  body.style.scrollBehavior = prevBodyBehavior;
};

/** Restore after sheet close / popstate — re-apply a few times to beat Next/Vaul races. */
export const restoreDoctorHomeScroll = () => {
  if (typeof window === 'undefined') return;

  if (restoreRaf != null) cancelAnimationFrame(restoreRaf);
  restoreTimeouts.forEach(clearTimeout);
  restoreTimeouts = [];

  scrollToSaved();

  restoreRaf = requestAnimationFrame(() => {
    scrollToSaved();
    restoreRaf = requestAnimationFrame(() => {
      scrollToSaved();
      restoreRaf = null;
    });
  });

  // Vaul / iOS sometimes apply body unlock after animation (~300–500ms).
  for (const delay of [50, 120, 280, 450]) {
    restoreTimeouts.push(setTimeout(scrollToSaved, delay));
  }
};
