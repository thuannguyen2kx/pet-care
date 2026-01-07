import { Calendar, Clock, DollarSign, Info, Tag, Zap } from 'lucide-react';

import {
  presentService,
  type TServiceView,
} from '@/features/service/components/admin-service-detail/service-detail-precented';
import type { TService } from '@/features/service/domain/service.entity';
import { EmptyState } from '@/shared/components/template/empty-state';
import { SectionSpinner } from '@/shared/components/template/loading';
import { Badge } from '@/shared/ui/badge';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/shared/ui/drawer';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: TService;
  isLoading: boolean;
};

export function AdminServiceDetailDrawer({ open, onOpenChange, service, isLoading }: Props) {
  const serviceView = service ? presentService(service) : undefined;
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="border-border sm:max-w-lg!">
        <DrawerHeader>
          <DrawerTitle>Thông tin chi tiết dịch vụ</DrawerTitle>
        </DrawerHeader>

        {isLoading && <SectionSpinner />}

        {!isLoading && !service && (
          <EmptyState
            title="Dịch vụ không tồn tại"
            description="Thông tin dịch vụ có thể đã bị xoá hoặc không tồn tại"
            icon={Info}
          />
        )}

        {!isLoading && serviceView && <AdminServiceDetailContent service={serviceView} />}
      </DrawerContent>
    </Drawer>
  );
}

function AdminServiceDetailContent({ service }: { service: TServiceView }) {
  return (
    <div className="flex-1 space-y-6 overflow-y-auto p-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-foreground text-2xl font-bold">{service.name}</h2>
        {service.isActive ? (
          <Badge>Hoạt động</Badge>
        ) : (
          <Badge variant="secondary" className="text-muted-foreground">
            Ngừng hoạt động
          </Badge>
        )}
      </div>
      <ServiceImage images={service.images} />
      <div>
        <h3 className="text-muted-foreground mb-2 text-sm font-semibold">Mô tả</h3>
        <p className="text-foreground text-base leading-relaxed">{service.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-secondary rounded-lg p-3">
          <div className="mb-1 flex items-center gap-2">
            <DollarSign className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground text-sm font-medium">Giá tiền</span>
          </div>
          <p className="text-foreground text-lg font-bold">{service.price}</p>
        </div>

        <div className="bg-secondary rounded-lg p-3">
          <div className="mb-1 flex items-center gap-2">
            <Clock className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground text-sm font-medium">Thời lượng</span>
          </div>
          <p className="text-foreground text-lg font-bold">{service.duration} phút</p>
        </div>

        <div className="space-y-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Tag className="text-muted-foreground h-4 w-4" />
              <label className="text-muted-foreground text-sm font-semibold">Danh mục</label>
            </div>
            <Badge variant="outline" className="border-border">
              {service.categoryLabel}
            </Badge>
          </div>

          {service.requiredSpecialties.length > 0 && (
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Zap className="text-muted-foreground h-4 w-4" />
                <label className="text-muted-foreground text-sm font-semibold">
                  Chuyên môn yêu cầu
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {service.requiredSpecialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-border border-t pt-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Calendar className="text-muted-foreground h-3.5 w-3.5" />
              <span className="text-muted-foreground text-xs">Tạo lúc</span>
            </div>
            <p className="text-foreground font-medium">{service.createdAtLabel}</p>
          </div>
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Calendar className="text-muted-foreground h-3.5 w-3.5" />
              <span className="text-muted-foreground text-xs">Cập nhật lúc</span>
            </div>
            <p className="text-foreground font-medium">{service.updatedAtLabel}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
function ServiceImage({ images }: { images: TService['images'] }) {
  return (
    <div>
      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {images.map((image) => (
            <div
              key={image._id}
              className="border-border relative overflow-hidden rounded-lg border"
            >
              <img
                src={image.url || '/placeholder.svg'}
                alt="Service"
                className="h-40 w-full object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="border-border bg-muted/30 flex h-40 items-center justify-center rounded-lg border-2 border-dashed">
          <p className="text-muted-foreground text-sm">Dịch vụ chưa cập nhật hình ảnh</p>
        </div>
      )}
    </div>
  );
}
