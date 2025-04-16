import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, CreditCard } from "lucide-react";

const PaymentCancelPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const appointmentId = searchParams.get("appointment_id");
  
  const handleRetryPayment = () => {
    if (appointmentId) {
      navigate(`/appointments/${appointmentId}/payment`);
    } else {
      navigate("/appointments");
    }
  };
  
  const navigateToAppointments = () => {
    navigate("/appointments");
  };
  
  return (
    <div className="container max-w-md mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Thanh toán đã bị hủy</CardTitle>
          <CardDescription className="text-center">
            Thanh toán của bạn chưa được hoàn thành. Không có khoản phí nào được tính.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex justify-center items-center py-8">
          <div className="flex flex-col items-center">
            <AlertCircle className="h-16 w-16 text-amber-500 mb-4" />
            <p className="text-center text-muted-foreground">
              Bạn đã hủy quá trình thanh toán. Lịch hẹn của bạn vẫn được giữ lại, nhưng sẽ chỉ được xác nhận sau khi thanh toán hoàn tất.
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2">
          {appointmentId && (
            <Button 
              onClick={handleRetryPayment}
              className="w-full"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Thử thanh toán lại
            </Button>
          )}
          
          <Button 
            variant="outline" 
            onClick={navigateToAppointments}
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại lịch hẹn
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentCancelPage;