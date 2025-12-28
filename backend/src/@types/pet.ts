import { PetGender, PetType } from "../enums/pet";
export interface VaccinationResponse {
  _id: string;
  name: string;
  date: string; // ISO date string
  expiryDate?: string;
  nextDueDate?: string;
  batchNumber?: string;
  veterinarianName?: string;
  clinicName?: string;
  certificate?: string;
  notes?: string;
}

export interface MedicalRecordResponse {
  _id: string;
  condition: string;
  diagnosis: string; // ISO date string
  treatment?: string;
  veterinarianName?: string;
  clinicName?: string;
  followUpDate?: string;
  cost?: number;
  notes?: string;
}
export interface PetResponse {
  _id: string;
  ownerId: string;
  name: string;
  type: PetType;
  breed: string;
  gender: PetGender;
  dateOfBirth: string; // ISO date string
  weight: number;
  color: string;
  microchipId?: string;
  isNeutered: boolean;
  allergies: string[];
  medicalNotes?: string;
  vaccinations?: VaccinationResponse[];
  medicalHistory?: MedicalRecordResponse[];
  image?: {
    url: string | null;
    publicId: string | null;
  };
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
export interface PetListResponse {
  pets: PetResponse[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
export interface PetStatsResponse {
  totalPets: number;
  byType: Record<PetType, number>;
  byGender: Record<PetGender, number>;
  upcomingVaccinations: number;
}
export interface PetFilterQuery {
  search?: string;
  type?: PetType;
  gender?: PetGender;
  minAge?: number;
  maxAge?: number;
  minWeight?: number;
  maxWeight?: number;
  isNeutered?: boolean;
  hasUpcomingVaccinations?: boolean;
  page?: number;
  limit?: number;
  sortBy?: "name" | "dateOfBirth" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}
