import { MapPin, Phone, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';

import { BOOKING_STEPS } from '@/features/booking/config';
import type { useCreateBookingController } from '@/features/booking/customer-app/create-booking/application/use-create-booking-controller';
import { CreateBookingNavigation } from '@/features/booking/customer-app/create-booking/ui/booking-navigation';
import { CreateBookingProgress } from '@/features/booking/customer-app/create-booking/ui/booking-progress';
import { CreateBookingSummary } from '@/features/booking/customer-app/create-booking/ui/booking-summary';
import { BookingDatetimeStep } from '@/features/booking/customer-app/create-booking/ui/steps/booking-time-slot-step/booking-time-slot-step';
import { ConfirmStep } from '@/features/booking/customer-app/create-booking/ui/steps/confirm-step';
import { SelectedEmployeeStep } from '@/features/booking/customer-app/create-booking/ui/steps/selected-employee-step';
import { SelectedPetStep } from '@/features/booking/customer-app/create-booking/ui/steps/selected-pet-step';
import { BOOKING_STEP, type BookingStep } from '@/features/booking/domain/booking.state';
import { Card, CardContent } from '@/shared/ui/card';

type Props = ReturnType<typeof useCreateBookingController>;
export function CreateBookingView(props: Props) {
  const { state, data, status, actions } = props;

  const renderContent = () => {
    const STEP_RENDERERS: Record<BookingStep, ReactNode> = {
      [BOOKING_STEP.SELECT_PET]: (
        <SelectedPetStep
          pets={data.pets || []}
          isLoading={status.isLoadingPets}
          selectedPetId={state.draft.petId}
          onSelectPet={actions.selectPet}
        />
      ),
      [BOOKING_STEP.SELECT_EMPLOYEE]: (
        <SelectedEmployeeStep
          employees={data.employees || []}
          isLoading={status.isLoadingEmployees}
          selectedEmployee={state.draft.employeeId}
          setSelectEmployee={actions.selectEmployee}
        />
      ),
      [BOOKING_STEP.SELECT_DATETIME]: (
        <BookingDatetimeStep
          selectedDate={state.draft.scheduledDate}
          onSelectDate={actions.selectScheduledDate}
          timeSlots={data.slots || []}
          selectedTime={state.draft.startTime}
          onSelectTime={actions.selectStartTime}
          isSlotsLoading={status.isLoadingSlots}
        />
      ),
      [BOOKING_STEP.CONFIRM]: (
        <ConfirmStep setNotes={actions.updateCustomerNotes} summary={data.summary} />
      ),
    };

    return STEP_RENDERERS[state.step];
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

      <CreateBookingProgress steps={BOOKING_STEPS} currentStep={state.step} />
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card className="bg-card/80 overflow-hidden rounded-none border-0">
            <CardContent className="p-6 sm:p-8">{renderContent()}</CardContent>
            <CreateBookingNavigation
              canBack={state.canGoBack}
              canNext={state.canGoNext}
              isLastStep={state.isLastStep}
              isConfirming={status.isCreating}
              onBack={actions.goPreviousStep}
              onNext={actions.goNextStep}
              onConfirm={actions.submitBooking}
            />
          </Card>
        </div>
        <div className="lg:col-span-2">
          <div className="sticky top-8">
            <CreateBookingSummary summary={data.summary} />
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
