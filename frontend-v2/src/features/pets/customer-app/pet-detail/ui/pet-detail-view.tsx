import { PetDetailSumary } from '@/features/pets/customer-app/pet-detail/ui/pet-detail-summary';
import { PetHealthTab } from '@/features/pets/customer-app/pet-detail/ui/tabs/pet-heath-tab';
import { PetHistoryTab } from '@/features/pets/customer-app/pet-detail/ui/tabs/pet-history-tab';
import { PetVaccineTab } from '@/features/pets/customer-app/pet-detail/ui/tabs/pet-vaccine-tab';
import type { Pet } from '@/features/pets/domain/pet.entity';
import { BackLink } from '@/shared/components/template/back-link';
import { paths } from '@/shared/config/paths';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

type Props = {
  pet: Pet;
  onDelete: () => void;
};
export function PetDetailView({ pet, onDelete }: Props) {
  return (
    <main className="container mx-auto px-4 py-6">
      <BackLink to={paths.customer.pets.path} label="Quay lại danh sách" />
      <div className="grid gap-6 lg:grid-cols-3">
        <aside className="lg:col-span-1">
          <PetDetailSumary pet={pet} onDelete={onDelete} />
        </aside>
        <section className="lg:col-span-2">
          <Tabs defaultValue="heath" className="space-y-6">
            <TabsList className="bg-muted/50 grid w-full grid-cols-3">
              <TabsTrigger value="heath">Sức khoẻ</TabsTrigger>
              <TabsTrigger value="vaccines">Vaccine</TabsTrigger>
              <TabsTrigger value="history">Lịch sử</TabsTrigger>
            </TabsList>
            <TabsContent value="heath" className="space-y-4">
              <PetHealthTab pet={pet} />
            </TabsContent>
            <TabsContent value="vaccines" className="space-y-4">
              <PetVaccineTab vaccinations={pet.vaccinations} />
            </TabsContent>
            <TabsContent value="history" className="space-y-4">
              <PetHistoryTab petBookings={[]} />
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </main>
  );
}
