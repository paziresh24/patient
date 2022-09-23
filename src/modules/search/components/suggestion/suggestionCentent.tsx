import useResponsive from '@/common/hooks/useResponsive';
import clsx from 'clsx';
import { createElement, HTMLAttributes, ReactElement } from 'react';
import { createPortal } from 'react-dom';
import { ComponentSection, Item, Section } from '../../types/suggestion';
import CategoryBar from './suggestionAtoms/categoryBar';
import CardSection from './suggestionSection/card';
import SearchSection from './suggestionSection/search';
import SliderSection from './suggestionSection/slider';
import TextSection from './suggestionSection/text';
import TreeSection from './suggestionSection/tree';

interface SuggestionCententProps extends HTMLAttributes<HTMLDivElement> {
  items: Section[];
  searchInput?: ReactElement;
}

export const SuggestionCentent = (props: SuggestionCententProps) => {
  const { className, items, searchInput } = props;
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
      className={clsx(
        'fixed right-0 overflow-hidden top-0 h-full z-infinity md:absolute md:h-96 md:top-16 w-full flex flex-col bg-slate-100 rounded-bl-xl rounded-br-xl',
        className,
      )}
    >
      {searchInput && <div className="p-2 bg-white shadow-sm z-20 stiky top-0">{searchInput}</div>}
      <div className="flex flex-col overflow-auto">
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

export default SuggestionCentent;
