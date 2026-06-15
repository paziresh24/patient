import Button from '@/common/components/atom/button';
import Modal from '@/common/components/atom/modal';
import TextField from '@/common/components/atom/textField';
import classNames from '@/common/utils/classNames';
import { FormEvent, RefObject } from 'react';
import { isValidEmail } from './utils';

interface GoogleCalendarEmailModalProps {
  isOpen: boolean;
  isLoading: boolean;
  email: string;
  inputRef: RefObject<HTMLInputElement>;
  onClose: () => void;
  onEmailChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
}

export const GoogleCalendarEmailModal = ({
  isOpen,
  isLoading,
  email,
  inputRef,
  onClose,
  onEmailChange,
  onSubmit,
}: GoogleCalendarEmailModalProps) => {
  const trimmedEmail = email.trim();
  const isEmailValid = isValidEmail(trimmedEmail);
  const showInvalidEmail = trimmedEmail.length > 0 && !isEmailValid;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="اضافه کردن نوبت به تقویم گوگل" >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <TextField
          ref={inputRef}
          label="ایمیل خود را وارد کنید:"
          type="email"
          dir="ltr"
          inputMode="email"
          autoComplete="email"
          placeholder="example@email.com"
          value={email}
          onChange={event => onEmailChange(event.target.value)}
          disabled={isLoading}
          error={showInvalidEmail}
          helperText={showInvalidEmail ? 'ایمیل وارد شده معتبر نیست' : undefined}
          className={classNames({
            '!border-green-400 !bg-green-50': isEmailValid,
          })}
        />
        <Button type="submit" block loading={isLoading} disabled={!isEmailValid || isLoading}>
          ثبت
        </Button>
      </form>
    </Modal>
  );
};
