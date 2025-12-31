import mongoose, { Document, Schema, Types } from "mongoose";
import { Roles, RoleType } from "../enums/role.enum";
import {
  Gender,
  GenderType,
  MemberShipTier,
  MemberShipTierType,
  UserStatus,
  UserStatusType,
} from "../enums/status-user.enum";
import { compareValue, hashValue } from "../utils/bcrypt";

interface ICustomerInfo {
  preferredEmployeeId?: Types.ObjectId;
  communicationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };

  loyaltyPoints: number;
  membershipTier: MemberShipTierType;
  memberSince: Date;

  stats: {
    totalBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    noShowCount: number;
    totalSpent: number;
    averageRating: number;
    lastBookingDate?: Date;
  };

  isVip: boolean;
  hasOutstandingBalance: boolean;
  internalNotes?: string;
}

interface IEmployeeInfo {
  specialties: string[];
  certifications?: string[];
  experience?: string[];

  hourlyRate?: number;
  commissionRate?: number;

  defaultSchedule: {
    workDays: number[]; // [1, 2, 3,4, 5,6] = Mon-Fri
    workHours: {
      start: string;
      end: string;
    };
  };

  stats: {
    rating: number;
    totalBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    noShowRate: number;
    totalRevenue: number;
    averageServiceTime: number;
  };

  hireDate: Date;
  employeeId?: string;
  department?: string;

  isAcceptingBookings: boolean;
  maxDailyBookings: number;
  vacationMode: boolean;
}

export interface UserDocument extends Document {
  _id: Types.ObjectId;
  // Basic Info
  email: string;
  password?: string;
  fullName: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  gender: GenderType;
  address?: {
    province: string;
    ward: string;
  };
  profilePicture?: {
    url: string | null;
    publicId: string | null;
  };
  // Role & status
  role: RoleType;
  status: UserStatusType;

  // Role specific data
  customerInfo: ICustomerInfo;
  employeeInfo?: IEmployeeInfo;

  // Security
  emailVerified: boolean;
  emailVerifiedAt?: Date;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;

  // Session
  lastLogin?: Date;
  lastLoginIp?: string;
  lastActiveAt?: Date;
  // Meta data
  createdAt: Date;
  updatedAt: Date;
  createdBy?: Types.ObjectId;

  comparePassword(value: string): Promise<boolean>;
  canAccessAdminDashboard(): boolean;
  canAccessEmployeeDashboard(): boolean;
  canManageUser(targetUser: UserDocument): boolean;
  canModifyBooking(booking: any): boolean;
}

const userSchema = new Schema<UserDocument>(
  {
    // Basic Info
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: "text",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      select: false,
    },
    phoneNumber: {
      type: String,
      sparse: true,
      index: true,
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: Object.values(Gender),
    },

    // Address
    address: {
      province: { type: String },
      ward: { type: String },
    },

    // Profile
    profilePicture: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },

    // Role
    role: {
      type: String,
      enum: Object.values(Roles),
      default: Roles.CUSTOMER,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
      index: true,
    },

    // Customer Info (REQUIRED - all users)
    customerInfo: {
      type: {
        preferredEmployeeId: { type: Schema.Types.ObjectId, ref: "User" },
        communicationPreferences: {
          email: { type: Boolean, default: true },
          sms: { type: Boolean, default: false },
          push: { type: Boolean, default: true },
        },
        loyaltyPoints: { type: Number, default: 0, min: 0 },
        membershipTier: {
          type: String,
          enum: Object.values(MemberShipTier),
          default: MemberShipTier.BRONZE,
        },
        memberSince: { type: Date, default: Date.now },
        stats: {
          totalBookings: { type: Number, default: 0 },
          completedBookings: { type: Number, default: 0 },
          cancelledBookings: { type: Number, default: 0 },
          noShowCount: { type: Number, default: 0 },
          totalSpent: { type: Number, default: 0 },
          averageRating: { type: Number, default: 0, min: 0, max: 5 },
          lastBookingDate: Date,
        },
        isVip: { type: Boolean, default: false },
        hasOutstandingBalance: { type: Boolean, default: false },
        internalNotes: { type: String, select: false },
      },
      _id: false,
    },

    // Employee Info (optional - only for employee/admin)
    employeeInfo: {
      type: {
        specialties: [{ type: String }],
        certifications: [{ type: String }],
        experience: String,
        hourlyRate: { type: Number, min: 0 },
        commissionRate: { type: Number, min: 0, max: 100 },
        defaultSchedule: {
          workDays: [{ type: Number, min: 0, max: 6 }],
          workHours: {
            start: { type: String, default: "09:00" },
            end: { type: String, default: "17:00" },
          },
        },
        stats: {
          rating: { type: Number, default: 0, min: 0, max: 5 },
          totalBookings: { type: Number, default: 0 },
          completedBookings: { type: Number, default: 0 },
          cancelledBookings: { type: Number, default: 0 },
          noShowRate: { type: Number, default: 0, min: 0, max: 100 },
          totalRevenue: { type: Number, default: 0 },
          averageServiceTime: { type: Number, default: 0 },
        },
        hireDate: { type: Date, default: Date.now },
        employeeId: String,
        department: String,
        isAcceptingBookings: { type: Boolean, default: true },
        maxDailyBookings: { type: Number, default: 8 },
        vacationMode: { type: Boolean, default: false },
      },
      _id: false,
    },

    // Security
    emailVerified: { type: Boolean, default: false },
    emailVerifiedAt: Date,
    phoneVerified: { type: Boolean, default: false },
    twoFactorEnabled: { type: Boolean, default: false },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },
    // Session
    lastLogin: Date,
    lastLoginIp: String,
    lastActiveAt: Date,

    // Metadata
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

