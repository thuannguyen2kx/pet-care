"use client"

import type React from "react"
import type { UseFormReturn } from "react-hook-form"
import { CreditCard, Building, Banknote, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import type { FormValues } from "@/features/appointment/utils/appointment-form-config"
import { motion } from "framer-motion"

interface PaymentStepProps {
  form: UseFormReturn<FormValues>
  servicePrice: number
  serviceName: string
}

export const PaymentStep: React.FC<PaymentStepProps> = ({ form, servicePrice, serviceName }) => {
  const paymentMethod = form.watch("paymentMethod")

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg">Phương thức thanh toán</CardTitle>
          <CardDescription>Vui lòng chọn phương thức thanh toán cho dịch vụ {serviceName}</CardDescription>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          <div className="space-y-6">
            <motion.div
              className="flex justify-between items-center p-5 bg-primary/10 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <h3 className="font-medium">Tổng thanh toán</h3>
                <p className="text-sm text-muted-foreground">Dịch vụ: {serviceName}</p>
              </div>
              <div className="text-xl font-semibold">{servicePrice?.toLocaleString()} VND</div>
            </motion.div>

            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-4">
                      <motion.div
                        className="flex items-center space-x-2 border p-4 rounded-md hover:border-primary/50 hover:bg-muted/30 transition-colors cursor-pointer"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        onClick={() => form.setValue("paymentMethod", "card")}
                      >
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex-1 cursor-pointer">
                          <div className="font-semibold flex items-center">
                            <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                            <span>Thanh toán thẻ</span>
                          </div>
                          <div className="text-sm text-muted-foreground">Thanh toán ngay bằng thẻ tín dụng/ghi nợ</div>
                        </Label>
                      </motion.div>

                      <motion.div
                        className="flex items-center space-x-2 border p-4 rounded-md hover:border-primary/50 hover:bg-muted/30 transition-colors cursor-pointer"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        onClick={() => form.setValue("paymentMethod", "bank_transfer")}
                      >
                        <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                        <Label htmlFor="bank_transfer" className="flex-1 cursor-pointer">
                          <div className="font-semibold flex items-center">
                            <Building className="h-5 w-5 mr-2 text-purple-600" />
                            <span>Chuyển khoản ngân hàng</span>
                          </div>
                          <div className="text-sm text-muted-foreground">Chuyển khoản đến tài khoản của chúng tôi</div>
                        </Label>
                      </motion.div>

                      <motion.div
                        className="flex items-center space-x-2 border p-4 rounded-md hover:border-primary/50 hover:bg-muted/30 transition-colors cursor-pointer"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        onClick={() => form.setValue("paymentMethod", "cash")}
                      >
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash" className="flex-1 cursor-pointer">
                          <div className="font-semibold flex items-center">
                            <Banknote className="h-5 w-5 mr-2 text-green-600" />
                            <span>Thanh toán tại cửa hàng</span>
                          </div>
                          <div className="text-sm text-muted-foreground">Thanh toán khi đến cửa hàng</div>
                        </Label>
                      </motion.div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {paymentMethod === "card" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert className="border-blue-200 bg-blue-50">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800 font-medium">Thanh toán bằng thẻ</AlertTitle>
                  <AlertDescription className="text-blue-800">
                    <div className="space-y-2">
                      <p>Bạn sẽ được chuyển hướng đến trang thanh toán an toàn của Stripe để hoàn thành thanh toán.</p>
                      <p>Hỗ trợ tất cả thẻ quốc tế phổ biến: Visa, MasterCard, JCB, American Express</p>
                      <p className="text-xs italic mt-2">
                        Việc thanh toán sẽ được xử lý trong môi trường bảo mật của Stripe.
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            {paymentMethod === "bank_transfer" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert className="border-purple-200 bg-purple-50">
                  <Info className="h-4 w-4 text-purple-600" />
                  <AlertTitle className="text-purple-800 font-medium">Thông tin chuyển khoản</AlertTitle>
                  <AlertDescription className="text-purple-800">
                    <div className="space-y-2">
                      <div className="bg-white/50 p-3 rounded-md border border-purple-200 mt-2">
                        <p>
                          Ngân hàng: <span className="font-medium">Vietcombank</span>
                        </p>
                        <p>
                          Số tài khoản: <span className="font-medium">1234567890</span>
                        </p>
                        <p>
                          Chủ tài khoản: <span className="font-medium">CÔNG TY TNHH PET CARE</span>
                        </p>
                        <p>
                          Nội dung: <span className="font-medium">Thanh toan dich vu {serviceName}</span>
                        </p>
                      </div>
                      <p className="italic text-sm">
                        Vui lòng chuyển khoản trước khi đến cửa hàng và mang theo bằng chứng chuyển khoản.
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            {paymentMethod === "cash" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert className="border-green-200 bg-green-50">
                  <Info className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800 font-medium">Thanh toán tại cửa hàng</AlertTitle>
                  <AlertDescription className="text-green-800">
                    <p>
                      Bạn sẽ thanh toán <span className="font-medium">{servicePrice?.toLocaleString()} VND</span> bằng
                      tiền mặt khi đến cửa hàng.
                    </p>
                    <p className="mt-2 text-sm">Vui lòng đến đúng giờ hẹn để không ảnh hưởng đến lịch trình của bạn.</p>
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PaymentStep
