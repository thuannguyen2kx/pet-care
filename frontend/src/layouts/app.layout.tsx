import { AuthProvider } from "@/context/auth-provider";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <AuthProvider>
      <div>
        Applayout
        <Outlet />
      </div>
    </AuthProvider>
  );
};
export default AppLayout;
