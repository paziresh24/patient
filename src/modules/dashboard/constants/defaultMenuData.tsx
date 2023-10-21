import BookmarkIcon from '@/common/components/icons/bookmark';
import CalenderIcon from '@/common/components/icons/calender';
import ShopIcon from '@/common/components/icons/shop';
import UserEditIcon from '@/common/components/icons/userEdit';
import UsersIcon from '@/common/components/icons/users';

export const defaultMenuData = [
  {
    icon: <UserEditIcon />,
    label: 'ویرایش پروفایل',
    url: '/dashboard/profile',
    shouldShowDoctor: true,
  },
  {
    icon: <ShopIcon />,
    label: 'بازارچه',
    url: '/dashboard/bazaar',
    shouldShowDoctor: true,
  },
  {
    icon: <CalenderIcon />,
    label: 'نوبت های من',
    url: '/dashboard/appointments',
    shouldShowDoctor: true,
  },
  {
    icon: <BookmarkIcon />,
    label: 'لیست پزشکان من',
    url: '/dashboard/bookmarks',
    shouldShowDoctor: true,
  },
  {
    icon: <UsersIcon />,
    label: 'کاربران زیرمجموعه',
    url: '/dashboard/subuser',
    shouldShowDoctor: true,
  },
];
