import { Star } from 'lucide-react';

import { Card, CardContent } from '@/shared/ui/card';

const testimonials = [
  {
    name: 'Nguyễn Minh Anh',
    avatar: '/images/customer-1.jpg',
    pet: 'Mèo Mimi',
    rating: 5,
    content:
      'PetCare thật sự tuyệt vời! Mimi của mình được chăm sóc rất chu đáo. Nhân viên thân thiện và chuyên nghiệp. Sẽ quay lại nhiều lần nữa!',
  },
  {
    name: 'Trần Văn Hùng',
    avatar: '/images/customer-2.jpg',
    pet: 'Chó Lucky',
    rating: 5,
    content:
      'Dịch vụ khách sạn thú cưng rất tốt. Lucky được chăm sóc như ở nhà. Mình yên tâm đi công tác mà không lo lắng gì.',
  },
  {
    name: 'Phạm Thị Hoa',
    avatar: '/images/customer-3.jpg',
    pet: 'Mèo Bunny',
    rating: 5,
    content:
      'Rất hài lòng với dịch vụ làm đẹp. Bunny trông xinh xắn hơn hẳn sau khi được chăm sóc. Giá cả hợp lý, chất lượng tuyệt vời!',
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
            Khách hàng nói gì về chúng tôi
          </h2>
          <p className="text-muted-foreground text-lg">
            Hàng nghìn khách hàng đã tin tưởng và hài lòng với dịch vụ của PetCare.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border">
              <CardContent className="p-6">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="text-chart-4 h-4 w-4" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar || '/placeholder.svg'}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-foreground font-medium">{testimonial.name}</p>
                    <p className="text-muted-foreground text-sm">Chủ của {testimonial.pet}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
