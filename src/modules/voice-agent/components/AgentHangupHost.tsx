import { useRoomContext } from '@livekit/components-react';
import { RoomEvent } from 'livekit-client';
import { useEffect, useRef } from 'react';
import { useVoiceCallUiStore } from '../store/voiceCallUi';
import { AGENT_HANGUP_TOPIC, END_CALL_RPC } from '../ui-surface/types';

const DEFAULT_FAREWELL_MS = 3200;
const ENDED_HOLD_MS = 1600;

/**
 * Listens for agent hangup signals and runs a graceful teardown:
 * wait for farewell speech → show «تماس پایان یافت» → close sheet / disconnect.
 */
export function AgentHangupHost() {
  const room = useRoomContext();
  const running = useRef(false);

  useEffect(() => {
    if (!room) return;

    const runSequence = (farewellMs: number) => {
      if (running.current) return;
      running.current = true;

      const waitFarewell = Math.max(2000, Math.min(farewellMs || DEFAULT_FAREWELL_MS, 8000));
      const store = useVoiceCallUiStore.getState();
      store.expandCall();

      // 1) Let goodbye TTS finish while call UI stays up.
      window.setTimeout(() => {
        useVoiceCallUiStore.getState().beginEnding();

        // 2) Hold the «تماس پایان یافت» screen, then disconnect.
        window.setTimeout(() => {
          void room.disconnect().catch(() => undefined);
          useVoiceCallUiStore.getState().endCall();
          running.current = false;
        }, ENDED_HOLD_MS);
      }, waitFarewell);
    };

    const hangupHandler = async (data: { payload: string }) => {
      let delayMs = DEFAULT_FAREWELL_MS;
      try {
        const parsed = JSON.parse(data.payload || '{}') as { delayMs?: number };
        if (typeof parsed.delayMs === 'number') delayMs = parsed.delayMs;
      } catch {
        // ignore
      }
      runSequence(delayMs);
      return JSON.stringify({ ok: true });
    };

    try {
      room.registerRpcMethod(END_CALL_RPC, hangupHandler);
    } catch {
      try {
        room.unregisterRpcMethod(END_CALL_RPC);
        room.registerRpcMethod(END_CALL_RPC, hangupHandler);
      } catch {
        // ignore
      }
    }

    const onData = (payload: Uint8Array, _p?: unknown, _k?: unknown, topic?: string) => {
      if (topic && topic !== AGENT_HANGUP_TOPIC) return;
      try {
        const parsed = JSON.parse(new TextDecoder().decode(payload)) as {
          type?: string;
          delayMs?: number;
        };
        if (topic === AGENT_HANGUP_TOPIC || parsed?.type === 'hangup') {
          runSequence(typeof parsed.delayMs === 'number' ? parsed.delayMs : DEFAULT_FAREWELL_MS);
        }
      } catch {
        if (topic === AGENT_HANGUP_TOPIC) runSequence(DEFAULT_FAREWELL_MS);
      }
    };

    room.on(RoomEvent.DataReceived, onData);
    return () => {
      try {
        room.unregisterRpcMethod(END_CALL_RPC);
      } catch {
        // ignore
      }
      room.off(RoomEvent.DataReceived, onData);
    };
  }, [room]);

  return null;
}
