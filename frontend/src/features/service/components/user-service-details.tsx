import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  Clock,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useGetService } from "../hooks/queries/get-service";
import { formatVND } from "@/lib/helper";
import { PetCategory, petCategoryTranslations, PetSize, petSizeTranslations, ServiceAppointmentType, Specialty, specialtyTranslations } from "@/constants";
import { formatDuration } from "@/features/appointment/utils/appointment-form-config";

const ServiceDetails: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data, isLoading, isError } = useGetService(serviceId || "");
  const service = data?.service;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError || !service) {
    return (
      <div className="container mx-auto pb-8 px-4">
        <div className="text-center p-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium mb-2">Không tìm thấy dịch vụ</h3>
          <p className="text-gray-500 mb-4">
            Dịch vụ bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Button onClick={() => navigate("/services")}>
            Quay lại danh sách dịch vụ
          </Button>
        </div>
      </div>
    );
  }

  const handlePrevImage = () => {
    if (service.images && service.images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? service.images!.length - 1 : prevIndex - 1
      );
    }
  };

  const handleNextImage = () => {
    if (service.images && service.images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === service.images!.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  return (
    <div className="container mx-auto pb-8 px-4">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/services">Dịch vụ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span className="font-medium">{service.name}</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-x-2 mb-2 ">

      <Button
        variant="ghost"
        size="sm"
        className="rounded-full"
        onClick={() => navigate("/services")}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <span>
        Quay lại danh sách dịch vụ

      </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-video">
            {service.images && service.images.length > 0 ? (
              <>
                <img
                  src={service.images[currentImageIndex].url}
                  alt={service.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://via.placeholder.com/800x500?text=No+Image";
                  }}
                />

                {service.images.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full h-10 w-10"
                      onClick={handlePrevImage}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-10 w-10"
                      onClick={handleNextImage}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>

                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {service.images.map((_, index) => (
                        <div
                          key={index}
                          className={`h-2 w-2 rounded-full transition-colors ${
                            index === currentImageIndex
                              ? "bg-primary"
                              : "bg-gray-300"
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400">Chưa có hình ảnh dịch vụ</span>
              </div>
            )}
          </div>

          {service.images && service.images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {service.images.map((image, index) => (
                <div
                  key={index}
                  className={`h-16 w-16 rounded-md border-2 cursor-pointer overflow-hidden flex-shrink-0 ${
                    index === currentImageIndex
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={image.url}
                    alt={`${service.name} ${index + 1}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://via.placeholder.com/100?text=Error";
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          <Tabs defaultValue="description" className="mt-8">
            <TabsList>
              <TabsTrigger value="description">Mô tả</TabsTrigger>
              <TabsTrigger value="details">Chi tiết</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              <Card className="border-none shadow-none">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-4">Về dịch vụ này</h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {service.description ||
                      "Chưa có thông tin mô tả về dịch vụ này"}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="details" className="mt-4">
              <Card className="border-none shadow-none">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-4">
                    Chi tiết về dịch vụ
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Loại dịch vụ
                      </h4>
                      <p>{specialtyTranslations[service.category as Specialty]}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Thời gian thực hiện
                      </h4>
                      <p>{formatDuration(service.duration)}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Áp dụng với thú cưng
                      </h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {service.applicablePetTypes &&
                        service.applicablePetTypes.length > 0 ? (
                          service.applicablePetTypes.map((type) => (
                            <Badge key={type} variant="secondary">
                              {petCategoryTranslations[type as PetCategory]}
                            </Badge>
                          ))
                        ) : (
                          <p>Tất cả thú cưng</p>
                        )}
                      </div>
                    </div>

                    {service.applicablePetSizes &&
                      service.applicablePetSizes.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">
                            Kích thước thú cưng sử dụng dịch vụ
                          </h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {service.applicablePetSizes.map((size) => (
                              <Badge key={size} variant="secondary" >
                                {petSizeTranslations[size as PetSize]}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="sticky top-4 border-none shadow-none">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold">{service.name}</h2>
              <Badge className="mt-2" variant="secondary">
                {specialtyTranslations[service.category as Specialty]}
              </Badge>

              <div className="flex items-center gap-2 mt-4">
                <Clock className="h-4 w-4 text-gray-400" />
                <span>{formatDuration(service.duration)}</span>
              </div>

              <Separator className="my-6" />

              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-500">Giá</span>
                <span className="text-2xl font-bold">
                  {formatVND(service.price)}
                </span>
              </div>

              <Button
                onClick={() =>
                  navigate(`/appointments/new`, {
                    state: {
                      serviceId: service._id,
                      serviceType: ServiceAppointmentType.SINGLE,
                    },
                  })
                }
                className="w-full"
              >
                Đặt lịch
              </Button>

              <div className="mt-6 text-sm text-gray-500">
                <p>✓ Chuyên gia chăm sóc thú cưng chuyên nghiệp</p>
                <p>✓ Dịch vụ chất lượng cao được đảm bảo</p>
                <p>✓ Môi trường thân thiện với thú cưng</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
