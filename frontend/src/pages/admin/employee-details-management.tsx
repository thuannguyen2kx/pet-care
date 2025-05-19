import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ChevronLeft, CalendarDays, Activity, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Import our components
import EmployeeScheduleManager from '@/features/employee/components/employee-schedule-management';
import EmployeePerformanceDashboard from '@/features/employee/components/employee-dashboard';
import API from '@/lib/axios-client';

// Types
interface EmployeeInfo {
  specialties?: string[];
  schedule?: {
    workDays: string[];
    workHours: {
      start: string;
      end: string;
    };
    vacation?: { 
      start: Date; 
      end: Date 
    }[];
  };
  performance?: {
    rating: number;
    completedServices: number;
  };
}

interface Employee {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  gender: string;
  role: string;
  profilePicture: {
    url: string | null;
    publicId: string | null;
  };
  status: string;
  employeeInfo: EmployeeInfo | null;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

// Hook to fetch employee data
const useEmployeeDetails = (employeeId: string) => {
  return useQuery({
    queryKey: ['employee', employeeId],
    queryFn: async () => {
      const { data } = await API.get(`/employees/${employeeId}`);
      return data as Employee;
    },
    enabled: !!employeeId,
  });
};

// Format date to a readable string
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};
const EmployeeDetailsManagementPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('performance');
  
  // Fetch employee details
  const { data: employee, isLoading, error } = useEmployeeDetails(id || '');

  // Handle back button click
  const handleBackClick = () => {
    navigate('/employees');
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center">
          <Button variant="outline" size="sm" className="mr-4" disabled>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="p-6">
        <Button variant="outline" size="sm" className="mb-6" onClick={handleBackClick}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load employee details. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Back button and page title */}
      <div className="flex items-center mb-4">
        <Button variant="outline" size="sm" className="mr-4" onClick={handleBackClick}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Employee Details</h1>
      </div>

      {/* Employee overview card */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile image */}
            <div className="flex-shrink-0">
              {employee.profilePicture?.url ? (
                <img
                  src={employee.profilePicture.url}
                  alt={employee.fullName}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-400">
                    {employee?.fullName?.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Basic info */}
            <div className="flex-grow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">{employee.fullName}</h2>
                  <p className="text-gray-500">{employee.email}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className="capitalize bg-blue-100 text-blue-800 hover:bg-blue-200">
                    {employee.role}
                  </Badge>
                  <Badge 
                    className={`capitalize ${
                      employee.status === 'active' 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {employee.status}
                  </Badge>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                  <p className="mt-1">{employee.phoneNumber || 'No phone number'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Joined Date</h3>
                  <p className="mt-1">{formatDate(employee.createdAt)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Specialties</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {employee.employeeInfo?.specialties?.length ? (
                      employee.employeeInfo.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline" className="bg-gray-100">
                          {specialty}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-500">No specialties</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs navigation */}
      <Tabs defaultValue="performance" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span>Performance</span>
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span>Schedule</span>
          </TabsTrigger>
        </TabsList>

        {/* Performance dashboard tab */}
        <TabsContent value="performance">
          <EmployeePerformanceDashboard />
        </TabsContent>

        {/* Schedule management tab */}
        <TabsContent value="schedule">
          <EmployeeScheduleManager />
        </TabsContent> 
      </Tabs>
    </div>
  );
};

export default EmployeeDetailsManagementPage;