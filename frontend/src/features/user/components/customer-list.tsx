import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {  Lock, Unlock, Search } from 'lucide-react';
import { UserFilters, UserType } from '@/features/user/types/api.types';
import { useGetCustomers } from '@/features/user/hooks/queries/get-users';
import { useChangeUserStatus } from '@/features/user/hooks/mutations/use-change-user-status';
import { StatusUser, StatusUserType } from '@/constants';

const CustomerList = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    status: undefined,
    page: 1,
    limit: 10,
  });
  const [tempFilters, setTempFilters] = useState<{search: string, status?: StatusUserType | "ALL"}>({
    search: '',
    status: undefined,
  });
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<StatusUserType | undefined>(undefined);
  
  const { data, isLoading, isError } = useGetCustomers(filters);
  const changeStatus = useChangeUserStatus();
  
  const handleSearch = () => {
    setFilters({
      ...filters,
      search: tempFilters.search,
      status: tempFilters.status === 'ALL' ? undefined : tempFilters.status,
      page: 1, // Reset to first page on new search
    });
  };
  
  const handleReset = () => {
    setTempFilters({
      search: '',
      status: undefined,
    });
    setFilters({
      ...filters,
      search: '',
      status: undefined,
      page: 1,
    });
  };
  
  const handlePageChange = (page: number) => {
    setFilters({
      ...filters,
      page,
    });
  };
  
  const handleStatusChange = async () => {
    if (!selectedUser || !newStatus) return;
    
    try {
      await changeStatus.mutateAsync({
        userId: selectedUser._id,
        status: newStatus as StatusUserType,
      });
      
      toast.success(newStatus === 'ACTIVE' 
        ? 'Đã mở khóa tài khoản thành công' 
        : 'Đã khóa tài khoản thành công');
      setShowStatusDialog(false);
      setSelectedUser(null);
      setNewStatus(undefined);
    } catch {
      toast.error('Không thể thay đổi trạng thái tài khoản');
    }
  };
  
  const openStatusDialog = (user: UserType, status: StatusUserType) => {
    setSelectedUser(user);
    setNewStatus(status);
    setShowStatusDialog(true);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-yellow-100 text-yellow-800';
      case 'BANNED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isError) {
    return <div className="p-4 text-red-500">Lỗi khi tải danh sách người dùng</div>;
  }

  if(!data) return null

  return (
    <div className="space-y-4">
      {/* Tiêu đề */}
      <div>
        <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
        <p className="text-gray-500 mt-1">
          Xem và quản lý trạng thái tài khoản người dùng
        </p>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                placeholder="Tìm kiếm theo tên hoặc email"
                value={tempFilters.search}
                onChange={(e) =>
                  setTempFilters({ ...tempFilters, search: e.target.value })
                }
                className="pl-10"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
            </div>
          </div>
          <div>
            <Select
              value={tempFilters.status}
              onValueChange={(value) => {
                setTempFilters({ ...tempFilters, status: value as StatusUserType | "ALL" });
                handleSearch()
              }}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"ALL"}>Tất cả</SelectItem>
                <SelectItem value={StatusUser.ACTIVE}>Đang hoạt động</SelectItem>
                <SelectItem value={StatusUser.BLOCKED}>Đã khóa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <Button variant="ghost" onClick={handleReset}>
            Đặt lại
          </Button>
          <Button onClick={handleSearch}>Tìm kiếm</Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden p-4">
        <Table>
          <TableHeader>
            <TableRow className='border-slate-200'>
              <TableHead>Người dùng</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow className='border-slate-200'>
                <TableCell colSpan={6} className="text-center py-10">
                  Đang tải danh sách người dùng...
                </TableCell>
              </TableRow>
            ) : data?.users?.length === 0 ? (
              <TableRow className='border-slate-200'>
                <TableCell colSpan={6} className="text-center py-10">
                  Không tìm thấy người dùng nào
                </TableCell>
              </TableRow>
            ) : (
              data?.users?.map((user: UserType) => (
                <TableRow key={user._id} className='border-slate-200'>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full mr-3 overflow-hidden bg-gray-200">
                        {user.profilePicture?.url ? (
                          <img
                            src={user.profilePicture.url}
                            alt={user.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary text-white text-sm">
                            {user.fullName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      {user.fullName}
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phoneNumber || "—"}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(user.status)}>
                      {user.status === StatusUser.ACTIVE && "Đang hoạt động"}
                      {user.status === StatusUser.BLOCKED && "Đã khóa"}
                      {user.status === StatusUser.INACTIVE && "Không hoạt động"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/admin/customers/${user._id}`)}
                      >
                        Xem
                      </Button>

                      {user.status === "ACTIVE" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => openStatusDialog(user, StatusUser.BLOCKED)}
                        >
                          <Lock className="h-4 w-4 mr-1" /> Khóa
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 border-green-200 hover:bg-green-50"
                          onClick={() => openStatusDialog(user, StatusUser.ACTIVE)}
                        >
                          <Unlock className="h-4 w-4 mr-1" /> Mở khóa
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {data?.totalPages > 1 && (
          <div className="py-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      handlePageChange(Math.max(1, (filters.page || 1) - 1))
                    }
                    className={
                      (filters?.page || 1) <= 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(5, data.totalPages) }).map(
                  (_, index) => {
                    let pageNumber;
                    const page = filters.page || 1;
                    // Logic to show correct page numbers depending on current page
                    if (data.totalPages <= 5) {
                      pageNumber = index + 1;
                    } else if (page <= 3) {
                      pageNumber = index + 1;
                    } else if (page >= data.totalPages - 2) {
                      pageNumber = data.totalPages - 4 + index;
                    } else {
                      pageNumber = page - 2 + index;
                    }

                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          onClick={() => handlePageChange(pageNumber)}
                          isActive={pageNumber === filters.page}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                )}
                {filters?.page && (
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        handlePageChange(
                          Math.min((data?.totalPages || 0), (filters.page || 0) + 1)
                        )
                      }
                      className={
                        filters?.page >= (data?.totalPages || 0)
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Status Change Dialog */}
      <AlertDialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {newStatus === StatusUser.ACTIVE
                ? "Mở khóa tài khoản"
                : "Khóa tài khoản"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {newStatus === StatusUser.ACTIVE ? (
                <>
                  Bạn có chắc chắn muốn mở khóa tài khoản cho{" "}
                  <strong>{selectedUser?.fullName}</strong>?
                </>
              ) : (
                <>
                  Bạn có chắc chắn muốn khóa tài khoản của{" "}
                  <strong>{selectedUser?.fullName}</strong>?
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

export default CustomerList;