userSchema.index({ role: 1, status: 1 });
userSchema.index({ role: 1, "employeeInfo.specialties": 1 });
userSchema.index({ role: 1, "employeeInfo.isAcceptingBookings": 1 });
userSchema.index({ "customerInfo.preferredEmployeeId": 1 });
userSchema.index({ email: 1, status: 1 });

// ============================================
// PRE-SAVE HOOKS
// ============================================

userSchema.pre("save", async function (next) {
  try {
    // Hash password
    if (this.isModified("password") && this.password) {
      this.password = await hashValue(this.password);
    }

    // Initialize customerInfo (always)
    if (!this.customerInfo) {
      this.customerInfo = {
        communicationPreferences: {
          email: true,
          sms: false,
          push: true,
        },
        loyaltyPoints: 0,
        membershipTier: MemberShipTier.BRONZE,
        memberSince: new Date(),
        stats: {
          totalBookings: 0,
          completedBookings: 0,
          cancelledBookings: 0,
          noShowCount: 0,
          totalSpent: 0,
          averageRating: 0,
        },
        isVip: false,
        hasOutstandingBalance: false,
      };
    }

    // Initialize employeeInfo (only for employee/admin)
    if (this.role === Roles.EMPLOYEE || this.role === Roles.ADMIN) {
      if (!this.employeeInfo) {
        this.employeeInfo = {
          specialties: [],
          defaultSchedule: {
            workDays: [1, 2, 3, 4, 5], // Mon-Fri
            workHours: {
              start: "09:00",
              end: "17:00",
            },
          },
          stats: {
            rating: 0,
            totalBookings: 0,
            completedBookings: 0,
            cancelledBookings: 0,
            noShowRate: 0,
            totalRevenue: 0,
            averageServiceTime: 0,
          },
          hireDate: new Date(),
          isAcceptingBookings: true,
          maxDailyBookings: 8,
          vacationMode: false,
        };
      }
    } else {
      // Remove employeeInfo if demoted to customer
      this.employeeInfo = undefined;
    }

    // Auto-upgrade membership tier based on spending
    if (this.customerInfo) {
      const spent = this.customerInfo.stats.totalSpent;
      if (spent >= 50000000) {
        // 50M VND
        this.customerInfo.membershipTier = MemberShipTier.PLATINUM;
        this.customerInfo.isVip = true;
      } else if (spent >= 20000000) {
        // 20M VND
        this.customerInfo.membershipTier = MemberShipTier.GOLD;
      } else if (spent >= 10000000) {
        // 10M VND
        this.customerInfo.membershipTier = MemberShipTier.SILVER;
      }
    }

    next();
  } catch (error: any) {
    next(error);
  }
});

// ============================================
// INSTANCE METHODS
// ============================================

userSchema.methods.comparePassword = async function (
  value: string
): Promise<boolean> {
  return compareValue(value, this.password);
};

userSchema.methods.canAccessAdminDashboard = function (): boolean {
  return this.role === Roles.ADMIN && this.status === UserStatus.ACTIVE;
};

userSchema.methods.canAccessEmployeeDashboard = function (): boolean {
  return (
    (this.role === Roles.EMPLOYEE || this.role === Roles.ADMIN) &&
    this.status === UserStatus.ACTIVE
  );
};

userSchema.methods.canManageUser = function (
  targetUser: UserDocument
): boolean {
  if (this.role === Roles.ADMIN) return true;
  if (this._id.equals(targetUser._id)) return true;
  return false;
};

userSchema.methods.canModifyBooking = function (booking: any): boolean {
  // Admin can modify any
  if (this.role === Roles.ADMIN) return true;

  // Customer can modify their own
  if (this.role === Roles.CUSTOMER && booking.customerId.equals(this._id)) {
    return true;
  }

  // Employee can modify assigned bookings
  if (this.role === Roles.EMPLOYEE && booking.employeeId?.equals(this._id)) {
    return true;
  }

  return false;
};

// ============================================
// STATIC METHODS
// ============================================

userSchema.statics.findAvailableEmployees = function (
  specialty?: string,
  date?: Date
) {
  const query: any = {
    role: { $in: [Roles.EMPLOYEE, Roles.ADMIN] },
    status: "active",
    "employeeInfo.isAcceptingBookings": true,
    "employeeInfo.vacationMode": false,
  };

  if (specialty) {
    query["employeeInfo.specialties"] = specialty;
  }

  return this.find(query)
    .select("-password")
    .sort({ "employeeInfo.stats.rating": -1 });
};

userSchema.statics.findTopPerformers = function (limit = 10) {
  return this.find({
    role: { $in: [Roles.EMPLOYEE, Roles.ADMIN] },
    status: "active",
  })
    .select("-password")
    .sort({
      "employeeInfo.stats.rating": -1,
      "employeeInfo.stats.completedBookings": -1,
    })
    .limit(limit);
};

userSchema.statics.findVipCustomers = function () {
  return this.find({
    status: "active",
    "customerInfo.isVip": true,
  })
    .select("-password")
    .sort({ "customerInfo.stats.totalSpent": -1 });
};

// ============================================
// VIRTUAL FIELDS
// ============================================

userSchema.virtual("completionRate").get(function () {
  if (this.employeeInfo) {
    const total = this.employeeInfo.stats.totalBookings;
    const completed = this.employeeInfo.stats.completedBookings;
    return total > 0 ? (completed / total) * 100 : 0;
  }
  if (this.customerInfo) {
    const total = this.customerInfo.stats.totalBookings;
    const completed = this.customerInfo.stats.completedBookings;
    return total > 0 ? (completed / total) * 100 : 0;
  }
  return 0;
});

userSchema.virtual("displayName").get(function () {
  return this.fullName || this.email.split("@")[0];
});

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
