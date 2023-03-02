/* eslint-disable @next/next/no-img-element */

import Text from '@/components/atom/text';
import useTranslation from 'next-translate/useTranslation';

const CompactFooter = () => {
  const { t } = useTranslation('common');

  return (
    <footer className="p-5 bg-white border-t text-slate-700 border-slate-100">
      <Text as="p" align="center" fontSize="sm" fontWeight="bold">
        {t('footer.copyRightTextByBrand')}
      </Text>
    </footer>
  );
};

export default CompactFooter;
