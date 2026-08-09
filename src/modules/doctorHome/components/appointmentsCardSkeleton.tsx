import Skeleton from '@/common/components/atom/skeleton';
import classNames from '@/common/utils/classNames';
import { DsCard, ds } from '../designSystem';
import { CenterStrip } from './centerStrip';

export const AppointmentsTimelineSkeleton = ({ rows = 3 }: { rows?: number }) => (
  <div className="border-t border-slate-100 px-3 pb-3 pt-2">
    {Array.from({ length: rows }, (_, idx) => (
      <div key={idx} className="relative flex gap-4 pb-1">
        <div className="flex w-6 shrink-0 flex-col items-center">
          <Skeleton h="1.5rem" w="1.5rem" rounded="full" />
          {idx < rows - 1 && (
            <div className="mt-1 min-h-[3rem] flex-1 border-r-2 border-dashed border-slate-100" />
          )}
        </div>
        <div className="min-w-0 flex-1 pb-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton h="0.875rem" w="50%" rounded="full" />
                <Skeleton h="0.75rem" w="35%" rounded="full" />
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <Skeleton h="1rem" w="3rem" rounded="full" />
                <Skeleton h="1.25rem" w="2.75rem" rounded="full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

/** فقط بار اول — هدر و فیلتر مرکز واقعی می‌مانند */
export const AppointmentsCardSkeleton = ({
  embedCenterStrip = false,
  rows = 3,
  className,
  title = 'مراجعین من',
}: {
  embedCenterStrip?: boolean;
  rows?: number;
  className?: string;
  title?: string;
}) => (
  <section dir="rtl" className={className}>
    <DsCard padding="none" className="overflow-hidden">
      {embedCenterStrip && (
        <div className="border-b border-slate-100 px-3 py-2.5">
          <CenterStrip />
        </div>
      )}

      <div className={classNames('flex items-center gap-3', ds.layout.rowPadding)}>
        <Skeleton h="2.5rem" w="2.5rem" rounded="lg" />
        <div className="min-w-0 flex-1">
          <p className={ds.type.cardTitle}>{title}</p>
          <Skeleton h="0.75rem" w="3.5rem" rounded="full" className="mt-1.5" />
        </div>
      </div>

      <AppointmentsTimelineSkeleton rows={rows} />
    </DsCard>
  </section>
);
