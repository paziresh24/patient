import Autocomplete from '@/common/components/atom/autocomplete/autocomplete';
import Text from '@/common/components/atom/text/text';
import { SearchInput } from '@/modules/search/components/suggestion/suggestionAtoms/searchInput';
import clsx from 'clsx';
import { useState } from 'react';

interface RateSearchProps {
  lable?: string;
  placholder?: string;
  value?: string | { label?: string; value?: any }[] | any;
  onchange: (value: string) => void;
  type: 'search' | 'select' | any;
  className?: string;
}

export const RateSearch = (props: RateSearchProps) => {
  const { lable, placholder, value, onchange, type, className } = props;
  const [userSearchValue, setUserSearchValue] = useState('');
  const [inputFocus, setInputFocus] = useState(false);

  const changeValue = (value: string) => {
    setUserSearchValue(value);
    onchange(value);
  };

  return (
    <>
      {lable && (
        <Text fontSize="sm" fontWeight="semiBold" className="mr-2">
          {lable}
        </Text>
      )}
      {type === 'search' && (
        <div className={clsx('w-full bg-white px-2 rounded-lg', { '!border-blue-600 border-[0.13rem]': inputFocus }, className)}>
          <SearchInput
            placeholder={placholder}
            onChange={e => changeValue(e.target.value)}
            onFocus={() => setInputFocus(true)}
            onBlur={() => setInputFocus(false)}
            value={userSearchValue}
            className="placeholder:text-sm !text-sm"
            onClear={() => setUserSearchValue('')}
          />
        </div>
      )}
      {type === 'select' && (
        <Autocomplete
          onChange={e => changeValue(e.target.value.value)}
          label={lable}
          options={value}
          value={userSearchValue ? value.find((data: any) => data.value === userSearchValue) : value[0]}
          className={className}
        />
      )}
    </>
  );
};

export default RateSearch;
