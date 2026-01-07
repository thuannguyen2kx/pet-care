import { ArrowRight, Dog, Home, Scissors, Stethoscope } from 'lucide-react';
import { Link } from 'react-router';

import { paths } from '@/shared/config/paths';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

const services = [
  {
    icon: Scissors,
    title: 'Làm đẹp thú cưng',
    description: 'Tắm, cắt tỉa lông, chăm sóc móng và các dịch vụ spa cho thú cưng của bạn.',
    href: `${paths.customer.booking.path}?category=GROOMING`,
    image: 'images/service-1.jpg',
  },
  {
    icon: Stethoscope,
    title: 'Khám sức khỏe',
    description: 'Khám định kỳ, tiêm phòng và tư vấn dinh dưỡng từ bác sĩ thú y chuyên nghiệp.',
    href: `${paths.customer.booking.path}?category=HEALTHCARE`,
    image: 'images/service-2.jpg',
  },
  {
    icon: Home,
    title: 'Khách sạn thú cưng',
    description: 'Dịch vụ lưu trú an toàn và thoải mái khi bạn đi công tác hoặc du lịch.',
    href: `${paths.customer.booking.path}?category=BOARDING`,
    image: 'images/service-3.jpg',
  },
  {
    icon: Dog,
    title: 'Huấn luyện',
    description: 'Đào tạo hành vi cơ bản và nâng cao cho thú cưng của bạn.',
    href: `${paths.customer.booking.path}?category=TRAINING`,
    image: 'images/service-1.jpg',
  },
];

export function ServicesSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
            Dịch vụ của chúng tôi
          </h2>
          <p className="text-muted-foreground text-lg">
            Đa dạng dịch vụ chăm sóc thú cưng chuyên nghiệp, đáp ứng mọi nhu cầu của bạn và thú
            cưng.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group border-border hover:border-primary/50 overflow-hidden pb-4 transition-all duration-300 hover:shadow-lg"
            >
              <div className="aspect-3/2 overflow-hidden">
                <img
                  src={service.image || '/placeholder.svg'}
                  alt={service.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 mb-2 flex h-10 w-10 items-center justify-center rounded-lg">
                    <service.icon className="text-primary h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="line-clamp-2">{service.description}</CardDescription>
                <Link to={service.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-primary/80 cursor-pointer gap-1 px-0 hover:bg-transparent"
                  >
                    Tìm hiểu thêm
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
