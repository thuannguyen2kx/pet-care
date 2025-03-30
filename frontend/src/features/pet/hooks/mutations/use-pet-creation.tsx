import { PetFormDataType } from "@/features/pet/types/api.types";
import { useCreatePet } from "./create-pet";
import { useCreatePetWithPicture } from "./create-pet-with-picture";

/**
 * Hook kết hợp để tạo thú cưng mới với hoặc không có ảnh
 */
export const usePetCreation = () => {
  const createPet = useCreatePet();
  const createPetWithPicture = useCreatePetWithPicture();
  
  const handleCreatePet = async (
    data: PetFormDataType,
    file?: File
  ) => {
    try {
      if (file) {
        // Tạo FormData
        const formData = new FormData();
        formData.append("petPicture", file);
        
        // Thêm các trường dữ liệu khác
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined) {
            if (Array.isArray(value)) {
              formData.append(key, value.join(','));
            } else {
              formData.append(key, String(value));
            }
          }
        });
        
        // Gọi API tạo thú cưng với ảnh
        return await createPetWithPicture.mutateAsync(formData);
      } else {
        // Gọi API tạo thú cưng không có ảnh
        return await createPet.mutateAsync(data);
      }
    } catch (error) {
      console.error("Lỗi khi tạo thú cưng:", error);
      throw error;
    }
  };
  
  return {
    handleCreatePet,
    isCreating: createPet.isPending || createPetWithPicture.isPending,
  };
};