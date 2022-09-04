import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import ChevronIcon from '../../icons/chevron';
import Text from '../text';
import TextField, { TextFieldProps } from '../textField';

export interface AutocompleteProps extends Omit<TextFieldProps, 'onChange' | 'value' | 'classNameWrapper'> {
  options: Option[];
  onChange?: (value: { target: { value: Option } }) => void;
  value?: Option;
  classNameWrapper?: string;
}

type Option = {
  label: string;
  value: any;
};

export const Autocomplete = (props: AutocompleteProps) => {
  const { options, onChange, value, classNameWrapper, ...inputProps } = props;
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Option[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const wrapperRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value) {
      if (inputRef.current) inputRef.current.value = value.label ?? '';
    }
  }, [value]);

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
    if (inputRef.current) inputRef.current.value = option.label;
    onChange && onChange({ target: { value: option } });
  };

  const onClickInput = () => {
    if (showSuggestions) return onClose();
    const getFilteredSuggestions = options;
    setActiveSuggestion(0);
    setShowSuggestions(true);
    setFilteredSuggestions(getFilteredSuggestions);
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
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }
      setActiveSuggestion(activeSuggestion + 1);
    }
  };

  if (showSuggestions) {
    suggestionsListComponent = (
      <ul className="absolute w-full mt-1 bg-white rounded-lg shadow-md z-infinity max-h-[15rem] overflow-auto">
        {filteredSuggestions.length ? (
          filteredSuggestions.map((suggestion, index) => {
            return (
              <li
                key={suggestion.value}
                className={clsx('p-3 cursor-pointer', {
                  'bg-slate-100': index === activeSuggestion,
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
      <div className="relative flex items-center w-full">
        <TextField
          {...inputProps}
          onFocus={onClickInput}
          className={clsx('cursor-pointer', inputProps.className)}
          ref={inputRef}
          onKeyDown={(e: any) => onKeyDown(e)}
          readOnly
        />
        <ChevronIcon
          dir={showSuggestions ? 'top' : 'bottom'}
          className={clsx('absolute', {
            'left-5 bottom-4': inputProps.size === 'small',
            'left-6 bottom-6': inputProps.size !== 'small',
          })}
        />
      </div>
      {suggestionsListComponent}
    </div>
  );
};

export default Autocomplete;
