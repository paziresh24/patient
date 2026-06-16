import classNames from '@/common/utils/classNames';
import { getVardastWorkflowEvents } from '@/modules/hami/apis/parseVardastWorkflowMessages';
import { ChatAssistantEventBubbles } from '@/modules/hami/components/chatAssistantEventBubbles';
import { ChatAssistantTriggerVisual } from '@/modules/hami/components/chatAssistantTrigger';
import { VARDAST_NAME } from '@/modules/hami/components/chatAssistantTypography';
import { useGetWidgets } from '@/modules/hamdast/apis/widgets';
import { VardastWorkflowProvider, useVardastWorkflow } from '@/modules/hami/context/vardastWorkflowContext';
import { useVardastTriggerInteraction } from '@/modules/hami/hooks/useVardastTriggerInteraction';
import { trackVardastDrawerOpen, VardastDrawerOpenSource } from '@/modules/hami/utils/trackVardastDrawerOpen';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { CSSProperties, ReactNode, TouchEvent, useCallback, useEffect, useRef, useState } from 'react';

const DRAWER_SIZE_PERCENT = 80;
const DRAWER_FIXED_WIDTH_PX = 380;
const SNAP_THRESHOLD = 0.35;
const DRAG_CLICK_THRESHOLD = 6;
const OPEN_EDGE_WIDTH = 48;
const TRIGGER_LANE_WIDTH = 48;
const EDGE_INSET_TOP = 60;
const EDGE_INSET_BOTTOM = 200;
const EDGE_LANE_CLASS = 'absolute top-[60px] bottom-[200px]';
const DRAG_FAILSAFE_MS = 2500;
const DRAWER_TRANSITION = 'transform 320ms cubic-bezier(0.32, 0.72, 0, 1)';

type DragSource = 'trigger' | 'peek' | 'edge' | 'drawer' | 'handle';

interface ChatAssistantPanelContext {
  isOpen: boolean;
}

interface ChatAssistantDrawerProps {
  isActive: boolean;
  isVardastEnabled?: boolean;
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
  visualActive: boolean;
}

interface ChatAssistantDrawerViewProps extends ChatAssistantDrawerProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isVardastEnabled?: boolean;
}

