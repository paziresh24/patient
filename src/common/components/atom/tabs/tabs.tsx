import classNames from '@/common/utils/classNames';
import { ReactElement, useEffect, useState } from 'react';

interface TabsProps {
  children: ReactElement[];
  value: string | number;
  onChange: (value: string | number) => void;
  className?: string;
}

export const Tabs = ({ children, value, onChange, className, ...rest }: TabsProps) => {
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (value && children) {
      children
        .filter(tab => !!tab?.props?.value)
        .forEach((child, i) => {
          if (child.props.value === value) {
            setSelected(i);
          }
        });
    }
  }, [value, children]);

  const selectTab = (index: number) => {
    onChange && onChange(children[index].props.value);
  };

  return (
    <div className={classNames('flex', [className])}>
      {children
        .filter(tab => !!tab?.props?.value)
        .map((tab, i) => (
          <button
            key={tab.props.value}
            className={classNames(
              'p-4 text-sm font-medium text-neutral-600',
              {
                'border-b-2 border-solid border-primary !text-primary': i === selected,
              },
              [tab.props.className],
            )}
            onClick={() => selectTab(i)}
          >
            {tab}
          </button>
        ))}
    </div>
  );
};
