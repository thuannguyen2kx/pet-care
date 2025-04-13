import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
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
import { Form } from "@/components/ui/form";
import {
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  ArrowLeft,
  Check,
  AlertTriangle,
  User,
} from "lucide-react";
import { useUserPets } from "@/features/pet/hooks/queries/get-pets";
import { useGetAvailableTimeSlots } from "../hooks/queries/get-available-time-slot";
import { useCreateAppointment } from "../hooks/mutations/create-appointment";
import { useGetService } from "@/features/service/hooks/queries/get-service";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ServiceType } from "@/features/service/types/api.types";
import { PetType } from "@/features/pet/types/api.types";
import { Badge } from "@/components/ui/badge";
import { useGetAvailableEmployeesForService } from "@/features/employee/hooks/queries/get-available-employee-for-service";

// Steps
const STEPS = {
  PET: 0,
  DATE: 1,
  TIME: 2,
  EMPLOYEE: 3,
  NOTES: 4,
  REVIEW: 5,
};

// Form schema
const formSchema = z.object({
  petId: z.string().min(1, { message: "Vui lòng chọn thú cưng" }),
  scheduledDate: z.date({
    required_error: "Vui lòng chọn ngày hẹn",
  }),
  timeSlot: z.object(
    {
      start: z.string().min(1, { message: "Vui lòng chọn khung giờ" }),
      end: z.string().min(1, { message: "Vui lòng chọn khung giờ" }),
      originalSlotIndexes: z.array(z.number()).optional(),
    },
    {
      required_error: "Vui lòng chọn khung giờ",
    }
  ),
  employeeId: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EmployeeAvailability {
  employeeId: string;
  isAvailable: boolean;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  employeeAvailability?: EmployeeAvailability[];
  originalSlotIndexes?: number[];
}

export const AppointmentFormStep = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(STEPS.PET);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isPetCompatible, setIsPetCompatible] = useState(true);
  const [incompatibilityReason, setIncompatibilityReason] = useState("");
  const [selectedTimeSlotData, setSelectedTimeSlotData] =
    useState<TimeSlot | null>(null);

  // Get service data from location state
  const { serviceId, serviceType = "single" } = location.state || {};

  // Redirect if no service is selected
  useEffect(() => {
    if (!serviceId) {
      navigate("/services", { replace: true });
    }
  }, [serviceId, navigate]);

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      petId: "",
      employeeId: "",
      notes: "",
    },
  });

  // Fetch queries
  const { data: petsData, isLoading: isPetsLoading } = useUserPets();
  const { data: serviceData, isLoading: isServiceLoading } =
    useGetService(serviceId);
  const isLoading = isPetsLoading || isServiceLoading;
  const pets = petsData?.pets || [];
  const service = serviceData?.service;

  // Get available time slots
  const { data: timeSlotsData, isLoading: isTimeSlotsLoading } =
    useGetAvailableTimeSlots(selectedDate, serviceId, serviceType);

  // Get employees
  const { data: employeesData, isLoading: isEmployeesLoading } =
    useGetAvailableEmployeesForService({
      serviceId,
      serviceType,
      date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined,
      timeSlot: selectedTimeSlotData
        ? [selectedTimeSlotData.startTime, selectedTimeSlotData.endTime].join(
            "-"
          )
        : undefined,
    });

  // Create appointment mutation
  const createAppointmentMutation = useCreateAppointment();

  // Check if selected pet is compatible with the service
  const checkPetServiceCompatibility = (
    petId: string,
    service: ServiceType | undefined
  ) => {
    if (!petId || !service) {
      setIsPetCompatible(true);
      return true;
    }

    const selectedPet = petsData?.pets.find(
      (pet: PetType) => pet._id === petId
    );

    if (!selectedPet) {
      setIsPetCompatible(true);
      return true;
    }

    // Check species compatibility
    if (
      service.applicablePetTypes &&
      !service.applicablePetTypes.includes(selectedPet.species)
    ) {
      setIsPetCompatible(false);
      setIncompatibilityReason(
        `Dịch vụ này chỉ phù hợp với ${service.applicablePetTypes.join(", ")}`
      );
      return false;
    }

    // Check size compatibility if applicable
    if (service.applicablePetSizes && selectedPet.weight) {
      // Determine pet size based on weight
      let petSize = "";
      if (selectedPet.weight < 5) petSize = "small";
      else if (selectedPet.weight < 15) petSize = "medium";
      else petSize = "large";

      if (!service.applicablePetSizes.includes(petSize)) {
        setIsPetCompatible(false);
        setIncompatibilityReason(
          `Dịch vụ này chỉ phù hợp với thú cưng có kích thước ${service.applicablePetSizes.join(
            ", "
          )}`
        );
        return false;
      }
    }

    setIsPetCompatible(true);
    return true;
  };

  // Check pet compatibility when pet changes
  useEffect(() => {
    const petId = form.watch("petId");
    if (petId) {
      checkPetServiceCompatibility(petId, serviceData?.service);
    }
  }, [form.watch("petId"), serviceData]);

  // Reset time slot when date changes
  useEffect(() => {
    if (form.getValues("timeSlot")?.start) {
      form.setValue(
        "timeSlot",
        { start: "", end: "", originalSlotIndexes: [] },
        { shouldValidate: true }
      );
      setSelectedTimeSlotData(null);
    }
  }, [selectedDate, form]);

  // Reset employee when time slot changes
  useEffect(() => {
    if (form.getValues("employeeId")) {
      form.setValue("employeeId", "", { shouldValidate: false });
    }
  }, [form.watch("timeSlot"), form]);

  // Update scheduledDate when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      form.setValue("scheduledDate", selectedDate, { shouldValidate: true });
    }
  }, [selectedDate, form]);

  // Form submission
  const onSubmit = (data: FormValues) => {
    createAppointmentMutation.mutate(
      {
        petId: data.petId,
        serviceType,
        serviceId,
        scheduledDate: format(data.scheduledDate, "yyyy-MM-dd"),
        scheduledTimeSlot: data.timeSlot,
        employeeId: data.employeeId,
        notes: data.notes,
      },
      {
        onSuccess: () => {
          navigate("/appointments");
        },
      }
    );
  };

  // Handle back button
  const handleBack = () => {
    if (currentStep === STEPS.PET) {
      navigate(-1);
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Handle continue button
  const handleContinue = async () => {
    let canContinue = false;

    if (currentStep === STEPS.PET) {
      const petValid = await form.trigger("petId");
      if (petValid && isPetCompatible) canContinue = true;
    } else if (currentStep === STEPS.DATE) {
      const dateValid = await form.trigger("scheduledDate");
      if (dateValid) canContinue = true;
    } else if (currentStep === STEPS.TIME) {
      const timeValid = await form.trigger("timeSlot");
      if (timeValid) canContinue = true;
    } else if (currentStep === STEPS.EMPLOYEE) {
      // Employee selection is optional
      canContinue = true;
    } else if (currentStep === STEPS.NOTES) {
      // Notes are optional, can always continue
      canContinue = true;
    }

    if (canContinue) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Handle submit
  const handleSubmit = form.handleSubmit(onSubmit);

  // Get available time slots
  const timeSlots = timeSlotsData?.timeSlot?.slots || [];
  const availableTimeSlots = timeSlots.filter(
    (slot: TimeSlot) => slot.isAvailable
  );

  // Get available employees for selected time slot
  const getAvailableEmployeesForTimeSlot = () => {
    if (!selectedTimeSlotData || !employeesData) return [];
console.log("selected time slot data", selectedTimeSlotData);
    // If we have employee availability data in the time slot
    if (selectedTimeSlotData.employeeAvailability) {
      const availableEmployeeIds = selectedTimeSlotData.employeeAvailability
        .filter((ea) => ea.isAvailable)
        .map((ea) => ea.employeeId);
 console.log("available employee ids", availableEmployeeIds);
 console.log("employee data", employeesData)
      return (employeesData.employees || []).filter((emp) =>
        availableEmployeeIds.includes(emp._id)
      );
    }

    // Otherwise, use all employees returned from the API
    return employeesData.employees || [];
  };

  // Format duration display
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} phút`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} giờ ${mins} phút` : `${hours} giờ`;
  };

  // Render step indicators
  const renderStepIndicator = () => {
    return (
      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-2">
          {Object.values(STEPS)
            .filter((step) => typeof step === "number")
            .map((step) => (
              <React.Fragment key={step}>
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center border-2",
                    currentStep === step
                      ? "border-primary bg-primary text-primary-foreground"
                      : currentStep > step
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground text-muted-foreground"
                  )}
                >
                  {currentStep > step ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span>{step + 1}</span>
                  )}
                </div>
                {step < Object.keys(STEPS).length / 2 - 1 && (
                  <div
                    className={cn(
                      "h-1 w-10",
                      currentStep > step
                        ? "bg-primary"
                        : "bg-muted-foreground/30"
                    )}
                  />
                )}
              </React.Fragment>
            ))}
        </div>
      </div>
    );
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case STEPS.PET:
        return (
          <div className="space-y-6 mb-6">
            {isLoading ? (
              <div className="flex justify-center p-4">Đang tải...</div>
            ) : (
              <>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Dịch vụ đã chọn</h3>
                  <div className="rounded-md border p-4">
                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Tên dịch vụ
                        </p>
                        <p className="font-medium">{service?.name}</p>
                      </div>
                      {service?.description && (
                        <div>
                          <p className="text-sm text-muted-foreground">Mô tả</p>
                          <p>{service.description}</p>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Giá</p>
                          <p className="font-medium">
                            {service?.price.toLocaleString()} VND
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Thời gian
                          </p>
                          <p className="font-medium">
                            {service?.duration
                              ? formatDuration(service.duration)
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                      {service?.applicablePetTypes &&
                        service.applicablePetTypes.length > 0 && (
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Loại thú cưng phù hợp
                            </p>
                            <p>{service.applicablePetTypes.join(", ")}</p>
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="petId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-medium mb-2">
                        Chọn thú cưng
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          checkPetServiceCompatibility(value, service);
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn thú cưng" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {pets.length > 0 ? (
                            pets.map((pet: PetType) => (
                              <SelectItem key={pet._id} value={pet._id}>
                                {pet.name} ({pet.species}
                                {pet.breed ? ` - ${pet.breed}` : ""})
                                {pet.weight ? ` - ${pet.weight}kg` : ""}
                                {pet.gender ? ` - ${pet.gender}` : ""}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>
                              Chưa có thú cưng nào. Vui lòng thêm thú cưng
                              trước.
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

                {!isPetCompatible && form.watch("petId") && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Thú cưng không phù hợp</AlertTitle>
                    <AlertDescription>{incompatibilityReason}</AlertDescription>
                  </Alert>
                )}
              </>
            )}
          </div>
        );

      case STEPS.DATE:
        return (
          <FormField
            control={form.control}
            name="scheduledDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-lg font-medium mb-2">
                  Chọn ngày hẹn
                </FormLabel>
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
                          format(field.value, "EEEE, dd/MM/yyyy", {
                            locale: vi,
                          })
                        ) : (
                          <span>Chọn ngày</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        field.onChange(date);
                      }}
                      disabled={
                        (date) =>
                          date < addDays(new Date(), 1) || // No same-day appointments
                          date > addDays(new Date(), 30) // Max 30 days in advance
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Chọn ngày cho cuộc hẹn. Bạn chỉ có thể đặt lịch từ ngày mai và
                  trong vòng 30 ngày tới.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case STEPS.TIME:
        return (
          <FormField
            control={form.control}
            name="timeSlot"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium mb-2">
                  Chọn khung giờ
                </FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    {/* Morning slots */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Buổi sáng</h4>
                      <RadioGroup
                        onValueChange={(value) => {
                          const [start, end, ...rest] = value.split("-");
                          const originalSlotIndexes =
                            rest.length > 0
                              ? rest[0].split(",").map(Number)
                              : [];

                          field.onChange({
                            start,
                            end,
                            originalSlotIndexes,
                          });

                          // Find and set the selected time slot data
                          const selectedSlot = availableTimeSlots.find(
                            (slot: TimeSlot) =>
                              slot.startTime === start && slot.endTime === end
                          );

                          setSelectedTimeSlotData(selectedSlot || null);
                        }}
                        className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4"
                        value={
                          field.value.start && field.value.end
                            ? `${field.value.start}-${
                                field.value.end
                              }-${field.value.originalSlotIndexes?.join(",")}`
                            : undefined
                        }
                      >
                        {isTimeSlotsLoading ? (
                          <div className="col-span-full text-center py-2">
                            Đang tải khung giờ...
                          </div>
                        ) : availableTimeSlots.filter((slot) => {
                            const hour = parseInt(slot.startTime.split(":")[0]);
                            return hour < 12;
                          }).length > 0 ? (
                          availableTimeSlots
                            .filter((slot) => {
                              const hour = parseInt(
                                slot.startTime.split(":")[0]
                              );
                              return hour < 12;
                            })
                            .map((slot: TimeSlot, index: number) => (
                              <div
                                key={`morning-${index}`}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem
                                  value={`${slot.startTime}-${slot.endTime}-${
                                    slot.originalSlotIndexes?.join(",") || ""
                                  }`}
                                  id={`time-morning-${index}`}
                                />
                                <label
                                  htmlFor={`time-morning-${index}`}
                                  className="cursor-pointer flex flex-1 items-center justify-center rounded-md border py-2 px-4 text-center"
                                >
                                  {slot.startTime} - {slot.endTime}
                                </label>
                              </div>
                            ))
                        ) : (
                          <div className="col-span-full text-center py-2 text-muted-foreground">
                            Không có khung giờ sáng cho ngày này
                          </div>
                        )}
                      </RadioGroup>
                    </div>

                    {/* Afternoon slots */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Buổi chiều</h4>
                      <RadioGroup
                        onValueChange={(value) => {
                          const [start, end, ...rest] = value.split("-");
                          const originalSlotIndexes =
                            rest.length > 0
                              ? rest[0].split(",").map(Number)
                              : [];

                          field.onChange({
                            start,
                            end,
                            originalSlotIndexes,
                          });

                          // Find and set the selected time slot data
                          const selectedSlot = availableTimeSlots.find(
                            (slot: TimeSlot) =>
                              slot.startTime === start && slot.endTime === end
                          );

                          setSelectedTimeSlotData(selectedSlot || null);
                        }}
                        className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4"
                        value={
                          field.value.start && field.value.end
                            ? `${field.value.start}-${
                                field.value.end
                              }-${field.value.originalSlotIndexes?.join(",")}`
                            : undefined
                        }
                      >
                        {isTimeSlotsLoading ? (
                          <div className="col-span-full text-center py-2">
                            Đang tải khung giờ...
                          </div>
                        ) : availableTimeSlots.filter((slot) => {
                            const hour = parseInt(slot.startTime.split(":")[0]);
                            return hour >= 12;
                          }).length > 0 ? (
                          availableTimeSlots
                            .filter((slot) => {
                              const hour = parseInt(
                                slot.startTime.split(":")[0]
                              );
                              return hour >= 12;
                            })
                            .map((slot: TimeSlot, index: number) => (
                              <div
                                key={`afternoon-${index}`}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem
                                  value={`${slot.startTime}-${slot.endTime}-${
                                    slot.originalSlotIndexes?.join(",") || ""
                                  }`}
                                  id={`time-afternoon-${index}`}
                                />
                                <label
                                  htmlFor={`time-afternoon-${index}`}
                                  className="cursor-pointer flex flex-1 items-center justify-center rounded-md border py-2 px-4 text-center"
                                >
                                  {slot.startTime} - {slot.endTime}
                                </label>
                              </div>
                            ))
                        ) : (
                          <div className="col-span-full text-center py-2 text-muted-foreground">
                            Không có khung giờ chiều cho ngày này
                          </div>
                        )}
                      </RadioGroup>
                    </div>

                    {availableTimeSlots.length === 0 && !isTimeSlotsLoading && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Không có khung giờ trống</AlertTitle>
                        <AlertDescription>
                          Không có khung giờ trống cho ngày này. Vui lòng chọn
                          ngày khác.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  Chọn khung giờ phù hợp với bạn cho ngày đã chọn.
                  {service?.duration && service.duration > 30
                    ? ` Mỗi khung giờ hiển thị đã được điều chỉnh để phù hợp với thời gian dịch vụ (${formatDuration(
                        service.duration
                      )}).`
                    : ""}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case STEPS.EMPLOYEE: {
        const availableEmployees = getAvailableEmployeesForTimeSlot();

        return (
          <FormField
            control={form.control}
            name="employeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium mb-2">
                  Chọn nhân viên (không bắt buộc)
                </FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    {isEmployeesLoading ? (
                      <div className="text-center py-4">
                        Đang tải danh sách nhân viên...
                      </div>
                    ) : availableEmployees.length > 0 ? (
                      <>
                        <RadioGroup
                          onValueChange={field.onChange}
                          className="space-y-4"
                          value={field.value}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {availableEmployees.map((employee) => (
                              <div
                                key={employee._id}
                                className={cn(
                                  "relative flex items-center space-x-3 rounded-lg border p-4",
                                  field.value === employee._id
                                    ? "border-primary"
                                    : "border-border"
                                )}
                              >
                                <RadioGroupItem
                                  value={employee._id}
                                  id={`employee-${employee._id}`}
                                  className="absolute right-4 top-4"
                                />
                                <Avatar className="h-10 w-10">
                                  {employee.profilePicture ? (
                                    <AvatarImage
                                      src={employee.profilePicture.url || ""}
                                      alt={employee.fullName}
                                    />
                                  ) : (
                                    <AvatarFallback>
                                      {employee.fullName
                                        .substring(0, 2)
                                        .toUpperCase()}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                                <div className="flex-1">
                                  <label
                                    htmlFor={`employee-${employee._id}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                  >
                                    {employee.fullName}
                                  </label>
                                  {employee.employeeInfo?.specialties && (
                                    <div className="mt-1 flex flex-wrap gap-1">
                                      {employee.employeeInfo.specialties.map(
                                        (specialty, idx) => (
                                          <Badge
                                            key={idx}
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            {specialty}
                                          </Badge>
                                        )
                                      )}
                                    </div>
                                  )}
                                  <div className="mt-1 text-xs text-muted-foreground">
                                    {employee.employeeInfo?.specialties && (
                                      <span>
                                        {employee.employeeInfo.specialties.join(
                                          ", "
                                        )}
                                      </span>
                                    )}
                                    {employee.employeeInfo?.performance
                                      .rating && (
                                      <span>
                                        Đánh giá:{" "}
                                        {
                                          employee.employeeInfo.performance
                                            .rating
                                        }
                                        /5
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                        <div className="pt-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={() => field.onChange("")}
                          >
                            Để hệ thống tự chọn nhân viên phù hợp
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-4 border rounded-md bg-muted/20">
                        <User className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                        <p>
                          Không có nhân viên nào khả dụng cho khung giờ này.
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Hệ thống sẽ tự động chọn nhân viên phù hợp khi có sẵn.
                        </p>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  Bạn có thể chọn nhân viên cụ thể hoặc để hệ thống tự phân bổ
                  nhân viên phù hợp.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      }

      case STEPS.NOTES:
        return (
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium mb-2">
                  Ghi chú (không bắt buộc)
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Nhập ghi chú cho cuộc hẹn..."
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Thêm thông tin chi tiết hoặc yêu cầu đặc biệt cho cuộc hẹn của
                  bạn.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case STEPS.REVIEW: {
        const selectedPet = petsData?.pets.find(
          (pet: PetType) => pet._id === form.watch("petId")
        );
        const selectedEmployee = form.watch("employeeId")
          ? employeesData?.employees.find(
              (emp) => emp._id === form.watch("employeeId")
            )
          : null;

        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Xác nhận thông tin đặt lịch</h3>
            <div className="space-y-4 rounded-md border p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Thú cưng</p>
                  <p className="font-medium">
                    {selectedPet
                      ? `${selectedPet.name} (${selectedPet.species}`
                      : ""}
                    {selectedPet?.breed ? ` - ${selectedPet.breed}` : ""})
                    {selectedPet?.weight ? ` - ${selectedPet.weight}kg` : ""}
                    {selectedPet?.gender ? ` - ${selectedPet.gender}` : ""}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dịch vụ</p>
                  <p className="font-medium">{service?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ngày hẹn</p>
                  <p className="font-medium">
                    {selectedDate &&
                      format(selectedDate, "EEEE, dd/MM/yyyy", { locale: vi })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Khung giờ</p>
                  <p className="font-medium">
                    {form.watch("timeSlot").start} -{" "}
                    {form.watch("timeSlot").end}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Giá</p>
                  <p className="font-medium">
                    {service?.price.toLocaleString()} VND
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Thời gian</p>
                  <p className="font-medium">
                    {service?.duration
                      ? formatDuration(service.duration)
                      : "N/A"}
                  </p>
                </div>
              </div>

              {selectedEmployee && (
                <div className="mt-2 pt-2 border-t">
                  <p className="text-sm text-muted-foreground">
                    Nhân viên đã chọn
                  </p>
                  <div className="flex items-center mt-1">
                    <Avatar className="h-6 w-6 mr-2">
                      {selectedEmployee.profilePicture ? (
                        <AvatarImage
                          src={selectedEmployee.profilePicture.url || ""}
                          alt={selectedEmployee.fullName}
                        />
                      ) : (
                        <AvatarFallback>
                          {selectedEmployee.fullName
                            .substring(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span>{selectedEmployee.fullName}</span>
                  </div>
                </div>
              )}

              {!selectedEmployee && (
                <div className="mt-2 pt-2 border-t">
                  <p className="text-sm text-muted-foreground">Nhân viên</p>
                  <p>Hệ thống sẽ tự động phân bổ nhân viên phù hợp</p>
                </div>
              )}

              {form.watch("notes") && (
                <div className="mt-2 pt-2 border-t">
                  <p className="text-sm text-muted-foreground">Ghi chú</p>
                  <p className="whitespace-pre-wrap">{form.watch("notes")}</p>
                </div>
              )}
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  // Render step title
  const getStepTitle = () => {
    switch (currentStep) {
      case STEPS.PET:
        return "Chọn thú cưng";
      case STEPS.DATE:
        return "Chọn ngày hẹn";
      case STEPS.TIME:
        return "Chọn khung giờ";
      case STEPS.EMPLOYEE:
        return "Chọn nhân viên";
      case STEPS.NOTES:
        return "Thêm ghi chú";
      case STEPS.REVIEW:
        return "Xác nhận thông tin";
      default:
        return "Đặt lịch hẹn";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {currentStep === STEPS.PET ? "Quay lại" : "Trước đó"}
        </Button>
        <div className="text-sm font-medium">{getStepTitle()}</div>
      </div>

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Đặt lịch hẹn mới</CardTitle>
          <CardDescription>
            {currentStep === STEPS.PET
              ? `Chọn thú cưng của bạn cho dịch vụ ${
                  serviceData?.service?.name || ""
                }`
              : `Đặt lịch hẹn cho ${
                  petsData?.pets.find(
                    (pet: PetType) => pet._id === form.watch("petId")
                  )?.name || ""
                } - ${serviceData?.service?.name || ""}`}
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {renderStepIndicator()}
              {renderStepContent()}
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={handleBack}>
                {currentStep === STEPS.PET ? "Hủy" : "Trước đó"}
              </Button>

              {currentStep < STEPS.REVIEW ? (
                <Button
                  type="button"
                  onClick={handleContinue}
                  disabled={
                    (currentStep === STEPS.PET &&
                      (!form.watch("petId") || !isPetCompatible)) ||
                    (currentStep === STEPS.DATE && !selectedDate) ||
                    (currentStep === STEPS.TIME &&
                      (!form.watch("timeSlot")?.start ||
                        !form.watch("timeSlot")?.end))
                  }
                >
                  Tiếp theo
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={createAppointmentMutation.isPending}
                >
                  {createAppointmentMutation.isPending
                    ? "Đang đặt lịch..."
                    : "Xác nhận đặt lịch"}
                </Button>
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};
