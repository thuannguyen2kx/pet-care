import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { CreateEmployeeForm } from '@/features/employee/admin-app/employee-list/dialog/create-employee/create-employee.form';
import { useCreateEmployeeForm } from '@/features/employee/admin-app/employee-list/dialog/create-employee/use-create-employee';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';

export function CreateEmployeeDialog() {
  const [open, setOpen] = useState(false);
  const { form, submit, isSubmitting } = useCreateEmployeeForm({
    onSuccess: () => {
      toast.success('Tạo nhân viên thành công');
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">
          <Plus className="mr-1 size-4" />
          Thêm nhân viên mới
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm nhân viên mới</DialogTitle>
          <DialogDescription>
            Tạo tài khoản nhân viên mới. Nhân viên sẽ nhận email để hoàn tất đăng ký.
          </DialogDescription>
        </DialogHeader>
        <CreateEmployeeForm form={form} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isSubmitting}>
              Huỷ
            </Button>
          </DialogClose>
          <Button onClick={submit} disabled={isSubmitting}>
            Tạo nhân viên
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
