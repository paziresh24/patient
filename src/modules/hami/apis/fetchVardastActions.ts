import axios from 'axios';
import { getCookie } from 'cookies-next';
import { parseVardastActions, VardastWorkflowAppPopupAction } from '@/modules/hami/apis/parseVardastActions';

const VARDAST_ACTIONS_URL = 'https://hamdast.paziresh24.com/workflow/vardast/actions';

export interface VardastActionsResponse {
  actions?: unknown;
  appointment_id?: string;
}

export const fetchHamiVardastActions = async (chatId: string) => {
  const token = getCookie('token');

  const response = await axios.get<VardastActionsResponse | VardastWorkflowAppPopupAction[]>(VARDAST_ACTIONS_URL, {
    params: {
      context: 'hami',
      'hami.chat_id': chatId,
    },
    withCredentials: true,
    headers: {
      ...(token ? { Cookie: `token=${token}` } : {}),
    },
  });

  const data = response.data;

  if (Array.isArray(data)) {
    const actions = parseVardastActions(data);
    const appointmentId = actions.find(action => action.parameters?.appointment_id)?.parameters?.appointment_id;

    return {
      actions,
      appointmentId,
    };
  }

  return {
    actions: parseVardastActions(data?.actions),
    appointmentId: data?.appointment_id?.trim() || undefined,
  };
};
