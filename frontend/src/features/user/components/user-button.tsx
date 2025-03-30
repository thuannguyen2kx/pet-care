"use client";
import { Loader, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuthContext } from "@/context/auth-provider";
import { useLogout } from "@/features/auth/hooks/mutations/use-logout";
import { getAvatarFallbackText } from "@/lib/helper";
import { useConfirm } from "@/hooks/use-confirm";
import { Link } from "react-router-dom";

export const UserButton = () => {
  const { user, isLoading } = useAuthContext();
  const { mutate: logout } = useLogout();

  const [LogoutDialog, confirmLogout] = useConfirm(
    "Đăng xuất",
    "Bạn có chắn chắc muốn đăng xuất?"
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center border rounded-full size-10 bg-neutral-200 border-neutral-300">
        <Loader className="size-4 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!user) return null;

  const handleLogout = async () => {
    const ok = await confirmLogout();
    if (!ok) return;
    logout();
  };
  const { fullName, email } = user;
  const initials = getAvatarFallbackText(fullName);
  return (
    <>
      <LogoutDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="relative outline-none">
          <Avatar className="transition border size-10 hover:opactiy-75 border-neutral-300">
            <AvatarImage src={user.profilePicture.url || ""} alt={fullName} />
            <AvatarFallback className="flex items-center justify-center font-medium bg-neutral-200 text-neutral-500">
              {initials}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          side="bottom"
          className="w-60 border-none"
          sideOffset={10}
        >
          <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
            <Avatar className="transition border size-[52px] hover:opactiy-75 border-neutral-300">
              <AvatarFallback className="flex items-center justify-center text-xl font-medium bg-neutral-200 text-neutral-500">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center justify-center">
              <p className="text-sm font-medium text-neutral-900">{fullName}</p>
              <p className="text-sm text-neutral-500">{email}</p>
            </div>
          </div>
          <DropdownMenuItem
            asChild
            className="items-center justify-center h-10 font-medium cursor-pointer"
          >
            <Link to={`/profile/${user._id}`}>Trang cá nhân</Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleLogout}
            className="items-center justify-center h-10 font-medium cursor-pointer text-amber-700"
          >
            <LogOut className="mr-2 size-4" />
            Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
