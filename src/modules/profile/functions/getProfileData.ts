import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { getProfileData } from '@/common/apis/services/profile/getFullProfile';

export const getProfile = async (queryClient: any, { slug, university }: { slug: string; university: string }) => {
  const requests = [
    await queryClient.fetchQuery(
      [
        ServerStateKeysEnum.DoctorFullProfile,
        {
          slug,
          ...(university && { university }),
        },
      ],
      () =>
        getProfileData({
          slug,
          ...(university && { university }),
        }),
    ),
  ];

  const [{ data: fullProfileData, redirect }] = await Promise.all(requests);

  return { fullProfileData, redirect };
};
