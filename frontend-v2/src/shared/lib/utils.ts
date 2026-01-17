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

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export const fileToUrl = (file?: File) => {
  return file ? URL.createObjectURL(file) : undefined;
};

export function formatDateVN(date?: Date | null) {
  if (!date) return '—';
  return date.toLocaleDateString('vi-VN');
}
export function removeUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined),
  ) as Partial<T>;
}

export function formatCurrency(number: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(number);
}
