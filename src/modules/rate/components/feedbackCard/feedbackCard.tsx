import MessageBox from '@/common/components/atom/messageBox/messageBox';
import Modal from '@/common/components/atom/modal/modal';
import Text from '@/common/components/atom/text';
import InfoIcon from '@/common/components/icons/info';
import PersonseIcon from '@/common/components/icons/persons';
import useModal from '@/common/hooks/useModal';
import classNames from '@/common/utils/classNames';
import useResponsive from '@/hooks/useResponsive';
import { Card, Options } from '../../type/card';
import RateCard from '../card/card';

interface Reply extends Omit<Card, 'details' | 'recommend' | 'symptomes' | 'tag' | 'text'> {
  reply?: Reply[];
}

type MessageBoxProps = {
  placeholder?: string;
  submitText?: string;
  isLoading?: boolean;
  onSubmit: (value: string) => void;
};

export interface Feedbacks extends Card {
  reply?: Reply[];
  firstReply?: boolean;
  messageBox?: MessageBoxProps;
  replyModal?: {
    title: string;
    id: number;
    isShow: boolean;
    onClose: () => void;
    handleOpen: () => void;
  };
}

export interface FeedbackParams {
  feedback: Feedbacks;
  className?: string;
}

export const Feedback = (props: { replyClassName?: string } & Feedbacks) => {
  const { reply, firstReply, className, replyClassName, messageBox, ...feedback } = props;
  const { isMobile } = useResponsive();
  return (
    <>
      <div className="relative flex flex-col w-full space-y-3">
        <RateCard {...feedback} className={className} />
        {messageBox && (
          <div className="px-4" onClick={isMobile ? feedback.replyModal?.handleOpen : undefined}>
            <MessageBox placeholder={messageBox?.placeholder} submitText={messageBox?.submitText} submitHandled={messageBox?.onSubmit} />
          </div>
        )}
        <div className={classNames('w-full px-4', replyClassName)}>
          {!!reply?.length &&
            reply
              .slice(0, firstReply ? 1 : reply.length)
              .map(item => (
                <Feedback
                  key={item.id}
                  {...item}
                  reply={firstReply ? undefined : item.reply}
                  className={'rounded-lg !bg-slate-100 p-4'}
                  replyClassName="!p-0 !pr-5"
                />
              ))}
        </div>
      </div>
    </>
  );
};

export const FeedbackCard = (props: FeedbackParams) => {
  const { feedback, className } = props;
  const { handleOpen: handleOpenReplyModal, modalProps: replyModalProps } = useModal();
  const { handleOpen: handleOpenExternalInfo, modalProps: externalInfoModalProps } = useModal();

  return (
    <div
      key={feedback.id}
      className={classNames('w-full flex space-y-3 flex-col items-center h-auto bg-white border-y pt-4 border-[#efefef]', className)}
    >
      <Feedback
        {...feedback}
        firstReply
        options={{
          ...feedback.options,
          items: [
            ...(feedback?.options?.items! ?? false),

            feedback?.reply?.length! > 1 && {
              id: 3,
              name: 'نمایش نظرات بیماران',
              action: handleOpenReplyModal,
              type: 'controller',
              icon: <PersonseIcon className="w-[1.1rem]" />,
              inModal: false,
            },
            feedback?.external && {
              id: 4,
              name: 'منبع این نظر: nobat.ir',
              action: handleOpenExternalInfo,
              type: 'controller',
              icon: <InfoIcon className="w-[1.1rem]" />,
              inModal: false,
            },
          ].filter(Boolean) as Options[],
        }}
      />

      <Modal {...externalInfoModalProps} noHeader>
        <Text as="p" fontSize="sm" className="mb-1 leading-6">
          پذیرش24 تلاش میکند تا علاوه بر نظراتی که مستقیما از بیماران پزشک دریافت میکند، سایر نظرات کاربران که آنلاین در سراسر وب ثبت کرده
          اند را برای انتخاب آگاهانه تر بهترین درمانگر در اختیار شما قرار دهد.
        </Text>
        <Text as="p" fontSize="sm" fontWeight="medium">
          طبیعتا این نوع از نظرات، بدون نظارت دقیق منعکس شده اند.
        </Text>
      </Modal>

      <Modal title={feedback.replyModal?.title} {...replyModalProps} fullScreen bodyClassName="!px-0 !pb-16">
        <Feedback
          firstReply={false}
          {...feedback}
          options={{
            ...feedback.options,
            items: feedback.options?.items?.filter(option => option.inModal),
          }}
        />
      </Modal>
    </div>
  );
};

export default FeedbackCard;
