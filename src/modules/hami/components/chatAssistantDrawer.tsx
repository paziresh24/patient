import classNames from '@/common/utils/classNames';
import { getVardastWorkflowEvents } from '@/modules/hami/apis/parseVardastWorkflowMessages';
import { ChatAssistantEventBubbles } from '@/modules/hami/components/chatAssistantEventBubbles';
import { ChatAssistantTrigger } from '@/modules/hami/components/chatAssistantTrigger';
import { VARDAST_NAME } from '@/modules/hami/components/chatAssistantTypography';
import { VardastWorkflowProvider, useVardastWorkflow } from '@/modules/hami/context/vardastWorkflowContext';
import { trackVardastDrawerOpen, VardastDrawerOpenSource } from '@/modules/hami/utils/trackVardastDrawerOpen';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { CSSProperties, ReactNode, TouchEvent, useEffect, useRef, useState } from 'react';

const DRAWER_SIZE_PERCENT = 80;
const DRAWER_FIXED_WIDTH_PX = 380;
const SNAP_THRESHOLD = 0.35;
const DRAG_CLICK_THRESHOLD = 6;
const OPEN_EDGE_WIDTH = 48;
const DRAG_FAILSAFE_MS = 2500;
const DRAWER_TRANSITION = 'transform 320ms cubic-bezier(0.32, 0.72, 0, 1)';

type DragSource = 'trigger' | 'peek' | 'edge' | 'drawer' | 'handle';

interface ChatAssistantPanelContext {
  isOpen: boolean;
}

interface ChatAssistantDrawerProps {
  isActive: boolean;
  chatId: string | null;
  children: ReactNode;
  panelContent?: ReactNode | ((ctx: ChatAssistantPanelContext) => ReactNode);
}

interface DragState {
  startX: number;
  startY: number;
  startProgress: number;
  hasDragged: boolean;
  source: DragSource;
  lockedHorizontal: boolean;
  pointerId: number;
}

