export interface VardastWorkflowApp {

  key?: string;

  icon?: string;

  name?: string;

}



export type VardastWorkflowEventStatus = 'loading' | 'success' | 'done' | 'error' | (string & {});



export interface VardastWorkflowEvent {

  text: string;

  status: VardastWorkflowEventStatus;

}

export interface VardastWorkflowAttachment {

  section?: string;

  url: string;

  content_type?: string;

}



export interface VardastWorkflowMessageItem {

  content: string;

  app?: VardastWorkflowApp;

  pooling?: boolean;

  event?: VardastWorkflowEvent[];

  attachments?: VardastWorkflowAttachment[];

}



export interface StartHamiVardastWorkflowResponse {

  message?: VardastWorkflowMessageItem[] | string;

  appointment_id?: string;

}



export interface VardastWorkflowResult {

  messages: VardastWorkflowMessageItem[];

  appointmentId?: string;

}



export const parseVardastWorkflowResponse = (

  response?: StartHamiVardastWorkflowResponse | null,

): VardastWorkflowResult => ({

  messages: parseVardastWorkflowMessages(response?.message),

  appointmentId: response?.appointment_id?.trim() || undefined,

});



export const parseVardastContent = (content: string) => {

  const trimmed = content.trim();

  if (!trimmed) return { title: '', body: '' };



  const h2Match = trimmed.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);

  const title = h2Match?.[1]?.replace(/<[^>]+>/g, '').trim() ?? '';

  const body = trimmed.replace(/<h2[^>]*>[\s\S]*?<\/h2>/i, '').trim();



  return { title, body };

};



const parseVardastEvents = (raw: unknown): VardastWorkflowEvent[] | undefined => {

  if (!Array.isArray(raw)) return undefined;



  const events = raw

    .map(item => {

      if (!item || typeof item !== 'object') return null;

      const { text, status } = item as { text?: unknown; status?: unknown };

      if (typeof text !== 'string' || !text.trim() || typeof status !== 'string' || !status.trim()) {

        return null;

      }

      return { text: text.trim(), status: status.trim() as VardastWorkflowEventStatus };

    })

    .filter((item): item is VardastWorkflowEvent => item !== null);



  return events.length > 0 ? events : undefined;

};

const parseVardastAttachments = (raw: unknown): VardastWorkflowAttachment[] | undefined => {

  if (!Array.isArray(raw)) return undefined;



  const attachments = raw
    .map((item): VardastWorkflowAttachment | null => {
      if (!item || typeof item !== 'object') return null;

      const { section, url, content_type } = item as {
        section?: unknown;
        url?: unknown;
        content_type?: unknown;
      };

      if (typeof url !== 'string' || !url.trim()) return null;

      const attachment: VardastWorkflowAttachment = { url: url.trim() };
      if (typeof section === 'string' && section.trim()) {
        attachment.section = section.trim();
      }
      if (typeof content_type === 'string' && content_type.trim()) {
        attachment.content_type = content_type.trim();
      }

      return attachment;
    })
    .filter((item): item is VardastWorkflowAttachment => item !== null);



  return attachments.length > 0 ? attachments : undefined;

};



export const getVardastWorkflowEvents = (messages: VardastWorkflowMessageItem[]): VardastWorkflowEvent[] => {

  const seen = new Set<string>();



  return messages.flatMap(message => message.event ?? []).filter(event => {

    const key = `${event.status}:${event.text}`;

    if (seen.has(key)) return false;

    seen.add(key);

    return true;

  });

};



export const parseVardastWorkflowMessages = (

  message?: StartHamiVardastWorkflowResponse['message'],

): VardastWorkflowMessageItem[] => {

  if (!message) return [];



  let items: unknown[] = [];



  if (typeof message === 'string') {

    try {

      const parsed = JSON.parse(message);

      items = Array.isArray(parsed) ? parsed : [{ content: message }];

    } catch {

      return [{ content: message.trim() }];

    }

  } else if (Array.isArray(message)) {

    items = message;

  }



  return items

    .map(item => {

      if (typeof item === 'string') {

        return { content: item };

      }



      if (item && typeof item === 'object') {

        const record = item as Record<string, unknown>;

        if (typeof record.content !== 'string') return null;



        const app = record.app;

        const parsedApp =

          app && typeof app === 'object' && typeof (app as VardastWorkflowApp).key === 'string'

            ? (app as VardastWorkflowApp)

            : undefined;



        return {

          ...(item as VardastWorkflowMessageItem),

          app: parsedApp,

          event: parseVardastEvents(record.event),

          attachments: parseVardastAttachments(record.attachments),

        };

      }



      return null;

    })

    .filter((item): item is VardastWorkflowMessageItem => !!item?.content?.trim());

};



export const shouldPoolVardastWorkflow = (messages: VardastWorkflowMessageItem[]) =>

  messages.some(message => message.pooling);



export const areVardastWorkflowMessagesEqual = (

  current: VardastWorkflowMessageItem[],

  next: VardastWorkflowMessageItem[],

) => JSON.stringify(current) === JSON.stringify(next);

