export const availabilityQueryKeys = {
  all: ['availability'] as const,
  bookableEmployees: () => [...availabilityQueryKeys.all, 'bookable-employees'] as const,
  bookableEmployeesByService: (serviceId: string) =>
    [...availabilityQueryKeys.bookableEmployees(), serviceId] as const,
  availableSlots: () => [...availabilityQueryKeys.all, 'available-slots'] as const,
  availableSlotsByEmployeeAndDate: (params: {
    serviceId: string;
    employeeId: string;
    date: string;
  }) => [...availabilityQueryKeys.availableSlots(), params] as const,
};
