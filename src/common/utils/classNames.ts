import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function classNames(...classes: ClassValue[]) {
  return twMerge(clsx(classes));
}