const ChatAssistantDrawerView = ({
  isActive,
  isVardastEnabled,
  chatId,
  children,
  panelContent,
  isOpen,
  setIsOpen,
}: ChatAssistantDrawerViewProps) => {
  const { messages } = useVardastWorkflow();
  const workflowEvents = getVardastWorkflowEvents(messages);
  const userId = useUserInfoStore(state => state.info?.id);
  const widgetsQuery = useGetWidgets({ user_id: String(userId) }, { enabled: !!userId && !isVardastEnabled, staleTime: 0 });
  const hasChatWidget = widgetsQuery.data?.data?.some((w: any) => w.placement?.includes('vardast::CHAT')) ?? false;
  const shouldShowDrawerUI = isVardastEnabled || hasChatWidget;
  const [liveProgress, setLiveProgress] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const chatLayerRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const dragProgressRef = useRef(0);
  const openSourceRef = useRef<VardastDrawerOpenSource | undefined>();
  const wasOpenRef = useRef(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const isDesktopRef = useRef(false);
  const setIsOpenRef = useRef(setIsOpen);
  const setLiveProgressRef = useRef(setLiveProgress);

  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;
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
    } else if (source === 'trigger' && (!hasDragged || !lockedHorizontal)) {
      openSourceRef.current = 'trigger';
      setIsOpenRef.current(true);
    } else if (source === 'edge' && !hasDragged) {
      openSourceRef.current = 'edge';
      setIsOpenRef.current(true);
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
      if (Math.abs(deltaX) >= DRAG_CLICK_THRESHOLD && Math.abs(deltaX) >= Math.abs(deltaY)) {
        drag.lockedHorizontal = true;
      } else if (Math.abs(deltaY) >= DRAG_CLICK_THRESHOLD && Math.abs(deltaY) > Math.abs(deltaX)) {
        cancelDrag();
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
    if (!drag.lockedHorizontal) return;

    if (!drag.visualActive) {
      drag.visualActive = true;
      setLiveProgressRef.current(drag.startProgress);
    }

    if (Math.abs(deltaX) > DRAG_CLICK_THRESHOLD || Math.abs(deltaY) > DRAG_CLICK_THRESHOLD) {
      drag.hasDragged = true;
    }

    preventDefault?.();

    const drawerWidth = getDrawerWidthPx();
    const isClosing = drag.startProgress > 0.05;
    const nextProgress = isClosing ? drag.startProgress - Math.abs(deltaX) / drawerWidth : drag.startProgress - deltaX / drawerWidth;
    const clampedProgress = Math.max(0, Math.min(1, nextProgress));

    dragProgressRef.current = clampedProgress;
    setLiveProgressRef.current(clampedProgress);
  };

  const startDrag = (
    clientX: number,
    clientY: number,
    pointerId: number,
    startProgress: number,
    source: DragSource,
    options?: { deferVisual?: boolean },
  ) => {
    if (dragStateRef.current) return;

    dragProgressRef.current = startProgress;
    const visualActive = !options?.deferVisual;

    dragStateRef.current = {
      startX: clientX,
      startY: clientY,
      startProgress,
      hasDragged: false,
      source,
      lockedHorizontal: source === 'handle',
      pointerId,
      visualActive,
    };

    if (visualActive) {
      setLiveProgressRef.current(startProgress);
    }
  };

  const openFromTrigger = useCallback(() => {
    if (isOpenRef.current) return;
    openSourceRef.current = 'trigger';
    setIsOpenRef.current(true);
  }, []);

  const getDragSource = useCallback((): 'trigger' | undefined => {
    return dragStateRef.current?.source === 'trigger' ? 'trigger' : undefined;
  }, []);

  const {
    handleTriggerPointerDown,
    handleTriggerPointerMove,
    handleTriggerPointerUp,
    handleTriggerPointerCancel,
    handleTriggerClick,
    handleBubblePointerDown,
    handleBubblePointerUp,
    handleBubbleClick,
  } = useVardastTriggerInteraction({
    containerRef,
    chatLayerRef,
    triggerLaneWidth: TRIGGER_LANE_WIDTH,
    edgeInsetTop: EDGE_INSET_TOP,
    edgeInsetBottom: EDGE_INSET_BOTTOM,
    isActive,
    isOpenRef,
    onOpen: openFromTrigger,
    startDrag,
    updateDrag,
    finishDrag,
    getDragSource,
  });

  const getDrawerWidthPx = () => {
    if (isDesktopRef.current) return DRAWER_FIXED_WIDTH_PX;
    return (containerRef.current?.offsetWidth ?? 0) * (DRAWER_SIZE_PERCENT / 100);
  };

  const isInEdgeBand = (clientY: number) => {
    const container = containerRef.current;
    if (!container) return false;
    const rect = container.getBoundingClientRect();
    return clientY >= rect.top + EDGE_INSET_TOP && clientY <= rect.bottom - EDGE_INSET_BOTTOM;
  };

  const isNearRightEdge = (clientX: number, clientY: number) => {
    if (!isInEdgeBand(clientY)) return false;
    const container = containerRef.current;
    if (!container) return false;
    const fromRight = container.getBoundingClientRect().right - clientX;
    return fromRight <= OPEN_EDGE_WIDTH;
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
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerId !== dragStateRef.current?.pointerId) return;
      updateDrag(event.clientX, event.clientY, () => event.preventDefault());
    };

    const onPointerEnd = (event: PointerEvent) => {
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

    // eslint-disable-next-line no-undef
    const onTouchMove = (event: globalThis.TouchEvent) => {
      if (!dragStateRef.current) return;

      const touch = Array.from(event.touches).find(item => item.identifier === dragStateRef.current?.pointerId);
      if (!touch) return;

      updateDrag(touch.clientX, touch.clientY, () => event.preventDefault());
    };

    // eslint-disable-next-line no-undef
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
    if (!isNearRightEdge(event.clientX, event.clientY)) return;
    startDrag(event.clientX, event.clientY, event.pointerId, 0, 'edge');
  };

  const handleOpenSwipeTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (!isActive || isOpen || isDragging) return;
    const touch = event.touches[0];
    if (!touch || !isNearRightEdge(touch.clientX, touch.clientY)) return;
    startDrag(touch.clientX, touch.clientY, touch.identifier, 0, 'edge', { deferVisual: true });
  };

  const handleDrawerContentTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (!isOpen || isDragging) return;
    const target = event.target;
    if (!(target instanceof Element) || target.closest('[data-vardast-panel-scroll]')) return;
    const touch = event.touches[0];
    if (!touch) return;
    startDrag(touch.clientX, touch.clientY, touch.identifier, progress, 'drawer', { deferVisual: true });
  };

  const handleDrawerContentPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || !isOpen || isDragging || event.pointerType === 'touch') return;
    const target = event.target;
    if (!(target instanceof Element) || target.closest('[data-vardast-panel-scroll]')) return;
    startDrag(event.clientX, event.clientY, event.pointerId, progress, 'drawer');
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

  const handleControlPointerDown = (event: React.PointerEvent<HTMLElement>, startProgress: number, source: DragSource) => {
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
  const showOpenEdge = isActive && !isOpen && shouldShowDrawerUI;
  const showTrigger = isActive && !isOpen && shouldShowDrawerUI;
  const hideTriggerVisual = progress > 0.02 || isDragging;
  const showTriggerLane = showTrigger;
  const showPeek = isActive && progress > 0.05;

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      <div
        className="h-full w-full will-change-transform"
        style={chatStyle}
        onPointerDown={handleOpenSwipePointerDown}
        onTouchStart={handleOpenSwipeTouchStart}
      >
        <div ref={chatLayerRef} className="h-full w-full">
          {children}
        </div>
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
        onPointerDown={handleDrawerContentPointerDown}
        onTouchStart={handleDrawerContentTouchStart}
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

      {showOpenEdge && (
        <div
          aria-hidden
          className={classNames(EDGE_LANE_CLASS, 'right-0 z-30 touch-none', {
            'pointer-events-none': isDragging,
          })}
          style={{ width: OPEN_EDGE_WIDTH }}
          onPointerDown={event => handleControlPointerDown(event, 0, 'edge')}
          onTouchStart={event => {
            if (dragStateRef.current) return;
            const touch = event.touches[0];
            if (touch) startDrag(touch.clientX, touch.clientY, touch.identifier, 0, 'edge', { deferVisual: true });
          }}
        />
      )}

      {showTriggerLane && (
        <div className={classNames(EDGE_LANE_CLASS, 'right-0 z-[100]')} dir="ltr">
          {workflowEvents.length > 0 && (
            <ChatAssistantEventBubbles
              events={workflowEvents}
              hidden={hideTriggerVisual}
              onPointerDown={handleBubblePointerDown}
              onPointerUp={handleBubblePointerUp}
              onPointerCancel={handleBubblePointerUp}
              onBubbleClick={handleBubbleClick}
            />
          )}

          <div
            role="button"
            tabIndex={0}
            aria-label={`باز کردن ${VARDAST_NAME}`}
            className={classNames(
              'absolute top-1/2 right-0 z-[42] flex -translate-y-1/2 touch-none cursor-pointer select-none items-center justify-end py-8 pl-5 pr-0 transition-opacity duration-300',
              hideTriggerVisual ? 'pointer-events-none opacity-0' : 'opacity-100',
            )}
            onPointerDown={handleTriggerPointerDown}
            onPointerMove={handleTriggerPointerMove}
            onPointerUp={handleTriggerPointerUp}
            onPointerCancel={handleTriggerPointerCancel}
            onClick={handleTriggerClick}
            onKeyDown={event => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openFromTrigger();
              }
            }}
          >
            <ChatAssistantTriggerVisual />
          </div>
        </div>
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
