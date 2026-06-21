import Button from '@/common/components/atom/button';
import Modal from '@/common/components/atom/modal';
import Switch from '@/common/components/atom/switch';
import Text from '@/common/components/atom/text';
import TextField from '@/common/components/atom/textField';
import EditIcon from '@/common/components/icons/edit';
import classNames from '@/common/utils/classNames';
import { FormEvent, RefObject } from 'react';
import styles from './googleCalendarAddEvent.module.css';
import { isValidEmail } from './utils';

interface GoogleCalendarEmailModalProps {
  isOpen: boolean;
  isSaving?: boolean;
  email: string;
  isLocked: boolean;
  autoSync: boolean;
  initialAutoSync: boolean;
  showAutoSyncOption: boolean;
  inputRef: RefObject<HTMLInputElement>;
  onClose: () => void;
  onEdit: () => void;
  onAutoSyncChange: (value: boolean) => void;
  onEmailChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
}

export const GoogleCalendarEmailModal = ({
  isOpen,
  isSaving = false,
  email,
  isLocked,
  autoSync,
  initialAutoSync,
  showAutoSyncOption,
  inputRef,
  onClose,
  onEdit,
  onAutoSyncChange,
  onEmailChange,
  onSubmit,
}: GoogleCalendarEmailModalProps) => {
  const trimmedEmail = email.trim();
  const isEmailValid = isValidEmail(trimmedEmail);
  const showInvalidEmail = !isLocked && trimmedEmail.length > 0 && !isEmailValid;
  const hasPreferenceChanges = autoSync !== initialAutoSync;
  const isSubmitDisabled = isLocked ? !hasPreferenceChanges || isSaving : !isEmailValid || isSaving;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="اضافه کردن نوبت به تقویم گوگل">
      <form onSubmit={onSubmit} className={styles.modalForm}>
        {isLocked ? (
          <div className="flex flex-col space-y-2">
            <Text fontSize="sm" fontWeight="medium" className="text-black">
              ایمیل خود را وارد کنید:
            </Text>
            <div className={styles.modalLockedEmailBox}>
              <span className={styles.modalEmailSuccessPulse} aria-label="ارسال موفق" role="status" />
              <Text dir="ltr" fontSize="sm" className="min-w-0 flex-1 truncate text-left text-slate-700">
                {email}
              </Text>
              <button type="button" aria-label="ویرایش ایمیل" title="ویرایش ایمیل" className={styles.modalEditButton} onClick={onEdit}>
                <EditIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ) : (
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
            error={showInvalidEmail}
            helperText={showInvalidEmail ? 'ایمیل وارد شده معتبر نیست' : undefined}
            className={classNames({
              '!border-green-400 !bg-green-50': isEmailValid,
            })}
          />
        )}

        {showAutoSyncOption && (
          <div
            className={classNames(styles.modalAutoSyncCard, {
              [styles.modalAutoSyncCardActive]: autoSync,
            })}
          >
            <div className={styles.modalAutoSyncRow}>
              <button type="button" className={styles.modalAutoSyncLabel} onClick={() => onAutoSyncChange(!autoSync)}>
                <Text fontSize="sm" fontWeight="medium" className="text-slate-800">
                  افزودن خودکار به تقویم
                </Text>
                {autoSync && (
                  <span className={styles.modalStatusBadge}>
                    <span className={styles.modalStatusPulse} aria-hidden />
                    فعال
                  </span>
                )}
              </button>
              <Switch
                checked={autoSync}
                onChange={event => {
                  event.stopPropagation();
                  onAutoSyncChange(event.target.checked);
                }}
              />
            </div>
            <div
              className={classNames(styles.modalAutoSyncHint, {
                [styles.modalAutoSyncHintOpen]: autoSync,
              })}
              aria-hidden={!autoSync}
            >
              <div className={styles.modalAutoSyncHintInner}>
                <p className={styles.modalAutoSyncHintText}>
                  نوبت‌های شما به صورت خودکار، به تقویم گوگل شما اضافه خواهند شد.
                </p>
              </div>
            </div>
          </div>
        )}

        <Button type="submit" block loading={isSaving} disabled={isSubmitDisabled}>
          {isLocked && hasPreferenceChanges ? 'ذخیره تنظیمات' : 'ثبت'}
        </Button>
      </form>
    </Modal>
  );
};
