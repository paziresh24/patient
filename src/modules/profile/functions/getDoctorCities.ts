import { CENTERS } from '@/common/types/centers';

export const getInPersonCenters = (centers: any[]) =>
  (centers ?? []).filter((c: any) => c?.city && c.id !== CENTERS.CONSULT);

export const getDoctorCities = (centers: any[]): string[] => {
  const citySlugs = new Set<string>();
  const cities: string[] = [];

  getInPersonCenters(centers).forEach((c: any) => {
    const key = c.city_en_slug || c.city;
    if (citySlugs.has(key)) return;
    citySlugs.add(key);
    cities.push(c.city);
  });

  return cities;
};

export const joinDoctorCities = (cities: string[]): string => {
  if (cities.length === 0) return '';
  if (cities.length === 1) return cities[0];
  if (cities.length === 2) return `${cities[0]} و ${cities[1]}`;

  const lastCity = cities[cities.length - 1];
  return `${cities.slice(0, -1).join('، ')} و ${lastCity}`;
};

export const formatDoctorCitiesForTitle = (centers: any[]): string => {
  const label = joinDoctorCities(getDoctorCities(centers));
  return label ? `${label}،` : '';
};

export const formatDoctorCitiesPhrase = (centers: any[]): string => {
  const cities = getDoctorCities(centers);
  if (cities.length === 0) return 'در شهر (ثبت نشده) است';
  if (cities.length === 1) return `در شهر ${cities[0]} است`;
  return `در شهرهای ${joinDoctorCities(cities)} فعال است`;
};

export const getPrimaryInPersonCenter = (centers: any[]) => {
  const inPersonCenters = getInPersonCenters(centers);
  return inPersonCenters.find((c: any) => c.center_type === 1) ?? inPersonCenters[0] ?? centers?.[0];
};
