import Paziresh24Button from '.plasmic/Paziresh24Button';
import classNames from '@/common/utils/classNames';
import { useRef, useState } from 'react';
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
  const isEndpointLoadingRef = useRef(false);
  const [isEndpointPending, setIsEndpointPending] = useState(false);
  const showMainWithActiveWidget = shouldShowLauncherProfileMainButtonWithActiveWidget(widgetInfo, userWidgets, appKey);
  const endpoint = getLauncherProfileButtonEndpoint(widgetInfo);
  const buttonClassName = classNames('__wab_instance', className);
  const isEndpointButtonLoading = isLoading || isEndpointPending;

  const handleEndpointClick = async () => {
    if (!endpoint || !appKey || isEndpointLoadingRef.current || isEndpointPending || isLoading) return;

    isEndpointLoadingRef.current = true;
    setIsEndpointPending(true);
    onLoadingChange?.(true);
    try {
      await openLauncherProfileButtonEndpoint(appKey, endpoint, profileData);
    } catch {
      isEndpointLoadingRef.current = false;
      setIsEndpointPending(false);
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
          isDisabled={isEndpointButtonLoading}
          loading={isEndpointButtonLoading}
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
      isDisabled={Boolean(endpoint && isEndpointButtonLoading)}
      loading={Boolean(endpoint && isEndpointButtonLoading)}
      outline={isLauncherProfileButtonOutline(widgetInfo, userWidgets, appKey)}
      onClick={() => {
        void handleSingleButtonClick();
      }}
    />
  );
}
