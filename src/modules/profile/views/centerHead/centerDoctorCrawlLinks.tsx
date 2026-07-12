import Link from 'next/link';
import { CenterCrawlDoctor } from '@/modules/profile/utils/centerProfileSsr';
import classNames from '@/common/utils/classNames';

interface CenterDoctorCrawlLinksProps {
  doctors: CenterCrawlDoctor[];
  visuallyHidden?: boolean;
  className?: string;
}

export const CenterDoctorCrawlLinks = ({ doctors, visuallyHidden = false, className }: CenterDoctorCrawlLinksProps) => {
  if (!doctors.length) return null;

  return (
    <nav
      aria-label="پزشکان این مرکز"
      className={classNames(
        'rounded-lg border border-slate-100 bg-slate-50 px-3 py-3',
        visuallyHidden && 'sr-only',
        className,
      )}
    >
      <p className="mb-2 text-xs font-semibold text-slate-500">پزشکان این مرکز</p>
      <ul className="flex flex-col gap-1.5">
        {doctors.map(doctor => (
          <li key={doctor.url}>
            <Link href={doctor.url} prefetch={false} className="text-sm text-primary hover:underline">
              {doctor.name}
              {doctor.expertise ? ` — ${doctor.expertise}` : ''}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default CenterDoctorCrawlLinks;
