import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ITimeSlot {
  start: string;
  end: string;
}

export interface IReminder {
  sent: boolean;
  sentAt?: Date;
}

export interface IAppointment extends Document {
  customerId: Types.ObjectId;
  petId: Types.ObjectId;
  serviceType: 'single' | 'package';
  serviceId: Types.ObjectId;
  employeeId?: Types.ObjectId;
  scheduledDate: Date;
  scheduledTimeSlot: ITimeSlot;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  serviceNotes?: string;
  paymentStatus: 'pending' | 'completed';
  paymentMethod?: 'cash' | 'card';
  totalAmount?: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  reminder?: IReminder;
}

const AppointmentSchema: Schema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  petId: {
    type: Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  serviceType: {
    type: String,
    enum: ['single', 'package'],
    required: true
  },
  serviceId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'serviceType'
  },
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  scheduledTimeSlot: {
    start: {
      type: String,
      required: true
    },
    end: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: String,
  serviceNotes: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card']
  },
  totalAmount: Number,
  completedAt: Date,
  reminder: {
    sent: {
      type: Boolean,
      default: false
    },
    sentAt: Date
  }
}, { timestamps: true });

// Indexes
AppointmentSchema.index({ customerId: 1 });
AppointmentSchema.index({ petId: 1 });
AppointmentSchema.index({ employeeId: 1 });
AppointmentSchema.index({ scheduledDate: 1 });
AppointmentSchema.index({ status: 1 });
AppointmentSchema.index({ paymentStatus: 1 });

const AppointmentModel = mongoose.model<IAppointment>('Appointment', AppointmentSchema);
export default AppointmentModel