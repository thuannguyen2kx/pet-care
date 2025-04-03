import {z} from "zod"
// Định nghĩa schema cho đối tượng hình ảnh đã tồn tại
const imageSchema = z.object({
  url: z.string().url({ message: 'URL không hợp lệ' }),
  publicId: z.string().optional(),
});

// Schema cho file ảnh upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const fileSchema = z.instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, 
    `Kích thước file tối đa là 5MB`)
  .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), 
    `Chỉ chấp nhận các định dạng .jpg, .jpeg, .png và .webp`);

// Schema cho biểu mẫu dịch vụ
export const serviceFormSchema = z.object({
  name: z.string().min(3, { message: 'Tên dịch vụ phải có ít nhất 3 ký tự' }),
  description: z.string().optional(),
  price: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().min(0, { message: 'Giá phải là số dương' })
  ),
  duration: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().int().min(1, { message: 'Thời lượng phải ít nhất 1 phút' })
  ),
  category: z.string({ required_error: 'Vui lòng chọn danh mục' }),
  applicablePetTypes: z.array(z.string()).min(1, { message: 'Chọn ít nhất một loại thú cưng' }),
  applicablePetSizes: z.array(z.string()).optional(),
  images: z.array(imageSchema).optional(),
  isActive: z.boolean().default(true),
});