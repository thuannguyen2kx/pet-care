// features/pets/config/create-pet-steps.ts

import type { TCreatePetFormStep } from '@/features/pets/schemas';

export const CREATE_PET_STEP_CONFIG: Record<
  TCreatePetFormStep,
  {
    title: string;
    description: string;
  }
> = {
  1: {
    title: 'Thông tin cơ bản',
    description: 'Cho chúng tôi biết về thú cưng của bạn',
  },
  2: {
    title: 'Thông tin thú cưng',
    description: 'Thêm thông tin chi tiết để chăm sóc tốt hơn',
  },
  3: {
    title: 'Thông tin hồ sơ',
    description: 'Ghi chú về sức khoẻ và dị ứng',
  },
};
