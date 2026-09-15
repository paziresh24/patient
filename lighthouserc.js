/**
 * DR-08 (docs/dev-requests/dr-08-listing-pagespeed.md) — Lighthouse CI budget gate for the three
 * highest-traffic listing-page templates (chosen from Search Console clicks + Chrome UX Report
 * field data, see §۱/§۱۱ of the DR-08 doc):
 *
 *   1. /s/                              — bare city-root listing (isLanding=true; CrUX mobile CLS
 *                                          group: 47,065 URLs, CLS 0.22)
 *   2. /s/tehran/dermatology/            — city+specialty listing, the "full" search-results grid
 *                                          (isLanding=false; same template family as the CrUX
 *                                          /s/shiraz/doctor/ group, CLS 0.23 — worst measured)
 *   3. /s/ir/psychology/?turn_type=consult — specialty consult landing (isConsult=true; highest-
 *                                            traffic non-root /s/ page in GSC, 35,288 clicks/3mo)
 *
 * IMPORTANT — what this gate does and does NOT do (be honest about the gap, working-agreements §۱۲):
 * `collect.url` points at the LIVE, already-deployed production site, not a build of the current
 * MR's code. There is no per-MR preview/review-app environment for `patient` today, and building +
 * serving the full SSR app inside a throwaway CI job would need a working Plasmic project token,
 * Sentry/GrowthBook/Firebase config, and reachable internal APIs — none of which are safe or cheap
 * to fake in a lightweight budget-check job (see §۱۳ ladder-of-least-code: this is the "good enough"
 * rung, not the ideal one). So today this is a REGRESSION MONITOR (did prod get worse after a
 * deploy / on a schedule), not a pre-merge blocking gate. The real pre-merge gate needs a per-MR
 * review-app — flagged as the outside-the-box follow-up in the DR-08 doc §۱۱, not built here.
 *
 * Thresholds below encode the field targets from the DR-08 doc (M-1): CLS < 0.1, LCP p75 < 2.5s.
 * INP itself is field-only (no lab equivalent); `total-blocking-time` / `max-potential-fid` are used
 * as the closest lab proxies, per Lighthouse's own documented guidance.
 */
module.exports = {
  ci: {
    collect: {
      url: [
        'https://www.paziresh24.com/s/',
        'https://www.paziresh24.com/s/tehran/dermatology/',
        'https://www.paziresh24.com/s/ir/psychology/?turn_type=consult',
      ],
      numberOfRuns: 5,
      settings: {
        // Lighthouse defaults to mobile emulation+throttling, matching the CrUX evidence that
        // mobile (not desktop) is where these templates fail today.
        onlyCategories: ['performance'],
      },
    },
    assert: {
      assertions: {
        // Field targets (DR-08 M-1), enforced as hard errors — regression fails the pipeline.
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        // INP lab proxies (warn only — TBT/max-potential-fid are correlated with INP, not equal to
        // it; don't let a noisy lab proxy hard-fail the pipeline on its own).
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        'max-potential-fid': ['warn', { maxNumericValue: 300 }],
        // Coarse regression tripwires so an unrelated change can't silently balloon the page.
        'interactive': ['warn', { maxNumericValue: 6000 }],
        'resource-summary:script:size': ['warn', { maxNumericValue: 700000 }],
        'resource-summary:total:size': ['warn', { maxNumericValue: 3000000 }],
        'resource-summary:third-party:count': ['warn', { maxNumericValue: 40 }],
        // verify-the-verifier per working-agreements §۹.۱: an <img> without width/height, or one
        // that's the LCP candidate yet lazy-loaded, must turn this gate red — both are exactly the
        // failure classes found in this DR (see §۱۱ code findings).
        'unsized-images': ['error', { minScore: 1 }],
        'lcp-lazy-loaded': ['error', { minScore: 1 }],
        'categories:performance': ['warn', { minScore: 0.4 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './.lighthouseci',
    },
  },
};
