import Text from '@/common/components/atom/text/text';
import ChevronIcon from '@/common/components/icons/chevron';
import WifiIcon from '@/common/components/icons/wifi';
import classNames from '@/common/utils/classNames';
import Link from 'next/link';

interface RismanCardProps {
  data?: {
    data?: {
      fullName?: string;
      doctorId?: string;
      destination?: {
        platform?: string;
        url?: string;
        'btn-text'?: string;
        'first-appointment'?: string;
      };
    };
  };
  slug: string;
  className?: string;
}

const buildRismanBridgeUrl = (data: RismanCardProps['data'], slug: string) => {
  const payload = data?.data;
  const destination = payload?.destination;
  if (!destination?.url) return '';

  const params = new URLSearchParams({
    source: 'profile',
    provide: 'page',
    display_name: payload?.fullName ?? '',
    uri: destination.url,
    platform: destination.platform ?? '',
    slug,
    doctor_id: String(payload?.doctorId ?? ''),
  });

  return `https://risman-bridge.paziresh24.com/?${params.toString()}`;
};

export const RismanCard = ({ data, slug, className }: RismanCardProps) => {
  const destination = data?.data?.destination;
  const bridgeUrl = buildRismanBridgeUrl(data, slug);
  const btnText = destination?.['btn-text'];
  const isPhoneBooking = btnText === 'نوبت‌دهی تلفنی مطب';
  const firstAppointment = destination?.['first-appointment'];

  if (!bridgeUrl) return null;

  return (
    <section
      className={classNames(
        'flex flex-col gap-4 overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-card md:p-5',
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <WifiIcon width={22} height={22} />
        </div>
        <Text fontWeight="bold" className="text-base leading-6 text-slate-900">
          نوبت اینترنتی و مراجعه حضوری
        </Text>
      </div>

      <Link
        href={bridgeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-primary bg-primary px-4 py-3 text-sm font-bold text-white transition-all hover:bg-primary/90"
      >
        <span className="text-right leading-6">
          {isPhoneBooking ? (
            btnText
          ) : (
            <>
              دریافت نوبت در{' '}
              <Text as="span" fontWeight="bold" className="text-white">
                {destination?.platform ?? 'سامانه نوبت‌دهی'}
              </Text>
            </>
          )}
        </span>
        <ChevronIcon dir="left" className="h-5 w-5 shrink-0" />
      </Link>

      {firstAppointment != null && (
        <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
          <Text fontSize="sm" className="text-slate-500">
            اولین نوبت:
          </Text>
          <Text fontSize="sm" fontWeight="semiBold" className="text-slate-800">
            {firstAppointment}
          </Text>
        </div>
      )}
    </section>
  );
};

export default RismanCard;
