import classNames from '@/common/utils/classNames';
import { FunctionComponent, ReactNode } from 'react';
import Text from '../text';

interface Props {
  id?: string;
  title?: string;
  ActionButton?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const Section: FunctionComponent<Props> = props => {
  const { id, children, title, ActionButton, className } = props;

  return (
    <section {...{ id }} className={classNames('flex flex-col w-full gap-y-3', className)}>
      {(title || ActionButton) && (
        <div className="flex items-center justify-between px-4 md:px-0">
          <Text as="h2" fontWeight="bold">
            {title}
          </Text>
          {ActionButton}
        </div>
      )}
      {children}
    </section>
  );
};

export default Section;
