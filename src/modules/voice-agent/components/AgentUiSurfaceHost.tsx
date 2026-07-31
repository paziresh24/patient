import classNames from '@/common/utils/classNames';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAgentUiSurfaceStore } from '../store/agentUiSurface';
import { useVoiceCallUiStore } from '../store/voiceCallUi';
import { SimpleMarkdown } from '../ui-surface/SimpleMarkdown';
import {
  type AgentUiAction,
  type AgentUiActionStyle,
  type AgentUiPrompt,
  type AgentUiReply,
} from '../ui-surface/types';

function isPrompt(value: unknown): value is AgentUiPrompt {
  if (!value || typeof value !== 'object') return false;
  const o = value as Record<string, unknown>;
  return typeof o.id === 'string' && o.id.length > 0;
}

const STYLE: Record<AgentUiActionStyle, string> = {
  primary: 'bg-primary text-white',
  secondary: 'bg-slate-100 text-slate-800',
  danger: 'bg-red-500 text-white',
  ghost: 'bg-transparent text-slate-600 ring-1 ring-slate-200',
};

function ActionButton({
  action,
  onClick,
}: {
  action: AgentUiAction;
  onClick: () => void;
}) {
  const style = action.style ?? 'secondary';
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        'min-h-11 flex-1 rounded-2xl px-4 text-[14px] font-medium transition-transform active:scale-[0.97]',
        STYLE[style],
      )}
    >
      {action.label}
    </button>
  );
}

/**
 * Prompt panel for `show_ui` — rendered inline inside the call sheet only
 * (no floating overlay; that stacked with the drawer and felt chaotic).
 */
export function AgentUiSurfaceHost({
  onReply,
}: {
  onReply: (reply: AgentUiReply) => void;
}) {
  const prompt = useAgentUiSurfaceStore(s => s.prompt);
  const clearPrompt = useAgentUiSurfaceStore(s => s.clearPrompt);
  const callActive = useVoiceCallUiStore(s => s.active);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (!callActive) clearPrompt();
  }, [callActive, clearPrompt]);

  useEffect(() => {
    setSelected([]);
  }, [prompt?.id]);

  const reply = (body: Omit<AgentUiReply, 'id'>) => {
    if (!prompt) return;
    onReply({ id: prompt.id, ...body });
    clearPrompt();
  };

  if (!prompt || !isPrompt(prompt)) return null;

  const choices = prompt.choices ?? [];
  const actions = prompt.actions ?? [];
  const multiple = Boolean(prompt.multiple);
  const dismissible = prompt.dismissible !== false;

  const toggleChoice = (id: string) => {
    if (multiple) {
      setSelected(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
      return;
    }
    if (!actions.length) {
      reply({ actionId: 'choice', choiceIds: [id] });
      return;
    }
    setSelected([id]);
  };

  return (
    <div
      role="region"
      aria-label={prompt.title || 'پیام آرش'}
      className="flex min-h-0 flex-1 flex-col rounded-2xl bg-slate-50 ring-1 ring-slate-200/80"
      dir="rtl"
    >
      <div className="flex shrink-0 items-start justify-between gap-3 px-4 pt-3">
        <div className="min-w-0 flex-1">
          {prompt.title ? (
            <p className="text-[15px] font-semibold text-slate-900">{prompt.title}</p>
          ) : (
            <p className="text-[12px] font-medium text-slate-400">آرش</p>
          )}
        </div>
        {dismissible ? (
          <button
            type="button"
            aria-label="بستن"
            onClick={() => reply({ dismissed: true, actionId: 'dismiss' })}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 ring-1 ring-slate-200"
          >
            <X size={16} />
          </button>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-2">
        {prompt.markdown ? <SimpleMarkdown source={prompt.markdown} /> : null}

        {choices.length > 0 ? (
          <div className={classNames('mt-2 grid gap-2', choices.length === 2 ? 'grid-cols-2' : 'grid-cols-1')}>
            {choices.map(choice => {
              const on = selected.includes(choice.id);
              return (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => toggleChoice(choice.id)}
                  className={classNames(
                    'rounded-2xl px-3 py-2.5 text-start text-[14px] font-medium transition-colors',
                    on ? 'bg-primary text-white' : 'bg-white text-slate-800 ring-1 ring-slate-200',
                  )}
                >
                  {choice.label}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      {actions.length > 0 ? (
        <div className="flex shrink-0 gap-2 px-4 pb-3 pt-1">
          {actions.map(action => (
            <ActionButton
              key={action.id}
              action={action}
              onClick={() =>
                reply({
                  actionId: action.id,
                  choiceIds: selected.length ? selected : undefined,
                })
              }
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
