import BackIcon from '@/common/components/icons/back';
import CloseIcon from '@/common/components/icons/close';
import SearchIcon from '@/common/components/icons/search';
import clsx from 'clsx';
import { InputHTMLAttributes } from 'react';

export interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  showBackButton?: boolean;
  clickBackButton?: () => void;
  clikSearchButton?: () => void;
  onClear?: () => void;
}

export const SearchInput = (props: SearchInputProps) => {
  const { showBackButton, clickBackButton, clikSearchButton, onClear, className, ...inputProps } = props;

  return (
    <div className="flex items-center w-full h-12 px-1 pl-2 md:h-14 space-s-1 md:space-s-2">
      {showBackButton ? (
        <BackIcon className="w-6 h-6 cursor-pointer min-w-[1.5rem]" onClick={clickBackButton} />
      ) : (
        <SearchIcon className="w-6 h-6 cursor-pointer min-w-[1.5rem]" onClick={clikSearchButton} />
      )}

      <input
        className={clsx('h-full w-full bg-transparent outline-none text-sm md:text-base appearance-none', className)}
        {...inputProps}
        autoComplete="off"
        data-hj-allow
        type="search"
      />
      {inputProps.value && <CloseIcon onClick={onClear} className="cursor-pointer" />}
    </div>
  );
};
