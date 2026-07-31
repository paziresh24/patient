import { clearPersistedSelectedCenter } from './selectedCenter';
import { clearPersistedSelectedDate } from './selectedDate';

/** Reset date/center stores and remove their localStorage keys (logout / user mismatch). */
export function clearDoctorHomeViewSelection(): void {
  clearPersistedSelectedDate();
  clearPersistedSelectedCenter();
}
