import { useEffect } from 'react';
import { useProviders } from '../apis/providers';
import { useUsers } from '../apis/users';

interface UseProfileName {
  slug: string;
}

export const useProfileName = ({ slug }: UseProfileName) => {
  const providers = useProviders();
  const users = useUsers();

  useEffect(() => {
    if (slug) {
      providers.mutate(
        { slug },
        {
          onSuccess(data) {
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
    isLoading: providers.isLoading || users?.isLoading,
  };
};
