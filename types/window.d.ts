interface Window {
  ga: any;
  Android: {
    shareQA: any;
    login: any;
    updateCity: any;
    rateApp: any;
  };
  doctor: any;
  paziresh24: any;
  pishani?: {
    sendEvent: (event: 'CLICK' | 'PAGE_VIEW', payload?: Record<string, unknown>) => Promise<void> | void;
  };
  user: any;
  najvaUserSubscribed: any;
  clarity: any;
  gozarLogin: any;
  isMessageListenerAdded: any;
  requestIdleCallback?: (callback: (deadline: IdleDeadline) => void, options?: { timeout?: number }) => number;
}

declare const window: Window;

