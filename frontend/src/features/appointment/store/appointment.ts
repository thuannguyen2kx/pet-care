import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { FormValues, STEPS } from '@/features/appointment/utils/appointment-form-config';

interface AppointmentFormState {
  // Current step management
  currentStep: number;
  
  // Form data
  formData: Partial<FormValues>;
  
  // Date and time management
  selectedDate: Date | undefined;
  
  // Pet compatibility
  isPetCompatible: boolean;
  incompatibilityReason: string;
  
  // Employee management
  previousEmployeeId: string;
  shouldResetDate: boolean;
  
  // Submission state
  createdAppointmentId: string | null;
  isSubmitting: boolean;
  
  // Service data (cached from props)
  serviceId: string;
  serviceType: string;
  
  // Progress calculation
  progressPercentage: number;
}

interface AppointmentFormActions {
  // Step navigation
  setCurrentStep: (step: number) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  
  // Form data management
  updateFormData: (data: Partial<FormValues>) => void;
  resetFormData: () => void;
  
  // Date management
  setSelectedDate: (date: Date | undefined) => void;
  resetDateTime: () => void;
  
  // Pet compatibility
  setPetCompatible: (isCompatible: boolean, reason?: string) => void;
  
  // Employee management
  handleEmployeeChange: (newEmployeeId: string) => void;
  resetDateOnEmployeeChange: () => void;
  
  // Submission management
  setCreatedAppointmentId: (id: string | null) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  
  // Service management
  setServiceData: (serviceId: string, serviceType: string) => void;
  
  // Reset store
  resetStore: () => void;
  
  // Validation helpers
  canContinueFromStep: (step: number, formValues: FormValues) => boolean;
  isStepComplete: (step: number, formValues: FormValues) => boolean;
}

const initialState: AppointmentFormState = {
  currentStep: STEPS.PET,
  formData: {
    petId: "",
    employeeId: "",
    notes: "",
    paymentMethod: "card",
    timeSlot: {
      start: "",
      end: "",
      originalSlotIndexes: []
    }
  },
  selectedDate: undefined,
  isPetCompatible: true,
  incompatibilityReason: "",
  previousEmployeeId: "",
  shouldResetDate: false,
  createdAppointmentId: null,
  isSubmitting: false,
  serviceId: "",
  serviceType: "",
  progressPercentage: 0,
};

