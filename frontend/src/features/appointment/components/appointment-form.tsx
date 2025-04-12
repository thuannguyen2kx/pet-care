import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, addDays } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import { useUserPets } from "@/features/pet/hooks/queries/get-pets";
import { useGetServices } from "@/features/service/hooks/queries/get-services";
// import { useGetPackages } from "@/features/service-package/hooks/queries/get-packages";
import { useGetAvailableTimeSlots } from "../hooks/queries/get-available-time-slot";
import { useCreateAppointment } from "../hooks/mutations/create-appointment";

// Form schema
const formSchema = z.object({
  petId: z.string().min(1, { message: "Vui lòng chọn thú cưng" }),
  serviceType: z.enum(["single", "package"], { 
    required_error: "Vui lòng chọn loại dịch vụ" 
  }),
  serviceId: z.string().min(1, { message: "Vui lòng chọn dịch vụ" }),
  scheduledDate: z.date({ 
    required_error: "Vui lòng chọn ngày hẹn"
  }),
  timeSlot: z.object({
    start: z.string(),
    end: z.string()
  }, { 
    required_error: "Vui lòng chọn khung giờ" 
  }),
  notes: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

const AppointmentForm: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceType: "single",
      notes: ""
    }
  });
  
  // Get user's pets
  const { data: petsData, isLoading: isPetsLoading } = useUserPets();
  
  // Get services
  const { data: servicesData, isLoading: isServicesLoading } = useGetServices();
  // const { data: packagesData, isLoading: isPackagesLoading } = useGetPackages();
  
  // Get available time slots
  const { 
    data: timeSlotsData, 
    isLoading: isTimeSlotsLoading 
  } = useGetAvailableTimeSlots(
    selectedDate,
    form.watch("serviceId"),
    form.watch("serviceType")
  );
  
  // Create appointment mutation
  const createAppointmentMutation = useCreateAppointment();
  
  
  // Watch for changes that affect time slots
  const serviceType = form.watch("serviceType");
  const serviceId = form.watch("serviceId");
  
  // Reset serviceId when serviceType changes
  useEffect(() => {
    form.setValue("serviceId", "");
  }, [serviceType, form]);
  
  // Reset time slot when date or service changes
  useEffect(() => {
    if (form.getValues("timeSlot")) {
      form.setValue("timeSlot", { start: "", end: "" });
    }
  }, [selectedDate, serviceId, serviceType, form]);
  
  // Update scheduledDate when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      form.setValue("scheduledDate", selectedDate);
    }
  }, [selectedDate, form]);
  
  // Form submission
  const onSubmit = (data: FormValues) => {
    createAppointmentMutation.mutate({
      petId: data.petId,
      serviceType: data.serviceType,
      serviceId: data.serviceId,
      scheduledDate: format(data.scheduledDate, "yyyy-MM-dd"),
      scheduledTimeSlot: data.timeSlot,
      notes: data.notes
    }, {
      onSuccess: () => {
        navigate("/appointments");
      }
    });
  };
  
  // Loading state
  const isLoading = isPetsLoading || isServicesLoading;
  
  if (isLoading) {
    return <div className="flex justify-center p-8">Đang tải...</div>;
  }
  
  // Prepare data for form
  const pets = petsData?.pets || [];
  const services = servicesData?.services || [];
  // const packages = packagesData?.packages || [];
  
  // Get available time slots
  const timeSlots = timeSlotsData?.timeSlot?.slots || [];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Đặt lịch hẹn mới</CardTitle>
          <CardDescription>
            Đặt lịch hẹn cho thú cưng của bạn
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {/* Pet Selection */}
              <FormField
                control={form.control}
                name="petId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thú cưng</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn thú cưng" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {pets.length > 0 ? (
                          pets.map((pet) => (
                            <SelectItem key={pet._id} value={pet._id}>
                              {pet.name} ({pet.species} - {pet.breed})
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>
                            Chưa có thú cưng nào. Vui lòng thêm thú cưng trước.
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {pets.length === 0 && (
                      <FormDescription>
                        <Button 
                          variant="link" 
                          className="p-0 h-auto" 
                          onClick={() => navigate("/pets/new")}
                        >
                          Thêm thú cưng mới
                        </Button>
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Service Type Selection */}
              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại dịch vụ</FormLabel>
                    <Tabs
                      value={field.value}
                      onValueChange={field.onChange}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="single">
                          Dịch vụ đơn lẻ
                        </TabsTrigger>
                        <TabsTrigger value="package">
                          Gói dịch vụ
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Service Selection */}
              <FormField
                control={form.control}
                name="serviceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {serviceType === "single" ? "Dịch vụ" : "Gói dịch vụ"}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={
                            serviceType === "single" 
                              ? "Chọn dịch vụ" 
                              : "Chọn gói dịch vụ"
                          } />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {serviceType === "single" ? (
                          services.length > 0 ? (
                            services.map((service) => (
                              <SelectItem key={service._id} value={service._id}>
                                {service.name} ({service.price.toLocaleString()} VND)
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>
                              Không có dịch vụ nào
                            </SelectItem>
                          )
                        ) : (
                          null
                          // packages.length > 0 ? (
                          //   packages.map((pkg) => (
                          //     <SelectItem key={pkg._id} value={pkg._id}>
                          //       {pkg.name} ({(pkg.discountedPrice || pkg.totalPrice).toLocaleString()} VND)
                          //     </SelectItem>
                          //   ))
                          // ) : (
                          //   <SelectItem value="none" disabled>
                          //     Không có gói dịch vụ nào
                          //   </SelectItem>
                          // )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Date Selection */}
              <FormField
                control={form.control}
                name="scheduledDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ngày hẹn</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "EEEE, dd/MM/yyyy", { locale: vi })
                            ) : (
                              <span>Chọn ngày</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            field.onChange(date);
                          }}
                          disabled={(date) => 
                            date < addDays(new Date(), 1) || // No same-day appointments
                            date > addDays(new Date(), 30)    // Max 30 days in advance
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Chọn ngày cho cuộc hẹn. Bạn chỉ có thể đặt lịch từ ngày mai và trong vòng 30 ngày tới.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Time Slot Selection */}
              {selectedDate && form.watch("serviceId") && (
                <FormField
                  control={form.control}
                  name="timeSlot"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Khung giờ</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            const [start, end] = value.split("-");
                            field.onChange({ start, end });
                          }}
                          className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
                        >
                          {isTimeSlotsLoading ? (
                            <div className="col-span-full text-center py-4">
                              Đang tải khung giờ...
                            </div>
                          ) : timeSlots.length > 0 ? (
                            timeSlots.filter(slot => slot.isAvailable).map((slot, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value={`${slot.startTime}-${slot.endTime}`}
                                  id={`time-${index}`}
                                />
                                <label
                                  htmlFor={`time-${index}`}
                                  className="cursor-pointer flex flex-1 items-center justify-center rounded-md border py-2 px-4 text-center"
                                >
                                  {slot.startTime} - {slot.endTime}
                                </label>
                              </div>
                            ))
                          ) : (
                            <div className="col-span-full text-center py-4 text-red-500">
                              Không có khung giờ trống cho ngày này. Vui lòng chọn ngày khác.
                            </div>
                          )}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú (không bắt buộc)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập ghi chú cho cuộc hẹn..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Thêm thông tin chi tiết hoặc yêu cầu đặc biệt cho cuộc hẹn của bạn.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(-1)}
              >
                Hủy
              </Button>
              <Button 
                type="submit" 
                disabled={createAppointmentMutation.isPending}
              >
                {createAppointmentMutation.isPending ? "Đang đặt lịch..." : "Đặt lịch hẹn"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AppointmentForm;