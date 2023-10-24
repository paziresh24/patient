import * as Sentry from '@sentry/nextjs';
import { users } from '../apis/users';

type GetUserData = { user_id: string; slug: string };

export const getUserData = async ({ user_id, slug }: GetUserData) => {
  const { data: response } = await users({ user_id });
  const firstItemData = response.users?.[0] as Record<string, string>;

  if (!firstItemData?.name || !firstItemData?.family) {
    Sentry.captureMessage(`name:${firstItemData?.name} family:${firstItemData?.family} slug:${slug} user_id:${user_id}`);
  }

  return {
    ...firstItemData,
  };
};
