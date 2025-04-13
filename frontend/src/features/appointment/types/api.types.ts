import { AppointmentStatus } from "@/constants";

export type AppointmentType = {
  _id: string;
  customerId: string;
  petId: string;
  employeeId: string;
  serviceType: string;
  serviceId: string;
  scheduledDate: Date;
  scheduledTimeSlot: {
    start: string;
    end: string;
  };
  notes?: string;
  serviceNotes?: string;
  status: AppointmentStatus;
  paymentStatus: string;
  totalAmount: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};
export type UserAppointmentType = {
  _id: string;
  customerId: string;
  petId: {
    name: string;
    species: string;
    breed: string;
    profilePicture: {
      url: string | null;
      publicId: string | null;
    };
  };
  employeeId: {
    fullName: string;
    profilePicture: {
      url: string | null;
      publicId: string | null;
    };
  };
  serviceType: string;
  serviceId: {
    _id: string;
    name: string;
    price: number;
    duration: number;
  };
  scheduledDate: Date;
  scheduledTimeSlot: {
    start: string;
    end: string;
  };
  notes?: string;
  serviceNotes?: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};


export type AppointmentDetailsType = {
  _id: string;
  customerId: string;
  petId: {
    name: string;
    species: string;
    breed: string;
    profilePicture: {
      url: string | null;
      publicId: string | null;
    };
  };
  employeeId: {
    fullName: string;
    profilePicture: {
      url: string | null;
      publicId: string | null;
    };
  };
  serviceType: string;
  serviceId: {
    name: string;
    description: string;
    price: number;
    duration: number;
  };
  scheduledDate: Date;
  scheduledTimeSlot: {
    start: string;
    end: string;
  };
  notes?: string;
  serviceNotes?: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
export type AdminAppointmentType = {
 _id: string;
  customerId: {
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  petId: {
    name: string;
    species: string;
    breed: string;
    profilePicture: {
      url: string | null;
      publicId: string | null;
    };
  };
  employeeId: {
    fullName: string;
    profilePicture: {
      url: string | null;
      publicId: string | null;
    };
  };
  serviceType: string;
  serviceId: {
    name: string;
    description: string;
    price: number;
    duration: number;
  };
  scheduledDate: Date;
  scheduledTimeSlot: {
    start: string;
    end: string;
  };
  notes?: string;
  serviceNotes?: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
export interface EmployeeAvailabilityType {
  employeeId: string;
  isAvailable: boolean;
}

export interface TimeSlotType {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  employeeAvailability?: EmployeeAvailabilityType[];
  originalSlotIndexes?: number[];
}

export type GetAvailableTimeSlotResponseType = {
  message: string;
  timeSlot: {
    _id: string;
    date: Date;
    slots: TimeSlotType[]
  }
}