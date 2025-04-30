import { Link, Outlet } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/auth-provider";
import { UserButton } from "@/features/user/components/user-button";

const BaseLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Outlet />
    </div>
  );
};
export default BaseLayout;

const Header = () => {
  const { user } = useAuthContext();
  return (
    <header className="fixed top-0 left-0 z-20 w-full bg-transparent border-b border-slate-100 shadow-sm py-6 backdrop-blur-md">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-4xl font-bold text-orange-500">
            <span>PetCare</span>
          </div>
        </div>

        {user ? (
          <UserButton />
        ) : (
          <div className="flex items-center gap-4">
            <Button
              asChild
              variant="outline"
              className="rounded-full border-primary text-primary font-semibold px-6 bg-transparent hover:bg-primary/20"
            >
              <Link to="sign-in">Đăng nhập</Link>
            </Button>
            <Button
              asChild
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6"
            >
              <Link to="sign-up">Khám phá ngay</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
