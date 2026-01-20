import type { CreatePetStepSchemas } from '@/features/pets/domain/pet.state';

type CreatePetStepConfig = {
  title: string;
  description: string;
};
export const CREATE_PET_STEP_CONFIG: Record<
  keyof typeof CreatePetStepSchemas,
  CreatePetStepConfig
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

// ===================
// Helpers
// ==================
export function getCreatePetStepConfig(step: keyof typeof CreatePetStepSchemas) {
  return CREATE_PET_STEP_CONFIG[step];
}
