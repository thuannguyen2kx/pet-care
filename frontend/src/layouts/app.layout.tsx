import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Contact,
  House,
  Loader,
  Menu,
  PackageSearch,
  Plus,
  Search,
} from "lucide-react";

import { useAuthContext } from "@/context/auth-provider";
import { UserButton } from "@/features/user/components/user-button";
import { cn } from "@/lib/utils";
import { CUSTOMER_ROUTES } from "@/routes/common/routePaths";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import CreatePostModal from "@/features/post/components/create-post-modal";
import useCreatePostModal from "@/features/post/hooks/use-create-post-modal";
import useCreatePetSheet from "@/features/pet/hooks/use-create-pet-sheet";
import { AddPetSheet } from "@/features/pet/components/add-pet-sheet";

const AppLayout = () => {
  const {open: openCreatePost, onClose: closeCreatePost} = useCreatePostModal()
  const {open: openCreatePet, onClose: closeCreatePet} = useCreatePetSheet()
  return (
    
      <div className="flex h-screen">
        <Sidebar />
        <section className="flex h-full flex-1 flex-col">
          <MobileNavigation />
          <Header />
          <div className="remove-scrollbar h-full flex-1 overflow-auto bg-white px-5 py-2 sm:mr-7 sm:rounded-[30px] md:mb-7 md:px-9 md:py-4">
            <Outlet />
            <CreatePostModal open={openCreatePost} onOpenChange={closeCreatePost} />
            <AddPetSheet open={openCreatePet} onOpenChange={closeCreatePet} />
          </div>
        </section>
      </div>
   
  );
};
export default AppLayout;

function Header() {
  return (
    <header className="hidden items-center justify-between gap-5 p-5 sm:flex xl:gap-10">
      <div className="relative w-full md:max-w-[480px]">
        <div className="flex h-[52px] flex-1 items-center gap-3 rounded-full">
          <Search className="size-6" />
          <Input
            placeholder="Tìm kiếm"
            className="body-2 shad-no-focus focus-visible:ring-0 placeholder:body-1 w-full border-none p-0 shadow-none placeholder:text-light-200"
          />
        </div>
      </div>
      <div className="flex items-center justify-center min-w-fit gap-4">
        <UserButton />
      </div>
    </header>
  );
}
function Sidebar() {
  const { user, isLoading } = useAuthContext();

  return (
    <aside className="remove-scrollbar hidden h-screen w-[90px] flex-col overflow-auto px-5 py-7 sm:flex lg:w-[280px] xl:w-[325px] !important">
      <Link to={"/"}>
        <h1 className="h1 hidden lg:block">
          PET<span className="text-brand">Care</span>
        </h1>
        <h1 className="h1 lg:hidden">PET</h1>
      </Link>

      <nav className="h5 mt-4 flex-1 gap-1 text-brand ">
        <ul className="flex flex-1 flex-col gap-6">
          <NavItem name="Trang chủ" url={CUSTOMER_ROUTES.HOME} icon={House} />
          <NavItem
            name="Tạo bài viết"
            url={CUSTOMER_ROUTES.CREATE_POST}
            icon={Plus}
          />
          <NavItem
            name="Dịch vụ"
            url={CUSTOMER_ROUTES.SERVICES}
            icon={PackageSearch}
          />
          <NavItem
            name="Lịch đặt"
            url={CUSTOMER_ROUTES.APPOINTMENTS}
            icon={Contact}
          />
        </ul>
      </nav>

      {isLoading ? (
        <div className="flex items-center justify-center border rounded-full size-10 bg-neutral-200 border-neutral-300">
          <Loader className="size-4 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="mt-4 flex items-center justify-center gap-2 rounded-full bg-brand/10 p-1 text-light-100 lg:justify-start lg:p-3">
          <UserButton />
          <div className="hidden lg:block">
            <p className="subtitle-2">{user?.fullName}</p>
            <p className="caption">{user?.email}</p>
          </div>
        </div>
      )}
    </aside>
  );
}

interface NavItemProps {
  name: string;
  url: string;
  icon: React.ElementType;
}
function NavItem({ name, url, icon: Icon }: NavItemProps) {
  const pathname = useLocation().pathname;
  const isActive = pathname === url;
  return (
    <Link to={url} className="lg:w-full">
      <li
        className={cn(
          "flex text-light-100 gap-4 rounded-xl lg:w-full justify-center lg:justify-start items-center h5 lg:px-[30px] h-[52px] lg:rounded-full",
          isActive && "bg-brand text-white"
        )}
      >
        <Icon
          className={cn(
            "w-6 filter invert opacity-25",
            isActive && "invert-0 opacity-100"
          )}
        />
        <p className="hidden lg:block">{name}</p>
      </li>
    </Link>
  );
}

function MobileNavigation() {
  const { user, isLoading } = useAuthContext();
  const [open, setOpen] = useState(false);

  return (
    <header className="flex h-[60px] justify-between px-5 sm:hidden">
      <Link to="/">
        <h1 className="h1">
          PET<span className="text-brand">Care</span>
        </h1>
      </Link>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Menu className="size-7" />
        </SheetTrigger>
        <SheetContent className="!pt-0 h-screen px-3">
          <SheetTitle>
            {isLoading ? (
              <div className="flex items-center justify-center border rounded-full size-10 bg-neutral-200 border-neutral-300">
                <Loader className="size-4 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="my-3 flex items-center gap-2 rounded-full p-1 text-light-100 sm:justify-center sm:bg-brand/10 lg:justify-start lg:p-3">
                <UserButton />
                <div className="sm:hidden lg:block">
                  <p className="subtitle-2 capitalize">{user?.fullName}</p>
                  <p className="caption">{user?.email}</p>
                </div>
              </div>
            )}
            <Separator className="mb-4 bg-light-200/20" />
          </SheetTitle>
          <nav className="h5 flex-1 gap-1 text-brand">
            <ul className="flex flex-1 flex-col gap-4">
              <NavMobileItem
                name="Trang chủ"
                url={CUSTOMER_ROUTES.HOME}
                icon={House}
              />
              <NavMobileItem
                name="Tạo bài viết"
                url={CUSTOMER_ROUTES.CREATE_POST}
                icon={Plus}
              />
              <NavMobileItem
                name="Dịch vụ"
                url={CUSTOMER_ROUTES.SERVICES}
                icon={PackageSearch}
              />
              <NavMobileItem
                name="Lịch đặt"
                url={CUSTOMER_ROUTES.APPOINTMENTS}
                icon={Contact}
              />
            </ul>
          </nav>
          <Separator className="my-5 bg-light-200/20" />
        </SheetContent>
      </Sheet>
    </header>
  );
}

function NavMobileItem({ name, url, icon: Icon }: NavItemProps) {
  const pathname = useLocation().pathname;
  const isActive = pathname === url;
  return (
    <Link to={url} className="lg:w-full">
      <li
        className={cn(
          "flex text-light-100 gap-4 px-6 rounded-xl lg:w-full justify-start items-center h5 lg:px-[30px] h-[52px] lg:rounded-full",
          isActive && "bg-brand text-white"
        )}
      >
        <Icon
          className={cn(
            "w-6 filter invert opacity-25",
            isActive && "invert-0 opacity-100"
          )}
        />
        <p>{name}</p>
      </li>
    </Link>
  );
}
