export type PrivacyDataRow = {
  data: string;
  purpose?: string;
};

export type PrivacySection = {
  id: string;
  title: string;
  paragraphs?: string[];
  dataRows?: PrivacyDataRow[];
};

export type PrivacyContent = {
  locale: 'fa' | 'en';
  dir: 'rtl' | 'ltr';
  pageTitle: string;
  sections: PrivacySection[];
};

const SUPPORT_URL = 'https://support.paziresh24.com/';

export const privacyPolicyFa: PrivacyContent = {
  locale: 'fa',
  dir: 'rtl',
  pageTitle: 'سیاست حفظ حریم خصوصی',
  sections: [
    {
      id: 'general',
      title: 'اطلاعات عمومی',
      paragraphs: [
        'این اطلاعات مختص هر کاربر بوده و شامل مواردی است که به کمک آن می‌توان کاربران پذیرش۲۴ را به‌صورت منحصربه‌فرد شناسایی نمود. برای نمونه می‌توان به نام و نام خانوادگی، نشانی، نشانی پست الکترونیکی (ایمیل)، شماره تلفن و سایر اطلاعاتی که به‌صورت عادی در دسترس عموم مردم نیست، اشاره نمود.',
        'در هنگام استفاده از وب‌سایت ممکن است از کاربر خواسته شود تا برخی اطلاعات را وارد کند. اطلاعات خواسته‌شده فقط برای مقاصد ذکرشده در هنگام درخواست برای وارد کردن آن اطلاعات و یا بر طبق این سیاست حفظ حریم خصوصی مورد استفاده قرار خواهد گرفت.',
      ],
    },
    {
      id: 'location',
      title: 'اطلاعات مکانی',
      paragraphs: [
        'هنگامی‌که کاربر از پلتفرم پذیرش۲۴ استفاده می‌نماید، موقعیت مکانی وی ذخیره می‌شود.',
        'تمامی اطلاعاتی که توسط کاربران در بخش ویزیت آنلاین برای پزشک ارسال می‌گردد، ماهیت کاملاً محرمانه دارد و تنها بین کاربر و پزشک و یا مشاور باقی خواهد ماند، بجز مواردی که با دستور مقامات قضایی در جهت بررسی ارتکاب جرم ملاحظه می‌گردد.',
      ],
    },
    {
      id: 'images',
      title: 'اطلاعات تصاویر',
      paragraphs: [
        'وب‌سایت و برنامه ما ممکن است تصاویر را از کاربران برای اهداف مختلف مانند تصویر پروفایل کاربری یا در موارد ارسال محتوا، جمع‌آوری کند. لطفاً توجه داشته باشید که هر تصویری که به پلتفرم ما ارسال می‌شود ممکن است برای استفاده در آینده در سرورهای ما ذخیره شود. با این حال، ما این تصاویر را با اشخاص ثالث به اشتراک نمی‌گذاریم و فقط برای اهداف داخلی مانند بهبود خدمات و تجربه کاربری ما استفاده می‌شود. با ارسال تصویر به پلتفرم ما، جمع‌آوری و ذخیره‌سازی تصویر خود را تایید کرده و با آن موافقت می‌کنید.',
      ],
    },
    {
      id: 'cookies',
      title: 'کوکی‌ها',
      paragraphs: [
        'کاربر باید آگاه باشد که اطلاعات و داده‌ها ممکن است به‌صورت خودکار و از طریق استفاده از «کوکی‌ها» جمع‌آوری شود. «کوکی‌ها» فایل‌های متنی کوچکی هستند که یک وب‌سایت می‌تواند از آن‌ها برای تشخیص کاربران که از وب‌سایت بازدید داشتند، فراهم کردن امکان دیدبانی رفتار، جمع‌آوری اطلاعات کلی به‌منظور ارتقای وب‌سایت و مشخص کردن سمت‌ و سوی تبلیغات استفاده کند. کوکی‌ها به سیستم کاربر ملحق نشده و به فایل‌های شما صدمه نمی‌رسانند. اگر کاربر مایل نیست تا اطلاعاتش از طریق استفاده از کوکی‌ها جمع‌آوری شود، در اغلب مرورگرها می‌توان به روشی آسان ویژگی کوکی را قبول و یا رد کرد.',
      ],
    },
    {
      id: 'update-delete',
      title: 'بروزرسانی یا حذف اطلاعات',
      paragraphs: [
        'کاربر می‌تواند با استفاده از فرم بازخورد موجود در وب‌سایت یا نرم‌افزار، درباره هرگونه بروزرسانی، تغییر یا تصحیح اطلاعات جمع‌آوری‌شده قبلی خود به پذیرش۲۴ اطلاع دهد. بعلاوه، به‌محض تقاضای کاربر، ما تلاش‌های منطقی تجاری خود را بکار خواهیم بست تا اطلاعات کاربر را از پایگاه داده‌های خود حذف کنیم؛ بااین‌وجود، ممکن است به‌واسطه داده‌های پشتیبانی و یا سوابق موارد حذف‌شده، حذف کامل داده‌های کاربر امکان‌پذیر نباشد.',
      ],
    },
    {
      id: 'policy-changes',
      title: 'تغییرات سیاست حفظ حریم خصوصی',
      paragraphs: [
        'پذیرش۲۴ در هر زمان حق تعدیل، تغییر و یا بروزرسانی سیاست حفظ حریم خصوصی را برای خود محفوظ می‌داند و تداوم استفاده کاربر از خدمات پذیرش۲۴ به نشانه پذیرفتن این سیاست‌ها است.',
        'همه مطالب در دسترس از طریق هر یک از خدمات پذیرش۲۴ مانند متن، گرافیک، آرم، آیکون دکمه، تصاویر، ویدئوهای تصویری، موارد قابل دانلود و کپی، داده‌ها و کلیه محتوای تولید شده توسط پذیرش۲۴ جزئی از اموال پذیرش۲۴ محسوب می‌شود و حق استفاده و نشر تمامی مطالب موجود و در دسترس در انحصار پذیرش۲۴ است و هرگونه استفاده بدون کسب مجوز کتبی، حق پیگرد قانونی را برای پذیرش۲۴ محفوظ می‌دارد. علاوه بر این، اسکریپت‌ها و اسامی خدمات قابل‌ارائه از طریق هر یک از خدمات ایجاد شده توسط پذیرش۲۴ و علائم تجاری ثبت‌شده نیز در انحصار پذیرش۲۴ است و هرگونه استفاده با مقاصد تجاری پیگرد قانونی دارد.',
      ],
    },
  ],
};

