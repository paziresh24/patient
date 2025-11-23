import { useEffect, useState } from 'react';

export const useShouldHideMobileField = () => {
  const [shouldHide, setShouldHide] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkConditions = async () => {
      try {
        const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const isNonTehranTimezone = browserTimeZone !== 'Asia/Tehran';

        let isIPOutsideIran = false;

        try {
          const response = await fetch('https://ipwho.is/');
          const data = await response.json();

          if (data.success) {
            isIPOutsideIran = data.country_code !== 'IR';
          }
        } catch (error) {
          isIPOutsideIran = false;
        }

        setShouldHide(isNonTehranTimezone && isIPOutsideIran);
      } catch (error) {
        setShouldHide(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkConditions();
  }, []);

  return { shouldHide, isLoading };
};
