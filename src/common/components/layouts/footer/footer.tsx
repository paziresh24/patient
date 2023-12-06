/* eslint-disable @next/next/no-img-element */

import Accordion from '@/common/components/atom/accordion';
import Logo from '@/components/atom/logo';
import Text from '@/components/atom/text';
import useTranslation from 'next-translate/useTranslation';
import config from 'next/config';
import { footerForUsers, footerPaziresh24 } from './data/link';
import { socials } from './data/social';
import aboutMe from './logo/about-me.svg';
import aboutUs from './logo/about-us.svg';
import about from './logo/about.svg';
const { publicRuntimeConfig } = config();

const Footer = () => {
  const { t } = useTranslation('common');

  return (
    <footer className="p-4 pwa:hidden print:hidden bg-white text-slate-700 mt-1">
      <div className="container p-4 px-0 mx-auto">
        <div className="grid grid-cols-12 grid-rows-1 gap-5">
          <div className="col-span-12 md:col-span-5">
            <div className="flex flex-col justify-center gap-2">
              <div className="flex flex-row items-center justify-center gap-3 md:justify-start">
                <Logo fontSize="2xl" />
              </div>
              <div className="flex flex-col justify-center md:justify-start">
                <Text as="p" className="mb-6 text-center md:text-start" fontWeight="medium" fontSize="sm">
                  {t('footer.description')}
                </Text>
              </div>
              <ul className="flex flex-row justify-center gap-2 md:justify-start">
                {socials.map(social => {
                  return (
                    <li key={social.id}>
                      <a href={social.url} rel={social.rel} target={social.target} title={social.title}>
                        <img src={social.image.src} alt={social.title} width={30} height={32} loading="lazy" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="col-span-12 md:col-span-7">
            <div className="flex flex-col flex-wrap justify-center gap-2 md:flex-row md:justify-start">
              <div className="md:basis-[49%]">
                <Accordion title={t('footer.menu.forPatients')}>
                  {
                    <ul className="pr-1 mt-2 text-sm select-none">
                      {footerForUsers.links.map((link, index) => {
                        return (
                          <li key={index}>
                            <a href={link.link} className="block px-0 py-1 text-xs">
                              {link.title}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  }
                </Accordion>
              </div>
              <div className="md:basis-[49%]">
                <a
                  href={`${publicRuntimeConfig.DOCTOR_APP_BASE_URL}/auth`}
                  className="block p-4 text-[0.9rem] font-bold	 rounded-lg bg-slate-100"
                >
                  {t('footer.menu.forDoctors')}
                </a>
              </div>
              <div className="md:basis-[49%]">
                <Accordion title={t('footer.menu.forCompany')}>
                  {
                    <ul className="pr-1 mt-2 text-sm select-none">
                      {footerPaziresh24.links.map((link, index) => {
                        return (
                          <li key={index}>
                            <a href={link.link} className="block px-0 py-1 text-xs">
                              {link.title}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  }
                </Accordion>
              </div>
              <div className="flex flex-col items-center justify-center mt-2 md:basis-[49%]">
                <div className="flex flex-row items-center justify-center">
                  <span className="flex items-center justify-center w-20 h-20">
                    <a href="/home/about-us/">
                      <img src={about.src} alt="نظام صنفی" loading="lazy" width={40} height={40} />
                    </a>
                  </span>
                  <span className="flex items-center justify-center w-20 h-20">
                    <a href="/home/about-us/">
                      <img src={aboutUs.src} alt="نشان ملی ثبت" loading="lazy" width={40} height={40} />
                    </a>
                  </span>
                  <span className="flex items-center justify-center w-20 h-20">
                    <a href="/home/about-us/">
                      <img src={aboutMe.src} alt="اینماد" loading="lazy" width={40} height={40} />
                    </a>
                  </span>
                </div>
                <div className="max-w-lg text-sm">
                  <Text as="p" align="center">
                    {t('footer.copyRightText')}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
