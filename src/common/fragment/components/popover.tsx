/* eslint-disable react/display-name */
import { CodeComponentMeta } from '@plasmicapp/host';
import * as RadixPopover from '@radix-ui/react-popover';
import { ReactNode, forwardRef, useEffect, useImperativeHandle, useState } from 'react';

type PopoverType = {
  trigger: ReactNode;
  content: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const Popover = forwardRef(({ trigger, content, open, onOpenChange }: PopoverType, ref) => {
  const [isOpen, setIsOpen] = useState(open);
  useImperativeHandle(
    ref,
    () => {
      return {
        open() {
          setIsOpen(true);
        },
        close() {
          setIsOpen(false);
        },
      };
    },
    [],
  );

  useEffect(() => {
    onOpenChange(isOpen);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    <RadixPopover.Root open={isOpen} onOpenChange={setIsOpen}>
      <RadixPopover.Trigger>{trigger}</RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content className="overflow-visible outline-none">{content}</RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
});

export const popoverMeta: CodeComponentMeta<PopoverType> = {
  name: 'Popover',
  displayName: 'Fragment/Popover',
  importPath: '@/common/fragment/components/popover',
  figmaMappings: [{ figmaComponentName: 'Popover' }],
  props: {
    trigger: 'slot',
    content: 'slot',
    open: {
      type: 'boolean',
      defaultValue: false,
    },
    onOpenChange: {
      type: 'eventHandler',
      argTypes: [
        {
          name: 'open',
          type: 'boolean',
        },
      ],
    },
  },
  refActions: {
    open: {
      argTypes: [],
      displayName: 'Open',
    },
    close: {
      argTypes: [],
      displayName: 'Close',
    },
  },
  states: {
    open: {
      type: 'writable',
      variableType: 'boolean',
      valueProp: 'open',
      onChangeProp: 'onOpenChange',
    },
  },
};
