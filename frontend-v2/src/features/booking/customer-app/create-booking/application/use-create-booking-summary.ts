import { useMemo } from 'react';

import type { BookableEmployee } from '@/features/availability/domain';
import type { CreateBookingDraft } from '@/features/booking/domain/booking.state';
import type { TPet } from '@/features/pets/types';
import type { TService } from '@/features/service/domain/service.entity';

interface UseBookingSummaryParams {
  draft: CreateBookingDraft;
  service?: TService;
  pets?: TPet[];
  employees?: BookableEmployee[];
}

/**
 * Computes a summary of the booking draft for display.
 *
 * Memoizes the summary to avoid unnecessary recalculations.
 *
 * @param params - Draft and reference data
 * @returns Computed booking summary
 *
 * @example
 * ```tsx
 * const summary = useBookingSummary({
 *   draft,
 *   service,
 *   pets,
 *   employees
 * });
 *
 * console.log(summary.totalAmount); // Service price
 * ```
 */
export function useBookingSummary({ draft, service, pets, employees }: UseBookingSummaryParams) {
  return useMemo(() => {
    const selectedPet = pets?.find((p) => p._id === draft.petId);
    const selectedEmployee = employees?.find((e) => e.employeeId === draft.employeeId);

    return {
      service,
      pet: selectedPet,
      employee: selectedEmployee,
      date: draft.scheduledDate,
      startTime: draft.startTime,
      notes: draft.customerNotes,
      totalAmount: service?.price || 0,
    };
  }, [draft, service, pets, employees]);
}
