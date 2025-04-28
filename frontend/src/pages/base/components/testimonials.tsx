import { useState  } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Quote, 
  MessageSquare,
  Calendar
} from "lucide-react";


interface ITestimonial {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  text: string;
  service: string;
  date: string;
  petType: string;
}
const testimonials: ITestimonial[] = [
    { 
      id: 1, 
      name: "Nguyễn Thị Hương", 
      avatar: "/api/placeholder/60/60",
      rating: 5,
      text: "Tôi đã đưa thú cưng của mình đến PetCare trong nhiều năm và chưa bao giờ có trải nghiệm không tốt. Nhân viên luôn thân thiện và thú cưng của tôi rất thích đến đây. Họ chăm sóc chu đáo và tỉ mỉ đến từng chi tiết.",
      service: "Dịch vụ Tắm & Cắt tỉa",
      date: "15 tháng 3, 2025",
      petType: "Chó"
    },
    { 
      id: 2, 
      name: "Trần Văn Minh", 
      avatar: "/api/placeholder/60/60",
      rating: 5,
      text: "Dịch vụ tuyệt vời! Chú chó của tôi ban đầu khá lo lắng, nhưng đội ngũ nhân viên đã giúp nó cảm thấy thoải mái. Việc cắt tỉa hoàn hảo và họ còn cho tôi những lời khuyên để chăm sóc tại nhà.",
      service: "Khám thú y",
      date: "2 tháng 4, 2025",
      petType: "Chó"
    },
    { 
      id: 3, 
      name: "Lê Thị Thanh", 
      avatar: "/api/placeholder/60/60",
      rating: 5,
      text: "Dịch vụ chăm sóc thú cưng tốt nhất trong thành phố. Các buổi kiểm tra sức khỏe rất kỹ lưỡng và họ thực sự quan tâm đến sức khỏe của thú cưng. Rất đáng để giới thiệu cho tất cả những người nuôi thú cưng.",
      service: "Dịch vụ trông giữ",
      date: "28 tháng 3, 2025",
      petType: "Mèo"
    },
    { 
      id: 4, 
      name: "Phạm Hoàng Long", 
      avatar: "/api/placeholder/60/60",
      rating: 4,
      text: "Nhân viên đã chăm sóc rất tốt cho con mèo già của tôi trong thời gian lưu trú. Họ đáp ứng tất cả nhu cầu đặc biệt của nó và gửi cho tôi cập nhật hàng ngày kèm theo hình ảnh. Chắc chắn sẽ sử dụng dịch vụ của họ một lần nữa.",
      service: "Dịch vụ chăm sóc tại nhà",
      date: "10 tháng 4, 2025",
      petType: "Mèo"
    },
    { 
      id: 5, 
      name: "Võ Thị Ngọc Anh", 
      avatar: "/api/placeholder/60/60",
      rating: 5,
      text: "Các buổi huấn luyện đã tạo ra sự khác biệt lớn cho chú cún hiếu động của tôi. Những huấn luyện viên rất kiên nhẫn và có kiến thức, và các kỹ thuật họ dạy chúng tôi hoạt động tuyệt vời ở nhà.",
      service: "Huấn luyện thú cưng",
      date: "15 tháng 4, 2025",
      petType: "Chó"
    }
  ];

const TestimonialCard = ({ testimonial, isActive }: { testimonial: ITestimonial, isActive: boolean }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('');
  };

  return (
    <Card className={`w-full transition-all duration-500 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute'}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-12 w-12 border-2 border-primary/10">
            <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(testimonial.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{testimonial.name}</h3>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                />
              ))}
            </div>
          </div>
          <div className="ml-auto flex flex-col items-end">
            <Badge className="mb-1">
              {testimonial.petType}
            </Badge>
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="w-3 h-3 mr-1" />
              {testimonial.date}
            </div>
          </div>
        </div>
        
        <div className="relative">
          <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/10 rotate-180" />
          <p className="text-gray-600 pt-3 px-4 italic">
            "{testimonial.text}"
          </p>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center">
          <MessageSquare className="w-4 h-4 text-primary mr-2" />
          <span className="text-sm font-medium text-primary">{testimonial.service}</span>
        </div>
      </CardContent>
    </Card>
  );
};

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  


  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentTestimonial(prev => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentTestimonial(prev => 
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleDotClick = (index: number) => {
    if (isAnimating || index === currentTestimonial) return;
    setIsAnimating(true);
    setCurrentTestimonial(index);
    setTimeout(() => setIsAnimating(false), 500);
  };



  return (
    <section className="py-16 bg-gradient-to-b from-gray-50/50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Đánh Giá Từ Khách Hàng
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Khám phá những chia sẻ từ khách hàng hài lòng và thú cưng đáng yêu của họ về dịch vụ của chúng tôi
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto relative">
          <div className="relative min-h-64">
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.id} className={index === currentTestimonial ? 'block' : 'hidden'}>
                <TestimonialCard 
                  testimonial={testimonial} 
                  isActive={index === currentTestimonial} 
                />
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex items-center justify-between">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full" 
              onClick={handlePrev}
              disabled={isAnimating}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentTestimonial 
                      ? 'bg-primary scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Xem đánh giá ${index + 1}`}
                />
              ))}
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full" 
              onClick={handleNext}
              disabled={isAnimating}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;