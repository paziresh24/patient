import classNames from '@/common/utils/classNames';
import { useLocalParticipant, useRoomContext } from '@livekit/components-react';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAgentUiSurfaceStore } from '../store/agentUiSurface';
import { useVoiceCallUiStore } from '../store/voiceCallUi';
import { SimpleMarkdown } from '../ui-surface/SimpleMarkdown';
import {
  AGENT_UI_REPLY_TOPIC,
  SHOW_UI_RPC,
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
 * show_ui RPC shows a page-level card immediately (does not block agent speech).
 * User answers are sent back on the `agent_ui_reply` data topic.
 */
export function AgentUiSurfaceHost() {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  const prompt = useAgentUiSurfaceStore(s => s.prompt);
  const setPrompt = useAgentUiSurfaceStore(s => s.setPrompt);
  const clearPrompt = useAgentUiSurfaceStore(s => s.clearPrompt);
  const callActive = useVoiceCallUiStore(s => s.active);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (!callActive) clearPrompt();
  }, [callActive, clearPrompt]);

  useEffect(() => {
    setSelected([]);
  }, [prompt?.id]);

  useEffect(() => {
    if (prompt) useVoiceCallUiStore.getState().minimizeCall();
  }, [prompt?.id]);

  useEffect(() => {
    if (!room) return;

    const handler = async (data: { payload: string }) => {
      let parsed: unknown;
      try {
        parsed = JSON.parse(data.payload);
      } catch {
        throw new Error('invalid_prompt_json');
      }
      if (!isPrompt(parsed)) {
        throw new Error('invalid_prompt');
      }
      setPrompt(parsed);
      // Return immediately so the agent can keep speaking about this form.
      return JSON.stringify({ status: 'shown', id: parsed.id });
    };

    try {
      room.registerRpcMethod(SHOW_UI_RPC, handler);
    } catch {
      try {
        room.unregisterRpcMethod(SHOW_UI_RPC);
        room.registerRpcMethod(SHOW_UI_RPC, handler);
      } catch {
        // ignore
      }
    }

    return () => {
      try {
        room.unregisterRpcMethod(SHOW_UI_RPC);
      } catch {
        // ignore
      }
    };
  }, [room, setPrompt]);

  const reply = (body: Omit<AgentUiReply, 'id'>) => {
    if (!prompt || !localParticipant) return;
    const message: AgentUiReply = { id: prompt.id, ...body };
    const bytes = new TextEncoder().encode(JSON.stringify(message));
    void localParticipant
      .publishData(bytes, { reliable: true, topic: AGENT_UI_REPLY_TOPIC })
      .catch(() => undefined);
    clearPrompt();
  };

  if (!prompt) return null;

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
    <div className="pointer-events-none fixed inset-0 z-[120] flex items-end justify-center print:hidden" dir="rtl">
      <button
        type="button"
        aria-label="بستن"
        className="pointer-events-auto absolute inset-0 bg-black/35"
        onClick={() => {
          if (dismissible) reply({ dismissed: true, actionId: 'dismiss' });
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={prompt.title || 'پیام آرش'}
        className="pointer-events-auto relative z-[1] mb-[max(0.75rem,env(safe-area-inset-bottom))] w-[min(100%-1.5rem,28rem)] overflow-hidden rounded-[24px] bg-white shadow-[0_16px_48px_-12px_rgba(15,23,42,0.35)] ring-1 ring-slate-900/5"
      >
        <div className="flex items-start justify-between gap-3 px-5 pt-4">
          <div className="min-w-0 flex-1">
            {prompt.title ? (
              <p className="text-[16px] font-semibold text-slate-900">{prompt.title}</p>
            ) : (
              <p className="text-[13px] font-medium text-slate-400">آرش</p>
            )}
          </div>
          {dismissible ? (
            <button
              type="button"
              aria-label="بستن"
              onClick={() => reply({ dismissed: true, actionId: 'dismiss' })}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500"
            >
              <X size={16} />
            </button>
          ) : null}
        </div>

        <div className="max-h-[min(52dvh,420px)] overflow-y-auto px-5 py-3">
          {prompt.markdown ? <SimpleMarkdown source={prompt.markdown} /> : null}

          {choices.length > 0 ? (
            <div className={classNames('mt-3 grid gap-2', choices.length === 2 ? 'grid-cols-2' : 'grid-cols-1')}>
              {choices.map(choice => {
                const on = selected.includes(choice.id);
                return (
                  <button
                    key={choice.id}
                    type="button"
                    onClick={() => toggleChoice(choice.id)}
                    className={classNames(
                      'rounded-2xl px-4 py-3 text-start text-[14px] font-medium transition-colors',
                      on ? 'bg-primary text-white' : 'bg-slate-50 text-slate-800 ring-1 ring-slate-200',
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
          <div className="flex gap-2 px-5 pb-5 pt-1">
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
    </div>
  );
}
