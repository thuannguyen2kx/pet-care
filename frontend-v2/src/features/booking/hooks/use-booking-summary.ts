import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useMemo } from 'react';

import type { TAvailableEmployee } from '@/features/booking/api/types';
import type { BookingDraft } from '@/features/booking/hooks/use-creat-booking-controller';
import type { TPet } from '@/features/pets/types';
import type { TService } from '@/features/service/domain/service.entity';
export interface BookingSummaryItem {
  label: string;
  value: string;
  isSelected: boolean;
  icon: React.ReactNode;
  extra?: React.ReactNode;
}

export interface BookingSummaryUIModel {
  items: BookingSummaryItem[];
  totalPrice: number;
  durationText?: string;
}

interface UseBookingSummaryParams {
  draft: BookingDraft;
  service?: TService;
  pets?: TPet[];
  employees?: TAvailableEmployee[];
}

export interface BookingSummary {
  service?: TService;
  pet?: TPet;
  employee?: TAvailableEmployee;
  dateText?: string;
  timeText?: string;
  price: number;
  duration?: number;
  notes?: string;
}
export function useBookingSummary({
  draft,
  service,
  pets,
  employees,
}: UseBookingSummaryParams): BookingSummary {
  return useMemo(() => {
    const pet = pets?.find((p) => p._id === draft.petId);
    const employee = employees?.find((e) => e._id === draft.employeeId);

    const dateText = draft.date ? format(draft.date, 'dd/MM/yyyy', { locale: vi }) : undefined;

    return {
      service,
      pet,
      employee,
      dateText,
      timeText: draft.time ?? undefined,
      price: service?.price ?? 0,
      duration: service?.duration,
      notes: draft.notes,
    };
  }, [draft, service, pets, employees]);
}
