import { useLikeFeedback } from '@/common/apis/services/rate/likeFeedback';
import { useReplyfeedback } from '@/common/apis/services/rate/replyFeedback';
import { useReportFeedback } from '@/common/apis/services/rate/report';
import { useGetDoctorTags } from '@/common/apis/services/rate/tags';
import Button from '@/common/components/atom/button/button';
import Chips from '@/common/components/atom/chips/chips';
import MessageBox from '@/common/components/atom/messageBox/messageBox';
import Modal from '@/common/components/atom/modal/modal';
import Text from '@/common/components/atom/text/text';
import TextField from '@/common/components/atom/textField/textField';
import DiamondIcon from '@/common/components/icons/diamond';
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
import Details from '@/modules/rate/components/details/details';
import Rate from '@/modules/rate/view/rate';
import { getCookie } from 'cookies-next';
import compact from 'lodash/compact';
import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useInView } from 'react-intersection-observer';

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
    server_id: string;
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
  symptomes?: string[];
  className?: string;
}

export const RateReview = (props: RateReviewProps) => {
  const { doctor, serverId, rateDetails, className, symptomes } = props;
  const getDoctorTags = useGetDoctorTags();
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
  const { handleOpen: handleOpenReportModal, handleClose: handleCloseReportModal, modalProps: reportModalProps } = useModal();
  const [feedbackReplyModalDetails, setFeedbackReplyModalDetails] = useState<{ id: string; isShow: boolean }[]>([]);
  const [feedbackDetails, setFeedbackDetails] = useState<any>(null);
  const feedbacksData = useFeedbackDataStore(state => state.data);
  const { isDesktop } = useResponsive();
  const [replyDetails, setReplyDetails] = useState<{ text: string; id: string }[]>([]);
  const { isLogin, userInfo } = useUserInfoStore(state => ({
    isLogin: state.isLogin,
    userInfo: state.info,
  }));
  const [rateRef, inViewRate] = useInView();
  const sendRateTriggered = useRef(false);
  useEffect(() => {
    if (inViewRate && !sendRateTriggered.current) {
      sendRateTriggered.current = true;
      return rateSplunkEvent('scroll To doctor feedbacks box');
    }
  }, [inViewRate]);
  const likeFeedback = useLikeFeedback();
  const replyFeedback = useReplyfeedback();
  const { handleOpenLoginModal } = useLoginModalContext();
  const replyText = useRef<HTMLInputElement>();
  const reportText = useRef<HTMLInputElement>();
  const reportFeedback = useReportFeedback();

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
    splunkInstance().sendEvent({
      group: 'report',
      type: 'report-group',
      event: {
        data: {
          report: text,
          url: location.href,
          current_comment: feedbackDetails.description,
          comment_id: feedbackDetails.id,
          terminal_id: getCookie('terminal_id'),
          phone: userInfo.username ?? null,
          is_doctor: feedbackDetails.isDoctor,
        },
      },
    });

    await reportFeedback.mutateAsync({
      feedback_id: feedbackDetails.id,
    });

    toast.success('نظر شما ثبت گردید و پس از تایید، نمایش خواهد داده شد.');
    handleCloseReportModal();
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
    if (!isLogin)
      return handleOpenLoginModal({
        state: true,
      });
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
      doctor_id: doctor.id,
      server_id: serverId,
      feedback_id: id,
    });
    handleClose();
    if (replyFeedback.status) toast.success('نظر شما ثبت گردید و پس از تایید، نمایش خواهد داده شد.');
    feedbacksData[0]?.reply?.[0].id === id ? rateSplunkEvent('send reply first reply box') : rateSplunkEvent('send reply or comment');
  };

  useEffect(() => {
    getDoctorTags.mutate({
      doctor_id: doctor.id,
      server_id: doctor.server_id,
    });
  }, []);

  return (
    <div className="flex flex-col space-y-2 md:rounded-lg md:overflow-hidden md:space-y-1">
      <div ref={rateRef} className="w-full p-4 bg-white">
        {!!details.count && (
          <div className="space-y-3">
            <Details
              satisfaction={details.satisfaction}
              count={details.count}
              count_text={details.count_text}
              title={details.title}
              information={details.information}
            />
          </div>
        )}
      </div>
      <div ref={rateRef} className="flex flex-col w-full p-4 space-y-4 bg-white/80">
        <div className="flex flex-col w-full space-y-3">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-s-1">
              <DiamondIcon className="text-amber-500" />
              <Text fontWeight="bold">خلاصه نظرات کاربران</Text>
            </div>
            <Text fontSize="sm" className="opacity-75">
              خلاصه نظرات کاربران توسط هوش مصنوعی تولید گردیده است.
            </Text>
          </div>
          <div className="flex flex-col w-full space-y-3 md:flex-row md:space-y-0 md:space-s-3">
            <div className="flex flex-col w-full p-4 space-y-3 bg-white border rounded-lg shadow-lg shadow-slate-400/20 border-slate-100">
              <div className="flex items-center space-s-1">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16ZM8 14.6667C11.6819 14.6667 14.6667 11.6819 14.6667 8C14.6667 4.3181 11.6819 1.33333 8 1.33333C4.3181 1.33333 1.33333 4.3181 1.33333 8C1.33333 11.6819 4.3181 14.6667 8 14.6667ZM4.03421 10.2108C3.91778 9.86153 4.10655 9.484 4.45585 9.36753C4.80515 9.25113 5.18269 9.43987 5.29912 9.7892C5.35226 9.9486 5.51166 10.2355 5.80474 10.5286C6.30672 11.0306 7.01313 11.3333 8 11.3333C8.98687 11.3333 9.69327 11.0306 10.1953 10.5286C10.4883 10.2355 10.6477 9.9486 10.7009 9.7892C10.8173 9.43987 11.1949 9.25113 11.5441 9.36753C11.8935 9.484 12.0822 9.86153 11.9658 10.2108C11.8523 10.5514 11.595 11.0145 11.1381 11.4714C10.3901 12.2194 9.34647 12.6667 8 12.6667C6.65351 12.6667 5.60995 12.2194 4.86193 11.4714C4.40501 11.0145 4.14774 10.5514 4.03421 10.2108ZM5.03647 6.5547C4.73011 6.75893 4.3162 6.67613 4.11197 6.3698C3.90773 6.06345 3.99051 5.64953 4.29687 5.4453L4.55727 5.2717C5.22907 4.82383 6.10427 4.82383 6.77607 5.2717L7.03647 5.4453C7.3428 5.64953 7.4256 6.06345 7.2214 6.3698C7.01713 6.67613 6.60322 6.75893 6.29687 6.5547L6.03647 6.3811C5.81253 6.23181 5.5208 6.23181 5.29687 6.3811L5.03647 6.5547ZM9.70313 6.5547C9.3968 6.75893 8.98287 6.67613 8.7786 6.3698C8.5744 6.06345 8.6572 5.64953 8.96353 5.4453L9.22393 5.2717C9.89573 4.82383 10.7709 4.82383 11.4427 5.2717L11.7031 5.4453C12.0095 5.64953 12.0923 6.06345 11.8881 6.3698C11.6838 6.67613 11.2699 6.75893 10.9635 6.5547L10.7031 6.3811C10.4792 6.23181 10.1875 6.23181 9.96353 6.3811L9.70313 6.5547Z"
                    fill="#0BB07B"
                  />
                </svg>
                <Text fontSize="sm" fontWeight="medium">
                  صفات برجسته پزشک از دیدگاه بیماران
                </Text>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {getDoctorTags.data?.data?.positive_tags?.map?.((tag: string) => (
                  <Chips className="py-1 border !whitespace-normal text-emerald-500 border-emerald-500/20 bg-emerald-300/5" key={tag}>
                    <Text className="line-clamp-1">{tag}</Text>
                  </Chips>
                ))}
              </div>
            </div>
            <div className="flex flex-col w-full p-4 space-y-3 bg-white border border-red-100 rounded-lg shadow-lg shadow-slate-400/20">
              <div className="flex items-center space-s-1">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8 1.45455C4.38505 1.45455 1.45455 4.38505 1.45455 8C1.45455 11.615 4.38505 14.5455 8 14.5455C11.615 14.5455 14.5455 11.615 14.5455 8C14.5455 4.38505 11.615 1.45455 8 1.45455ZM0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8Z"
                    fill="#D11010"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8.00003 10.9279C7.48028 10.9279 6.96958 10.9919 6.5194 11.1134L6.51938 11.1134C6.06922 11.2349 5.69543 11.4097 5.43556 11.6201C5.1265 11.8704 4.65896 11.839 4.39129 11.5501C4.12362 11.2611 4.15716 10.8239 4.46622 10.5736C4.93579 10.1934 5.52318 9.94131 6.10879 9.78328M6.10881 9.78327C6.70609 9.62208 7.35632 9.54348 8.00003 9.54348C8.64375 9.54348 9.29399 9.62208 9.89129 9.78327L9.8913 9.78328C10.4769 9.94131 11.0643 10.1934 11.5339 10.5736C11.8429 10.8239 11.8765 11.261 11.6088 11.55C11.3411 11.839 10.8736 11.8704 10.5646 11.6201C10.3046 11.4097 9.93083 11.2349 9.48071 11.1134C9.03048 10.9919 8.51977 10.9279 8.00003 10.9279"
                    fill="#D11010"
                  />
                  <path
                    d="M5.75455 7.57904C6.29715 7.57904 6.73701 7.13918 6.73701 6.59659C6.73701 6.05399 6.29715 5.61413 5.75455 5.61413C5.21196 5.61413 4.77209 6.05399 4.77209 6.59659C4.77209 7.13918 5.21196 7.57904 5.75455 7.57904Z"
                    fill="#D11010"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M5.8949 5.94162C5.4815 5.94162 5.14636 6.23486 5.14636 6.59659C5.14636 6.95832 5.4815 7.25156 5.8949 7.25156C6.30831 7.25156 6.64344 6.95832 6.64344 6.59659C6.64344 6.23486 6.30831 5.94162 5.8949 5.94162ZM4.77209 6.59659C4.77209 6.05399 5.27479 5.61413 5.8949 5.61413C6.51501 5.61413 7.01771 6.05399 7.01771 6.59659C7.01771 7.13918 6.51501 7.57904 5.8949 7.57904C5.27479 7.57904 4.77209 7.13918 4.77209 6.59659Z"
                    fill="#D11010"
                  />
                  <path
                    d="M10.2458 7.57904C10.7884 7.57904 11.2282 7.13918 11.2282 6.59659C11.2282 6.05399 10.7884 5.61413 10.2458 5.61413C9.70317 5.61413 9.26331 6.05399 9.26331 6.59659C9.26331 7.13918 9.70317 7.57904 10.2458 7.57904Z"
                    fill="#D11010"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M10.1051 5.94162C9.6917 5.94162 9.35657 6.23486 9.35657 6.59659C9.35657 6.95832 9.6917 7.25156 10.1051 7.25156C10.5185 7.25156 10.8536 6.95832 10.8536 6.59659C10.8536 6.23486 10.5185 5.94162 10.1051 5.94162ZM8.9823 6.59659C8.9823 6.05399 9.485 5.61413 10.1051 5.61413C10.7252 5.61413 11.2279 6.05399 11.2279 6.59659C11.2279 7.13918 10.7252 7.57904 10.1051 7.57904C9.485 7.57904 8.9823 7.13918 8.9823 6.59659Z"
                    fill="#D11010"
                  />
                </svg>
                <Text fontSize="sm" fontWeight="medium">
                  موارد قابل توجه از دیدگاه بیماران
                </Text>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {getDoctorTags.data?.data?.negative_tags?.map?.((tag: string) => (
                  <Chips className="py-1 !whitespace-normal text-red-500 border border-red-500/20 bg-red-300/5" key={tag}>
                    <Text className="line-clamp-1">{tag}</Text>
                  </Chips>
                ))}
              </div>
            </div>
          </div>
        </div>
        {symptomes?.length > 0 && (
          <div className="flex flex-col w-full space-y-3">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center space-s-1">
                <DiamondIcon className="text-amber-500" />
                <Text fontWeight="bold">دلایل مراجعه سایر بیماران به پزشک</Text>
              </div>
              <Text fontSize="sm" className="opacity-75">
                سایر بیماران به دلایل زیر به این پزشک مراجعه کرده اند.
              </Text>
            </div>
            <div className="grid grid-cols-2 gap-2 p-4 bg-white border rounded-lg shadow-lg shadow-slate-400/20 border-slate-100">
              {symptomes?.map?.(symptom => (
                <Chips className="py-1 !whitespace-normal border border-primary/20 bg-primary/5 text-primary" key={symptom}>
                  <Text className="line-clamp-1">{symptom}</Text>
                </Chips>
              ))}
            </div>
          </div>
        )}
      </div>
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
      </div>
      <Modal title="گزارش نظر" {...reportModalProps}>
        <TextField
          multiLine
          placeholder="لطفا علت و شرح گزارش نظر این کاربر را اعلام کنید تا تیم پشتیبانی پذیرش24 بر اساس پیشنهاد شما، نظر کاربر را مجددا بررسی نماید."
          className="h-[10rem]"
          ref={reportText}
        />
        <Button
          loading={reportFeedback.isLoading}
          onClick={() => submitReportFeedbackhandler(reportText.current?.value!)}
          block
          className="mt-4"
        >
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
  );
};
export default RateReview;
