import Paziresh24Button from '.plasmic/Paziresh24Button';
import { Popover } from '@/common/fragment/components/popover';
import ThreeDotsIcon from '@/common/components/icons/threeDots';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    const disconnectText = getLauncherProfileActiveWidgetButtonText(widgetInfo, profileData);

    return (
      <div className="flex w-full min-w-0 items-stretch gap-2.5">
        <Paziresh24Button
          children2={getLauncherProfileMainButtonText(profileData)}
          className={classNames(buttonClassName, 'min-w-0 flex-1')}
          onClick={() => {
            void onMainClick?.();
          }}
        />
        <Popover
          open={isMenuOpen}
          onOpenChange={setIsMenuOpen}
          align="start"
          side="bottom"
          sideOffset={6}
          trigger={
            <Paziresh24Button
              outline
              isDisabled={isEndpointButtonLoading}
              className="!min-w-0 shrink-0 !px-3"
              children2={<ThreeDotsIcon className="h-4 w-4" />}
            />
          }
          content={
            <div
              role="menu"
              className="w-36 overflow-hidden rounded-md border border-slate-200 bg-white py-1 shadow-card"
            >
              <button
                type="button"
                role="menuitem"
                data-testid="launcher-profile-disconnect"
                disabled={isEndpointButtonLoading}
                className="flex w-full items-center px-3 py-2.5 text-right text-sm font-bold text-[#e54d2e] transition-colors hover:bg-[#fff0ee] disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => {
                  setIsMenuOpen(false);
                  void handleEndpointClick();
                }}
              >
                {isEndpointButtonLoading ? 'در حال پردازش...' : disconnectText}
              </button>
            </div>
          }
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
