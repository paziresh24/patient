import Divider from '@/common/components/atom/divider/divider';
import MessageBox from '@/common/components/atom/messageBox/messageBox';
import Modal from '@/common/components/atom/modal/modal';
import clsx from 'clsx';
import { useState } from 'react';
import { Card } from '../../type/card';
import RateCard from '../card/card';

interface Reply extends Omit<Card, 'details' | 'recommend' | 'symptoms' | 'tag' | 'text'> {
  reply?: Reply[];
}

type MessageBoxProps = {
  placeholder?: string;
  submitText?: string;
  isLoading?: boolean;
  onChange: (value: any) => void;
  onSubmit: () => void;
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
  };
}

export interface FeedbackParams {
  feedback: Feedbacks;
  className?: string;
}

export const Feedback = (props: Omit<Feedbacks, 'firstReply'>) => {
  const { description, id, name, avatar, className, details, options, recommend, symptomes, tag, messageBox } = props;
  const [inputFocus, setInputFocus] = useState(false);
  return (
    <>
      <div className="relative w-full">
        <RateCard
          id={id}
          description={description}
          details={details}
          name={name}
          options={options}
          avatar={avatar}
          recommend={recommend}
          symptomes={symptomes}
          tag={tag}
          className={className}
        />
        {messageBox && (
          <div className="px-3">
            <MessageBox
              placeholder={messageBox?.placeholder}
              submitText={messageBox?.submitText}
              isLoading={messageBox?.isLoading}
              onChange={(e: any) => messageBox.onChange(e)}
              submitHandled={messageBox?.onSubmit}
              onFocus={() => setInputFocus(true)}
              onBlur={() => setInputFocus(false)}
              className={clsx({ '!border-blue-500': inputFocus })}
            />
          </div>
        )}
      </div>
    </>
  );
};

export const Replies = (props: Reply) => {
  const { description, id, name, avatar, className, options } = props;
  return (
    <div className="px-3 w-full">
      <RateCard id={id} description={description} name={name} options={options} avatar={avatar} className={className} />
    </div>
  );
};

export const NestedReply = (props: Reply) => {
  const { description, id, name, avatar, options, reply, className } = props;
  return (
    <>
      <Replies description={description} id={id} name={name} avatar={avatar} options={options} className={className} />
      {reply?.map(reply => (
        <NestedReply
          key={reply.id}
          description={reply.description}
          id={reply.id}
          name={reply.name}
          avatar={reply.avatar}
          options={reply.options}
          reply={reply.reply}
          className={clsx('!w-[97%] mr-auto', className)}
        />
      ))}
    </>
  );
};

export const FeedbackCard = (props: FeedbackParams) => {
  const { feedback, className } = props;
  return (
    <>
      <div
        key={feedback.id}
        className={clsx('w-full flex flex-col items-center h-auto  bg-white border-y p-2 border-[#efefef]', className)}
      >
        <Feedback
          description={feedback.description}
          id={feedback.id}
          name={feedback.name}
          reply={feedback.reply}
          avatar={feedback.avatar}
          className={feedback.className}
          details={feedback.details}
          options={feedback.options}
          recommend={feedback.recommend}
          symptomes={feedback.symptomes}
          tag={feedback.tag}
          messageBox={feedback.messageBox}
        />
        {!!feedback.reply?.length && feedback.firstReply && (
          <Replies
            description={feedback.reply[0].description}
            id={feedback.reply[0].id}
            name={feedback.reply[0].name}
            avatar={feedback.reply[0].avatar}
            className={'rounded-lg !bg-[#ececec99] my-3'}
            options={feedback.reply[0].options}
          />
        )}
        <Modal
          title={feedback.replyModal?.title}
          isOpen={feedback.replyModal?.isShow!}
          onClose={() => feedback.replyModal?.onClose()}
          fullScreen
          bodyClassName="!px-0 !pt-0 !pb-16"
        >
          <Feedback
            description={feedback.description}
            id={feedback.id * 2}
            name={feedback.name}
            avatar={feedback.avatar}
            className={feedback.className}
            details={feedback.details}
            options={feedback.options?.filter(option => option.inModal)}
            recommend={feedback.recommend}
            symptomes={feedback.symptomes}
            tag={feedback.tag}
            messageBox={feedback.messageBox}
          />
          <Divider className="my-3" />
          {feedback.reply?.map(items => (
            <>
              <NestedReply
                key={items.id}
                description={items.description}
                id={items.id}
                name={items.name}
                avatar={items.avatar}
                options={items.options}
                reply={items.reply}
                className={'border-y border-[#efefef] rounded-lg !bg-[#ececec99] my-3'}
              />
            </>
          ))}
        </Modal>
      </div>
    </>
  );
};

export default FeedbackCard;
