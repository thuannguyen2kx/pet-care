import type {
  AvailableSlotDto,
  AvailableSlotsQueryDto,
  BookableEmployeeDto,
} from '@/features/availability/domain/availability.dto';
import type {
  AvailableSlot,
  BookableEmployee,
} from '@/features/availability/domain/availability.entity';
import type { AvailableSlotsQuery } from '@/features/availability/domain/availability.state';

// =====================
// DTO => Entity
// =====================
export function mapAvailableSlotDtoToEntity(dto: AvailableSlotDto): AvailableSlot {
  return {
    startTime: dto.startTime,
    endTime: dto.endTime,
    available: dto.available,
  };
}

export function mapAvailableSlotDtosToEntities(dtos: AvailableSlotDto[]): AvailableSlot[] {
  return dtos.map(mapAvailableSlotDtoToEntity);
}

export function mapBookableEmployeeDtoToEntity(dto: BookableEmployeeDto): BookableEmployee {
  return {
    employeeId: dto._id,
    fullName: dto.fullName,
    avatar: dto.avatar ?? undefined,
    specialties: dto.specialties,
    rating: dto.rating,
    completedServices: dto.completedServices,
  };
}

export function mapBookableEmployeeDtosToEntities(dtos: BookableEmployeeDto[]): BookableEmployee[] {
  return dtos.map(mapBookableEmployeeDtoToEntity);
}

// =====================
// State => DTO
// =====================
export function mapAvailableSlotsQueryToDto(query: AvailableSlotsQuery): AvailableSlotsQueryDto {
  return {
    employeeId: query.employeeId,
    date: query.date,
    serviceId: query.serviceId,
  };
}
