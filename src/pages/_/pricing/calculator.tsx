import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import CenterIcon from '@/common/components/icons/center';
import ChevronIcon from '@/common/components/icons/chevron';
import CheckIcon from '@/common/components/icons/check';
import Seo from '@/common/components/layouts/seo';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import { ThemeConfig } from '@/common/hooks/useCustomize';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { ReactElement, useEffect, useMemo, useState } from 'react';

type PricingModule = {
  id?: number;
  title: string;
  price: number;
};

type PricingGroup = {
  name: string;
  description?: string;
  modules: PricingModule[];
};

type TurnRange = {
  title: string;
  groups: PricingGroup[];
};

type ApiEnvelope = {
  data?: TurnRange[];
};

type PageProps = {
  turnRanges: TurnRange[];
};

const getModuleKey = (groupName: string, module: PricingModule) =>
  module.id !== undefined && module.id !== null ? `${groupName}-${module.id}` : `${groupName}-${module.title}`;

const formatPrice = (price: number) => {
  if (price === 0) return 'رایگان';
  return `${new Intl.NumberFormat('fa-IR').format(price)} تومان`;
};

const normalizeApiResponse = (payload: unknown): TurnRange[] => {
  if (!Array.isArray(payload) || !payload.length) return [];

  const firstItem = payload[0] as ApiEnvelope;
  const ranges = Array.isArray(firstItem?.data) ? firstItem.data : (payload as TurnRange[]);
  if (!Array.isArray(ranges)) return [];

  return ranges.map(item => ({
    title: item?.title ?? '',
    groups: Array.isArray(item?.groups)
      ? item.groups.map(group => ({
          name: group?.name ?? '',
          description: group?.description ?? '',
          modules: Array.isArray(group?.modules)
            ? group.modules.map(module => ({
                id: Number(module?.id ?? 0),
                title: module?.title ?? '',
                price: Number(module?.price ?? 0),
              }))
            : [],
        }))
      : [],
  }));
};

