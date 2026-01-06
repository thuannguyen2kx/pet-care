import type { Specialty } from '@/features/employee/constants';
import type { TCategory } from '@/features/service/constants';

export type TService = {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: TCategory;
  requiredSpecialties: Specialty[];
  images: {
    url: string;
    publicId: string;
    _id: string;
  }[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
