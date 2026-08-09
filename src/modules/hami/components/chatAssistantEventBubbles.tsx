import classNames from '@/common/utils/classNames';
import { detectTextDirection, getTextDirectionClass } from '@/common/utils/detectTextDirection';
import { VardastWorkflowEvent, VardastWorkflowEventStatus } from '@/modules/hami/apis/parseVardastWorkflowMessages';
import { MouseEvent, PointerEvent } from 'react';

interface ChatAssistantEventBubblesProps {
  events: VardastWorkflowEvent[];
  hidden?: boolean;
  onBubbleClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  onPointerDown?: (event: PointerEvent<HTMLButtonElement>) => void;
  onPointerUp?: (event: PointerEvent<HTMLButtonElement>) => void;
  onPointerCancel?: (event: PointerEvent<HTMLButtonElement>) => void;
}

const isLoadingStatus = (status: VardastWorkflowEventStatus) => status.toLowerCase() === 'loading';

const LiveDots = () => (
  <span className="vardast-event-dots flex shrink-0 items-center gap-[3px]" aria-hidden>
    <span />
    <span />
    <span />
  </span>
);

const getMostRelevantEvent = (events: VardastWorkflowEvent[]): VardastWorkflowEvent =>
  events.find(e => isLoadingStatus(e.status)) ??
  events.find(e => e.status.toLowerCase() === 'error') ??
  events[events.length - 1];

export const ChatAssistantEventBubbles = ({
  events,
  hidden,
  onBubbleClick,
  onPointerDown,
  onPointerUp,
  onPointerCancel,
}: ChatAssistantEventBubblesProps) => {
  if (events.length === 0) return null;

  const activeEvent = getMostRelevantEvent(events);
  const otherCount = events.length - 1;
  const isLoading = isLoadingStatus(activeEvent.status);
  const eventDirection = detectTextDirection(activeEvent.text);

  return (
    <div
      className={classNames(
        'pointer-events-none absolute inset-y-0 right-[34px] z-[50] flex items-center transition-opacity duration-300',
        hidden ? 'opacity-0' : 'opacity-100',
      )}
    >
      <div className={classNames('vardast-event-slide', hidden && '[animation-play-state:paused]')}>
        <button
          type="button"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onClick={event => {
            event.stopPropagation();
            onBubbleClick?.(event);
          }}
          dir={eventDirection}
          className={classNames(
            'vardast-event-msg pointer-events-auto w-[min(168px,calc(100vw-52px))] active:scale-[0.97]',
            getTextDirectionClass(eventDirection),
            isLoading && 'vardast-event-msg--live',
          )}
        >
          <div className="vardast-event-msg-body relative px-3 py-2.5">
            {isLoading ? (
              <div className="flex items-end gap-1.5">
                <LiveDots />
                <p className="min-w-0 flex-1 text-xs font-medium leading-[1.5] text-slate-700">
                  {activeEvent.text}
                </p>
              </div>
            ) : (
              <p className="text-xs font-medium leading-[1.5] text-slate-700">{activeEvent.text}</p>
            )}

            {otherCount > 0 && (
              <p className="mt-0.5 text-[10px] leading-[1.4] text-slate-400">+{otherCount} رویداد دیگر</p>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};

export default ChatAssistantEventBubbles;