export const useAppointmentFormStore = create<AppointmentFormState & AppointmentFormActions>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      // Step navigation
      setCurrentStep: (step) => {
        const totalSteps = Object.keys(STEPS).length;
        const progressPercentage = ((step + 1) / totalSteps) * 100;
        
        set({ 
          currentStep: step, 
          progressPercentage 
        }, false, 'setCurrentStep');
      },
      
      goToNextStep: () => {
        const { currentStep } = get();
        const totalSteps = Object.keys(STEPS).length;
        
        if (currentStep < totalSteps - 1) {
          const newStep = currentStep + 1;
          const progressPercentage = ((newStep + 1) / totalSteps) * 100;
          
          set({ 
            currentStep: newStep, 
            progressPercentage 
          }, false, 'goToNextStep');
          
          // Scroll to top
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      },
      
      goToPreviousStep: () => {
        const { currentStep } = get();
        
        if (currentStep > 0) {
          const newStep = currentStep - 1;
          const totalSteps = Object.keys(STEPS).length;
          const progressPercentage = ((newStep + 1) / totalSteps) * 100;
          
          set({ 
            currentStep: newStep, 
            progressPercentage 
          }, false, 'goToPreviousStep');
        }
      },
      
      // Form data management
      updateFormData: (data) => {
        set((state) => ({
          formData: { ...state.formData, ...data }
        }), false, 'updateFormData');
      },
      
      resetFormData: () => {
        set({ formData: initialState.formData }, false, 'resetFormData');
      },
      
      // Date management
      setSelectedDate: (date) => {
        set({ selectedDate: date }, false, 'setSelectedDate');
      },
      
      resetDateTime: () => {
        set((state) => ({
          selectedDate: undefined,
          formData: {
            ...state.formData,
            timeSlot: {
              start: "",
              end: "",
              originalSlotIndexes: []
            }
          }
        }), false, 'resetDateTime');
      },
      
      // Pet compatibility
      setPetCompatible: (isCompatible, reason = "") => {
        set({
          isPetCompatible: isCompatible,
          incompatibilityReason: reason
        }, false, 'setPetCompatible');
      },
      
      // Employee management
      handleEmployeeChange: (newEmployeeId) => {
        const { previousEmployeeId } = get();
        
        // Check if employee actually changed
        if (previousEmployeeId && newEmployeeId !== previousEmployeeId) {
          console.log(`Employee changed from ${previousEmployeeId} to ${newEmployeeId}`);
          set({ shouldResetDate: true }, false, 'handleEmployeeChange');
        }
        
        // Update form data and previous employee ID
        set((state) => ({
          formData: { ...state.formData, employeeId: newEmployeeId },
          previousEmployeeId: newEmployeeId || ""
        }), false, 'handleEmployeeChange');
      },
      
      resetDateOnEmployeeChange: () => {
        const { shouldResetDate } = get();
        
        if (shouldResetDate) {
          set((state) => ({
            selectedDate: undefined,
            formData: {
              ...state.formData,
              timeSlot: {
                start: "",
                end: "",
                originalSlotIndexes: []
              }
            },
            shouldResetDate: false
          }), false, 'resetDateOnEmployeeChange');
        }
      },
      
      // Submission management
      setCreatedAppointmentId: (id) => {
        set({ createdAppointmentId: id }, false, 'setCreatedAppointmentId');
      },
      
      setIsSubmitting: (isSubmitting) => {
        set({ isSubmitting }, false, 'setIsSubmitting');
      },
      
      // Service management
      setServiceData: (serviceId, serviceType) => {
        set({ serviceId, serviceType }, false, 'setServiceData');
      },
      
      // Reset store
      resetStore: () => {
        set(initialState, false, 'resetStore');
      },
      
      // Validation helpers
      canContinueFromStep: (step, formValues) => {
        const { isPetCompatible, selectedDate } = get();
        
        switch (step) {
          case STEPS.PET:
            return !!formValues.petId && isPetCompatible;
          case STEPS.EMPLOYEE:
            return true; // Employee selection is optional
          case STEPS.DATE:
            return !!selectedDate;
          case STEPS.TIME:
            return !!(formValues.timeSlot?.start && formValues.timeSlot?.end);
          case STEPS.NOTES:
            return true; // Notes are optional
          case STEPS.PAYMENT:
            return !!formValues.paymentMethod;
          default:
            return false;
        }
      },
      
      isStepComplete: (step, formValues) => {
        const { isPetCompatible, selectedDate } = get();
        
        switch (step) {
          case STEPS.PET:
            return !!formValues.petId && isPetCompatible;
          case STEPS.EMPLOYEE:
            return true; // Always complete since it's optional
          case STEPS.DATE:
            return !!selectedDate;
          case STEPS.TIME:
            return !!(formValues.timeSlot?.start && formValues.timeSlot?.end);
          case STEPS.NOTES:
            return true; // Always complete since it's optional
          case STEPS.PAYMENT:
            return !!formValues.paymentMethod;
          case STEPS.REVIEW:
            return true; // Always complete if reached
          default:
            return false;
        }
      }
    }),
    {
      name: 'appointment-form-store',
      // Only log state changes in development
      enabled: process.env.NODE_ENV === 'development'
    }
  )
);

// Selector hooks for better performance
export const useCurrentStep = () => useAppointmentFormStore(state => state.currentStep);
export const useFormData = () => useAppointmentFormStore(state => state.formData);
export const useSelectedDate = () => useAppointmentFormStore(state => state.selectedDate);
export const useProgressPercentage = () => useAppointmentFormStore(state => state.progressPercentage);
export const usePetCompatibility = () => useAppointmentFormStore(state => ({
  isPetCompatible: state.isPetCompatible,
  incompatibilityReason: state.incompatibilityReason
}));
export const useSubmissionState = () => useAppointmentFormStore(state => ({
  createdAppointmentId: state.createdAppointmentId,
  isSubmitting: state.isSubmitting
}));

// Action hooks
export const useStepNavigation = () => useAppointmentFormStore(state => ({
  setCurrentStep: state.setCurrentStep,
  goToNextStep: state.goToNextStep,
  goToPreviousStep: state.goToPreviousStep
}));

export const useFormActions = () => useAppointmentFormStore(state => ({
  updateFormData: state.updateFormData,
  resetFormData: state.resetFormData,
  setSelectedDate: state.setSelectedDate,
  resetDateTime: state.resetDateTime,
  setPetCompatible: state.setPetCompatible,
  handleEmployeeChange: state.handleEmployeeChange,
  resetDateOnEmployeeChange: state.resetDateOnEmployeeChange
}));

export const useValidation = () => useAppointmentFormStore(state => ({
  canContinueFromStep: state.canContinueFromStep,
  isStepComplete: state.isStepComplete
}));