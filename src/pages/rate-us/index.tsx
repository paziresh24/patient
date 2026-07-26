import Head from 'next/head';
import { useEffect, useRef } from 'react';

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
      */}
      <div className="rateUsPage" dir="rtl">
        <div className="rateUsContainer" ref={containerRef}>
          <div className="rateUsIcon">
            <i className="fas fa-star" />
          </div>

          <h1>نظر شما برای ما مهم است!</h1>
          <p className="rateUsSubtitle">از شما برای نظر مثبت‌تان در مورد ویزیت پزشکی تشکر می‌کنیم.</p>

          <div className="rateUsThankYouMessage">
            <p>ممنون که تجربه خوب خود را با ما به اشتراک گذاشتید! نظرات شما به ما کمک می‌کند تا خدمات بهتری ارائه دهیم.</p>
          </div>

          <p className="rateUsInvitationText">
            لطفاً نظر خود را در یکی از مارکت‌های اپلیکیشن مانند گوگل پلی، کافه بازار یا مایکت ثبت کنید تا دیگران هم از تجربه شما بهره‌مند شوند.
          </p>

          <div className="rateUsStoreButtons">
            <a
              href="https://play.google.com/store/apps/details?id=com.paziresh24.paziresh24"
              className="rateUsStoreBtn rateUsGooglePlay"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fab fa-google-play" />
              ثبت نظر در گوگل پلی
            </a>

            <a
              href="intent://details?id=com.paziresh24.paziresh24#Intent;scheme=bazaar;package=com.farsitel.bazaar;action=android.intent.action.EDIT;S.browser_fallback_url=https%3A%2F%2Fcafebazaar.ir%2Fapp%2Fcom.paziresh24.paziresh24;end"
              className="rateUsStoreBtn rateUsCafeBazaar"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fas fa-shopping-bag" />
              ثبت نظر در کافه بازار
            </a>

            <a href="myket://comment?id=com.paziresh24.paziresh24" className="rateUsStoreBtn rateUsMyket" target="_blank" rel="noreferrer">
              <i className="fas fa-mobile-alt" />
              ثبت نظر در مایکت
            </a>
          </div>

          <div className="rateUsSocialSection">
            <p className="rateUsSocialTitle">نظر خود را با دوستانتان به اشتراک بگذارید</p>
            <div className="rateUsSocialButtons">
              <a href="#" className="rateUsSocialBtn rateUsFacebook" onClick={shareOnFacebook}>
                <i className="fab fa-facebook-f" />
              </a>
              <a href="#" className="rateUsSocialBtn rateUsInstagram" onClick={shareOnInstagram}>
                <i className="fab fa-instagram" />
              </a>
              <a href="#" className="rateUsSocialBtn rateUsTwitter" onClick={shareOnTwitter}>
                <i className="fab fa-twitter" />
              </a>
              <a href="#" className="rateUsSocialBtn rateUsWhatsapp" onClick={shareOnWhatsApp}>
                <i className="fab fa-whatsapp" />
              </a>
              <a href="#" className="rateUsSocialBtn rateUsTelegram" onClick={shareOnTelegram}>
                <i className="fab fa-telegram-plane" />
              </a>
              <a href="#" className="rateUsSocialBtn rateUsLinkedin" onClick={shareOnLinkedIn}>
                <i className="fab fa-linkedin-in" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .rateUsPage,
        .rateUsPage * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .rateUsPage {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          direction: rtl;
        }

        .rateUsContainer {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          padding: 40px;
          max-width: 500px;
          width: 100%;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .rateUsContainer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 5px;
          background: linear-gradient(90deg, #4caf50, #2196f3, #ff9800);
        }

        .rateUsIcon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #4caf50, #45a049);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 30px;
          font-size: 40px;
          color: white;
          box-shadow: 0 10px 20px rgba(76, 175, 80, 0.3);
        }

        .rateUsContainer h1 {
          color: #333;
          font-size: 28px;
          margin-bottom: 20px;
          font-weight: 700;
          line-height: 1.3;
        }

        .rateUsSubtitle {
          color: #666;
          font-size: 16px;
          margin-bottom: 30px;
          line-height: 1.6;
        }

        .rateUsThankYouMessage {
          background: #f8f9fa;
          border-radius: 15px;
          padding: 25px;
          margin-bottom: 35px;
          border-right: 4px solid #4caf50;
        }

        .rateUsThankYouMessage p {
          color: #555;
          font-size: 16px;
          line-height: 1.7;
          margin: 0;
        }

        .rateUsInvitationText {
          color: #444;
          font-size: 16px;
          margin-bottom: 30px;
          line-height: 1.6;
        }

        .rateUsStoreButtons {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-bottom: 30px;
        }

        .rateUsStoreBtn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 15px 25px;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .rateUsStoreBtn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .rateUsStoreBtn:hover::before {
          left: 100%;
        }

        .rateUsGooglePlay {
          background: linear-gradient(135deg, #4285f4, #34a853);
          color: white;
          box-shadow: 0 8px 20px rgba(66, 133, 244, 0.3);
        }

        .rateUsGooglePlay:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(66, 133, 244, 0.4);
        }

        .rateUsCafeBazaar {
          background: linear-gradient(135deg, #ff6b35, #f7931e);
          color: white;
          box-shadow: 0 8px 20px rgba(255, 107, 53, 0.3);
        }

        .rateUsCafeBazaar:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(255, 107, 53, 0.4);
        }

        .rateUsMyket {
          background: linear-gradient(135deg, #00bcd4, #0097a7);
          color: white;
          box-shadow: 0 8px 20px rgba(0, 188, 212, 0.3);
        }

        .rateUsMyket:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(0, 188, 212, 0.4);
        }

        .rateUsStoreBtn :global(i) {
          margin-left: 10px;
          font-size: 20px;
        }

        .rateUsSocialSection {
          border-top: 1px solid #eee;
          padding-top: 25px;
        }

        .rateUsSocialTitle {
          color: #666;
          font-size: 14px;
          margin-bottom: 15px;
        }

        .rateUsSocialButtons {
          display: flex;
          justify-content: center;
          gap: 15px;
        }

        .rateUsSocialBtn {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          color: white;
          font-size: 18px;
          transition: all 0.3s ease;
        }

        .rateUsSocialBtn:hover {
          transform: translateY(-3px);
        }

        .rateUsFacebook {
          background: #1877f2;
        }
        .rateUsInstagram {
          background: linear-gradient(45deg, #e4405f, #f77737, #fcaf45);
        }
        .rateUsTwitter {
          background: #1da1f2;
        }
        .rateUsWhatsapp {
          background: #25d366;
        }
        .rateUsTelegram {
          background: #0088cc;
        }
        .rateUsLinkedin {
          background: #0077b5;
        }

        .rateUsFacebook:hover {
          box-shadow: 0 8px 20px rgba(24, 119, 242, 0.3);
        }
        .rateUsInstagram:hover {
          box-shadow: 0 8px 20px rgba(228, 64, 95, 0.3);
        }
        .rateUsTwitter:hover {
          box-shadow: 0 8px 20px rgba(29, 161, 242, 0.3);
        }
        .rateUsWhatsapp:hover {
          box-shadow: 0 8px 20px rgba(37, 211, 102, 0.3);
        }
        .rateUsTelegram:hover {
          box-shadow: 0 8px 20px rgba(0, 136, 204, 0.3);
        }
        .rateUsLinkedin:hover {
          box-shadow: 0 8px 20px rgba(0, 119, 181, 0.3);
        }

        @media (max-width: 768px) {
          .rateUsContainer {
            padding: 30px 20px;
            margin: 10px;
          }

          .rateUsContainer h1 {
            font-size: 24px;
          }

          .rateUsStoreButtons {
            gap: 12px;
          }

          .rateUsStoreBtn {
            padding: 12px 20px;
            font-size: 15px;
          }
        }

        @media (max-width: 480px) {
          .rateUsContainer {
            padding: 25px 15px;
          }

          .rateUsContainer h1 {
            font-size: 22px;
          }

          .rateUsIcon {
            width: 60px;
            height: 60px;
            font-size: 30px;
          }
        }
      `}</style>
    </>
  );
};

export default RateUsPage;
