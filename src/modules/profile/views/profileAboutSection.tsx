import Biography from '@/modules/profile/views/biography';
import { LockedCouncilMedicalCode } from '@/modules/profile/components/lockedCouncilMedicalCode';

type ProfileAboutSectionProps = {
  biography: string;
  medicalCode: string;
};

export const ProfileAboutSection = ({ biography, medicalCode }: ProfileAboutSectionProps) => {
  return (
    <div className="flex w-full flex-col items-center">
      <h2 className="w-full px-4 text-right text-base font-bold leading-normal text-slate-800">درباره من</h2>
      <div className="mt-2 w-full bg-white p-4 md:rounded-lg">
        {medicalCode ? <LockedCouncilMedicalCode code={medicalCode} /> : null}
        {biography ? <Biography content={biography} className="!p-0" /> : null}
      </div>
    </div>
  );
};

export default ProfileAboutSection;
