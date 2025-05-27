"use client";

import type React from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Form } from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useGetService } from "@/features/service/hooks/queries/get-service";
import {
  formSchema,
  type FormValues,
  STEPS, // Cần cập nhật enum STEPS để thay đổi thứ tự các bước
} from "@/features/appointment/utils/appointment-form-config";
import { useCreateAppointment } from "@/features/appointment/hooks/mutations/create-appointment";
import {
  useProcessPayment,
  useCreateCheckoutSession,
} from "@/features/payment/hooks/api";
import {
  DateSelectionStep,
  EmployeeSelectionStep,
  NotesStep,
  PaymentStep,
  PetSelectionStep,
  ReviewStep,
  StepIndicator,
  TimeSelectionStep,
} from "../form-steps";
import { useUserPets } from "@/features/pet/hooks/queries/get-pets";
import { ServiceAppointmentType } from "@/constants";
import { useAuthContext } from "@/context/auth-provider";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export const AppointmentFormStep: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();
  const userId = user?._id || "";

  const [currentStep, setCurrentStep] = useState(STEPS.PET);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isPetCompatible, setIsPetCompatible] = useState(true);
  const [incompatibilityReason, setIncompatibilityReason] = useState("");
  const [createdAppointmentId, setCreatedAppointmentId] = useState<
    string | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track if date needs to be reset due to employee change
  const [shouldResetDate, setShouldResetDate] = useState(false);
  const [previousEmployeeId, setPreviousEmployeeId] = useState<string>("");

  // Get service data from location state
  const { serviceId, serviceType = ServiceAppointmentType.SINGLE } =
    location.state || {};

  // Redirect if no service is selected
  useEffect(() => {
    if (!serviceId) {
      toast.error("Không tìm thấy dịch vụ", {
        description: "Vui lòng chọn dịch vụ phù hợp",
      });
      navigate("/services", { replace: true });
    }
  }, [serviceId, navigate]);

  // Form setup
const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    petId: "",
    employeeId: "", // FIX: Mặc định là empty string
    notes: "",
    paymentMethod: "card",
    timeSlot: {
      start: "",
      end: "",
      originalSlotIndexes: []
    }
  },
  mode: "onChange", // FIX: Thêm mode để validate real-time
});
useEffect(() => {
  const subscription = form.watch((value, { name }) => {
    if (name === "employeeId") {
      console.log("Employee ID changed:", value.employeeId);
    }
  });
  return () => subscription.unsubscribe();
}, [form]);

  // Fetch queries
  const { data: petsData, isLoading: isPetsLoading } = useUserPets(userId);
  const { data: serviceData, isLoading: isServiceLoading } =
    useGetService(serviceId);
  const isLoading = isPetsLoading || isServiceLoading;

  // Mutations
  const createAppointmentMutation = useCreateAppointment();
  const processPaymentMutation = useProcessPayment();
  const createCheckoutSessionMutation = useCreateCheckoutSession();

  // Watch employee ID to detect changes
  const currentEmployeeId = form.watch("employeeId");

  // Check for employee changes and manage date reset
