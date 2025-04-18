
import mongoose, { Schema, Types } from 'mongoose';

export interface IPeriod {
  start: Date;
  end: Date;
}

export interface IServiceBreakdown {
  serviceId: Types.ObjectId;
  serviceName: string;
  count: number;
  revenue: number;
  completedCount: number;
  cancelledCount: number;
}

export interface IEmployeePerformance {
  employeeId: Types.ObjectId;
  employeeName: string;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  revenue: number;
}

export interface IAppointmentStats {
  total: number;
  completed: number;
  cancelled: number;
  pending: number;
  confirmed: number;
  inProgress: number;
}

export interface IRevenueStats {
  total: number;
  avgPerAppointment: number;
}

export interface IPaymentStats {
  pending: number;
  completed: number;
  failed: number;
  refunded: number;
}

export interface ICustomerStats {
  total: number;
  new: number;
  recurring: number;
}

export interface IReportMetrics {
  period: IPeriod;
  appointments: IAppointmentStats;
  revenue: IRevenueStats;
  payments: IPaymentStats;
  serviceBreakdown: IServiceBreakdown[];
  employeePerformance: IEmployeePerformance[];
  customers: ICustomerStats;
}

export interface IReport {
  _id: Types.ObjectId;
  reportType: 'daily' | 'weekly' | 'monthly' | 'yearly';
  period: IPeriod;
  metrics: IReportMetrics;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStatistics {
  currentMonth: {
    totalAppointments: number;
    completedAppointments: number;
    revenue: number;
  };
  previousMonth: {
    totalAppointments: number;
    completedAppointments: number;
    revenue: number;
  };
  changes: {
    appointmentsGrowth: number;
    completionRateChange: number;
    revenueGrowth: number;
  };
}
// Service Breakdown Schema
const ReportSchema = new Schema({
  reportType: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: true
  },
  period: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  metrics: {
    period: {
      start: Date,
      end: Date
    },
    appointments: {
      total: Number,
      completed: Number,
      cancelled: Number,
      pending: Number,
      confirmed: Number,
      inProgress: Number
    },
    revenue: {
      total: Number,
      avgPerAppointment: Number
    },
    payments: {
      pending: Number,
      completed: Number,
      failed: Number,
      refunded: Number
    },
    serviceBreakdown: [{
      serviceId: {
        type: Schema.Types.ObjectId,
        ref: 'Service'
      },
      serviceName: String,
      count: Number,
      revenue: Number,
      completedCount: Number,
      cancelledCount: Number
    }],
    employeePerformance: [{
      employeeId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      employeeName: String,
      totalAppointments: Number,
      completedAppointments: Number,
      cancelledAppointments: Number,
      revenue: Number
    }],
    customers: {
      total: Number,
      new: Number,
      recurring: Number
    }
  }
}, { timestamps: true });

// Indexes for better query performance
ReportSchema.index({ reportType: 1 });
ReportSchema.index({ 'period.start': 1, 'period.end': 1 });
ReportSchema.index({ reportType: 1, 'period.start': 1, 'period.end': 1 }, { unique: true });

const ReportModel = mongoose.model<IReport>('Report', ReportSchema);

export default ReportModel;