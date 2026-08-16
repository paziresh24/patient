type ProfileBackendKind = 'microservice' | 'legacy' | string;

export type ProfileMsPerfTimings = {
  total_ms?: number;
  bundle_ms?: number;
  parallel_ms?: number;
  reviews_ms?: number;
  services_ms?: number;
  widgets_ms?: number;
  legacy_fp_ok?: boolean;
  services_hydrated?: number;
  saman_ssr?: string;
  parallelized?: boolean;
};

export type ProfileDebugMeta = {
  centers?: number;
  services?: number;
  channels?: string[];
  similar_links?: number;
  hamdast_widgets?: number;
  page_views?: string | number | null;
};

export type ProfileBackendDebugProps = {
  profile_backend?: ProfileBackendKind | null;
  profile_api_id?: string | number | null;
  profile_fallback_reason?: string | null;
  useSamanAvailabilityStatus?: boolean;
  slug?: string | null;
  profile_type?: string | null;
  isBulk?: boolean;
  shouldFetchOnClient?: boolean;
  profile_perf?: ProfileMsPerfTimings | null;
  profile_debug_meta?: ProfileDebugMeta | null;
};

/** Compact ops badge — only when ?profileDebug=1 (or profile_debug=1). */
export function ProfileBackendDebugBadge({
  enabled,
  profile_backend,
  profile_api_id,
  profile_fallback_reason,
  useSamanAvailabilityStatus,
  slug,
  profile_type,
  isBulk,
  shouldFetchOnClient,
  profile_perf,
  profile_debug_meta,
}: ProfileBackendDebugProps & { enabled: boolean }) {
  if (!enabled) return null;

  const backend = profile_backend || 'unknown';
  const isMs = backend === 'microservice';
  const isFallback = !!profile_fallback_reason;
  const meta = profile_debug_meta;
  const perf = profile_perf;

  return (
    <div
      dir="ltr"
      className="fixed z-[99999] bottom-3 left-3 max-w-[min(96vw,28rem)] rounded-md px-2.5 py-1.5 text-[11px] font-mono shadow-lg border leading-snug"
      style={{
        background: isMs ? '#052e16' : isFallback ? '#431407' : '#1e293b',
        color: '#f8fafc',
        borderColor: isMs ? '#16a34a' : isFallback ? '#ea580c' : '#64748b',
      }}
      data-testid="profile-backend-debug-badge"
    >
      <div>
        backend: <strong>{backend}</strong>
        {profile_api_id != null && profile_api_id !== '' ? ` · api_id=${profile_api_id}` : ''}
        {profile_type ? ` · type=${profile_type}` : ''}
      </div>
      {slug ? <div>slug: {slug}</div> : null}
      <div>
        saman: {useSamanAvailabilityStatus ? 'on' : 'off'}
        {perf?.saman_ssr ? ` (ssr=${perf.saman_ssr})` : ''}
        {typeof isBulk === 'boolean' ? ` · bulk=${isBulk ? 'yes' : 'no'}` : ''}
        {typeof shouldFetchOnClient === 'boolean' ? ` · csr=${shouldFetchOnClient ? 'yes' : 'no'}` : ''}
      </div>
      {meta ? (
        <div>
          centers={meta.centers ?? 0} · services={meta.services ?? 0} · channels=
          {Array.isArray(meta.channels) && meta.channels.length > 0 ? meta.channels.join(',') : '—'} · similar=
          {meta.similar_links ?? 0} · widgets={meta.hamdast_widgets ?? 0}
          {meta.page_views != null && meta.page_views !== '' ? ` · views=${meta.page_views}` : ''}
        </div>
      ) : null}
      {perf ? (
        <div>
          ssr: total={perf.total_ms ?? '—'}ms · bundle={perf.bundle_ms ?? '—'} · parallel={perf.parallel_ms ?? '—'} ·
          reviews={perf.reviews_ms ?? '—'} · services={perf.services_ms ?? '—'} · widgets={perf.widgets_ms ?? '—'}
          {typeof perf.legacy_fp_ok === 'boolean' ? ` · fp=${perf.legacy_fp_ok ? 'ok' : 'miss'}` : ''}
          {typeof perf.services_hydrated === 'number' ? ` · svc_fetch=${perf.services_hydrated}` : ''}
        </div>
      ) : isMs ? (
        <div>ssr timings: (none — refresh hard navigation)</div>
      ) : null}
      {profile_fallback_reason ? <div>reason: {profile_fallback_reason}</div> : null}
      <div className="opacity-80 text-[10px] mt-0.5">?profileDebug=1 · MS PageSpeed path only changes microservice SSR</div>
    </div>
  );
}
