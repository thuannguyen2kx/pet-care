import { Search } from 'lucide-react';

import type {
  DetailAction,
  RemoveAction,
  ToggleStatusAction,
  UpdateAction,
} from '@/features/service/admin-app/service-list/application/use-admin-service-controller';
import { AdminSeriveTable } from '@/features/service/admin-app/service-list/ui/admin-service-table';
import type { Service } from '@/features/service/domain/service.entity';
import { EmptyState } from '@/shared/components/template/empty-state';
import { SectionSpinner } from '@/shared/components/template/loading';

export type AdminServiceTableState =
  | { type: 'loading' }
  | { type: 'empty' }
  | { type: 'data'; services: Service[] };

type Props = {
  state: AdminServiceTableState;
  onDetail: DetailAction['openWithId'];
  onRemove: RemoveAction['execute'];
  onToggleStatus: ToggleStatusAction['execute'];
  onUpdate: UpdateAction['openWithService'];
};

export function AdminServiceTableContent({
  state,
  onDetail,
  onRemove,
  onToggleStatus,
  onUpdate,
}: Props) {
  switch (state.type) {
    case 'loading':
      return <SectionSpinner />;
    case 'empty':
      return (
        <EmptyState
          icon={Search}
          title="Không tìm thấy dịch vụ"
          description="Thử thay đổi từ khoá hoặc bộ lọc tìm kiếm"
        />
      );
    case 'data':
      return (
        <AdminSeriveTable
          services={state.services}
          onDetail={onDetail}
          onDelete={onRemove}
          onToggleStatus={onToggleStatus}
          onUpdate={onUpdate}
        />
      );
  }
}
