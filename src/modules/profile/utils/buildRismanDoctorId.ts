/**
 * Risman API expects doctor_id as `doctor_{owner_id}_{server_id}`.
 * @see https://apigw.paziresh24.com/v1/risman/doctors/
 */
export function buildRismanDoctorId(ownerId?: string | null, serverId?: string | number | null): string | undefined {
  if (ownerId == null || String(ownerId).trim() === '') return undefined;

  const normalizedOwnerId = String(ownerId).trim();
  if (normalizedOwnerId.startsWith('doctor_')) return normalizedOwnerId;

  const normalizedServerId =
    serverId != null && String(serverId).trim() !== '' ? String(serverId).trim() : '1';

  return `doctor_${normalizedOwnerId}_${normalizedServerId}`;
}
