
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Loader2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useGetPaymentsSummary } from '../hooks/queries/get-payment-summary';


// Colors for the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const PaymentDashboardWidget = () => {
  // Uncomment to use real data
  const { data: dashboardData, isLoading, isError } = useGetPaymentsSummary();
 if(!dashboardData){
  return null
 }
  const monthlyChange = dashboardData.monthlyRevenue - dashboardData.previousMonthRevenue;
  const changePercentage = ((monthlyChange / dashboardData.previousMonthRevenue) * 100).toFixed(1);
  const isPositiveChange = monthlyChange >= 0;

  if (isLoading) {
    return (
      <Card className="col-span-1 md:col-span-2">
        <CardContent className="pt-6 flex items-center justify-center h-80">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="col-span-1 md:col-span-2">
        <CardContent className="pt-6 text-center">
          <p className="text-destructive">Failed to load payment data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Payments Overview</CardTitle>
        <CardDescription>
          Monitor payment activity and revenue trends
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="charts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="charts" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <div className="bg-card rounded-lg p-4 border">
                <h3 className="text-lg font-medium mb-2">Weekly Revenue</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dashboardData.weeklyRevenue}
                      margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="day" />
                      <YAxis 
                        tickFormatter={(value) => `${(value / 1000)}K`}
                        width={40}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value.toLocaleString()} VND`, 'Revenue']}
                        cursor={{ fill: '#f3f4f6' }}
                      />
                      <Bar 
                        dataKey="amount" 
                        fill="#8884d8" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Payment Methods Chart */}
              <div className="bg-card rounded-lg p-4 border">
                <h3 className="text-lg font-medium mb-2">Payment Methods</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dashboardData.paymentsByMethod}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {dashboardData.paymentsByMethod.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="summary">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Monthly Revenue */}
              <div className="bg-card rounded-lg p-4 border">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {(dashboardData.monthlyRevenue / 1000000).toFixed(1)}M VND
                    </h3>
                    <div className="flex items-center mt-1">
                      {isPositiveChange ? (
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={isPositiveChange ? "text-green-500" : "text-red-500"}>
                        {isPositiveChange ? "+" : ""}{changePercentage}%
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">vs last month</span>
                    </div>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </div>

              {/* Pending Payments */}
              {/* <div className="bg-card rounded-lg p-4 border">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Payments</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {dashboardData.pendingPayments}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Requiring collection or processing
                    </p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <Wallet className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div> */}

              {/* Completed Payments */}
              {/* <div className="bg-card rounded-lg p-4 border">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed Payments</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {dashboardData.completedPayments}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Successfully processed
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <CreditCard className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div> */}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground border-t pt-4">
        Data updated hourly. Last updated: {new Date().toLocaleTimeString()}
      </CardFooter>
    </Card>
  );
};

export default PaymentDashboardWidget;
