import useShare from '@/common/hooks/useShare';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import config from 'next/config';
import { useRouter } from 'next/router';
import { ToolBarItems } from '../components/head/toolBar';
import { useBookmarkController } from './useBookmarkController';
const { publicRuntimeConfig } = config();

interface useToolBarControllerProps {
  slug: string;
  displayName: string;
  documentTitle: string;
}

export const useToolBarController = ({ slug, displayName, documentTitle }: useToolBarControllerProps) => {
  const router = useRouter();
  const bookmarkController = useBookmarkController({ slug });
  const share = useShare();
  const isLogin = useUserInfoStore(state => state.isLogin);
  const { handleOpenLoginModal } = useLoginModalContext();

  const toolBarItems: ToolBarItems = [
    {
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
    {
      type: 'edit',
      action: () => {
        router.push(`/patient/contribute?slug=${slug}`);
      },
    },
  ];

  return toolBarItems;
};
