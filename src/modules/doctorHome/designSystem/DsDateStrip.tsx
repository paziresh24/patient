import classNames from '@/common/utils/classNames';
import moment from 'jalali-moment';
import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { animated, useSpring } from 'react-spring';
import { HOLIDAY_YEAR_END, HOLIDAY_YEAR_START, useHolidays } from '../apis/holidays';
import { useFullDayVacationSet } from '../apis/vacations';
import { useSelectedDateStore } from '../store/selectedDate';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { ds } from './tokens';

const BUFFER = 30;
const SNAP_MAX = 7;
const SNAP_SPRING = { tension: 320, friction: 30, mass: 1 };

export interface DsDateStripRef {
  goToToday: () => void;
}

export const DsDateStrip = forwardRef<DsDateStripRef, { className?: string }>(({ className }, ref) => {
  const today = moment();
  const selectedDate = useSelectedDateStore(s => s.selectedDate);
  const setSelectedDate = useSelectedDateStore(s => s.setSelectedDate);

  const containerRef = useRef<HTMLDivElement>(null);
  const [cellW, setCellW] = useState(0);
  const cellWRef = useRef(0);
  const selectedMomentRef = useRef(moment(selectedDate, 'YYYY-MM-DD'));
  const [spring, api] = useSpring(() => ({ x: 0 }));
  const pointerRef = useRef({
    active: false, pointerId: -1,
    startX: 0, lastX: 0, lastTime: 0,
    velocity: 0, hasDragged: false,
    lastCell: 0,
  });
  const snapCancelledRef = useRef(false);
  const snapCellRef = useRef(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastSoundTimeRef = useRef(0);

  const getAudioCtx = () => {
    try {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') audioCtxRef.current = new Ctor();
      if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
      return audioCtxRef.current;
    } catch { return null; }
  };

  const playTick = () => {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(900, t + 0.025);
    gain.gain.setValueAtTime(0.025, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    osc.start(t);
    osc.stop(t + 0.03);
  };


  const selectedMoment = useMemo(() => moment(selectedDate, 'YYYY-MM-DD'), [selectedDate]);
  const isToday = selectedMoment.isSame(today, 'day');

  const user = useUserInfoStore(s => s.info);
  const centerIds = useMemo(
    () => (user?.provider?.centers ?? []).map((c: { id?: string }) => c.id).filter((id): id is string => !!id),
    [user?.provider?.centers],
  );

  const { data: holidays } = useHolidays(HOLIDAY_YEAR_START, HOLIDAY_YEAR_END);
  const holidaySet = useMemo(() => new Set((holidays ?? []).filter(h => h.is_holiday).map(h => h.date)), [holidays]);
  const vacationSet = useFullDayVacationSet(centerIds, selectedDate);

  useEffect(() => { selectedMomentRef.current = selectedMoment; }, [selectedMoment]);

  const TOTAL = BUFFER * 2 + 1;

  const days = useMemo(
    () => Array.from({ length: TOTAL }, (_, i) => selectedMoment.clone().add(BUFFER - i, 'days')),
    [selectedMoment],
  );

  // ── Measure ──────────────────────────────────────────────────────────────
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const measure = () => {
      const w = container.offsetWidth / 7;
      cellWRef.current = w;
      setCellW(w);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // ── Center the selected cell via scrollLeft ───────────────────────────────
  // Using scrollLeft (not transform) for the base position avoids the
  // overflow-clip vs. transform conflict. Spring only handles drag delta.
  //
  // scrollLeft = left edge of the viewport:
  //   cell[BUFFER].left  = BUFFER * cellW
  //   viewport center    = 3.5 * cellW (7 cells wide)
  //   scrollLeft = BUFFER*cellW − 3.5*cellW + 0.5*cellW = (BUFFER − 3)*cellW
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || cellW === 0) return;
    container.scrollLeft = (BUFFER - 3) * cellW;
  }, [cellW, selectedDate]); // reset on date change too, in case spring reset race

  // ── Drag / snap ──────────────────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      snapCancelledRef.current = true;
      api.stop();
      api.set({ x: 0 });
      pointerRef.current = {
        active: true, pointerId: e.pointerId,
        startX: e.clientX, lastX: e.clientX,
        lastTime: performance.now(), velocity: 0, hasDragged: false, lastCell: 0,
      };
    };

    const onPointerMove = (e: PointerEvent) => {
      const state = pointerRef.current;
      if (!state.active || state.pointerId !== e.pointerId) return;
      const now = performance.now();
      const dx = e.clientX - state.lastX;
      const dt = Math.max(now - state.lastTime, 1);
      state.lastX = e.clientX;
      state.lastTime = now;
      state.velocity = dx / dt; // px/ms
      if (!state.hasDragged && Math.abs(e.clientX - state.startX) > 5) {
        state.hasDragged = true;
        container.setPointerCapture(e.pointerId);
      }
      if (state.hasDragged) {
        e.preventDefault();
        api.set({ x: spring.x.get() + dx });
        const newCell = Math.round(spring.x.get() / cellWRef.current);
        if (newCell !== state.lastCell) {
          state.lastCell = newCell;
          const nowMs = performance.now();
          if (nowMs - lastSoundTimeRef.current > 48) {
            lastSoundTimeRef.current = nowMs;
            playTick();
          }
        }
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      const state = pointerRef.current;
      if (!state.active || state.pointerId !== e.pointerId) return;
      state.active = false;
      if (container.hasPointerCapture(e.pointerId)) container.releasePointerCapture(e.pointerId);
      if (!state.hasDragged) return;

      const cw = cellWRef.current || 53;
      const currentX = spring.x.get();
      const momentum = state.velocity * 80;
      const rawSnap = Math.round((currentX + momentum) / cw);
      // positive = dragged right = going to past
      const snappedDays = Math.max(-SNAP_MAX, Math.min(SNAP_MAX, rawSnap));
      const snapX = snappedDays * cw;

      snapCancelledRef.current = false;
      snapCellRef.current = Math.round(currentX / cw);
      api.start({
        x: snapX,
        config: SNAP_SPRING,
        onChange: ({ value }: { value: { x: number } }) => {
          const cell = Math.round(value.x / cw);
          if (cell !== snapCellRef.current) {
            snapCellRef.current = cell;
            const nowMs = performance.now();
            if (nowMs - lastSoundTimeRef.current > 30) {
              lastSoundTimeRef.current = nowMs;
              playTick();
            }
          }
        },
        onRest: () => {
          if (snapCancelledRef.current) return;
          if (snappedDays !== 0) {
            const newDate = selectedMomentRef.current.clone().add(snappedDays, 'days');
            // flushSync forces React to re-render + run useLayoutEffect (scrollLeft reset)
            // synchronously before this callback returns, so when api.set({x:0}) fires
            // the new days array is already in place — no visible flash back to old position.
            flushSync(() => setSelectedDate(newDate.format('YYYY-MM-DD')));
          }
          api.set({ x: 0 });
        },
      });
    };

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove, { passive: false });
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointercancel', onPointerUp);
    return () => {
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointercancel', onPointerUp);
    };
  }, [api, setSelectedDate]);

  const goToToday = () => {
    snapCancelledRef.current = true;
    api.stop();
    api.set({ x: 0 });
    setSelectedDate(today.format('YYYY-MM-DD'));
  };

  useImperativeHandle(ref, () => ({ goToToday }));

  return (
    <div className={classNames('select-none', className)}>
      {/*
        Wrapper is relative so overlays (indicator + edge fades) can be
        positioned on top of the scroll container without being clipped or
        masked by it.
      */}
      <div className="relative">
        {/* ── Scrolling date track ─────────────────────────────────────── */}
        <div
          ref={containerRef}
          dir="ltr"
          className="w-full cursor-grab touch-none active:cursor-grabbing"
          style={{ overflow: 'hidden' }}
        >
          {cellW > 0 && (
            <animated.div
              className="flex"
              style={{
                transform: spring.x.to(x => `translateX(${x}px)`),
                width: TOTAL * cellW,
              }}
            >
              {days.map((day, idx) => {
                const isoDate = day.format('YYYY-MM-DD');
                const isSelected = isoDate === selectedDate;
                const isDayToday = day.isSame(today, 'day');
                const isMonthBoundary = idx < TOTAL - 1 && day.jMonth() !== days[idx + 1].jMonth();
                const isHoliday = holidaySet.has(isoDate) || day.day() === 5;
                const isVacation = vacationSet.has(isoDate);

                return (
                  <div
                    key={isoDate}
                    className="relative flex shrink-0 flex-col items-center gap-1 py-1"
                    style={{ width: cellW }}
                  >
                    {isMonthBoundary && (
                      <div
                        className="pointer-events-none absolute inset-y-0 right-0 z-10 flex items-center justify-center"
                        style={{ width: 0 }}
                      >
                        <span
                          className="text-[8px] font-medium text-slate-400 whitespace-nowrap"
                          style={{ transform: 'rotate(-90deg)', display: 'block' }}
                        >
                          {day.clone().locale('fa').format('jMMMM')}
                        </span>
                      </div>
                    )}
                    <span
                      className={classNames(
                        ds.type.dateDay,
                        isSelected && isHoliday ? 'font-semibold text-red-400'
                        : isSelected ? 'font-semibold text-primary'
                        : isHoliday ? 'text-red-400'
                        : isDayToday ? 'text-primary/70'
                        : '',
                      )}
                    >
                      {day.clone().locale('fa').format('dd')}
                    </span>

                    <span
                      className={classNames(
                        'flex h-9 w-9 items-center justify-center text-sm font-bold',
                        isSelected
                          ? classNames(ds.radius.pill, isHoliday ? 'bg-red-500 text-white shadow-[0_3px_12px_rgba(239,68,68,0.45)]' : 'bg-primary text-white shadow-[0_3px_12px_rgba(56,97,251,0.45)]')
                          : isHoliday
                          ? 'text-red-500'
                          : isDayToday
                          ? 'text-primary'
                          : 'text-slate-500',
                      )}
                    >
                      <span className={isVacation ? 'line-through decoration-2' : ''}>
                        {day.clone().locale('fa').format('jD')}
                      </span>
                    </span>

                    <span
                      className={classNames(
                        'h-1 w-1 rounded-full',
                        isDayToday && !isSelected ? 'bg-primary' : 'bg-transparent',
                      )}
                    />
                  </div>
                );
              })}
            </animated.div>
          )}
        </div>

        {/* ── Edge fades — outside the scroll container, not clipped ───── */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10"
          style={{ width: '18%', background: 'linear-gradient(to right, #F2F3F5 30%, transparent)' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10"
          style={{ width: '18%', background: 'linear-gradient(to left, #F2F3F5 30%, transparent)' }}
        />

        {/* ── Center slot indicator — fixed, outside scroll & mask ──────── */}
        {cellW > 0 && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 z-20"
            style={{ left: 3 * cellW, width: cellW }}
          >
            <div
              className="mx-1 h-[calc(100%-4px)]"
              style={{
                marginTop: '-0.1rem',
                borderRadius: 52,
                boxShadow: '0 0 0 1.5px rgba(0,0,0,0.08), 0 2px 10px rgba(0,0,0,0.07)',
              }}
            />
          </div>
        )}
      </div>

    </div>
  );
});
