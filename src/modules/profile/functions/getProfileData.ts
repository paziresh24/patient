import { getProfileData } from '@/common/apis/services/profile/getFullProfile';

export const getProfile = async ({ slug, university, isServer }: { slug: string; university?: string; isServer?: boolean }) => {
  const requests = [
    await getProfileData({
      slug,
      ...(university && { university }),
      profile_page: isServer,
    }),
  ];

  const [{ data, redirect }] = await Promise.all(requests);

  return {
    fullProfileData: data,
    redirect,
  };
};
