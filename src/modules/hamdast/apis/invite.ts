import { apiGatewayClient } from '@/common/apis/client';

interface InviteDoctorParams {
  appKey: string;
  invitedUserId: string;
}

export const inviteDoctor = async ({ appKey, invitedUserId }: InviteDoctorParams) => {
  const { data } = await apiGatewayClient.post(`/v1/hamdast/apps/${appKey}/invitations`, {
    invited_user: invitedUserId,
  });

  return data;
};

type InvitationItem = {
  invited_user?: string | number;
};

type GetInvitationsResponse = {
  items?: InvitationItem[];
};

export const getInvitations = async (appKey: string): Promise<GetInvitationsResponse> => {
  const { data } = await apiGatewayClient.get(`/v1/hamdast/apps/${appKey}/invitations`);
  return data;
};
