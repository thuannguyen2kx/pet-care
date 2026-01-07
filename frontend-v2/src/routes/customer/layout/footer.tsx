import { Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router';

import { paths } from '@/shared/config/paths';
import { Logo } from '@/shared/ui/logo';

export function Footer() {
  return (
    <footer className="border-border bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to={paths.root.path} className="flex items-center gap-2">
              <Logo />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Nơi thú cưng của bạn được chăm sóc với tình yêu thương và sự chuyên nghiệp.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-foreground font-semibold">Liên kết nhanh</h3>
            <nav className="flex flex-col gap-2">
              <Link
                to={paths.customer.booking.path}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Dịch vụ
              </Link>
              <Link
                to={paths.customer.booking.path}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Đặt lịch
              </Link>
              <Link
                to="/about"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Về chúng tôi
              </Link>
              <Link
                to="/contact"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Liên hệ
              </Link>
            </nav>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-foreground font-semibold">Dịch vụ</h3>
            <nav className="flex flex-col gap-2">
              <Link
                to={`${paths.customer.booking.path}?category=GROOMING`}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Làm đẹp thú cưng
              </Link>
              <Link
                to={`${paths.customer.booking.path}?category=HEALTHCARE`}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Khám sức khỏe
              </Link>
              <Link
                to={`${paths.customer.booking.path}?category=BOARDING`}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Khách sạn thú cưng
              </Link>
              <Link
                to={`${paths.customer.booking.path}?category=TRAINING`}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Huấn luyện
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-foreground font-semibold">Liên hệ</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <MapPin className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                <span className="text-muted-foreground text-sm">
                  123 Đường ABC, Quận 1, TP. Hồ Chí Minh
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-primary h-4 w-4 shrink-0" />
                <span className="text-muted-foreground text-sm">0123 456 789</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-primary h-4 w-4 shrink-0" />
                <span className="text-muted-foreground text-sm">info@petcare.vn</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-border mt-12 border-t pt-6">
          <p className="text-muted-foreground text-center text-sm">
            © 2025 PetCare - NguyenThanhThuan. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}
