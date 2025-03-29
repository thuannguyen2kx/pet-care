import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";


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
import { registerSchema } from "@/features/auth/schema";
import GoogleOauthButton from "@/features/auth/components/google-oauth-button";
import { useRegister } from "@/features/auth/hooks/mutations/use-register";
import { AUTH_ROUTES } from "@/routes/common/routePaths";

const SignUp = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useRegister();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    const { fullName, email, password } = values;
    if (isPending) return;

    mutate(
      { fullName, email, password },
      {
        onSuccess: () => {
          navigate(AUTH_ROUTES.SIGN_IN);
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-none shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Tạo tài khoản</CardTitle>
          <CardDescription>
            Đăng ký bằng Email hoặc tài khoản Google của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <div className="flex flex-col gap-4">
                  <GoogleOauthButton label="Đăng ký" />
                </div>
                <div className="relative text-sm text-center after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 px-2 bg-background text-muted-foreground">
                    Hoặc đăng ký bằng
                  </span>
                </div>
                <div className="grid gap-2">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                            Họ Tên
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nguyen Thanh Thuan"
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
                          <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                            Mật Khẩu
                          </FormLabel>
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
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                            Mật Khẩu Nhập Lại
                          </FormLabel>
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
                    Đăng ký
                  </Button>
                </div>
                <div className="text-sm text-center">
                  Bạn đã có tài khoản?{" "}
                  <Link to="/sign-in" className="underline underline-offset-4">
                    Đăng nhập
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        Bằng cách đăng ký, bạn đã đồng ý với <a href="#">Điều khoản dịch vụ</a>{" "}
        và <a href="#">Chính sách bảo mật</a> của chúng tôi.
      </div>
    </div>
  );
};
export default SignUp;
