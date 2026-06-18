import axios from 'axios';

type WidgetButton = {
  connect_text?: string;
  connect_endpoint?: string;
  disconnect_text?: string;
  disconnect_endpoint?: string;
  active_text?: string;
  deactive_text?: string;
  endpoint?: string;
};

type WidgetInfo = {
  button?: WidgetButton;
};

type UserWidget = {
  app?: string;
};

type ProfileScope = {
  id?: string;
  scope?: string;
};

type AppProfileData = {
  button_text?: string;
  scopes?: ProfileScope[];
};

export function hasActiveLauncherWidget(userWidgets: UserWidget[] | undefined | null, appKey: string | undefined): boolean {
  if (!Array.isArray(userWidgets) || !appKey) return false;
  return userWidgets.some(widget => widget.app === appKey);
}

export function getLauncherProfileMainButtonText(profileData?: AppProfileData | null): string {
  return profileData?.button_text ?? 'اجرا';
}

function getWidgetButton(widgetInfo: WidgetInfo | undefined | null): WidgetButton | undefined {
  return widgetInfo?.button;
}

export function getLauncherProfileConnectButtonEndpoint(widgetInfo: WidgetInfo | undefined | null): string | undefined {
  const button = getWidgetButton(widgetInfo);
  return button?.connect_endpoint || button?.endpoint || undefined;
}

export function getLauncherProfileDisconnectButtonEndpoint(widgetInfo: WidgetInfo | undefined | null): string | undefined {
  const button = getWidgetButton(widgetInfo);
  return button?.disconnect_endpoint || button?.endpoint || undefined;
}

export function shouldShowLauncherProfileMainButtonWithActiveWidget(
  widgetInfo: WidgetInfo | undefined | null,
  userWidgets: UserWidget[] | undefined | null,
  appKey: string | undefined,
): boolean {
  return Boolean(getLauncherProfileDisconnectButtonEndpoint(widgetInfo)) && hasActiveLauncherWidget(userWidgets, appKey);
}

export function getLauncherProfileActiveWidgetButtonText(
  widgetInfo: WidgetInfo | undefined | null,
  profileData?: AppProfileData | null,
): string {
  const button = getWidgetButton(widgetInfo);
  return button?.disconnect_text ?? button?.active_text ?? getLauncherProfileMainButtonText(profileData);
}

export function getLauncherProfileWidgetButtonText(
  widgetInfo: WidgetInfo | undefined | null,
  userWidgets: UserWidget[] | undefined | null,
  appKey: string | undefined,
  profileData?: AppProfileData | null,
): string {
  const mainText = getLauncherProfileMainButtonText(profileData);
  const button = getWidgetButton(widgetInfo);
  const connectEndpoint = getLauncherProfileConnectButtonEndpoint(widgetInfo);
  const disconnectEndpoint = getLauncherProfileDisconnectButtonEndpoint(widgetInfo);
  if (!connectEndpoint && !disconnectEndpoint) return mainText;

  if (hasActiveLauncherWidget(userWidgets, appKey)) {
    return getLauncherProfileActiveWidgetButtonText(widgetInfo, profileData);
  }

  return button?.connect_text ?? button?.deactive_text ?? mainText;
}

export function getLauncherProfileButtonText(
  widgetInfo: WidgetInfo | undefined | null,
  userWidgets: UserWidget[] | undefined | null,
  appKey: string | undefined,
  profileData?: AppProfileData | null,
): string {
  return getLauncherProfileWidgetButtonText(widgetInfo, userWidgets, appKey, profileData);
}

export function isLauncherProfileButtonOutline(
  widgetInfo: WidgetInfo | undefined | null,
  userWidgets: UserWidget[] | undefined | null,
  appKey: string | undefined,
): boolean | undefined {
  const connectEndpoint = getLauncherProfileConnectButtonEndpoint(widgetInfo);
  const disconnectEndpoint = getLauncherProfileDisconnectButtonEndpoint(widgetInfo);
  if (!connectEndpoint && !disconnectEndpoint) return undefined;

  // disconnect_text (e.g. لغو اتصال) → outline, connect_text (e.g. همگام‌سازی) → filled
  return hasActiveLauncherWidget(userWidgets, appKey);
}

export function getLauncherProfileButtonEndpoint(
  widgetInfo: WidgetInfo | undefined | null,
  userWidgets?: UserWidget[] | undefined | null,
  appKey?: string | undefined,
): string | undefined {
  if (hasActiveLauncherWidget(userWidgets, appKey)) {
    return getLauncherProfileDisconnectButtonEndpoint(widgetInfo);
  }

  return getLauncherProfileConnectButtonEndpoint(widgetInfo);
}

export function appendSessionTokenToEndpoint(endpoint: string, sessionToken: string): string {
  const url = new URL(endpoint);
  url.searchParams.set('session_token', sessionToken);
  return url.toString();
}

export function getProfileScopesForSessionToken(profileData: AppProfileData | undefined | null): string[] {
  const scopes = profileData?.scopes;
  if (!Array.isArray(scopes)) return [];
  return scopes.map(item => item?.scope).filter((scope): scope is string => Boolean(scope));
}

export async function fetchHamdastSessionToken(appKey: string, scopes?: string[] | null): Promise<string> {
  const response = await axios.post(
    `https://hamdast.paziresh24.com/api/v1/apps/${appKey}/oauth/session_token`,
    {
      ...(scopes?.length ? { scope: scopes } : {}),
    },
    { withCredentials: true },
  );

  const sessionToken = response.data?.session_token;
  if (!sessionToken) {
    throw new Error('session_token not found');
  }

  return sessionToken;
}

export function createHamdastCacheBustQueryParam(): string {
  return `_=${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function buildHamdastWidgetsUrl(userId: string | number, cacheBust: string): string {
  return `https://hamdast.paziresh24.com/api/v1/widgets/?user_id=${userId}&${cacheBust}`;
}

export async function openLauncherProfileButtonEndpoint(
  appKey: string,
  endpoint: string,
  profileData?: AppProfileData | null,
): Promise<void> {
  const scopes = getProfileScopesForSessionToken(profileData);
  const sessionToken = await fetchHamdastSessionToken(appKey, scopes);
  window.location.href = appendSessionTokenToEndpoint(endpoint, sessionToken);
}
