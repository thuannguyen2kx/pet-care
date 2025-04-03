import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Filter, MoreVertical, Edit, X } from "lucide-react";
import { toast } from "sonner";
import { useGetServices } from "../hooks/queries/get-services";
import { useDeleteService } from "../hooks/mutations/delete-service";
import { ServiceType } from "../types/api.types";
import { formatTime, formatVND } from "@/lib/helper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/use-confirm";

const ServiceList: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterPetType, setFilterPetType] = useState<string>("");
  const [filterIsActive, setFilterIsActive] = useState<boolean | undefined>(
    true
  );
  const pageSize = 10;

  // Fetch services with filters
  const { data, isLoading, isError } = useGetServices({
    category: filterCategory || undefined,
    petType: filterPetType || undefined,
    isActive: filterIsActive,
  });
  const services = data?.services;

  const { mutate: deleteService } = useDeleteService();
  const [DeleteDialog, confimDelete] = useConfirm(
    "Xoá dịch vụ",
    "Bạn có chắc chắn muốn xoá dịch vụ này không"
  );
  // Pagination logic
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedServices = services
    ? services.slice(startIndex, endIndex)
    : [];
  const totalPages = services ? Math.ceil(services.length / pageSize) : 0;

  const handleDeleteService = async (id: string) => {
    const ok = await confimDelete();
    if (!ok) return;

    deleteService(id, {
      onSuccess: () => {
        toast.success("Dịch vụ đã được xoá thành công");
      },
      onError: (error) => {
        toast.error("Xoá dịch vụ thất bại");
        console.error(error);
      },
    });
  };

  const handleEditService = (id: string) => {
    navigate(`/admin/services/edit/${id}`);
  };

  const resetFilters = () => {
    setFilterCategory("");
    setFilterPetType("");
    setFilterIsActive(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        Đang tải danh sách dịch vụ...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 p-8">
        Lỗi xảy ra khi lấy danh sách dịch vụ
      </div>
    );
  }

  return (
    <>
      <DeleteDialog />
      <Card className="w-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">Dịch vụ</CardTitle>
            <CardDescription>
              Quản lý các dịch vụ của cửa hàng bạn
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Lọc
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Lọc dịch vụ</DialogTitle>
                  <DialogDescription>
                    Áp dụng bộ lọc để tìm dịch vụ
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Loại</Label>
                    <Select
                      value={filterCategory}
                      onValueChange={setFilterCategory}
                    >
                      <SelectTrigger id="category" className="w-full">
                        <SelectValue placeholder="Chọn loại dịch vụ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả các loại</SelectItem>
                        <SelectItem value="grooming">Grooming</SelectItem>
                        <SelectItem value="medical">Medical</SelectItem>
                        <SelectItem value="training">Training</SelectItem>
                        <SelectItem value="boarding">Boarding</SelectItem>
                        <SelectItem value="daycare">Daycare</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="petType">Loại thú cưng</Label>
                    <Select
                      value={filterPetType}
                      onValueChange={setFilterPetType}
                    >
                      <SelectTrigger id="petType" className="w-full">
                        <SelectValue placeholder="Chọn loại thú cưng sử dụng" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả thú cưng</SelectItem>
                        <SelectItem value="dog">Dogs</SelectItem>
                        <SelectItem value="cat">Cats</SelectItem>
                        <SelectItem value="bird">Birds</SelectItem>
                        <SelectItem value="rabbit">Rabbits</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Trạng thái</Label>
                    <Select
                      value={
                        filterIsActive === undefined
                          ? "all"
                          : filterIsActive
                          ? "Đang cung cấp"
                          : "Không cung cấp"
                      }
                      onValueChange={(value) => {
                        if (value === "all") {
                          setFilterIsActive(undefined);
                        } else {
                          setFilterIsActive(value === "active");
                        }
                      }}
                    >
                      <SelectTrigger id="status" className="w-full">
                        <SelectValue placeholder="Trạng thái dịch vụ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="active">Đang cung cấp</SelectItem>
                        <SelectItem value="inactive">Không cung cấp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter className="sm:justify-between">
                  <Button variant="outline" onClick={resetFilters}>
                    Xoá lọc
                  </Button>
                  <DialogClose asChild>
                    <Button type="button">Tìm kiếm dịch vụ</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button onClick={() => navigate("/admin/services/create")}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm dịch vụ
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên dịch vụ</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Thời gian thực hiện</TableHead>
                <TableHead>Thú cưng khả dụng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedServices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Không tìm thấy dịch vụ
                  </TableCell>
                </TableRow>
              ) : (
                paginatedServices.map((service: ServiceType) => (
                  <TableRow key={service._id}>
                    <TableCell className="font-medium">
                      {service.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{service.category}</Badge>
                    </TableCell>
                    <TableCell>{formatVND(service.price)}</TableCell>
                    <TableCell>{formatTime(service.duration)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {service.applicablePetTypes?.map((type) => (
                          <Badge
                            key={type}
                            variant="secondary"
                            className="text-xs"
                          >
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={service.isActive ? "default" : "destructive"}
                      >
                        {service.isActive ? "Đang cung cấp" : "Không cung cấp"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost">
                            <MoreVertical />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="border-none">
                          <DropdownMenuItem asChild>
                            <Button
                              onClick={() => handleEditService(service._id)}
                              variant="ghost"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Chỉnh sửa thông tin
                            </Button>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Button
                              onClick={() => handleDeleteService(service._id)}
                              variant="ghost"
                              className="justify-start w-full"
                            >
                              <X className="mr-2 h-4 w-4" />
                              Xoá dịch vụ
                            </Button>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    className={
                      page === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={page === i + 1}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className={
                      page === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default ServiceList;
