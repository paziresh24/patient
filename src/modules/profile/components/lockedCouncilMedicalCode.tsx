import classNames from '@/common/utils/classNames';
import { formatCouncilMedicalCodeLine } from '@/modules/profile/utils/buildAboutBiographyWithMedicalCode';

type LockedCouncilMedicalCodeProps = {
  code: string;
  className?: string;
};

/** System-owned line: not part of editable biography HTML. */
export const LockedCouncilMedicalCode = ({ code, className }: LockedCouncilMedicalCodeProps) => {
  const trimmed = code.trim();
  if (!trimmed) {
    return null;
  }

  return (
    <p
      data-testid="locked-council-medical-code"
      contentEditable={false}
      suppressContentEditableWarning
      className={classNames(
        'm-0 mb-2 w-full text-right text-sm font-normal leading-normal tracking-normal',
        className,
      )}
    >
      {formatCouncilMedicalCodeLine(trimmed)}
    </p>
  );
};

export default LockedCouncilMedicalCode;
