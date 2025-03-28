import { Link, Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen">
      <section className="hidden w-1/2 items-center justify-center bg-brand-100 p-10 lg:flex xl:w-2/5">
        <div className="flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12">
          <Link to="/" className="text-2xl font-bold text-white">
            <img src="/assets/images/logo.svg" alt="Logo" className="h-40" />
          </Link>
          <div className="space-y-5 text-white">
            <h1 className="h1">Care for Your Pets with Love</h1>
            <p className="body-1">
              A dedicated space to manage your pet’s health, schedule, and
              needs.
            </p>
          </div>
          <img
            src="/assets/images/cat.svg"
            alt="Files"
            width={342}
            height={342}
            className="w-full transition-all hover:rotate-2 hover:scale-105"
          />
        </div>
      </section>

      <section className="flex flex-1 flex-col items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0">
        <div className="mb-16 lg:hidden">
          <Link to={"/"}>PetCare</Link>
        </div>

        <Outlet />
      </section>
    </div>
  );
};
export default AuthLayout;
