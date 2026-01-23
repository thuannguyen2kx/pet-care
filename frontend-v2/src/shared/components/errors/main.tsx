import { Link } from 'react-router';

import { paths } from '@/shared/config/paths';
import { Button } from '@/shared/ui/button';

export const MainErrorFallback = () => {
  return (
    <main className="bg-background flex min-h-screen w-full flex-col items-center justify-center px-4 text-center">
      <div className="mb-8">
        <h1 className="text-primary text-9xl font-bold">500</h1>
        <div className="bg-secondary mx-auto mt-2 h-1 w-24"></div>
      </div>

      <h1 className="text-foreground mb-3 text-2xl font-semibold">Có lỗi xảy ra</h1>

      <p className="text-muted-foreground mx-auto mb-8 max-w-xl">
        Hệ thống đang gặp sự cố. Vui lòng thử lại sau.
      </p>

      <Button asChild>
        <Link to={paths.root.path}>Trang chủ</Link>
      </Button>
    </main>
  );
};
