import type { CreateBookingDto } from '@/features/booking/domain/booking.dto';
import {
  createBookingSchema,
  type CompleteCreateBookingDraft,
  type CreateBooking,
  type CreateBookingDraft,
} from '@/features/booking/domain/booking.state';

// ====================
// DTO => Entity
// ====================

// ====================
// State => DTO
// ====================

export function mapCreateBookingToDto(input: CreateBooking): CreateBookingDto {
  return {
    serviceId: input.serviceId,
    petId: input.petId,
    employeeId: input.employeeId,
    scheduledDate: input.scheduledDate,
    startTime: input.startTime,
    customerNotes: input.customerNotes,
  };
}
export function mapDraftToCreateBookingInput(draft: CreateBookingDraft): CreateBooking {
  return createBookingSchema.parse(draft);
}
// ====================
// Helpers
// ====================
export function createInitialBookingDraf(serviceId: string): CreateBookingDraft {
  return {
    serviceId,
    petId: null,
    employeeId: null,
    scheduledDate: null,
    startTime: null,
    customerNotes: '',
  };
}

export function resetBookingDraftFiels(
  bookingDraft: CreateBookingDraft,
  fields: (keyof CreateBookingDraft)[],
): CreateBookingDraft {
  const reset: Partial<CreateBookingDraft> = {};

  fields.forEach((field) => {
    if (field === 'customerNotes') {
      reset[field] = '';
    } else if (field !== 'serviceId') {
      reset[field] = null;
    }
  });

  return { ...bookingDraft, ...reset };
}
