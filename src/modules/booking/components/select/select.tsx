import Button from '@/common/components/atom/button';
import Loading from '@/common/components/atom/loading/loading';
import Text from '@/common/components/atom/text';
import clsx from 'clsx';
import { ReactNode } from 'react';

interface SelectProps {
  selected: boolean;
  onSelect: () => void;
  title: string;
  subTitle?: string;
  isLoading?: boolean;
  actionText?: string;
  action?: () => void;
  actionIcon?: ReactNode;
}

export const Select = (props: SelectProps) => {
  const { onSelect, selected, subTitle, title, isLoading, action, actionText, actionIcon } = props;
  return (
    <div
      className={clsx(
        'cursor-pointer flex items-center justify-between p-4 border border-solid transition-all border-slate-200 rounded-lg',
        {
          'border-primary': selected,
        },
      )}
      onClick={onSelect}
    >
      <div className="flex items-center space-s-3">
        <div
          className={clsx('w-5 flex justify-center items-center h-5 rounded-full border border-solid border-slate-200 transition-all', {
            'border-primary bg-primary': selected,
          })}
        >
          {selected && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.10914 0.745967C9.41448 1.02586 9.4351 1.50029 9.15521 1.80563L4.20521 7.20563C4.06698 7.35642 3.87315 7.44421 3.66864 7.44866C3.46412 7.4531 3.26666 7.37381 3.12201 7.22916L0.872014 4.97916C0.57912 4.68627 0.57912 4.2114 0.872014 3.9185C1.16491 3.62561 1.63978 3.62561 1.93267 3.9185L3.62878 5.61461L8.04948 0.792039C8.32937 0.4867 8.8038 0.466073 9.10914 0.745967Z"
                fill="white"
              ></path>
            </svg>
          )}
        </div>
        <div className="flex flex-col space-y-1">
          <Text fontWeight="bold" fontSize="sm">
            {title}
          </Text>
          {!isLoading && subTitle && <Text fontSize="sm">{subTitle}</Text>}
          {isLoading && subTitle && <Loading width={25} className="!mt-3" />}
        </div>
      </div>

      {actionText && (
        <Button
          variant="text"
          icon={actionIcon}
          className="text-xs text-slate-700"
          size="sm"
          onClick={e => {
            e.stopPropagation();
            action && action();
          }}
        >
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default Select;
