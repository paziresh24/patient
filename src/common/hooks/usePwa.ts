import { useEffect, useState } from 'react';

export const usePwa = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') setIsClient(true);
  }, []);
  const downloadSource = isClient ? localStorage.getItem('app:download_source') : null;

  const appDownloadSource = () => {
    const stores: any = {
      direct: 'کوگل پلی',
      bazaar: 'کافه بازار',
      myket: 'مایکت',
      google_play: 'کوگل پلی',
    };
    return stores[downloadSource ?? ''];
  };

  const getRatingAppLink = () => {
    const rateLinks = {
      direct: 'market://details?id=com.paziresh24.paziresh24',
      bazaar: 'bazaar://details?id=com.paziresh24.paziresh24',
      myket: 'myket://comment?id=com.paziresh24.paziresh24',
      google_play: 'market://details?id=com.paziresh24.paziresh24',
    };
    return downloadSource && rateLinks[downloadSource as 'direct' | 'bazaar' | 'myket' | 'google_play'];
  };

  return { getRatingAppLink: isClient ? getRatingAppLink() : false, appDownloadSource: isClient ? appDownloadSource() : false };
};

export default usePwa;
