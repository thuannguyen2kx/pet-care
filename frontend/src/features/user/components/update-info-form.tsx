import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { GENDER, GenderType } from "@/constants";
import { Button } from "@/components/ui/button";

import { useUpdateProfileInfo } from "../hooks/mutations/update-profile-info";
import { updateProfileInfoSchema } from "../schema";

interface UpdateProfileInfoFormProps {
  data: {
    fullName: string;
    phoneNumber?: string;
    email: string;
    gender: GenderType;
  };
  onCancel: () => void;
}
export const UpdateProfileInfoForm = ({
  data,
  onCancel,
}: UpdateProfileInfoFormProps) => {
  const { mutate, isPending } = useUpdateProfileInfo();

  const form = useForm<z.infer<typeof updateProfileInfoSchema>>({
    resolver: zodResolver(updateProfileInfoSchema),
    defaultValues: data,
  });

  const onSubmit = (values: z.infer<typeof updateProfileInfoSchema>) => {
    mutate(values);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-3">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                  Tên hiển thị
                </FormLabel>

                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="Họ tên"
                    className="border-orange-200 focus-visible:ring-orange-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </FormLabel>

                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="Email"
                    className="border-orange-200 focus-visible:ring-orange-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </FormLabel>

                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="0123456789"
                    className="border-orange-200 focus-visible:ring-orange-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                  Giới tính
                </FormLabel>

                <FormControl>
                  <FormControl>
                    <RadioGroup
                      disabled={isPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={GENDER.MALE} />
                        </FormControl>
                        <FormLabel className="font-normal">Nam</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={GENDER.FEMALE} />
                        </FormControl>
                        <FormLabel className="font-normal">Nữ</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={GENDER.OTHER} />
                        </FormControl>
                        <FormLabel className="font-normal">Khác</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-3 justify-end">
          <Button
            disabled={isPending}
            type="button"
            variant="outline"
            size="sm"
            className="border-gray-300 hover:bg-gray-50"
            onClick={onCancel}
          >
            Hủy
          </Button>
          <Button
            disabled={isPending}
            type="submit"
            variant="default"
            size="sm"
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Đang cập nhật" : "Cập nhật"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
