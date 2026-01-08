import { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';

import { SplashScreen } from '@/shared/components/template/splash-screen';
import { paths } from '@/shared/config/paths';
import { STORAGE_KEYS } from '@/shared/constant';
import { guestOnlyLoader } from '@/shared/lib/auth.loader';
import { setAccessToken } from '@/shared/lib/http';
import { storage } from '@/shared/lib/storage';
import { Button } from '@/shared/ui/button';
import { Logo } from '@/shared/ui/logo';

export const clientLoader = () => guestOnlyLoader(async () => null);
export default function GoogleOAuthRoute() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const accessToken = params.get('access_token');
  useEffect(() => {
    if (accessToken) {
      setAccessToken(accessToken);
      storage.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      navigate(paths.customer.root.path);
    }
  }, [accessToken, navigate]);

  if (accessToken) return <SplashScreen />;

  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center space-y-8">
      <Link to={paths.root.path}>
        <Logo />
      </Link>
      <div className="flex flex-col items-center justify-center">
        <h1 className="h5-bold">Đăng nhập thất bại</h1>
        <p className="caption-reguler">
          Bạn không thể đăng nhập với tài khoản Google của bạn. Vui lòng thử lại!
        </p>

        <Button onClick={() => navigate(paths.auth.login.path)} style={{ marginTop: '20px' }}>
          Quay lại trang đăng nhập
        </Button>
      </div>
    </div>
  );
}
