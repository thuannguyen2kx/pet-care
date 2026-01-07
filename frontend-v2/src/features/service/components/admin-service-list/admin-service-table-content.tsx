import { Search } from 'lucide-react';

import { AdminSeriveTable } from '@/features/service/components/admin-service-list/admin-service-table';
import type { TService } from '@/features/service/domain/service.entity';
import type {
  RemoveAction,
  DetailAction,
  ToggleStatusAction,
  UpdateAction,
} from '@/features/service/hooks/use-admin-service-controller';
import { EmptyState } from '@/shared/components/template/empty-state';
import { SectionSpinner } from '@/shared/components/template/loading';

export type AdminServiceTableState =
  | { type: 'loading' }
  | { type: 'empty' }
  | { type: 'data'; services: TService[] };

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
