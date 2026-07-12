import Text from '@/common/components/atom/text/text';
import CheckIcon from '@/common/components/icons/check';
import classNames from '@/common/utils/classNames';

interface ServiceBulletListProps {
  items: Array<string | undefined>;
  className?: string;
  tone?: 'default' | 'enhanced';
}

export const ServiceBulletList = ({ items, className, tone = 'default' }: ServiceBulletListProps) => {
  const bullets = items.filter(Boolean) as string[];

  if (!bullets.length) return null;

  if (tone === 'enhanced') {
    return (
      <ul className={className ?? 'mx-4 flex flex-col gap-2.5 border-r-2 border-slate-200 px-3 py-1'}>
        {bullets.map(item => (
          <li key={item} className="flex items-start gap-2">
            <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary/80" />
            <Text fontSize="sm" className="leading-6 text-slate-700" dangerouslySetInnerHTML={{ __html: item }} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className={className ?? 'mx-4 flex flex-col space-y-1 border-r-2 border-slate-200 px-3 py-1'}>
      {bullets.map(item => (
        <li key={item}>
          <Text fontSize="sm" className="leading-6 text-slate-700" dangerouslySetInnerHTML={{ __html: item }} />
        </li>
      ))}
    </ul>
  );
};

export default ServiceBulletList;
