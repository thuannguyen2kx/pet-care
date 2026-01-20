import { useFormContext } from 'react-hook-form';

import { formatGender, formatPetType } from '@/features/pets/config';
import { formatWeight } from '@/features/pets/domain/pet.helper';
import type { CreatePet } from '@/features/pets/domain/pet.state';
import { formatDateVN } from '@/shared/lib/utils';

export function CreatePetSummary() {
  const { getValues } = useFormContext<CreatePet>();
  const data = getValues();

  return (
    <div className="bg-muted/50 rounded-xl p-4">
      <h3 className="mb-3 text-lg font-semibold">Tóm tắt thông tin</h3>

      <SummarySection title="Thông tin cơ bản">
        <SummaryItem label="Tên" value={data.name} />
        <SummaryItem label="Loại" value={formatPetType(data.type)} />
        <SummaryItem label="Giống" value={data.breed} />
        <SummaryItem label="Giới tính" value={formatGender(data.gender)} />
      </SummarySection>

      <SummarySection title="Chi tiết">
        <SummaryItem label="Ngày sinh" value={formatDateVN(data.dateOfBirth)} />
        <SummaryItem label="Cân nặng" value={formatWeight(data.weight)} />
        <SummaryItem label="Màu lông" value={data.color} />
      </SummarySection>
    </div>
  );
}

function SummarySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-3 space-y-2">
      <h4 className="text-muted-foreground font-medium">{title}</h4>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
