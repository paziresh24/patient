import Button from '@/common/components/atom/button';
import Text from '@/common/components/atom/text';
import Android from '@/common/components/icons/android';
import Apple from '@/common/components/icons/apple';
import promoteImage from './image/app-mockup.png';

const Promote = () => {
  return (
    <div className="w-full p-4 mx-auto md:hidden">
      <div
        className="mt-12 bg-[length:85rem] bg-no-repeat bg-brand rounded-3xl py-14 px-4"
        style={{
          backgroundImage:
            'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNDM1IDUyNCI+CiAgICA8ZGVmcyAvPgogICAgPGRlZnM+CiAgICAgICAgPGNsaXBQYXRoIGlkPSJhIj4KICAgICAgICAgICAgPHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxNDM1djUyNEgweiIgLz4KICAgICAgICA8L2NsaXBQYXRoPgogICAgICAgIDxjbGlwUGF0aCBpZD0iYiI+CiAgICAgICAgICAgIDxwYXRoIHRyYW5zZm9ybT0icm90YXRlKC05MCAxNDIzLjU5IDEzOTEuNTUzKSIgZmlsbD0iIzNmNDA3OSIgZD0iTTAgMGgxMDEzdjE4NTZIMHoiIC8+CiAgICAgICAgPC9jbGlwUGF0aD4KICAgICAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImMiIHgxPSItLjU0MyIgeTE9IjEuNTM0IiB4Mj0iLjczNiIgeTI9Ii42NTIiIGdyYWRpZW50VW5pdHM9Im9iamVjdEJvdW5kaW5nQm94Ij4KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmZmIiBzdG9wLW9wYWNpdHk9Ii4zMSIgLz4KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmZmIiBzdG9wLW9wYWNpdHk9IjAiIC8+CiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDwvZGVmcz4KICAgIDxnIGNsaXAtcGF0aD0idXJsKCNhKSIgc3R5bGU9Imlzb2xhdGlvbjppc29sYXRlIj4KICAgICAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMzIuMDM3IC0xODAyLjE0MykiIGNsaXAtcGF0aD0idXJsKCNiKSI+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0tMTgxMDQuMjIxIDkzODMuMTc0bC0xNTA4LjggMjAzLjIxOSA0Ni40MjYtNTc2Ljc1NiAxMTEwLjYxNy0xMy41NDl6IgogICAgICAgICAgICAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTk1NzEgLTcyNjAuNzA5KSIgZmlsbD0idXJsKCNjKSIgLz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==) ',
        }}
      >
        <div className="flex flex-col items-center">
          <div className="order-1 text-center flex-1 flex justify-center items-center">
            <div className="mt-6 w-full text-slate-50">
              <Text as="h2" fontSize="lg" fontWeight="bold" className="mb-6">
                نزدیک‌ترین پزشک، گوشی شماست !
              </Text>
              <Text as="p" fontSize="sm" className="mb-12">
                از طریق{' '}
                <a href="https://www.paziresh24.com/app" title="سوپر اپلیکیشن پذیرش 24">
                  سوپر اپلیکیشن پذیرش 24
                </a>{' '}
                به هزاران پزشک متخصص ایرانی دسترسی پیدا کنید و به راحتی{' '}
                <a href="http://paziresh24.com/consult?refafname=website-homecta-moshavere-dlapp" title="مشاوره آنلاین">
                  مشاوره آنلاین
                </a>
                دریافت کنید یا در صورت تمایل نوبت حضوری آن پزشک را رزرو کنید
              </Text>
              <div className="flex flex-col gap-5 items-center justify-center">
                <a href="https://www.paziresh24.com/app" title="دانلود رایگان اپلیکیشن پذیرش24">
                  <Button className="bg-slate-50  text-slate-700 border-none">دانلود رایگان اپلیکیشن پذیرش24</Button>
                </a>
                <div className="flex flex-row gap-4">
                  <Apple />
                  <Android />
                </div>
              </div>
            </div>
          </div>
          <div className="order-none flex-1 ">
            <img src={promoteImage.src} className=" block mx-auto " alt="promote-image" height={'250px'} loading="lazy" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Promote;
