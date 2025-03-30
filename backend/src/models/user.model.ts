import mongoose, { Document, Schema } from "mongoose";
import { Roles, RoleType } from "../enums/role.enum";
import {
  GENDER,
  GenderType,
  StatusUser,
  StatusUserType,
} from "../enums/status-user.enum";
import { compareValue, hashValue } from "../utils/bcrypt";

interface IEmployeeInfo {
  specialties?: string[];
  schedule?: {
    workDays: string[];
    workHours: {
      start: string;
      end: string;
    };
  };
  performance?: {
    rating: number;
    completedServices: number;
  };
}
export interface UserDocument extends Document {
  email: string;
  password?: string;
  fullName: string;
  phoneNumber?: string;
  gender: GenderType;
  role: RoleType;
  status: StatusUserType;
  profilePicture: {
   url: string | null;
   publicId: string | null;
  };
  employeeInfo: IEmployeeInfo | null;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;

  comparePassword(value: string): Promise<boolean>;
  omitPassword(): Omit<UserDocument, "password">;
}

const userSchema = new Schema<UserDocument>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      select: false,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      enum: Object.values(GENDER),
      default: GENDER.OTHER,
    },
    role: {
      type: String,
      enum: Object.values(Roles),
      default: Roles.CUSTOMER,
    },
    profilePicture: {
      url: {
        type: String,
        default: null
      },
      publicId: {
        type: String,
        default: null
      }
    },
    status: {
      type: String,
      enum: Object.values(StatusUser),
      default: StatusUser.ACTIVE,
    },
    employeeInfo: {
      specialties: [String],
      schedule: {
        workDays: [String],
        workHours: {
          start: String,
          end: String,
        },
      },
      performance: {
        rating: Number,
        completedServices: Number,
      },
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    if (this.password) {
      this.password = await hashValue(this.password);
    }
  }
  if (this.role === Roles.CUSTOMER) {
    this.employeeInfo = null;
  } else if (
    (this.role === Roles.EMPLOYEE || this.role === Roles.ADMIN) &&
    !this.employeeInfo
  ) {
    this.employeeInfo = {
      specialties: [],
      schedule: {
        workDays: [],
        workHours: {
          start: "",
          end: "",
        },
      },
      performance: {
        rating: 0,
        completedServices: 0,
      },
    };
  }
  next();
});

userSchema.methods.omitPassword = function (): Omit<UserDocument, "password"> {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};
userSchema.methods.comparePassword = async function (value: string) {
  return compareValue(value, this.password);
};
userSchema.index({ role: 1 });

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
