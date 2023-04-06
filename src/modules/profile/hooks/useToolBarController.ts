import useCustomize from '@/common/hooks/useCustomize';
import useShare from '@/common/hooks/useShare';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import config from 'next/config';
import { useRouter } from 'next/router';
import { useBookmarkController } from './useBookmarkController';
const { publicRuntimeConfig } = config();

interface useToolBarControllerProps {
  slug: string;
  displayName: string;
  documentTitle: string;
  editable?: boolean;
}

export const useToolBarController = ({ slug, displayName, documentTitle, editable }: useToolBarControllerProps) => {
  const router = useRouter();
  const bookmarkController = useBookmarkController({ slug });
  const share = useShare();
  const isLogin = useUserInfoStore(state => state.isLogin);
  const { handleOpenLoginModal } = useLoginModalContext();
  const { customize } = useCustomize();

  const toolBarItems = [
    customize.bookMark && {
      type: 'bookmark',
      action: () => {
        if (!isLogin)
          return handleOpenLoginModal({
            state: true,
            title: 'برای ذخیره پزشک ابتدا باید وارد شوید.',
          });

        bookmarkController.toggleBookMark();
      },
      isBookmarked: bookmarkController.isBookmark,
    },
    {
      type: 'share',
      action: () => {
        const url = `${publicRuntimeConfig.CLINIC_BASE_URL}/${slug}?utm_source=doctorprofile-share-button&utm_medium=doctorprofile&utm_campaign=doctorprofile`;
        share({
          title: documentTitle,
          text: `${displayName} در پذیرش۲۴`,
          url,
        });
      },
    },
    customize.showContribute &&
      !editable && {
        type: 'edit',
        action: () => {
          router.push(`/patient/contribute?slug=${slug}`);
        },
      },
  ].filter(Boolean);

  return toolBarItems;
};
