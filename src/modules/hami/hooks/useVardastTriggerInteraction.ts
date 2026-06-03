import { MouseEvent, PointerEvent, RefObject, useCallback, useEffect, useRef } from 'react';

const DRAG_CLICK_THRESHOLD = 6;
const BUBBLE_SELECTOR = '.vardast-event-msg';

interface TriggerPointerState {
  startX: number;
  startY: number;
  pointerId: number;
  dragStarted: boolean;
  mode: 'trigger' | 'bubble';
}

interface UseVardastTriggerInteractionOptions {
  containerRef: RefObject<HTMLDivElement | null>;
  chatLayerRef: RefObject<HTMLDivElement | null>;
  triggerLaneWidth: number;
  edgeInsetTop: number;
  edgeInsetBottom: number;
  isActive: boolean;
  isOpenRef: RefObject<boolean>;
  onOpen: () => void;
  startDrag: (
    clientX: number,
    clientY: number,
    pointerId: number,
    startProgress: number,
    source: 'trigger',
    options?: { deferVisual?: boolean },
  ) => void;
  updateDrag: (clientX: number, clientY: number, preventDefault?: () => void) => void;
  finishDrag: () => void;
  getDragSource: () => 'trigger' | undefined;
}

const getIframe = (chatLayer: HTMLDivElement | null) =>
  chatLayer?.querySelector('iframe') as HTMLIFrameElement | null;

