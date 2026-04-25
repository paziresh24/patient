import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import ChevronIcon from '@/common/components/icons/chevron';
import Seo from '@/common/components/layouts/seo';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import { ThemeConfig } from '@/common/hooks/useCustomize';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { ReactElement, useEffect, useMemo, useState } from 'react';

type PricingModule = {
  title: string;
  price: number;
};

type PricingGroup = {
  name: string;
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

const formatPrice = (price: number) => {
  if (price === 0) return 'رایگان';
  return `${new Intl.NumberFormat('fa-IR').format(price)} تومان`;
};

const normalizeApiResponse = (payload: unknown): TurnRange[] => {
  if (!Array.isArray(payload) || !payload.length) return [];

  const firstItem = payload[0] as ApiEnvelope;
  if (!Array.isArray(firstItem?.data)) return [];

  return firstItem.data.map(item => ({
    title: item?.title ?? '',
    groups: Array.isArray(item?.groups)
      ? item.groups.map(group => ({
          name: group?.name ?? '',
          modules: Array.isArray(group?.modules)
            ? group.modules.map(module => ({
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
          moduleKey: `${group.name}-${module.title}`,
          module,
        })),
      ),
    [activeRange],
  );

  const selectedList = useMemo(() => Object.entries(selectedModules), [selectedModules]);
  const totalPrice = useMemo(() => selectedList.reduce((sum, [, item]) => sum + item.price, 0), [selectedList]);
  const isAllSelected = allModulesInActiveRange.length > 0 && selectedList.length === allModulesInActiveRange.length;

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

  const toggleGroup = (groupName: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
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

        <section className="mt-4 grid grid-cols-1 gap-4 md:mt-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
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
                  {range.title}
                </button>
              ))}
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-slate-700">لیست گروه‌ها و ماژول‌ها</h3>
                {!!activeRange?.groups?.length && (
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-300"
                  >
                    {isAllSelected ? 'لغو انتخاب همه' : 'انتخاب همه'}
                  </button>
                )}
              </div>

              {!activeRange?.groups?.length && (
                <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-500">برای این بازه هنوز ماژولی ثبت نشده است.</p>
              )}

              {!!activeRange?.groups?.length && (
                <div className="mt-3 space-y-4">
                  {activeRange.groups.map(group => (
                    <div key={group.name} className="rounded-xl border border-slate-200 p-3">
                      <button
                        type="button"
                        onClick={() => toggleGroup(group.name)}
                        className="flex w-full items-center justify-between gap-3 text-right"
                      >
                        <h4 className="text-sm font-bold text-slate-800">{group.name}</h4>
                        <ChevronIcon dir={openGroups[group.name] ? 'top' : 'bottom'} className="text-slate-500" />
                      </button>

                      {openGroups[group.name] && (
                        <div className="mt-2 border-t border-slate-200 pt-2 space-y-2">
                          {group.modules.map(module => {
                            const moduleKey = `${group.name}-${module.title}`;
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
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
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
                <ul className="space-y-2">
                  {selectedList.map(([moduleKey, module]) => (
                    <li key={moduleKey} className="flex items-center justify-between text-sm">
                      <span className="text-slate-700">{module.title}</span>
                      <span className="font-medium text-slate-900">{formatPrice(module.price)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-4 rounded-xl bg-primary/10 p-4">
              <p className="text-sm text-slate-700">جمع کل ماهانه</p>
              <p className="mt-1 text-xl font-bold text-primary">{formatPrice(totalPrice)}</p>
            </div>

            <a
              href="https://survey.porsline.ir/s/YCEGAgx"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
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
