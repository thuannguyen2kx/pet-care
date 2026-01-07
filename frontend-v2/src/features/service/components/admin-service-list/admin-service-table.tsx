import { MoreHorizontal } from 'lucide-react';

import { CATEGORY_CONFIG } from '@/features/service/constants';
import type { TService } from '@/features/service/domain/service.entity';
import type {
  RemoveAction,
  DetailAction,
  ToggleStatusAction,
  UpdateAction,
} from '@/features/service/hooks/use-admin-service-controller';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
type Props = {
  services: TService[];
  onDetail: DetailAction['openWithId'];
  onDelete: RemoveAction['execute'];
  onToggleStatus: ToggleStatusAction['execute'];
  onUpdate: UpdateAction['openWithService'];
};
export function AdminSeriveTable({
  services,
  onDetail,
  onDelete,
  onToggleStatus,
  onUpdate,
}: Props) {
  return (
    <div className="bg-card my-6 w-full rounded-lg p-4">
      <Table>
        <TableHeader>
          <TableRow className="border-border">
            <TableHead>Tên dịch vụ</TableHead>
            <TableHead>Danh mục</TableHead>
            <TableHead className="text-right">Giá</TableHead>
            <TableHead className="text-center">Thời lượng (phút)</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service._id} className="border-border">
              <TableCell className="font-medium">{service.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {CATEGORY_CONFIG[service.category].label}
              </TableCell>
              <TableCell className="text-right">{service.price}</TableCell>
              <TableCell className="text-center">{service.duration}</TableCell>
              <TableCell>
                <Badge variant={service.isActive ? 'default' : 'secondary'}>
                  {service.isActive ? 'Hoạt động' : 'Ngưng hoạt động'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onDetail(service._id)}>
                      Xem chi tiết
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onUpdate(service)}>Chỉnh sửa</DropdownMenuItem>
                    {service.isActive && (
                      <DropdownMenuItem
                        onClick={() => onToggleStatus(service._id, service.isActive)}
                      >
                        Ngưng dịch vụ
                      </DropdownMenuItem>
                    )}
                    {!service.isActive && (
                      <DropdownMenuItem
                        onClick={() => onToggleStatus(service._id, service.isActive)}
                      >
                        Kích hoạt dịch vụ
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onDelete(service._id)}
                    >
                      Xoá
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
