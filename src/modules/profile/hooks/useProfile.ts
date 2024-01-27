import { useEffect } from 'react';
import { useProviders } from '../apis/providers';
import { useSpecialities } from '../apis/specialities';
import { useUsers } from '../apis/users';

interface UseProfileName {
  slug: string;
  includeData?: Array<'SPECIALITIES'>;
}

export const useProfile = ({ slug, includeData }: UseProfileName) => {
  const providers = useProviders();
  const users = useUsers();
  const specialities = useSpecialities();

  useEffect(() => {
    if (slug) {
      providers.mutate(
        { slug },
        {
          onSuccess(data) {
            if (includeData?.includes('SPECIALITIES')) {
              specialities.mutate({ provider_id: data.id });
            }
            users.mutate({ user_id: data.user_id });
          },
        },
      );
    }
  }, [slug]);

  const user = users?.data?.data?.users?.[0] ?? {};
  const provider = providers?.data?.data?.providers?.[0] ?? {};

  return {
    name: user?.name,
    family: user?.family,
    display_name: user?.name || user?.family ? `${user?.name} ${user?.family}` : null,
    prefix: provider.prefix,
    isLoading: providers.isLoading || users?.isLoading || specialities?.isLoading,
    provideId: provider.id,
    specialities: specialities?.data?.data?.providers_specialities ?? [],
  };
};
