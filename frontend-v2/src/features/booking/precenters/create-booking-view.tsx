import { MapPin, Phone, Sparkles } from 'lucide-react';

import { CreateBookingNavigation } from '@/features/booking/components/create-booking/booking-navigation';
import { CreateBookingProgress } from '@/features/booking/components/create-booking/booking-progress';
import { CreateBookingSummary } from '@/features/booking/components/create-booking/booking-summary';
import { BookingDatetimeStep } from '@/features/booking/components/create-booking/steps/booking-time-slot-step/booking-time-slot-step';
import { ConfirmStep } from '@/features/booking/components/create-booking/steps/confirm-step';
import { SelectedEmployeeStep } from '@/features/booking/components/create-booking/steps/selected-employee-step';
import { SelectedPetStep } from '@/features/booking/components/create-booking/steps/selected-pet-step';
import { BOOKING_STEPS } from '@/features/booking/constant';
import { BOOKING_STEP_ID } from '@/features/booking/domain/booking-step';
import type { useBookingController } from '@/features/booking/hooks/use-creat-booking-controller';
import type { TService } from '@/features/service/domain/service.entity';
import { Card, CardContent } from '@/shared/ui/card';

type Props = ReturnType<typeof useBookingController> & {
  service: TService;
};

export function CreateBookingView(props: Props) {
  const { step } = props;

  const renderContent = () => {
    switch (step) {
      case BOOKING_STEP_ID.SELECT_PET:
        return (
          <SelectedPetStep
            pets={props.petsQuery.data?.data ?? []}
            isLoading={props.petsQuery.isLoading}
            selectedPetId={props.draft.petId}
            onSelectPet={props.setPet}
          />
        );
      case BOOKING_STEP_ID.SELECT_EMPLOYEE:
        return (
          <SelectedEmployeeStep
            employees={props.employeesQuery.data?.data.employees ?? []}
            isLoading={props.employeesQuery.isLoading}
            selectedEmployee={props.draft.employeeId}
            setSelectEmployee={props.setEmployee}
          />
        );
      case BOOKING_STEP_ID.SELECT_DATETIME:
        return (
          <BookingDatetimeStep
            selectedDate={props.draft.date}
            onSelectDate={props.setDate}
            timeSlots={props.slotsQuery.data?.data.slots ?? []}
            selectedTime={props.draft.time}
            onSelectTime={props.setTime}
            isSlotsLoading={props.slotsQuery.isLoading}
          />
        );
      case BOOKING_STEP_ID.CONFIRM:
        return <ConfirmStep setNotes={props.setNotes} summary={props.summary} />;
      default:
        return null;
    }
  };
  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <div className="bg-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium">
          <Sparkles className="h-4 w-4" />
          Đặt lịch dịch vụ
        </div>
        <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          Chăm sóc tốt nhất cho thú cưng
        </h1>
        <p className="text-muted-foreground mx-auto mt-3 max-w-2xl">
          Chỉ vài bước đơn giản để đặt lịch dịch vụ chất lượng cao cho bé yêu của bạn
        </p>
      </div>

      <CreateBookingProgress steps={BOOKING_STEPS} currentStep={step} />
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card className="bg-card/80 overflow-hidden rounded-none border-0">
            <CardContent className="p-6 sm:p-8">{renderContent()}</CardContent>
            <CreateBookingNavigation
              canBack={props.canBack}
              canNext={props.canNext}
              isLastStep={props.isLastStep}
              isConfirming={props.isCreating}
              onBack={props.onBack}
              onNext={props.onNext}
              onConfirm={props.submitBooking}
            />
          </Card>
        </div>
        <div className="lg:col-span-2">
          <div className="sticky top-8">
            <CreateBookingSummary summary={props.summary} />
            <Card className="bg-card/80 mt-4 rounded-none border-0">
              <CardContent className="flex flex-col gap-3 p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                    <Phone className="text-primary h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground text-sm font-medium">Cần hỗ trợ?</p>
                    <p className="text-muted-foreground text-xs">Gọi ngay 1900 1234</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                    <MapPin className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium">PetCare Center</p>
                    <p className="text-muted-foreground text-sm">123 Nguyễn Huệ, Q.1, TP.HCM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
