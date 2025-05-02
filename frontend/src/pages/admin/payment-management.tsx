import { PaymentList } from "@/features/payment/components/payment-list";
import PaymentDashboardWidget from "@/features/payment/components/payment-widget";

const AdminPaymentManagement = () => {
  // State

  return (
    <>
      <PaymentDashboardWidget />
      <PaymentList />
    </>
  );
};

export default AdminPaymentManagement;
