import { useEditFeedback } from '@/common/apis/services/rate/edit';
import { useLikeFeedback } from '@/common/apis/services/rate/likeFeedback';
import { useRemoveFeedback } from '@/common/apis/services/rate/remove';
import { useReplyfeedback } from '@/common/apis/services/rate/replyFeedback';
import { useReportFeedback } from '@/common/apis/services/rate/report';
import { useDeletFeedback } from '@/common/apis/services/rate2/delete';
import { useEditComment } from '@/common/apis/services/rate2/edit';
import { useReplyComment } from '@/common/apis/services/rate2/replyComment';
import { useSubmitComment } from '@/common/apis/services/rate2/submit';
import Button from '@/common/components/atom/button/button';
import MessageBox from '@/common/components/atom/messageBox/messageBox';
import Modal from '@/common/components/atom/modal/modal';
import TextField from '@/common/components/atom/textField/textField';
import DislikeIcon from '@/common/components/icons/dislike';
import EditIcon from '@/common/components/icons/edit';
import HeartIcon from '@/common/components/icons/heart';
import InfoIcon from '@/common/components/icons/info';
import LikeIcon from '@/common/components/icons/like';
import ReplyIcon from '@/common/components/icons/reply';
import SearchIcon from '@/common/components/icons/search';
import ShareIcon from '@/common/components/icons/share';
import TrashIcon from '@/common/components/icons/trash';
import useModal from '@/common/hooks/useModal';
import useResponsive from '@/common/hooks/useResponsive';
import { splunkInstance } from '@/common/services/splunk';
import classNames from '@/common/utils/classNames';
import { removeHtmlTagInString } from '@/common/utils/removeHtmlTagInString';
import { useShowPremiumFeatures } from '@/modules/bamdad/hooks/useShowPremiumFeatures';
import { checkPremiumUser } from '@/modules/bamdad/utils/checkPremiumUser';
import Select from '@/modules/booking/components/select/select';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useGetFeedbackData } from '@/modules/profile/hooks/useGetFeedback';
import { useProfileSplunkEvent } from '@/modules/profile/hooks/useProfileEvent';
import { useFeedbackDataStore } from '@/modules/profile/store/feedbackData';
import Details from '@/modules/rate/components/details/details';
import Rate from '@/modules/rate/view/rate';
import { useFeatureValue } from '@growthbook/growthbook-react';
import { getCookie } from 'cookies-next';
import compact from 'lodash/compact';
import config from 'next/config';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useInView } from 'react-intersection-observer';
const DoctorTags = dynamic(() => import('./doctorTags'));
const DoctorTagsFallback = dynamic(() => import('./doctorTagsFallback'), {
  ssr: false,
});
const { publicRuntimeConfig } = config();

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
  userId?: number;
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
  const { doctor, serverId, rateDetails, className, symptomes = [] } = props;
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
  const { isLogin, userInfo } = useUserInfoStore(state => ({
    isLogin: state.isLogin,
    userInfo: state.info,
  }));
  const { handleClose, handleOpen, modalProps } = useModal();
  const { handleOpen: handleOpenReportModal, handleClose: handleCloseReportModal, modalProps: reportModalProps } = useModal();
  const { handleOpen: handleOpenEditModal, handleClose: handleCloseEditModal, modalProps: editModalProps } = useModal();
  const { handleOpen: handleOpenRemoveModal, handleClose: handleCloseRemoveModal, modalProps: removeModalProps } = useModal();
  const { handleOpen: handleOpenSubmitModal, handleClose: handleCloseSubmitModal, modalProps: SubmitModalProps } = useModal();
  const [feedbackReplyModalDetails, setFeedbackReplyModalDetails] = useState<{ id: string; isShow: boolean }[]>([]);
  const [feedbackDetails, setFeedbackDetails] = useState<any>(null);
  const feedbacksData = useFeedbackDataStore(state => state.data);
  const { isDesktop } = useResponsive();
  const [replyDetails, setReplyDetails] = useState<{ text: string; id: string }[]>([]);
  const [rateRef, inViewRate] = useInView();
  const sendRateTriggered = useRef(false);
  useEffect(() => {
    if (inViewRate && !sendRateTriggered.current) {
      sendRateTriggered.current = true;
      return rateSplunkEvent('scroll To doctor feedbacks box');
    }
  }, [inViewRate]);
  const router = useRouter();
  const likeFeedback = useLikeFeedback();
  const replyFeedback = useReplyfeedback();
  const replyComment = useReplyComment();
  const { handleOpenLoginModal } = useLoginModalContext();
  const replyText = useRef<HTMLInputElement>();
  const editText = useRef<HTMLInputElement>();
  const commentText = useRef<HTMLInputElement>();
  const reportText = useRef<HTMLInputElement>();
  const reportFeedback = useReportFeedback();
  const removeComment = useRemoveFeedback();
  const deleteComment = useDeletFeedback();
  const submitComment = useSubmitComment();
  const editComment = useEditComment();
  const editFeedback = useEditFeedback();
  const isShowPremiumFeatures = useShowPremiumFeatures();
  const options = useFeatureValue('rate-review.options', { card: ['REACTION', 'REPORT'], dropdown: ['SHARE'] });
  const specialDoctor = useFeatureValue<any>('profile:feedback_api', { slug: [] });

  const isShowOption = (key: string) => {
    return (options?.card as string[])?.includes?.(key) || (options?.dropdown as string[])?.includes?.(key);
  };

  const isSpecialDoctor = specialDoctor?.slug?.includes(router.query.slug);

  const whereShowOption = (key: string) => {
    if (!isShowOption(key)) return null;
    return (options?.card as string[])?.includes?.(key) ? 'card' : 'dropdown';
  };

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

  const doctorSuggestionButton = [
    {
      id: 1,
      text: 'توصیه میکنم',
      value: '1',
    },
    {
      id: 2,
      text: 'توصیه نمیکنم',
      value: '0',
    },
  ];

  const feedbackInfo = useMemo(() => {
    return feedbacksData?.map(
      (feedback: any) =>
        feedback && {
          type: 'parent',
          name: feedback.user_name ?? feedback.name,
          id: feedback.id,
          description: feedback.description,
          avatar: feedback.user_image,
          external: feedback?.external_score,
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
          options: {
            items: [
              isShowOption('REACTION') && {
                id: 4,
                name: 'پسندیدن',
                action: () => likeFeedbackHandler(feedback.id),
                type: whereShowOption('REACTION'),
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
              isShowOption('SHARE') && {
                id: 2,
                name: 'اشتراک گذاری',
                action: () => shareCommenthandler(feedback.id),
                type: whereShowOption('SHARE'),
                icon: <ShareIcon width={22} height={22} />,
                inModal: true,
              },
              isShowOption('REPORT') && {
                id: 1,
                name: 'گزارش',
                action: () => showReportModal(feedback.id, feedback.description, feedback.is_doctor),
                type: whereShowOption('REPORT'),
                icon: <InfoIcon width={22} height={22} />,
                inModal: true,
              },
              userInfo?.id?.toString() === feedback?.user_id &&
                isShowOption('EDIT') && {
                  id: 5,
                  name: 'ویرایش',
                  action: () => showEditComment(feedback.id, feedback.description, feedback.recommended),
                  type: whereShowOption('EDIT'),
                  icon: <EditIcon width={22} height={22} />,
                  inModal: true,
                },
              userInfo?.id?.toString() === feedback?.user_id &&
                isShowOption('DELETE') && {
                  id: 6,
                  name: 'حذف',
                  action: () => showRemoveModal(feedback.id),
                  type: whereShowOption('DELETE'),
                  icon: <TrashIcon width={22} height={22} />,
                  inModal: true,
                },
            ],
          },
          details: compact([feedback.formatted_date, feedback?.center_name]),
          ...(feedback.feedback_symptomes?.length && {
            symptomes: { text: 'علت مراجعه', items: feedback.feedback_symptomes.map((symptom: any) => symptom.symptomes) },
          }),
          recommend: feedback.recommended && {
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
  }, [feedbacksData, feedbackReplyModalDetails, replyDetails, userInfo]);

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
  const showRemoveModal = (id: string) => {
    setFeedbackDetails({
      id,
    });
    handleOpenRemoveModal();
  };
  const showEditComment = (id: string, description: string, like: string) => {
    setFeedbackDetails({
      id,
      description: removeHtmlTagInString(description ?? ''),
      like,
    });
    handleOpenEditModal();
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
          phone: userInfo.cell ?? null,
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
          isSpecialDoctor
            ? handleOpenSubmitModal()
            : (location.href = `${publicRuntimeConfig.CLINIC_BASE_URL}/comment/?doctorName=${doctor.name}&image=${doctor.image}&group_expertises=${doctor.group_expertises}&group_expertises_slug=${doctor.group_expertises_slug}&expertise=${doctor.expertise}&doctor_id=${doctor.id}&server_id=${serverId}&doctor_city=${doctor.city[0]}&doctor_slug=${doctor.slug}`);
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
    if (isSpecialDoctor) {
      await replyComment.mutate({
        description: text,
        feedback_id: id,
        user_id: userInfo.id,
      });
    } else {
      await replyFeedback.mutate({
        description: text,
        doctor_id: doctor.id,
        server_id: serverId,
        feedback_id: id,
      });
    }
    handleClose();
    if (replyFeedback.status) toast.success('نظر شما ثبت گردید و پس از تایید، نمایش داده خواهد شد.');
    feedbacksData[0]?.reply?.[0].id === id ? rateSplunkEvent('send reply first reply box') : rateSplunkEvent('send reply or comment');
  };

  const removeCommentHandler = async () => {
    try {
      if (isSpecialDoctor) {
        await deleteComment.mutateAsync({
          feedback_id: feedbackDetails?.id,
          user_id: userInfo && userInfo.id,
        });
      } else {
        await removeComment.mutateAsync({
          feedback_id: feedbackDetails?.id,
        });
      }
      toast.success('درخواست شما با موفقیت انجام شد. نظر شما، پس از گذشت 24 ساعت حذف خواهد شد.', {
        duration: 3000,
      });
      rateSplunkEvent('remove comment');
      handleCloseRemoveModal();
      return;
    } catch (error) {
      return toast.error('مشکلی به وجود آمده است، لطفا از حساب خود خارج شده و مجدد تلاش کنید');
    }
  };

  const editCommentHandler = async (description: string) => {
    try {
      if (isSpecialDoctor) {
        await editComment.mutateAsync({
          feedback_id: feedbackDetails?.id,
          description,
          user_id: userInfo && userInfo.id,
        });
      } else {
        await editFeedback.mutateAsync({
          feedback_id: feedbackDetails?.id,
          description,
          like: feedbackDetails?.like,
        });
      }
      toast.success('نظر شما پس از بررسی و با استناد به قوانین پذیرش24 ویرایش خواهد شد.', {
        duration: 3000,
      });
      rateSplunkEvent('edit comment');
      handleCloseEditModal();
      return;
    } catch (error) {
      return toast.error('مشکلی به وجود آمده است، لطفا از حساب خود خارج شده و مجدد تلاش کنید');
    }
  };

  const submitCommentHandler = async (description: string) => {
    try {
      await submitComment.mutateAsync({ external_id: `doctor_${doctor.id}_1`, description, user_id: userInfo.id });
      toast.success('نظر شما با موفقیت ثبت شد');
      handleCloseSubmitModal();
      return;
    } catch (error) {
      return toast.error('مشکلی به وجود آمده است، لطفا از حساب خود خارج شده و مجدد تلاش کنید');
    }
  };

  return (
    <div ref={rateRef} className="flex flex-col space-y-2 md:rounded-lg md:overflow-hidden md:space-y-1">
      {!!details.count && !message && (
        <div className="w-full p-4 bg-white">
          <div className="space-y-3">
            <Details
              satisfaction={details.satisfaction}
              count={details.count}
              count_text={details.count_text}
              title={details.title}
              information={details.information}
            />
          </div>
        </div>
      )}

      {isShowPremiumFeatures && checkPremiumUser(userInfo.vip) && (
        <DoctorTags symptomes={symptomes} doctorId={doctor.id} serverId={doctor.server_id} />
      )}
      {isShowPremiumFeatures && !checkPremiumUser(userInfo.vip) && <DoctorTagsFallback />}
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
      <Modal title="ویرایش نظر" {...editModalProps}>
        <span className="text-[0.8rem] font-medium !mb-3 !-mt-1 !mr-1 block"> آیا این پزشک را به دیگران پیشنهاد میدهید؟</span>
        <div className="flex space-s-2">
          {doctorSuggestionButton.map((item: any) => (
            <Select
              key={item.id}
              onSelect={() => setFeedbackDetails({ ...feedbackDetails, like: item.value })}
              selected={feedbackDetails?.like === item?.value}
              title={item.text}
              className="w-full"
              titleClassName="!font-medium !text-[0.8rem]"
            />
          ))}
        </div>
        <span className="text-[0.8rem] font-medium !mb-2 !mt-3 !mr-1 block">شما میتوانید در این قسمت نظر خود را ویرایش کنید.</span>
        <TextField multiLine className="h-[10rem]" defaultValue={feedbackDetails?.description} ref={editText} />
        <Button
          loading={editFeedback.isLoading || editComment.isLoading}
          onClick={() => editCommentHandler(editText.current?.value!)}
          block
          className="mt-4"
        >
          ویرایش نظر
        </Button>
      </Modal>
      <Modal title="آیا از حذف نظر خود مطمئن هستید؟" {...removeModalProps}>
        <div className="flex justify-between space-s-2">
          <Button loading={removeComment.isLoading || deleteComment.isLoading} onClick={removeCommentHandler} block theme="error">
            حذف
          </Button>
          <Button onClick={handleCloseRemoveModal} block variant="secondary" theme="error">
            انصراف
          </Button>
        </div>
      </Modal>
      <Modal title="ثبت نظر" {...SubmitModalProps}>
        <div>
          <TextField multiLine className="h-[10rem]" ref={commentText} />
          <Button
            loading={submitComment.isLoading}
            onClick={() => submitCommentHandler(commentText.current?.value!)}
            block
            className="mt-4"
          >
            ثبت نظر
          </Button>
        </div>
      </Modal>
    </div>
  );
};
export default RateReview;
