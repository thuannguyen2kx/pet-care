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
import {
  PetCategory,
  petCategoryTranslations,
  Specialty,
  specialtyTranslations,
} from "@/constants";
import SimpleImageCarousel from "@/components/shared/image-carousel";

const ServiceCatalog: React.FC = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState<string>("ALL");
  const [petType, setPetType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data, isLoading, isError } = useGetServices({
    category: category === "ALL" ? undefined : category,
    petType: petType === "ALL" ? undefined : petType,
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
            {specialtyTranslations[category as Specialty] || "Tất cả dịch vụ"}
          </SelectTrigger>
          <SelectContent className="border-none">
            <SelectItem value={"ALL"}>Tất cả</SelectItem>
            {Object.values(Specialty).map((specialty) => (
              <SelectItem key={specialty} value={specialty}>
                {specialtyTranslations[specialty]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={petType} onValueChange={setPetType}>
          <SelectTrigger className="w-[180px]">
            {petCategoryTranslations[petType as PetCategory] ||
              "Tất cả loại thú cưng"}
          </SelectTrigger>
          <SelectContent className="border-none">
            <SelectItem value={"ALL"}>Tất cả</SelectItem>
            {Object.values(PetCategory).map((item) => (
              <SelectItem key={item} value={item}>
                {petCategoryTranslations[item] || item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredServices?.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 rounded-md">
          <h3 className="text-xl font-medium mb-2">Không tìm thấy dịch vụ</h3>
          <p className="text-gray-500">
            Hãy thử điều chỉnh bộ lọc hoặc truy vấn tìm kiếm của bạn
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {filteredServices?.map((service) => (
            <Card
              key={service._id}
              className="overflow-hidden h-full flex flex-col p-0 border-none shadow rounded-md"
            >
              <div className="w-full relative">
                <SimpleImageCarousel media={service.images} aspectRatio="aspect-square" />
                <Badge className="absolute top-2 right-2" variant="secondary">
                  {specialtyTranslations[service.category as Specialty]}
                </Badge>
              </div>

              <CardContent className="flex-grow">
                <h3 className="text-xl font-bold mb-2">{service.name}</h3> 
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">
                    {formatTime(service.duration)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                  {service.applicablePetTypes?.map((type) => (
                    <Badge
                      key={type}
                      variant="secondary"
                      className="text-xs bg-primary/30 text-primary"
                    >
                      {petCategoryTranslations[type as PetCategory] || type}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <Separator />
              <CardFooter className="pb-4 flex justify-between items-center">
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
