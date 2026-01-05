import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import { CreateBreakTemplateDialog } from '@/features/employee-schedule/components/break-template/create-break-template/create-break-template-dialog';
import { ScheduleGrid } from '@/features/employee-schedule/components/employee-schedule/schedule-grid';
import { WeekToolbar } from '@/features/employee-schedule/components/employee-schedule/week-toolbar';
import { ScheduleDetailDrawer } from '@/features/employee-schedule/components/schedule-detail-drawer/schedule-detail-drawer';
import { CreateShiftOverrideDialog } from '@/features/employee-schedule/components/shift-override/create-shif-override/create-shift-override-dialog';
import { BulkShiftTemplateDialog } from '@/features/employee-schedule/components/shift-template/bulk-shift-template/bulk-shift-template-dialog';
import { CreatShiftTemplateDialog } from '@/features/employee-schedule/components/shift-template/create-shift-template/create-shift-template-dialog';
import type { TEmployeeWeekSchedule } from '@/features/employee-schedule/domain/schedule.type';
import type {
  BulkCreateShiftsPayload,
  CreateShiftOverridePayload,
  CreateShiftTemplatePayload,
  TCreateBreakTemplatePayload,
} from '@/features/employee-schedule/schemas';
import { paths } from '@/shared/config/paths';

type Props = {
  weekDates: Date[];
  employees: TEmployeeWeekSchedule[];
  navigateWeek: (type: 'prev' | 'next' | 'today') => void;
  onCreateShiftTemplate: ({
    employeeId,
    payload,
  }: {
    employeeId: string;
    payload: CreateShiftTemplatePayload;
  }) => void;
  onBulkCreateShiftTemplate: (payload: BulkCreateShiftsPayload) => void;
  onCreateShiftOverride: ({
    employeeId,
    payload,
  }: {
    employeeId: string;
    payload: CreateShiftOverridePayload;
  }) => void;
  onCreateBreakTemplate: ({
    employeeId,
    payload,
  }: {
    employeeId: string;
    payload: TCreateBreakTemplatePayload;
  }) => void;
};
export function AdminSchedulePrecenter({
  weekDates,
  employees,
  navigateWeek,
  onCreateShiftTemplate,
  onBulkCreateShiftTemplate,
  onCreateShiftOverride,
  onCreateBreakTemplate,
}: Props) {
  const navigate = useNavigate();

  const [openCreateShiftTemplate, setOpenShiftTemplate] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [openBulkShiftTemplate, setOpenBulkShiftTemplate] = useState(false);
  const [openCreateShiftOverride, setOpenCreateShiftOverride] = useState(false);
  const [openCreateBreakTemplate, setOpenCreateBreakTemplate] = useState(false);
  const [openViewEmployeeSchedule, setOpenViewEmployeeSchedule] = useState(false);

  const handleCreateShiftTemplate = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setOpenShiftTemplate(true);
  };
  const handleBulkCreateShiftTemplate = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setOpenBulkShiftTemplate(true);
  };

  const handleCreateShiftOverride = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setOpenCreateShiftOverride(true);
  };
  const handleCreateBreakTemplate = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setOpenCreateBreakTemplate(true);
  };

  const handleNavigateEmployeeSchedule = (employeeId: string) => {
    navigate(paths.admin.employeeSchedule.getHref(employeeId));
  };

  const handleViewEmployeeSchedule = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setOpenViewEmployeeSchedule(true);
  };

  const selectedEmployee = useMemo(() => {
    return employees.find((e) => e.employeeId === selectedEmployeeId);
  }, [employees, selectedEmployeeId]);
  return (
    <>
      <WeekToolbar
        weekDates={weekDates}
        onNext={() => navigateWeek('next')}
        onPrev={() => navigateWeek('prev')}
        onToday={() => navigateWeek('today')}
      />
      <ScheduleGrid
        weekDates={weekDates}
        employees={employees}
        onCreateShift={handleCreateShiftTemplate}
        onBulkCreateShift={handleBulkCreateShiftTemplate}
        onCreateShiftOverride={handleCreateShiftOverride}
        onCreateBreakTemplate={handleCreateBreakTemplate}
        onNavigateSchedule={handleNavigateEmployeeSchedule}
        onViewEmployeeSchedule={handleViewEmployeeSchedule}
      />
      {selectedEmployeeId && (
        <>
          <CreatShiftTemplateDialog
            open={openCreateShiftTemplate}
            onOpenChange={setOpenShiftTemplate}
            employeeId={selectedEmployeeId}
            onSubmit={onCreateShiftTemplate}
          />
          <BulkShiftTemplateDialog
            open={openBulkShiftTemplate}
            onOpenChange={setOpenBulkShiftTemplate}
            employeeId={selectedEmployeeId}
            employeeFullName={selectedEmployee?.fullName ?? 'Chưa cập nhật thống tin nhân viên'}
            onSubmit={onBulkCreateShiftTemplate}
          />
          <CreateShiftOverrideDialog
            open={openCreateShiftOverride}
            onOpenChange={setOpenCreateShiftOverride}
            employeeId={selectedEmployeeId}
            employeeFullName={selectedEmployee?.fullName ?? 'Chưa cập nhật thống tin nhân viên'}
            onSubmit={onCreateShiftOverride}
          />
          <CreateBreakTemplateDialog
            open={openCreateBreakTemplate}
            onOpenChange={setOpenCreateBreakTemplate}
            employeeId={selectedEmployeeId}
            employeeFullName={selectedEmployee?.fullName ?? 'Chưa cập nhật thống tin nhân viên'}
            onSubmit={onCreateBreakTemplate}
          />
          <ScheduleDetailDrawer
            open={openViewEmployeeSchedule}
            onOpenChange={setOpenViewEmployeeSchedule}
            emloyeeId={selectedEmployeeId}
          />
        </>
      )}
    </>
  );
}
