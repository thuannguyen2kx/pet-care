import { useAdminServiceController } from '@/features/service/hooks/use-admin-service-controller';
import { AdminServicesPrecenter } from '@/features/service/precenters/admin-service-precenter';

export default function AdminServicesContainer() {
  const controller = useAdminServiceController();
  return <AdminServicesPrecenter {...controller} />;
}
