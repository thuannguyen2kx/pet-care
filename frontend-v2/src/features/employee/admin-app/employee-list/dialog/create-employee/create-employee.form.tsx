import { FormProvider, type UseFormReturn } from 'react-hook-form';

import {
  EmployeeEmailField,
  EmployeeNameField,
  EmployeePhoneFiled,
} from '@/features/employee/components/form-fields';
import { EmployeeHourlyRateField } from '@/features/employee/components/form-fields/employee-hourly-rate.field';
import { EmployeeSpecialtiesField } from '@/features/employee/components/form-fields/employee-specialties.field';
import type { CreateEmployee } from '@/features/employee/domain/employee-state';
import { ScrollArea } from '@/shared/ui/scroll-area';

type Props = {
  form: UseFormReturn<CreateEmployee>;
};
export function CreateEmployeeForm({ form }: Props) {
  return (
    <FormProvider {...form}>
      <ScrollArea className="max-h-[70vh] pr-4">
        <form className="space-y-4">
          <EmployeeNameField />
          <EmployeeEmailField />
          <EmployeePhoneFiled />
          <EmployeeHourlyRateField />
          <EmployeeSpecialtiesField />
        </form>
      </ScrollArea>
    </FormProvider>
  );
}
