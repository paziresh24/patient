import Text from '@/common/components/atom/text';
import ChevronIcon from '@/common/components/icons/chevron';
import LegalPageLayout, { LegalSectionCard } from '../components/legalPageLayout';
import {
  CONTACT_FAQ_URL,
  CONTACT_SUPPORT_URL,
  contactEmail,
  contactPhone,
  officeAddress,
  postalCode,
  workingHours,
} from '../constants/contactContent';

const InfoRow = ({ label, value, href, plaintext }: { label: string; value: string; href?: string; plaintext?: boolean }) => (
  <div className="px-4 py-4 md:px-5">
    <Text as="p" fontSize="xs" fontWeight="medium" className="leading-5 text-slate-500">
      {label}
    </Text>
    {href ? (
      <a href={href} className="mt-1 inline-block text-sm font-semibold leading-6 text-primary transition hover:opacity-80">
        <span style={{ unicodeBidi: 'plaintext' }}>{value}</span>
      </a>
    ) : (
      <Text as="p" fontSize="sm" fontWeight="semiBold" className="mt-1 leading-6 text-slate-900">
        <span style={plaintext ? { unicodeBidi: 'plaintext' } : undefined}>{value}</span>
      </Text>
    )}
  </div>
);

const LinkRow = ({ href, title, description }: { href: string; title: string; description: string }) => (
  <a
    href={href}
    target={href.startsWith('http') ? '_blank' : undefined}
    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
    className="flex items-center justify-between gap-4 px-4 py-4 transition-colors hover:bg-slate-50/80 md:px-5"
  >
    <div className="min-w-0">
      <Text as="p" fontSize="sm" fontWeight="semiBold" className="leading-6 text-slate-900">
        {title}
      </Text>
      <Text as="p" fontSize="sm" className="mt-1 leading-6 text-slate-500">
        {description}
      </Text>
    </div>
    <ChevronIcon dir="left" className="h-3 w-3 shrink-0 text-slate-300" />
  </a>
);

const ContactUs = () => {
  return (
    <LegalPageLayout
      lang="fa"
      dir="rtl"
      headerVariant="plain"
      breadcrumbs={[
        { text: 'خانه', href: '/' },
        { text: 'تماس با ما' },
      ]}
    >
      <LegalSectionCard title="راه‌های ارتباطی">
        <div className="divide-y divide-slate-100">
          <LinkRow href={CONTACT_SUPPORT_URL} title="پشتیبانی" description="ثبت درخواست در پشتیبانی" />
          <LinkRow href={CONTACT_FAQ_URL} title="سوالات متداول" description="پاسخ سوالات پرتکرار بیماران و پزشکان" />
          <InfoRow label={contactPhone.label} value={contactPhone.value} href={contactPhone.href} />
          <InfoRow label={contactEmail.label} value={contactEmail.value} href={contactEmail.href} />
        </div>
      </LegalSectionCard>

      <LegalSectionCard title="دفتر پذیرش۲۴">
        <div className="divide-y divide-slate-100">
          <InfoRow label={officeAddress.label} value={officeAddress.value} />
          <InfoRow label={postalCode.label} value={postalCode.value} plaintext />
          <InfoRow label={workingHours.label} value={workingHours.value} />
        </div>
      </LegalSectionCard>
    </LegalPageLayout>
  );
};

export default ContactUs;
