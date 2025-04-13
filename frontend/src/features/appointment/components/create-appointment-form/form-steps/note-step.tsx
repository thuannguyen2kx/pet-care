import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { FormValues } from "@/features/appointment/utils/appointment-form-config";

interface NotesStepProps {
  form: UseFormReturn<FormValues>;
}

const NotesStep: React.FC<NotesStepProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-lg font-medium mb-2">
            Ghi chú (không bắt buộc)
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder="Nhập ghi chú cho cuộc hẹn..."
              className="min-h-[150px]"
              {...field}
            />
          </FormControl>
          <FormDescription>
            Thêm thông tin chi tiết hoặc yêu cầu đặc biệt cho cuộc hẹn của
            bạn.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default NotesStep;