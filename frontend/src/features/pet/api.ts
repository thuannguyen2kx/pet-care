import API from "@/lib/axios-client";
import {
  GetPetResponse,
  GetPetsResponse,
  MedicalRecordType,
  MutationPetResponse,
  PetFormDataType,
  VaccinationType,
} from "./types/api.types";

// API functions
export const getPetsQueryFn = async (userId: string): Promise<GetPetsResponse> => {
  const response = await API.get(`/pets/${userId}`);
  return response.data;
};
export const getPetQueryFn = async (petId: string): Promise<GetPetResponse> => {
  const response = await API.get(`/pets/details/${petId}`);
  return response.data;
};
export const createPetMutationFn = async (
  data: PetFormDataType
): Promise<MutationPetResponse> => {
  const response = await API.post("/pets", data);
  return response.data;
};

export const createPetWithPictureMutationFn = async (
  formData: FormData
): Promise<MutationPetResponse> => {
  const response = await API.post("/pets/with-picture", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updatePetMutationFn = async ({
  petId,
  data,
}: {
  petId: string;
  data: Partial<PetFormDataType>;
}): Promise<MutationPetResponse> => {
  const response = await API.put(`/pets/${petId}`, data);
  return response.data;
};

export const deletePetMutationFn = async (petId: string) => {
  const response = await API.delete(`/pets/${petId}`);
  return response.data;
};

export const updatePetPictureMutationFn = async ({
  petId,
  data,
}: {
  petId: string;
  data: FormData;
}): Promise<MutationPetResponse> => {
  const response = await API.post(`/pets/${petId}/picture`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const addVaccinationMutationFn = async ({
  petId,
  data,
}: {
  petId: string;
  data: Omit<VaccinationType, "date" | "expiryDate"> & {
    date: string;
    expiryDate?: string;
  };
}): Promise<MutationPetResponse> => {
  const response = await API.post(`/pets/${petId}/vaccinations`, data);
  return response.data;
};

export const addMedicalRecordMutationFn = async ({
  petId,
  data,
}: {
  petId: string;
  data: Omit<MedicalRecordType, "diagnosis"> & {
    diagnosis: string;
  };
}) => {
  const response = await API.post(`/pets/${petId}/medical`, data);
  return response.data;
};
