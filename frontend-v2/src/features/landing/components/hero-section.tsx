import { ArrowRight, Shield, Star, Users } from 'lucide-react';
import { Link } from 'react-router';

import { paths } from '@/shared/config/paths';
import { Button } from '@/shared/ui/button';

export function HeroSection() {
  return (
    <section className="from-secondary via-background to-accent/30 relative overflow-hidden bg-linear-to-br py-16 md:py-24 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="bg-primary/5 absolute top-20 left-1/4 h-72 w-72 rounded-full blur-3xl" />
        <div className="bg-accent/20 absolute right-1/4 bottom-20 h-96 w-96 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Content */}
          <div className="space-y-8">
            <div className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium md:text-sm">
              <Star className="h-4 w-4" />
              Được tin tưởng bởi 10,000+ chủ thú cưng
            </div>

            <h1 className="text-foreground text-4xl leading-tight font-bold tracking-tight md:text-5xl lg:text-6xl">
              Chăm sóc thú cưng <span className="text-primary">với tình yêu thương</span>
            </h1>

            <p className="text-muted-foreground max-w-lg text-lg leading-relaxed">
              PetCare là nơi bạn có thể đặt lịch dịch vụ, quản lý hồ sơ thú cưng và kết nối với cộng
              đồng yêu thú cưng.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to={paths.customer.root.path}>
                <Button size="lg" className="w-full gap-2 sm:w-auto">
                  Bắt đầu ngay
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to={paths.customer.booking.path}>
                <Button size="lg" variant="outline" className="w-full bg-transparent sm:w-auto">
                  Khám phá dịch vụ
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                  <Shield className="text-primary h-5 w-5" />
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">An toàn</p>
                  <p className="text-muted-foreground text-xs">100% bảo đảm</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                  <Users className="text-primary h-5 w-5" />
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">10K+</p>
                  <p className="text-muted-foreground text-xs">Khách hàng</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                  <Star className="text-primary h-5 w-5" />
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">4.9/5</p>
                  <p className="text-muted-foreground text-xs">Đánh giá</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="bg-muted relative aspect-square overflow-hidden rounded-3xl">
              <img
                src="/images/hero.jpg"
                alt="Chăm sóc thú cưng"
                className="h-full w-full object-cover"
              />
            </div>
            {/* Floating Card */}
            <div className="border-border bg-card absolute -bottom-6 -left-6 rounded-2xl border p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <img
                    src="/images/cute-cat-face.png"
                    alt="Pet"
                    className="border-card h-10 w-10 rounded-full border-2 object-cover"
                  />
                  <img
                    src="/images/cute-dog-face.jpg"
                    alt="Pet"
                    className="border-card h-10 w-10 rounded-full border-2 object-cover"
                  />
                  <img
                    src="/images/cute-rabbit-face.jpg"
                    alt="Pet"
                    className="border-card h-10 w-10 rounded-full border-2 object-cover"
                  />
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">5,000+ Thú cưng</p>
                  <p className="text-muted-foreground text-xs">Được chăm sóc mỗi tháng</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
