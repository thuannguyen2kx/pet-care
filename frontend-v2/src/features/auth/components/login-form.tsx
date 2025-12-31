import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router';

import { GoogleOauthButton } from './google-oauth-button';

import { resolveHomeRoute } from '@/features/auth/helpers/resolve-home-route';
import { HTTPSTATUS } from '@/shared/constant';
import {
  loginInputSchema,
  useLogin,
  type TLoginInput,
  type TLoginPayload,
} from '@/shared/lib/auth';
import { ApiError } from '@/shared/lib/http';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { Field, FieldError, FieldGroup, FieldLabel, FieldSeparator } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';

export const LoginForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  const login = useLogin();
  const form = useForm<TLoginInput>({
    resolver: zodResolver(loginInputSchema),
    defaultValues: {
      email: '',
      password: '',
      remenberMe: false,
    },
  });

  function onSubmit(data: TLoginInput) {
    const payload: TLoginPayload = {
      email: data.email,
      password: data.password,
    };
    login.mutate(payload, {
      onSuccess: (data) => {
        if (redirectTo) {
          navigate(redirectTo);
          return;
        }
        if (data?.identity) {
          console.log('identity');
          const home = resolveHomeRoute(data.identity);
          navigate(home);
        }
      },
      onError: (error) => {
        if (error instanceof ApiError && error.status === HTTPSTATUS.UNPROCESSABLE_ENTITY) {
          const formError = error.data as TLoginPayload;
          console.log(formError);
          if (formError) {
            Object.keys(formError).forEach((key) => {
              form.setError(key as keyof TLoginPayload, {
                message: formError[key as keyof TLoginPayload],
                type: error.errorCode,
              });
            });
          }
        }
      },
    });
  }
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup>
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="email"
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
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Mật khẩu</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="password"
                aria-invalid={fieldState.invalid}
                placeholder="*********"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <FieldGroup data-grop="checkbox-group">
        <Controller
          control={form.control}
          name="remenberMe"
          render={({ field, fieldState }) => (
            <Field orientation="horizontal">
              <Checkbox
                name={field.name}
                id={field.name}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <FieldLabel htmlFor={field.name}>Ghi nhớ đăng nhập</FieldLabel>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button type="submit" className="w-full" disabled={login.isPending}>
        {login.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </Button>

      <FieldSeparator className="my-4">
        <span className="bg-background text-muted-foreground px-2 uppercase">Hoặc</span>
      </FieldSeparator>

      <GoogleOauthButton label="Đăng nhập" />
    </form>
  );
};
