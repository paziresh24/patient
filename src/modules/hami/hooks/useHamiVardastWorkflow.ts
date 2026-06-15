import {
  areVardastWorkflowMessagesEqual,
  parseVardastWorkflowResponse,
  shouldPoolVardastWorkflow,
  VardastWorkflowMessageItem,
  VardastWorkflowResult,
} from '@/modules/hami/apis/parseVardastWorkflowMessages';
import { startHamiVardastWorkflow } from '@/modules/hami/apis/startVardastWorkflow';
import { useCallback, useEffect, useRef, useState } from 'react';

const POOLING_DELAY_MS = 12000;
const RETRY_DELAY_MS = 3000;
const MAX_RETRIES = 3;

const sleep = (ms: number) => new Promise<void>(resolve => window.setTimeout(resolve, ms));

const fetchWorkflowWithRetry = async (chatId: string, isCancelled: () => boolean) => {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt += 1) {
    if (isCancelled()) return null;

    try {
      const response = await startHamiVardastWorkflow(chatId);
      if (isCancelled()) return null;
      return parseVardastWorkflowResponse(response.data);
    } catch (error) {
      console.error('Failed to start hami vardast workflow', error);
      if (attempt < MAX_RETRIES - 1) {
        await sleep(RETRY_DELAY_MS);
      }
    }
  }

  return null;
};

export const useHamiVardastWorkflow = (chatId: string | null, isOpen: boolean) => {
  const [messages, setMessages] = useState<VardastWorkflowMessageItem[]>([]);
  const [appointmentId, setAppointmentId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isPooling, setIsPooling] = useState(false);
  const [isUnsupported, setIsUnsupported] = useState(false);
  const runSeqRef = useRef(0);
  const prevIsOpenRef = useRef(false);

  const runWorkflow = useCallback(async (id: string, options?: { silent?: boolean }) => {
    const runSeq = ++runSeqRef.current;
    const isCancelled = () => runSeq !== runSeqRef.current;

    if (!options?.silent) {
      setIsLoading(true);
      setIsUnsupported(false);
    }

    setIsPooling(false);

    const applyWorkflow = ({ messages: next, appointmentId: nextAppointmentId }: VardastWorkflowResult) => {
      setMessages(prev => (areVardastWorkflowMessagesEqual(prev, next) ? prev : next));
      setAppointmentId(nextAppointmentId);
    };

    const markUnsupported = () => {
      setMessages([]);
      setAppointmentId(undefined);
      setIsUnsupported(true);
    };

    let currentWorkflow = await fetchWorkflowWithRetry(id, isCancelled);

    if (isCancelled()) return;

    if (!options?.silent) {
      setIsLoading(false);
    }

    if (!currentWorkflow) {
      markUnsupported();
      return;
    }

    if (currentWorkflow.messages.length === 0) {
      markUnsupported();
      return;
    }

    setIsUnsupported(false);
    applyWorkflow(currentWorkflow);

    while (shouldPoolVardastWorkflow(currentWorkflow.messages)) {
      await sleep(POOLING_DELAY_MS);
      if (isCancelled()) return;

      setIsPooling(true);
      const nextWorkflow = await fetchWorkflowWithRetry(id, isCancelled);
      setIsPooling(false);

      if (isCancelled()) return;

      if (!nextWorkflow) {
        markUnsupported();
        return;
      }

      if (nextWorkflow.messages.length === 0) {
        markUnsupported();
        return;
      }

      setIsUnsupported(false);
      applyWorkflow(nextWorkflow);
      currentWorkflow = nextWorkflow;
    }
  }, []);

  useEffect(() => {
    prevIsOpenRef.current = false;
    runSeqRef.current += 1;

    if (!chatId) {
      setMessages([]);
      setAppointmentId(undefined);
      setIsLoading(false);
      setIsPooling(false);
      setIsUnsupported(false);
      return;
    }

    runWorkflow(chatId);
  }, [chatId, runWorkflow]);

  useEffect(() => {
    const wasOpen = prevIsOpenRef.current;
    prevIsOpenRef.current = isOpen;

    if (isOpen && !wasOpen && chatId) {
      runWorkflow(chatId, { silent: true });
    }
  }, [isOpen, chatId, runWorkflow]);

  return { messages, appointmentId, isLoading, isPooling, isUnsupported };
};
