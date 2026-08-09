import { ChevronIcon } from '@/common/components/icons/chevron';
import classNames from '@/common/utils/classNames';
import { useEffect, useId, useRef, useState } from 'react';

export interface RaviComboOption {
  value: string;
  label: string;
}

interface RaviComboSelectProps {
  value: string;
  options: RaviComboOption[];
  onChange: (value: string) => void;
  className?: string;
}

const shellClass =
  'relative flex min-h-[42px] w-full items-center rounded-xl border border-[#dbdbd7] bg-white px-3 py-2.5 text-right text-sm text-slate-800 transition-colors hover:border-[#c8c7c1]';

export const RaviComboSelect = ({ value, options, onChange, className }: RaviComboSelectProps) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = options.find(option => option.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={classNames('relative w-full', className)} dir="rtl">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen(prev => !prev)}
        className={classNames(shellClass, 'w-full justify-between gap-2', {
          'border-[#c8c7c1] shadow-[0_0_0_3px_#96c7f2]': open,
        })}
      >
        <span className="min-w-0 flex-1 truncate text-right">{selected?.label}</span>
        <span className="flex h-5 w-5 shrink-0 items-center justify-center text-[#90908c]">
          <ChevronIcon dir="bottom" className="h-3.5 w-3.5" />
        </span>
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute inset-x-0 top-[calc(100%+4px)] z-20 overflow-hidden rounded-xl border border-[#dbdbd7] bg-white py-1 shadow-sm"
        >
          {options.map(option => {
            const isSelected = option.value === value;
            return (
              <li key={option.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={classNames(
                    'flex w-full items-center px-3 py-2.5 text-right text-sm transition-colors',
                    isSelected ? 'bg-blue-600 text-white' : 'text-slate-800 hover:bg-slate-50',
                  )}
                >
                  <span className="truncate">{option.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
};
