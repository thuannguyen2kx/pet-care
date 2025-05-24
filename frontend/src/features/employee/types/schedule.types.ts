export interface TimeRange {
  start: string;
  end: string;
}

export interface Schedule {
  _id?: string;
  date: string | Date;
  isWorking: boolean;
  workHours: TimeRange[];
  note?: string;
  isDefault?: boolean;
}

export interface ScheduledTimeSlot {
  start: string;
  end: string;
}

export interface Pet {
  _id: string;
  name: string;
  species?: string;
  breed?: string;
  profilePicture?: {
    url: string;
  };
}

export interface Customer {
  _id: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
}

export interface Appointment {
  _id: string;
  scheduledDate: string | Date;
  scheduledTimeSlot: ScheduledTimeSlot;
  petId?: Pet;
  customerId?: Customer;
  status: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  resource: {
    type: "schedule" | "appointment";
    isWorking?: boolean;
    workHours?: TimeRange[];
    isDefault?: boolean;
    appointment?: Appointment;
  };
}

export interface ScheduleFormData {
  isWorking: boolean;
  workHours: TimeRange[];
  note: string;
}