import Paziresh24Button from '.plasmic/Paziresh24Button';
import classNames from '@/common/utils/classNames';
import {
  getLauncherProfileActiveWidgetButtonText,
  getLauncherProfileButtonEndpoint,
  getLauncherProfileMainButtonText,
  getLauncherProfileWidgetButtonText,
  isLauncherProfileButtonOutline,
  openLauncherProfileButtonEndpoint,
  shouldShowLauncherProfileMainButtonWithActiveWidget,
} from '@/modules/hamdast/utils/launcherProfileButton';

type LauncherProfileActionButtonsProps = {
  widgetInfo?: { button?: { active_text?: string; deactive_text?: string; endpoint?: string } } | null;
  userWidgets?: Array<{ app?: string }> | null;
  appKey?: string;
  profileData?: { button_text?: string; scopes?: Array<{ id?: string; scope?: string }> } | null;
  isLoading?: boolean;
  onLoadingChange?: (loading: boolean) => void;
  onMainClick?: () => void | Promise<void>;
  className?: string;
};

export function LauncherProfileActionButtons({
  widgetInfo,
  userWidgets,
  appKey,
  profileData,
  isLoading = false,
  onLoadingChange,
  onMainClick,
  className,
}: LauncherProfileActionButtonsProps) {
  const showMainWithActiveWidget = shouldShowLauncherProfileMainButtonWithActiveWidget(widgetInfo, userWidgets, appKey);
  const endpoint = getLauncherProfileButtonEndpoint(widgetInfo);
  const buttonClassName = classNames('__wab_instance', className);

  const handleEndpointClick = async () => {
    if (!endpoint || !appKey) return;

    onLoadingChange?.(true);
    try {
      await openLauncherProfileButtonEndpoint(appKey, endpoint, profileData);
    } catch {
      onLoadingChange?.(false);
    }
  };

  const handleSingleButtonClick = async () => {
    if (endpoint) {
      await handleEndpointClick();
      return;
    }

    await onMainClick?.();
  };

  if (showMainWithActiveWidget) {
    return (
      <div className="flex flex-col w-full gap-2.5 min-w-0">
        <Paziresh24Button
          children2={getLauncherProfileMainButtonText(profileData)}
          className={buttonClassName}
          onClick={() => {
            void onMainClick?.();
          }}
        />
        <Paziresh24Button
          children2={getLauncherProfileActiveWidgetButtonText(widgetInfo, profileData)}
          className={buttonClassName}
          loading={isLoading}
          outline
          onClick={() => {
            void handleEndpointClick();
          }}
        />
      </div>
    );
  }

  return (
    <Paziresh24Button
      children2={getLauncherProfileWidgetButtonText(widgetInfo, userWidgets, appKey, profileData)}
      className={buttonClassName}
      loading={Boolean(endpoint && isLoading)}
      outline={isLauncherProfileButtonOutline(widgetInfo, userWidgets, appKey)}
      onClick={() => {
        void handleSingleButtonClick();
      }}
    />
  );
}
