
import React, { useState } from 'react';
import { format } from 'date-fns';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Banknote, 
  CreditCard, 
  Search, 
  CheckCircle, 
  Filter, 
  Calendar,
  UserCircle,
  RefreshCw
} from 'lucide-react';
import { useMarkPaymentAsPaid } from '@/features/payment/hooks/mutation/mask-payment-as-paid';
import { useGetAdminPayments } from '@/features/payment/hooks/queries/get-admin-payments';
import { PaymentDetailType } from '@/features/payment/types/api.types';
import PaymentDashboardWidget from '@/features/payment/components/payment-widget';



// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    failed: 'bg-red-100 text-red-800 border-red-200',
    refunded: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  return (
    <Badge variant="outline" className={`${variants[status] || ''}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

// Payment method icon component
const PaymentMethodIcon = ({ method }: { method: string }) => {
  switch (method) {
    case 'card':
      return <CreditCard className="h-4 w-4" />;
    case 'cash':
      return <Banknote className="h-4 w-4" />;
    default:
      return <CreditCard className="h-4 w-4" />;
  }
};

const AdminPaymentManagement = () => { 
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [currentTab, setCurrentTab] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentDetailType | null>(null);
  
  const { data, isLoading, refetch } = useGetAdminPayments() 
  const payments = data?.payments 
  // Mark payment as paid mutation
  const markAsPaidMutation = useMarkPaymentAsPaid() 
  
  // Handle mark as paid
  const handleMarkAsPaid = (payment: PaymentDetailType) => {
    setSelectedPayment(payment);
    setDialogOpen(true);
  };
  
  const confirmMarkAsPaid = () => {
    if (selectedPayment) {
      markAsPaidMutation.mutate(selectedPayment._id);
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    return `${amount.toLocaleString()} ${currency}`;
  };
  
  // Filter payments based on current filters and tab
  const filteredPayments = payments?.filter(payment => {
    // Filter by tab
    if (currentTab === 'pending' && payment.status !== 'pending') return false;
    if (currentTab === 'completed' && payment.status !== 'completed') return false;
    
    // Filter by status
    if (statusFilter !== 'all' && payment.status !== statusFilter) return false;
    
    // Filter by method
    if (methodFilter !== 'all' && payment.method !== methodFilter) return false;
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const customerName = payment.customerId.fullName.toLowerCase();
      const serviceName = payment.appointmentId.serviceId.name.toLowerCase();
      const transactionId = payment.transactionId?.toLowerCase() || '';
      
      return (
        customerName.includes(query) ||
        serviceName.includes(query) ||
        transactionId.includes(query)
      );
    }
    
    return true;
  });
  
  // Get counts for the tabs
  const pendingCount = payments?.filter(p => p.status === 'pending').length || 0;
  const completedCount = payments?.filter(p => p.status === 'completed').length || 0;
  
  return (
    <>
    <PaymentDashboardWidget />
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Payment Management</CardTitle>
        <CardDescription>
          View and manage payments for all customers
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all" className="relative">
                All Payments
                <Badge className="ml-2 bg-primary/10 text-primary">{payments?.length || 0}</Badge>
              </TabsTrigger>
              <TabsTrigger value="pending" className="relative">
                Pending
                <Badge className="ml-2 bg-yellow-100 text-yellow-800">{pendingCount}</Badge>
              </TabsTrigger>
              <TabsTrigger value="completed" className="relative">
                Completed
                <Badge className="ml-2 bg-green-100 text-green-800">{completedCount}</Badge>
              </TabsTrigger>
            </TabsList>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
              className="hidden sm:flex"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer, service, or transaction ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="w-[140px]">
                  <div className="flex items-center">
                    <PaymentMethodIcon method={methodFilter !== 'all' ? methodFilter : 'card'} />
                    <span className="ml-2 truncate">
                      {methodFilter === 'all' ? 'All Methods' : methodFilter}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4" />
                    <span className="ml-2 truncate">
                      {statusFilter === 'all' ? 'Status' : statusFilter}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Table Content */}
          <TabsContent value="all" className="m-0">
            {renderPaymentsTable(filteredPayments, isLoading, handleMarkAsPaid)}
          </TabsContent>
          
          <TabsContent value="pending" className="m-0">
            {renderPaymentsTable(filteredPayments, isLoading, handleMarkAsPaid)}
          </TabsContent>
          
          <TabsContent value="completed" className="m-0">
            {renderPaymentsTable(filteredPayments, isLoading, handleMarkAsPaid)}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {/* Mark as Paid Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Payment</DialogTitle>
            <DialogDescription>
              Mark this cash payment as completed. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Customer:</div>
                <div>{selectedPayment.customerId.fullName}</div>
                
                <div className="font-medium">Service:</div>
                <div>{selectedPayment.appointmentId.serviceId.name}</div>
                
                <div className="font-medium">Amount:</div>
                <div>
                  {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                </div>
                
                <div className="font-medium">Date:</div>
                <div>
                  {format(new Date(selectedPayment.appointmentId.scheduledDate), 'MMM dd, yyyy')}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmMarkAsPaid}
              disabled={markAsPaidMutation.isPending}
              className="gap-1"
            >
              {markAsPaidMutation.isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Mark as Paid
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
    </>
  );
};

// Helper function to render payments table
const renderPaymentsTable = (
  payments: PaymentDetailType[] | undefined,
  isLoading: boolean,
  onMarkAsPaid: (payment: PaymentDetailType) => void
) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="w-full h-16" />
        ))}
      </div>
    );
  }
  
  if (!payments || payments.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No payment records found that match your filters.
      </div>
    );
  }
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment._id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">
                    {format(new Date(payment.createdAt), 'MMM dd, yyyy')}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(payment.createdAt), 'HH:mm')}
                  </span>
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
                  <Calendar className="h-3 w-3 mr-1" />
                  {format(new Date(payment.appointmentId.scheduledDate), 'MMM dd')} • {payment.appointmentId.scheduledTimeSlot.start}
                </div>
              </TableCell>
              <TableCell>
                {payment.amount.toLocaleString()} {payment.currency}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <PaymentMethodIcon method={payment.method} />
                  <span className="capitalize">{payment.method}</span>
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={payment.status} />
              </TableCell>
              <TableCell className="text-right">
                {payment.method === 'cash' && payment.status === 'pending' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onMarkAsPaid(payment)}
                    className="h-8"
                  >
                    <CheckCircle className="h-3.5 w-3.5 mr-1" />
                    Mark Paid
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminPaymentManagement;