import classNames from '@/common/utils/classNames';
import { CenterSectionTitle } from '@/modules/profile/views/centerHead';
import { ReactNode } from 'react';

interface ProfileSectionCardProps {
  title?: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
}

export const ProfileSectionCard = ({ title, icon, action, children, className, id }: ProfileSectionCardProps) => (
  <section
    id={id}
    className={classNames(
      'flex w-full flex-col space-y-3 bg-white py-4 shadow-sm md:rounded-2xl md:p-5 md:shadow-card',
      className,
    )}
  >
    {(title || action) && (
      <div className="flex items-center justify-between gap-3 px-4 md:px-0">
        {title ? <CenterSectionTitle title={title} icon={icon} className="min-w-0 flex-1 !px-0" /> : <div className="flex-1" />}
        {action}
      </div>
    )}
    {children}
  </section>
);

export default ProfileSectionCard;
