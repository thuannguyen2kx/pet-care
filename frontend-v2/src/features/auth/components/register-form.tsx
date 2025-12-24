import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { GoogleOauthButton } from './google-oauth-button';

import { paths } from '@/shared/config/paths';
import {
  registerInputSchema,
  useRegister,
  type TRegisterInput,
  type TRegisterPayload,
} from '@/shared/lib/auth';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { Field, FieldError, FieldGroup, FieldLabel, FieldSeparator } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
export const RegisterForm = () => {
  const registering = useRegister();
  const navigate = useNavigate();

  const form = useForm<TRegisterInput>({
    resolver: zodResolver(registerInputSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    },
  });
  function onSubmit(data: TRegisterInput) {
    console.log(data);
    const payload: TRegisterPayload = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    };

    registering.mutate(payload, {
      onSuccess: () => {
        toast.success('Đăng ký thành công');
        navigate(paths.auth.login.path);
      },
    });
  }
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup>
        <Controller
          name="fullName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Họ và tên</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Nguyen Lan Anh"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="lananh@gmail.com"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup>
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Mật khẩu</FieldLabel>
              <Input
                {...field}
                type="password"
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="**********"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup>
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Nhập lại mật khẩu</FieldLabel>
              <Input
                {...field}
                type="password"
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="**********"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup data-slot="checkbox-group">
        <Controller
          name="agreeTerms"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} orientation="horizontal">
              <Checkbox
                name={field.name}
                id={field.name}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <FieldLabel htmlFor={field.name}>Điều khoản và chính sách</FieldLabel>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button type="submit" className="w-full" disabled={registering.isPending}>
        {registering.isPending ? 'Đang tạo tài khoản...' : 'Đăng ký'}
      </Button>

      <FieldSeparator className="my-4">
        <span className="bg-background text-muted-foreground px-2 uppercase">Hoặc</span>
      </FieldSeparator>

      <GoogleOauthButton label="Đăng ký" />
    </form>
  );
};
