import { useEffect, useState } from 'react';

export const usePwa = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') setIsClient(true);
  }, []);
  const downloadSource = isClient ? localStorage.getItem('app:download_source') : null;

  const appDownloadSource = () => {
    const stores: any = {
      direct: 'گوگل پلی',
      bazaar: 'کافه بازار',
      myket: 'مایکت',
      google_play: 'گوگل پلی',
    };
    return stores[downloadSource ?? ''];
  };

  const getRatingAppLink = () => {
    const rateLinks = {
      direct: 'market://details?id=com.paziresh24.paziresh24',
      bazaar: 'intent://details?id=com.paziresh24.paziresh24#Intent;scheme=bazaar;package=com.farsitel.bazaar;action=android.intent.action.EDIT;S.browser_fallback_url=https%3A%2F%2Fcafebazaar.ir%2Fapp%2Fcom.paziresh24.paziresh24;end',
      myket: 'myket://comment?id=com.paziresh24.paziresh24',
      google_play: 'https://play.google.com/store/apps/details?id=com.paziresh24.paziresh24',
    };
    return downloadSource && rateLinks[downloadSource as 'direct' | 'bazaar' | 'myket' | 'google_play'];
  };

  return { getRatingAppLink: isClient ? getRatingAppLink() : false, appDownloadSource: isClient ? appDownloadSource() : false };
};

export default usePwa;
