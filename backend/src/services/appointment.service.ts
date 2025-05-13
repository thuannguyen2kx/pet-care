import mongoose, { Types } from "mongoose";
import AppointmentModel, {
  AppointmentStatus,
  ServiceType,
} from "../models/appointment.model";
import TimeSlotModel, { Slot } from "../models/time-slot.model";
import PetModel from "../models/pet.model";
import ServiceModel from "../models/service.model";
import ServicePackageModel from "../models/service-package.model";
import EmployeeModel, { UserDocument } from "../models/user.model";
import UserModel from "../models/user.model";
import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from "../utils/app-error";
import emailService from "../utils/send-email";
import { StatusUser } from "../enums/status-user.enum";

import { dateUtils } from "../utils/date-fns";
import { Roles } from "../enums/role.enum";
import { SpecialtyType } from "../enums/employee.enum";
import { PaymentStatusEnum } from "../enums/payment.enum";
import EmployeeScheduleModel, { TimeRange } from "../models/employee-schedule.model";

// Lấy tất cả các cuộc hẹn của người dùng đã đăng nhập
export const getUserAppointmentsService = async (userId: string) => {
  const appointments = await AppointmentModel.find({ customerId: userId })
    .populate("petId", "name species breed profilePicture")
    .populate({
      path: "employeeId",
      select: "fullName profilePicture",
    }).
    populate({
      path: "serviceId",
      select: "_id name price duration",
    })
    .sort({ scheduledDate: -1 });

  return { appointments };
};

// Lấy thông tin chi tiết của một cuộc hẹn theo ID
export const getAppointmentByIdService = async (
  appointmentId: string,
  userId: string,
  userRole: string
) => {
  const appointment = await AppointmentModel.findById(appointmentId)
    .populate("petId", "_id name species breed profilePicture")
    .populate({
      path: "employeeId",
      select: "_id fullName profilePicture",
    })
    .populate({
      path: "customerId",
      select: "_id fullName profilePicture email phoneNumber",
    })
    .populate({
      path: "serviceId",
      select: "_id name description price duration images",
    });

  if (!appointment) {
    throw new NotFoundException("Không tìm thấy cuộc hẹn");
  }
  if (
    appointment.customerId._id.toString() !== userId.toString() &&
    userRole !== Roles.ADMIN &&
    userRole !== Roles.EMPLOYEE
  ) {
    throw new ForbiddenException("Bạn không có quyền truy cập cuộc hẹn này");
  }

  return { appointment };
};

