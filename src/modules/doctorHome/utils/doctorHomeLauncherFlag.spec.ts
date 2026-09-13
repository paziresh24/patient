import {
  DOCTOR_HOME_LAUNCHER_FLAG_KEY,
  DOCTOR_HOME_LAUNCHER_FLAG_TTL_MS,
  clearPersistedLauncherFlag,
  readPersistedLauncherFlag,
  readTrustedEnabledLauncherFlag,
  writePersistedLauncherFlag,
} from './doctorHomeLauncherFlag';

describe('doctorHomeLauncherFlag', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('writes and reads enabled for matching userId', () => {
    writePersistedLauncherFlag('42', true);
    expect(readPersistedLauncherFlag('42')).toBe(true);
  });

  it('reads enabled: false', () => {
    writePersistedLauncherFlag('42', false);
    expect(readPersistedLauncherFlag('42')).toBe(false);
  });

  it('returns null for different userId without removing key', () => {
    writePersistedLauncherFlag('42', true);
    expect(readPersistedLauncherFlag('99')).toBeNull();
    expect(localStorage.getItem(DOCTOR_HOME_LAUNCHER_FLAG_KEY)).not.toBeNull();
  });

  it('returns null for bad JSON and removes the key', () => {
    localStorage.setItem(DOCTOR_HOME_LAUNCHER_FLAG_KEY, '{bad');
    expect(readPersistedLauncherFlag('42')).toBeNull();
    expect(localStorage.getItem(DOCTOR_HOME_LAUNCHER_FLAG_KEY)).toBeNull();
  });

  it('returns null when TTL expired', () => {
    localStorage.setItem(
      DOCTOR_HOME_LAUNCHER_FLAG_KEY,
      JSON.stringify({
        version: 1,
        userId: '42',
        enabled: true,
        savedAt: Date.now() - DOCTOR_HOME_LAUNCHER_FLAG_TTL_MS - 1,
      }),
    );
    expect(readPersistedLauncherFlag('42')).toBeNull();
    expect(localStorage.getItem(DOCTOR_HOME_LAUNCHER_FLAG_KEY)).toBeNull();
  });

  it('clearPersistedLauncherFlag removes the key', () => {
    writePersistedLauncherFlag('42', true);
    clearPersistedLauncherFlag();
    expect(localStorage.getItem(DOCTOR_HOME_LAUNCHER_FLAG_KEY)).toBeNull();
  });

  it('readTrustedEnabledLauncherFlag returns true for persisted true', () => {
    writePersistedLauncherFlag('42', true);
    expect(readTrustedEnabledLauncherFlag('42')).toBe(true);
    expect(localStorage.getItem(DOCTOR_HOME_LAUNCHER_FLAG_KEY)).not.toBeNull();
  });

  it('readTrustedEnabledLauncherFlag clears sticky false and returns null', () => {
    writePersistedLauncherFlag('42', false);
    expect(readTrustedEnabledLauncherFlag('42')).toBeNull();
    expect(localStorage.getItem(DOCTOR_HOME_LAUNCHER_FLAG_KEY)).toBeNull();
  });

  it('readTrustedEnabledLauncherFlag returns null when missing', () => {
    expect(readTrustedEnabledLauncherFlag('42')).toBeNull();
  });
});
