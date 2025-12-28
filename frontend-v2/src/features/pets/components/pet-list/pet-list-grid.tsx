import { Plus } from 'lucide-react';
import { Link } from 'react-router';

import { PetCard } from '@/features/pets/components/pet-list/pet-card';
import type { TPet } from '@/features/pets/types';
import { paths } from '@/shared/config/paths';
import { Card } from '@/shared/ui/card';

export function PetsListGrid({ pets }: { pets: TPet[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {pets.map((pet) => (
        <PetCard key={pet._id} pet={pet} />
      ))}
      <Card className="hover:border-primary/50 hover:bg-muted/30 flex items-center justify-center border-dashed transition-colors">
        <Link
          to={paths.customer.petNew.path}
          className="flex flex-col items-center p-12 text-center"
        >
          <div className="bg-primary/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Plus className="text-primary h-8 w-8" />
          </div>
          <h3 className="text-foreground font-medium">Thêm thú cưng mới</h3>
          <p className="text-muted-foreground mt-1 text-sm">Tạo hồ sơ cho thú cưng của bạn</p>
        </Link>
      </Card>
    </div>
  );
}
