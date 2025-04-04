import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
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
import {
  Calendar,
  ChevronLeft,
  Edit,
  FileEdit,
  Trash,
  Upload,
  Key,
  Calendar as CalendarIcon,
  Award
} from "lucide-react";
import { toast } from "sonner";
import { useGetEmployee } from "../hooks/queries/get-employee";
import { useEmployeePerformance } from "../hooks/queries/get-employee-performance";
import { useEmployeeSchedule } from "../hooks/queries/get-employee-schedule";
import { useDeleteEmployee } from "../hooks/mutations/delete-employee";
import { useResetPassword } from "../hooks/mutations/reset-password";
import { useUploadProfilePicture } from "../hooks/mutations/upload-profile-picture";
import { StatusUser, StatusUserType } from "@/constants";

export default function EmployeeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const { data } = useGetEmployee(id as string);
  const { data: performanceData } = useEmployeePerformance(id as string);
  const { data: scheduleData } = useEmployeeSchedule(id as string);
  
  const deleteEmployee = useDeleteEmployee();
  const resetPassword = useResetPassword(id as string);
  const uploadProfilePicture = useUploadProfilePicture(id as string);
  
  const employee = data?.employee;
  
  if (!employee) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold">Employee not found</h2>
        <Button 
          variant="link" 
          onClick={() => navigate("/employees")}
          className="mt-4"
        >
          Back to Employees
        </Button>
      </div>
    );
  }
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadProfilePicture.mutate(file);
    }
  };
  
  // Handle password reset
  const handleResetPassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    resetPassword.mutate(newPassword, {
      onSuccess: () => {
        setResetPasswordDialogOpen(false);
        setNewPassword("");
        setConfirmPassword("");
      },
    });
  };
  
  // Get status badge color
  const getStatusBadge = (status: StatusUserType) => {
    switch (status) {
      case StatusUser.ACTIVE:
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case StatusUser.INACTIVE:
        return <Badge variant="secondary">Inactive</Badge>;
      case StatusUser.BLOCKED:
        return <Badge variant="destructive">Blocked</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/employees")}
            className="mr-4"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Employee Details</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline"
            onClick={() => navigate(`/employees/${id}/edit`)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" /> Edit
          </Button>
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive"
                className="flex items-center gap-2"
              >
                <Trash className="h-4 w-4" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will deactivate the employee account. They will no longer be able to 
                  log in or be assigned to new appointments.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-destructive text-destructive-foreground"
                  onClick={() => {
                    deleteEmployee.mutate(id as string, {
                      onSuccess: () => navigate("/employees"),
                    });
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Employee Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-4">
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="relative mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage 
                    src={employee.profilePicture?.url || ""} 
                    alt={employee.fullName} 
                  />
                  <AvatarFallback className="text-2xl">
                    {employee.fullName.split(" ").map(name => name[0]).join("").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <label htmlFor="profile-upload" className="absolute bottom-0 right-0">
                  <div className="bg-primary text-primary-foreground p-1 rounded-full cursor-pointer">
                    <Upload className="h-4 w-4" />
                  </div>
                  <input 
                    id="profile-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              <h3 className="text-xl font-bold">{employee.fullName}</h3>
              <p className="text-muted-foreground">{employee.email}</p>
              <div className="mt-2">{getStatusBadge(employee.status)}</div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-4 text-left">
              <div>
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p className="font-medium">{employee.phoneNumber || "Not provided"}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Specialties</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {employee.employeeInfo?.specialties.map((specialty, idx) => (
                    <Badge key={idx} variant="outline" className="capitalize">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Work Schedule</p>
                <div className="mt-1">
                  <p className="font-medium">
                    {employee.employeeInfo?.schedule.workDays
                      .map(day => day.charAt(0).toUpperCase() + day.slice(1))
                      .join(", ")}
                  </p>
                  <p>
                    {employee.employeeInfo?.schedule.workHours.start} - {employee.employeeInfo?.schedule.workHours.end}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Account Created</p>
                <p className="font-medium">
                  {format(new Date(employee.createdAt), "MMMM d, yyyy")}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Last Login</p>
                <p className="font-medium">
                  {employee.lastLogin 
                    ? format(new Date(employee.lastLogin), "MMMM d, yyyy") 
                    : "Never"}
                </p>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <Dialog 
              open={resetPasswordDialogOpen} 
              onOpenChange={setResetPasswordDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <Key className="h-4 w-4" /> Reset Password
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reset Password</DialogTitle>
                  <DialogDescription>
                    Set a new password for this employee. They will need to use
                    this password for their next login.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="new-password" className="text-sm font-medium">
                      New Password
                    </label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="confirm-password" className="text-sm font-medium">
                      Confirm Password
                    </label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setResetPasswordDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleResetPassword}>
                    Reset Password
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
        
        {/* Employee Details Tabs */}
        <Card className="md:col-span-2">
          <Tabs defaultValue="schedule">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Employee Information</CardTitle>
                <TabsList>
                  <TabsTrigger value="schedule" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Schedule
                  </TabsTrigger>
                  <TabsTrigger value="performance" className="flex items-center gap-2">
                    <Award className="h-4 w-4" /> Performance
                  </TabsTrigger>
                </TabsList>
              </div>
              <CardDescription>
                View and manage this employee's schedule and performance.
              </CardDescription>
            </CardHeader>
            
            <TabsContent value="schedule" className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Work Schedule</h3>
                {scheduleData ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Average Rating</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                          <div className="text-3xl font-bold">
                            {employee.employeeInfo?.performance.rating?.toFixed(1) || "N/A"}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            out of 5.0
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Monthly Performance</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                          <div className="text-3xl font-bold">
                            {performanceData.monthlyPerformance && 
                             performanceData.monthlyPerformance.length > 0 
                              ? performanceData.monthlyPerformance[
                                  performanceData.monthlyPerformance.length - 1
                                ].count
                              : 0}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            services this month
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {performanceData.serviceBreakdown && (
                      <div>
                        <h4 className="font-medium mb-2">Service Breakdown</h4>
                        <Card>
                          <CardContent className="p-4">
                            <div className="space-y-4">
                              {Object.entries(performanceData.serviceBreakdown).map(([serviceId, count], idx) => (
                                <div key={serviceId} className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline">{idx + 1}</Badge>
                                    <span>{serviceId}</span>
                                  </div>
                                  <div>
                                    <Badge variant="secondary">{count} completed</Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                    
                    {performanceData.monthlyPerformance && performanceData.monthlyPerformance.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Monthly Performance</h4>
                        <Card>
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              {performanceData.monthlyPerformance.map((item) => (
                                <div 
                                  key={`${item.year}-${item.month}`} 
                                  className="flex justify-between items-center"
                                >
                                  <span>
                                    {format(new Date(item.year, item.month - 1), "MMMM yyyy")}
                                  </span>
                                  <Badge>{item.count} services</Badge>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading performance metrics...
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}