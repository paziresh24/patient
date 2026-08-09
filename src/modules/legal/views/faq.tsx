import Card from '@/common/components/atom/card';
import Text from '@/common/components/atom/text';
import HeadphoneIcon from '@/common/components/icons/headphone';
import FaqAccordionItem from '../components/faqAccordionItem';
import LegalSectionNav from '../components/legalSectionNav';
import LegalPageLayout, { LegalPageTitle, LegalSectionCard } from '../components/legalPageLayout';
import { faqCategories, faqIntro, faqPageTitle, FAQ_SUPPORT_URL } from '../constants/faqContent';

const Faq = () => {
  return (
    <LegalPageLayout
      lang="fa"
      dir="rtl"
      headerVariant="plain"
      breadcrumbs={[
        { text: 'خانه', href: '/' },
        { text: 'سوالات متداول' },
      ]}
      title={<LegalPageTitle>{faqPageTitle}</LegalPageTitle>}
      intro={
        <Text as="p" fontSize="sm" className="max-w-3xl leading-6 text-slate-600" align="justify">
          {faqIntro}
        </Text>
      }
    >
      <LegalSectionNav items={faqCategories} ariaLabel="دسته‌بندی سوالات" />

      {faqCategories.map(category => (
        <LegalSectionCard key={category.id} id={category.id} title={category.title}>
          {category.items.map(item => (
            <FaqAccordionItem key={item.question} question={item.question} answer={item.answer} />
          ))}
        </LegalSectionCard>
      ))}

      <Card className="overflow-hidden !rounded-2xl border border-primary/10 bg-gradient-to-l from-primary/[0.06] to-white shadow-card">
        <div className="flex items-start gap-4 p-4 md:p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-sm">
            <HeadphoneIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <Text as="p" fontWeight="semiBold" fontSize="sm" className="leading-6 text-slate-900">
              پاسخ سوال خود را پیدا نکردید؟
            </Text>
            <Text as="p" fontSize="sm" className="mt-1.5 leading-6 text-slate-600">
              تیم پشتیبانی پذیرش۲۴ آماده پاسخگویی به سوالات شماست.
            </Text>
            <a
              href={FAQ_SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex h-10 items-center justify-center rounded-lg border border-primary bg-primary px-4 text-xs font-bold text-white transition hover:opacity-90"
            >
              ارتباط با پشتیبانی
            </a>
          </div>
        </div>
      </Card>
    </LegalPageLayout>
  );
};

export default Faq;
