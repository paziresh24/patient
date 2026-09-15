import Text from '@/common/components/atom/text/text';
import classNames from '@/common/utils/classNames';
import type { BioCredentialItem, BioCredentials } from '@/common/apis/services/profile-microservice/normalizeBioCredentials';

type CredentialsProps = BioCredentials & {
  className?: string;
};

const GROUPS: { key: keyof BioCredentials; title: string }[] = [
  { key: 'degrees', title: 'مدارک' },
  { key: 'honors', title: 'افتخارات' },
  { key: 'experiences', title: 'سوابق' },
];

function CredentialRow({ item, showTimelineDot }: { item: BioCredentialItem; showTimelineDot?: boolean }) {
  return (
    <li className="relative flex items-start gap-3 text-right">
      {showTimelineDot && (
        <span
          aria-hidden
          className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-slate-300 ring-4 ring-white"
        />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <Text fontSize="sm" fontWeight="bold" className="leading-6 text-slate-800">
            {item.title}
          </Text>
          {item.year && (
            <Text fontSize="xs" className="shrink-0 ltr:font-normal text-slate-500 whitespace-nowrap" dir="ltr">
              {item.year}
            </Text>
          )}
        </div>
        {item.subtitle && (
          <Text fontSize="sm" className="mt-0.5 leading-6 text-slate-600">
            {item.subtitle}
          </Text>
        )}
        {item.description && (
          <Text fontSize="sm" className="mt-1 leading-6 text-slate-500">
            {item.description}
          </Text>
        )}
      </div>
    </li>
  );
}

export const Credentials = ({ degrees, honors, experiences, className }: CredentialsProps) => {
  const groups = GROUPS.map(group => ({
    ...group,
    items: group.key === 'degrees' ? degrees : group.key === 'honors' ? honors : experiences,
  })).filter(group => group.items.length > 0);

  if (groups.length === 0) return null;

  return (
    <div dir="rtl" lang="fa" className={classNames('flex flex-col gap-5 bg-white p-4 md:rounded-lg', className)}>
      {groups.map((group, groupIndex) => (
        <div
          key={group.key}
          className={classNames(groupIndex > 0 && 'border-t border-slate-100 pt-5')}
        >
          <Text as="h3" fontSize="sm" fontWeight="bold" className="mb-3 text-slate-700">
            {group.title}
          </Text>
          <ul
            className={classNames(
              'flex flex-col gap-3',
              group.key === 'experiences' && 'border-s border-slate-200 ps-3 ms-1',
            )}
          >
            {group.items.map((item, index) => (
              <CredentialRow
                key={`${group.key}-${index}-${item.title}`}
                item={item}
                showTimelineDot={group.key === 'experiences'}
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Credentials;
