import axios from 'axios';
import { getCookie } from 'cookies-next';
import { StartHamiVardastWorkflowResponse } from '@/modules/hami/apis/parseVardastWorkflowMessages';

export type { StartHamiVardastWorkflowResponse } from '@/modules/hami/apis/parseVardastWorkflowMessages';
export { parseVardastWorkflowMessages } from '@/modules/hami/apis/parseVardastWorkflowMessages';

const VARDAST_WORKFLOW_URL = 'https://hamdast.paziresh24.com/workflow/vardast';

export const startHamiVardastWorkflow = (chatId: string) => {
  const token = getCookie('token');

  return axios.get<StartHamiVardastWorkflowResponse>(VARDAST_WORKFLOW_URL, {
    params: {
      context: 'hami',
      'hami.chat_id': chatId,
    },
    withCredentials: true,
    headers: {
      ...(token ? { Cookie: `token=${token}` } : {}),
    },
  });
};
