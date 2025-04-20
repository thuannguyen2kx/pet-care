import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Clock,
  Lock,
  Unlock,
} from "lucide-react";
import { toast } from "sonner";
import { useGetUserById } from "@/features/user/hooks/queries/get-user";
import { useChangeUserStatus } from "@/features/user/hooks/mutations/use-change-user-status";
import { StatusUser, StatusUserType } from "@/constants";

const CustomerDetail = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<StatusUserType | undefined>(
    undefined
  );

  const { data, isLoading, isError } = useGetUserById(customerId || "");
  const user = data?.user;
  const changeStatus = useChangeUserStatus();

  const handleStatusChange = async () => {
    if (!customerId || !newStatus) return;

    try {
      await changeStatus.mutateAsync({
        userId: customerId,
        status: newStatus,
      });

      toast.success(
        newStatus === StatusUser.ACTIVE
          ? "Đã mở khóa tài khoản thành công"
          : "Đã khóa tài khoản thành công"
      );
      setShowStatusDialog(false);
      setNewStatus(undefined);
    } catch {
      toast.error("Không thể thay đổi trạng thái tài khoản");
    }
  };

  const openStatusDialog = (status: StatusUserType) => {
    setNewStatus(status);
    setShowStatusDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "INACTIVE":
        return "bg-yellow-100 text-yellow-800";
      case "BANNED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getGenderText = (gender: string) => {
    switch (gender) {
      case "MALE":
        return "Nam";
      case "FEMALE":
        return "Nữ";
      case "OTHER":
        return "Khác";
      default:
        return "Không xác định";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        Đang tải thông tin người dùng...
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="p-4 text-red-500">Lỗi khi tải thông tin người dùng</div>
    );
  }

  // Kiểm tra xem có phải khách hàng không
  if (user.role !== "CUSTOMER") {
    return (
      <div className="p-4">
        <p className="text-yellow-600 mb-4">
          Người dùng này không phải là khách hàng.
        </p>
        <Button onClick={() => navigate(`/admin/customers`)}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={() => navigate("/admin/customers")}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Quay lại danh sách
      </Button>

      {/* User header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
            {user.profilePicture?.url ? (
              <img
                src={user.profilePicture.url}
                alt={user.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary text-white text-xl">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.fullName}</h1>
            <div className="flex items-center mt-1">
              <Badge className={getStatusColor(user.status)}>
                {user.status === StatusUser.ACTIVE && "Đang hoạt động"}
                {user.status === StatusUser.BLOCKED && "Đã khóa"}
                {user.status === StatusUser.INACTIVE && "Không hoạt động"}
              </Badge>
            </div>
          </div>
        </div>
        <div>
          {user.status === "ACTIVE" ? (
            <Button
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => openStatusDialog(StatusUser.BLOCKED)}
            >
              <Lock className="h-4 w-4 mr-2" /> Khóa tài khoản
            </Button>
          ) : (
            <Button
              variant="outline"
              className="text-green-600 border-green-200 hover:bg-green-50"
              onClick={() => openStatusDialog("ACTIVE")}
            >
              <Unlock className="h-4 w-4 mr-2" /> Mở khóa tài khoản
            </Button>
          )}
        </div>
      </div>

      {/* User information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Thông tin cá nhân</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <div className="font-medium">Email</div>
                  <div>{user.email}</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <div className="font-medium">Số điện thoại</div>
                  <div>{user.phoneNumber || "Chưa cập nhật"}</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="h-5 w-5 flex items-center justify-center text-gray-500 mt-0.5">
                  <span className="text-sm font-medium">G</span>
                </div>
                <div>
                  <div className="font-medium">Giới tính</div>
                  <div>{getGenderText(user.gender)}</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <div className="font-medium">Ngày tạo tài khoản</div>
                  <div>
                    {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <div className="font-medium">Đăng nhập gần nhất</div>
                  <div>
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleString("vi-VN")
                      : "Không cập nhật"}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Trạng thái tài khoản</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">Trạng thái hiện tại</div>
                <Badge className={`px-3 py-1 ${getStatusColor(user.status)}`}>
                  {user.status === StatusUser.ACTIVE && "Đang hoạt động"}
                  {user.status === StatusUser.BLOCKED && "Đã khóa"}
                  {user.status === StatusUser.INACTIVE && "Không hoạt động"}
                </Badge>
              </div>

              <div className="pt-4">
                <p className="text-gray-600 mb-4">
                  {user.status === "ACTIVE"
                    ? "Người dùng này đang có thể đăng nhập và sử dụng tất cả các tính năng của hệ thống."
                    : "Người dùng này đang bị khóa và không thể đăng nhập vào hệ thống."}
                </p>

                {user.status === StatusUser.ACTIVE ? (
                  <Button
                    variant="outline"
                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => openStatusDialog(StatusUser.BLOCKED)}
                  >
                    <Lock className="h-4 w-4 mr-2" /> Khóa tài khoản này
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full text-green-600 border-green-200 hover:bg-green-50"
                    onClick={() => openStatusDialog(StatusUser.ACTIVE)}
                  >
                    <Unlock className="h-4 w-4 mr-2" /> Mở khóa tài khoản này
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Change Dialog */}
      <AlertDialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {newStatus === StatusUser.ACTIVE ? "Mở khóa tài khoản" : "Khóa tài khoản"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {newStatus === StatusUser.ACTIVE ? (
                <>
                  Bạn có chắc chắn muốn mở khóa tài khoản cho{" "}
                  <strong>{user.fullName}</strong>?
                </>
              ) : (
                <>
                  Bạn có chắc chắn muốn khóa tài khoản của{" "}
                  <strong>{user.fullName}</strong>?
                  <p className="mt-2 text-red-500">
                    Người dùng sẽ không thể đăng nhập hoặc sử dụng dịch vụ cho
                    đến khi được mở khóa.
                  </p>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleStatusChange}
              className={
                newStatus === StatusUser.BLOCKED
                  ? "bg-red-600 hover:bg-red-700"
                  : ""
              }
            >
              {newStatus === StatusUser.ACTIVE ? "Mở khóa" : "Khóa tài khoản"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CustomerDetail;
