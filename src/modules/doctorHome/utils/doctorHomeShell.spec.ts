import {
  DOCTOR_HOME_SHELL_KEY,
  DOCTOR_HOME_SHELL_TTL_MS,
  clearDoctorHomeShell,
  readDoctorHomeShell,
  writeDoctorHomeShell,
} from './doctorHomeShell';

describe('doctorHomeShell', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('writes and reads a valid shell', () => {
    writeDoctorHomeShell({
      userId: '42',
      provider: {
        job_title: 'doctor',
        slug: 'dr-test',
        centers: [{ id: 'c1' }],
      },
    });

    const shell = readDoctorHomeShell();
    expect(shell).toMatchObject({
      version: 1,
      userId: '42',
      provider: {
        job_title: 'doctor',
        slug: 'dr-test',
        centers: [{ id: 'c1' }],
      },
    });
    expect(typeof shell?.savedAt).toBe('number');
  });

  it('returns null for bad JSON and removes the key', () => {
    localStorage.setItem(DOCTOR_HOME_SHELL_KEY, '{not-json');
    expect(readDoctorHomeShell()).toBeNull();
    expect(localStorage.getItem(DOCTOR_HOME_SHELL_KEY)).toBeNull();
  });

  it('returns null when TTL expired', () => {
    writeDoctorHomeShell({
      userId: '42',
      savedAt: Date.now() - DOCTOR_HOME_SHELL_TTL_MS - 1,
      provider: {
        job_title: 'doctor',
        centers: [{ id: 'c1' }],
      },
    });
    expect(readDoctorHomeShell()).toBeNull();
    expect(localStorage.getItem(DOCTOR_HOME_SHELL_KEY)).toBeNull();
  });

  it('returns null when centers empty', () => {
    localStorage.setItem(
      DOCTOR_HOME_SHELL_KEY,
      JSON.stringify({
        version: 1,
        userId: '42',
        savedAt: Date.now(),
        provider: { job_title: 'doctor', centers: [] },
      }),
    );
    expect(readDoctorHomeShell()).toBeNull();
  });

  it('clearDoctorHomeShell removes the key', () => {
    writeDoctorHomeShell({
      userId: '42',
      provider: { job_title: 'doctor', centers: [{ id: 'c1' }] },
    });
    clearDoctorHomeShell();
    expect(localStorage.getItem(DOCTOR_HOME_SHELL_KEY)).toBeNull();
  });
});
