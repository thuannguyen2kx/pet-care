import { useNavigate, useParams } from 'react-router';

import { useDeletePet } from '@/features/pets/api/delete-pet';
import { useGetPet } from '@/features/pets/api/get-pet';
import { PetDetailView } from '@/features/pets/customer-app/pet-detail/ui/pet-detail-view';
import { PetNotFound } from '@/features/pets/customer-app/pet-detail/ui/pet-not-found';
import { FullscrenSpinner } from '@/shared/components/template/loading';
import { paths } from '@/shared/config/paths';
import { useConfirm } from '@/shared/hooks/use-confirm';

export default function PetDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const petId = params.petId as string;
  const deletePet = useDeletePet({
    mutationConfig: {
      onSuccess: () => {
        navigate(paths.customer.pets.path);
      },
    },
  });
  const petQuery = useGetPet({
    petId,
    queryConfig: {
      enabled: !deletePet.isPending && !deletePet.isSuccess,
    },
  });

  const [ConfirmDeletePet, confirmDeletePet] = useConfirm(
    'Xoá thú cưng',
    'Bạn có chắc chắn muốn xoá thú cưng này?',
  );

  const handleDeletePet = async () => {
    const ok = await confirmDeletePet();
    if (!ok) return;
    deletePet.mutate(petId);
  };

  if (petQuery.isLoading) {
    return <FullscrenSpinner />;
  }
  if (!petQuery.data) {
    return <PetNotFound />;
  }
  return (
    <>
      <ConfirmDeletePet />
      <PetDetailView pet={petQuery.data} onDelete={handleDeletePet} />
    </>
  );
}
