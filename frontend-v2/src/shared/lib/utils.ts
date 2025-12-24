import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name?: string, max = 2) => {
  if (!name) return '';

  return name
    .trim()
    .split(/\s+/)
    .slice(0, max)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
};