// Tạo một cuộc hẹn mới
export const createAppointmentService = async (
  data: {
    petId: string;
    serviceType: ServiceType;
    serviceId: string;
    scheduledDate: string;
    scheduledTimeSlot: {
      start: string;
      end: string;
      originalSlotIndexes?: number[];
    };
    employeeId?: string; // Người dùng có thể chọn nhân viên cụ thể
    notes?: string;
  },
  userId: string,
  userEmail: string
) => {
  // Kiểm tra thú cưng thuộc về người dùng
  const pet = await PetModel.findById(data.petId);
  if (!pet || pet.ownerId.toString() !== userId.toString()) {
    throw new BadRequestException("Thú cưng không hợp lệ");
  }

  // Kiểm tra dịch vụ
  let service;
  let duration;
  let totalAmount;
  let specialties = [];

  if (data.serviceType === ServiceType.SINGLE) {
    service = await ServiceModel.findById(data.serviceId);
    if (!service || !service.isActive) {
      throw new BadRequestException("Dịch vụ không khả dụng");
    }
    duration = service.duration;
    specialties.push(service.category);
    totalAmount = service.price;
  } else if (data.serviceType === ServiceType.PACKAGE) {
    service = await ServicePackageModel.findById(data.serviceId).populate(
      "services"
    );
    if (!service || !service.isActive) {
      throw new BadRequestException("Gói dịch vụ không khả dụng");
    }
    duration = service.duration;
    totalAmount = service.discountedPrice || service.price;
    specialties.push(...service.specialties);
  } else {
    throw new BadRequestException("Loại dịch vụ không hợp lệ");
  }

  // Kiểm tra thú cưng có phù hợp với dịch vụ không
  if (
    service.applicablePetTypes &&
    service.applicablePetTypes.length > 0 &&
    !service.applicablePetTypes.includes(pet.species)
  ) {
    throw new BadRequestException(
      `Dịch vụ này không có sẵn cho loài ${pet.species}`
    );
  }

  // Phân tích ngày và thời gian
  const appointmentDate = dateUtils.parseDate(data.scheduledDate);
  const appointmentStartDay = dateUtils.getStartOfDay(appointmentDate);
  const appointmentEndDay = dateUtils.getEndOfDay(appointmentDate);
  const startTime = data.scheduledTimeSlot.start;
  const endTime = data.scheduledTimeSlot.end;

  // Tìm time slot
  const timeSlotDoc = await TimeSlotModel.findOne({
    date: {
      $gte: appointmentStartDay,
      $lt: appointmentEndDay,
    },
  });

  if (!timeSlotDoc) {
    throw new BadRequestException("Không có khung giờ khả dụng cho ngày này");
  }

  // Mảng chứa các chỉ số của các slot cần cập nhật
  let slotIndexesToUpdate = [];

  // Nếu có originalSlotIndexes, sử dụng chúng
  if (
    data.scheduledTimeSlot.originalSlotIndexes &&
    data.scheduledTimeSlot.originalSlotIndexes.length > 0
  ) {
    slotIndexesToUpdate = data.scheduledTimeSlot.originalSlotIndexes;

    // Kiểm tra tính hợp lệ của các chỉ số slot
    for (const index of slotIndexesToUpdate) {
      if (
        index < 0 ||
        index >= timeSlotDoc.slots.length ||
        !timeSlotDoc.slots[index].isAvailable
      ) {
        throw new BadRequestException(
          "Khung giờ này không khả dụng hoặc đã được đặt"
        );
      }
    }
  } else {
    // Tìm khung giờ theo thời gian bắt đầu và kết thúc
    const requiredSlotCount = Math.ceil(duration / 30);

    const startSlotIndex = timeSlotDoc.slots.findIndex(
      (slot) => slot.startTime === startTime && slot.isAvailable
    );

    if (startSlotIndex === -1) {
      throw new BadRequestException("Khung giờ bắt đầu không khả dụng");
    }

    for (let i = 0; i < requiredSlotCount; i++) {
      slotIndexesToUpdate.push(startSlotIndex + i);
    }
  }

  // Tìm nhân viên có thể phục vụ tất cả các slot
  let assignedEmployeeId: mongoose.Types.ObjectId | null = null;

  // Nếu người dùng chỉ định nhân viên cụ thể
  if (data.employeeId) {
    const employee = await EmployeeModel.findOne({
      _id: data.employeeId,
      status: StatusUser.ACTIVE,
      "employeeInfo.specialties": { $in: specialties },
    });

    if (!employee) {
      throw new BadRequestException(
        "Nhân viên đã chọn không khả dụng hoặc không có chuyên môn phù hợp"
      );
    }

    // Kiểm tra nhân viên có khả dụng trong tất cả các slot không
    let isEmployeeAvailable = true;
    for (const slotIndex of slotIndexesToUpdate) {
      const slot = timeSlotDoc.slots[slotIndex];
      const employeeAvailability = slot.employeeAvailability.find(
        (emp) =>
          emp.employeeId.toString() === data.employeeId && emp.isAvailable
      );

      if (!employeeAvailability) {
        isEmployeeAvailable = false;
        break;
      }
    }

    if (isEmployeeAvailable) {
      assignedEmployeeId = new mongoose.Types.ObjectId(data.employeeId);
    } else {
      throw new BadRequestException(
        "Nhân viên đã chọn không khả dụng trong khung giờ này"
      );
    }
  } else {
    // Tìm nhân viên có chuyên môn phù hợp
    const employees = await EmployeeModel.find({
      status: StatusUser.ACTIVE,
      "employeeInfo.specialties": { $in: specialties },
    });

    if (employees.length === 0) {
      throw new BadRequestException("Không có nhân viên có chuyên môn phù hợp");
    }

    // Tìm nhân viên có thể phục vụ tất cả các slot
    for (const employee of employees) {
      let isEmployeeAvailable = true;

      for (const slotIndex of slotIndexesToUpdate) {
        const slot = timeSlotDoc.slots[slotIndex];
        const employeeAvailability = slot.employeeAvailability.find(
          (emp) =>
            emp.employeeId.toString() ===
              (employee._id as mongoose.Types.ObjectId).toString() &&
            emp.isAvailable
        );

        if (!employeeAvailability) {
          isEmployeeAvailable = false;
          break;
        }
      }

      if (isEmployeeAvailable) {
        assignedEmployeeId = employee._id as mongoose.Types.ObjectId;
        break;
      }
    }
  }

  if (!assignedEmployeeId) {
    throw new BadRequestException(
      "Không có nhân viên khả dụng cho khung giờ này. Vui lòng chọn thời gian khác."
    );
  }

  // Tạo cuộc hẹn
  const appointment = await AppointmentModel.create({
    customerId: userId,
    petId: data.petId,
    serviceType: data.serviceType,
    serviceId: data.serviceId,
    employeeId: assignedEmployeeId,
    scheduledDate: appointmentDate,
    scheduledTimeSlot: {
      start: startTime,
      end: endTime,
    },
    notes: data.notes,
    status: AppointmentStatus.PENDING,
    paymentStatus: PaymentStatusEnum.PENDING,
    totalAmount,
  });

  // Cập nhật trạng thái khả dụng của nhân viên trong tất cả các slot
  for (const slotIndex of slotIndexesToUpdate) {
    // Tìm vị trí của nhân viên trong mảng employeeAvailability
    const empIndex = timeSlotDoc.slots[
      slotIndex
    ].employeeAvailability.findIndex(
      (emp) => emp.employeeId.toString() === assignedEmployeeId.toString()
    );

    if (empIndex !== -1) {
      timeSlotDoc.slots[slotIndex].employeeAvailability[empIndex].isAvailable =
        false;
      timeSlotDoc.slots[slotIndex].employeeAvailability[
        empIndex
      ].appointmentId = appointment._id as mongoose.Types.ObjectId;
    }

    // Kiểm tra nếu tất cả nhân viên đều không khả dụng, đánh dấu slot là không khả dụng
    const anyEmployeeAvailable = timeSlotDoc.slots[
      slotIndex
    ].employeeAvailability.some((emp) => emp.isAvailable);

    if (!anyEmployeeAvailable) {
      timeSlotDoc.slots[slotIndex].isAvailable = false;
    }
  }

  await timeSlotDoc.save();

  // Gửi email xác nhận
  try {
    const displayDate = dateUtils.formatDate(appointmentDate);
    const employee = await EmployeeModel.findById(assignedEmployeeId);

    await emailService.sendAppointmentConfirmation(userEmail, {
      date: displayDate,
      time: startTime,
      serviceName: service.name,
      petName: pet.name,
      employeeName: employee ? employee.fullName : "Nhân viên của chúng tôi",
    });
  } catch (emailError) {
    console.error("Không thể gửi email xác nhận:", emailError);
  }

  return {
    appointment,
    message: "Đặt lịch hẹn thành công! Email xác nhận đã được gửi.",
  };
};

