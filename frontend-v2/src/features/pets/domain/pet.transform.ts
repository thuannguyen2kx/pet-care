import { format } from 'date-fns';

import type {
  PetDto,
  PetMedicalRecordDto,
  PetsQueryDto,
  PetVaccinationDto,
  UpdatePetDto,
} from '@/features/pets/domain/pet.dto';
import type { Pet, PetMedicalRecord, PetVaccination } from '@/features/pets/domain/pet.entity';
import type { CreatePet, PetsQuery, UpdatePet } from '@/features/pets/domain/pet.state';

// ====================
// State => Dto
// ====================
export const mapPetsQueryToDto = (state: PetsQuery): PetsQueryDto => {
  return {
    search: state.search,
    page: state.page,
    limit: state.limit,
    type: state.type,
    gender: state.gender,
    minAge: state.minAge,
    maxAge: state.maxAge,
    minWeight: state.minWeight,
    maxWeight: state.maxWeight,
    isNeutered: state.isNeutered,
    hasUpcomingVaccinations: state.hasUpcomingVaccinations,
  };
};

export const mapUpdatePetToDto = (state: UpdatePet): UpdatePetDto => {
  switch (state.kind) {
    case 'info':
      return {
        name: state.name,
        type: state.type,
        breed: state.breed,
        gender: state.gender,
        dateOfBirth: state.dateOfBirth ? format(state.dateOfBirth, 'yyyy-MM-dd') : undefined,
        weight: state.weight,
        color: state.color,
      };

    case 'allergies':
      return {
        allergies: state.allergies.map((a) => a.value),
      };
    case 'medicalNotes':
      return {
        medicalNotes: state.medicalNotes,
      };
  }
};
export const mapCreatePetToDto = (state: CreatePet) => {
  return {
    name: state.name,
    type: state.type,
    breed: state.breed,
    gender: state.gender,
    weight: state.weight,
    color: state.color,
    microchipId: state.microchipId,
    isNeutered: state.isNeutered,
    dateOfBirth: state.dateOfBirth ? state.dateOfBirth.toISOString() : undefined,
    allergies: state.allergies?.map((a) => a.value),
    medicalNotes: state.medicalNotes,
    petImage: state.petImage,
  };
};
export const buildCreatePetFormData = (dto: ReturnType<typeof mapCreatePetToDto>) => {
  const formData = new FormData();

  Object.entries(dto).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (key === 'petImage' && value instanceof File) {
      formData.append(key, value);
      return;
    }

    if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
      return;
    }

    formData.append(key, String(value));
  });

  return formData;
};
// =======================
// Dto => Entity
// =======================
export const mapPetVaccinationDtoToEntity = (dto: PetVaccinationDto): PetVaccination => {
  return {
    id: dto._id,
    name: dto.name,
    date: new Date(dto.date),
    expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
    nextDueDate: dto.nextDueDate ? new Date(dto.nextDueDate) : undefined,
    batchNumber: dto.batchNumber,
    veterinarianName: dto.veterinarianName,
    clinicName: dto.clinicName,
    certificate: dto.certificate,
    notes: dto.notes,
  };
};
export const mapPetMedicalRecordDtoToEntity = (dto: PetMedicalRecordDto): PetMedicalRecord => {
  return {
    id: dto._id,
    condition: dto.condition,
    diagnosis: new Date(dto.diagnosis),
    treatment: dto.treatment,
    veterinarianName: dto.veterinarianName,
    clinicName: dto.clinicName,
    followUpDate: dto.followUpDate ? new Date(dto.followUpDate) : undefined,
    cost: dto.cost,
    notes: dto.notes,
  };
};
export const mapPetDtoToEntity = (dto: PetDto): Pet => {
  return {
    id: dto._id,
    name: dto.name,
    ownerId: dto.ownerId,
    type: dto.type,
    breed: dto.breed,
    gender: dto.gender,
    dateOfBirth: new Date(dto.dateOfBirth),
    weight: dto.weight,
    color: dto.color,
    microchipId: dto.microchipId,
    isNeutered: dto.isNeutered,
    allergies: dto.allergies,
    medicalNotes: dto.medicalNotes,
    vaccinations: dto.vaccinations?.map(mapPetVaccinationDtoToEntity),
    medicalHistory: dto.medicalHistory?.map(mapPetMedicalRecordDtoToEntity),
    image: dto.image.url ?? null,
    isActive: dto.isActive,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  };
};

export const mapPetsDtoToEntities = (dtos: PetDto[]): Pet[] => dtos.map(mapPetDtoToEntity);
