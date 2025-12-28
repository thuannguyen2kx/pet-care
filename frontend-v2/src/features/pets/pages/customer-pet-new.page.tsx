import { CustomerPetNewPrecenter } from '@/features/pets/presenters/customer-pet-new.precenter';
import { BackLink } from '@/shared/components/template/back-link';
import { paths } from '@/shared/config/paths';

export default function CustomerPetNewPage() {
  return (
    <main className="container mx-auto max-w-2xl px-4 py-6">
      <BackLink to={paths.customer.pets.path} label="Quay lại danh sách" />
      <CustomerPetNewPrecenter />
    </main>
  );
}
