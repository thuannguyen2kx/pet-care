import { z } from 'zod';

import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/shared/constant';

export const petImageSchema = z
  .instanceof(File, { message: 'Vui lòng tải ảnh thú cưng' })
  .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), 'Chỉ hỗ trợ JPG, PNG, WEBP')
  .refine((file) => file.size <= MAX_FILE_SIZE, 'Dung lượng ảnh tối đa 2MB');
