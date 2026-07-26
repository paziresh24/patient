import Head from 'next/head';
import { useEffect, useRef } from 'react';

import styles from './rateUsPage.module.css';

/**
 * DR-13 — پورت صفحه‌ی «نظر شما برای ما مهم است» از n8n (webhook socials_stores_feedback) به patient.
 *
 * منبع: search-n8n-workflows-codebase/workflows/0lelRm3v4aMzuFGm.json → نودِ "Edit Fields" →
 * parameters.assignments.assignments[0].value (HTML/CSS/JS استاتیک ۱۴٫۵KB، صفر expression n8n).
 * markup/CSS/JS عیناً از همان‌جا کپی شده؛ فهرست انحراف‌های اجباری (نه بازطراحی) در PR description.
 *
 * این صفحه عمداً:
 * - از getServerSideProps/getStaticProps استفاده نمی‌کند (کاملاً static باشد تا long-cache شود).
 * - از query string چیزی نمی‌خواند (owner: صفحه نباید به query وابسته باشد).
 * - fetch/API صدا نمی‌زند.
 */

const SHARE_URL = 'https://www.paziresh24.com/';

const SHARING_TEXTS = [
  '🌟 تجربه‌ای عالی از ویزیت آنلاین پزشک با پذیرش24! 🌟\nخیلی سریع و راحت پزشک مورد نظرمو پیدا کردم و نوبت ویزیت رو بدون هیچ‌گونه معطلی رزرو کردم. اگه دنبال راحتی و سرعت در انتخاب پزشک و دریافت نوبت هستید، حتماً از **پذیرش24** استفاده کنید! 👩‍⚕️💻\n#ویزیت_پزشکی #پذیرش24 #ویزیت_آنلاین #پزشک_آنلاین #پزشکی_مطمئن',
  '😍 به راحتی دکترم رو پیدا کردم و نوبت گرفتم! 🌿\nاگر به دنبال ویزیت آنلاین یا حضوری پزشک با کمترین معطلی هستید، **پذیرش24** راه‌حل فوق‌العاده‌ایه! تجربه من از انتخاب پزشک و دریافت نوبت بدون هیچ مشکلی خیلی رضایت‌بخش بود. 💬\nحتماً این تجربه رو با دوستان و خانواده‌تون به اشتراک بذارید! #پزشک_آنلاین #ویزیت_حضوری #پذیرش24 #رزرو_نوبت #سلامتی',
  'با **پذیرش24** خیلی سریع و راحت نوبت پزشک گرفتم! 🌟\nاگه مثل من دنبال راهی آسون و سریع برای پیدا کردن پزشک و دریافت نوبت هستید، حتماً این پلتفرم رو امتحان کنید. تجربه خیلی خوبی داشتم و از راحتی و سرعت خدمات راضی بودم! 👨‍⚕️📅\n#پذیرش24 #ویزیت_آنلاین #سلامتی_مطمئن #پزشک_آنلاین #رزرو_نوبت',
  'برای اولین بار بود که از **پذیرش24** استفاده می‌کردم و به نظرم فوق‌العاده بود! ✅\nدر عرض چند دقیقه دکتر مورد نظرم رو پیدا کردم و نوبت رو گرفتم. برای همه کسانی که به دنبال راحتی در انتخاب پزشک و نوبت‌دهی آنلاین هستند، این پلتفرم بهترین انتخابه. 👩‍⚕️💡\n#پذیرش24 #ویزیت_آنلاین #پزشک_آنلاین #سلامتی #رزرو_آسان',
  'اگه از انتخاب دکتر و گرفتن نوبت در زمان مناسب خسته شدید، پیشنهاد می‌کنم حتماً **پذیرش24** رو امتحان کنید! 🏥💬\nبا این اپلیکیشن سریع و راحت تونستم دکترم رو پیدا کنم و نوبت ویزیت رو بدون هیچ دردسری رزرو کنم. تجربه‌ام رو به دوستانم گفتم و حالا می‌خوام با شما هم به اشتراک بذارم. 🌟\n#پذیرش24 #ویزیت_پزشکی #پزشک_آنلاین #سلامتی',
];

