#!/usr/bin/env node
/**
 * Generates src/common/fragment/argProps.generated.ts — DR-08 §۲۰.
 *
 * Why this exists: src/common/fragment/components.tsx loads every Plasmic component through
 * `dynamic(() => import(...))` so it stays out of the initial bundle, but it *also* imported
 * `Plasmic<X>__ArgProps` from the very same modules with a plain static import. `__ArgProps` is a
 * runtime value (`new Array<ArgPropType>("a", "b")`), not a type, so those static imports pulled
 * each component module — and, more expensively, its CSS — straight back into the initial graph.
 * The `dynamic()` calls were paying the code-splitting complexity and buying nothing.
 *
 * Measured on a production build of the listing page by stripping the static imports:
 *   page CSS 510KB -> 263KB (-48%)   page JS 2195KB -> 1071KB (-51%)   (uncompressed)
 *
 * The arrays themselves are just lists of prop names, so they can live in one tiny generated file
 * that imports nothing. Drift is guarded two ways: this script runs as part of `npm run build`, and
 * argProps.generated.spec.ts re-derives the map from the .plasmic sources and fails on mismatch.
 */
const fs = require('fs');
const path = require('path');

const PLASMIC_ROOT = path.join(__dirname, '..', '.plasmic', 'plasmic');
const OUT = path.join(__dirname, '..', 'src', 'common', 'fragment', 'argProps.generated.ts');

/** `export const PlasmicFoo__ArgProps = new Array<ArgPropType>("a", "b");` → ['a','b'] */
const DECL = /export const (Plasmic\w+__ArgProps)\s*=\s*new Array<ArgPropType>\(([\s\S]*?)\);/g;

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (entry.name.endsWith('.tsx')) out.push(p);
  }
  return out;
}

function collect() {
  const map = {};
  for (const file of walk(PLASMIC_ROOT)) {
    const src = fs.readFileSync(file, 'utf8');
    let m;
    DECL.lastIndex = 0;
    while ((m = DECL.exec(src))) {
      const [, name, body] = m;
      const props = [...body.matchAll(/"([^"]+)"/g)].map(x => x[1]);
      // Two Plasmic projects can define a component with the same name. They are identical by
      // construction (same component, re-exported per project), so a stable sort keeps the output
      // deterministic instead of depending on directory-walk order.
      if (!map[name] || map[name].join() < props.join()) map[name] = props;
    }
  }
  return map;
}

function render(map) {
  const keys = Object.keys(map).sort();
  const body = keys.map(k => `  ${k}: [${map[k].map(p => JSON.stringify(p)).join(', ')}],`).join('\n');
  return `/* eslint-disable */
// GENERATED FILE — do not edit by hand.
// Produced by scripts/generate-fragment-arg-props.js (runs as part of \`npm run build\`).
// See DR-08 §۲۰: importing these arrays from the Plasmic modules themselves dragged every
// component and its CSS into the initial bundle, defeating the dynamic() split in components.tsx.

export const FRAGMENT_ARG_PROPS: Record<string, string[]> = {
${body}
};

export default FRAGMENT_ARG_PROPS;
`;
}

const map = collect();
if (Object.keys(map).length === 0) {
  console.error('generate-fragment-arg-props: found no __ArgProps declarations — refusing to write an empty map');
  process.exit(1);
}
fs.writeFileSync(OUT, render(map), 'utf8');
console.log(`generate-fragment-arg-props: wrote ${Object.keys(map).length} entries to ${path.relative(process.cwd(), OUT)}`);

module.exports = { collect, render };
