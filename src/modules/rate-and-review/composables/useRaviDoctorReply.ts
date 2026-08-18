import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { trackRaviReviewEvent } from '../analytics/trackRaviReviewEvent';
import { deleteFeedbackReply, editFeedbackReply, submitFeedbackReply } from '../api';
import { FEEDBACK_REPLY_KEY, useFeedbackReply } from './useFeedbackReply';

const invalidateReplyQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  doctorSlug: string,
  feedbackId: string,
) => {
  void queryClient.invalidateQueries({ queryKey: FEEDBACK_REPLY_KEY(doctorSlug, feedbackId) });
  void queryClient.invalidateQueries({ queryKey: ['doctorHome', 'answeredFeedbackIds', doctorSlug] });
};

interface UseRaviDoctorReplyParams {
  feedbackId: string;
  doctorSlug?: string;
  doctorUserId?: string;
}

export const useRaviDoctorReply = ({ feedbackId, doctorSlug, doctorUserId }: UseRaviDoctorReplyParams) => {
  const queryClient = useQueryClient();
  const currentUserId = useUserInfoStore(state => state.info?.id);
  const isDoctor =
    doctorUserId != null &&
    currentUserId != null &&
    String(currentUserId) === String(doctorUserId);

  const { data: reply, isLoading } = useFeedbackReply(doctorSlug, feedbackId);
  const [draft, setDraft] = useState('');
  const [showForm, setShowForm] = useState(false);

  const submitMutation = useMutation(submitFeedbackReply);
  const editMutation = useMutation(editFeedbackReply);
  const deleteMutation = useMutation(deleteFeedbackReply);

  useEffect(() => {
    setDraft(reply?.description ?? '');
  }, [reply?.description]);

  const busy = submitMutation.isLoading || editMutation.isLoading || deleteMutation.isLoading;
  const isEditing = Boolean(reply);

  const openForm = () => {
    setDraft(reply?.description ?? '');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setDraft(reply?.description ?? '');
  };

  const handleSubmit = async () => {
    if (!doctorSlug) return;
    const text = draft.trim();
    if (!text) {
      toast.error('لطفا متنی را وارد کنید');
      return;
    }

    try {
      if (reply) {
        await editMutation.mutateAsync({ replyId: reply.id, description: text });
        toast.success('پاسخ شما ویرایش شد.');
      } else {
        await submitMutation.mutateAsync({
          feedbackId,
          description: text,
          doctorId: doctorUserId,
        });
        toast.success('پاسخ شما ثبت شد.');
      }
      setShowForm(false);
      invalidateReplyQueries(queryClient, doctorSlug, feedbackId);
      void trackRaviReviewEvent({
        event_type: 'review_reply_submit',
        slug: doctorSlug,
        feedback_id: feedbackId,
        doctor_id: doctorUserId,
        ok: true,
      });
    } catch {
      toast.error(reply ? 'ویرایش پاسخ ناموفق بود.' : 'ثبت پاسخ ناموفق بود.');
    }
  };

  const handleDelete = async () => {
    if (!reply || !doctorSlug) return;
    try {
      await deleteMutation.mutateAsync(reply.id);
      setDraft('');
      setShowForm(false);
      invalidateReplyQueries(queryClient, doctorSlug, feedbackId);
      toast.success('پاسخ حذف شد.');
    } catch {
      toast.error('حذف پاسخ ناموفق بود.');
    }
  };

  const showReplyButton = isDoctor && !!doctorSlug && !isLoading && !reply && !showForm;
  // Existing replies are public; compose/edit form is doctor-only.
  const showPanel = !!doctorSlug && (Boolean(reply) || (isDoctor && showForm));

  return {
    isDoctor,
    isLoading,
    reply,
    showForm,
    draft,
    setDraft,
    openForm,
    closeForm,
    handleSubmit,
    handleDelete,
    busy,
    isEditing,
    showReplyButton,
    showPanel,
    doctorUserId,
  };
};
