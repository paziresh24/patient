import { useLikeFeedback } from '@/common/apis/services/rate/likeFeedback';
import { useReplyfeedback } from '@/common/apis/services/rate/replyFeedback';
import Button from '@/common/components/atom/button/button';
import MessageBox from '@/common/components/atom/messageBox/messageBox';
import Modal from '@/common/components/atom/modal/modal';
import TextField from '@/common/components/atom/textField/textField';
import DislikeIcon from '@/common/components/icons/dislike';
import HeartIcon from '@/common/components/icons/heart';
import InfoIcon from '@/common/components/icons/info';
import LikeIcon from '@/common/components/icons/like';
import ReplyIcon from '@/common/components/icons/reply';
import SearchIcon from '@/common/components/icons/search';
import ShareIcon from '@/common/components/icons/share';
import useModal from '@/common/hooks/useModal';
import useResponsive from '@/common/hooks/useResponsive';
import { splunkInstance } from '@/common/services/splunk';
import classNames from '@/common/utils/classNames';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useGetFeedbackData } from '@/modules/profile/hooks/useGetFeedback';
import { useProfileSplunkEvent } from '@/modules/profile/hooks/useProfileEvent';
import { useFeedbackDataStore } from '@/modules/profile/store/feedbackData';
import Rate from '@/modules/rate/view/rate';
import { getCookie } from 'cookies-next';
import compact from 'lodash/compact';
import { useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';

interface RateReviewProps {
  doctor: {
    center: { id: string; name: string }[];
    id: string;
    name: string;
    image?: string;
    group_expertises?: string;
    group_expertises_slug?: string;
    expertise?: string;
    slug: string;
    city: string[];
  };
  serverId: string;
  rateDetails: {
    satisfaction: number;
    count: number;
    information: {
      id: number;
      title: string;
      satisfaction: number;
      avg_star: number;
    }[];
  };
  className?: string;
}

export const RateReview = (props: RateReviewProps) => {
  const { doctor, serverId, rateDetails, className } = props;
  const { isLoading, rateSearch, rateSortFilter, rateFilterType, showMore, showMoreButtonLoading, message } = useGetFeedbackData({
    doctor_id: doctor.id,
    server_id: serverId,
  });
  const toggleLike = useFeedbackDataStore(state => state.toggleLike);
  const { rateSplunkEvent } = useProfileSplunkEvent();
  const [rateFilter, setRateFilter] = useState<{ label: string; value: 'my_feedbacks' | 'has_nobat' | 'center_id' | 'all' }>({
    label: 'همه نظرات',
    value: 'all',
  });
  const [rateSort, setRateSort] = useState<{ label: string; value: 'default_order' | 'like' | 'created_at' }>({
    label: 'مرتبط ترین',
    value: 'default_order',
  });
  const { handleClose, handleOpen, modalProps } = useModal();
  const { handleOpen: handleOpenReportModal, modalProps: reportModalProps } = useModal();
  const [feedbackReplyModalDetails, setFeedbackReplyModalDetails] = useState<{ id: string; isShow: boolean }[]>([]);
  const [feedbackDetails, setFeedbackDetails] = useState<any>(null);
  const feedbacksData = useFeedbackDataStore(state => state.data);
  const { isDesktop } = useResponsive();
  const [replyDetails, setReplyDetails] = useState<{ text: string; id: string }[]>([]);
  const { isLogin, userInfo } = useUserInfoStore(state => ({
    isLogin: state.isLogin,
    userInfo: state.info,
  }));
  const likeFeedback = useLikeFeedback();
  const replyFeedback = useReplyfeedback();
  const { handleOpenLoginModal } = useLoginModalContext();
  const replyText = useRef<HTMLInputElement>();
  const reportText = useRef<HTMLInputElement>();

  const replysStructure = (replys: any[], mainfeedbackowner: string): any[] => {
    return replys?.map((reply: any) => {
      return {
        id: reply.id,
        name: `${reply.user_name} در پاسخ به ${mainfeedbackowner}`,
        description: reply.description,
        avatar: reply.user_image,
        options: [
          {
            id: reply.id,
            name: 'پاسخ',
            action: () => showReplyModal(reply.id, reply.is_doctor),
            type: 'button',
            icon: <ReplyIcon />,
          },
        ],
        reply: replysStructure(reply.reply, reply.user_name),
      };
    });
  };

  const feedbackInfo = useMemo(() => {
    return feedbacksData?.map(
      (feedback: any) =>
        feedback && {
          type: 'parent',
          name: feedback.user_name,
          id: feedback.id,
          description: feedback.description,
          avatar: feedback.user_image,
          ...(feedback.book_status && { tag: [{ id: 1, name: 'ویزیت شده', isBold: false }] }),
          replyModal: {
            id: feedback.id,
            title: 'نظرات',
            isShow: feedbackReplyModalDetails.find(reply => reply.id === feedback.id)?.isShow ?? false,
            handleOpen: () => showReplyModal(feedback.id, feedback.is_doctor),
            onClose: () =>
              setFeedbackReplyModalDetails(
                feedbackReplyModalDetails.map(reply => (reply.id === feedback.id ? { id: reply.id, isShow: false } : reply)),
              ),
          },
          options: [
            {
              id: 2,
              name: 'اشتراک گذاری',
              action: () => shareCommenthandler(feedback.id),
              type: 'menu',
              icon: <ShareIcon width={22} height={22} />,
              inModal: true,
            },
            {
              id: 4,
              name: 'پسندیدن',
              action: () => likeFeedbackHandler(feedback.id),
              type: 'button',
              icon: (
                <HeartIcon
                  width={20}
                  height={20}
                  className={classNames('[&>path]:stroke-slate-800 [&>path]:text-white', {
                    '[&>path]:fill-red-600 [&>path]:stroke-red-600': feedback?.isLiked,
                  })}
                />
              ),
              prefix: feedback?.like > 0 && feedback?.like,
              inModal: true,
            },
            {
              id: 1,
              name: 'گزارش',
              action: () => showReportModal(feedback.id, feedback.description, feedback.is_doctor),
              type: 'button',
              icon: <InfoIcon width={22} height={22} />,
              inModal: true,
            },
          ],
          details: compact([feedback.formatted_date, feedback?.center_name]),
          ...(feedback.feedback_symptomes?.length && {
            symptomes: { text: 'علت مراجعه', items: feedback.feedback_symptomes.map((symptom: any) => symptom.symptomes) },
          }),
          recommend: {
            text: feedback.recommended === '1' ? 'پزشک را توصیه می‌کنم' : 'پزشک را توصیه نمیکنم',
            isRecommend: feedback.recommended === '1',
            icon:
              feedback.recommended === '1' ? (
                <LikeIcon style={{ transform: 'rotateY(180deg)' }} className=" w-5 mb-[0.1rem]" />
              ) : (
                <DislikeIcon className="w-5 mt-2 " />
              ),
          },
          reply: feedback.reply?.map((feedback: any) => {
            const nestedReply = replysStructure(feedback.reply, feedback.user_name);
            return {
              type: 'reply',
              id: feedback.id,
              name: feedback.user_name,
              description: feedback.description,
              avatar: feedback.user_image,
              options: [
                {
                  id: feedback.id,
                  name: 'پاسخ',
                  action: () => showReplyModal(feedback.id, feedback.is_doctor),
                  type: 'button',
                  icon: <ReplyIcon />,
                },
              ],
              reply: nestedReply,
            };
          }),
          messageBox: {
            placeholder: 'نظر خود را بنویسید...',
            submitText: 'ارسال',
            onSubmit: (text: string) => submitReplyHandler(feedback.id, text),
          },
        },
    );
  }, [feedbacksData, feedbackReplyModalDetails, replyDetails]);

  const changeFilterSelect = (e: any) => {
    setRateFilter(e);
    rateFilterType(e?.value);
  };

  const changeSortSelect = (e: any) => {
    setRateSort(e);
    rateSortFilter(e?.value);
  };

  const details = useMemo(() => {
    return {
      satisfaction: rateDetails.satisfaction,
      title: 'رضایت',
      count: rateDetails.count,
      count_text: 'نظر',
      information: rateDetails.information,
    };
  }, []);

  const rateSearchInputs = useMemo(() => {
    const centerOption = doctor.center.map((center: any) => center && { label: center.name, value: center.id });
    return [
      {
        id: 1,
        options: [
          { label: 'همه نظرات', value: 'all' },
          isLogin && { label: 'نظرات من', value: 'my_feedbacks' },
          { label: 'بیماران دارای نوبت', value: 'has_nobat' },
          ...centerOption,
        ].filter(Boolean),
        value: rateFilter,
        onChange: (e: any) => changeFilterSelect(e),
      },
      {
        id: 2,
        options: [
          { label: 'مرتبط ترین نظر', value: 'default_order' },
          { label: 'جدید ترین نظر', value: 'created_at' },
          { label: 'محبوب ترین نظر', value: 'like' },
        ],
        value: rateSort,
        onChange: (e: any) => changeSortSelect(e),
      },
    ];
  }, [rateFilter, rateSort, doctor.center]);

  const searchInputParams = useMemo(() => {
    return {
      placeholder: 'جستجوی نام بیماری و ... در نظرات',
      onChange: (e: any) => rateSearch(e.target.value),
      icon: <SearchIcon className="absolute bg-white cursor-pointer top-3 left-3 text-slate-600" />,
      className: 'placeholder:text-sm !text-sm !border-0',
    };
  }, []);

  const setReplies = (id: string, text: string) => {
    replyDetails.some(reply => reply.id === id)
      ? setReplyDetails(replyDetails.map(reply => (reply.id === id ? { text: text, id: id } : reply)))
      : setReplyDetails([...replyDetails, { text: text, id: id }]);
  };

  const showReportModal = (id: string, description: string, isDoctor: boolean) => {
    rateSplunkEvent('report');
    setFeedbackDetails({
      id: id,
      description: description,
      isDoctor: isDoctor,
    });
    handleOpenReportModal();
  };

  const showReplyModal = (id: string, isDoctor: boolean) => {
    rateSplunkEvent('reply first reply box');
    setFeedbackDetails({
      id: id,
      isDoctor: isDoctor,
    });
    handleOpen();
  };

  const submitReportFeedbackhandler = async (text: string) => {
    if (!isLogin)
      return handleOpenLoginModal({
        state: true,
      });
    if (text.length < 10) return toast.error('حداقل مقدار مجاز ۱۰ کاراکتر می باشد.');
    await splunkInstance().sendEvent({
      group: 'report',
      type: 'report-group',
      event: {
        data: {
          report: text,
          url: location.href,
          current_comment: feedbackDetails.description,
          comment_id: feedbackDetails.feedbackId,
          terminal_id: getCookie('terminal_id'),
          phone: userInfo.username ?? null,
          is_doctor: feedbackDetails.isDoctor,
        },
      },
    });
    toast.success('نظر شما ثبت گردید و پس از تایید، نمایش خواهد داده شد.');
    handleClose();
  };

  const shareCommenthandler = (id: string) => {
    rateSplunkEvent('share');
    const url = `${location.href}#comment-${id}`;
    navigator.share({
      text: `اشتراک گذاری نظر`,
      url,
    });
  };

  const submitRateDetails = {
    text: 'نظر خود را به اشتراک بگذارید:',
    buttons: [
      {
        id: 1,
        text: 'ثبت نظر',
        action: () => {
          rateSplunkEvent('post');
          location.href = `https://www.paziresh24.com/comment/?doctorName=${doctor.name}&image=${doctor.image}&group_expertises=${doctor.group_expertises}&group_expertises_slug=${doctor.group_expertises_slug}&expertise=${doctor.expertise}&doctor_id=${doctor.id}&server_id=${serverId}&doctor_city=${doctor.city[0]}&doctor_slug=${doctor.slug}`;
        },
      },
    ],
  };

  const likeFeedbackHandler = async (id: string) => {
    rateSplunkEvent('like');
    toggleLike(id);
    await likeFeedback.mutateAsync({
      feedback_id: id,
    });
  };

  const submitReplyHandler = async (id: string, text: string) => {
    if (!isLogin)
      return handleOpenLoginModal({
        state: true,
      });
    if (!text) return toast.error('لطفا متنی را وارد کنید');
    await replyFeedback.mutate({
      description: text,
      doctor_id: '540',
      server_id: '1',
      feedback_id: id,
    });
    handleClose();
    if (replyFeedback.status) toast.success('نظر شما ثبت گردید و پس از تایید، نمایش خواهد داده شد.');
    feedbacksData[0]?.reply?.[0].id === id ? rateSplunkEvent('send reply first reply box') : rateSplunkEvent('send reply or comment');
  };
  return (
    <>
      <div className={classNames('w-full bg-white', className)}>
        <Rate
          details={details}
          filters={rateSearchInputs}
          search={searchInputParams}
          feedbacks={feedbackInfo}
          controller={submitRateDetails}
          isLoading={!showMoreButtonLoading && isLoading}
          message={message}
        />
        {!message && (showMoreButtonLoading || !isLoading) && !!feedbackInfo.length && rateDetails.count > feedbackInfo.length && (
          <div className="p-4">
            <Button variant="secondary" block onClick={showMore} loading={showMoreButtonLoading}>
              نمایش بیشتر
            </Button>
          </div>
        )}

        <Modal title="گزارش نظر" {...reportModalProps}>
          <TextField
            multiLine
            placeholder="لطفا علت و شرح گزارش نظر این کاربر را اعلام کنید تا تیم پشتیبانی پذیرش24 بر اساس پیشنهاد شما، نظر کاربر را مجددا بررسی نماید."
            className="h-[10rem]"
            ref={reportText}
          />
          <Button onClick={() => submitReportFeedbackhandler(reportText.current?.value!)} block className="mt-4">
            ارسال گزارش
          </Button>
        </Modal>
        <Modal title="پاسخ به نظر" {...modalProps} noHeader={!isDesktop}>
          {isDesktop ? (
            <>
              <TextField
                multiLine
                placeholder="نظر خود را بنویسید..."
                onChange={e => setReplies(feedbackDetails.id, e.target.value)}
                className="h-[10rem]"
                autoFocus
                ref={replyText}
              />
              <Button onClick={() => submitReplyHandler(feedbackDetails.id, replyText.current?.value!)} block className="mt-4">
                ثبت پاسخ
              </Button>
            </>
          ) : (
            <MessageBox
              placeholder="لطفا متن خود را وارد کنید"
              submitText="ارسال"
              submitHandled={text => submitReplyHandler(feedbackDetails.id, text)}
              autoFocus
            />
          )}
        </Modal>
      </div>
    </>
  );
};
export default RateReview;
