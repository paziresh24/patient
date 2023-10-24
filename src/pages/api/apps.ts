import { getServerSideGrowthBookContext } from '@/common/helper/getServerSideGrowthBookContext';
import { GrowthBook } from '@growthbook/growthbook-react';
import type { NextApiRequest, NextApiResponse } from 'next';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' });
  const growthbookContext = getServerSideGrowthBookContext(req as NextApiRequest);
  const growthbook = new GrowthBook(growthbookContext);
  await growthbook.loadFeatures({ timeout: 1000 });

  const showBazaarMenu = growthbook.getFeatureValue('dashboard:show-bazaar-menu|user-list', { ids: [''] });

  const DRAPP_BASE_URL = publicRuntimeConfig.DOCTOR_APP_BASE_URL;

  if (req.query.is_doctor === 'true' && showBazaarMenu.ids.includes(req.query.user_id as string)) {
    return res.status(200).json([
      [
        {
          key: '@drapp/profile',
          name: 'ویرایش پروفایل',
          icon: '/logos/apps/user.svg',
          source: `${DRAPP_BASE_URL}/profile`,
        },
        {
          key: '@drapp/bookings',
          name: 'مراجعین من',
          icon: '/logos/apps/bookings.svg',
          source: `${DRAPP_BASE_URL}`,
        },
        {
          key: '@drapp/forough',
          name: 'رتبه من در پذیرش24',
          icon: '/logos/apps/forough.svg',
          source: `${DRAPP_BASE_URL}/forough`,
        },
        {
          key: '@drapp/prescription',
          name: 'نسخه نویسی',
          icon: '/logos/apps/prescription.svg',
          sub: [
            {
              key: '@drapp/prescription/list',
              name: 'نسخه های ثبت شده',
              source: `${DRAPP_BASE_URL}/prescription`,
            },
            {
              key: '@drapp/prescription/providers',
              name: 'بیمه های من',
              source: `${DRAPP_BASE_URL}/providers`,
            },
            {
              key: '@drapp/prescription/templates',
              name: 'نسخه های  پر استفاده',
              source: `${DRAPP_BASE_URL}/favorite/templates`,
            },
            {
              key: '@drapp/prescription/services',
              name: 'اقلام پر استفاده',
              source: `${DRAPP_BASE_URL}/favorite/service`,
            },
          ],
        },
        {
          key: '@drapp/reviews',
          name: 'نظرات بیماران',
          icon: '/logos/apps/reviews.svg',
          source: `${DRAPP_BASE_URL}/feedbacks`,
        },
        {
          key: '@drapp/setting',
          name: 'تنظیمات نوبت دهی',
          icon: '/logos/apps/setting.svg',
          source: `${DRAPP_BASE_URL}/setting`,
        },
        {
          key: '@drapp/payment',
          name: 'پرداخت',
          icon: '/logos/apps/wallet.svg',
          source: `${DRAPP_BASE_URL}/setting/payment`,
        },
      ],
      [
        {
          key: '@paziresh24/bazaar',
          name: 'بازارچه',
          icon: '/logos/apps/appointments.svg',
          source: 'https://bazaar.paziresh24.com/',
        },
        {
          key: '@paziresh24/appointments',
          name: 'نوبت های من',
          icon: '/logos/apps/appointments.svg',
          source: 'paziresh24://appointments',
        },
        {
          key: '@paziresh24/bookmarks',
          name: 'لیست پزشکان من',
          icon: '/logos/apps/bookmarks.svg',
          source: 'paziresh24://bookmarks',
        },
        {
          key: '@paziresh24/subuser',
          name: 'کاربران زیرمجموعه',
          icon: '/logos/apps/subuser.svg',
          source: 'paziresh24://subuser',
        },
      ],
    ]);
  }

  if (req.query.is_doctor === 'true')
    return res.status(200).json([
      [
        {
          key: '@drapp/profile',
          name: 'ویرایش پروفایل',
          icon: '/logos/apps/user.svg',
          source: `${DRAPP_BASE_URL}/profile`,
        },
        {
          key: '@drapp/bookings',
          name: 'مراجعین من',
          icon: '/logos/apps/bookings.svg',
          source: `${DRAPP_BASE_URL}`,
        },
        {
          key: '@drapp/forough',
          name: 'رتبه من در پذیرش24',
          icon: '/logos/apps/forough.svg',
          source: `${DRAPP_BASE_URL}/forough`,
        },
        {
          key: '@drapp/prescription',
          name: 'نسخه نویسی',
          icon: '/logos/apps/prescription.svg',
          sub: [
            {
              key: '@drapp/prescription/list',
              name: 'نسخه های ثبت شده',
              source: `${DRAPP_BASE_URL}/prescription`,
            },
            {
              key: '@drapp/prescription/providers',
              name: 'بیمه های من',
              source: `${DRAPP_BASE_URL}/providers`,
            },
            {
              key: '@drapp/prescription/templates',
              name: 'نسخه های  پر استفاده',
              source: `${DRAPP_BASE_URL}/favorite/templates`,
            },
            {
              key: '@drapp/prescription/services',
              name: 'اقلام پر استفاده',
              source: `${DRAPP_BASE_URL}/favorite/service`,
            },
          ],
        },
        {
          key: '@drapp/reviews',
          name: 'نظرات بیماران',
          icon: '/logos/apps/reviews.svg',
          source: `${DRAPP_BASE_URL}/feedbacks`,
        },
        {
          key: '@drapp/setting',
          name: 'تنظیمات نوبت دهی',
          icon: '/logos/apps/setting.svg',
          source: `${DRAPP_BASE_URL}/setting`,
        },
        {
          key: '@drapp/payment',
          name: 'پرداخت',
          icon: '/logos/apps/wallet.svg',
          source: `${DRAPP_BASE_URL}/setting/payment`,
        },
      ],
      [
        {
          key: '@paziresh24/appointments',
          name: 'نوبت های من',
          icon: '/logos/apps/appointments.svg',
          source: 'paziresh24://appointments',
        },
        {
          key: '@paziresh24/bookmarks',
          name: 'لیست پزشکان من',
          icon: '/logos/apps/bookmarks.svg',
          source: 'paziresh24://bookmarks',
        },
        {
          key: '@paziresh24/subuser',
          name: 'کاربران زیرمجموعه',
          icon: '/logos/apps/subuser.svg',
          source: 'paziresh24://subuser',
        },
      ],
    ]);

  return res.status(200).json([
    [
      {
        key: '@paziresh24/appointments',
        name: 'نوبت های من',
        icon: '/logos/apps/appointments.svg',
        source: 'paziresh24://appointments',
      },
      {
        key: '@paziresh24/bookmarks',
        name: 'لیست پزشکان من',
        icon: '/logos/apps/bookmarks.svg',
        source: 'paziresh24://bookmarks',
      },
      {
        key: '@paziresh24/subuser',
        name: 'کاربران زیرمجموعه',
        icon: '/logos/apps/subuser.svg',
        source: 'paziresh24://subuser',
      },
      {
        key: '@paziresh24/profile',
        name: 'ویرایش پروفایل',
        icon: '/logos/apps/user.svg',
        source: 'paziresh24://profile',
      },
    ],
  ]);
}