export const useVardastTriggerInteraction = ({
  containerRef,
  chatLayerRef,
  triggerLaneWidth,
  edgeInsetTop,
  edgeInsetBottom,
  isActive,
  isOpenRef,
  onOpen,
  startDrag,
  updateDrag,
  finishDrag,
  getDragSource,
}: UseVardastTriggerInteractionOptions) => {
  const triggerPointerRef = useRef<TriggerPointerState | null>(null);
  const touchPointerRef = useRef<TriggerPointerState | null>(null);
  const touchHandledByDocumentRef = useRef(false);

  const isInEdgeBand = useCallback(
    (clientY: number) => {
      const container = containerRef.current;
      if (!container) return false;
      const rect = container.getBoundingClientRect();
      return clientY >= rect.top + edgeInsetTop && clientY <= rect.bottom - edgeInsetBottom;
    },
    [containerRef, edgeInsetBottom, edgeInsetTop],
  );

  const isInRightEdgeZone = useCallback(
    (clientX: number, clientY: number) => {
      if (!isInEdgeBand(clientY)) return false;
      const container = containerRef.current;
      if (!container) return false;
      const fromRight = container.getBoundingClientRect().right - clientX;
      return fromRight >= 0 && fromRight <= triggerLaneWidth;
    },
    [containerRef, isInEdgeBand, triggerLaneWidth],
  );

  const setChatPointerBlocked = useCallback(
    (blocked: boolean) => {
      const chatLayer = chatLayerRef.current;
      if (chatLayer) {
        chatLayer.style.pointerEvents = blocked ? 'none' : '';
      }
      const iframe = getIframe(chatLayer);
      if (iframe) {
        iframe.style.pointerEvents = blocked ? 'none' : '';
      }
    },
    [chatLayerRef],
  );

  const isBubbleTarget = useCallback((target: EventTarget | null) => {
    return target instanceof Element && !!target.closest(BUBBLE_SELECTOR);
  }, []);

  const endInteraction = useCallback(
    (state: TriggerPointerState, dragStarted: boolean) => {
      if (state.mode === 'bubble') {
        onOpen();
      } else if (dragStarted || getDragSource() === 'trigger') {
        finishDrag();
      } else {
        onOpen();
      }
      setChatPointerBlocked(false);
    },
    [finishDrag, getDragSource, onOpen, setChatPointerBlocked],
  );

  const tryStartDrag = useCallback(
    (state: TriggerPointerState, clientX: number, clientY: number, pointerId: number) => {
      const deltaX = clientX - state.startX;
      const deltaY = clientY - state.startY;
      if (Math.abs(deltaX) < DRAG_CLICK_THRESHOLD && Math.abs(deltaY) < DRAG_CLICK_THRESHOLD) return false;

      state.dragStarted = true;
      startDrag(state.startX, state.startY, pointerId, 0, 'trigger', { deferVisual: true });
      return true;
    },
    [startDrag],
  );

  // iOS/WebView: iframe often wins hit-testing; capture touch on document before iframe sees it.
  useEffect(() => {
    if (!isActive) return;

    const onTouchStart = (event: TouchEvent) => {
      if (isOpenRef.current) return;
      const touch = event.touches[0];
      if (!touch) return;

      const inLane = isInRightEdgeZone(touch.clientX, touch.clientY);
      const onBubble = isBubbleTarget(event.target);
      if (!inLane && !onBubble) return;

      touchHandledByDocumentRef.current = true;
      setChatPointerBlocked(true);
      event.preventDefault();

      touchPointerRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        pointerId: touch.identifier,
        dragStarted: false,
        mode: onBubble && !inLane ? 'bubble' : 'trigger',
      };
    };

    const onTouchMove = (event: TouchEvent) => {
      const state = touchPointerRef.current;
      if (!state || state.mode === 'bubble') return;

      const touch = Array.from(event.touches).find(item => item.identifier === state.pointerId);
      if (!touch) return;

      if (!state.dragStarted) {
        tryStartDrag(state, touch.clientX, touch.clientY, touch.identifier);
      }

      if (getDragSource() === 'trigger') {
        event.preventDefault();
        updateDrag(touch.clientX, touch.clientY);
      }
    };

    const onTouchEnd = (event: TouchEvent) => {
      const state = touchPointerRef.current;
      if (!state) return;

      const ended = Array.from(event.changedTouches).some(item => item.identifier === state.pointerId);
      if (!ended) return;

      const { dragStarted } = state;
      touchPointerRef.current = null;
      touchHandledByDocumentRef.current = false;
      endInteraction(state, dragStarted);
    };

    document.addEventListener('touchstart', onTouchStart, { capture: true, passive: false });
    document.addEventListener('touchmove', onTouchMove, { capture: true, passive: false });
    document.addEventListener('touchend', onTouchEnd, { capture: true, passive: false });
    document.addEventListener('touchcancel', onTouchEnd, { capture: true, passive: false });

    return () => {
      document.removeEventListener('touchstart', onTouchStart, { capture: true });
      document.removeEventListener('touchmove', onTouchMove, { capture: true });
      document.removeEventListener('touchend', onTouchEnd, { capture: true });
      document.removeEventListener('touchcancel', onTouchEnd, { capture: true });
      touchPointerRef.current = null;
      touchHandledByDocumentRef.current = false;
      setChatPointerBlocked(false);
    };
  }, [
    endInteraction,
    getDragSource,
    isActive,
    isBubbleTarget,
    isInRightEdgeZone,
    isOpenRef,
    setChatPointerBlocked,
    tryStartDrag,
    updateDrag,
  ]);

  const handleTriggerPointerDown = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (!event.isPrimary || isOpenRef.current) return;
      if (event.pointerType === 'touch') return;
      if (touchHandledByDocumentRef.current) return;

      event.stopPropagation();
      setChatPointerBlocked(true);

      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // ignore
      }

      triggerPointerRef.current = {
        startX: event.clientX,
        startY: event.clientY,
        pointerId: event.pointerId,
        dragStarted: false,
        mode: 'trigger',
      };
    },
    [isOpenRef, setChatPointerBlocked],
  );

  const handleTriggerPointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType === 'touch') return;
      const state = triggerPointerRef.current;
      if (!state || state.pointerId !== event.pointerId) return;

      if (!state.dragStarted) {
        tryStartDrag(state, event.clientX, event.clientY, event.pointerId);
      }

      if (getDragSource() === 'trigger') {
        updateDrag(event.clientX, event.clientY, () => event.preventDefault());
      }
    },
    [getDragSource, tryStartDrag, updateDrag],
  );

  const endTriggerPointer = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType === 'touch') return;
      const state = triggerPointerRef.current;
      if (!state || state.pointerId !== event.pointerId) return;

      triggerPointerRef.current = null;
      endInteraction(state, state.dragStarted);

      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        // ignore
      }
    },
    [endInteraction],
  );

  const handleTriggerClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      if (isOpenRef.current || touchHandledByDocumentRef.current) return;
      onOpen();
      setChatPointerBlocked(false);
    },
    [isOpenRef, onOpen, setChatPointerBlocked],
  );

  const handleBubblePointerDown = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      event.stopPropagation();
      if (event.pointerType !== 'touch') {
        setChatPointerBlocked(true);
      }
    },
    [setChatPointerBlocked],
  );

  const handleBubblePointerUp = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      event.stopPropagation();
      if (event.pointerType === 'touch') return;
      if (!isOpenRef.current) onOpen();
      setChatPointerBlocked(false);
    },
    [isOpenRef, onOpen, setChatPointerBlocked],
  );

  const handleBubbleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      if (!isOpenRef.current) onOpen();
      setChatPointerBlocked(false);
    },
    [isOpenRef, onOpen, setChatPointerBlocked],
  );

  return {
    handleTriggerPointerDown,
    handleTriggerPointerMove,
    handleTriggerPointerUp: endTriggerPointer,
    handleTriggerPointerCancel: endTriggerPointer,
    handleTriggerClick,
    handleBubblePointerDown,
    handleBubblePointerUp,
    handleBubbleClick,
  };
};
