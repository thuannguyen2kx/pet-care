import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div>
      Auth layout
      <Outlet />
    </div>
  );
};
export default AuthLayout;
