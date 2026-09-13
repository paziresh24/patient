import classNames from '@/common/utils/classNames';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useGrowthPath, type GrowthPathStepState } from '../apis/growthOpportunities';
import { DsCard, ds } from '../designSystem';
import { useDoctorHomeContext } from '../hooks/useDoctorHomeContext';
import { useSheetDrawerProps } from '../hooks/doctorHomeSheetLayout';
import { useSheetRoute } from '../hooks/useSheetRoute';
import { sendDoctorHomeEvent } from '../utils/analytics';
import { isQueryInitialLoading } from '../utils/doctorHomeQuery';
import { appendUserIdToUrl } from '../utils/iframeUrl';
import { DsDrawer } from './DsDrawer';
import { TimelineDoneIcon } from './icons';

const SANJE_PERFORMANCE_URL =
  'https://jahannama.paziresh24.com/my-performance/?utm_source=p24portal&utm_medium=internal-link&utm_campaign=sanje-my-performance';

const markerClass: Record<GrowthPathStepState, string> = {
  done: ds.timeline.done,
  active: ds.timeline.current,
  upcoming: ds.timeline.upcoming,
};

const connectorClass: Record<GrowthPathStepState, string> = {
  done: ds.timeline.lineDone,
  active: ds.timeline.lineCurrent,
  upcoming: ds.timeline.lineUpcoming,
};

const titleClass: Record<GrowthPathStepState, string> = {
  done: 'text-[13px] font-medium leading-6 text-slate-700',
  active: 'text-[13px] font-semibold leading-6 text-primary',
  upcoming: 'text-[13px] font-medium leading-6 text-slate-500',
};

export const FeedGrowthPathSection = ({ className }: { className?: string }) => {
  const user = useUserInfoStore(state => state.info);
  const userId = user?.id;
  const { isDoctor } = useDoctorHomeContext(user);
  const growthPath = useGrowthPath(isDoctor);
  const path = growthPath.data;
  const isLoading = isQueryInitialLoading(growthPath);
  const performanceSheet = useSheetRoute('stat-performance');
  const performanceDrawerProps = useSheetDrawerProps(performanceSheet);

  if (!isDoctor) return null;
  if (!isLoading && !path) return null;

  const openSanje = () => {
    sendDoctorHomeEvent(userId, 'stat_performance', {
      completed: path?.completed_count,
      total: path?.total_count,
    });
    performanceSheet.openSheet();
  };

  return (
    <section aria-label="مسیر رشد شما" className={className}>
      <h2 className={classNames(ds.type.section, 'mb-1.5')}>مسیر رشد شما</h2>

      <DsCard padding="lg" onClick={openSanje} ariaLabel="باز کردن سنجه">
        {isLoading && !path ? (
          <div className="space-y-4" aria-busy="true" aria-label="در حال بارگذاری مسیر رشد">
            {[0, 1, 2].map(i => (
              <div key={i} className="flex gap-3">
                <div className="h-6 w-6 shrink-0 animate-pulse rounded-full bg-slate-100" />
                <div className="h-11 flex-1 animate-pulse rounded-xl bg-slate-100" />
              </div>
            ))}
          </div>
        ) : path ? (
          <ol>
            {path.steps.map((step, index) => {
              const isLast = index === path.steps.length - 1;
              const isActive = step.state === 'active';

              return (
                <li
                  key={step.key ?? `${step.state}-${index}`}
                  className="relative flex gap-3"
                  aria-current={isActive ? 'step' : undefined}
                >
                  <div className="relative flex w-6 shrink-0 flex-col items-center">
                    <span
                      className={classNames(
                        'relative z-[1] flex h-6 w-6 items-center justify-center rounded-full',
                        markerClass[step.state],
                      )}
                      aria-hidden
                    >
                      {step.state === 'done' && <TimelineDoneIcon />}
                      {step.state === 'active' && (
                        <span className="h-[7px] w-[7px] rotate-45 rounded-[1.5px] bg-white" />
                      )}
                    </span>
                    {!isLast && (
                      <span
                        className={classNames(
                          'absolute left-1/2 top-6 bottom-0 w-0.5 -translate-x-1/2 translate-y-0.5',
                          connectorClass[step.state],
                        )}
                        aria-hidden
                      />
                    )}
                  </div>

                  <div className={classNames('min-w-0 flex-1 pt-0.5', isLast ? 'pb-0.5' : 'pb-5')}>
                    <p className={titleClass[step.state]}>{step.title}</p>
                    {isActive && (
                      <span className="mt-2 inline-flex items-center rounded-full bg-primary/[0.08] px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                        قدم فعلی شما
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        ) : null}
      </DsCard>

      <DsDrawer {...performanceDrawerProps} title="عملکرد من" description="سنجه" fullHeight className="!p-0">
        {performanceSheet.open && (
          <iframe
            src={appendUserIdToUrl(SANJE_PERFORMANCE_URL, userId)}
            title="عملکرد من در سنجه"
            className="min-h-0 w-full flex-1 border-0"
          />
        )}
      </DsDrawer>
    </section>
  );
};
