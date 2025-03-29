import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";

import GoogleOauthButton from "@/features/auth/components/google-oauth-button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginSchema } from "@/features/auth/schema";
import { useLogin } from "@/features/auth/hooks/mutations/use-login";
import { getRedirectUrl } from "@/lib/helper";

const SignIn = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");

  const { mutate, isPending } = useLogin();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    if (isPending) return;
    mutate(values, {
      onSuccess: (data) => {
        const url = getRedirectUrl(data.user.role);
        const decodeUrl = returnUrl ? decodeURIComponent(returnUrl) : "";

        navigate(decodeUrl || url);
      },
    });
  };
  return (
    <div className="flex flex-col gap-6">
      <Card className="shadow-none border-none">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Chào mừng bạn đến với PetCare</CardTitle>
          <CardDescription>
            Đăng nhập bằng email hoặc tài khoản Google
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <div className="flex flex-col gap-4">
                  <GoogleOauthButton label="Đăng nhập" />
                </div>
                <div className="relative text-sm text-center after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 px-2 bg-background text-muted-foreground">
                    Hoặc đăng nhập bằng
                  </span>
                </div>
                <div className="grid gap-3">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="m@example.com"
                              className="!h-[48px]"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                              Mật khẩu
                            </FormLabel>
                            <a
                              href="#"
                              className="ml-auto text-sm underline-offset-4 hover:underline"
                            >
                              Quên mật khẩu?
                            </a>
                          </div>
                          <FormControl>
                            <Input
                              type="password"
                              className="!h-[48px]"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    disabled={isPending}
                    type="submit"
                    className="w-full primary-btn"
                  >
                    Đăng nhập
                  </Button>
                </div>
                <div className="text-sm text-center">
                  Don&apos;t have an account?{" "}
                  <Link to="/sign-up" className="underline underline-offset-4">
                    Đăng ký
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        Bằng cách đăng nhập, bạn đã đồng ý với <a href="#">Điều khoản dịch vụ</a>{" "}
        và <a href="#">Chính sách sách bảo mật</a> của chúng tôi.
      </div>
    </div>
  );
};

export default SignIn;
