import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useGetService } from "@/features/service/hooks/queries/get-service";
import { formSchema, FormValues, STEPS } from "../../utils/appointment-form-config";
import { TimeSlotType } from "../../types/api.types";
import { useCreateAppointment } from "../../hooks/mutations/create-appointment";
import { useProcessPayment, useCreateCheckoutSession } from "@/features/payment/hooks/api";
import { DateSelectionStep, EmployeeSelectionStep, NotesStep, PaymentStep, PetSelectionStep, ReviewStep, StepIndicator, TimeSelectionStep } from "./form-steps";
import { useUserPets } from "@/features/pet/hooks/queries/get-pets";
import { ServiceAppointmentType } from "@/constants";

export const AppointmentFormStep: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(STEPS.PET);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isPetCompatible, setIsPetCompatible] = useState(true);
  const [incompatibilityReason, setIncompatibilityReason] = useState("");
  const [selectedTimeSlotData, setSelectedTimeSlotData] = useState<TimeSlotType | null>(null);
  const [createdAppointmentId, setCreatedAppointmentId] = useState<string | null>(null);

  // Get service data from location state
  const { serviceId, serviceType = ServiceAppointmentType.SINGLE } = location.state || {};

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
      paymentMethod: "card",
    },
  });

  // Fetch queries
  const { data: petsData, isLoading: isPetsLoading } = useUserPets();
  const { data: serviceData, isLoading: isServiceLoading } = useGetService(serviceId);
  const isLoading = isPetsLoading || isServiceLoading;
  
  // Mutations
  const createAppointmentMutation = useCreateAppointment();
  const processPaymentMutation = useProcessPayment();
  const createCheckoutSessionMutation = useCreateCheckoutSession();

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
  const onSubmit = async (data: FormValues) => {
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
        }
      );
    } else {
      // If appointment already created, just process payment
      processPayment(createdAppointmentId, data);
    }
  };

  const processPayment = (appointmentId: string, data: FormValues) => {
    const paymentMethod = data.paymentMethod;
    
    if (paymentMethod === "card") {
      // For card payments, redirect to Stripe checkout
      createCheckoutSessionMutation.mutate(appointmentId);
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
        }
      );
    }
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
    } else if (currentStep === STEPS.PAYMENT) {
      const paymentMethodValid = await form.trigger("paymentMethod");
      if (paymentMethodValid) canContinue = true;
    }

    if (canContinue) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Handle submit
  const handleSubmit = form.handleSubmit(onSubmit);

  // Render step content
  const renderStepContent = () => {
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
      case STEPS.DATE:
        return (
          <DateSelectionStep
            form={form}
            setSelectedDate={setSelectedDate}
          />
        );
      case STEPS.TIME:
        return (
          <TimeSelectionStep
            form={form}
            selectedDate={selectedDate}
            serviceId={serviceId}
            serviceType={serviceType}
            service={serviceData?.service}
            setSelectedTimeSlotData={setSelectedTimeSlotData}
          />
        );
      case STEPS.EMPLOYEE:
        return (
          <EmployeeSelectionStep
            form={form}
            serviceId={serviceId}
            serviceType={serviceType}
            selectedDate={selectedDate}
            selectedTimeSlotData={selectedTimeSlotData}
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
      case STEPS.PAYMENT:
        return "Thanh toán";
      case STEPS.REVIEW:
        return "Xác nhận thông tin";
      default:
        return "Đặt lịch hẹn";
    }
  };

  // Check for continue button disabled state
  const isContinueButtonDisabled = () => {
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
  };

  const isSubmitting = 
    createAppointmentMutation.isPending || 
    processPaymentMutation.isPending ||
    createCheckoutSessionMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={handleBack} disabled={isSubmitting}>
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
              ? `Chọn thú cưng của bạn cho dịch vụ ${serviceData?.service?.name || ""}`
              : `Đặt lịch hẹn cho ${
                  petsData?.pets.find((pet) => pet._id === form.watch("petId"))?.name || ""
                } - ${serviceData?.service?.name || ""}`}
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <StepIndicator currentStep={currentStep} steps={STEPS} />
              {renderStepContent()}
            </CardContent>

            <CardFooter className="flex justify-between mt-4">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={handleBack}
                disabled={isSubmitting}
              >
                {currentStep === STEPS.PET ? "Hủy" : "Trước đó"}
              </Button>

              {currentStep < STEPS.REVIEW ? (
                <Button
                  type="button"
                  onClick={handleContinue}
                  disabled={isContinueButtonDisabled() || isSubmitting}
                >
                  Tiếp theo
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Đang xử lý..."
                    : "Xác nhận và thanh toán"}
                </Button>
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AppointmentFormStep;