import classNames from '@/common/utils/classNames';
import { DsCard, DsButton, ds } from '@/modules/doctorHome/designSystem';
import { Phone } from 'lucide-react';
import { useVoiceCallUiStore } from '../store/voiceCallUi';

type Props = {
  className?: string;
  /** denser row for sidebar */
  compact?: boolean;
};

/**
 * In-flow voice entry — matches doctor-home DS cards/rows (not a floating FAB).
 */
export function VoiceAssistantCard({ className, compact = false }: Props) {
  const openCall = useVoiceCallUiStore(state => state.openCall);

  return (
    <DsCard
      padding="none"
      interactive
      onClick={openCall}
      className={classNames(ds.motion.press, className)}
    >
      <div
        className={classNames(
          'flex items-center',
          ds.layout.listRowGap,
          compact ? 'px-3 py-2.5' : ds.layout.rowPaddingWide,
        )}
      >
        <div
          className={classNames(
            ds.icon.containerAction,
            compact ? 'h-9 w-9' : 'h-10 w-10',
          )}
        >
          <Phone size={compact ? 16 : 18} strokeWidth={2} className={ds.icon.color} />
        </div>
        <div className="min-w-0 flex-1">
          <p className={ds.type.cardTitleSemibold}>آرش، دستیار صوتی</p>
          <p className={classNames(ds.type.caption, 'mt-0.5')}>با صحبت، مطب را مدیریت کنید</p>
        </div>
        <DsButton
          variant="primary"
          className="!h-8 !min-h-0 shrink-0 !rounded-full !px-3.5 !text-[11px]"
          onClick={openCall}
        >
          تماس
        </DsButton>
      </div>
    </DsCard>
  );
}
