import { useLocalParticipant, useRoomContext } from '@livekit/components-react';
import { ConnectionState, RoomEvent } from 'livekit-client';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { buildUiContext, UI_CONTEXT_TOPIC, uiContextKey, type UiContext } from '../context/uiContext';

/**
 * While a voice call is connected, push the doctor's current location to the agent
 * on connect and on every client-side route change.
 */
export function UiContextBridge() {
  const router = useRouter();
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  const lastKey = useRef<string>('');

  useEffect(() => {
    if (!room || !localParticipant) return;

    const publish = (ctx: UiContext) => {
      const key = uiContextKey(ctx);
      if (key === lastKey.current) return;
      lastKey.current = key;
      const bytes = new TextEncoder().encode(JSON.stringify(ctx));
      void localParticipant
        .publishData(bytes, { reliable: true, topic: UI_CONTEXT_TOPIC })
        .catch(() => undefined);
    };

    const snapshot = (asPath = router.asPath) =>
      buildUiContext({
        asPath,
        pathname: router.pathname,
        query: router.query as Record<string, string | string[] | undefined>,
      });

    const pushCurrent = () => {
      if (room.state !== ConnectionState.Connected) return;
      publish(snapshot());
    };

    const onConnected = () => {
      lastKey.current = '';
      pushCurrent();
    };

    const onRoute = (url: string) => {
      if (room.state !== ConnectionState.Connected) return;
      // Next updates pathname/query before routeChangeComplete fires.
      publish(snapshot(url));
    };

    pushCurrent();
    room.on(RoomEvent.Connected, onConnected);
    router.events.on('routeChangeComplete', onRoute);
    return () => {
      room.off(RoomEvent.Connected, onConnected);
      router.events.off('routeChangeComplete', onRoute);
    };
  }, [room, localParticipant, router]);

  return null;
}
