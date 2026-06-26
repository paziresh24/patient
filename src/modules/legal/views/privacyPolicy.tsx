import Card from '@/common/components/atom/card';
import Text from '@/common/components/atom/text';
import classNames from '@/common/utils/classNames';
import { useState } from 'react';
import LegalPageLayout, { LegalPageTitle, LegalSectionTitle } from '../components/legalPageLayout';
import LegalSectionNav from '../components/legalSectionNav';
import LinkifiedText from '../components/linkifiedText';
import { PrivacyContent, PrivacyDataRow, privacyPolicyEn, privacyPolicyFa } from '../constants/privacyPolicyContent';

type Locale = 'fa' | 'en';

const getSectionDomId = (locale: string, sectionId: string) => `${locale}-${sectionId}`;

const DataRows = ({ rows }: { rows: PrivacyDataRow[] }) => (
  <div className="mt-1 rounded-xl bg-slate-50 p-4">
    <dl className="divide-y divide-slate-200/80 md:hidden">
      {rows.map((row, index) => (
        <div key={`${row.data}-${index}`} className="py-3 first:pt-0 last:pb-0">
          <Text as="dt" fontSize="sm" fontWeight="semiBold" className="leading-6 text-slate-900">
            {row.data}
          </Text>
          <Text as="dd" fontSize="sm" className="mt-2 leading-6 text-slate-600">
            {row.purpose ?? '—'}
          </Text>
        </div>
      ))}
    </dl>

    <div className="hidden overflow-x-auto md:block">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="pb-3 pe-4 text-start text-sm font-semibold text-slate-800">Data collected</th>
            <th className="pb-3 text-start text-sm font-semibold text-slate-800">Purpose</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.data}-${index}`} className="border-b border-slate-200/60 last:border-0">
              <td className="py-3 pe-4 align-top text-sm font-medium leading-6 text-slate-800">{row.data}</td>
              <td className="py-3 align-top text-sm leading-6 text-slate-600">{row.purpose ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const PrivacyPolicyArticle = ({ content, hidden }: { content: PrivacyContent; hidden: boolean }) => (
  <article lang={content.locale} dir={content.dir} className={classNames({ hidden })} aria-hidden={hidden}>
    <LegalSectionNav
      ariaLabel={content.locale === 'fa' ? 'بخش‌های سیاست حفظ حریم خصوصی' : 'Privacy policy sections'}
      items={content.sections.map(section => ({
        id: getSectionDomId(content.locale, section.id),
        title: section.title,
      }))}
    />

    <Card className="mt-4 !overflow-hidden !rounded-2xl !p-0 shadow-card md:mt-5">
      {content.sections.map((section, index) => (
        <section
          key={section.id}
          id={getSectionDomId(content.locale, section.id)}
          className={classNames('scroll-mt-24 px-4 py-5 md:px-6 md:py-6', {
            'border-t border-slate-100': index > 0,
          })}
        >
          <LegalSectionTitle className="mb-3">{section.title}</LegalSectionTitle>
          <div className="space-y-3">
            {section.paragraphs?.map(paragraph => (
              <LinkifiedText key={paragraph.slice(0, 32)} align={content.dir === 'rtl' ? 'justify' : 'start'}>
                {paragraph}
              </LinkifiedText>
            ))}
          </div>
          {section.dataRows && section.dataRows.length > 0 && <DataRows rows={section.dataRows} />}
        </section>
      ))}
    </Card>
  </article>
);

const PrivacyPolicy = () => {
  const [locale, setLocale] = useState<Locale>('fa');
  const alternateLocale: Locale = locale === 'fa' ? 'en' : 'fa';
  const isEnglish = locale === 'en';

  return (
    <LegalPageLayout
      lang={locale}
      dir={isEnglish ? 'ltr' : 'rtl'}
      breadcrumbs={
        isEnglish
          ? [
              { text: 'Home', href: '/' },
              { text: 'Privacy Policy' },
            ]
          : [
              { text: 'خانه', href: '/' },
              { text: 'حریم خصوصی' },
            ]
      }
      headerVariant="plain"
      title={
        <div className="space-y-2" dir={isEnglish ? 'ltr' : 'rtl'} lang={locale}>
          <LegalPageTitle className={classNames({ hidden: locale !== 'fa' })} lang="fa" dir="rtl">
            {privacyPolicyFa.pageTitle}
          </LegalPageTitle>
          <LegalPageTitle className={classNames({ hidden: locale !== 'en' })} lang="en" dir="ltr">
            {privacyPolicyEn.pageTitle}
          </LegalPageTitle>
          <button
            type="button"
            onClick={() => setLocale(alternateLocale)}
            className={classNames('text-xs text-slate-400 transition hover:text-slate-600', {
              'self-start': isEnglish,
              'self-end': !isEnglish,
            })}
            dir={alternateLocale === 'fa' ? 'rtl' : 'ltr'}
            lang={alternateLocale}
          >
            {alternateLocale === 'fa' ? 'فارسی' : 'English'}
          </button>
        </div>
      }
    >
      <PrivacyPolicyArticle content={privacyPolicyFa} hidden={locale !== 'fa'} />
      <PrivacyPolicyArticle content={privacyPolicyEn} hidden={locale !== 'en'} />
    </LegalPageLayout>
  );
};

export default PrivacyPolicy;
