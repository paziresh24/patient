/* eslint-disable @next/next/no-img-element */

import useCustomize from '@/common/hooks/useCustomize';
import Text from '@/components/atom/text';
import Trans from 'next-translate/Trans';
import config from 'next/config';
import { useRouter } from 'next/router';
const { publicRuntimeConfig } = config();

const CompactFooter = () => {
  const { route } = useRouter();
  const customize = useCustomize(state => state.customize);

  return (
    <footer className="p-5 flex flex-col justify-center items-center gap-4 pwa:hidden print:hidden bg-white border-t text-slate-700 border-slate-100">
      {customize.certificates?.map(item => {
        if (item.provider === 'enamad')
          return (
            <a referrerPolicy="origin" target="_blank" href={`https://trustseal.enamad.ir/?id=${item.id}&Code=${item.code}`}>
              <img
                src={`https://Trustseal.eNamad.ir/logo.aspx?id=${item.id}&Code=${item.code}`}
                id={item.id}
                style={{ cursor: 'pointer', width: 90 }}
                referrerPolicy="origin"
                alt=""
              />
            </a>
          );
      })}
      <Text as="p" align="center" fontSize="sm" fontWeight="bold">
        <Trans
          i18nKey="common:footer.copyRightTextByBrand"
          components={[route === '/' ? <a key={0} href={`${publicRuntimeConfig.CLINIC_BASE_URL}/`} /> : <span />]}
        />
      </Text>
    </footer>
  );
};

export default CompactFooter;
