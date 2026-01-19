import type { Booking } from '@/features/booking/domain/booking.entity';
import { MembershipCard } from '@/features/customer/customer-app/profile/ui/membership-card';
import { CustomerProfileCard } from '@/features/customer/customer-app/profile/ui/profile-card';
import { BookingsHistoryTab } from '@/features/customer/customer-app/profile/ui/tabs/bookings-history-tab';
import { CustomerPetsTab } from '@/features/customer/customer-app/profile/ui/tabs/customer-pets-tab';
import { CustomerInfoTab } from '@/features/customer/customer-app/profile/ui/tabs/info-tab';
import { MyPostsTab } from '@/features/customer/customer-app/profile/ui/tabs/my-posts-tab';
import type { Customer } from '@/features/customer/domain/customer-entity';
import type { TPet } from '@/features/pets/types';
import { BackLink } from '@/shared/components/template/back-link';
import { paths } from '@/shared/config/paths';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

type Props = {
  data: Customer;
  pets: TPet[];
  totalPet: number;
  bookings: Booking[];
  onUpdateProfile: () => void;
  onCreatePost: () => void;
};
export function CustomerProfileView({
  data,
  onUpdateProfile,
  totalPet,
  pets,
  bookings,
  onCreatePost,
}: Props) {
  return (
    <main className="container mx-auto px-4 py-6">
      <BackLink to={paths.customer.root.path} label="Quay lại trang chủ" />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <CustomerProfileCard data={data} totalPet={totalPet} />
          <MembershipCard data={data} />
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="info" className="space-y-6">
            <TabsList className="bg-muted/50 grid w-full grid-cols-4">
              <TabsTrigger value="info">Thông tin</TabsTrigger>
              <TabsTrigger value="my-posts">Bài viết của tôi</TabsTrigger>
              <TabsTrigger value="pets">Thú cưng</TabsTrigger>
              <TabsTrigger value="history">Lịch sử</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-6">
              <CustomerInfoTab data={data} onUpdateProfile={onUpdateProfile} />
            </TabsContent>
            <TabsContent value="my-posts" className="space-y-6">
              <MyPostsTab onCreatePost={onCreatePost} />
            </TabsContent>
            <TabsContent value="pets" className="space-y-6">
              <CustomerPetsTab pets={pets} />
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <BookingsHistoryTab bookings={bookings} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
