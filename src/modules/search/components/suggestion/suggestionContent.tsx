import useResponsive from '@/common/hooks/useResponsive';
import classNames from '@/common/utils/classNames';
import dynamic from 'next/dynamic';
import { createElement, HTMLAttributes, ReactElement } from 'react';
import { createPortal } from 'react-dom';
import { ComponentSection, Item, Section } from '../../types/suggestion';
const CategoryBar = dynamic(() => import('./suggestionAtoms/categoryBar'));
const CardSection = dynamic(() => import('./suggestionSection/card'));
const SearchSection = dynamic(() => import('./suggestionSection/search'));
const SliderSection = dynamic(() => import('./suggestionSection/slider'));
const TextSection = dynamic(() => import('./suggestionSection/text'));
const TreeSection = dynamic(() => import('./suggestionSection/tree'));

interface SuggestionContentProps extends HTMLAttributes<HTMLDivElement> {
  items: Section[];
  searchInput?: ReactElement;
  isLoading: boolean;
}

export const SuggestionContent = (props: SuggestionContentProps) => {
  const { className, items, searchInput, isLoading } = props;
  const { isMobile } = useResponsive();

  const wrapper = (children: ReactElement, container: Element) => {
    return isMobile ? createPortal(children, container) : children;
  };

  const Sections = {
    text: TextSection,
    slider: SliderSection,
    tree: TreeSection,
    card: CardSection,
    search: SearchSection,
  };

  const Component = ({ type, items }: { type: ComponentSection; items: Item[] }) => {
    return createElement(Sections[type], {
      items,
    });
  };

  return wrapper(
    <div
      className={classNames(
        'fixed right-0 overflow-hidden top-0 h-full z-infinity md:absolute md:top-16 w-full flex flex-col bg-slate-100 md:rounded-bl-xl md:rounded-br-xl',
        className,
      )}
    >
      {searchInput && <div className="top-0 z-20 p-2 bg-white shadow-sm stiky">{searchInput}</div>}
      <div
        className={classNames(
          'invisible relative z-50 h-[1px] rounded-full bg-gradient-to-r from-transparent via-slate-400 to-transparent w-56 animate-progress',
          {
            '!visible': isLoading,
          },
        )}
      />
      <div className="flex flex-col overflow-auto no-scroll">
        {items?.map(({ items, component, ...section }, index) => (
          <div key={index}>
            {component !== 'search' && <CategoryBar {...section} />}
            <Component type={component} items={items} />
          </div>
        ))}
      </div>
    </div>,
    document.body,
  );
};

export default SuggestionContent;
