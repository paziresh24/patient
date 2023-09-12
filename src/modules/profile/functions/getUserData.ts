import { users } from '../apis/users';

type GetUserData = { user_id: string };

export const getUserData = async ({ user_id }: GetUserData) => {
  const { data: response } = await users({ user_id });
  const firstItemData = response.users[0];

  return {
    name: firstItemData?.name as string,
    family: firstItemData?.family as string,
  };
};
