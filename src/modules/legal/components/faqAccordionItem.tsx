import ChevronIcon from '@/common/components/icons/chevron';
import Text from '@/common/components/atom/text';
import LinkifiedText from './linkifiedText';

type FaqAccordionItemProps = {
  question: string;
  answer: string;
};

export const FaqAccordionItem = ({ question, answer }: FaqAccordionItemProps) => (
  <details className="group border-b border-slate-100 last:border-0">
    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-4 py-4 transition-colors hover:bg-slate-50/80 md:px-5 [&::-webkit-details-marker]:hidden">
      <Text as="span" fontSize="sm" fontWeight="semiBold" className="min-w-0 flex-1 leading-6 text-slate-900">
        {question}
      </Text>
      <span className="mt-1 inline-flex shrink-0 text-slate-400 transition-transform duration-200 rotate-90 group-open:rotate-[270deg]">
        <ChevronIcon dir="right" style={{ transform: 'none' }} />
      </span>
    </summary>
    <div className="px-4 pb-4 md:px-5">
      <LinkifiedText>{answer}</LinkifiedText>
    </div>
  </details>
);

export default FaqAccordionItem;
