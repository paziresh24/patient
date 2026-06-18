import { fetchHamiVardastActions } from '@/modules/hami/apis/fetchVardastActions';
import { areVardastActionsEqual, VardastWorkflowAppPopupAction } from '@/modules/hami/apis/parseVardastActions';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useHamiVardastActions = (chatId: string | null, isOpen: boolean, enabled = true) => {
  const [actions, setActions] = useState<VardastWorkflowAppPopupAction[]>([]);
  const [appointmentId, setAppointmentId] = useState<string | undefined>();
  const runSeqRef = useRef(0);
  const prevIsOpenRef = useRef(false);

  const fetchActions = useCallback(async (id: string) => {
    const runSeq = ++runSeqRef.current;
    const isCancelled = () => runSeq !== runSeqRef.current;

    try {
      const result = await fetchHamiVardastActions(id);
      if (isCancelled()) return;

      setActions(prev => (areVardastActionsEqual(prev, result.actions) ? prev : result.actions));
      setAppointmentId(result.appointmentId);
    } catch (error) {
      if (isCancelled()) return;
      console.error('Failed to fetch hami vardast actions', error);
      setActions([]);
      setAppointmentId(undefined);
    }
  }, []);

  useEffect(() => {
    prevIsOpenRef.current = false;
    runSeqRef.current += 1;

    if (!chatId || !enabled) {
      setActions([]);
      setAppointmentId(undefined);
      return;
    }

    fetchActions(chatId);
  }, [chatId, enabled, fetchActions]);

  useEffect(() => {
    const wasOpen = prevIsOpenRef.current;
    prevIsOpenRef.current = isOpen;

    if (isOpen && !wasOpen && chatId && enabled) {
      fetchActions(chatId);
    }
  }, [isOpen, chatId, enabled, fetchActions]);

  return { actions, appointmentId };
};
