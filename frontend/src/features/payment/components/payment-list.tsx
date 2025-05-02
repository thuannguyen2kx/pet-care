import { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Icons
import {
  Banknote,
  CreditCard,
  Search,
  CheckCircle,
  Filter,
  Calendar as CalendarIcon,
  UserCircle,
  RefreshCw,
  AlertCircle,
  ArrowUpDown,
  Receipt,
} from "lucide-react";

import { useMarkPaymentAsPaid } from "@/features/payment/hooks/mutation/mask-payment-as-paid";
import { useGetAdminPayments } from "@/features/payment/hooks/queries/get-admin-payments";
import { PaymentDetailType } from "@/features/payment/types/api.types";
import { PaymentListSkeleton } from "./payment-list-skeleton";

// Enums - match server side
enum PaymentStatusEnum {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUNDED = "refunded",
}

enum PaymentMethodEnum {
  CARD = "card",
  CASH = "cash",
  BANK_TRANSFER = "bank_transfer",
}

enum PaymentProcessorEnum {
  OFFLINE = "offline",
  STRIPE = "stripe",
  PAYPAL = "paypal",
  MOMO = "momo",
  VNPAY = "vnpay",
}

export interface PaymentQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  method?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  sort?: string;
}

// Helper components
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    [PaymentStatusEnum.PENDING]: {
      label: "Chưa thanh toán",
      className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    [PaymentStatusEnum.COMPLETED]: {
      label: "Đã thanh toán",
      className: "bg-green-100 text-green-800 border-green-200",
    },
    [PaymentStatusEnum.FAILED]: {
      label: "Thất bại",
      className: "bg-red-100 text-red-800 border-red-200",
    },
    [PaymentStatusEnum.REFUNDED]: {
      label: "Hoàn tiền",
      className: "bg-blue-100 text-blue-800 border-blue-200",
    },
  };

  const config = statusConfig[status as PaymentStatusEnum] || {
    label: status,
    className: "",
  };

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
};

const PaymentMethodIcon = ({ method }: { method: string }) => {
  switch (method) {
    case PaymentMethodEnum.CARD:
      return <CreditCard className="h-4 w-4" />;
    case PaymentMethodEnum.CASH:
      return <Banknote className="h-4 w-4" />;
    case PaymentMethodEnum.BANK_TRANSFER:
      return <Banknote className="h-4 w-4" />;
    default:
      return <CreditCard className="h-4 w-4" />;
  }
};

const PaymentMethodText = ({ method }: { method: string }) => {
  const methodLabels = {
    [PaymentMethodEnum.CARD]: "Thẻ tín dụng",
    [PaymentMethodEnum.CASH]: "Tiền mặt",
    [PaymentMethodEnum.BANK_TRANSFER]: "Chuyển khoản",
  };

  return <span>{methodLabels[method as PaymentMethodEnum] || method}</span>;
};

