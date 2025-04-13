import React from "react";
import { ServiceType } from "@/features/service/types/api.types";
import { formatDuration } from "@/features/appointment/utils/appointment-form-config";
import { formatVND } from "@/lib/helper";
import { PetCategory, petCategoryTranslations } from "@/constants";

interface ServiceDetailsCardProps {
  service?: ServiceType;
}

const ServiceDetailsCard: React.FC<ServiceDetailsCardProps> = ({ service }) => {
  if (!service) return null;
  
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Dịch vụ đã chọn</h3>
      <div className="rounded-md border border-slate-300 p-4">
        <div className="grid grid-cols-1 gap-2">
          <div>
            <p className="text-sm text-muted-foreground">Tên dịch vụ</p>
            <p className="font-medium">{service.name}</p>
          </div>
          {service.description && (
            <div>
              <p className="text-sm text-muted-foreground">Mô tả</p>
              <p>{service.description}</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-muted-foreground">Giá</p>
              <p className="font-medium">{formatVND(service.price)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Thời gian</p>
              <p className="font-medium">
                {service.duration ? formatDuration(service.duration) : "N/A"}
              </p>
            </div>
          </div>
          {service.applicablePetTypes &&
            service.applicablePetTypes.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground">
                  Loại thú cưng phù hợp
                </p>
                {service.applicablePetTypes.map((type) => (
                  <span
                    key={type}
                    className="inline-block text-sm font-medium text-slate-600 mr-2"
                  >
                    {petCategoryTranslations[type as PetCategory] || type}
                  </span>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsCard;