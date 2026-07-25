/**
 * Generic UI location snapshot for the voice agent.
 * No per-page classifiers — every route sends the same shape.
 */

export type UiContextValue = string | string[];

export type UiContext = {
  /** Full in-app URL including query string (no origin), e.g. `/_/chats/abc?tab=1`. */
  url: string;
  /** Path only (no query / hash). */
  path: string;
  /** Next.js route pattern, e.g. `/_/chats/[[...hami]]` or `/booking/[slug]`. */
  route: string;
  /** Query-string params only (from the URL search). */
  query: Record<string, UiContextValue>;
  /** Dynamic route params parsed from the route pattern + router.query. */
  params: Record<string, UiContextValue>;
};

/** LiveKit data-channel topic for live UI context updates. */
export const UI_CONTEXT_TOPIC = 'ui_context';

function splitUrl(asPath: string): { path: string; search: string } {
  const raw = asPath.startsWith('/') ? asPath : `/${asPath}`;
  const hash = raw.indexOf('#');
  const withoutHash = hash >= 0 ? raw.slice(0, hash) : raw;
  const q = withoutHash.indexOf('?');
  if (q < 0) return { path: withoutHash || '/', search: '' };
  return { path: withoutHash.slice(0, q) || '/', search: withoutHash.slice(q + 1) };
}

function parseSearch(search: string): Record<string, UiContextValue> {
  if (!search) return {};
  const out: Record<string, UiContextValue> = {};
  const params = new URLSearchParams(search);
  params.forEach((value, key) => {
    const existing = out[key];
    if (existing === undefined) {
      out[key] = value;
      return;
    }
    out[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
  });
  return out;
}

/** Names of dynamic segments in a Next.js pathname: `[id]`, `[...slug]`, `[[...hami]]`. */
export function dynamicParamNames(route: string): string[] {
  const names: string[] = [];
  const re = /\[\[(?:\.\.\.)?([^\]]+)\]\]|\[(?:\.\.\.)?([^\]]+)\]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(route))) {
    const name = m[1] || m[2];
    if (name) names.push(name);
  }
  return names;
}

function pickParams(
  route: string,
  routerQuery: Record<string, string | string[] | undefined>,
): Record<string, UiContextValue> {
  const out: Record<string, UiContextValue> = {};
  for (const name of dynamicParamNames(route)) {
    const value = routerQuery[name];
    if (value === undefined) continue;
    out[name] = value;
  }
  return out;
}

function compactQuery(
  query: Record<string, string | string[] | undefined>,
): Record<string, UiContextValue> {
  const out: Record<string, UiContextValue> = {};
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) continue;
    out[key] = value;
  }
  return out;
}

export type BuildUiContextInput = {
  asPath: string;
  pathname: string;
  /** Next.js `router.query` (dynamic params + query string merged). */
  query?: Record<string, string | string[] | undefined>;
};

/**
 * Build a generic location context for any page in the app.
 */
export function buildUiContext({ asPath, pathname, query = {} }: BuildUiContextInput): UiContext {
  const { path, search } = splitUrl(asPath);
  const route = pathname || '';
  const searchQuery = parseSearch(search);
  // Prefer URL search for `query`; fall back to router.query keys that aren't dynamic params.
  const dynamicNames = new Set(dynamicParamNames(route));
  const fromRouter: Record<string, UiContextValue> = {};
  for (const [key, value] of Object.entries(compactQuery(query))) {
    if (dynamicNames.has(key)) continue;
    if (searchQuery[key] !== undefined) continue;
    fromRouter[key] = value;
  }

  return {
    url: asPath.startsWith('/') ? asPath.split('#')[0] : `/${asPath.split('#')[0]}`,
    path,
    route,
    query: { ...fromRouter, ...searchQuery },
    params: pickParams(route, query),
  };
}

export function uiContextKey(ctx: UiContext): string {
  return JSON.stringify({
    url: ctx.url,
    route: ctx.route,
    query: ctx.query,
    params: ctx.params,
  });
}
