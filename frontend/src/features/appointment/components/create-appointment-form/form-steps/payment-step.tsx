import React from "react";
import { UseFormReturn } from "react-hook-form";
import {  CreditCard, Building, Banknote } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormField, FormItem , FormControl, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { FormValues } from "@/features/appointment/utils/appointment-form-config";

interface PaymentStepProps {
  form: UseFormReturn<FormValues>;
  servicePrice: number;
  serviceName: string;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  form,
  servicePrice,
  serviceName,
}) => {
  const paymentMethod = form.watch("paymentMethod");
  
  return (
    <div className="space-y-4">
      <Card className="border-none shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg">Phương thức thanh toán</CardTitle>
          <CardDescription>
            Vui lòng chọn phương thức thanh toán cho dịch vụ {serviceName}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-muted/50 rounded-md">
              <div>
                <h3 className="font-medium">Tổng thanh toán</h3>
                <p className="text-sm text-muted-foreground">Dịch vụ: {serviceName}</p>
              </div>
              <div className="text-xl font-semibold">
                {servicePrice?.toLocaleString()} VND
              </div>
            </div>

            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-2 border p-4 rounded-md">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex-1 cursor-pointer">
                          <div className="font-semibold flex items-center">
                            <CreditCard className="h-4 w-4 mr-2 text-blue-600" />
                            <span>Thanh toán thẻ</span>
                          </div>
                          <div className="text-sm text-muted-foreground">Thanh toán ngay bằng thẻ tín dụng/ghi nợ</div>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 border p-4 rounded-md">
                        <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                        <Label htmlFor="bank_transfer" className="flex-1 cursor-pointer">
                          <div className="font-semibold flex items-center">
                            <Building className="h-4 w-4 mr-2 text-purple-600" />
                            <span>Chuyển khoản ngân hàng</span>
                          </div>
                          <div className="text-sm text-muted-foreground">Chuyển khoản đến tài khoản của chúng tôi</div>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 border p-4 rounded-md">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash" className="flex-1 cursor-pointer">
                          <div className="font-semibold flex items-center">
                            <Banknote className="h-4 w-4 mr-2 text-green-600" />
                            <span>Thanh toán tại cửa hàng</span>
                          </div>
                          <div className="text-sm text-muted-foreground">Thanh toán khi đến cửa hàng</div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {paymentMethod === "card" && (
              <Alert className="border-blue-200 bg-blue-50">
                <AlertDescription className="text-blue-800">
                  <div className="space-y-2">
                    <p className="font-medium">Thanh toán bằng thẻ:</p>
                    <p>Bạn sẽ được chuyển hướng đến trang thanh toán an toàn của Stripe để hoàn thành thanh toán.</p>
                    <p>Hỗ trợ tất cả thẻ quốc tế phổ biến: Visa, MasterCard, JCB, American Express</p>
                    <p className="text-xs italic mt-2">Việc thanh toán sẽ được xử lý trong môi trường bảo mật của Stripe.</p>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {paymentMethod === "bank_transfer" && (
              <Alert className="border-blue-200 bg-blue-50">
                <AlertDescription className="text-blue-800">
                  <div className="space-y-2">
                    <p className="font-medium">Thông tin chuyển khoản:</p>
                    <p>Ngân hàng: <span className="font-medium">Vietcombank</span></p>
                    <p>Số tài khoản: <span className="font-medium">1234567890</span></p>
                    <p>Chủ tài khoản: <span className="font-medium">CÔNG TY TNHH PET CARE</span></p>
                    <p>Nội dung: <span className="font-medium">Thanh toan dich vu {serviceName}</span></p>
                    <p className="italic text-sm">Vui lòng chuyển khoản trước khi đến cửa hàng và mang theo bằng chứng chuyển khoản.</p>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {paymentMethod === "cash" && (
              <Alert  className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">
                  <p>Bạn sẽ thanh toán <span className="font-medium">{servicePrice?.toLocaleString()} VND</span> bằng tiền mặt khi đến cửa hàng.</p>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default PaymentStep;