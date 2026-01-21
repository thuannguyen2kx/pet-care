import { useState } from 'react';
import { toast } from 'sonner';

import { EmployeeHeader } from '@/features/employee-schedule/admin-app/schedule-list/dialog/schedule-detail/emplyee-header';
import { BreakTemplateTab } from '@/features/employee-schedule/admin-app/schedule-list/dialog/schedule-detail/schedule-tabs/break-template-tab';
import { ShiftOverrideTab } from '@/features/employee-schedule/admin-app/schedule-list/dialog/schedule-detail/schedule-tabs/shift-override-tab';
import { WeeklyShiftTab } from '@/features/employee-schedule/admin-app/schedule-list/dialog/schedule-detail/schedule-tabs/weekly-shift-tabs';
import { useDisableShiftTemplate } from '@/features/employee-schedule/api/disable-shift-template';
import { useEmployeeDetail } from '@/features/employee-schedule/api/get-employee-detail';
import { useReplaceShiftTemplate } from '@/features/employee-schedule/api/replace-shift-template';
import { SectionSpinner } from '@/shared/components/template/loading';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/ui/drawer';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

type Props = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  emloyeeId: string;
};
type TabValue = 'shifts' | 'overrides' | 'breaks';

export function ScheduleDetailDrawer({ open, onOpenChange, emloyeeId }: Props) {
  const [activeTab, setActiveTab] = useState<TabValue>('shifts');

  const employeeDetailQuery = useEmployeeDetail({ employeeId: emloyeeId });
  const disableShiftTemplate = useDisableShiftTemplate({
    mutationConfig: {
      onSuccess: () => {
        toast.success('Đã cập nhật lịch làm việc');
      },
    },
  });
  const replaceShiftTemplate = useReplaceShiftTemplate({
    mutationConfig: {
      onSuccess: () => {
        toast.success('Đã cập nhật lịch làm việc');
      },
    },
  });

  if (employeeDetailQuery.isLoading) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent
          data-vaul-drawer-direction="right"
          className="border-border data-[vaul-drawer-direction=right]:sm:max-w-lg"
        >
          <DrawerHeader>
            <DrawerTitle>Lịch làm việc</DrawerTitle>
            <DrawerDescription>Quản lý lịch làm việc của nhân viên</DrawerDescription>
          </DrawerHeader>
          <SectionSpinner />
        </DrawerContent>
      </Drawer>
    );
  }
  if (!employeeDetailQuery.data?.data) return null;
  const { employee, schedule } = employeeDetailQuery.data.data;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        data-vaul-drawer-direction="right"
        className="border-border data-[vaul-drawer-direction=right]:sm:max-w-lg"
      >
        <DrawerHeader>
          <DrawerTitle>Lịch làm việc</DrawerTitle>
          <DrawerDescription>Quản lý lịch làm việc của nhân viên</DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="h-[90vh] pr-4">
          <div className="space-y-6 p-4">
            <EmployeeHeader employee={employee} />

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="shifts">Lịch tuần</TabsTrigger>
                <TabsTrigger value="overrides">Ngoại lệ</TabsTrigger>
                <TabsTrigger value="breaks">Thời gian nghỉ</TabsTrigger>
              </TabsList>

              <TabsContent value="shifts">
                <WeeklyShiftTab
                  shifts={schedule.shifts}
                  onDiable={disableShiftTemplate.mutate}
                  onReplace={replaceShiftTemplate.mutate}
                />
              </TabsContent>

              <TabsContent value="overrides">
                <ShiftOverrideTab overrides={schedule.overrides} />
              </TabsContent>

              <TabsContent value="breaks">
                <BreakTemplateTab breaks={schedule.breaks} />
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
