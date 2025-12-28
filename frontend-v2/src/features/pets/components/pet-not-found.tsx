import { Link } from 'react-router';

import { paths } from '@/shared/config/paths';
import { Button } from '@/shared/ui/button';

export const PetNotFound = () => {
  return (
    <div className="bg-background min-h-screen">
      <main className="container mx-auto px-4 py-14 text-center">
        <h1 className="h3-bold text-foreground">Không tìm thấy thú cưng</h1>
        <p className="text-muted-foreground mt-2">Thú cưng này không tồn tại hoặc đã bị xoá</p>
        <Button className="mt-6" asChild>
          <Link to={paths.customer.pets.path}>Quay lại danh sách</Link>
        </Button>
      </main>
    </div>
  );
};
