import { useLikeFeedback } from '@/common/apis/services/rate/likeFeedback';
import { useReplyfeedback } from '@/common/apis/services/rate/replyFeedback';
import Button from '@/common/components/atom/button/button';
import MessageBox from '@/common/components/atom/messageBox/messageBox';
import Modal from '@/common/components/atom/modal/modal';
import TextField from '@/common/components/atom/textField/textField';
import DislikeIcon from '@/common/components/icons/dislike';
import HeartIcon from '@/common/components/icons/heart';
import LikeIcon from '@/common/components/icons/like';
import PersonseIcon from '@/common/components/icons/persons';
import ReplyIcon from '@/common/components/icons/reply';
import SearchIcon from '@/common/components/icons/search';
import useResponsive from '@/common/hooks/useResponsive';
import { splunkInstance } from '@/common/services/splunk';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useGetFeedbackData } from '@/modules/profile/hooks/useGetFeedback';
import { useFeedbackDataStore } from '@/modules/profile/store/feedbackData';
import Rate from '@/modules/rate/view/rate';
import clsx from 'clsx';
import { getCookie } from 'cookies-next';
import compact from 'lodash/compact';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useRateFilter } from '../../hooks/useSearchFeedback';

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
}

export const RateReview = (props: RateReviewProps) => {
  const { doctor, serverId, rateDetails } = props;
  const { isLoading } = useGetFeedbackData({ doctor_id: doctor.id, server_id: serverId });
  const [rateFilter, setRateFilter] = useState<{ label: string; value: 'my_feedbacks' | 'has_nobat' | 'center_id' | 'all' }>({
    label: 'همه نظرات',
    value: 'all',
  });
  const [inputFocus, setInputFocus] = useState(false);
  const [rateSort, setRateSort] = useState<{ label: string; value: 'default_order' | 'like' | 'created_at' }>({
    label: 'مرتبط ترین',
    value: 'default_order',
  });
  const [showModal, setShowModal] = useState(false);
  const [feedbackReplyModalDetails, setFeedbackReplyModalDetails] = useState<{ id: string; isShow: boolean }[]>([]);
  const [feedbackDetails, setFeedbackDetails] = useState<any>(null);
  const [likedFeedback, setLikedFeedback] = useState<{ id: string; isLiked: boolean }[]>([]);
  const [reportText, setReportText] = useState('');
  const feedbacksData = useFeedbackDataStore(state => state.data);
  const { isDesktop } = useResponsive();
  const [replyDetails, setReplyDetails] = useState<{ text: string; id: string }[]>([]);
  const { rateSearch, rateSortFilter, rateFilterType, showMore } = useRateFilter(doctor.id, serverId);
  const { isLogin, userInfo } = useUserInfoStore(state => ({
    isLogin: state.isLogin,
    userInfo: state.info,
  }));
  const likeFeedback = useLikeFeedback();
  const replyFeedback = useReplyfeedback();
  const { handleOpenLoginModal } = useLoginModalContext();

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
            name: 'پاسخ دادن',
            action: () => showReportModal(reply.id, reply.description, reply.is_doctor, 'reply'),
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
          name: feedback.user_name,
          id: feedback.id,
          description: feedback.description,
          avatar: feedback.user_image,
          ...(feedback.book_status && { tag: [{ id: 1, name: 'ویزیت شده', isBold: false }] }),
          replyModal: {
            id: feedback.id,
            title: 'نظرات',
            isShow: feedbackReplyModalDetails.find(reply => reply.id === feedback.id)?.isShow ?? false,
            onClose: () =>
              setFeedbackReplyModalDetails(
                feedbackReplyModalDetails.map(reply => (reply.id === feedback.id ? { id: reply.id, isShow: false } : reply)),
              ),
          },
          options: [
            {
              id: 1,
              name: 'گزارش نظر',
              action: () => showReportModal(feedback.id, feedback.description, feedback.is_doctor, 'feedback'),
              type: 'menu',
              inModal: true,
            },
            {
              id: 2,
              name: 'اشتراک نظر',
              action: () => shareCommenthandler(feedback.id),
              type: 'menu',
              inModal: true,
            },
            feedback.reply.length > 1 && {
              id: 3,
              name: 'نمایش نظرات بیماران',
              action: () => setShowReplyModal(feedback.id),
              type: 'controller',
              icon: <PersonseIcon className="w-[1.1rem]" />,
              inModal: false,
            },
            {
              id: 4,
              name: 'پسندیدن',
              action: () => likeFeedbackHandler(feedback.id),
              type: 'button',
              icon: (
                <HeartIcon
                  className={clsx('[&>path]:stroke-black [&>path]:text-white', {
                    '[&>path]:fill-red-600 [&>path]:stroke-red-600': likedFeedback.find(card => card.id === feedback.id)?.isLiked,
                  })}
                />
              ),
              inModal: true,
            },
          ],
          details: compact([feedback?.center_name, feedback.formatted_date]),
          ...(feedback.symptomes?.length && { symptomes: { text: 'علائم بیماری', items: [feedback.symptomes] } }),
          recommend: {
            text: feedback.recommended === '1' ? 'پزشک را توصیه می‌کنم' : 'پزشک را توصیه نمیکنم',
            isRecommend: feedback.recommended === '1',
            icon:
              feedback.recommended === '1' ? (
                <LikeIcon style={{ transform: 'rotateY(180deg)' }} className=" w-5 mb-[0.1rem]" />
              ) : (
                <DislikeIcon className=" w-5 mt-2" />
              ),
          },
          reply: feedback.reply?.map((feedback: any) => {
            const nestedReply = replysStructure(feedback.reply, feedback.user_name);
            return {
              id: feedback.id,
              name: feedback.user_name,
              description: feedback.description,
              avatar: feedback.user_image,
              options: [
                {
                  id: feedback.id,
                  name: 'پاسخ دادن',
                  action: () => showReportModal(feedback.id, feedback.description, feedback.is_doctor, 'reply'),
                  type: 'button',
                  icon: <ReplyIcon />,
                },
              ],
              reply: nestedReply,
            };
          }),
          firstReply: true,
          messageBox: {
            placeholder: 'نظر خود را بنویسید',
            submitText: 'ارسال',
            onChange: (e: any) => setReplies(feedback.id, e.target.value),
            onSubmit: () => submitReplyHandler(feedback.id),
            isLoading: replyFeedback.isLoading,
          },
        },
    );
  }, [feedbacksData, likedFeedback, feedbackReplyModalDetails, replyDetails]);

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
          { label: 'نظرات من', value: 'my_feedbacks' },
          { label: 'بیماران دارای نوبت', value: 'has_nobat' },
          ...centerOption,
        ],
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
  }, []);

  const searchInputParams = useMemo(() => {
    return {
      placeholder: 'جستجوی نام بیماری و ... در نظرات',
      onChange: (e: any) => rateSearch(e.target.value),
      icon: <SearchIcon className="absolute top-3 left-2 cursor-pointer bg-white" />,
      className: 'placeholder:text-sm !text-sm !border-0',
    };
  }, []);

  const setReplies = (id: string, text: string) => {
    replyDetails.some(reply => reply.id === id)
      ? setReplyDetails(replyDetails.map(reply => (reply.id === id ? { text: text, id: id } : reply)))
      : setReplyDetails([...replyDetails, { text: text, id: id }]);
  };

  const setShowReplyModal = (id: string) => {
    feedbackReplyModalDetails.some(feedback => feedback.id === id)
      ? setFeedbackReplyModalDetails(feedbackReplyModalDetails.map(reply => (reply.id === id ? { id: id, isShow: true } : reply)))
      : setFeedbackReplyModalDetails([...feedbackReplyModalDetails, { id: id, isShow: true }]);
  };

  const setLikes = (id: string) => {
    likedFeedback.some(feedback => feedback.id === id)
      ? setLikedFeedback(likedFeedback.map(feedback => (feedback.id === id ? { id: id, isLiked: !feedback.isLiked } : feedback)))
      : setLikedFeedback([{ id: id, isLiked: true }]);
  };

  const showReportModal = (id: string, description: string, isDoctor: boolean, type: 'feedback' | 'reply') => {
    setFeedbackDetails({
      title: type === 'feedback' ? 'گزارش نظر' : 'ثبت پاسخ',
      id: id,
      ...(type === 'feedback' && { description: description }),
      isDoctor: isDoctor,
      type: type,
    });
    setShowModal(true);
  };

  const submitReportFeedbackhandler = async () => {
    if (!isLogin)
      return handleOpenLoginModal({
        state: true,
      });
    if (reportText.length < 10) return toast.error('حداقل مقدار مجاز ۱۰ کاراکتر می باشد.');
    await splunkInstance().sendEvent({
      group: 'report',
      type: 'report-group',
      event: {
        data: {
          report: reportText,
          url: location.href,
          current_comment: feedbackDetails.description,
          comment_id: feedbackDetails.feedbackId,
          terminal_id: getCookie('terminal_id'),
          phone: userInfo.username ?? null,
          is_doctor: feedbackDetails.isDoctor,
        },
      },
    });
    toast.success('نظر شما با موفقیت ثبت شد!');
    setShowModal(false);
  };

  const shareCommenthandler = (id: string) => {
    const url = `${location.href}#comment-${id}`;
    navigator.share({
      text: `اشتراک گذاری نظر`,
      url,
    });
    toast.success('لینک کپی شد.');
  };

  const submitRateDetails = {
    text: 'لطفا نظر خود را وارد کنید',
    buttons: [
      {
        id: 1,
        text: 'ثبت نظر',
        action: () =>
          (location.href = `https://www.paziresh24.com/comment/?doctorName=${doctor.name}&image=${doctor.image}&group_expertises=${doctor.group_expertises}&group_expertises_slug=${doctor.group_expertises_slug}&expertise=${doctor.expertise}&doctor_id=${doctor.id}&server_id=${serverId}&doctor_city=${doctor.city[0]}&doctor_slug=${doctor.slug}`),
      },
    ],
  };

  const likeFeedbackHandler = async (id: string) => {
    setLikes(id);
    await likeFeedback.mutateAsync({
      feedback_id: id,
    });

    if (likeFeedback.status) toast.success('درخواست با موفقیت انجام شد');
  };

  const submitReplyHandler = async (id: string) => {
    if (!isLogin)
      return handleOpenLoginModal({
        state: true,
      });
    const findReply = replyDetails.find((reply: any) => reply.id === id);
    if (!findReply?.text) return toast.error('لطفا متنی را وارد کنید');
    await replyFeedback.mutate({
      description: findReply?.text,
      doctor_id: '540',
      server_id: '1',
      feedback_id: id,
    });
    if (replyFeedback.status) toast.success('نظر شما با موفقیت ثبت شد');
  };
  return (
    <>
      <div className="w-full bg-white">
        <Rate
          details={details}
          filters={rateSearchInputs}
          search={searchInputParams}
          feedbacks={feedbackInfo}
          controller={submitRateDetails}
          isLoading={isLoading}
        />
        <div className="mx-4 my-3">
          {!!feedbackInfo.length && rateDetails.count > feedbackInfo.length && (
            <Button variant="secondary" block className="self-center block outline-none" onClick={showMore}>
              نمایش بیشتر
            </Button>
          )}
        </div>
        <Modal title={feedbackDetails?.title ?? ''} isOpen={showModal} onClose={() => setShowModal(false)}>
          {isDesktop ? (
            <>
              <TextField
                multiLine
                placeholder="لطفا متن خود را وارد کنید"
                onChange={e =>
                  feedbackDetails?.type === 'feedback' ? setReportText(e.target.value) : setReplies(feedbackDetails.id, e.target.value)
                }
                className="h-[10rem]"
              />
              <Button
                onClick={() =>
                  feedbackDetails?.type === 'feedback' ? submitReportFeedbackhandler() : submitReplyHandler(feedbackDetails.id)
                }
                block
                className="mt-4"
              >
                {feedbackDetails?.type === 'feedback' ? 'ثبت درخواست' : 'ثبت پاسخ'}
              </Button>
            </>
          ) : (
            <MessageBox
              onChange={e =>
                feedbackDetails?.type === 'feedback' ? setReportText(e.target.value) : setReplies(feedbackDetails.id, e.target.value)
              }
              placeholder="لطفا متن خود را وارد کنید"
              submitText="ارسال"
              submitHandled={() =>
                feedbackDetails?.type === 'feedback' ? submitReportFeedbackhandler() : submitReplyHandler(feedbackDetails.id)
              }
              onFocus={() => setInputFocus(true)}
              onBlur={() => setInputFocus(false)}
              className={clsx({ '!border-blue-500': inputFocus })}
            />
          )}
        </Modal>
      </div>
    </>
  );
};
export default RateReview;
