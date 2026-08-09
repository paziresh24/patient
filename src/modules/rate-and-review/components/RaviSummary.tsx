import { InfoIcon } from '@/common/components/icons/info';
import { useState } from 'react';
import { RaviRateSummary } from '../types';
import { averageFromBreakdown, toFixedRating } from '../utils/rating';
import { RaviDoctorHideRatesBanner, RaviLowReviewCountBanner } from './RaviSummaryBanners';

const SATISFACTION_HINT =
  'درصد رضایت، حاصل میانگین سه پارامتر «برخورد»، «توضیح» و «مهارت و تخصص» پزشک می‌باشد که همگی توسط بیماران اعلام گردیده‌اند.';

interface RaviSummaryProps {
  displayName?: string;
  summary: RaviRateSummary;
}

export const RaviSummary = ({ displayName, summary }: RaviSummaryProps) => {
  const [showHint, setShowHint] = useState(false);
  const average = averageFromBreakdown(summary.items);
  const totalScore = summary.items.reduce((sum, item) => sum + item.value, 0);

  if (summary.hideRates) {
    return (
      <section className="w-full bg-white md:rounded-lg">
        <div className="p-4">
          <RaviDoctorHideRatesBanner />
        </div>
      </section>
    );
  }

  if (totalScore === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white md:rounded-t-lg">
      <h2 className="px-4 pt-4 text-base font-bold text-slate-900 md:px-4">
        نظرات درمورد {displayName ?? ''}
      </h2>

      <div className="flex flex-col items-center gap-3 p-4">
        {summary.count < 5 ? (
          <RaviLowReviewCountBanner />
        ) : (
          <div className="flex flex-row flex-wrap items-center justify-center gap-2" dir="rtl">
            <span className="inline-flex items-center gap-1 rounded-[19px] bg-green-600 px-3 py-1 text-sm font-medium text-white">
              <span>{toFixedRating(average)}</span>
              <span className="font-medium">از ۵</span>
            </span>

            {summary.count > 0 ? (
              <span className="text-sm font-medium text-slate-700">رضایت ({summary.count} نظر)</span>
            ) : null}

            <button
              type="button"
              className="text-slate-500"
              aria-label="توضیح امتیاز رضایت"
              onClick={() => setShowHint(prev => !prev)}
            >
              <InfoIcon className="h-[18px] w-[18px]" />
            </button>
          </div>
        )}

        {showHint ? (
          <p className="w-full rounded-lg border border-slate-200 bg-white p-3 text-right text-sm leading-6 text-slate-600 shadow-sm">
            {SATISFACTION_HINT}
          </p>
        ) : null}

        {summary.count >= 5 ? (
          <div className="flex w-full flex-col gap-3">
            {summary.items.map(item => (
              <div key={item.label} className="flex w-full flex-col gap-1" dir="rtl">
                <span className="w-full text-sm font-medium text-slate-800">{item.label}</span>
                <div className="flex w-full items-center gap-3">
                  <div className="h-2 w-full rounded-full bg-[#e9ecef]">
                    <div
                      className="h-2 rounded-full bg-green-600"
                      style={{ width: `${Math.min(100, item.value * 20)}%` }}
                    />
                  </div>
                  <span className="shrink-0 text-sm font-medium text-slate-800">{toFixedRating(item.value)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
};
