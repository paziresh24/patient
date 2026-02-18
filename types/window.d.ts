interface RasanPushPermissionResult {
  device_token: string;
  platform: string;
  os: string;
}

interface RasanPush {
  isSupported: () => boolean;
  hasPermission: () => Promise<boolean>;
  requestPermission: () => Promise<RasanPushPermissionResult | null>;
}

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
  rasan?: {
    push: RasanPush;
    init: (config: { appId: string }) => void;
  };
  RASAN?: {
    queue: any[];
  };
}

declare const window: Window;
