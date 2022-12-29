/* eslint-disable @next/next/no-img-element */
import Logo from '@/common/components/atom/logo';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

interface HeaderLogoProps {
  showPartnerLogo: boolean;
  partnerLogo?: string;
  brandType?: 'default' | 'compact';
  size?: 'mobile' | 'desktop';
}

export const HeaderLogo = (props: HeaderLogoProps) => {
  const { showPartnerLogo, brandType, partnerLogo, size } = props;
  return showPartnerLogo ? (
    partnerLogo ? (
      <img
        src={publicRuntimeConfig.PARTNER_LOGO_BASE_URL + partnerLogo}
        alt=""
        height={40}
        className={size === 'mobile' ? 'max-w-[190px]' : 'max-w-[250px]'}
      />
    ) : null
  ) : (
    <Logo
      type={brandType}
      fontSize={size === 'mobile' ? 'sm' : 'lg'}
      width={size === 'mobile' ? 32 : 40}
      height={size === 'mobile' ? 32 : 40}
    />
  );
};

export default HeaderLogo;
