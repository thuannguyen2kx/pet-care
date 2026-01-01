import { Save } from 'lucide-react';
import { FormProvider } from 'react-hook-form';
import { toast } from 'sonner';

import { EmployeeInfoFormView } from '@/features/employee/components/employee-action/update-employee/employee-info-form-view';
import { useEmployeeInfoFormController } from '@/features/employee/components/employee-action/update-employee/use-employee-info-form-controller';
import type { TUpdateEmployeeInput } from '@/features/employee/shemas';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

// Todo: Use mode or capabilities
// Keep the role deterning controller
/**
 * const ADMIN_CAPABILITIES = {
  canEditBasicInfo: true,
  canEditCompensation: true,
  canEditVacation: true,
};

const EMPLOYEE_CAPABILITIES = {
  canEditBasicInfo: true,
  canEditCompensation: false,
  canEditVacation: false,
};
<EmployeeInfoFormView
  isEditing={controller.isEditing}
  capabilities={EMPLOYEE_CAPABILITIES}
/>
 *
 * */
type Props = {
  employeeId: string;
  isAdmin?: boolean;
  onClose?: () => void;
  formValues: TUpdateEmployeeInput;
};
export function EmployeeInfoFormController({ employeeId, isAdmin, formValues, onClose }: Props) {
  const controller = useEmployeeInfoFormController({
    employeeId,
    formValues,
    onSuccess: () => {
      toast.success('Cập nhật thông tin thành công');
      onClose?.();
    },
  });

  if (isAdmin) {
    return (
      <div className="w-full">
        <FormProvider {...controller.form}>
          <EmployeeInfoFormView isEditing isAdmin />
        </FormProvider>
        <div className="mt-4 flex justify-end gap-2">
          <Button onClick={controller.submit}>
            <Save className="mr-2 h-4 w-4" />
            Lưu
          </Button>
        </div>
      </div>
    );
  }
  return (
    <Card className="border-0 py-4 shadow-sm lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Thông tin chi tiết</CardTitle>
          <CardDescription>Cập nhật thông tin cá nhân và chuyên môn</CardDescription>
        </div>
        {!controller.isEditing ? (
          <Button onClick={controller.startEdit}>Chỉnh sửa</Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => controller.requestExit('cancel')}>
              Hủy
            </Button>
            <Button onClick={controller.submit}>
              <Save className="mr-2 h-4 w-4" />
              Lưu
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <FormProvider {...controller.form}>
          <EmployeeInfoFormView isEditing={controller.isEditing} />
        </FormProvider>
      </CardContent>
    </Card>
  );
}