function getRandomShareText() {
  const randomIndex = Math.floor(Math.random() * SHARING_TEXTS.length);
  return SHARING_TEXTS[randomIndex];
}

function shareOnFacebook() {
  const url = encodeURIComponent(SHARE_URL);
  const text = encodeURIComponent(getRandomShareText());
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
}

function shareOnInstagram() {
  // Instagram doesn't support direct sharing via URL, so we'll copy text to clipboard
  const shareText = getRandomShareText();
  navigator.clipboard.writeText(shareText).then(() => {
    alert('متن کپی شد! حالا می‌توانید آن را در اینستاگرام به اشتراک بگذارید.');
  });
}

function shareOnTwitter() {
  const url = encodeURIComponent(SHARE_URL);
  const text = encodeURIComponent(getRandomShareText());
  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
}

function shareOnWhatsApp() {
  const shareText = getRandomShareText();
  const text = encodeURIComponent(`${shareText}\n\n${SHARE_URL}`);
  window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
}

function shareOnTelegram() {
  const url = encodeURIComponent(SHARE_URL);
  const text = encodeURIComponent(getRandomShareText());
  window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
}

function shareOnLinkedIn() {
  const url = encodeURIComponent(SHARE_URL);
  const title = encodeURIComponent('تجربه عالی از پذیرش24 - اپلیکیشن نوبت‌دهی پزشکی');
  const summary = encodeURIComponent(getRandomShareText());
  window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${summary}`, '_blank');
}

// همان اسکریپت Clarity عیناً از HTMLِ n8n (Q-4: عیناً بماند)
const CLARITY_SNIPPET = `(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "4zn9fqioi8");`;

const RateUsPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // معادلِ document.addEventListener('DOMContentLoaded', ...) نودِ اصلی — روی mount اجرا می‌شود
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.style.opacity = '0';
    container.style.transform = 'translateY(30px)';

    const timer = setTimeout(() => {
      container.style.transition = 'all 0.6s ease';
      container.style.opacity = '1';
      container.style.transform = 'translateY(0)';
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head>
        <title>نظر شما برای ما مهم است!</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* این صفحه نباید ایندکس شود (mission DR-13) */}
        <meta name="robots" content="noindex" />
        <link rel="stylesheet" href="https://lib.arvancloud.ir/font-awesome/6.0.0/css/all.min.css" />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script type="text/javascript" dangerouslySetInnerHTML={{ __html: CLARITY_SNIPPET }} />
      </Head>

      {/*
        انحراف اجباری از مارک‌آپ اصلی (نه بازطراحی):
        - class -> className، onclick="fn()" -> onClick={fn} (الزام React/JSX).
        - سلکتورهای اصلی روی body/* بودند (صفحه‌ی standalone n8n صاحب <body> خودش بود)؛ این‌جا <body>
          را کلِ اپِ patient به اشتراک می‌گذارد، پس این قوانین به‌جای body/* روی یک wrapper اسکوپ‌شده
          (.rateUsPage) پیاده شدند — وگرنه ریست جهانی مارجین/پدینگ کل سایت را می‌شکست.
        - نام کلاس‌ها با پیشوند rateUs بازنویسی شدند (container/icon/subtitle/... در سایتِ patient که
          Tailwind + Ant Design دارد نام‌های عمومی‌ای هستند) تا تصادفاً با CSS جهانیِ سایت تداخل نکنند؛
          مقادیر/خواصِ CSS دقیقاً همان مقادیر اصلی‌اند، فقط نامِ سلکتور تغییر کرده.
        - CSS در index.module.css است، نه <style jsx>. دلیل (باگِ زنده‌ی 2026-07-26): styled-jsx هر
          سلکتور را با کلاسِ jsx-<hash> بازنویسی می‌کند، پس ریستِ «.rateUsPage *» به
          «.rateUsPage.jsx-x .jsx-x» تبدیل می‌شد = specificity (0,3,0) و تک‌کلاس‌هایی مثل
          «.rateUsContainer.jsx-x» (0,2,0) را می‌بُرد ⇒ همه‌ی padding/margin/gapها صفر می‌شدند.
          با CSS module سلکتورها فقط hash می‌شوند و ترتیبِ اصلیِ cascade (ریست اول، قواعد بعد) حفظ می‌شود.
      */}
      <div className={styles.rateUsPage} dir="rtl">
        <div className={styles.rateUsContainer} ref={containerRef}>
          <div className={styles.rateUsIcon}>
            <i className="fas fa-star" />
          </div>

          <h1>نظر شما برای ما مهم است!</h1>
          <p className={styles.rateUsSubtitle}>از شما برای نظر مثبت‌تان در مورد ویزیت پزشکی تشکر می‌کنیم.</p>

          <div className={styles.rateUsThankYouMessage}>
            <p>ممنون که تجربه خوب خود را با ما به اشتراک گذاشتید! نظرات شما به ما کمک می‌کند تا خدمات بهتری ارائه دهیم.</p>
          </div>

          <p className={styles.rateUsInvitationText}>
            لطفاً نظر خود را در یکی از مارکت‌های اپلیکیشن مانند گوگل پلی، کافه بازار یا مایکت ثبت کنید تا دیگران هم از تجربه شما بهره‌مند شوند.
          </p>

          <div className={styles.rateUsStoreButtons}>
            <a
              href="https://play.google.com/store/apps/details?id=com.paziresh24.paziresh24"
              className={`${styles.rateUsStoreBtn} ${styles.rateUsGooglePlay}`}
              target="_blank"
              rel="noreferrer"
            >
              <i className="fab fa-google-play" />
              ثبت نظر در گوگل پلی
            </a>

            <a
              href="intent://details?id=com.paziresh24.paziresh24#Intent;scheme=bazaar;package=com.farsitel.bazaar;action=android.intent.action.EDIT;S.browser_fallback_url=https%3A%2F%2Fcafebazaar.ir%2Fapp%2Fcom.paziresh24.paziresh24;end"
              className={`${styles.rateUsStoreBtn} ${styles.rateUsCafeBazaar}`}
              target="_blank"
              rel="noreferrer"
            >
              <i className="fas fa-shopping-bag" />
              ثبت نظر در کافه بازار
            </a>

            <a href="myket://comment?id=com.paziresh24.paziresh24" className={`${styles.rateUsStoreBtn} ${styles.rateUsMyket}`} target="_blank" rel="noreferrer">
              <i className="fas fa-mobile-alt" />
              ثبت نظر در مایکت
            </a>
          </div>

          <div className={styles.rateUsSocialSection}>
            <p className={styles.rateUsSocialTitle}>نظر خود را با دوستانتان به اشتراک بگذارید</p>
            <div className={styles.rateUsSocialButtons}>
              <a href="#" className={`${styles.rateUsSocialBtn} ${styles.rateUsFacebook}`} onClick={shareOnFacebook}>
                <i className="fab fa-facebook-f" />
              </a>
              <a href="#" className={`${styles.rateUsSocialBtn} ${styles.rateUsInstagram}`} onClick={shareOnInstagram}>
                <i className="fab fa-instagram" />
              </a>
              <a href="#" className={`${styles.rateUsSocialBtn} ${styles.rateUsTwitter}`} onClick={shareOnTwitter}>
                <i className="fab fa-twitter" />
              </a>
              <a href="#" className={`${styles.rateUsSocialBtn} ${styles.rateUsWhatsapp}`} onClick={shareOnWhatsApp}>
                <i className="fab fa-whatsapp" />
              </a>
              <a href="#" className={`${styles.rateUsSocialBtn} ${styles.rateUsTelegram}`} onClick={shareOnTelegram}>
                <i className="fab fa-telegram-plane" />
              </a>
              <a href="#" className={`${styles.rateUsSocialBtn} ${styles.rateUsLinkedin}`} onClick={shareOnLinkedIn}>
                <i className="fab fa-linkedin-in" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RateUsPage;
