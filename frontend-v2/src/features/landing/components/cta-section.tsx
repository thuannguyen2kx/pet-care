import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

import { paths } from '@/shared/config/paths';
import { Button } from '@/shared/ui/button';
import { Logo } from '@/shared/ui/logo';

export function CTASection() {
  return (
    <section className="bg-primary py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <Logo textClassName="text-primary-foreground" />
          <h2 className="text-primary-foreground mb-4 text-3xl font-bold md:text-4xl">
            Sẵn sàng chăm sóc thú cưng của bạn?
          </h2>
          <p className="text-primary-foreground/80 mb-8 text-lg">
            Đăng ký ngay hôm nay để nhận ưu đãi 20% cho lần đặt lịch đầu tiên và tham gia cộng đồng
            yêu thú cưng.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link to={paths.auth.register.path}>
              <Button
                size="lg"
                variant="secondary"
                className="w-full cursor-pointer gap-2 sm:w-auto"
              >
                Đăng ký miễn phí
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:text-primary-foreground hover:bg-primary-foreground/10 w-full cursor-pointer bg-transparent sm:w-auto"
              >
                Liên hệ tư vấn
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