useEffect(() => {
  if (previousEmployeeId && currentEmployeeId !== previousEmployeeId) {
    console.log(`Employee changed from ${previousEmployeeId} to ${currentEmployeeId}`);
    setShouldResetDate(true);
  }
  
  // Cập nhật previous employee ID, bao gồm cả empty string
  setPreviousEmployeeId(currentEmployeeId || "");
}, [currentEmployeeId, previousEmployeeId]);

  // Reset date and time when employee changes
  useEffect(() => {
    if (shouldResetDate) {
      // Reset date
      setSelectedDate(undefined);

      // Reset time slot
      form.setValue(
        "timeSlot",
        { start: "", end: "", originalSlotIndexes: [] },
        { shouldValidate: false }
      );

      // Reset the flag
      setShouldResetDate(false);
    }
  }, [shouldResetDate, form]);

  // Reset time slot when date changes
  // This needs to be separate to avoid loops
  useEffect(() => {
    if (selectedDate && form.getValues("timeSlot")?.start) {
      form.setValue(
        "timeSlot",
        { start: "", end: "", originalSlotIndexes: [] },
        { shouldValidate: true }
      );
    }
  }, [selectedDate, form]);

  // Update scheduledDate when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      form.setValue("scheduledDate", selectedDate, { shouldValidate: true });
    }
  }, [selectedDate, form]);

  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    const totalSteps = Object.keys(STEPS).length;
    return ((currentStep + 1) / totalSteps) * 100;
  }, [currentStep]);

  // Form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      // First create the appointment
      if (!createdAppointmentId) {
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
            onSuccess: (response) => {
              const newAppointmentId = response.appointment._id;
              setCreatedAppointmentId(newAppointmentId);

              // Process payment based on selected method
              processPayment(newAppointmentId, data);
            },
            onError: (error) => {
              toast.error(
                error.message || "Đã xảy ra lỗi, vui lòng thử lại sau"
              );
              setIsSubmitting(false);
            },
          }
        );
      } else {
        // If appointment already created, just process payment
        processPayment(createdAppointmentId, data);
      }
    } catch {
      toast.error("Đã xảy ra lỗi không mong muốn, vui lòng thử lại sau");
      setIsSubmitting(false);
    }
  };

  const processPayment = useCallback(
    (appointmentId: string, data: FormValues) => {
      const paymentMethod = data.paymentMethod;

      if (paymentMethod === "card") {
        // For card payments, redirect to Stripe checkout
        createCheckoutSessionMutation.mutate(appointmentId, {
          onError: () => {
            setIsSubmitting(false);
          },
        });
      } else {
        // For cash or bank transfer, use the regular payment endpoint
        processPaymentMutation.mutate(
          {
            appointmentId,
            paymentMethod,
          },
          {
            onSuccess: () => {
              navigate("/appointments", {
                state: { paymentSuccess: true, appointmentId },
              });
            },
            onError: () => {
              setIsSubmitting(false);
            },
          }
        );
      }
    },
    [createCheckoutSessionMutation, navigate, processPaymentMutation]
  );

  // Handle back button
  const handleBack = useCallback(() => {
    if (currentStep === STEPS.PET) {
      navigate(-1);
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep, navigate]);

  // Handle continue button
  const handleContinue = useCallback(async () => {
    let canContinue = false;

    if (currentStep === STEPS.PET) {
      const petValid = await form.trigger("petId");
      if (petValid && isPetCompatible) canContinue = true;
    } else if (currentStep === STEPS.EMPLOYEE) {
      // Employee selection is optional
      canContinue = true;
    } else if (currentStep === STEPS.DATE) {
      const dateValid = await form.trigger("scheduledDate");
      if (dateValid) canContinue = true;
    } else if (currentStep === STEPS.TIME) {
      const timeValid = await form.trigger("timeSlot");
      if (timeValid) canContinue = true;
    } else if (currentStep === STEPS.NOTES) {
      // Notes are optional, can always continue
      canContinue = true;
    } else if (currentStep === STEPS.PAYMENT) {
      const paymentMethodValid = await form.trigger("paymentMethod");
      if (paymentMethodValid) canContinue = true;
    }

    if (canContinue) {
      setCurrentStep((prev) => prev + 1);
      // Scroll to top when changing steps
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep, form, isPetCompatible]);

  // Handle submit
  const handleSubmit = form.handleSubmit(onSubmit);

  // Render step content
  const renderStepContent = useCallback(() => {
    switch (currentStep) {
      case STEPS.PET:
        return (
          <PetSelectionStep
            form={form}
            service={serviceData?.service}
            pets={petsData?.pets || []}
            isLoading={isLoading}
            isPetCompatible={isPetCompatible}
            incompatibilityReason={incompatibilityReason}
            setIsPetCompatible={setIsPetCompatible}
            setIncompatibilityReason={setIncompatibilityReason}
          />
        );
      case STEPS.EMPLOYEE:
        return (
          <EmployeeSelectionStep
            form={form}
            serviceId={serviceId}
            serviceType={serviceType}
            selectedDate={undefined} // Chưa chọn ngày ở bước này
            selectedTimeSlotData={null} // Chưa chọn time slot ở bước này
          />
        );
      case STEPS.DATE:
        return (
          <DateSelectionStep form={form} setSelectedDate={setSelectedDate} />
        );
      case STEPS.TIME:
        return (
          <TimeSelectionStep
            form={form}
            selectedDate={selectedDate}
            serviceId={serviceId}
            serviceType={serviceType}
            service={serviceData?.service}
          />
        );
      case STEPS.NOTES:
        return <NotesStep form={form} />;
      case STEPS.PAYMENT:
        return (
          <PaymentStep
            form={form}
            servicePrice={serviceData?.service?.price || 0}
            serviceName={serviceData?.service?.name || ""}
          />
        );
      case STEPS.REVIEW:
        return (
          <ReviewStep
            serviceType={serviceType}
            form={form}
            petsData={petsData}
            service={serviceData?.service}
            selectedDate={selectedDate}
            paymentMethod={form.watch("paymentMethod")}
          />
        );
      default:
        return null;
    }
  }, [
    currentStep,
    form,
    incompatibilityReason,
    isLoading,
    isPetCompatible,
    petsData,
    selectedDate,
    serviceData?.service,
    serviceId,
    serviceType,
  ]);

  // Render step title
  const getStepTitle = useCallback(() => {
    switch (currentStep) {
      case STEPS.PET:
        return "Chọn thú cưng";
      case STEPS.EMPLOYEE:
        return "Chọn nhân viên";
      case STEPS.DATE:
        return "Chọn ngày hẹn";
      case STEPS.TIME:
        return "Chọn khung giờ";
      case STEPS.NOTES:
        return "Thêm ghi chú";
      case STEPS.PAYMENT:
        return "Thanh toán";
      case STEPS.REVIEW:
        return "Xác nhận thông tin";
      default:
        return "Đặt lịch hẹn";
    }
  }, [currentStep]);

  // Check for continue button disabled state
  const isContinueButtonDisabled = useCallback(() => {
    if (currentStep === STEPS.PET) {
      return !form.watch("petId") || !isPetCompatible;
    } else if (currentStep === STEPS.DATE) {
      return !selectedDate;
    } else if (currentStep === STEPS.TIME) {
      return !form.watch("timeSlot")?.start || !form.watch("timeSlot")?.end;
    } else if (currentStep === STEPS.PAYMENT) {
      return !form.watch("paymentMethod");
    }
    return false;
  }, [currentStep, form, isPetCompatible, selectedDate]);

  const isProcessing =
    createAppointmentMutation.isPending ||
    processPaymentMutation.isPending ||
    createCheckoutSessionMutation.isPending ||
    isSubmitting;

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="mb-8">
        <Progress value={progressPercentage} className="h-2 mb-2" />
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={isProcessing}
            className="gap-2 hover:bg-muted/80"
          >
            <ArrowLeft className="h-4 w-4" />
            {currentStep === STEPS.PET ? "Quay lại" : "Trước đó"}
          </Button>
          <div className="text-sm font-medium bg-primary/10 px-3 py-1 rounded-full">
            Bước {currentStep + 1}/{Object.keys(STEPS).length}: {getStepTitle()}
          </div>
        </div>
      </div>

      <Card className="w-full mx-auto shadow border-muted/60 overflow-hidden">
        <CardHeader className="bg-muted/30 border-b border-slate-200">
          <CardTitle className="text-xl flex items-center gap-2">
            <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-primary text-primary-foreground text-sm">
              {currentStep + 1}
            </span>
            Đặt lịch hẹn mới
          </CardTitle>
          <CardDescription>
            {currentStep === STEPS.PET
              ? `Chọn thú cưng của bạn cho dịch vụ ${
                  serviceData?.service?.name || ""
                }`
              : `Đặt lịch hẹn cho ${
                  petsData?.pets.find((pet) => pet._id === form.watch("petId"))
                    ?.name || ""
                } - ${serviceData?.service?.name || ""}`}
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <CardContent className="p-6 space-y-6">
              <StepIndicator currentStep={currentStep} steps={STEPS} />
              {renderStepContent()}
            </CardContent>

            <CardFooter className="flex justify-between p-6 bg-muted/20 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isProcessing}
                className="min-w-[100px]"
              >
                {currentStep === STEPS.PET ? "Hủy" : "Trước đó"}
              </Button>

              <Button
                type={currentStep < STEPS.REVIEW ? "button" : "submit"}
                onClick={
                  currentStep < STEPS.REVIEW ? handleContinue : undefined
                }
                disabled={isProcessing || isContinueButtonDisabled()}
                className="min-w-[180px]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : currentStep < STEPS.REVIEW ? (
                  "Tiếp theo"
                ) : (
                  "Xác nhận và thanh toán"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AppointmentFormStep;