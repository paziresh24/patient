import Button from '@/common/components/atom/button';
import EditIcon from '@/common/components/icons/edit';
import InfoIcon from '@/common/components/icons/info';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import Link from 'next/link';

export const ActionButton = ({ slug }: { slug: string }) => {
  const user = useUserInfoStore(state => state.info);
  return (
    <Link href={`https://survey.porsline.ir/s/35ggjRX?slug=${slug}&user-cell=${user?.cell ?? ''}`} prefetch={false}>
      <Button variant="text" size="sm" className="flex text-xs font-semibold h-9 gap-x-1 text-primary">
        <InfoIcon width={17} height={17} />
        گزارش خطا در اطلاعات مرکز
      </Button>
    </Link>
  );
};