const PaymentProcessorBadge = ({ processor }: { processor: string }) => {
  const processorConfig = {
    [PaymentProcessorEnum.OFFLINE]: {
      label: "Tại cửa hàng",
      className: "bg-gray-100 text-gray-800",
    },
    [PaymentProcessorEnum.STRIPE]: {
      label: "Stripe",
      className: "bg-purple-100 text-purple-800",
    },
    [PaymentProcessorEnum.PAYPAL]: {
      label: "PayPal",
      className: "bg-blue-100 text-blue-800",
    },
    [PaymentProcessorEnum.MOMO]: {
      label: "MoMo",
      className: "bg-pink-100 text-pink-800",
    },
    [PaymentProcessorEnum.VNPAY]: {
      label: "VNPay",
      className: "bg-emerald-100 text-emerald-800",
    },
  };

  const config = processorConfig[processor as PaymentProcessorEnum] || {
    label: processor,
    className: "bg-gray-100 text-gray-800",
  };

  return (
    <Badge variant="outline" className={`${config.className} text-xs`}>
      {config.label}
    </Badge>
  );
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-10 text-center">
    <AlertCircle className="h-10 w-10 text-muted-foreground mb-3" />
    <p className="text-muted-foreground">
      Không tìm thấy thanh toán phù hợp với bộ lọc của bạn.
    </p>
  </div>
);
export const PaymentList = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [currentTab, setCurrentTab] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentDetailType | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [transactionNote, setTransactionNote] = useState<string>("");

  // Build query params for API
  const queryParams = useMemo<PaymentQueryParams>(() => {
    const params: PaymentQueryParams = { page, limit };

    if (statusFilter !== "all") params.status = statusFilter;
    if (methodFilter !== "all") params.method = methodFilter;
    if (searchQuery) params.search = searchQuery;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (sortField)
      params.sort = `${sortOrder === "desc" ? "-" : ""}${sortField}`;

    return params;
  }, [
    page,
    limit,
    statusFilter,
    methodFilter,
    searchQuery,
    startDate,
    endDate,
    sortField,
    sortOrder,
  ]);

  // Data fetching
  const { data, isLoading, refetch } = useGetAdminPayments(queryParams);
  const payments = useMemo(() => data?.payments || [], [data]);
  const pagination = data?.pagination;

  // Mutations
  const markAsPaidMutation = useMarkPaymentAsPaid();

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [
    statusFilter,
    methodFilter,
    searchQuery,
    startDate,
    endDate,
    sortField,
    sortOrder,
  ]);

  // Format currency with VND
  const formatCurrency = (amount: number, currency: string = "VND") => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Handle tab filtering (client-side)
  const filteredPayments = useMemo(() => {
    if (!payments.length) return [];

    return payments.filter((payment) => {
      if (
        currentTab === "pending" &&
        payment.status !== PaymentStatusEnum.PENDING
      )
        return false;
      if (
        currentTab === "completed" &&
        payment.status !== PaymentStatusEnum.COMPLETED
      )
        return false;
      return true;
    });
  }, [payments, currentTab]);

  // Toggle sort order
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  // Handle payment confirmation
  const handleMarkAsPaid = (payment: PaymentDetailType) => {
    setSelectedPayment(payment);
    setTransactionNote("");
    setDialogOpen(true);
  };

  const confirmMarkAsPaid = () => {
    if (!selectedPayment) return;

    markAsPaidMutation.mutate(selectedPayment._id, {
      onSuccess: () => {
        setDialogOpen(false);
        setSelectedPayment(null);
        refetch();
      }
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter("all");
    setMethodFilter("all");
    setStartDate(null);
    setEndDate(null);
    setSearchQuery("");
    setSortField("createdAt");
    setSortOrder("desc");
  };

  const totalCount = payments.length;

  // Format date for display
  const formatDateString = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd MMM, yyyy", { locale: vi });
  };

  if(isLoading) return <PaymentListSkeleton />
  return (
    <>
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Quản lý thanh toán</CardTitle>
          <CardDescription>
            Quản lý tất cả thanh toán trong hệ thống
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs
            defaultValue="all"
            value={currentTab}
            onValueChange={setCurrentTab}
            className="space-y-4"
          >
            {/* Tab Headers */}
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="all" className="relative">
                  Tất cả thanh toán
                  <Badge className="ml-2 bg-primary/10 text-primary">
                    {totalCount}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="pending" className="relative">
                  Chưa thanh toán
                </TabsTrigger>
                <TabsTrigger value="completed" className="relative">
                  Đã thanh toán
                </TabsTrigger>
              </TabsList>

              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="hidden sm:flex"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Làm mới
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo khách hàng, dịch vụ hoặc mã giao dịch"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 border-0 bg-gray-50"
                />
              </div>

              {/* Filter Controls */}
              <div className="flex flex-wrap gap-2">
                {/* Date Range */}
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-[130px] pl-3 text-left font-normal border-0 bg-gray-50"
                      >
                        {startDate ? (
                          format(new Date(startDate), "dd/MM/yyyy")
                        ) : (
                          <span>Từ ngày</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate ? new Date(startDate) : undefined}
                        onSelect={(date) =>
                          setStartDate(
                            date ? date.toISOString().split("T")[0] : null
                          )
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-[130px] pl-3 text-left font-normal border-0 bg-gray-50"
                      >
                        {endDate ? (
                          format(new Date(endDate), "dd/MM/yyyy")
                        ) : (
                          <span>Đến ngày</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate ? new Date(endDate) : undefined}
                        onSelect={(date) =>
                          setEndDate(
                            date ? date.toISOString().split("T")[0] : null
                          )
                        }
                        initialFocus
                        disabled={(date) =>
                          startDate ? date < new Date(startDate) : false
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Method Filter */}
                <Select value={methodFilter} onValueChange={setMethodFilter}>
                  <SelectTrigger className="w-[140px] border-0 bg-gray-50">
                    <div className="flex items-center">
                      <PaymentMethodIcon
                        method={
                          methodFilter !== "all"
                            ? methodFilter
                            : PaymentMethodEnum.CARD
                        }
                      />
                      <span className="ml-2 truncate">
                        {methodFilter === "all" ? (
                          "Tất cả PT"
                        ) : (
                          <PaymentMethodText method={methodFilter} />
                        )}
                      </span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả phương thức</SelectItem>
                    {Object.values(PaymentMethodEnum).map((method) => (
                      <SelectItem key={method} value={method}>
                        <div className="flex items-center">
                          <PaymentMethodIcon method={method} />
                          <span className="ml-2">
                            <PaymentMethodText method={method} />
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] border-0 bg-gray-50">
                    <div className="flex items-center">
                      <Filter className="h-4 w-4" />
                      <span className="ml-2 truncate">
                        {statusFilter === "all" ? (
                          "Trạng thái"
                        ) : (
                          <StatusBadge status={statusFilter} />
                        )}
                      </span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    {Object.values(PaymentStatusEnum).map((status) => (
                      <SelectItem key={status} value={status}>
                        <StatusBadge status={status} />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Clear Filters Button */}
                {(statusFilter !== "all" ||
                  methodFilter !== "all" ||
                  startDate ||
                  endDate ||
                  searchQuery) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-10"
                  >
                    Xoá bộ lọc
                  </Button>
                )}
              </div>
            </div>

            {/* Payment Table */}
            <TabsContent value="all" className="m-0">
              {renderPaymentsTable()}
            </TabsContent>
            <TabsContent value="pending" className="m-0">
              {renderPaymentsTable()}
            </TabsContent>
            <TabsContent value="completed" className="m-0">
              {renderPaymentsTable()}
            </TabsContent>

            {/* Pagination */}
            {pagination && !isLoading && filteredPayments.length > 0 && (
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-muted-foreground text-nowrap">
                  Hiển thị {filteredPayments.length} / {pagination.total} thanh
                  toán
                </div>

                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className={
                          page <= 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {renderPaginationLinks()}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setPage((p) =>
                            p < (pagination?.pages || 1) ? p + 1 : p
                          )
                        }
                        className={
                          page >= (pagination?.pages || 1)
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>

                <Select
                  value={limit.toString()}
                  onValueChange={(val) => {
                    setLimit(Number(val));
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-[120px] border-0 bg-gray-50">
                    <span>{limit} kết quả</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 kết quả</SelectItem>
                    <SelectItem value="10">10 kết quả</SelectItem>
                    <SelectItem value="20">20 kết quả</SelectItem>
                    <SelectItem value="50">50 kết quả</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận thanh toán</DialogTitle>
            <DialogDescription>
              Đánh dấu thanh toán tiền mặt này là đã hoàn thành. Thao tác này
              không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Khách hàng:</div>
                <div>{selectedPayment.customerId.fullName}</div>

                <div className="font-medium">Dịch vụ:</div>
                <div>{selectedPayment.appointmentId.serviceId.name}</div>

                <div className="font-medium">Số tiền:</div>
                <div>
                  {formatCurrency(
                    selectedPayment.amount,
                    selectedPayment.currency
                  )}
                </div>

                <div className="font-medium">Ngày:</div>
                <div>
                  {formatDateString(
                    selectedPayment.appointmentId.scheduledDate
                  )}
                </div>

                <div className="font-medium">Ghi chú:</div>
                <div className="col-span-2">
                  <Input
                    value={transactionNote}
                    onChange={(e) => setTransactionNote(e.target.value)}
                    placeholder="Ghi chú giao dịch (nếu có)"
                    className="mt-1 border-0 bg-gray-50"
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="border-0"
            >
              Hủy
            </Button>
            <Button
              onClick={confirmMarkAsPaid}
              disabled={markAsPaidMutation.isPending}
              className="gap-1"
            >
              {markAsPaidMutation.isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Xác nhận thanh toán
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
  // Helper function to render pagination links
  function renderPaginationLinks() {
    if (!pagination) return null;

    const { pages } = pagination;
    const maxVisiblePages = 5;

    // Simple case - show all pages
    if (pages <= maxVisiblePages) {
      return Array.from({ length: pages }).map((_, i) => {
        const pageNum = i + 1;
        return (
          <PaginationItem key={pageNum}>
            <PaginationLink
              isActive={page === pageNum}
              onClick={() => setPage(pageNum)}
            >
              {pageNum}
            </PaginationLink>
          </PaginationItem>
        );
      });
    }

    // Complex case - handle ellipsis
    const items = [];

    // Always show first page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink isActive={page === 1} onClick={() => setPage(1)}>
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Calculate range
    let startPage = Math.max(2, page - 1);
    let endPage = Math.min(pages - 1, page + 1);

    // Adjust range to show 3 pages
    if (startPage === 2) endPage = Math.min(pages - 1, 4);
    if (endPage === pages - 1) startPage = Math.max(2, pages - 3);

    // Show leading ellipsis if needed
    if (startPage > 2) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink isActive={page === i} onClick={() => setPage(i)}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show trailing ellipsis if needed
    if (endPage < pages - 1) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page
    items.push(
      <PaginationItem key={pages}>
        <PaginationLink
          isActive={page === pages}
          onClick={() => setPage(pages)}
        >
          {pages}
        </PaginationLink>
      </PaginationItem>
    );

    return items;
  }

  // Helper function to render the payments table
  function renderPaymentsTable() {
    if (!filteredPayments.length) {
      return <EmptyState />;
    }

    return (
      <div className="rounded-lg bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-100">
              <TableHead
                onClick={() => toggleSort("createdAt")}
                className="cursor-pointer"
              >
                <div className="flex items-center">
                  Ngày thanh toán
                  {sortField === "createdAt" && (
                    <ArrowUpDown
                      className={`ml-1 h-4 w-4 ${
                        sortOrder === "asc" ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>
              </TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Dịch vụ</TableHead>
              <TableHead
                onClick={() => toggleSort("amount")}
                className="cursor-pointer"
              >
                <div className="flex items-center">
                  Số tiền
                  {sortField === "amount" && (
                    <ArrowUpDown
                      className={`ml-1 h-4 w-4 ${
                        sortOrder === "asc" ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>
              </TableHead>
              <TableHead>Phương thức</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.map((payment) => (
              <TableRow
                key={payment._id.toString()}
                className="border-slate-200"
              >
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {formatDateString(payment.createdAt)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(payment.createdAt), "HH:mm")}
                    </span>
                    {payment.transactionId && (
                      <div className="text-xs text-muted-foreground flex items-center mt-1">
                        <Receipt className="h-3 w-3 mr-1" />
                        {payment.transactionId.substring(0, 12)}...
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <UserCircle className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium truncate max-w-[140px]">
                        {payment.customerId.fullName}
                      </div>
                      <div className="text-xs text-muted-foreground truncate max-w-[140px]">
                        {payment.customerId.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium truncate max-w-[140px]">
                    {payment.appointmentId.serviceId.name}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {format(
                      new Date(payment.appointmentId.scheduledDate),
                      "dd MMM",
                      { locale: vi }
                    )}{" "}
                    • {payment.appointmentId.scheduledTimeSlot.start}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    {formatCurrency(payment.amount, payment.currency)}
                  </div>
                  {payment.paymentProcessor && (
                    <div className="mt-1">
                      <PaymentProcessorBadge
                        processor={payment.paymentProcessor}
                      />
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                      <PaymentMethodIcon method={payment.method} />
                      <PaymentMethodText method={payment.method} />
                    </div>
                    <StatusBadge status={payment.status} />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2">
                    {payment.status === PaymentStatusEnum.REFUNDED &&
                      payment.refundData && (
                        <div className="text-xs text-muted-foreground">
                          <div>
                            Hoàn tiền:{" "}
                            {formatCurrency(payment.refundData.amount)}
                          </div>
                          <div>
                            {format(
                              new Date(payment.refundData.processedAt),
                              "dd/MM/yyyy"
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </TableCell>
                <TableCell>
                  {payment.method === PaymentMethodEnum.CASH &&
                    payment.status === PaymentStatusEnum.PENDING && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkAsPaid(payment)}
                        className="h-8 whitespace-nowrap"
                      >
                        <CheckCircle className="h-3.5 w-3.5 mr-1" />
                        Xác nhận
                      </Button>
                    )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
};
