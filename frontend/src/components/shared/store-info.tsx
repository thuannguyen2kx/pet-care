import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  Heart, 
  PawPrint, 
  Scissors, 
  ShowerHead, 
  Medal, 
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Star,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";

const StoreInfoSidebar = () => {
  const [activePromo, setActivePromo] = useState(0);
  
  const promotions = [
    {
      title: "Khám sức khỏe miễn phí",
      description: "Đặt lịch làm đẹp và nhận khám sức khỏe miễn phí cho thú cưng"
    },
    {
      title: "Giảm 20% dịch vụ spa",
      description: "Ưu đãi đặc biệt cho khách hàng mới từ 15/5 - 30/5"
    },
    {
      title: "Gói chăm sóc VIP",
      description: "Đăng ký gói VIP để nhận ưu đãi và quà tặng hấp dẫn"
    }
  ];

  const services = [
    { name: "Cắt tỉa lông", icon: <Scissors size={16} /> },
    { name: "Tắm spa", icon: <ShowerHead size={16} /> },
    { name: "Khám sức khỏe", icon: <Heart size={16} /> },
    { name: "Huấn luyện", icon: <Medal size={16} /> }
  ];

  // Change active promotion every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePromo((prev) => (prev + 1) % promotions.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  // Animation for ratings
  const [rating, setRating] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      setRating(4.9);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full space-y-6">
      <Card className="p-0 gap-0 shadow overflow-hidden rounded-sm">
        <div className="h-20 bg-gradient-to-r from-amber-500 to-orange-500 relative">
          <div className="absolute -bottom-8 left-4 h-16 w-16 rounded-full bg-white p-1 shadow-md border-2 border-amber-200">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
              <PawPrint size={28} className="text-amber-600" />
            </div>
          </div>
        </div>
        <CardHeader className="pt-10 pb-2">
          <div>
            <CardTitle className="text-amber-800 text-xl">PetCare</CardTitle>
            <div className="flex items-center mt-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={`${
                      star <= Math.floor(rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    } mr-0.5`}
                  />
                ))}
              </div>
              <span
                className="text-sm ml-1 font-medium"
                style={{
                  transition: "color 1s ease-out",
                  color: rating > 0 ? "#000" : "transparent",
                }}
              >
                {rating.toFixed(1)}
              </span>
              <span className="text-xs ml-1 text-gray-500">(128 đánh giá)</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <MapPin size={12} className="text-gray-500" />
              <span className="text-xs text-gray-500">
                Quận Hai Bà Trưng, Hà Nội
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="py-4">
          <p className="text-sm text-gray-600 mb-4">
            Với đội ngũ nhân viên giàu kinh nghiệm và tâm huyết, chúng tôi cam
            kết mang đến dịch vụ chăm sóc tốt nhất cho thú cưng của bạn.
          </p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {services.map((service, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm bg-gradient-to-br from-white to-amber-50 p-2 rounded-md shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-pointer border border-amber-100"
              >
                <span className="text-amber-600">{service.icon}</span>
                <span>{service.name}</span>
              </div>
            ))}
          </div>
          <Button
            asChild
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-[1.02] shadow-md"
          >
            <Link to={"/services"}>Đặt lịch ngay</Link>
          </Button>
          <div className="flex justify-center mt-3 space-x-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-600"
            >
              <Facebook size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-gray-100 hover:bg-pink-100 hover:text-pink-600"
            >
              <Instagram size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Promotion Card with Carousel */}
      <Card className="overflow-hidden shadow rounded-sm p-0 gap-0">
        <div className="relative">
          <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold py-1 px-3 rounded-bl-lg z-10">
            Mới
          </div>
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 pb-2 pt-3">
            <CardTitle className="text-white text-base flex items-center">
              <span className="text-yellow-300 mr-2">★</span>
              Ưu đãi đặc biệt
            </CardTitle>
          </CardHeader>
        </div>
        <CardContent className="p-0">
          <div className="relative h-36 bg-gradient-to-br from-emerald-50 to-teal-50">
            {promotions.map((promo, index) => (
              <div
                key={index}
                className={`absolute inset-0 p-4 transition-all duration-500 ease-in-out ${
                  index === activePromo
                    ? "opacity-100 translate-x-0"
                    : index < activePromo
                    ? "opacity-0 -translate-x-full pointer-events-none"
                    : "opacity-0 translate-x-full pointer-events-none"
                }`}
              >
                <div className="border-l-2 border-emerald-500 pl-3">
                  <h3 className="font-medium text-emerald-800 mb-2">
                    {promo.title}
                  </h3>
                  <p className="text-sm text-gray-600">{promo.description}</p>
                </div>
                <div className="absolute bottom-3 right-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-emerald-700 hover:text-emerald-800 p-0 h-auto flex items-center"
                  >
                    Xem chi tiết <ChevronRight size={12} className="ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center p-2 bg-gradient-to-r from-emerald-50 to-teal-50">
            {promotions.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 w-6 mx-1 rounded-full transition-all duration-300 transform ${
                  index === activePromo
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 scale-110"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Opening Hours & Features */}
      <Card className="border-0 shadow-lg p-0">
        <CardHeader className="py-3 bg-gradient-to-br from-purple-50 to-indigo-50">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock size={16} className="text-purple-600" /> Giờ mở cửa & Tiện
            ích
          </CardTitle>
        </CardHeader>
        <CardContent className="py-3">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center border-b border-dashed border-purple-100 pb-2">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span>Thứ Hai - Thứ Sáu</span>
              </div>
              <span className="font-medium text-purple-800">8:00 - 17:00</span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span>Thứ Bảy - Chủ Nhật</span>
              </div>
              <span className="font-medium text-purple-800">9:00 - 18:00</span>
            </div>

            <Separator className="my-3" />

            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center text-xs">
                <CheckCircle2 size={12} className="text-purple-600 mr-1" />
                <span>Wifi miễn phí</span>
              </div>
              <div className="flex items-center text-xs">
                <CheckCircle2 size={12} className="text-purple-600 mr-1" />
                <span>Đỗ xe thuận tiện</span>
              </div>
              <div className="flex items-center text-xs">
                <CheckCircle2 size={12} className="text-purple-600 mr-1" />
                <span>Khu vực chờ thoải mái</span>
              </div>
              <div className="flex items-center text-xs">
                <CheckCircle2 size={12} className="text-purple-600 mr-1" />
                <span>Trà, cà phê miễn phí</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center">
              <Badge className="text-white border-0 bg-gradient-to-r from-purple-600 to-indigo-600 py-1.5 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
                <Phone size={12} className="mr-1" /> 098-765-4321
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Reviews */}
      <Card className="p-0 shadow-md rounded-md gap-0 overflow-hidden">
        <CardHeader className="py-3 bg-gradient-to-r from-blue-600 to-indigo-600">
          <CardTitle className="text-base text-white flex items-center">
            <Star size={16} className="mr-2 text-yellow-300 fill-yellow-300" />
            Khách hàng nói gì về chúng tôi
          </CardTitle>
        </CardHeader>
        <CardContent className="py-4 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="space-y-3">
            <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-blue-100">
              <div className="flex items-center gap-2 mb-1">
                <Avatar className="h-7 w-7 border-2 border-blue-200">
                  <AvatarFallback className="text-xs text-blue-700">TH</AvatarFallback>
                </Avatar>
                <div>
                  <span className="text-sm font-medium">Trần Hương</span>
                  <div className="flex mt-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={10}
                        className="text-yellow-400 fill-yellow-400 mr-0.5"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-600 italic">
                "Nhân viên tận tình, chu đáo. Bé nhà mình rất thích được tắm ở
                đây!"
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-blue-100">
              <div className="flex items-center gap-2 mb-1">
                <Avatar className="h-7 w-7 border-2 border-blue-200">
                  <AvatarFallback className="text-xs text-blue-700">NL</AvatarFallback>
                </Avatar>
                <div>
                  <span className="text-sm font-medium">Nguyễn Linh</span>
                  <div className="flex mt-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={10}
                        className={`${
                          i <= 4
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        } mr-0.5`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-600 italic">
                "Dịch vụ chất lượng, giá cả hợp lý. Sẽ quay lại nhiều lần nữa."
              </p>
            </div>
          </div>
        </CardContent> 
      </Card> 
    </div>
  );
};

export default StoreInfoSidebar;