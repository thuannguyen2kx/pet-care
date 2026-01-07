import { Calendar, Check, Heart, MessageCircle, Shield } from 'lucide-react';

const features = [
  {
    icon: Calendar,
    title: 'Đặt lịch dễ dàng',
    description: 'Đặt lịch hẹn trực tuyến 24/7, chọn thời gian phù hợp với lịch trình của bạn.',
    benefits: ['Đặt lịch 24/7', 'Nhắc nhở tự động', 'Hủy linh hoạt'],
  },
  {
    icon: Heart,
    title: 'Quản lý thú cưng',
    description: 'Lưu trữ hồ sơ sức khỏe, lịch sử dịch vụ và thông tin quan trọng của thú cưng.',
    benefits: ['Hồ sơ sức khỏe', 'Lịch tiêm phòng', 'Theo dõi cân nặng'],
  },
  {
    icon: MessageCircle,
    title: 'Cộng đồng yêu thú cưng',
    description:
      'Kết nối với những người yêu thú cưng khác, chia sẻ kinh nghiệm và khoảnh khắc đáng yêu.',
    benefits: ['Chia sẻ ảnh/video', 'Nhận tư vấn', 'Kết bạn mới'],
  },
  {
    icon: Shield,
    title: 'An toàn & Tin cậy',
    description:
      'Đội ngũ chuyên nghiệp được đào tạo bài bản, cam kết chăm sóc thú cưng như gia đình.',
    benefits: ['Nhân viên chuyên nghiệp', 'Cam kết chất lượng', 'Bảo hiểm thú cưng'],
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
            Tại sao chọn PetCare?
          </h2>
          <p className="text-muted-foreground text-lg">
            Chúng tôi mang đến trải nghiệm chăm sóc thú cưng toàn diện và tiện lợi nhất.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {features.map((feature, index) => (
            <div
              key={index}
              className="border-border bg-card hover:border-primary/50 flex gap-5 rounded-2xl border p-6 transition-all duration-300 hover:shadow-md"
            >
              <div className="bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
                <feature.icon className="text-primary h-6 w-6" />
              </div>
              <div className="space-y-3">
                <h3 className="text-foreground text-lg font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-1.5">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="text-muted-foreground flex items-center gap-2 text-sm">
                      <Check className="text-primary h-4 w-4" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
