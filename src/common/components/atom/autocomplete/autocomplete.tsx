import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import ChevronIcon from '../../icons/chevron';
import Text from '../text';
import TextField, { TextFieldProps } from '../textField';

export interface AutocompleteProps extends Omit<TextFieldProps, 'onChange' | 'value' | 'classNameWrapper' | 'defaultValue'> {
  options: Option[];
  onChange?: (value: { target: { value: Option } }) => void;
  value?: Option;
  defaultValue?: Option;
  classNameWrapper?: string;
  searchable?: boolean;
}

type Option = {
  label?: string;
  value?: any;
};

export const Autocomplete = (props: AutocompleteProps) => {
  const { options, onChange, value, classNameWrapper, defaultValue, searchable, ...inputProps } = props;
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Option[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const prevValue = useRef('');
  const wrapperRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.value = value?.label ?? '';
  }, [value]);

  useEffect(() => {
    if (inputRef.current && defaultValue) inputRef.current.value = defaultValue?.label ?? '';
  }, []);

  const onClose = () => {
    if (showSuggestions) {
      setActiveSuggestion(0);
      setShowSuggestions(false);
    }
  };

  useClickAway(wrapperRef, onClose);
  let suggestionsListComponent;

  const handleSetInputValue = (option: Option) => {
    setActiveSuggestion(0);
    setShowSuggestions(false);
    if (inputRef.current) inputRef.current.value = option.label ?? '';
    prevValue.current = option.label ?? '';
    onChange && onChange({ target: { value: option } });
  };

  const onClickInput = () => {
    if (showSuggestions) return onClose();
    const getFilteredSuggestions = options;
    setActiveSuggestion(0);
    setShowSuggestions(true);
    setFilteredSuggestions(getFilteredSuggestions);
    if (inputRef.current && searchable) {
      prevValue.current = inputRef.current.value;
      inputRef.current.value = '';
    }
  };

  const onClick = (option: Option) => {
    handleSetInputValue(option);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.keyCode === 13) {
      handleSetInputValue(filteredSuggestions[activeSuggestion]);
    } else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }
      setActiveSuggestion(activeSuggestion - 1);
    } else if (e.keyCode === 40) {
      if (activeSuggestion + 1 >= filteredSuggestions.length) {
        return;
      }
      setActiveSuggestion(activeSuggestion + 1);
    }
  };

  if (showSuggestions) {
    suggestionsListComponent = (
      <ul className="absolute w-full mt-1 bg-white divide-y divide-slate-100 rounded-lg shadow-md z-infinity max-h-[15rem] overflow-auto">
        {filteredSuggestions.length ? (
          filteredSuggestions.map((suggestion, index) => {
            return (
              <li
                key={suggestion.value}
                className={clsx('p-3 cursor-pointer', {
                  'bg-slate-50': activeSuggestion > 0 && index === activeSuggestion,
                  'bg-slate-100': suggestion.value === value?.value,
                })}
                onClick={() => onClick(suggestion)}
              >
                {suggestion.label}
              </li>
            );
          })
        ) : (
          <li className="p-3">
            <Text fontSize="sm">نتیجه ای یافت نشد.</Text>
          </li>
        )}
      </ul>
    );
  }

  return (
    <div className={clsx('relative', classNameWrapper)} ref={wrapperRef}>
      <div className="relative flex items-center justify-end w-full" onClick={onClickInput} onKeyDown={(e: any) => onKeyDown(e)}>
        <TextField
          {...inputProps}
          className={clsx('cursor-pointer !select-none', inputProps.className)}
          ref={inputRef}
          readOnly={searchable ? !showSuggestions : true}
          onBlur={() => {
            if (inputRef.current && searchable) inputRef.current.value = value?.label ?? prevValue.current ?? defaultValue?.label ?? '';
          }}
          onChange={e => {
            if (!searchable) return;
            showSuggestions && setFilteredSuggestions(options.filter(item => item.label?.includes(e.target.value)));
            setActiveSuggestion(0);
          }}
        />
        <ChevronIcon
          dir={showSuggestions ? 'top' : 'bottom'}
          className={clsx('absolute mx-5', {
            'bottom-[0.9rem]': inputProps.size === 'small',
            'bottom-[1.1rem]': inputProps.size !== 'small',
          })}
        />
      </div>
      {suggestionsListComponent}
    </div>
  );
};

export default Autocomplete;
