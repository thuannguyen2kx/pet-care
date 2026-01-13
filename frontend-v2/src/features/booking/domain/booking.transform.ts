import type { GetBookingsResponseDto } from '@/features/booking/domain/booking-http-schema';
import type {
  BookingDto,
  BookingQueryDto,
  CancelBookingDto,
  CreateBookingDto,
} from '@/features/booking/domain/booking.dto';
import type {
  Booking,
  BookingStatus,
  Pagination,
  PaymentStatus,
  PetType,
  ServiceCategory,
} from '@/features/booking/domain/booking.entity';
import {
  createBookingSchema,
  type CancelBooking,
  type CreateBooking,
  type CreateBookingDraft,
  type CustomerBookingQuery,
} from '@/features/booking/domain/booking.state';

// ====================
// DTO => Entity
// ====================
export function mapBookingDtoToEntity(dto: BookingDto): Booking {
  return {
    id: dto._id,

    customer: {
      id: dto.customerId._id,
      fullName: dto.customerId.fullName,
      email: dto.customerId.email,
      profilePicture: dto.customerId.profilePicture,
    },

    pet: {
      id: dto.petId._id,
      name: dto.petId.name,
      type: dto.petId.type as PetType,
      breed: dto.petId.breed,
      image: dto.petId.image.url || undefined,
    },

    employee: {
      id: dto.employeeId._id,
      fullName: dto.employeeId.fullName,
      profilePicture: dto.employeeId.profilePicture,
      specialties: dto.employeeId.employeeInfo.specialties as ServiceCategory[],
    },

    service: {
      id: dto.serviceId._id,
      name: dto.serviceId.name,
      price: dto.serviceId.price,
      duration: dto.serviceId.duration,
      category: dto.serviceId.category as ServiceCategory,
    },

    scheduledDate: dto.scheduledDate,
    startTime: dto.startTime,
    endTime: dto.endTime,
    duration: dto.duration,

    serviceSnapshot: {
      name: dto.serviceSnapshot.name,
      price: dto.serviceSnapshot.price,
      duration: dto.serviceSnapshot.duration,
      category: dto.serviceSnapshot.category as ServiceCategory,
    },

    status: dto.status as BookingStatus,
    statusHistory: dto.statusHistory.map((entry) => ({
      id: entry._id,
      status: entry.status as BookingStatus,
      changedAt: entry.changedAt,
      changedBy: entry.changedBy,
      reason: entry.reason,
    })),

    paymentStatus: dto.paymentStatus as PaymentStatus,
    totalAmount: dto.totalAmount,
    paidAmount: dto.paidAmount,
    paymentMethod: dto.paymentMethod,
    transactionId: dto.transactionId,

    customerNotes: dto.customerNotes,
    employeeNotes: dto.employeeNotes,
    internalNotes: dto.internalNotes,

    reminderSent: dto.reminderSent,
    reminderSentAt: dto.reminderSentAt,

    cancelledAt: dto.cancelledAt,
    cancelledBy: dto.cancelledBy,
    cancellationReason: dto.cancellationReason,

    completedAt: dto.completedAt,
    completedBy: dto.completedBy,

    rating: dto.rating,

    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

export function mapBookingsDtoToEntities(dtos: BookingDto[]): Booking[] {
  return dtos.map(mapBookingDtoToEntity);
}
export function mapGetBookingsResponseDtoToResult(dto: GetBookingsResponseDto): {
  bookings: Booking[];
  pagination: Pagination;
} {
  return {
    bookings: mapBookingsDtoToEntities(dto.bookings),
    pagination: dto.pagination,
  };
}
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
export function mapCustomerBookingQueryToDto(query: CustomerBookingQuery): BookingQueryDto {
  return {
    status: query.status,
    page: query.page,
    limit: query.limit,
  };
}
export function mapCancelBookingToDto(cancelBooking: CancelBooking): CancelBookingDto {
  return {
    reason: cancelBooking.reason,
  };
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
