import ChevronIcon from '@/common/components/icons/chevron';
import clsx from 'clsx';
import { InputHTMLAttributes } from 'react';

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  showBackButton?: boolean;
  clickBackButton?: () => void;
  clikSearchButton?: () => void;
}

export const SearchInput = (props: SearchInputProps) => {
  const { showBackButton, clickBackButton, clikSearchButton, className, ...inputProps } = props;
  return (
    <div className="w-full h-12 md:h-14 flex items-center px-1 space-s-2">
      {showBackButton ? (
        <ChevronIcon className="cursor-pointer w-7" dir="right" color="#505971" width="1rem" height="1rem" onClick={clickBackButton} />
      ) : (
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="#505971"
          xmlns="http://www.w3.org/2000/svg"
          className="cursor-pointer"
          onClick={clikSearchButton}
        >
          <title>icon</title> <rect x="0.0546875" y="0.502197" width="27" height="27" rx="10" fill="transparent"></rect>
          <path
            d="M24.478 23.3284L20.3043 19.1884C21.9244 17.1684 22.709 14.6044 22.4967 12.0236C22.2844 9.44287 21.0914 7.04153 19.163 5.31338C17.2346 3.58522 14.7173 2.6616 12.1288 2.73243C9.54032 2.80326 7.07734 3.86316 5.24631 5.69419C3.41528 7.52521 2.35538 9.98819 2.28455 12.5767C2.21372 15.1652 3.13734 17.6824 4.8655 19.6109C6.59365 21.5393 8.99499 22.7323 11.5757 22.9446C14.1565 23.1568 16.7205 22.3723 18.7405 20.7522L22.8805 24.8922C22.9851 24.9976 23.1095 25.0813 23.2466 25.1384C23.3837 25.1955 23.5308 25.2249 23.6793 25.2249C23.8278 25.2249 23.9748 25.1955 24.1119 25.1384C24.249 25.0813 24.3734 24.9976 24.478 24.8922C24.6808 24.6824 24.7941 24.402 24.7941 24.1103C24.7941 23.8185 24.6808 23.5382 24.478 23.3284ZM12.4293 20.7522C10.8717 20.7522 9.3492 20.2903 8.05416 19.425C6.75912 18.5597 5.74976 17.3298 5.15372 15.8908C4.55768 14.4518 4.40173 12.8684 4.70559 11.3408C5.00945 9.81322 5.75947 8.41002 6.86081 7.30869C7.96215 6.20735 9.36534 5.45733 10.8929 5.15347C12.4205 4.84961 14.0039 5.00556 15.4429 5.6016C16.8819 6.19764 18.1118 7.207 18.9771 8.50204C19.8424 9.79707 20.3043 11.3196 20.3043 12.8772C20.3043 14.9657 19.4746 16.9688 17.9977 18.4456C16.5209 19.9225 14.5179 20.7522 12.4293 20.7522Z"
            fill="#505971"
            fillOpacity="1"
          ></path>
        </svg>
      )}
      <input type="text" className={clsx('h-full w-full bg-transparent outline-none text-sm md:text-base', className)} {...inputProps} />
    </div>
  );
};
