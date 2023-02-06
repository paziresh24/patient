import clsx from 'clsx';
import { HTMLAttributes, useState } from 'react';
import ChevronIcon from '../../icons/chevron';
import Button from '../button';

interface OpenerProps extends HTMLAttributes<HTMLDivElement> {
  openButtonText?: string;
  closeButtonText?: string;
  height?: number;
}

export const Opener = (props: OpenerProps) => {
  const { openButtonText = 'open', closeButtonText = 'close', children, className, height = 80, ...rest } = props;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={clsx('flex space-y-1 flex-col shadow-white', className)} {...rest}>
      <div
        className={clsx(
          'w-full relative overflow-hidden flex flex-col after:w-full after:shadow-[0_0px_40px_35px] after:shadow-inherit  after:absolute after:bottom-0 after:transition-shadow transition-all',
          {
            'after:!shadow-none h-full': isOpen,
          },
        )}
        style={{ ...(!isOpen && { maxHeight: height }) }}
      >
        {children}
      </div>
      <Button
        onClick={() => setIsOpen(prev => !prev)}
        icon={<ChevronIcon className="mx-1" dir={isOpen ? 'top' : 'bottom'} />}
        variant="text"
        size="sm"
        className="self-end !px-5 h-9"
      >
        {!isOpen ? openButtonText : closeButtonText}
      </Button>
    </div>
  );
};

export default Opener;
