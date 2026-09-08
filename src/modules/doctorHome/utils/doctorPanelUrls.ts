/** صفحات پنل پزشکان (providers) داخل iframe */
export const DOCTOR_PANEL_URLS = {
  myPatients: 'https://providers.paziresh24.com/app/my-patients/',
  workhours: 'https://providers.paziresh24.com/app/workhour/',
  vacation: 'https://providers.paziresh24.com/app/vacation/',
  tariffs: 'https://providers.paziresh24.com/app/services/',
  bookingSettings: 'https://providers.paziresh24.com/app/setting',
  bills: 'https://providers.paziresh24.com/app/financial/bills',
} as const;

/** Same-origin bounce → ravi-front docside with the doctor session token */
export const RAVI_DOCSIDE_URL = '/dashboard/ravi-docside-handoff';