// Cập nhật trạng thái cuộc hẹn
export const updateAppointmentStatusService = async (
  appointmentId: string,
  data: {
    status: AppointmentStatus;
    serviceNotes?: string;
  },
  userRole: string
) => {
  const appointment = await AppointmentModel.findById(appointmentId);

  if (!appointment) {
    throw new NotFoundException("Không tìm thấy cuộc hẹn");
  }

  // Kiểm tra quyền truy cập
  if (userRole !== Roles.ADMIN && userRole !== Roles.EMPLOYEE) {
    throw new ForbiddenException(
      "Bạn không có quyền cập nhật trạng thái cuộc hẹn"
    );
  }

  // Xác thực chuyển đổi trạng thái
  const validStatusTransitions: Record<string, string[]> = {
    [AppointmentStatus.PENDING]: [
      AppointmentStatus.CONFIRMED,
      AppointmentStatus.CANCELLED,
    ],
    [AppointmentStatus.CONFIRMED]: [
      AppointmentStatus.IN_PROGRESS,
      AppointmentStatus.CANCELLED,
    ],
    [AppointmentStatus.IN_PROGRESS]: [
      AppointmentStatus.COMPLETED,
      AppointmentStatus.CANCELLED,
    ],
    [AppointmentStatus.COMPLETED]: [],
    [AppointmentStatus.CANCELLED]: [],
  };

  if (!validStatusTransitions[appointment.status].includes(data.status)) {
    throw new BadRequestException(
      `Không thể thay đổi trạng thái từ ${appointment.status} sang ${data.status}`
    );
  }

  // Cập nhật cuộc hẹn
  appointment.status = data.status;

  if (data.serviceNotes) {
    appointment.serviceNotes = data.serviceNotes;
  }

  if (data.status === AppointmentStatus.COMPLETED) {
    appointment.completedAt = new Date();

    // Cập nhật số liệu thống kê của nhân viên
    if (appointment.employeeId) {
      const employee = await EmployeeModel.findById(appointment.employeeId);
      if (employee && employee.employeeInfo?.performance) {
        employee.employeeInfo.performance.completedServices += 1;
        await employee.save();
      }
    }
  }

  const updatedAppointment = await appointment.save();

  // Gửi email thông báo dựa trên thay đổi trạng thái
  if (data.status === AppointmentStatus.CONFIRMED) {
    const pet = await PetModel.findById(appointment.petId);
    const customer = await UserModel.findById(appointment.customerId);

    if (customer && pet) {
      try {
        // Định dạng ngày để hiển thị
        const displayDate = dateUtils.formatDate(appointment.scheduledDate);

        await emailService.sendEmail({
          to: customer.email,
          subject: "Cuộc hẹn của bạn đã được xác nhận",
          html: `
            <h1>Cuộc hẹn đã được xác nhận</h1>
            <p>Cuộc hẹn của bạn cho ${pet.name} vào ngày ${displayDate} 
            lúc ${appointment.scheduledTimeSlot.start} đã được xác nhận.</p>
            <p>Vui lòng đến trước thời gian hẹn 10 phút.</p>
          `,
        });
      } catch (emailError) {
        console.error("Không thể gửi email xác nhận:", emailError);
      }
    }
  }

  return { updatedAppointment };
};

