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
  isShow: boolean;
  placeholder?: string;
  submitText?: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

interface Feedbacks extends Card {
  reply?: Reply[];
  firstReply?: boolean;
  messageBox?: MessageBoxProps;
  replyModalTitle?: string;
}

interface FeedbackCardProps {
  feedback: Feedbacks[];
  className?: string;
}

export const Feedback = (props: Omit<Feedbacks, 'firstReply'>) => {
  const { description, id, name, avatar, className, details, options, recommend, symptoms, tag, messageBox } = props;
  const [inputFocus, setInputFocus] = useState(false);
  return (
    <>
      <div className="relative">
        <RateCard
          id={id}
          description={description}
          details={details}
          name={name}
          options={options}
          avatar={avatar}
          recommend={recommend}
          symptoms={symptoms}
          tag={tag}
          className={className}
        />
        {messageBox?.isShow && (
          <div className="px-3">
            <MessageBox
              placeholder={messageBox.placeholder}
              submitText={messageBox.submitText}
              onChange={e => messageBox.onChange}
              submitHandled={messageBox.onSubmit}
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

export const FeedbackCard = (props: FeedbackCardProps) => {
  const { feedback, className } = props;
  const [ShowModal, setShowModal] = useState(true);
  return (
    <>
      {feedback.map(rate => (
        <>
          <div
            key={rate.id}
            className={clsx('w-full flex flex-col items-center h-auto  bg-white border-y p-3 border-[#efefef]', className)}
          >
            <Feedback
              description={rate.description}
              id={rate.id}
              name={rate.name}
              reply={rate.reply}
              avatar={rate.avatar}
              className={rate.className}
              details={rate.details}
              options={rate.options}
              recommend={rate.recommend}
              symptoms={rate.symptoms}
              tag={rate.tag}
              messageBox={rate.messageBox}
            />
            {rate.reply?.length && rate.firstReply && (
              <Replies
                description={rate.reply[0].description}
                id={rate.reply[0].id}
                name={rate.reply[0].name}
                avatar={rate.reply[0].avatar}
                className={'rounded-lg !bg-[#ececec99] my-3'}
                options={rate.reply[0].options}
              />
            )}
          </div>
          <Modal
            title={rate.replyModalTitle}
            isOpen={ShowModal}
            onClose={() => setShowModal(false)}
            fullScreen
            bodyClassName="!px-0 !pt-0 !pb-16"
          >
            <Feedback
              description={rate.description}
              id={rate.id}
              name={rate.name}
              avatar={rate.avatar}
              className={rate.className}
              details={rate.details}
              options={rate.options?.filter(option => option.type === 'menu' || (option.type === 'button' && option.name === 'پسندیدن'))}
              recommend={rate.recommend}
              symptoms={rate.symptoms}
              tag={rate.tag}
              messageBox={rate.messageBox}
            />
            <Divider className="my-3" />
            {rate.reply?.map(items => (
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
        </>
      ))}
    </>
  );
};

export default FeedbackCard;
