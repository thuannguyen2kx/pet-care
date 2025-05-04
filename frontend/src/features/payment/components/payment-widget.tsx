import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  CreditCard,
} from "lucide-react";
import { useGetPaymentsSummary } from "../hooks/queries/get-payment-summary";
import { PaymentWidgetSkeleton } from "./payment-widget-skeleton";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const PaymentDashboardWidget = () => {
  const { data: dashboardData, isLoading, isError } = useGetPaymentsSummary();
  if (isLoading) {
    return <PaymentWidgetSkeleton />;
  }

  if (isError) {
    return (
      <Card className="col-span-1 md:col-span-2 border-0 shadow-sm">
        <CardContent className="pt-6 text-center">
          <p className="text-destructive">Không thể tải dữ liệu thanh toán</p>
        </CardContent>
      </Card>
    );
  }
  if (!dashboardData) {
    return null;
  }

  const monthlyChange =
    dashboardData.monthlyRevenue - dashboardData.previousMonthRevenue;
  const changePercentage = (
    (monthlyChange / (dashboardData.previousMonthRevenue || 1)) *
    100
  ).toFixed(1);
  const isPositiveChange = monthlyChange >= 0;

  // Định dạng tiền tệ VND
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="col-span-1 md:col-span-2 border-0 shadow-sm mb-6">
      <CardHeader>
        <CardTitle>Tổng quan thanh toán</CardTitle>
        <CardDescription>
          Theo dõi hoạt động thanh toán và xu hướng doanh thu
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="charts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="charts">Biểu đồ</TabsTrigger>
            <TabsTrigger value="summary">Tóm tắt</TabsTrigger>
          </TabsList>

          <TabsContent value="charts" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Biểu đồ doanh thu */}
              <div className="rounded-lg p-4 border-0 bg-gray-50">
                <h3 className="text-lg font-medium mb-2">
                  Doanh thu theo tuần
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dashboardData.weeklyRevenue}
                      margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="day" />
                      <YAxis
                        tickFormatter={(value) => `${value / 1000000}M`}
                        width={50}
                      />
                      <Tooltip
                        formatter={(value) => [
                          formatCurrency(Number(value)),
                          "Doanh thu",
                        ]}
                        cursor={{ fill: "#f3f4f6" }}
                        labelFormatter={(label) => `Ngày: ${label}`}
                      />
                      <Bar
                        dataKey="amount"
                        fill="#8884d8"
                        radius={[4, 4, 0, 0]}
                        name="Doanh thu"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Biểu đồ phương thức thanh toán */}
              <div className="rounded-lg p-4 border-0 bg-gray-50">
                <h3 className="text-lg font-medium mb-2">
                  Phương thức thanh toán
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dashboardData.paymentsByMethod.map((method) => ({
                          ...method,
                          name: translatePaymentMethod(method.name),
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {dashboardData.paymentsByMethod.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Legend
                        formatter={(value) => translatePaymentMethod(value)}
                      />
                      <Tooltip
                        formatter={(value, name) => [
                          value,
                          name === "value" ? "Số lượng" : "Doanh thu",
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="summary">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Doanh thu tháng */}
              <div className="rounded-lg p-4 border-0 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Doanh thu tháng
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {formatCurrency(dashboardData.monthlyRevenue)}
                    </h3>
                    <div className="flex items-center mt-1">
                      {isPositiveChange ? (
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span
                        className={
                          isPositiveChange ? "text-green-500" : "text-red-500"
                        }
                      >
                        {isPositiveChange ? "+" : ""}
                        {changePercentage}%
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">
                        so với tháng trước
                      </span>
                    </div>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </div>

              {/* Thanh toán chờ xử lý */}
              <div className="rounded-lg p-4 border-0 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Chờ thanh toán
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {dashboardData.statusCounts.pending || 0}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Cần xử lý hoặc thu tiền
                    </p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <Wallet className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              {/* Thanh toán hoàn thành */}
              <div className="rounded-lg p-4 border-0 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Đã thanh toán
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {dashboardData.statusCounts.completed || 0}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Hoàn tất xử lý
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <CreditCard className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="text-xs text-muted-foreground border-t border-slate-200 pt-4">
        Dữ liệu được cập nhật hàng giờ. Lần cập nhật gần nhất:{" "}
        {new Date().toLocaleTimeString("vi-VN")}
      </CardFooter>
    </Card>
  );
};

// Hàm hỗ trợ dịch phương thức thanh toán
function translatePaymentMethod(method: string) {
  const methodMap = {
    card: "Thẻ tín dụng",
    cash: "Tiền mặt",
    bank_transfer: "Chuyển khoản",
  };

  return methodMap[method as keyof typeof methodMap] || method;
}

export default PaymentDashboardWidget;
