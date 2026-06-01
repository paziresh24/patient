import { VardastWorkflowApp } from '@/modules/hami/apis/parseVardastWorkflowMessages';

interface ChatAssistantAppSourceProps {
  app: VardastWorkflowApp;
}

export const ChatAssistantAppSource = ({ app }: ChatAssistantAppSourceProps) => (
  <div className="mb-2 flex items-center gap-1.5" aria-label={app.name}>
    <img src={app.icon} alt="" className="h-4 w-4 shrink-0 rounded object-cover" />
    <span className="text-[11px] font-medium text-slate-500">{app.name}</span>
  </div>
);

export default ChatAssistantAppSource;
