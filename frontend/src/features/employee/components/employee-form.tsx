import {  useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { useGetEmployee } from "../hooks/queries/get-employee";
import { useCreateEmployee } from "../hooks/mutations/create-employee";
import { useUpdateEmployee } from "../hooks/mutations/update-employee";
import { CreateEmployeeDTO, UpdateEmployeeDTO } from "../types/api.types";
import { Specialty, StatusUser } from "@/constants";

// Form schema for creating employee
const createEmployeeSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters long",
  }),
  phoneNumber: z.string().optional(),
  specialties: z.array(z.string()).min(1, {
    message: "Please select at least one specialty",
  }),
  workDays: z.array(z.string()).min(1, {
    message: "Please select at least one work day",
  }),
  workHoursStart: z.string().optional(),
  workHoursEnd: z.string().optional(),
});

// Form schema for updating employee
const updateEmployeeSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters long",
  }),
  phoneNumber: z.string().optional(),
  specialties: z.array(z.string()).min(1, {
    message: "Please select at least one specialty",
  }),
  workDays: z.array(z.string()).min(1, {
    message: "Please select at least one work day",
  }),
  workHoursStart: z.string().optional(),
  workHoursEnd: z.string().optional(),
  status: z.string().optional(),
});

// Weekday options
const weekdays = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
];

// Work hours options
const workHours = Array.from({ length: 24 }).map((_, i) => {
  const hour = i.toString().padStart(2, "0");
  return { value: `${hour}:00`, label: `${hour}:00` };
});

export default function EmployeeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
    
  // Create or update mutations
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee(id as string);
  
  // Create appropriate form depending on create/edit mode
  const form = useForm<z.infer<typeof createEmployeeSchema>>({

    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      phoneNumber: "",
      specialties: [],
      workDays: [],
      workHoursStart: "09:00",
      workHoursEnd: "17:00",
    },
  });
  
  
  
  // Form submission handler
  const onSubmit = (values: CreateEmployeeDTO) => {
    if (isEditing) {
      updateEmployee.mutate(values as UpdateEmployeeDTO, {
        onSuccess: () => {
          navigate(`/employees/${id}`);
        },
      });
    } else {
      createEmployee.mutate(values as CreateEmployeeDTO, {
        onSuccess: (data) => {
          navigate(`/employees/${data.employee._id}`);
        },
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/employees")}
          className="mr-4"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">
          {isEditing ? "Edit Employee" : "Add New Employee"}
        </h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Employee Details" : "Employee Information"}</CardTitle>
          <CardDescription>
            {isEditing 
              ? "Update the employee's information and settings." 
              : "Enter the details for the new employee."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Basic Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">Basic Information</h3>
                    <p className="text-sm text-muted-foreground">
                      Personal and contact details for the employee.
                    </p>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="john.doe@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {!isEditing && (
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Minimum 6 characters
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* {isEditing && (
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={StatusUser.ACTIVE}>Active</SelectItem>
                              <SelectItem value={StatusUser.INACTIVE}>Inactive</SelectItem>
                              <SelectItem value={StatusUser.BLOCKED}>Blocked</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )} */}
                </div>
                
                {/* Employee Specialties and Schedule */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">Work Details</h3>
                    <p className="text-sm text-muted-foreground">
                      Set employee specialties and working schedule.
                    </p>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="specialties"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Specialties</FormLabel>
                          <FormDescription>
                            Select the services this employee can perform.
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.values(Specialty).map((specialty) => (
                            <FormField
                              key={specialty}
                              control={form.control}
                              name="specialties"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={specialty}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(specialty)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, specialty])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== specialty
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal capitalize">
                                      {specialty}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Separator className="my-4" />
                  
                  <FormField
                    control={form.control}
                    name="workDays"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Work Days</FormLabel>
                          <FormDescription>
                            Select the days this employee works.
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {weekdays.map((day) => (
                            <FormField
                              key={day.id}
                              control={form.control}
                              name="workDays"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={day.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(day.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, day.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== day.id
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {day.label}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="workHoursStart"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Work Hours Start</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Start time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {workHours.map((hour) => (
                                <SelectItem key={hour.value} value={hour.value}>
                                  {hour.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="workHoursEnd"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Work Hours End</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="End time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {workHours.map((hour) => (
                                <SelectItem key={hour.value} value={hour.value}>
                                  {hour.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              
              <CardFooter className="flex justify-end space-x-4 px-0">
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => navigate("/employees")}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createEmployee.isPending || updateEmployee.isPending}
                >
                  {(createEmployee.isPending || updateEmployee.isPending) 
                    ? "Saving..." 
                    : isEditing 
                      ? "Update Employee" 
                      : "Create Employee"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}