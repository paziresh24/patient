/* eslint-disable @next/next/no-img-element */

import Text from '@/components/atom/text';
import Trans from 'next-translate/Trans';
import config from 'next/config';
import { useRouter } from 'next/router';
const { publicRuntimeConfig } = config();

const CompactFooter = () => {
  // const { t } = useTranslation('common');
  const { route } = useRouter();

  return (
    <footer className="p-5 bg-white border-t text-slate-700 border-slate-100">
      <Text as="p" align="center" fontSize="sm" fontWeight="bold">
        <Trans
          i18nKey="common:footer.copyRightTextByBrand"
          components={[route === '/' ? <a key={0} href={publicRuntimeConfig.CLINIC_BASE_URL} /> : <span />]}
        />
      </Text>
    </footer>
  );
};

export default CompactFooter;