// Hủy cuộc hẹn
export const cancelAppointmentService = async (
  appointmentId: string,
  userId: string,
  userRole: string
) => {
  const appointment = await AppointmentModel.findById(appointmentId);

  if (!appointment) {
    throw new NotFoundException("Không tìm thấy cuộc hẹn");
  }

  // Kiểm tra quyền
  if (
    appointment.customerId.toString() !== userId.toString() &&
    userRole !== Roles.ADMIN
  ) {
    throw new ForbiddenException("Bạn không có quyền hủy cuộc hẹn này");
  }

  // Kiểm tra trạng thái
  if (
    [AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED].includes(
      appointment.status
    )
  ) {
    throw new BadRequestException(
      `Không thể hủy cuộc hẹn với trạng thái ${appointment.status}`
    );
  }

  // Kiểm tra thời gian
  const now = new Date();
  const appointmentTime = new Date(appointment.scheduledDate);
  const hoursDifference = dateUtils.getHoursBetween(appointmentTime, now);

  if (hoursDifference < 24 && userRole !== Roles.ADMIN) {
    throw new BadRequestException(
      "Cuộc hẹn chỉ có thể hủy ít nhất 24 giờ trước"
    );
  }

  // Cập nhật trạng thái
  appointment.status = AppointmentStatus.CANCELLED;
  const updatedAppointment = await appointment.save();

  // Mở khóa slot và trạng thái nhân viên
  const appointmentStartDay = dateUtils.getStartOfDay(appointmentTime);
  const appointmentEndDay = dateUtils.getEndOfDay(appointmentTime);
  const employeeId = appointment?.employeeId?.toString();

  const timeSlot = await TimeSlotModel.findOne({
    date: {
      $gte: appointmentStartDay,
      $lt: appointmentEndDay,
    },
  });

  if (timeSlot) {
    // Tìm các slot liên quan đến cuộc hẹn này
    for (let i = 0; i < timeSlot.slots.length; i++) {
      const slot = timeSlot.slots[i];

      // Tìm vị trí của nhân viên trong mảng employeeAvailability
      const empIndex = slot.employeeAvailability.findIndex(
        (emp) =>
          emp.employeeId.toString() === employeeId &&
          emp.appointmentId?.toString() ===
            (appointment._id as mongoose.Types.ObjectId).toString()
      );

      if (empIndex !== -1) {
        // Cập nhật trạng thái nhân viên
        timeSlot.slots[i].employeeAvailability[empIndex].isAvailable = true;
        timeSlot.slots[i].employeeAvailability[empIndex].appointmentId =
          undefined;

        // Cập nhật slot thành khả dụng nếu có ít nhất một nhân viên khả dụng
        timeSlot.slots[i].isAvailable = true;
      }
    }

    await timeSlot.save();
  }

  // Gửi email hủy
  const customer = await UserModel.findById(appointment.customerId);
  const pet = await PetModel.findById(appointment.petId);

  if (customer && pet) {
    try {
      const displayDate = dateUtils.formatDate(appointment.scheduledDate);

      await emailService.sendEmail({
        to: customer.email,
        subject: "Cuộc hẹn của bạn đã bị hủy",
        html: `
          <h1>Cuộc hẹn đã bị hủy</h1>
          <p>Cuộc hẹn của bạn cho ${pet.name} vào ngày ${displayDate} 
          lúc ${appointment.scheduledTimeSlot.start} đã bị hủy.</p>
          <p>Nếu bạn muốn đặt lại lịch, vui lòng truy cập trang web của chúng tôi hoặc liên hệ với chúng tôi.</p>
        `,
      });
    } catch (emailError) {
      console.error("Không thể gửi email hủy:", emailError);
    }
  }

  return {
    appointment: updatedAppointment,
    message: "Hủy cuộc hẹn thành công",
  };
};

// Hàm khởi tạo time slot với nhân viên
export const initializeTimeSlotWithEmployees = async (
  date: Date,
  employees: any[]
) => {
  const slots = [];
  const openingHour = 9;
  const closingHour = 17;

  // Tạo các slot 30 phút
  for (let hour = openingHour; hour < closingHour; hour++) {
    // Slot đầu tiên trong giờ (XX:00 - XX:30)
    const firstSlot = {
      startTime: `${hour.toString().padStart(2, "0")}:00`,
      endTime: `${hour.toString().padStart(2, "0")}:30`,
      isAvailable: true,
      employeeAvailability: employees.map((employee) => ({
        employeeId: employee._id,
        isAvailable: true,
      })),
    };

    // Slot thứ hai trong giờ (XX:30 - (XX+1):00)
    const secondSlot = {
      startTime: `${hour.toString().padStart(2, "0")}:30`,
      endTime: `${(hour + 1).toString().padStart(2, "0")}:00`,
      isAvailable: true,
      employeeAvailability: employees.map((employee) => ({
        employeeId: employee._id,
        isAvailable: true,
      })),
    };

    slots.push(firstSlot, secondSlot);
  }

  return await TimeSlotModel.create({
    date,
    slots,
  });
};

