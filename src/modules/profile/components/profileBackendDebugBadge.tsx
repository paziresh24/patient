type ProfileBackendKind = 'microservice' | 'legacy' | string;

export type ProfileBackendDebugProps = {
  profile_backend?: ProfileBackendKind | null;
  profile_api_id?: string | number | null;
  profile_fallback_reason?: string | null;
  useSamanAvailabilityStatus?: boolean;
};

/** Compact ops badge — only when ?profileDebug=1 (or profile_debug=1). */
export function ProfileBackendDebugBadge({
  enabled,
  profile_backend,
  profile_api_id,
  profile_fallback_reason,
  useSamanAvailabilityStatus,
}: ProfileBackendDebugProps & { enabled: boolean }) {
  if (!enabled) return null;

  const backend = profile_backend || 'unknown';
  const isMs = backend === 'microservice';
  const isFallback = !!profile_fallback_reason;

  return (
    <div
      dir="ltr"
      className="fixed z-[99999] bottom-3 left-3 max-w-[90vw] rounded-md px-2.5 py-1.5 text-[11px] font-mono shadow-lg border"
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
      </div>
      <div>saman: {useSamanAvailabilityStatus ? 'on' : 'off'}</div>
      {profile_fallback_reason ? <div>reason: {profile_fallback_reason}</div> : null}
    </div>
  );
}
