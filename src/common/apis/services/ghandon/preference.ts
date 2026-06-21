import { apiGatewayClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const GHANDON_PREFERENCE_API_PATH = '/ghandon/preference';

export interface GhandonPreference {
  email: string;
  auto_sync: boolean;
}

export const getGhandonPreference = async (): Promise<GhandonPreference | null> => {
  try {
    const { data } = await apiGatewayClient.get<GhandonPreference>(GHANDON_PREFERENCE_API_PATH);
    const email = data?.email?.trim() ?? '';

    if (!isValidGhandonEmail(email)) {
      return null;
    }

    return {
      email,
      auto_sync: Boolean(data?.auto_sync),
    };
  } catch {
    return null;
  }
};

const isValidGhandonEmail = (email: string) =>
  email.length > 0 && email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const saveGhandonPreference = async (params: GhandonPreference) => {
  const email = params.email.trim();

  if (!isValidGhandonEmail(email)) {
    throw new Error('Invalid email');
  }

  const { data } = await apiGatewayClient.put<GhandonPreference>(GHANDON_PREFERENCE_API_PATH, {
    email,
    auto_sync: Boolean(params.auto_sync),
  });
  return data;
};

export const useGhandonPreference = (enabled = true) => {
  return useQuery([ServerStateKeysEnum.GhandonPreference], getGhandonPreference, {
    enabled,
    staleTime: 60_000,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useSaveGhandonPreference = () => {
  const queryClient = useQueryClient();

  return useMutation(saveGhandonPreference, {
    onSuccess: data => {
      const email = data?.email?.trim() ?? '';

      if (!isValidGhandonEmail(email)) {
        return;
      }

      queryClient.setQueryData<GhandonPreference | null>([ServerStateKeysEnum.GhandonPreference], {
        email,
        auto_sync: Boolean(data?.auto_sync),
      });
    },
  });
};
