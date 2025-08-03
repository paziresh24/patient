import { getProfileData } from '@/common/apis/services/profile/getFullProfile';

export const getProfile = async ({ slug, university }: { slug: string; university?: string }) => {
  const requests = [
    await getProfileData({
      slug,
      ...(university && { university }),
      profile_page: true,
    }),
  ];

  const [{ data, redirect }] = await Promise.all(requests);

  return {
    fullProfileData: data,
    redirect,
  };
};
