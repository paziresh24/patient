import { useFeatureValue } from '@growthbook/growthbook-react';

export const useRemovePrefixDoctorName = () => {
  const shouldRemoveDoctorNamePrefix = useFeatureValue('profile:remove-doctor-name-prefix', { prefixes: [] });

  const removePrefixDoctorName = (name: string = '') => {
    if (shouldRemoveDoctorNamePrefix.prefixes.some(prefix => name.includes(prefix))) {
      return name.replace(`${shouldRemoveDoctorNamePrefix.prefixes.find(prefix => name.includes(prefix))} ` ?? '', '');
    }
    return name;
  };

  return removePrefixDoctorName;
};
