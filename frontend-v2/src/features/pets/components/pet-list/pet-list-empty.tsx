import { Search } from 'lucide-react';

import { Card, CardContent } from '@/shared/ui/card';

export function PetsListEmpty() {
  return (
    <Card className="py-12 text-center">
      <CardContent>
        <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <Search className="text-muted-foreground h-8 w-8" />
        </div>
        <h3 className="text-foreground text-lg font-medium">Không tìm thấy thú cưng</h3>
        <p className="text-muted-foreground mt-1">Thử tìm kiếm với từ khóa khác</p>
      </CardContent>
    </Card>
  );
}
