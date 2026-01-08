import { Link } from 'react-router';

import { LoginForm } from '@/features/auth/components/login-form';
import { paths } from '@/shared/config/paths';
import { guestOnlyLoader } from '@/shared/lib/auth.loader';
import { Logo } from '@/shared/ui/logo';

export const clientLoader = () => guestOnlyLoader(async () => null);
export default function LoginRoute() {
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 lg:w-1/2 lg:px-12">
        <div className="mx-auto w-full max-w-lg">
          <div className="mb-8">
            <Logo />
          </div>
          <div className="mb-8">
            <h1 className="h5-bold text-foreground mb-2">Chào mừng trở lại!</h1>
            <p className="text-muted-foreground">Đăng nhập để tiếp tục chăm sóc thú cưng của bạn</p>
          </div>
          <LoginForm />

          <p className="text-muted-foreground mt-8 text-center text-sm">
            Chưa có tài khoản?{' '}
            <Link
              to={paths.auth.register.path}
              className="text-primary font-medium hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
      {/* Right Side - Image */}
      <div className="bg-secondary/50 hidden lg:block lg:w-1/2">
        <div className="relative flex h-full items-center justify-center p-12">
          <div className="relative aspect-square w-full max-w-lg overflow-hidden rounded-3xl">
            <img
              src="/images/login-bg.jpg"
              alt="Thú cưng hạnh phúc"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="bg-card/95 absolute right-12 bottom-12 left-12 rounded-2xl p-6 shadow-lg backdrop-blur">
            <p className="text-muted-foreground mb-3 italic">
              &ldquo;PetCare giúp mình quản lý lịch tiêm phòng và theo dõi sức khỏe cho bé Milo rất
              tiện lợi. Thật sự rất hài lòng!&rdquo;
            </p>
            <p className="text-foreground text-sm font-medium">— Lê Thị Mai, Chủ của Milo</p>
          </div>
        </div>
      </div>
    </div>
  );
}