// Định nghĩa interface cho response
export interface TimeSlotResponse {
  date: Date;
  slots: Slot[];
  employeeWorkHours?: TimeRange[];
  employeeNotWorking?: boolean;
  employeeOnVacation?: boolean;
  noAvailableSlots?: boolean;
}

export const getAvailableTimeSlotsService = async (query: {
  date: string;
  serviceId?: string;
  serviceType?: ServiceType;
  petId?: string;
  employeeId?: string; // Nhân viên cụ thể
}) => {
  if (!query.date) {
    throw new BadRequestException("Ngày là bắt buộc");
  }

  // Phân tích ngày và kiểm tra tính hợp lệ
  const selectedDate = dateUtils.parseDate(query.date);
  const selectedStartDay = dateUtils.getStartOfDay(selectedDate);
  const selectedEndDay = dateUtils.getEndOfDay(selectedDate);

  // Kiểm tra xem ngày đã qua chưa
  if (dateUtils.isPastDate(selectedDate)) {
    throw new BadRequestException(
      "Không thể đặt lịch hẹn cho các ngày trong quá khứ"
    );
  }

  // Các biến để theo dõi trạng thái
  let isEmployeeNotWorking = false;
  let isEmployeeOnVacation = false;
  let employeeWorkHours: TimeRange[] = [];

  // Lấy thông tin dịch vụ và thời lượng nếu có
  let service;
  let duration = 60; // Thời lượng mặc định tính bằng phút
  let requiredSpecialties: SpecialtyType[] = [];

  if (query.serviceId && query.serviceType) {
    if (query.serviceType === ServiceType.SINGLE) {
      service = await ServiceModel.findById(query.serviceId);
      if (service?.duration) {
        duration = service.duration;
      }
      if (service?.category) {
        requiredSpecialties.push(service.category);
      }
    } else if (query.serviceType === ServiceType.PACKAGE) {
      service = await ServicePackageModel.findById(query.serviceId);
      if (service?.duration) {
        duration = service.duration;
      }
      if (service?.specialties && service.specialties.length > 0) {
        requiredSpecialties = service.specialties;
      }
    }
  }

  // ----- THÊM MỚI: Kiểm tra lịch làm việc của nhân viên -----
  if (query.employeeId) {
    // Kiểm tra lịch làm việc của nhân viên được chọn
    const employeeSchedule = await EmployeeScheduleModel.findOne({
      employeeId: query.employeeId,
      date: {
        $gte: selectedStartDay,
        $lt: selectedEndDay, 
      }
    });

    if (employeeSchedule) {
      // Nhân viên có lịch cụ thể cho ngày này
      if (!employeeSchedule.isWorking) {
        // Nhân viên không làm việc vào ngày này
        const response: TimeSlotResponse = {
          date: selectedDate,
          slots: [],
          employeeNotWorking: true
        };
        return { timeSlot: response };
      }
      
      // Nhân viên làm việc, lấy giờ làm việc
      employeeWorkHours = employeeSchedule.workHours;
    } else {
      // Không có lịch cụ thể, kiểm tra lịch làm việc mặc định
      const employee = await UserModel.findById(query.employeeId);
      if (employee?.employeeInfo?.schedule) {
        // Kiểm tra ngày trong tuần
        const dayOfWeek = selectedDate
          .toLocaleDateString("en-US", { weekday: "long" })
          .toLowerCase();
        
        if (!employee.employeeInfo.schedule.workDays.includes(dayOfWeek)) {
          // Ngày này không phải ngày làm việc
          const response: TimeSlotResponse = {
            date: selectedDate,
            slots: [],
            employeeNotWorking: true
          };
          return { timeSlot: response };
        }
        
        // Chuyển đổi lịch mặc định sang định dạng mới
        if (employee.employeeInfo.schedule.workHours) {
          employeeWorkHours = [{
            start: employee.employeeInfo.schedule.workHours.start,
            end: employee.employeeInfo.schedule.workHours.end
          }];
        }
        
        // Kiểm tra nghỉ phép
        if (employee.employeeInfo.schedule.vacation && employee.employeeInfo.schedule.vacation.length > 0) {
          const isOnVacation = employee.employeeInfo.schedule.vacation.some(
            vacation => {
              const vacationStart = new Date(vacation.start);
              const vacationEnd = new Date(vacation.end);
              return selectedDate >= vacationStart && selectedDate <= vacationEnd;
            }
          );
          
          if (isOnVacation) {
            const response: TimeSlotResponse = {
              date: selectedDate,
              slots: [],
              employeeOnVacation: true
            };
            return { timeSlot: response };
          }
        }
      }
    }
  }

  // Tìm hoặc tạo khung giờ cho ngày
  let timeSlotDoc = await TimeSlotModel.findOne({
    date: {
      $gte: selectedStartDay,
      $lt: selectedEndDay,
    },
  });

  // Nếu không có khung giờ nào tồn tại cho ngày này, tạo chúng
  if (!timeSlotDoc) {
    // Lấy tất cả nhân viên đang hoạt động
    let employees;
    
    if (query.employeeId) {
      // Nếu chọn nhân viên cụ thể, chỉ lấy nhân viên đó
      employees = await UserModel.find({
        _id: query.employeeId,
        status: StatusUser.ACTIVE,
        "employeeInfo.specialties": requiredSpecialties.length > 0 
          ? { $in: requiredSpecialties } 
          : { $exists: true }
      });
    } else {
      // Lấy tất cả nhân viên có chuyên môn phù hợp
      employees = await UserModel.find({
        role: Roles.EMPLOYEE,
        status: StatusUser.ACTIVE,
        "employeeInfo.specialties": requiredSpecialties.length > 0 
          ? { $in: requiredSpecialties } 
          : { $exists: true }
      });
    }

    if (employees.length === 0) {
      if (query.employeeId) {
        throw new BadRequestException("Nhân viên này không khả dụng hoặc không có chuyên môn phù hợp");
      } else {
        throw new BadRequestException("Không có nhân viên khả dụng");
      }
    }

    // Khởi tạo time slot với danh sách nhân viên
    timeSlotDoc = await initializeTimeSlotWithEmployees(selectedDate, employees);
  }

  // Lấy danh sách slots từ document
  let slots = timeSlotDoc.slots;
  
  // Lưu trữ tất cả các slots ban đầu để trả về
  const allOriginalSlots = [...slots];

  // Hàm kiểm tra slot có trong khung giờ làm việc không
  const isInWorkHours = (slot: Slot): boolean => {
    if (!query.employeeId || employeeWorkHours.length === 0) {
      return true; // Nếu không có nhân viên hoặc không có giờ làm việc, mặc định là true
    }
    
    return employeeWorkHours.some(workHour => {
      const workStartHour = parseInt(workHour.start.split(':')[0]);
      const workStartMinute = parseInt(workHour.start.split(':')[1]);
      const workEndHour = parseInt(workHour.end.split(':')[0]);
      const workEndMinute = parseInt(workHour.end.split(':')[1]);
      
      const slotStartHour = parseInt(slot.startTime.split(':')[0]);
      const slotStartMinute = parseInt(slot.startTime.split(':')[1]);
      const slotEndHour = parseInt(slot.endTime.split(':')[0]);
      const slotEndMinute = parseInt(slot.endTime.split(':')[1]);
      
      // Slot phải bắt đầu sau hoặc cùng lúc với giờ bắt đầu làm việc
      const isAfterWorkStart = 
        slotStartHour > workStartHour || 
        (slotStartHour === workStartHour && slotStartMinute >= workStartMinute);
      
      // Slot phải kết thúc trước hoặc cùng lúc với giờ kết thúc làm việc
      const isBeforeWorkEnd = 
        slotEndHour < workEndHour || 
        (slotEndHour === workEndHour && slotEndMinute <= workEndMinute);
      
      return isAfterWorkStart && isBeforeWorkEnd;
    });
  };

  // ----- THÊM MỚI: Lọc khung giờ theo lịch làm việc của nhân viên -----
  if (query.employeeId && employeeWorkHours.length > 0) {
    // Đánh dấu các slot không nằm trong giờ làm việc là không khả dụng
    allOriginalSlots.forEach(slot => {
      if (!isInWorkHours(slot)) {
        slot.isAvailable = false;
        
        // Cập nhật trạng thái của nhân viên
        const employeeIndex = slot.employeeAvailability.findIndex(
          emp => emp.employeeId.toString() === query.employeeId
        );
        
        if (employeeIndex >= 0) {
          slot.employeeAvailability[employeeIndex].isAvailable = false;
        } else {
          // Thêm nhân viên vào danh sách nếu chưa có
          slot.employeeAvailability.push({
            employeeId: new mongoose.Types.ObjectId(query.employeeId),
            isAvailable: false
          });
        }
      }
    });
    
    // Lọc slots trong khung giờ làm việc để xử lý tiếp
    slots = slots.filter(slot => isInWorkHours(slot));
  }

  // Nếu không cần kiểm tra thời lượng dịch vụ, trả về kết quả
  if (!query.serviceId || !query.serviceType) {
    // Nếu có yêu cầu về nhân viên cụ thể, lọc các slot theo trạng thái của nhân viên
    if (query.employeeId) {
      // Đánh dấu slots theo trạng thái khả dụng của nhân viên
      allOriginalSlots.forEach(slot => {
        const employeeAvailable = slot.employeeAvailability.some(
          (emp) => emp.employeeId.toString() === query.employeeId && emp.isAvailable
        );
        // Một slot chỉ khả dụng khi cả slot và nhân viên đều khả dụng
        slot.isAvailable = slot.isAvailable && employeeAvailable;
      });

      // Tạo response object mới
      const timeSlotResponse: TimeSlotResponse = {
        date: selectedDate,
        slots: allOriginalSlots, // Return all slots including unavailable ones
        employeeWorkHours: employeeWorkHours,
      };

      return { timeSlot: timeSlotResponse };
    }

    // Tạo response object mới
    const timeSlotResponse: TimeSlotResponse = {
      date: selectedDate,
      slots: allOriginalSlots, // Return all slots
    };

    return { timeSlot: timeSlotResponse };
  }

  // Tính số lượng slot 30 phút cần thiết cho dịch vụ
  const requiredSlotCount = Math.ceil(duration / 30);

  // Tạo danh sách các khung giờ có thể đặt lịch
  const availableSlots: Slot[] = [];
  const slotsLength = slots.length;

  for (let i = 0; i <= slotsLength - requiredSlotCount; i++) {
    // Kiểm tra chuỗi liên tiếp các slot có đều khả dụng không
    let consecutiveSlots: Slot[] = [];
    let availableEmployeeIds: string[] = []; // Lưu nhiều nhân viên

    // Nếu có employeeId, chỉ kiểm tra nhân viên đó
    const employeesToCheck = query.employeeId 
      ? [query.employeeId] 
      : await UserModel.find({
          role: Roles.EMPLOYEE,
          status: StatusUser.ACTIVE,
          "employeeInfo.specialties": requiredSpecialties.length > 0 
            ? { $in: requiredSpecialties } 
            : { $exists: true }
        }).then(employees => employees.map((emp) => (emp._id as mongoose.Types.ObjectId).toString()));

    // Tìm nhân viên có thể phục vụ tất cả các slot liên tiếp
    for (const employeeId of employeesToCheck) {
      let canServeAllSlots = true;
      let currentConsecutiveSlots: Slot[] = []; // Mảng tạm để lưu slots

      // Kiểm tra từng slot trong chuỗi
      for (let j = 0; j < requiredSlotCount; j++) {
        const currentSlot = slots[i + j];
        
        // Nếu slot không tồn tại hoặc không khả dụng
        if (!currentSlot || !currentSlot.isAvailable) {
          canServeAllSlots = false;
          break;
        }

        // Nếu không phải là slot đầu tiên, kiểm tra tính liên tục
        if (j > 0) {
          const previousSlot = slots[i + j - 1];
          if (previousSlot.endTime !== currentSlot.startTime) {
            canServeAllSlots = false;
            break;
          }
        }

        // Kiểm tra nhân viên có khả dụng trong slot này không
        const employeeAvailability = currentSlot.employeeAvailability?.find(
          (emp) => emp.employeeId.toString() === employeeId
        );

        if (!employeeAvailability || !employeeAvailability.isAvailable) {
          canServeAllSlots = false;
          break;
        }

        currentConsecutiveSlots.push(currentSlot);
      }

      // Nếu nhân viên này có thể phục vụ tất cả slot
      if (canServeAllSlots && currentConsecutiveSlots.length === requiredSlotCount) {
        availableEmployeeIds.push(employeeId);
        
        // Chỉ cập nhật consecutiveSlots nếu chưa có
        if (consecutiveSlots.length === 0) {
          consecutiveSlots = [...currentConsecutiveSlots];
        }
      }
    }

    // Nếu tìm thấy ít nhất một nhân viên có thể phục vụ tất cả các slot
    if (availableEmployeeIds.length > 0 && consecutiveSlots.length === requiredSlotCount) {
      const firstSlot = consecutiveSlots[0];
      const lastSlot = consecutiveSlots[consecutiveSlots.length - 1];

      availableSlots.push({
        startTime: firstSlot.startTime,
        endTime: lastSlot.endTime,
        isAvailable: true,
        employeeAvailability: availableEmployeeIds.map(id => ({
          employeeId: new mongoose.Types.ObjectId(id),
          isAvailable: true,
        })),
        // Lưu vị trí các slot gốc để sử dụng khi đặt lịch
        originalSlotIndexes: Array.from(
          { length: requiredSlotCount },
          (_, idx) => i + idx
        ),
      });
    }
  }
  
  // Tạo các slots không khả dụng (đã đặt hoặc không thỏa mãn yêu cầu)
  const unavailableSlots: Slot[] = [];
  
  // Xử lý các khung giờ 30 phút cơ bản và biến chúng thành slots theo thời lượng dịch vụ
  // Chỉ xem xét các khung giờ trong giờ làm việc
  for (let i = 0; i <= allOriginalSlots.length - requiredSlotCount; i++) {
    // Kiểm tra xem khung giờ này đã được thêm vào availableSlots chưa
    const isAlreadyAvailable = availableSlots.some(slot => {
      return slot.startTime === allOriginalSlots[i].startTime;
    });
    
    // Chỉ xử lý nếu không phải slot khả dụng và nằm trong giờ làm việc
    if (!isAlreadyAvailable) {
      // Kiểm tra tính liên tục
      let isConsecutive = true;
      let allInWorkHours = true; // Kiểm tra tất cả slot có trong giờ làm việc không
      
      // Mảng để lưu các slot cần kiểm tra
      const slotsToCheck: Slot[] = [];
      
      for (let j = 0; j < requiredSlotCount; j++) {
        if (i + j < allOriginalSlots.length) {
          slotsToCheck.push(allOriginalSlots[i + j]);
          
          // Kiểm tra slot có trong giờ làm việc không
          if (query.employeeId && employeeWorkHours.length > 0 && !isInWorkHours(allOriginalSlots[i + j])) {
            allInWorkHours = false;
            break;
          }
          
          // Kiểm tra tính liên tục
          if (j > 0 && allOriginalSlots[i + j - 1].endTime !== allOriginalSlots[i + j].startTime) {
            isConsecutive = false;
            break;
          }
        } else {
          isConsecutive = false;
          break;
        }
      }
      
      // Nếu tất cả slot liên tiếp và nằm trong giờ làm việc, tạo một slot không khả dụng
      if (isConsecutive && allInWorkHours && slotsToCheck.length === requiredSlotCount) {
        const firstSlot = slotsToCheck[0];
        const lastSlot = slotsToCheck[slotsToCheck.length - 1];
        
        // Chỉ thêm slot không khả dụng nếu tất cả slot đều nằm trong giờ làm việc
        unavailableSlots.push({
          startTime: firstSlot.startTime,
          endTime: lastSlot.endTime,
          isAvailable: false,
          employeeAvailability: query.employeeId ? 
            [{ employeeId: new mongoose.Types.ObjectId(query.employeeId), isAvailable: false }] :
            [],
          originalSlotIndexes: Array.from(
            { length: requiredSlotCount },
            (_, idx) => i + idx
          ),
        });
      }
    }
  }
  
  // Kết hợp available và unavailable slots
  const allCombinedSlots = [...availableSlots, ...unavailableSlots];
  
  // Sắp xếp theo thời gian bắt đầu
  allCombinedSlots.sort((a, b) => {
    const aHour = parseInt(a.startTime.split(':')[0]);
    const aMinute = parseInt(a.startTime.split(':')[1]);
    const bHour = parseInt(b.startTime.split(':')[0]);
    const bMinute = parseInt(b.startTime.split(':')[1]);
    
    if (aHour === bHour) {
      return aMinute - bMinute;
    }
    return aHour - bHour;
  });

  // Tạo response object mới
  const timeSlotResponse: TimeSlotResponse = {
    date: selectedDate,
    slots: allCombinedSlots, // Return all slots in work hours
    noAvailableSlots: availableSlots.length === 0,
    employeeWorkHours: employeeWorkHours
  };

  // Trả về kết quả
  return {
    timeSlot: timeSlotResponse
  };
};

