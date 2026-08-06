/**
 * A guard for a failure that looks like success.
 *
 * On 2026-08-06 `/yara` shipped to production and returned a perfectly healthy 200
 * with the right title — while every visitor, preview key included, was told the
 * feature was off. The page had no data-fetching method, so Next.js statically
 * optimized it, and a statically optimized page gets **no** `publicRuntimeConfig`
 * at runtime. `CHAT_MVP_ENABLED` read as `undefined` on the client, so the master
 * switch could never be on. Served HTML: `runtimeConfig` had 4 keys instead of 41.
 *
 * Nothing in a normal test run catches that — the components are fine, the gate
 * logic is fine, the route renders. The only observable difference is whether the
 * route opts out of static optimization, so that is what is asserted.
 *
 * This reads the route's source instead of importing it on purpose: importing the
 * page pulls the whole app shell (api client, auth store, ESM-only deps) into jest
 * for a one-line structural fact, and a guard that is expensive to run is a guard
 * that eventually gets deleted.
 */
import { readFileSync } from 'fs';
import { join } from 'path';

const routeSource = readFileSync(join(process.cwd(), 'src/pages/yara/index.tsx'), 'utf8');
/** Comments explain these very words; only real code should be matched against. */
const routeCode = routeSource.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

describe('/yara route', () => {
  it('opts out of static optimization so publicRuntimeConfig reaches the client', () => {
    expect(routeCode).toMatch(/export const getServerSideProps/);
  });

  it('does not gate, redirect, or 404 from the server — the gate is client-side by design', () => {
    expect(routeCode).not.toMatch(/notFound|redirect:/);
  });
});
