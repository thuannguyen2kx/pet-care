import { format } from 'date-fns';

import type {
  BreakTemplateDto,
  BuilkShiftsTemplateDto,
  CreateBreakTemplateDto,
  CreateShiftOverrideDto,
  CreateShiftTemplateDto,
  DisableShiftTemplateDto,
  EmployeeScheduleDto,
  EmployeeWeekScheduleDto,
  ReplaceShiftTemplateDto,
  ShiftOverrideDto,
  ShiftTemplateDto,
} from '@/features/employee-schedule/domain/schedule.dto';
import type {
  BreakTemplate,
  EmployeeSchedule,
  EmployeeScheduleCalendar,
  EmployeeWeekSchedule,
  ShiftOverride,
  ShiftTemplate,
} from '@/features/employee-schedule/domain/schedule.entity';
import type {
  BulkCreateShiftsTemplate,
  CreateBreakTemplate,
  CreateShiftOverride,
  CreateShiftTemplate,
  DisableShiftTemplate,
  ReplaceShiftTemplate,
} from '@/features/employee-schedule/domain/schedule.state';

// ====================
// DTO to Entity
// ====================
export const mapEmployeeScheduleDtoToEntity = (dto: EmployeeScheduleDto): EmployeeSchedule => {
  return {
    date: dto.date,
    dayOfWeek: dto.dayOfWeek,
    isWorking: dto.isWorking,
    startTime: dto.startTime,
    endTime: dto.endTime,
    breaks: dto.breaks,
    override: dto.override,
  };
};

export const mapEmployeeSchedulesDtoToEntities = (
  dto: EmployeeScheduleDto[],
): EmployeeSchedule[] => {
  return dto.map((schedule) => mapEmployeeScheduleDtoToEntity(schedule));
};

export const mapEmployeeWeekScheduleDtoToEntity = (
  dto: EmployeeWeekScheduleDto,
): EmployeeWeekSchedule => {
  return {
    employeeId: dto.employeeId,
    fullName: dto.fullName,
    email: dto.email,
    profilePicture: dto.profilePicture,
    specialties: dto.specialties,

    workHours: {
      start: dto.workHours.start,
      end: dto.workHours.end,
    },
    days: mapEmployeeSchedulesDtoToEntities(dto.days),
  };
};

export const mapEmployeeWeekSchedulesDtoToEntities = (
  dto: EmployeeWeekScheduleDto[],
): EmployeeWeekSchedule[] => {
  return dto.map((schedule) => mapEmployeeWeekScheduleDtoToEntity(schedule));
};
export function mapEmployeeScheduleToCalendarDays(
  days: EmployeeSchedule[],
): EmployeeScheduleCalendar[] {
  return days.map((d) => ({
    ...d,
    dayOfWeek: d.dayOfWeek,
    date: new Date(d.date),
  }));
}
export const mapShiftTemplateToEntity = (dto: ShiftTemplateDto): ShiftTemplate => {
  return {
    id: dto._id,
    employeeId: dto.employeeId,
    dayOfWeek: dto.dayOfWeek,
    startTime: dto.startTime,
    endTime: dto.endTime,
    effectiveFrom: new Date(dto.effectiveFrom),
    effectiveTo: dto.effectiveTo ? new Date(dto.effectiveTo) : undefined,
    isActive: dto.isActive,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  };
};
export const mapShiftTemplatesToEntity = (dtos: ShiftTemplateDto[]): ShiftTemplate[] => {
  return dtos.map(mapShiftTemplateToEntity);
};
export const mapShiftOverrideToEntity = (dto: ShiftOverrideDto): ShiftOverride => {
  return {
    id: dto._id,
    employeeId: dto.employeeId,
    date: dto.date,
    isWorking: dto.isWorking,
    reason: dto.reason,
    createdBy: dto.createdBy
      ? {
          id: dto.createdBy._id,
          fullName: dto.createdBy.fullName,
        }
      : undefined,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  };
};
export const mapShiftOverridesToEntity = (dtos: ShiftOverrideDto[]): ShiftOverride[] => {
  return dtos.map(mapShiftOverrideToEntity);
};

export const mapBreakTemplateToEntity = (dto: BreakTemplateDto): BreakTemplate => {
  return {
    id: dto._id,
    employeeId: dto.employeeId,
    dayOfWeek: dto.dayOfWeek,
    name: dto.name,
    startTime: dto.startTime,
    endTime: dto.endTime,
    effectiveFrom: new Date(dto.effectiveFrom),
    effectiveTo: dto.effectiveTo ? new Date(dto.effectiveTo) : undefined,
    isActive: dto.isActive,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  };
};
export const mapBreakTemplatesToEntity = (dtos: BreakTemplateDto[]): BreakTemplate[] => {
  return dtos.map(mapBreakTemplateToEntity);
};
// ======================
// State => Dto
// ======================
export const mapCreateShiftTemplateToDto = (state: CreateShiftTemplate): CreateShiftTemplateDto => {
  return {
    dayOfWeek: state.dayOfWeek,
    startTime: state.startTime,
    endTime: state.endTime,
    effectiveFrom: format(state.effectiveFrom, 'yyyy-MM-dd'),
    effectiveTo: state.effectiveTo ? format(state.effectiveTo, 'yyyy-MM-dd') : undefined,
  };
};
export const mapBulkShiftTemplatesToDto = (
  state: BulkCreateShiftsTemplate,
): BuilkShiftsTemplateDto => {
  return {
    shifts: Object.entries(state.days)
      .filter(([, v]) => v.isWorking)
      .map(([day, v]) => ({
        dayOfWeek: Number(day),
        startTime: v.startTime!,
        endTime: v.endTime!,
      })),
    effectiveFrom: format(state.effectiveFrom, 'yyyy-MM-dd'),
    effectiveTo: state.effectiveTo ? format(state.effectiveTo, 'yyyy-MM-dd') : undefined,
  };
};
export const mapReplaceShiftTemplateToDto = (
  state: ReplaceShiftTemplate,
): ReplaceShiftTemplateDto => {
  return {
    startTime: state.startTime,
    endTime: state.endTime,
    effectiveFrom: format(state.effectiveFrom, 'yyyy-MM-dd'),
  };
};

export const mapDisableShiftTemplateToDto = (
  state: DisableShiftTemplate,
): DisableShiftTemplateDto => {
  return {
    effectiveTo: format(state.effectiveTo, 'yyyy-MM-dd'),
  };
};
export const mapCreateShiftOverrideToDto = (state: CreateShiftOverride): CreateShiftOverrideDto => {
  const dto: CreateShiftOverrideDto = {
    date: format(state.date, 'yyyy-MM-dd'),
    reason: state.reason,
    isWorking: state.isWorking,
  };
  if (state.isWorking) {
    dto.startTime = state.startTime;
    dto.endTime = state.endTime;
  }

  return dto;
};

export const mapCreateBreakTemplateToDto = (state: CreateBreakTemplate): CreateBreakTemplateDto => {
  const base = {
    name: state.name,
    startTime: state.startTime,
    endTime: state.endTime,
    effectiveFrom: format(state.effectiveFrom, 'yyyy-MM-dd'),
    effectiveTo: state.effectiveTo ? format(state.effectiveTo, 'yyyy-MM-dd') : undefined,
  };

  if (state.breakType === 'WEEKLY') {
    return {
      ...base,
      dayOfWeek: state.dayOfWeek,
    };
  }

  return base;
};