// Lấy tất cả cuộc hẹn (cho quản trị viên)
export const getAllAppointmentsService = async (query: any) => {
  const { status, startDate, endDate, employeeId, customerId, petId } = query;

  const filter: any = {};

  if (status) {
    filter.status = status;
  }

  if (startDate && endDate) {
    // Chuyển đổi và sử dụng startOfDay và endOfDay
    const startDateObj = dateUtils.getStartOfDay(
      dateUtils.parseDate(startDate)
    );
    const endDateObj = dateUtils.getEndOfDay(dateUtils.parseDate(endDate));

    filter.scheduledDate = {
      $gte: startDateObj,
      $lte: endDateObj,
    };
  } else if (startDate) {
    filter.scheduledDate = {
      $gte: dateUtils.getStartOfDay(dateUtils.parseDate(startDate)),
    };
  } else if (endDate) {
    filter.scheduledDate = {
      $lte: dateUtils.getEndOfDay(dateUtils.parseDate(endDate)),
    };
  }

  if (employeeId) {
    filter.employeeId = employeeId;
  }

  if (customerId) {
    filter.customerId = customerId;
  }

  if (petId) {
    filter.petId = petId;
  }

  const appointments = await AppointmentModel.find(filter)
    .populate("petId", "name species breed profilePicture")
    .populate({
      path: "employeeId",
      select: "fullName profilePicture",
    })
    .populate("customerId", "fullName email phoneNumber")
    .populate({
      path: "serviceId",
      select: "name description price duration",
    })
    .sort({ scheduledDate: -1 });

  return { appointments };
};
