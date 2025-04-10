import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Pencil,
  Trash,
  MoreHorizontal,
  Plus,
  Search,
  Filter,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDeleteEmployee } from "../hooks/mutations/delete-employee";
import { useGetEmployees } from "../hooks/queries/get-employees";
import { Specialty, specialtyTranslations, statusTranslations, StatusUser, StatusUserType } from "@/constants";
import { ADMIN_ROUTES } from "@/routes/common/routePaths";

export default function EmployeeList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>();
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const deleteEmployee = useDeleteEmployee();

  // Use the filters in the query
  const { data } = useGetEmployees({
    status: statusFilter  === "ALL" ? undefined : statusFilter as StatusUserType,
    specialty: specialtyFilter === "ALL ?" ? undefined : specialtyFilter,
  });

  const employees = data?.employees || [];
  
  // Filter employees by search term
  const filteredEmployees = employees.filter((employee ) =>
    employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle employee deletion
  const handleDeleteClick = (id: string) => {
    setEmployeeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (employeeToDelete) {
      deleteEmployee.mutate(employeeToDelete);
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    }
  };

  // Get status badge color
  const getStatusBadge = (status: StatusUserType) => {
    switch (status) {
      case StatusUser.ACTIVE:
        return <Badge variant="default" className="bg-green-500">Đang hoạt động</Badge>;
      case StatusUser.INACTIVE:
        return <Badge variant="secondary">Không hoạt động</Badge>;
      case StatusUser.BLOCKED:
        return <Badge variant="destructive">Bị vô hiệu hoá</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý nhân viên</h2>
        <Button 
          onClick={() => navigate(ADMIN_ROUTES.EMPLOYEE_NEW)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Thêm nhân viên 
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách nhân viên</CardTitle>
          <CardDescription>
           Quản lý nhân viên, chuyên môn và lịch trình. 
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm nhân viên..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[280px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>{statusTranslations[statusFilter as StatusUserType] || statusFilter || "Trang thái nhân viên"}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả</SelectItem>
                  <SelectItem value={StatusUser.ACTIVE}>Đang hoạt động</SelectItem>
                  <SelectItem value={StatusUser.INACTIVE}>Không hoạt động</SelectItem>
                  <SelectItem value={StatusUser.BLOCKED}>Bị vô hiệu hoá</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={specialtyFilter}
                onValueChange={setSpecialtyFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>{specialtyTranslations[specialtyFilter as Specialty] || specialtyFilter || "Chuyên môn"}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả</SelectItem>
                  {Object.values(Specialty).map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialtyTranslations[specialty]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="w-[250px]">Họ tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Chuyên môn</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                     Không tìm thấy nhân viên 
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee._id}>
                      <TableCell>
                        <Avatar>
                          <AvatarImage 
                            src={employee.profilePicture?.url || ''} 
                            alt={employee.fullName} 
                          />
                          <AvatarFallback>
                            {employee.fullName.split(' ').map(name => name[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{employee.fullName}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {employee.employeeInfo?.specialties.map((specialty, idx) => (
                            <Badge key={idx} variant="outline" className="capitalize">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(employee.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigate(`/admin/employees/${employee._id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/admin/employees/${employee._id}/edit`)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteClick(employee._id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Xoá
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this employee?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The employee will be marked as inactive
              and all their data will be preserved, but they will no longer appear
              in active employee lists.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}