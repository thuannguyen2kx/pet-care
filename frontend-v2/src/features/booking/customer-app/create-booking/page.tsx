import { useLoaderData } from 'react-router';

import { useCreateBookingController } from '@/features/booking/customer-app/create-booking/application/use-create-booking-controller';
import { CreateBookingView } from '@/features/booking/customer-app/create-booking/ui/create-booking-view';

export default function CreateBookingPage() {
  const { serviceId } = useLoaderData() as { serviceId: string };

  const bookingController = useCreateBookingController(serviceId);

  return <CreateBookingView {...bookingController} />;
}
