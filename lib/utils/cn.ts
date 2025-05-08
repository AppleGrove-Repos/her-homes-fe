import clsx, { ClassValue } from 'clsx';
import { ClassNameValue, twMerge } from 'tailwind-merge';

export const cn = (...classValues: ClassNameValue[]) => {
  return clsx(twMerge(...classValues));
};
