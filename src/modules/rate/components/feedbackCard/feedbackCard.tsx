import MessageBox from '@/common/components/atom/messageBox/messageBox';
import Modal from '@/common/components/atom/modal/modal';
import PersonseIcon from '@/common/components/icons/persons';
import useModal from '@/common/hooks/useModal';
import useResponsive from '@/hooks/useResponsive';
import classNames from '@/common/utils/classNames';
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
  const { handleOpen, modalProps } = useModal();

  return (
    <div
      key={feedback.id}
      className={classNames('w-full flex space-y-3 flex-col items-center h-auto bg-white border-y pt-4 border-[#efefef]', className)}
    >
      <Feedback
        {...feedback}
        firstReply
        options={
          [
            ...feedback.options!,
            feedback?.reply?.length! > 1 && {
              id: 3,
              name: 'نمایش نظرات بیماران',
              action: handleOpen,
              type: 'controller',
              icon: <PersonseIcon className="w-[1.1rem]" />,
              inModal: false,
            },
          ].filter(Boolean) as Options[]
        }
      />

      <Modal title={feedback.replyModal?.title} {...modalProps} fullScreen bodyClassName="!px-0 !pb-16">
        <Feedback firstReply={false} {...feedback} options={feedback.options?.filter(option => option.inModal)} />
      </Modal>
    </div>
  );
};

export default FeedbackCard;
