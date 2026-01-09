import { useLoaderData } from 'react-router';

import { useBookingController } from '@/features/booking/hooks/use-creat-booking-controller';
import { CreateBookingView } from '@/features/booking/precenters/create-booking-view';
import type { TService } from '@/features/service/domain/service.entity';

export default function CreateBookingContainer() {
  const { serviceId, service } = useLoaderData() as { serviceId: string; service: TService };

  const bookingController = useBookingController(serviceId);

  return <CreateBookingView {...bookingController} service={service} />;
}
