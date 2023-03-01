import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
export default function classNames(...classes: unknown[]) {
  return twMerge(clsx(classes));
}
