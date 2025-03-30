export type VaccinationType = {
  name: string;
  date: Date;
  expiryDate?: Date;
  certificate?: string;
}

export type MedicalRecordType = {
  condition: string;
  diagnosis: Date;
  treatment?: string;
  notes?: string;
}

export type PetType = {
  _id: string
  ownerId: string;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  weight?: number;
  gender?: string;
  vaccinations?: VaccinationType[];
  medicalHistory?: MedicalRecordType[];
  habits?: string[];
  allergies?: string[];
  specialNeeds?: string;
  profilePicture?: {
    url: string | null;
    publicId: string | null
  };
  createdAt: Date;
  updatedAt: Date;
}
export type PetFormDataType = {
  name: string;
  species: string;
  breed?: string;
  age?: number;
  weight?: number;
  gender?: string;
  habits?: string[];
  allergies?: string[];
  specialNeeds?: string;
}
export type GetPetsResponse = {
  message: string,
  pets: PetType[]
}
export type GetPetResponse = {
  message: string,
  pet: PetType
}
export type MutationPetResponse = {
  message: string,
  pet: PetType
}