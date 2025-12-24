import { Check, Clock } from 'lucide-react';
import { Link, useSearchParams } from 'react-router';

import { RegisterForm } from '@/features/auth/components/register-form';
import { paths } from '@/shared/config/paths';
import { Logo } from '@/shared/ui/logo';

export default function RegisteRoute() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  return (
    <div className="flex min-h-dvh">
      {/* Left Side - Image */}
      <div className="bg-secondary/50 hidden lg:block lg:w-1/2">
        <div className="relative flex h-full items-center justify-center p-12">
          <div className="relative aspect-square w-full max-w-lg overflow-hidden">
            <img
              src="/images/register-bg.jpg"
              alt="Chăm sóc thú cưng"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="bg-card/95 absolute top-1/4 right-8 rounded-2xl p-4 shadow-lg backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                <Check className="text-primary h-5 w-5" />
              </div>
              <div>
                <p className="caption-semibold text-foreground">Miễn phí đăng ký</p>
                <p className="label-reguler text-foreground">Không cần thẻ tín dụng</p>
              </div>
            </div>
          </div>
          <div className="bg-card/95 absolute bottom-1/4 left-8 rounded-2xl p-4 shadow-lg backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="bg-accent/50 flex h-10 w-10 items-center justify-center rounded-full">
                <Clock className="text-accent-foreground h-5 w-5" />
              </div>
              <div>
                <p className="text-foreground text-sm font-medium">Đặt lịch 24/7</p>
                <p className="text-muted-foreground text-xs">Mọi lúc, mọi nơi</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 lg:w-1/2 lg:px-12">
        <div className="mx-auto w-full max-w-lg">
          <div className="mb-8">
            <Logo />
          </div>
          <div className="mb-8">
            <h1 className="h5-bold text-foreground mb-2">Tạo tài khoản mới</h1>
            <p className="text-muted-foreground">
              Tham gia cộng đồng yêu thú cưng và nhận ưu đãi đặc biệt
            </p>
          </div>
          <RegisterForm />
          <p className="text-muted-foreground mt-8 text-center text-sm">
            Đã có tài khoản?{' '}
            <Link
              to={paths.auth.login.getHref(redirectTo)}
              className="text-primary font-medium hover:underline"
            >
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
