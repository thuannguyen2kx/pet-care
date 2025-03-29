import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AUTH_ROUTES, CUSTOMER_ROUTES } from "@/routes/common/routePaths";
import { useStore } from "@/store/store";

const GoogleOAuth = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { setAccessToken } = useStore();

  const accessToken = params.get("access_token");
  const currentWorkspace = params.get("current_workspace");

  React.useEffect(() => {
    if (accessToken) {
      setAccessToken(accessToken);
      navigate(CUSTOMER_ROUTES.HOME);
    }
  }, [accessToken, currentWorkspace, navigate, setAccessToken]);

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 min-h-svh bg-muted md:p-10">
      <div className="flex flex-col w-full max-w-sm gap-6">
        <Link to="/" className="text-2xl font-bold text-white">
          <img src="/assets/images/logo.svg" alt="Logo" className="h-40" />
        </Link>

        <div className="flex flex-col gap-6"></div>
      </div>
      <Card>
        <CardContent>
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Đăng nhập thất bại</h1>
            <p>
              Bạn không thể đăng nhập với tài khoản Google của bạn. Vui lòng thử
              lại!
            </p>

            <Button
              onClick={() => navigate(AUTH_ROUTES.SIGN_IN)}
              style={{ marginTop: "20px" }}
            >
              Quay lại trang đăng nhập
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleOAuth;
