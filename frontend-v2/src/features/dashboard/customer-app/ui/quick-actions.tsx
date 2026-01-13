import { Calendar, MessageCircle, PawPrint, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router';

import { paths } from '@/shared/config/paths';

const actions = [
  {
    icon: Calendar,
    label: 'Đặt lịch',
    description: 'Đặt lịch dịch vụ',
    href: paths.customer.booking.path,
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: PawPrint,
    label: 'Thú cưng',
    description: 'Quản lý thú cưng',
    href: paths.customer.pets.path,
    color: 'bg-chart-2/20 text-chart-2',
  },
  {
    icon: MessageCircle,
    label: 'Cộng đồng',
    description: 'Chia sẻ khoảnh khắc',
    href: paths.customer.social.path,
    color: 'bg-accent text-accent-foreground',
  },
  {
    icon: ShoppingBag,
    label: 'Cửa hàng',
    description: 'Mua sắm cho pet',
    href: '/customer/shop',
    color: 'bg-chart-5/20 text-chart-5',
  },
];
export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {actions.map((action, index) => (
        <Link
          key={index}
          to={action.href}
          className="border-border bg-card hover:border-primary/50 flex flex-col items-center gap-3 rounded-2xl border p-5 transition-all"
        >
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${action.color}`}>
            <action.icon className="h-6 w-6" />
          </div>
          <div className="text-center">
            <p className="text-foreground font-medium">{action.label}</p>
            <p className="text-muted-foreground text-xs">{action.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
