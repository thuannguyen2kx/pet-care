import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCheckPaymentStatus } from "@/features/payment/hooks/api"; 
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react";

const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  
  const sessionId = searchParams.get("session_id");
  const checkPaymentStatus = useCheckPaymentStatus();
  
  useEffect(() => {
    if (sessionId) {
      verifyPayment(sessionId);
    } else {
      setVerificationStatus('error');
    }
  }, [sessionId]);
  
  const verifyPayment = async (sid: string) => {
    try {
      await checkPaymentStatus.mutateAsync(sid);
      setVerificationStatus('success');
    } catch (error) {
      console.error("Payment verification failed:", error);
      setVerificationStatus('error');
    }
  };
  
  const navigateToAppointments = () => {
    navigate("/appointments");
  };
  
  const navigateToHome = () => {
    navigate("/");
  };
  
  return (
    <div className="container max-w-md mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {verificationStatus === 'loading' && "Đang xác nhận thanh toán..."}
            {verificationStatus === 'success' && "Thanh toán thành công!"}
            {verificationStatus === 'error' && "Xác nhận thanh toán thất bại"}
          </CardTitle>
          <CardDescription className="text-center">
            {verificationStatus === 'loading' && "Vui lòng đợi trong khi chúng tôi xác nhận thanh toán của bạn."}
            {verificationStatus === 'success' && "Cảm ơn bạn đã hoàn thành thanh toán. Lịch hẹn của bạn đã được xác nhận."}
            {verificationStatus === 'error' && "Chúng tôi không thể xác nhận thanh toán của bạn. Vui lòng liên hệ với bộ phận hỗ trợ."}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex justify-center items-center py-8">
          {verificationStatus === 'loading' && (
            <div className="flex flex-col items-center">
              <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Đang xác thực thanh toán...</p>
            </div>
          )}
          
          {verificationStatus === 'success' && (
            <div className="flex flex-col items-center">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <p className="text-center text-muted-foreground">
                Thanh toán đã được xác nhận và lịch hẹn của bạn đã được cập nhật. Bạn sẽ sớm nhận được email xác nhận.
              </p>
            </div>
          )}
          
          {verificationStatus === 'error' && (
            <div className="flex flex-col items-center">
              <svg 
                className="h-16 w-16 text-red-500 mb-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
              <p className="text-center text-muted-foreground">
                Đã xảy ra lỗi khi xác minh thanh toán của bạn. Vui lòng liên hệ với chúng tôi hoặc kiểm tra lại sau.
              </p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            onClick={navigateToAppointments}
            disabled={verificationStatus === 'loading'}
            className="w-full"
          >
            Xem lịch hẹn của tôi
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            onClick={navigateToHome}
            disabled={verificationStatus === 'loading'}
            className="w-full"
          >
            Về trang chủ
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentSuccessPage;