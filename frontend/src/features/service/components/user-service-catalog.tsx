
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useGetServices } from "../hooks/queries/get-services";
import { formatTime, formatVND } from "@/lib/helper";

const ServiceCatalog: React.FC = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState<string>("");
  const [petType, setPetType] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Only fetch active services for the catalog
  const { data, isLoading, isError } = useGetServices({
    category: category || undefined,
    petType: petType || undefined,
    isActive: true,
  });
  const services = data?.services;

  const filteredServices = services?.filter(
    (service) =>
      !searchQuery ||
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (id: string) => {
    navigate(`/services/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="text-center text-red-500 p-8">
        Đã xảy ra lỗi khi tải dịch vụ. Vui lòng thử lại sau.
      </div>
    );
  }

  return (
    <div className="container mx-auto pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dịch vụ của chúng tôi</h1>
          <p className="text-gray-500">
            Khám phá các dịch vụ chăm sóc thú cưng được thiết kế dành cho những
            người bạn của bạn
          </p>
        </div>

        <div className="relative w-full md:w-auto">
          <Input
            type="text"
            placeholder="Tìm kiếm dịch vụ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px]">
            Tất cả loại dịch vụ
          </SelectTrigger>
          <SelectContent className="border-none">
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="grooming">Grooming</SelectItem>
            <SelectItem value="medical">Medical</SelectItem>
            <SelectItem value="training">Training</SelectItem>
            <SelectItem value="boarding">Boarding</SelectItem>
            <SelectItem value="daycare">Daycare</SelectItem>
          </SelectContent>
        </Select>

        <Select value={petType} onValueChange={setPetType}>
          <SelectTrigger className="w-[180px]">Loại thú cưng</SelectTrigger>
          <SelectContent className="border-none">
            <SelectItem value="all">All Pets</SelectItem>
            <SelectItem value="dog">Dogs</SelectItem>
            <SelectItem value="cat">Cats</SelectItem>
            <SelectItem value="bird">Birds</SelectItem>
            <SelectItem value="rabbit">Rabbits</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredServices?.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium mb-2">Không tìm thấy dịch vụ</h3>
          <p className="text-gray-500">
            Hãy thử điều chỉnh bộ lọc hoặc truy vấn tìm kiếm của bạn
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices?.map((service) => (
            <Card
              key={service._id}
              className="overflow-hidden h-full flex flex-col p-0 border-none"
            >
              <div className="aspect-video w-full relative">
                {service.images && service.images.length > 0 ? (
                  <img
                    src={service.images[0].url}
                    alt={service.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://via.placeholder.com/300x200?text=No+Image";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">Không có hình ảnh nào</span>
                  </div>
                )}
                <Badge className="absolute top-2 right-2" variant="secondary">
                  {service.category}
                </Badge>
              </div>

              <CardContent className="pt-6 flex-grow">
                <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                <p className="text-gray-500 mb-4 line-clamp-3">
                  {service.description || "Chưa có thông tin mô tả nào"}
                </p>

                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{formatTime(service.duration)}</span>
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                  {service.applicablePetTypes?.map((type) => (
                    <Badge key={type} variant="outline" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <Separator />

              <CardFooter className="pt-4 pb-4 flex justify-between items-center">
                <div className="font-bold text-lg">
                  {formatVND(service.price)}
                </div>
                <Button onClick={() => handleViewDetails(service._id)}>
                  Xem chi tiết
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceCatalog;