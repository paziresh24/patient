import axios from 'axios';

type WidgetInfo = {
  button?: {
    active_text?: string;
    deactive_text?: string;
    endpoint?: string;
  };
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

export function shouldShowLauncherProfileMainButtonWithActiveWidget(
  widgetInfo: WidgetInfo | undefined | null,
  userWidgets: UserWidget[] | undefined | null,
  appKey: string | undefined,
): boolean {
  return Boolean(getLauncherProfileButtonEndpoint(widgetInfo)) && hasActiveLauncherWidget(userWidgets, appKey);
}

export function getLauncherProfileActiveWidgetButtonText(
  widgetInfo: WidgetInfo | undefined | null,
  profileData?: AppProfileData | null,
): string {
  return widgetInfo?.button?.active_text ?? getLauncherProfileMainButtonText(profileData);
}

export function getLauncherProfileWidgetButtonText(
  widgetInfo: WidgetInfo | undefined | null,
  userWidgets: UserWidget[] | undefined | null,
  appKey: string | undefined,
  profileData?: AppProfileData | null,
): string {
  const mainText = getLauncherProfileMainButtonText(profileData);
  const endpoint = getLauncherProfileButtonEndpoint(widgetInfo);
  if (!endpoint) return mainText;

  if (hasActiveLauncherWidget(userWidgets, appKey)) {
    return getLauncherProfileActiveWidgetButtonText(widgetInfo, profileData);
  }

  return widgetInfo?.button?.deactive_text ?? mainText;
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
  const endpoint = widgetInfo?.button?.endpoint;
  if (!endpoint) return undefined;

  // active_text (e.g. لغو اتصال) → outline, deactive_text (e.g. همگام‌سازی) → filled
  return hasActiveLauncherWidget(userWidgets, appKey);
}

export function getLauncherProfileButtonEndpoint(widgetInfo: WidgetInfo | undefined | null): string | undefined {
  return widgetInfo?.button?.endpoint || undefined;
}

export function appendSessionTokenToEndpoint(endpoint: string, sessionToken: string): string {
  const url = new URL(endpoint);
  url.searchParams.set('session_token', sessionToken);
  return url.toString();
}

export function getProfileScopesForSessionToken(profileData: AppProfileData | undefined | null): string[] {
  if (!Array.isArray(profileData?.scopes)) return [];
  return profileData.scopes.map(item => item?.scope).filter((scope): scope is string => Boolean(scope));
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

export async function openLauncherProfileButtonEndpoint(
  appKey: string,
  endpoint: string,
  profileData?: AppProfileData | null,
): Promise<void> {
  const scopes = getProfileScopesForSessionToken(profileData);
  const sessionToken = await fetchHamdastSessionToken(appKey, scopes);
  window.location.href = appendSessionTokenToEndpoint(endpoint, sessionToken);
}
