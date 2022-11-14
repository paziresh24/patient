import Button from '@/common/components/atom/button';
import Text from '@/common/components/atom/text';
import Android from '@/common/components/icons/android';
import Apple from '@/common/components/icons/apple';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/future/image';
import promoteImage from './image/app-mockup.png';

const Promote = () => {
  const { t } = useTranslation('home');

  return (
    <div className="w-full p-4 mx-auto">
      <div
        className="bg-[length:50rem] bg-no-repeat bg-brand rounded-xl py-14 px-4"
        style={{
          backgroundImage:
            'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNDM1IDUyNCI+CiAgICA8ZGVmcyAvPgogICAgPGRlZnM+CiAgICAgICAgPGNsaXBQYXRoIGlkPSJhIj4KICAgICAgICAgICAgPHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxNDM1djUyNEgweiIgLz4KICAgICAgICA8L2NsaXBQYXRoPgogICAgICAgIDxjbGlwUGF0aCBpZD0iYiI+CiAgICAgICAgICAgIDxwYXRoIHRyYW5zZm9ybT0icm90YXRlKC05MCAxNDIzLjU5IDEzOTEuNTUzKSIgZmlsbD0iIzNmNDA3OSIgZD0iTTAgMGgxMDEzdjE4NTZIMHoiIC8+CiAgICAgICAgPC9jbGlwUGF0aD4KICAgICAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImMiIHgxPSItLjU0MyIgeTE9IjEuNTM0IiB4Mj0iLjczNiIgeTI9Ii42NTIiIGdyYWRpZW50VW5pdHM9Im9iamVjdEJvdW5kaW5nQm94Ij4KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmZmIiBzdG9wLW9wYWNpdHk9Ii4zMSIgLz4KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmZmIiBzdG9wLW9wYWNpdHk9IjAiIC8+CiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDwvZGVmcz4KICAgIDxnIGNsaXAtcGF0aD0idXJsKCNhKSIgc3R5bGU9Imlzb2xhdGlvbjppc29sYXRlIj4KICAgICAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMzIuMDM3IC0xODAyLjE0MykiIGNsaXAtcGF0aD0idXJsKCNiKSI+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0tMTgxMDQuMjIxIDkzODMuMTc0bC0xNTA4LjggMjAzLjIxOSA0Ni40MjYtNTc2Ljc1NiAxMTEwLjYxNy0xMy41NDl6IgogICAgICAgICAgICAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTk1NzEgLTcyNjAuNzA5KSIgZmlsbD0idXJsKCNjKSIgLz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==) ',
        }}
      >
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center flex-1 order-1 text-center">
            <div className="w-full mt-6 text-slate-50">
              <Text as="h2" fontSize="lg" fontWeight="bold" className="mb-6">
                {t('promoteTitle')}
              </Text>
              <Text as="p" fontSize="sm" className="mb-12 leading-6">
                {t('promoteDescription')}
              </Text>
              <div className="flex flex-col items-center justify-center gap-5">
                <a href="/app" title={t('promoteDownloadButton')}>
                  <Button className="border-none bg-slate-50 text-slate-700">{t('promoteDownloadButton')}</Button>
                </a>
                <div className="flex flex-row gap-4">
                  <Apple />
                  <Android />
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 order-none ">
            <Image src={promoteImage.src} className="block mx-auto " alt="promote-image" width="270" height="300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Promote;
