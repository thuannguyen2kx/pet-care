import type { Gender, PetType } from '../constant/pet';

export type TVaccination = {
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
};

export type TMedicalRecord = {
  _id: string;
  condition: string;
  diagnosis: string; // ISO date string
  treatment?: string;
  veterinarianName?: string;
  clinicName?: string;
  followUpDate?: string;
  cost?: number;
  notes?: string;
};
export type TPet = {
  _id: string;
  ownerId: string;
  name: string;
  type: PetType;
  breed: string;
  gender: Gender;
  dateOfBirth: string; // ISO date string
  weight: number;
  color: string;
  microchipId?: string;
  isNeutered: boolean;
  allergies: string[];
  medicalNotes?: string;
  vaccinations?: TVaccination[];
  medicalHistory?: TMedicalRecord[];
  image?: {
    url: string | null;
    publicId: string | null;
  };
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};
export type TPetList = {
  pets: TPet[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
export type TPetStatsResponse = {
  totalPets: number;
  byType: Record<PetType, number>;
  byGender: Record<Gender, number>;
  upcomingVaccinations: number;
};
export type TPetFilterQuery = {
  search?: string;
  type?: PetType;
  gender?: Gender;
  minAge?: number;
  maxAge?: number;
  minWeight?: number;
  maxWeight?: number;
  isNeutered?: boolean;
  hasUpcomingVaccinations?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'dateOfBirth' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
};
