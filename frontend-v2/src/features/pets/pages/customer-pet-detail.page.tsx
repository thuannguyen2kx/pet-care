import type { QueryClient } from '@tanstack/react-query';
import { useNavigate, useParams, type ClientLoaderFunctionArgs } from 'react-router';

import { useDeletePet } from '@/features//pets/api/delete-pet';
import { getPetQueryOptions, useGetPet } from '@/features/pets/api/get-pet';
import { PetNotFound } from '@/features/pets/components/pet-not-found';
import { CustomerPetDetailPrecenter } from '@/features/pets/presenters/customer-pet-detail.precenter';
import { SpinnerFullScreen } from '@/shared/components/template/spinner-full-screen';
import { paths } from '@/shared/config/paths';
import { useConfirm } from '@/shared/hooks/use-confirm';

export const clientLoader = (queryClient: QueryClient) => {
  return ({ params }: ClientLoaderFunctionArgs) => {
    const petId = params.petId as string;
    const query = getPetQueryOptions(petId);
    return queryClient.getQueryData(query.queryKey) ?? queryClient.fetchQuery(query);
  };
};

export default function CustomerPetDetailsPage() {
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
    return <SpinnerFullScreen />;
  }
  if (!petQuery.data?.data) {
    return <PetNotFound />;
  }
  return (
    <>
      <ConfirmDeletePet />
      <CustomerPetDetailPrecenter pet={petQuery.data?.data} onDelete={handleDeletePet} />
    </>
  );
}