export const privacyPolicyEn: PrivacyContent = {
  locale: 'en',
  dir: 'ltr',
  pageTitle: 'Privacy Policy',
  sections: [
    {
      id: 'personal-info',
      title: 'Personal information',
      paragraphs: [
        'This information includes items specific to each User and can be used to identify Paziresh24 users uniquely. Examples include:',
        'The User may be asked to enter some information when using the website. The requested information will be used only when requested to enter that information or following this Privacy Policy.',
      ],
      dataRows: [
        { data: 'First and last name', purpose: 'App functionality, Fraud prevention, security and compliance, Account management' },
        { data: 'Address' },
        { data: 'Email address (Optional)', purpose: 'Account management' },
        { data: 'User IDs', purpose: 'App functionality, Analytics, Personalisation, and Account management' },
        { data: 'Telephone number' },
        { data: 'Other information that is not ordinarily available to the public (Optional)', purpose: 'Analytics' },
      ],
    },
    {
      id: 'location',
      title: 'Location information',
      paragraphs: [
        'When the User uses Paziresh24, their location is saved.',
        'All information sent to the doctor by users in the counseling department is entirely confidential and will only remain between the User and the doctor or counselor, except in cases where a court order is intended to commit a crime.',
      ],
    },
    {
      id: 'images',
      title: 'Image information (Photos and videos)',
      paragraphs: [
        'Our website and application may collect user images for various purposes, such as profile pictures or content submission. Please be aware that any images submitted to our platform may be stored on our servers for future use. However, we do not share these images with third parties; they are only used for internal purposes, such as improving our services and user experience. By submitting an image to our platform, you acknowledge and consent to our collection and storage of your image.',
      ],
      dataRows: [
        { data: 'Videos (Optional)', purpose: 'App functionality' },
        { data: 'Photos (Optional)', purpose: 'App functionality' },
      ],
    },
    {
      id: 'app-activity',
      title: 'App activity',
      dataRows: [
        { data: 'App interactions', purpose: 'Analytics, Personalisation' },
        { data: 'In-app search history', purpose: 'App functionality, Analytics, Personalisation' },
        { data: 'Other actions', purpose: 'App functionality, Analytics, Personalisation' },
      ],
    },
    {
      id: 'cookies',
      title: 'Cookies',
      paragraphs: [
        'The User should know that information and data may be collected automatically through "cookies." "Cookies" are small text files that a website can use to identify redirecting users, monitor behavior, collect general information to promote the website, and determine the direction of advertising. Cookies do not attach to the User\'s system and do not harm your files. If the User does not want the information collected through cookies, the cookie feature can be readily accepted or rejected in most browsers.',
      ],
    },
    {
      id: 'update-delete',
      title: 'Update or delete information',
      paragraphs: [
        'The User can use the feedback form on the website or software to notify Paziresh24 of any updates, changes, or corrections to their previously collected information. In addition, upon user request, we will use our reasonable business efforts to remove user information from our databases; however, it may not be possible to completely delete user data due to support data or deleted records.',
      ],
    },
    {
      id: 'delete-account',
      title: 'Delete app account',
      paragraphs: [`You can submit a request to delete your account and associated data for our website or app via ${SUPPORT_URL}`],
    },
    {
      id: 'manage-data',
      title: 'Manage app data',
      paragraphs: [
        `You can submit a request to delete specific data that we collected through our website or app without deleting your entire account. This data can include things like activity history, transaction history, images, and video via ${SUPPORT_URL}`,
      ],
    },
    {
      id: 'policy-changes',
      title: 'Privacy Policy Changes',
      paragraphs: [
        'We reserve the right to modify or update the Privacy Policy at any time, and the continued use of the Services by the User is a sign of acceptance of these policies.',
        'All content available through any of the Paziresh24 services, such as text, graphics, logos, button icons, images, video images, downloadable and copyable items, data, and all content produced by Paziresh24 is part of the Paziresh24 property. The use and publication of all available materials are the exclusive prerogatives of Paziresh24, and any use without obtaining written permission reserves the right to prosecute Paziresh24. In addition, the scripts and names of the services available through each of the services created by Paziresh24 and the registered trademarks are the exclusive property of Paziresh24, and any use for commercial purposes is subject to legal prosecution.',
      ],
    },
  ],
};