interface ChatAssistantDrawerViewProps extends ChatAssistantDrawerProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const ChatAssistantDrawerView = ({
  isActive,
  chatId,
  children,
  panelContent,
  isOpen,
  setIsOpen,
}: ChatAssistantDrawerViewProps) => {
  const { messages } = useVardastWorkflow();
  const workflowEvents = getVardastWorkflowEvents(messages);
  const [liveProgress, setLiveProgress] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const dragProgressRef = useRef(0);
  const openSourceRef = useRef<VardastDrawerOpenSource | undefined>();
  const suppressTriggerClickRef = useRef(false);
  const wasOpenRef = useRef(false);
  const userId = useUserInfoStore(state => state.info?.id);
  const [isDesktop, setIsDesktop] = useState(false);
  const isDesktopRef = useRef(false);
  const setIsOpenRef = useRef(setIsOpen);
  const setLiveProgressRef = useRef(setLiveProgress);

  setIsOpenRef.current = setIsOpen;
  setLiveProgressRef.current = setLiveProgress;

  const isDragging = liveProgress !== null;
  const progress = isDragging ? liveProgress : isOpen ? 1 : 0;

  const cancelDrag = () => {
    dragStateRef.current = null;
    setLiveProgressRef.current(null);
  };

  const finishDrag = () => {
    const drag = dragStateRef.current;
    if (!drag) {
      cancelDrag();
      return;
    }

    const { hasDragged, source, lockedHorizontal } = drag;
    const currentProgress = dragProgressRef.current;

    if (hasDragged && lockedHorizontal) {
      const willOpen = currentProgress >= SNAP_THRESHOLD;
      if (willOpen) {
        openSourceRef.current = source === 'trigger' || source === 'edge' ? source : 'swipe';
      }
      setIsOpenRef.current(willOpen);
    } else if ((source === 'trigger' || source === 'edge') && !hasDragged) {
      suppressTriggerClickRef.current = source === 'trigger';
      openSourceRef.current = source;
      setIsOpenRef.current(true);
    } else if (source === 'trigger' && hasDragged) {
      suppressTriggerClickRef.current = true;
    } else if (source === 'peek' && !hasDragged) {
      setIsOpenRef.current(false);
    }

    cancelDrag();
  };

  const resolveAxis = (deltaX: number, deltaY: number) => {
    const drag = dragStateRef.current;
    if (!drag || drag.lockedHorizontal) return;

    if (Math.abs(deltaX) < DRAG_CLICK_THRESHOLD && Math.abs(deltaY) < DRAG_CLICK_THRESHOLD) return;

    const isClosing = drag.startProgress > 0.05;
    const isOpening = drag.startProgress <= 0.05;

    if (drag.source === 'trigger') {
      if (Math.abs(deltaX) >= DRAG_CLICK_THRESHOLD && Math.abs(deltaX) >= Math.abs(deltaY)) {
        drag.lockedHorizontal = true;
      }
      return;
    }

    if (isClosing) {
      if (Math.abs(deltaX) >= DRAG_CLICK_THRESHOLD) {
        drag.lockedHorizontal = true;
      }
      return;
    }

    if (isOpening) {
      if (deltaX <= -DRAG_CLICK_THRESHOLD || Math.abs(deltaX) >= Math.abs(deltaY)) {
        drag.lockedHorizontal = true;
      }
      return;
    }

    if (Math.abs(deltaX) >= Math.abs(deltaY)) {
      drag.lockedHorizontal = true;
      return;
    }

    cancelDrag();
  };

  const updateDrag = (clientX: number, clientY: number, preventDefault?: () => void) => {
    const drag = dragStateRef.current;
    if (!drag || !containerRef.current) return;

    const deltaX = clientX - drag.startX;
    const deltaY = clientY - drag.startY;

    resolveAxis(deltaX, deltaY);
    if (!dragStateRef.current?.lockedHorizontal) return;

    if (Math.abs(deltaX) > DRAG_CLICK_THRESHOLD || Math.abs(deltaY) > DRAG_CLICK_THRESHOLD) {
      dragStateRef.current.hasDragged = true;
    }

    preventDefault?.();

    const drawerWidth = getDrawerWidthPx();
    const isClosing = drag.startProgress > 0.05;
    const nextProgress = isClosing
      ? drag.startProgress - Math.abs(deltaX) / drawerWidth
      : drag.startProgress - deltaX / drawerWidth;
    const clampedProgress = Math.max(0, Math.min(1, nextProgress));

    dragProgressRef.current = clampedProgress;
    setLiveProgressRef.current(clampedProgress);
  };

  const startDrag = (clientX: number, clientY: number, pointerId: number, startProgress: number, source: DragSource) => {
    if (dragStateRef.current) return;

    dragProgressRef.current = startProgress;
    dragStateRef.current = {
      startX: clientX,
      startY: clientY,
      startProgress,
      hasDragged: false,
      source,
      lockedHorizontal: source === 'drawer',
      pointerId,
    };
    setLiveProgressRef.current(startProgress);
  };

  const getDrawerWidthPx = () => {
    if (isDesktopRef.current) return DRAWER_FIXED_WIDTH_PX;
    return (containerRef.current?.offsetWidth ?? 0) * (DRAWER_SIZE_PERCENT / 100);
  };

  const isNearRightEdge = (clientX: number) => {
    const container = containerRef.current;
    if (!container) return false;
    return container.getBoundingClientRect().right - clientX <= OPEN_EDGE_WIDTH;
  };

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => {
      isDesktopRef.current = mq.matches;
      setIsDesktop(mq.matches);
    };
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!isActive) {
      setIsOpen(false);
      cancelDrag();
    }
  }, [isActive]);

  useEffect(() => {
    if (isOpen && !wasOpenRef.current && chatId) {
      trackVardastDrawerOpen(chatId, { source: openSourceRef.current, userId });
      openSourceRef.current = undefined;
    }

    wasOpenRef.current = isOpen;
  }, [isOpen, chatId, userId]);

  useEffect(() => {
    if (!isDragging) return;

    const timeout = window.setTimeout(() => {
      finishDrag();
    }, DRAG_FAILSAFE_MS);

    return () => window.clearTimeout(timeout);
  }, [isDragging]);

  useEffect(() => {
    const resetDrag = () => cancelDrag();

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') cancelDrag();
    };

    window.addEventListener('blur', resetDrag);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('blur', resetDrag);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const onPointerMove = (event: globalThis.PointerEvent) => {
      if (event.pointerId !== dragStateRef.current?.pointerId) return;
      updateDrag(event.clientX, event.clientY, () => event.preventDefault());
    };

    const onPointerEnd = (event: globalThis.PointerEvent) => {
      if (!dragStateRef.current) return;
      if (event.pointerId !== dragStateRef.current.pointerId) return;
      finishDrag();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerEnd);
    window.addEventListener('pointercancel', onPointerEnd);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerEnd);
      window.removeEventListener('pointercancel', onPointerEnd);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onTouchMove = (event: globalThis.TouchEvent) => {
      if (!dragStateRef.current) return;

      const touch = Array.from(event.touches).find(item => item.identifier === dragStateRef.current?.pointerId);
      if (!touch) return;

      updateDrag(touch.clientX, touch.clientY, () => event.preventDefault());
    };

    const onTouchEnd = (event: globalThis.TouchEvent) => {
      if (!dragStateRef.current) return;

      const ended = Array.from(event.changedTouches).some(item => item.identifier === dragStateRef.current?.pointerId);
      if (ended || event.touches.length === 0) {
        finishDrag();
      }
    };

    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd);
    container.addEventListener('touchcancel', onTouchEnd);

    return () => {
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('touchcancel', onTouchEnd);
    };
  }, []);

  const handleOpenSwipePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || !isActive || isOpen || isDragging || event.pointerType === 'touch') return;
    if (!isNearRightEdge(event.clientX)) return;
    startDrag(event.clientX, event.clientY, event.pointerId, 0, 'edge');
  };

  const handleOpenSwipeTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (!isActive || isOpen || isDragging) return;
    const touch = event.touches[0];
    if (!touch || !isNearRightEdge(touch.clientX)) return;
    startDrag(touch.clientX, touch.clientY, touch.identifier, 0, 'edge');
  };

  const handleDrawerPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || !isOpen || isDragging || event.pointerType === 'touch') return;
    startDrag(event.clientX, event.clientY, event.pointerId, progress, 'drawer');
  };

  const handleDrawerTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (!isOpen || isDragging) return;
    const touch = event.touches[0];
    if (!touch) return;
    startDrag(touch.clientX, touch.clientY, touch.identifier, progress, 'drawer');
  };

  const handleHandlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (event.button !== 0 || !isOpen || isDragging || event.pointerType === 'touch') return;
    event.currentTarget.setPointerCapture(event.pointerId);
    startDrag(event.clientX, event.clientY, event.pointerId, progress, 'handle');
  };

  const handleHandleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (!isOpen || isDragging) return;
    const touch = event.touches[0];
    if (!touch) return;
    startDrag(touch.clientX, touch.clientY, touch.identifier, progress, 'handle');
  };

  const handleControlPointerDown = (
    event: React.PointerEvent<HTMLElement>,
    startProgress: number,
    source: DragSource,
  ) => {
    if (event.button !== 0 || isDragging) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    startDrag(event.clientX, event.clientY, event.pointerId, startProgress, source);
  };

  const chatStyle: CSSProperties = isDesktop
    ? {
        transform: `translateX(-${progress * DRAWER_FIXED_WIDTH_PX}px)`,
        transition: isDragging ? 'none' : DRAWER_TRANSITION,
      }
    : {
        transform: `translateX(-${progress * DRAWER_SIZE_PERCENT}%)`,
        transition: isDragging ? 'none' : DRAWER_TRANSITION,
      };

  const drawerStyle: CSSProperties = {
    width: isDesktop ? `${DRAWER_FIXED_WIDTH_PX}px` : `${DRAWER_SIZE_PERCENT}%`,
    transform: `translateX(${(1 - progress) * 100}%)`,
    transition: isDragging ? 'none' : DRAWER_TRANSITION,
    boxShadow: '-8px 0 32px rgba(15, 23, 42, 0.12)',
    pointerEvents: isOpen || isDragging ? 'auto' : 'none',
  };

  const overlayOpacity = progress * 0.32;
  const showOverlay = isActive && progress > 0.001;
  const showOpenEdge = isActive && !isOpen;
  const showTrigger = isActive && !isOpen;
  const hideTrigger = isDragging || progress > 0.02;
  const showPeek = isActive && progress > 0.05;

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      <div
        className="h-full w-full will-change-transform"
        style={chatStyle}
        onPointerDown={handleOpenSwipePointerDown}
        onTouchStart={handleOpenSwipeTouchStart}
      >
        {children}
      </div>

      {showOverlay && (
        <button
          type="button"
          aria-label={`بستن ${VARDAST_NAME}`}
          className="absolute inset-0 z-[15] touch-none bg-slate-900"
          style={{
            opacity: overlayOpacity,
            transition: isDragging ? 'none' : 'opacity 320ms cubic-bezier(0.32, 0.72, 0, 1)',
            pointerEvents: progress > 0.08 ? 'auto' : 'none',
          }}
          onPointerDown={event => handleControlPointerDown(event, progress, 'peek')}
          onClick={() => {
            cancelDrag();
            setIsOpen(false);
          }}
        />
      )}

      <div
        ref={drawerRef}
        className="absolute inset-y-0 right-0 z-20 flex flex-col overflow-hidden rounded-tl-2xl rounded-bl-2xl bg-white will-change-transform"
        style={drawerStyle}
        aria-hidden={!isOpen && !isDragging}
        onPointerDown={handleDrawerPointerDown}
        onTouchStart={handleDrawerTouchStart}
      >
        <div
          className="absolute inset-y-0 left-0 z-30 flex w-5 touch-none cursor-grab items-center justify-center active:cursor-grabbing"
          onPointerDown={handleHandlePointerDown}
          onTouchStart={handleHandleTouchStart}
          aria-hidden
        >
          <span className="pointer-events-none h-6 w-0.5 rounded-full bg-slate-300" />
        </div>

        <div className="flex min-h-0 flex-1 flex-col bg-white">
          {typeof panelContent === 'function' ? panelContent({ isOpen }) : panelContent}
        </div>
      </div>

      {showTrigger && workflowEvents.length > 0 && (
        <ChatAssistantEventBubbles
          events={workflowEvents}
          hidden={hideTrigger}
          onBubbleClick={() => {
            openSourceRef.current = 'trigger';
            setIsOpen(true);
          }}
        />
      )}

      {showOpenEdge && (
        <div
          aria-hidden
          className={classNames('absolute right-0 z-30 top-[60px] bottom-[200px]', {
            'pointer-events-none': isDragging,
            'touch-none': !isDragging,
          })}
          style={{ width: OPEN_EDGE_WIDTH }}
          onPointerDown={event => handleControlPointerDown(event, 0, 'edge')}
          onTouchStart={event => {
            if (isDragging) return;
            const touch = event.touches[0];
            if (touch) startDrag(touch.clientX, touch.clientY, touch.identifier, 0, 'edge');
          }}
        />
      )}

      {showTrigger && (
        <ChatAssistantTrigger
          hidden={hideTrigger}
          onOpen={() => {
            if (suppressTriggerClickRef.current) {
              suppressTriggerClickRef.current = false;
              return;
            }
            if (isDragging || isOpen) return;
            openSourceRef.current = 'trigger';
            setIsOpen(true);
          }}
          onPointerDown={event => {
            if (event.pointerType === 'touch') return;
            handleControlPointerDown(event, 0, 'trigger');
          }}
          onTouchStart={event => {
            if (isDragging) return;
            const touch = event.touches[0];
            if (!touch) return;
            event.stopPropagation();
            startDrag(touch.clientX, touch.clientY, touch.identifier, 0, 'trigger');
          }}
        />
      )}

    </div>
  );
};

export const ChatAssistantDrawer = (props: ChatAssistantDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <VardastWorkflowProvider chatId={props.chatId} isOpen={isOpen}>
      <ChatAssistantDrawerView {...props} isOpen={isOpen} setIsOpen={setIsOpen} />
    </VardastWorkflowProvider>
  );
};

export default ChatAssistantDrawer;
