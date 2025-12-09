import Loading from '@/common/components/atom/loading/loading';
import Modal from '@/common/components/atom/modal';
import useModal from '@/common/hooks/useModal';
import { apiGatewayClient } from '@/common/apis/client';
import { forwardRef, useImperativeHandle, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import classNames from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { GlobalActionsProvider } from '@plasmicapp/host';
import { createContext, useContext, useRef, useMemo } from 'react';

export interface HamdastApp {
  app_key: string;
  title: string;
  subtitle: string;
  icon: string;
  link: string;
  category: {
    key: string;
    title: string;
  };
  badges: any[];
  gradual_release: boolean;
  functions: string[];
}

export interface CustomApp {
  app_key: string;
  title: string;
  subtitle?: string;
  icon?: string;
  link?: string;
  category?: {
    key: string;
    title: string;
  };
  [key: string]: any;
}

export interface HamdastAppsSelectorModalRef {
  open: (appKeys?: string[], customApps?: CustomApp[], title?: string) => void;
  close: () => void;
}

interface HamdastAppsSelectorModalProps {
  onAppSelect?: (app: HamdastApp | CustomApp) => void;
}

export const HamdastAppsSelectorModal = forwardRef<HamdastAppsSelectorModalRef, HamdastAppsSelectorModalProps>(({ onAppSelect }, ref) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [apps, setApps] = useState<HamdastApp[]>([]);
  const [customApps, setCustomApps] = useState<CustomApp[]>([]);
  const [filteredApps, setFilteredApps] = useState<(HamdastApp | CustomApp)[]>([]);
  const [selectedAppKeys, setSelectedAppKeys] = useState<string[]>([]);
  const [title, setTitle] = useState<string>('انتخاب اپلیکیشن');

  const { handleClose, handleOpen, modalProps } = useModal({
    onClose: () => {
      setApps([]);
      setCustomApps([]);
      setFilteredApps([]);
      setSelectedAppKeys([]);
      setTitle('انتخاب اپلیکیشن');
      setIsNavigating(false);
    },
  });

  const fetchApps = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiGatewayClient.get('/v1/hamdast/apps', {
        withCredentials: true,
      });
      const fetchedApps: HamdastApp[] = response.data || [];
      setApps(fetchedApps);
      return fetchedApps;
    } catch (error: any) {
      console.error('Error fetching apps:', error);
      toast.error(error?.response?.data?.message || 'خطا در دریافت لیست اپلیکیشن‌ها');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filterApps = useCallback((allApps: HamdastApp[], customAppsList: CustomApp[], appKeys?: string[]) => {
    if (!appKeys || appKeys.length === 0) {
      return [...allApps, ...customAppsList];
    }

    const appsMap = new Map(allApps.map(app => [app.app_key, app]));
    const customAppsMap = new Map(customAppsList.map(app => [app.app_key, app]));

    const orderedApps: (HamdastApp | CustomApp)[] = [];

    appKeys.forEach(key => {
      const app = appsMap.get(key) || customAppsMap.get(key);
      if (app) {
        orderedApps.push(app);
      }
    });

    customAppsList.forEach(customApp => {
      if (!appKeys.includes(customApp.app_key)) {
        orderedApps.push(customApp);
      }
    });

    return orderedApps;
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      open: async (appKeys?: string[], customAppsList?: CustomApp[], modalTitle?: string) => {
        setSelectedAppKeys(appKeys || []);
        setCustomApps(customAppsList || []);
        setTitle(modalTitle || 'انتخاب اپلیکیشن');
        handleOpen();

        const fetchedApps = await fetchApps();
        const filtered = filterApps(fetchedApps, customAppsList || [], appKeys);
        setFilteredApps(filtered);
      },
      close: handleClose,
    }),
    [handleOpen, handleClose, fetchApps, filterApps],
  );

  const handleAppClick = (app: HamdastApp | CustomApp) => {
    onAppSelect?.(app);

    const link = app.link || `/_/${app.app_key}/launcher`;

    setIsNavigating(true);
    router.push(link);
  };

  return (
    <>
      {isNavigating && (
        <div className="fixed inset-0 z-[9999] bg-white bg-opacity-90 flex items-center justify-center">
          <Loading />
        </div>
      )}
      <Modal title={title} {...modalProps} bodyClassName="p-0">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loading />
          </div>
        )}
        {!isLoading && filteredApps.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <p className="text-slate-600">هیچ اپلیکیشنی یافت نشد</p>
          </div>
        )}
        {!isLoading && filteredApps.length > 0 && (
          <div className="flex flex-col max-h-[60vh] overflow-y-auto">
            {filteredApps.map((app, index) => (
              <div
                key={app.app_key || index}
                className={classNames(
                  'flex items-center gap-2 md:gap-3 p-2.5 md:p-4 cursor-pointer transition-colors border-b border-slate-100 last:border-b-0',
                  'hover:bg-slate-50 active:bg-slate-100',
                )}
                onClick={() => handleAppClick(app)}
              >
                {app.icon && (
                  <div className="flex-shrink-0">
                    <Image
                      src={app.icon}
                      alt={app.title}
                      width={48}
                      height={48}
                      className="rounded-lg object-cover md:w-14 md:h-14"
                      unoptimized
                    />
                  </div>
                )}
                {!app.icon && (
                  <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-lg bg-slate-200 flex items-center justify-center">
                    <span className="text-slate-500 text-xs">{app.title.charAt(0)}</span>
                  </div>
                )}
                <div className="flex-grow flex flex-col gap-0.5 md:gap-1 min-w-0">
                  <h3 className="font-semibold text-sm text-slate-900 truncate">{app.title}</h3>
                  {app.subtitle && <p className="text-xs text-slate-600 line-clamp-2">{app.subtitle}</p>}
                </div>
                {app.badges && app.badges.length > 0 && (
                  <div className="flex-shrink-0 flex gap-1">
                    {app.badges.map((badge: any, badgeIndex: number) => (
                      <span key={badgeIndex} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-md">
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Modal>
    </>
  );
});

HamdastAppsSelectorModal.displayName = 'HamdastAppsSelectorModal';

const HamdastAppsSelectorModalContext = createContext<React.RefObject<HamdastAppsSelectorModalRef> | null>(null);

export const useHamdastAppsSelectorModal = () => {
  const ref = useContext(HamdastAppsSelectorModalContext);
  return ref;
};

interface HamdastAppsSelectorModalProviderProps {
  children: React.ReactNode;
  onAppSelect?: (app: HamdastApp | CustomApp) => void;
}

export const HamdastAppsSelectorModalProvider = ({ children, onAppSelect }: HamdastAppsSelectorModalProviderProps) => {
  const modalRef = useRef<HamdastAppsSelectorModalRef>(null);

  const actions = useMemo(
    () => ({
      open: (appKeys?: string[], customApps?: CustomApp[], title?: string) => {
        modalRef.current?.open(appKeys, customApps, title);
      },
      close: () => {
        modalRef.current?.close();
      },
    }),
    [],
  );

  return (
    <HamdastAppsSelectorModalContext.Provider value={modalRef}>
      <GlobalActionsProvider contextName="HamdastAppsSelectorModalProvider" actions={actions}>
        {children}
        <HamdastAppsSelectorModal ref={modalRef} onAppSelect={onAppSelect} />
      </GlobalActionsProvider>
    </HamdastAppsSelectorModalContext.Provider>
  );
};

export const hamdastAppsSelectorModalMeta: any = {
  name: 'HamdastAppsSelectorModalProvider',
  displayName: 'Hamdast/AppsSelector',
  importPath: '@/modules/hamdast/components/apps-selector-modal',
  props: {
    onAppSelect: {
      type: 'eventHandler' as any,
      argTypes: [
        {
          name: 'app',
          type: 'object',
        },
      ],
    },
  },
  globalActions: {
    open: {
      displayName: 'Open Modal',
      parameters: [
        {
          name: 'appKeys',
          type: 'array' as any,
        },
        {
          name: 'customApps',
          type: 'object' as any,
        },
        {
          name: 'title',
          type: 'string' as any,
        },
      ],
    },
    close: {
      displayName: 'Close Modal',
      parameters: [],
    },
  },
  providesData: false,
};
