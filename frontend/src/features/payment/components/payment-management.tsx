import { useState } from "react";
import { toast } from "sonner";
import {
  CreditCard,
  DollarSign,
  RefreshCcw,
  CheckCircle,
  Receipt,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminAppointmentType } from "@/features/appointment/types/api.types";
import { PaymentType } from "../types/api.types";
import { useGetPaymentByAppointment } from "../hooks/queries/get-payment-by-appointment";
import { useCreateCheckoutSession, useProcessPayment } from "../hooks/api";
import { useMarkPaymentAsPaid } from "../hooks/mutation/mask-payment-as-paid";
import { useRefundPayment } from "../hooks/mutation/refund-payment";

// Utility functions
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return dateString;
  }
};

const getPaymentStatusLabel = (status: string) => {
  switch (status) {
    case "completed":
      return "Đã thanh toán";
    case "pending":
      return "Chờ thanh toán";
    case "failed":
      return "Thanh toán thất bại";
    case "refunded":
      return "Đã hoàn tiền";
    default:
      return "Không xác định";
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "failed":
      return "bg-red-100 text-red-800 border-red-200";
    case "refunded":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getPaymentMethodLabel = (method: string) => {
  switch (method) {
    case "card":
      return "Thẻ tín dụng/ghi nợ";
    case "cash":
      return "Tiền mặt";
    case "bank_transfer":
      return "Chuyển khoản ngân hàng";
    default:
      return method;
  }
};

// Main component
const PaymentManagement = ({
  appointment,
  isLoading,
  isAdmin = false,
}: {
  appointment: AdminAppointmentType | undefined;
  isLoading: boolean;
  isAdmin?: boolean;
}) => {
  const [refundAmount, setRefundAmount] = useState<string>("");
  const [refundReason, setRefundReason] = useState<string>("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  // Get payment data
  const { data: paymentData } = useGetPaymentByAppointment(
    appointment?._id || ""
  );

  const payment: PaymentType | undefined = paymentData?.payment;

  // Mutations
  const checkoutMutation = useCreateCheckoutSession();
  const paymentMutation = useProcessPayment();

  const markAsPaidMutation = useMarkPaymentAsPaid();

  const refundMutation = useRefundPayment();

  const handlePaymentMethodSelect = () => {
    if (!appointment) return;

    if (selectedPaymentMethod === "card") {
      checkoutMutation.mutate(appointment._id);
    } else {
      paymentMutation.mutate({
        appointmentId: appointment._id,
        paymentMethod: selectedPaymentMethod,
      });
    }
  };

  const handleRefund = () => {
    if (!payment || !refundAmount) return;

    const amount = parseFloat(refundAmount);
    if (isNaN(amount) || amount <= 0 || amount > payment.amount) {
      toast.error("Số tiền hoàn không hợp lệ");
      return;
    }

    refundMutation.mutate({
      paymentId: payment._id,
      amount,
      reason: refundReason,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-32" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-48" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!appointment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Thanh toán</CardTitle>
          <CardDescription>Không có dữ liệu lịch hẹn</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Thông tin thanh toán
        </CardTitle>
        <CardDescription>
          Quản lý thanh toán cho dịch vụ: {appointment.serviceId.name}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="font-medium">Trạng thái:</div>
          <Badge
            variant="outline"
            className={getPaymentStatusColor(
              payment?.status || appointment.paymentStatus
            )}
          >
            {getPaymentStatusLabel(
              payment?.status || appointment.paymentStatus
            )}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="font-medium">Số tiền:</div>
          <div className="font-semibold">
            {(payment?.amount || appointment.totalAmount || 0).toLocaleString()}{" "}
            VNĐ
          </div>
        </div>

        {payment && (
          <>
            <div className="flex items-center justify-between">
              <div className="font-medium">Phương thức:</div>
              <div>{getPaymentMethodLabel(payment.method)}</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="font-medium">Thời gian:</div>
              <div>{formatDate(payment.createdAt)}</div>
            </div>

            {payment.transactionId && (
              <div className="flex items-center justify-between">
                <div className="font-medium">Mã giao dịch:</div>
                <div className="text-sm text-gray-600 truncate max-w-[180px]">
                  {payment.transactionId}
                </div>
              </div>
            )}

            {payment.refundData && (
              <>
                <Separator />
                <div className="text-sm font-medium text-orange-600">
                  Thông tin hoàn tiền
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-medium">Số tiền hoàn:</div>
                  <div>{payment.refundData.amount.toLocaleString()} VNĐ</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-medium">Thời gian:</div>
                  <div>{formatDate(payment.refundData.processedAt)}</div>
                </div>
                <div>
                  <div className="font-medium mb-1">Lý do:</div>
                  <div className="text-sm text-gray-600">
                    {payment.refundData.reason}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </CardContent>

      <CardFooter className="flex flex-col space-y-2">
        <Separator className="mb-2" />

        {/* Customer Payment Options */}
        {!isAdmin && !payment && appointment.paymentStatus !== "completed" && (
          <div className="w-full">
            <Dialog
              open={isPaymentDialogOpen}
              onOpenChange={setIsPaymentDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="w-full">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Thanh toán ngay
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Chọn phương thức thanh toán</DialogTitle>
                  <DialogDescription>
                    Vui lòng chọn phương thức thanh toán cho dịch vụ:{" "}
                    {appointment.serviceId.name}
                  </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                  <div className="font-medium mb-2">Số tiền thanh toán:</div>
                  <div className="text-xl font-bold mb-4">
                    {appointment.totalAmount?.toLocaleString() || 0} VNĐ
                  </div>

                  <Select
                    value={selectedPaymentMethod}
                    onValueChange={setSelectedPaymentMethod}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phương thức thanh toán" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Thẻ tín dụng/ghi nợ
                        </div>
                      </SelectItem>
                      <SelectItem value="bank_transfer">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2" />
                          Chuyển khoản ngân hàng
                        </div>
                      </SelectItem>
                      <SelectItem value="cash">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2" />
                          Tiền mặt tại cửa hàng
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {selectedPaymentMethod === "bank_transfer" && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm">
                      <p className="font-medium mb-2">
                        Thông tin chuyển khoản:
                      </p>
                      <p>
                        Ngân hàng:{" "}
                        <span className="font-medium">Vietcombank</span>
                      </p>
                      <p>
                        Số tài khoản:{" "}
                        <span className="font-medium">1234567890</span>
                      </p>
                      <p>
                        Chủ tài khoản:{" "}
                        <span className="font-medium">CÔNG TY PET CARE</span>
                      </p>
                      <p>
                        Nội dung:{" "}
                        <span className="font-medium">
                          PC-{appointment._id.slice(-6)}
                        </span>
                      </p>
                    </div>
                  )}

                  {selectedPaymentMethod === "cash" && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm">
                      <p>Vui lòng thanh toán tại cửa hàng vào ngày hẹn.</p>
                      <p>Bạn sẽ nhận được xác nhận đặt lịch qua email.</p>
                    </div>
                  )}
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsPaymentDialogOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={handlePaymentMethodSelect}
                    disabled={
                      paymentMutation.isPending || checkoutMutation.isPending
                    }
                  >
                    {(paymentMutation.isPending ||
                      checkoutMutation.isPending) && (
                      <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    Xác nhận
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Admin Payment Options */}
        {isAdmin && (
          <div className="flex flex-col w-full gap-2">
            {/* Mark as paid button */}
            {payment && payment.status === "pending" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="secondary" className="w-full">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Đánh dấu đã thanh toán
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận thanh toán</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn có chắc chắn muốn đánh dấu khoản thanh toán này là đã
                      hoàn tất? Hành động này sẽ cập nhật trạng thái thanh toán
                      thành "Đã thanh toán".
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => markAsPaidMutation.mutate(payment._id)}
                    >
                      {markAsPaidMutation.isPending && (
                        <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                      )}
                      Xác nhận
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {/* Refund button */}
            {payment && payment.status === "completed" && (
              <Dialog
                open={isRefundDialogOpen}
                onOpenChange={setIsRefundDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Hoàn tiền
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Xử lý hoàn tiền</DialogTitle>
                    <DialogDescription>
                      Vui lòng nhập số tiền và lý do hoàn tiền.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="refund-amount">Số tiền hoàn (VNĐ)</Label>
                      <Input
                        id="refund-amount"
                        type="number"
                        value={refundAmount}
                        onChange={(e) => setRefundAmount(e.target.value)}
                        max={payment.amount}
                        placeholder="Nhập số tiền"
                      />
                      <p className="text-xs text-gray-500">
                        Tối đa: {payment.amount.toLocaleString()} VNĐ
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="refund-reason">Lý do hoàn tiền</Label>
                      <Textarea
                        id="refund-reason"
                        value={refundReason}
                        onChange={(e) => setRefundReason(e.target.value)}
                        placeholder="Nhập lý do hoàn tiền"
                        rows={3}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsRefundDialogOpen(false)}
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={handleRefund}
                      disabled={!refundAmount || refundMutation.isPending}
                    >
                      {refundMutation.isPending && (
                        <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                      )}
                      Xác nhận hoàn tiền
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {/* Generate new payment button */}
            {(!payment || payment.status === "refunded") && (
              <Dialog
                open={isPaymentDialogOpen}
                onOpenChange={setIsPaymentDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Receipt className="h-4 w-4 mr-2" />
                    Tạo thanh toán mới
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tạo thanh toán mới</DialogTitle>
                    <DialogDescription>
                      Chọn phương thức thanh toán cho khách hàng{" "}
                      {appointment.customerId.fullName}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="py-4">
                    <div className="font-medium mb-2">Dịch vụ:</div>
                    <div className="font-bold mb-4">
                      {appointment.serviceId.name}
                    </div>

                    <div className="font-medium mb-2">Số tiền:</div>
                    <div className="text-xl font-bold mb-4">
                      {appointment.totalAmount?.toLocaleString() || 0} VNĐ
                    </div>

                    <Select
                      value={selectedPaymentMethod}
                      onValueChange={setSelectedPaymentMethod}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn phương thức thanh toán" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* <SelectItem value="card">
                          <div className="flex items-center">
                            <CreditCard className="h-4 w-4 mr-2" />
                            Thẻ tín dụng/ghi nợ
                          </div>
                        </SelectItem> */}
                        <SelectItem value="bank_transfer">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2" />
                            Chuyển khoản ngân hàng
                          </div>
                        </SelectItem>
                        <SelectItem value="cash">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2" />
                            Tiền mặt
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsPaymentDialogOpen(false)}
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={handlePaymentMethodSelect}
                      disabled={paymentMutation.isPending}
                    >
                      {paymentMutation.isPending && (
                        <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                      )}
                      Xác nhận
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default PaymentManagement;
