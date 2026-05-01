const HAMDAST_PROFILE_VIEW_STORAGE_KEY = 'hamdast_doctor_profile_views_v1';

type DoctorProfileViewRecord = {
  doctorId: string;
  count: number;
  lastViewedAt: number;
};

const isClient = () => typeof window !== 'undefined';

const normalizeRecord = (record: any): DoctorProfileViewRecord | null => {
  const doctorId = record?.doctorId ? String(record.doctorId) : '';
  if (!doctorId) return null;

  const rawCount = Number(record?.count);
  const rawLastViewedAt = Number(record?.lastViewedAt);

  return {
    doctorId,
    count: Number.isFinite(rawCount) && rawCount > 0 ? Math.floor(rawCount) : 1,
    lastViewedAt: Number.isFinite(rawLastViewedAt) && rawLastViewedAt > 0 ? Math.floor(rawLastViewedAt) : Date.now(),
  };
};

const readRecords = (): DoctorProfileViewRecord[] => {
  if (!isClient()) return [];

  try {
    const raw = window.localStorage.getItem(HAMDAST_PROFILE_VIEW_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map(normalizeRecord)
      .filter((record): record is DoctorProfileViewRecord => Boolean(record));
  } catch {
    return [];
  }
};

const writeRecords = (records: DoctorProfileViewRecord[]) => {
  if (!isClient()) return;

  try {
    window.localStorage.setItem(HAMDAST_PROFILE_VIEW_STORAGE_KEY, JSON.stringify(records));
  } catch {
    // ignore write errors on private mode / quota limits
  }
};

export const trackDoctorProfileViewByDoctorId = (doctorId: string | number) => {
  const normalizedDoctorId = String(doctorId || '').trim();
  if (!normalizedDoctorId) return;

  const now = Date.now();
  const records = readRecords();
  const targetIndex = records.findIndex(record => record.doctorId === normalizedDoctorId);

  if (targetIndex === -1) {
    records.push({
      doctorId: normalizedDoctorId,
      count: 1,
      lastViewedAt: now,
    });
  } else {
    records[targetIndex] = {
      doctorId: normalizedDoctorId,
      count: records[targetIndex].count + 1,
      lastViewedAt: now,
    };
  }

  writeRecords(records);
};

export const getTopVisitedDoctorIds = (limit = 5): string[] => {
  if (limit <= 0) return [];

  return readRecords()
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return b.lastViewedAt - a.lastViewedAt;
    })
    .slice(0, limit)
    .map(record => record.doctorId);
};
