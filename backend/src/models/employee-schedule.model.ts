import mongoose, { Document, Schema } from "mongoose";

// Define the interfaces for time ranges
export interface TimeRange {
  start: string; // HH:MM format
  end: string; // HH:MM format
}

// Define the interface for schedule data
export interface EmployeeScheduleDocument extends Document {
  employeeId: mongoose.Types.ObjectId;
  date: Date;
  isWorking: boolean;
  workHours: TimeRange[]; // Modified to be an array of time ranges
  note?: string; // Optional note for the day
  createdAt: Date;
  updatedAt: Date;
}

const timeRangeSchema = new Schema<TimeRange>({
  start: {
    type: String,
    required: true
  },
  end: {
    type: String,
    required: true
  }
}, { _id: false }); // _id: false to avoid generating unique IDs for subdocuments

const employeeScheduleSchema = new Schema<EmployeeScheduleDocument>(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    isWorking: {
      type: Boolean,
      default: true
    },
    workHours: {
      type: [timeRangeSchema],
      default: [{ start: "09:00", end: "17:00" }],
      validate: {
        validator: function(ranges: TimeRange[]) {
          // Ensure there's at least one time range if the employee is working
          if (this.isWorking && (!ranges || ranges.length === 0)) {
            return false;
          }
          
          // Validate that each time range has valid values
          for (const range of ranges) {
            if (!range.start || !range.end) return false;
            
            // Ensure end time is after start time
            if (range.start >= range.end) return false;
          }
          
          // Check for overlapping time ranges if there are multiple ranges
          if (ranges.length > 1) {
            // Sort ranges by start time
            const sortedRanges = [...ranges].sort((a, b) => a.start.localeCompare(b.start));
            
            // Check for overlaps
            for (let i = 0; i < sortedRanges.length - 1; i++) {
              if (sortedRanges[i].end > sortedRanges[i + 1].start) {
                return false;
              }
            }
          }
          
          return true;
        },
        message: "Invalid work hours configuration. Time ranges must be valid and non-overlapping."
      }
    },
    note: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Create a compound index on employeeId and date for faster lookups
employeeScheduleSchema.index({ employeeId: 1, date: 1 }, { unique: true });

const EmployeeScheduleModel = mongoose.model<EmployeeScheduleDocument>(
  "EmployeeSchedule",
  employeeScheduleSchema
);

export default EmployeeScheduleModel;