const PricingCalculatorPage = ({ turnRanges }: PageProps) => {
  const [activeRangeIndex, setActiveRangeIndex] = useState(0);
  const [selectedModules, setSelectedModules] = useState<Record<string, PricingModule>>({});
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const activeRange = turnRanges[activeRangeIndex];
  const allModulesInActiveRange = useMemo(
    () =>
      (activeRange?.groups ?? []).flatMap(group =>
        group.modules.map(module => ({
          moduleKey: getModuleKey(group.name, module),
          module,
        })),
      ),
    [activeRange],
  );

  const selectedList = useMemo(() => Object.entries(selectedModules), [selectedModules]);
  const totalPrice = useMemo(() => selectedList.reduce((sum, [, item]) => sum + item.price, 0), [selectedList]);
  const isAllSelected = allModulesInActiveRange.length > 0 && selectedList.length === allModulesInActiveRange.length;
  const suggestedModuleKeys = useMemo(
    () =>
      allModulesInActiveRange
        .filter(item => {
          const moduleId = Number(item.module.id);
          return !Number.isNaN(moduleId) && [1, 7, 11].includes(moduleId);
        })
        .map(item => item.moduleKey),
    [allModulesInActiveRange],
  );
  const isSuggestedPackageSelected =
    suggestedModuleKeys.length > 0 &&
    selectedList.length === suggestedModuleKeys.length &&
    suggestedModuleKeys.every(moduleKey => !!selectedModules[moduleKey]);

  const handleRangeChange = (index: number) => {
    setActiveRangeIndex(index);
    setSelectedModules({});
  };

  useEffect(() => {
    const nextOpenGroups = (activeRange?.groups ?? []).reduce<Record<string, boolean>>((acc, group) => {
      acc[group.name] = true;
      return acc;
    }, {});

    setOpenGroups(nextOpenGroups);
  }, [activeRange]);

  const toggleModule = (moduleKey: string, module: PricingModule) => {
    setSelectedModules(prev => {
      if (prev[moduleKey]) {
        const next = { ...prev };
        delete next[moduleKey];
        return next;
      }

      return {
        ...prev,
        [moduleKey]: module,
      };
    });
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedModules({});
      return;
    }

    const nextSelectedModules = allModulesInActiveRange.reduce<Record<string, PricingModule>>((acc, item) => {
      acc[item.moduleKey] = item.module;
      return acc;
    }, {});

    setSelectedModules(nextSelectedModules);
  };

  const handleSelectSuggestedPackage = () => {
    const suggestedIds = new Set([1, 7, 11]);
    const nextSelectedModules = allModulesInActiveRange.reduce<Record<string, PricingModule>>((acc, item) => {
      const moduleId = Number(item.module.id);
      if (!Number.isNaN(moduleId) && suggestedIds.has(moduleId)) {
        acc[item.moduleKey] = item.module;
      }
      return acc;
    }, {});

    setSelectedModules(nextSelectedModules);
  };

  const toggleGroup = (groupName: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const getSelectedCountForGroup = (group: PricingGroup) => {
    return group.modules.reduce((count, module) => {
      const moduleKey = getModuleKey(group.name, module);
      return selectedModules[moduleKey] ? count + 1 : count;
    }, 0);
  };

  const getSelectedPriceForGroup = (group: PricingGroup) => {
    return group.modules.reduce((sum, module) => {
      const moduleKey = getModuleKey(group.name, module);
      return selectedModules[moduleKey] ? sum + module.price : sum;
    }, 0);
  };

  return (
    <>
      <Seo title="تعرفه مراکز درمانی" noIndex />

      <div className="mx-auto w-full max-w-7xl p-4 md:p-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
          <h1 className="text-lg font-bold text-slate-900 md:text-xl">برآورد قیمت پنل پذیرش24</h1>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            بر اساس تعداد نوبت‌های ماهانه مرکز درمانی، پلن مناسب را انتخاب کنید. با انتخاب هر ماژول، مبلغ در بخش محاسبه‌گر به صورت لحظه‌ای
            به‌روزرسانی می‌شود.
          </p>
        </section>

        <section className="mt-4 grid grid-cols-1 gap-4 md:mt-6 md:grid-cols-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 md:col-span-3 md:p-5">
            <h2 className="text-base font-semibold text-slate-900">انتخاب بازه نوبت‌دهی</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {turnRanges.map((range, index) => (
                <button
                  key={range.title}
                  type="button"
                  onClick={() => handleRangeChange(index)}
                  className={`h-12 min-w-[148px] rounded-lg border px-3 py-2 text-sm transition ${
                    index === activeRangeIndex
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="inline-flex items-center gap-1">
                    {index === activeRangeIndex && <CheckIcon className="h-4 w-4" />}
                    {range.title}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-slate-700">لیست گروه‌ها و ماژول‌ها</h3>
                {!!activeRange?.groups?.length && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSelectSuggestedPackage}
                      className={`inline-flex h-8 w-[120px] items-center justify-center rounded-lg border px-2 text-xs font-medium transition ${
                        isSuggestedPackageSelected
                          ? 'border-primary/40 bg-primary/20 text-primary'
                          : 'border-primary/30 bg-white text-primary hover:bg-primary/10'
                      }`}
                    >
                      <span className="relative inline-flex w-full items-center justify-center whitespace-nowrap">
                        <CheckIcon className={`absolute right-0 h-3.5 w-3.5 ${isSuggestedPackageSelected ? 'opacity-100' : 'opacity-0'}`} />
                        <span className="absolute inset-0 inline-flex items-center justify-center">بسته پیشنهادی</span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="inline-flex h-8 w-[120px] items-center justify-center rounded-lg border border-slate-200 px-2 text-xs font-medium text-slate-700 transition hover:border-slate-300"
                    >
                      <span className="whitespace-nowrap">{isAllSelected ? 'لغو انتخاب همه' : 'انتخاب همه'}</span>
                    </button>
                  </div>
                )}
              </div>

              {!activeRange?.groups?.length && (
                <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-500">برای این بازه هنوز ماژولی ثبت نشده است.</p>
              )}

              {!!activeRange?.groups?.length && (
                <div className="mt-3 space-y-4">
                  {activeRange.groups.map(group => {
                    const selectedCount = getSelectedCountForGroup(group);
                    const selectedPrice = getSelectedPriceForGroup(group);

                    return (
                      <div key={group.name} className="rounded-xl border border-slate-200 p-3">
                        <button
                          type="button"
                          onClick={() => toggleGroup(group.name)}
                          className="flex w-full items-center justify-between gap-3 text-right"
                        >
                          <div className="flex items-center gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-slate-800">{group.name}</h4>
                                {selectedCount > 0 && (
                                  <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                                    {new Intl.NumberFormat('fa-IR').format(selectedCount)} انتخاب شده
                                  </span>
                                )}
                              </div>
                              {!!group.description && <p className="mt-1 text-xs text-slate-500">{group.description}</p>}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {selectedCount > 0 && (
                              <span className="inline-flex items-center justify-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                                {formatPrice(selectedPrice)}
                              </span>
                            )}
                            <ChevronIcon dir={openGroups[group.name] ? 'top' : 'bottom'} className="text-slate-500" />
                          </div>
                        </button>

                        {openGroups[group.name] && (
                          <div className="mt-2 border-t border-slate-200 pt-2 space-y-2">
                            {group.modules.map(module => {
                              const moduleKey = getModuleKey(group.name, module);
                              const checked = !!selectedModules[moduleKey];

                              return (
                                <label
                                  key={moduleKey}
                                  className="flex cursor-pointer items-start justify-between gap-3 rounded-lg p-2 hover:bg-slate-50"
                                >
                                  <div className="flex items-start gap-2">
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => toggleModule(moduleKey, module)}
                                      className="mt-1 h-4 w-4 accent-primary"
                                    />
                                    <span className="text-sm text-slate-700">{module.title}</span>
                                  </div>
                                  <span className="whitespace-nowrap text-sm font-medium text-slate-900">{formatPrice(module.price)}</span>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 md:col-span-2 md:p-5">
            <div className="-mx-4 -mt-4 mb-4 rounded-t-2xl border-b border-primary/20 bg-primary/10 px-4 py-3 md:-mx-5 md:-mt-5 md:px-5">
              <h2 className="text-lg font-bold text-primary">صورت حساب شما</h2>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              بازه فعال: <span className="font-semibold text-slate-800">{activeRange?.title ?? '-'}</span>
            </p>
            <p className="mt-1 text-sm text-slate-600">
              تعداد ماژول انتخاب‌شده: <span className="font-semibold text-slate-800">{selectedList.length}</span>
            </p>

            <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-3">
              {!selectedList.length && <p className="text-sm text-slate-500">هنوز ماژولی انتخاب نشده است.</p>}

              {!!selectedList.length && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="px-3 py-2 text-right font-semibold text-slate-700">آیتم‌ها</th>
                        <th className="px-3 py-2 text-left font-semibold text-slate-700">قیمت ماهانه</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedList.map(([moduleKey, module], index) => (
                        <tr key={moduleKey} className={index === 0 ? '' : 'border-t border-slate-200'}>
                          <td className="px-3 py-2 text-slate-700">{module.title}</td>
                          <td className="px-3 py-2 text-left font-medium text-slate-900">{formatPrice(module.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="mt-4 rounded-xl border border-primary/30 bg-primary/15 p-4">
              <p className="text-base font-semibold text-primary">جمع کل ماهانه</p>
              <p className="mt-1 text-2xl font-extrabold text-primary">{formatPrice(totalPrice)}</p>
              <p className="mt-2 text-center text-xs text-slate-600">قیمت ها بروز و شامل مالیات بر ارزش افزوده می باشد.</p>
            </div>

            <a
              href="https://survey.porsline.ir/s/YCEGAgx"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <CenterIcon className="h-5 w-5" />
              ثبت نام مراکز درمانی
            </a>
          </div>
        </section>
      </div>
    </>
  );
};

PricingCalculatorPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter
      {...page.props.config}
      showHeader={true}
      showFooter={true}
      showBottomNavigation={false}
      shouldShowPromoteApp={false}
      className="bg-slate-50"
    >
      {page}
    </LayoutWithHeaderAndFooter>
  );
};

export const getServerSideProps: GetServerSideProps = withServerUtils(
  async (context: GetServerSidePropsContext, themeConfing: ThemeConfig) => {
    try {
      const response = await fetch('https://apigw.paziresh24.com/sokan/module-price-system');
      const json = await response.json();

      return {
        props: {
          turnRanges: normalizeApiResponse(json),
        },
      };
    } catch (error) {
      return {
        props: {
          turnRanges: [],
        },
      };
    }
  },
);

export default PricingCalculatorPage;
