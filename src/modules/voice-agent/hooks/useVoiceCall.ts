import { Room, RoomEvent, Track } from 'livekit-client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createVoiceSession } from '../api/createVoiceSession';

export type CallStatus =
  | 'idle'
  | 'ringing'
  | 'connecting'
  | 'listening'
  | 'speaking'
  | 'error'
  | 'ended';

export function useVoiceCall() {
  const [status, setStatus] = useState<CallStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const roomRef = useRef<Room | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioElsRef = useRef<HTMLAudioElement[]>([]);

  const cleanupTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const cleanupAudio = () => {
    for (const el of audioElsRef.current) {
      try {
        el.pause();
        el.remove();
      } catch {
        // ignore
      }
    }
    audioElsRef.current = [];
  };

  const hangup = useCallback(async () => {
    cleanupTimer();
    cleanupAudio();
    const room = roomRef.current;
    roomRef.current = null;
    if (room) {
      try {
        await room.disconnect();
      } catch {
        // ignore
      }
    }
    setStatus('ended');
    setMuted(false);
  }, []);

  const start = useCallback(async () => {
    setError(null);
    setStatus('ringing');
    setElapsedSec(0);

    // Brief ring feel before connecting (phone metaphor).
    await new Promise(r => setTimeout(r, 900));
    setStatus('connecting');

    try {
      const data = await createVoiceSession();

      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
      });
      roomRef.current = room;

      let micEnabled = false;
      const enableMicOnce = async () => {
        if (micEnabled || !roomRef.current) return;
        micEnabled = true;
        await room.localParticipant.setMicrophoneEnabled(true);
      };

      room.on(RoomEvent.TrackSubscribed, (track) => {
        if (track.kind === Track.Kind.Audio) {
          const el = track.attach();
          el.autoplay = true;
          el.setAttribute('playsinline', 'true');
          document.body.appendChild(el);
          audioElsRef.current.push(el);
          void el.play().catch(() => {
            // Autoplay may be blocked; user already tapped FAB so retry once.
            void el.play();
          });
          setStatus('speaking');
          // Open mic after agent starts talking (call answered).
          void enableMicOnce();
        }
      });
      room.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
        const remoteSpeaking = speakers.some(s => !s.isLocal);
        if (remoteSpeaking) setStatus('speaking');
        else if (micEnabled) setStatus('listening');
      });
      room.on(RoomEvent.Disconnected, () => {
        setStatus(prev => (prev === 'ended' ? prev : 'ended'));
      });

      await room.connect(data.url, data.token ?? '');
      // Keep mic closed until agent greets — avoids cancelling the opening line.
      await room.localParticipant.setMicrophoneEnabled(false);

      startedAtRef.current = Date.now();
      timerRef.current = setInterval(() => {
        if (startedAtRef.current) {
          setElapsedSec(Math.floor((Date.now() - startedAtRef.current) / 1000));
        }
      }, 1000);

      // Fallback: if greeting audio is slow, open mic after 4s so doctor can speak.
      window.setTimeout(() => {
        void enableMicOnce().then(() => setStatus(prev => (prev === 'connecting' ? 'listening' : prev)));
      }, 4000);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'call_failed';
      cleanupTimer();
      cleanupAudio();
      const room = roomRef.current;
      roomRef.current = null;
      if (room) {
        try {
          await room.disconnect();
        } catch {
          // ignore
        }
      }
      setError(message);
      setStatus('error');
    }
  }, []);

  const toggleMute = useCallback(async () => {
    const room = roomRef.current;
    if (!room) return;
    const next = !muted;
    await room.localParticipant.setMicrophoneEnabled(!next);
    setMuted(next);
  }, [muted]);

  useEffect(() => {
    return () => {
      cleanupTimer();
      cleanupAudio();
      roomRef.current?.disconnect();
      roomRef.current = null;
    };
  }, []);

  return {
    status,
    error,
    muted,
    elapsedSec,
    start,
    hangup,
    toggleMute,
  };
}

export function formatCallTimer(sec: number): string {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
