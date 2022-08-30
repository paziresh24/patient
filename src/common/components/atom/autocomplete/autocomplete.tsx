import clsx from 'clsx';
import { KeyboardEvent, useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import ChevronIcon from '../../icons/chevron';
import Text from '../text';
import TextField, { TextFieldProps } from '../textField';

export interface AutocompleteProps extends Omit<TextFieldProps, 'onChange'> {
  options: Option[];
  onChange: (value: Option) => void;
}

type Option = {
  label: string;
  value: any;
};

export const Autocomplete = (props: AutocompleteProps) => {
  const { options, onChange, ...inputProps } = props;
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Option[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const ref = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onClose = () => {
    if (showSuggestions) {
      setActiveSuggestion(0);
      setShowSuggestions(false);
    }
  };

  useClickAway(ref, onClose);
  let suggestionsListComponent;

  const handleSetInputValue = (option: Option) => {
    setActiveSuggestion(0);
    setShowSuggestions(false);
    if (inputRef.current?.value) inputRef.current.value = option.label;
    onChange && onChange(option);
  };

  const onClickInput = () => {
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
                className={clsx('p-3', {
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
    <div className="relative" ref={ref}>
      <div className="relative flex items-center w-full" onClick={onClickInput} onKeyDown={onKeyDown}>
        <TextField {...inputProps} ref={inputRef} readOnly />
        <ChevronIcon dir={showSuggestions ? 'top' : 'bottom'} className="absolute left-5 bottom-4" />
      </div>
      {suggestionsListComponent}
    </div>
  );
};

export default Autocomplete;
