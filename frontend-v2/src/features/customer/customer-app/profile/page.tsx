import { User } from 'lucide-react';
import { useMemo } from 'react';

import { useBookings } from '@/features/booking/api/get-bookings';
import { useCustomerProfile } from '@/features/customer/api/get-profile';
import { useCreatePostController } from '@/features/customer/customer-app/profile/application/use-create-post-controller';
import { CreatePostDialog } from '@/features/customer/customer-app/profile/dialog/create-post/create-post-dialog';
import { UpdateCustomerProfileDialog } from '@/features/customer/customer-app/profile/dialog/update-profile/update-profile-dialog';
import { useUpdateCustomerProfileController } from '@/features/customer/customer-app/profile/dialog/update-profile/use-update-profile-controller';
import { CustomerProfileView } from '@/features/customer/customer-app/profile/ui/customer-profile-view';
import { useGetUserPets } from '@/features/pets/api/get-user-pet';
import { EmptyState } from '@/shared/components/template/empty-state';
import { SectionSpinner } from '@/shared/components/template/loading';

export default function CustomerProfilePage() {
  const updateProfileCtl = useUpdateCustomerProfileController();
  const createPostCrtl = useCreatePostController();

  const profileQuery = useCustomerProfile();
  const petsQuery = useGetUserPets();
  const bookingsQuery = useBookings({ query: { page: 1, limit: 10 } });

  const totalPet = useMemo(() => petsQuery.data?.length || 0, [petsQuery.data]);
  const pets = petsQuery.data || [];
  const bookings = bookingsQuery.data?.bookings || [];

  if (profileQuery.isLoading) {
    return <SectionSpinner />;
  }

  if (!profileQuery.data) {
    return (
      <EmptyState title="Không tìm thấy thông tin" description="Vui liệu thử lại sau" icon={User} />
    );
  }
  return (
    <>
      <CustomerProfileView
        data={profileQuery.data}
        onUpdateProfile={updateProfileCtl.openDialog}
        onCreatePost={createPostCrtl.actions.openCreateDialog}
        totalPet={totalPet}
        pets={pets}
        bookings={bookings}
      />
      ;
      <UpdateCustomerProfileDialog
        open={updateProfileCtl.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            updateProfileCtl.closeDialog();
          }
        }}
        form={updateProfileCtl.form}
        onSubmit={updateProfileCtl.submitForm}
        isSubmitting={updateProfileCtl.isSubmitting}
      />
      <CreatePostDialog
        open={createPostCrtl.state.isOpenCreateDialog}
        form={createPostCrtl.form}
        onOpenChange={(open) => {
          if (!open) createPostCrtl.actions.closeCreateDialog();
        }}
        isSubmitting={createPostCrtl.state.isSubmitting}
        onSubmit={createPostCrtl.actions.submitPost}
      />
    </>
  );
}
