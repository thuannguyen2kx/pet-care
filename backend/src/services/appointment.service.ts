import mongoose, { Types } from "mongoose";
import AppointmentModel, {
  AppointmentStatus,
  ServiceType,
} from "../models/appointment.model";
import TimeSlotModel, { EmployeeAvailability, ITimeSlot, Slot } from "../models/time-slot.model";
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
    employeeId?: string;
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
  let duration: number;
  let totalAmount: number;
  let specialties: string[] = [];

  if (data.serviceType === ServiceType.SINGLE) {
    service = await ServiceModel.findById(data.serviceId);
    if (!service || !service.isActive) {
      throw new BadRequestException("Dịch vụ không khả dụng");
    }
    duration = service.duration;
    specialties.push(service.category);
    totalAmount = service.price;
  } else if (data.serviceType === ServiceType.PACKAGE) {
    service = await ServicePackageModel.findById(data.serviceId).populate("services");
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
    throw new BadRequestException(`Dịch vụ này không có sẵn cho loài ${pet.species}`);
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
  let slotIndexesToUpdate: number[] = [];

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
        throw new BadRequestException("Khung giờ này không khả dụng hoặc đã được đặt");
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

    // FIX: Kiểm tra tất cả slots liên tiếp có khả dụng không
    for (let i = 0; i < requiredSlotCount; i++) {
      const slotIndex = startSlotIndex + i;
      if (
        slotIndex >= timeSlotDoc.slots.length ||
        !timeSlotDoc.slots[slotIndex].isAvailable
      ) {
        throw new BadRequestException(`Không đủ khung giờ liên tiếp khả dụng`);
      }
      slotIndexesToUpdate.push(slotIndex);
    }
  }

  // Tìm nhân viên có thể phục vụ tất cả các slot
  let assignedEmployeeId: mongoose.Types.ObjectId | null = null;

  // Nếu người dùng chỉ định nhân viên cụ thể
  if (data.employeeId) {
    const employee = await UserModel.findOne({
      _id: data.employeeId,
      role: { $in: [Roles.EMPLOYEE, Roles.ADMIN] },
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
        (emp) => emp.employeeId.toString() === data.employeeId && emp.isAvailable
      );

      if (!employeeAvailability) {
        isEmployeeAvailable = false;
        break;
      }
    }

    if (isEmployeeAvailable) {
      assignedEmployeeId = new mongoose.Types.ObjectId(data.employeeId);
    } else {
      throw new BadRequestException("Nhân viên đã chọn không khả dụng trong khung giờ này");
    }
  } else {
    // Tìm nhân viên có chuyên môn phù hợp
    const employees = await UserModel.find({
      role: { $in: [Roles.EMPLOYEE, Roles.ADMIN] },
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

  // FIX: Sử dụng session để đảm bảo consistency
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Tạo cuộc hẹn
    const appointment = await AppointmentModel.create([{
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
    }], { session });

    const createdAppointment = appointment[0];

    // FIX: Cập nhật time slot với đầy đủ thông tin
    for (const slotIndex of slotIndexesToUpdate) {
      const slot = timeSlotDoc.slots[slotIndex];
      
      // Cập nhật appointmentId cho slot chính
      slot.appointmentId = createdAppointment._id as mongoose.Types.ObjectId;
      
      // Tìm và cập nhật trạng thái của nhân viên được assign
      const empIndex = slot.employeeAvailability.findIndex(
        (emp) => emp.employeeId.toString() === assignedEmployeeId!.toString()
      );

      if (empIndex !== -1) {
        slot.employeeAvailability[empIndex].isAvailable = false;
        slot.employeeAvailability[empIndex].appointmentId = createdAppointment._id as mongoose.Types.ObjectId;
      } else {
        // FIX: Nếu nhân viên chưa có trong danh sách, thêm vào
        slot.employeeAvailability.push({
          employeeId: assignedEmployeeId!,
          isAvailable: false,
          appointmentId: createdAppointment._id as mongoose.Types.ObjectId
        });
      }

      // FIX: Kiểm tra và cập nhật trạng thái slot tổng thể
      const anyEmployeeAvailable = slot.employeeAvailability.some((emp) => emp.isAvailable);
      slot.isAvailable = anyEmployeeAvailable;
    }

    // Lưu time slot với session
    await timeSlotDoc.save({ session });

    // Commit transaction
    await session.commitTransaction();

    // Gửi email xác nhận (không cần trong transaction)
    try {
      const displayDate = dateUtils.formatDate(appointmentDate);
      const employee = await UserModel.findById(assignedEmployeeId);

      await emailService.sendAppointmentConfirmation(userEmail, {
        date: displayDate,
        time: startTime,
        serviceName: service.name,
        petName: pet.name,
        employeeName: employee ? employee.fullName : "Nhân viên của chúng tôi",
      });
    } catch (emailError) {
      console.error("Không thể gửi email xác nhận:", emailError);
      // Email lỗi không ảnh hưởng đến việc tạo appointment
    }

    return {
      appointment: createdAppointment,
      message: "Đặt lịch hẹn thành công! Email xác nhận đã được gửi.",
    };

  } catch (error) {
    // Rollback transaction nếu có lỗi
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
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

  // FIX: Sử dụng transaction để đảm bảo consistency
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Cập nhật trạng thái appointment
    appointment.status = AppointmentStatus.CANCELLED;
    const updatedAppointment = await appointment.save({ session });

    // FIX: Mở khóa slot và trạng thái nhân viên
    const appointmentStartDay = dateUtils.getStartOfDay(appointmentTime);
    const appointmentEndDay = dateUtils.getEndOfDay(appointmentTime);
    const employeeId = appointment?.employeeId?.toString();

    const timeSlot = await TimeSlotModel.findOne({
      date: {
        $gte: appointmentStartDay,
        $lt: appointmentEndDay,
      },
    }).session(session);

    if (timeSlot && employeeId) {
      // FIX: Tìm và cập nhật tất cả slots liên quan đến appointment này
      let slotsUpdated = 0;
      
      for (let i = 0; i < timeSlot.slots.length; i++) {
        const slot = timeSlot.slots[i];
        
        // FIX: Kiểm tra cả appointmentId của slot chính và của employee
        const isSlotForThisAppointment = 
          slot.appointmentId?.toString() === (appointment._id as mongoose.Types.ObjectId).toString();
        
        const empIndex = slot.employeeAvailability.findIndex(
          (emp) =>
            emp.employeeId.toString() === employeeId &&
            emp.appointmentId?.toString() === (appointment._id as mongoose.Types.ObjectId).toString()
        );

        // Nếu slot này thuộc về appointment đang hủy
        if (isSlotForThisAppointment || empIndex !== -1) {
          // FIX: Xóa appointmentId khỏi slot chính
          if (isSlotForThisAppointment) {
            timeSlot.slots[i].appointmentId = undefined;
          }

          // Cập nhật trạng thái nhân viên
          if (empIndex !== -1) {
            timeSlot.slots[i].employeeAvailability[empIndex].isAvailable = true;
            timeSlot.slots[i].employeeAvailability[empIndex].appointmentId = undefined;
          }

          // FIX: Cập nhật trạng thái slot - slot khả dụng nếu có ít nhất một nhân viên khả dụng
          const hasAvailableEmployee = timeSlot.slots[i].employeeAvailability.some(
            (emp) => emp.isAvailable
          );
          timeSlot.slots[i].isAvailable = hasAvailableEmployee;
          
          slotsUpdated++;
        }
      }

      // Lưu time slot với session
      await timeSlot.save({ session });
      
      console.log(`Đã cập nhật ${slotsUpdated} slots cho appointment ${appointmentId}`);
    } else {
      console.warn(`Không tìm thấy time slot hoặc employeeId cho appointment ${appointmentId}`);
    }

    // Commit transaction
    await session.commitTransaction();

    // FIX: Gửi email hủy (bên ngoài transaction)
    try {
      const [customer, pet] = await Promise.all([
        UserModel.findById(appointment.customerId),
        PetModel.findById(appointment.petId)
      ]);

      if (customer && pet) {
        const displayDate = dateUtils.formatDate(appointment.scheduledDate);
        
        await emailService.sendEmail({
          to: customer.email,
          subject: "Cuộc hẹn của bạn đã bị hủy",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #dc3545;">Cuộc hẹn đã bị hủy</h1>
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
                <p><strong>Thông tin cuộc hẹn đã hủy:</strong></p>
                <ul>
                  <li><strong>Thú cưng:</strong> ${pet.name}</li>
                  <li><strong>Ngày:</strong> ${displayDate}</li>
                  <li><strong>Thời gian:</strong> ${appointment.scheduledTimeSlot.start} - ${appointment.scheduledTimeSlot.end}</li>
                  <li><strong>Thời gian hủy:</strong> ${dateUtils.formatDate(new Date())}</li>
                </ul>
              </div>
              <p>Nếu bạn muốn đặt lại lịch hẹn, vui lòng truy cập trang web của chúng tôi hoặc liên hệ với chúng tôi.</p>
              <p style="color: #6c757d; font-size: 0.9em;">
                Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi!
              </p>
            </div>
          `,
        });
        
        console.log(`Đã gửi email hủy appointment cho ${customer.email}`);
      }
    } catch (emailError) {
      console.error("Không thể gửi email hủy:", emailError);
      // Email lỗi không ảnh hưởng đến việc hủy appointment
    }

    return {
      appointment: updatedAppointment,
      message: "Hủy cuộc hẹn thành công",
      slotsReleased: timeSlot ? "Đã mở khóa các time slots" : "Không tìm thấy time slots để mở khóa"
    };

  } catch (error) {
    // Rollback transaction nếu có lỗi
    await session.abortTransaction();
    console.error("Lỗi khi hủy appointment:", error);
    throw error;
  } finally {
    await session.endSession();
  }
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

// Hàm khởi tạo time slots với tất cả nhân viên
// Hàm khởi tạo time slots với tất cả nhân viên
const initializeTimeSlotWithEmployees = async (date: Date, employees: UserDocument[]) => {
  // Tạo slots cơ bản từ 8:00 đến 18:00 (mỗi slot 30 phút)
  const baseSlots: Slot[] = [];
  
  for (let hour = 8; hour < 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const endTime = minute === 30 
        ? `${(hour + 1).toString().padStart(2, '0')}:00`
        : `${hour.toString().padStart(2, '0')}:30`;
      
      // Tạo employeeAvailability cho tất cả nhân viên
      const employeeAvailability: EmployeeAvailability[] = employees.map(employee => ({
        employeeId: employee._id as mongoose.Types.ObjectId,
        isAvailable: true
      }));
      
      baseSlots.push({
        startTime,
        endTime,
        isAvailable: true,
        employeeAvailability
      });
    }
  }
  
  // Tạo và lưu time slot document
  const timeSlotDoc = new TimeSlotModel({
    date,
    slots: baseSlots
  });
  
  return await timeSlotDoc.save();
};

export const getAvailableTimeSlotsService = async (query: {
  date: string;
  serviceId?: string;
  serviceType?: ServiceType;
  petId?: string;
  employeeId?: string;
}) => {
  if (!query.date) {
    throw new BadRequestException("Ngày là bắt buộc");
  }

  const selectedDate = dateUtils.parseDate(query.date);
  const selectedStartDay = dateUtils.getStartOfDay(selectedDate);
  const selectedEndDay = dateUtils.getEndOfDay(selectedDate);

  if (dateUtils.isPastDate(selectedDate)) {
    throw new BadRequestException("Không thể đặt lịch hẹn cho các ngày trong quá khứ");
  }

  let employeeWorkHours: TimeRange[] = [];
  let service;
  let duration = 60;
  let requiredSpecialties: SpecialtyType[] = [];

  // Lấy thông tin dịch vụ
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

  // Kiểm tra lịch làm việc của nhân viên nếu có chỉ định
  if (query.employeeId) {
    const employeeSchedule = await EmployeeScheduleModel.findOne({
      employeeId: query.employeeId,
      date: {
        $gte: selectedStartDay,
        $lt: selectedEndDay, 
      }
    });

    if (employeeSchedule) {
      if (!employeeSchedule.isWorking) {
        const response: TimeSlotResponse = {
          date: selectedDate,
          slots: [],
          employeeNotWorking: true
        };
        return { timeSlot: response };
      }
      employeeWorkHours = employeeSchedule.workHours;
    } else {
      // Kiểm tra lịch mặc định
      const employee = await UserModel.findById(query.employeeId);
      if (employee?.employeeInfo?.schedule) {
        const dayOfWeek = selectedDate
          .toLocaleDateString("en-US", { weekday: "long" })
          .toLowerCase();
        
        if (!employee.employeeInfo.schedule.workDays.includes(dayOfWeek)) {
          const response: TimeSlotResponse = {
            date: selectedDate,
            slots: [],
            employeeNotWorking: true
          };
          return { timeSlot: response };
        }
        
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

  // Tìm time slot document
  let timeSlotDoc = await TimeSlotModel.findOne({
    date: {
      $gte: selectedStartDay,
      $lt: selectedEndDay,
    },
  });

  // FIX: Nếu không có time slot, tạo mới với TẤT CẢ nhân viên phù hợp
  if (!timeSlotDoc) {
    let employees;
    
    if (query.employeeId) {
      // Nếu chọn nhân viên cụ thể
      employees = await UserModel.find({
        _id: query.employeeId,
        role: { $in: [Roles.EMPLOYEE, Roles.ADMIN] },
        status: StatusUser.ACTIVE,
        $or: [
          { "employeeInfo.specialties": { $in: requiredSpecialties } },
          { "employeeInfo.specialties": { $exists: true, $ne: [] } }
        ]
      });
    } else {
      // FIX: Lấy TẤT CẢ nhân viên có chuyên môn phù hợp
      const specialtyFilter = requiredSpecialties.length > 0 
        ? { "employeeInfo.specialties": { $in: requiredSpecialties } }
        : { "employeeInfo.specialties": { $exists: true, $ne: [] } };

      employees = await UserModel.find({
        role: { $in: [Roles.EMPLOYEE, Roles.ADMIN] },
        status: StatusUser.ACTIVE,
        ...specialtyFilter
      });
    }

    if (employees.length === 0) {
      throw new BadRequestException(
        query.employeeId 
          ? "Nhân viên này không khả dụng hoặc không có chuyên môn phù hợp"
          : "Không có nhân viên khả dụng"
      );
    }

    // FIX: Khởi tạo time slot với TẤT CẢ nhân viên
    timeSlotDoc = await initializeTimeSlotWithEmployees(selectedDate, employees);
  } else {
    // FIX: Kiểm tra và bổ sung nhân viên thiếu vào slots hiện có
    const allQualifiedEmployees = await UserModel.find({
      role: { $in: [Roles.EMPLOYEE, Roles.ADMIN] },
      status: StatusUser.ACTIVE,
      $or: [
        { "employeeInfo.specialties": { $in: requiredSpecialties } },
        { "employeeInfo.specialties": { $exists: true, $ne: [] } }
      ]
    });

    // Cập nhật slots để đảm bảo tất cả nhân viên phù hợp đều có mặt
    let hasUpdated = false;
    
    timeSlotDoc.slots.forEach(slot => {
      allQualifiedEmployees.forEach(employee => {
        const employeeExists = slot.employeeAvailability.some(
          emp => emp.employeeId.toString() === (employee._id as mongoose.Types.ObjectId).toString()
        );
        
        if (!employeeExists) {
          slot.employeeAvailability.push({
            employeeId: employee._id as mongoose.Types.ObjectId,
            isAvailable: true
          });
          hasUpdated = true;
        }
      });
    });

    // Lưu lại nếu có cập nhật
    if (hasUpdated) {
      await timeSlotDoc.save();
    }
  }

  let slots = timeSlotDoc.slots;
  const allOriginalSlots = [...slots];

  // Hàm kiểm tra slot trong giờ làm việc
  const isInWorkHours = (slot: Slot): boolean => {
    if (!query.employeeId || employeeWorkHours.length === 0) {
      return true;
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
      
      const isAfterWorkStart = 
        slotStartHour > workStartHour || 
        (slotStartHour === workStartHour && slotStartMinute >= workStartMinute);
      
      const isBeforeWorkEnd = 
        slotEndHour < workEndHour || 
        (slotEndHour === workEndHour && slotEndMinute <= workEndMinute);
      
      return isAfterWorkStart && isBeforeWorkEnd;
    });
  };

  // Lọc slots theo giờ làm việc của nhân viên
  if (query.employeeId && employeeWorkHours.length > 0) {
    allOriginalSlots.forEach(slot => {
      if (!isInWorkHours(slot)) {
        slot.isAvailable = false;
        
        const employeeIndex = slot.employeeAvailability.findIndex(
          emp => emp.employeeId.toString() === query.employeeId
        );
        
        if (employeeIndex >= 0) {
          slot.employeeAvailability[employeeIndex].isAvailable = false;
        }
      }
    });
    
    slots = slots.filter(slot => isInWorkHours(slot));
  }

  // Nếu không cần kiểm tra thời lượng dịch vụ
  if (!query.serviceId || !query.serviceType) {
    if (query.employeeId) {
      allOriginalSlots.forEach(slot => {
        const employeeAvailable = slot.employeeAvailability.some(
          (emp) => emp.employeeId.toString() === query.employeeId && emp.isAvailable
        );
        slot.isAvailable = slot.isAvailable && employeeAvailable;
      });

      const timeSlotResponse: TimeSlotResponse = {
        date: selectedDate,
        slots: allOriginalSlots,
        employeeWorkHours: employeeWorkHours,
      };

      return { timeSlot: timeSlotResponse };
    }

    const timeSlotResponse: TimeSlotResponse = {
      date: selectedDate,
      slots: allOriginalSlots,
    };

    return { timeSlot: timeSlotResponse };
  }

  // Xử lý logic cho dịch vụ có thời lượng cụ thể
  const requiredSlotCount = Math.ceil(duration / 30);
  const availableSlots: Slot[] = [];
  const slotsLength = slots.length;

  for (let i = 0; i <= slotsLength - requiredSlotCount; i++) {
    let consecutiveSlots: Slot[] = [];
    let availableEmployeeIds: string[] = [];

    // FIX: Lấy tất cả nhân viên phù hợp thay vì chỉ một nhóm cố định
    const employeesToCheck = query.employeeId 
      ? [query.employeeId] 
      : await UserModel.find({
          role: { $in: [Roles.EMPLOYEE, Roles.ADMIN] },
          status: StatusUser.ACTIVE,
          $or: [
            { "employeeInfo.specialties": { $in: requiredSpecialties } },
            { "employeeInfo.specialties": { $exists: true, $ne: [] } }
          ]
        }).then(employees => employees.map((emp) => (emp._id as mongoose.Types.ObjectId).toString()));

    // Tìm nhân viên có thể phục vụ tất cả slots liên tiếp
    for (const employeeId of employeesToCheck) {
      let canServeAllSlots = true;
      let currentConsecutiveSlots: Slot[] = [];

      for (let j = 0; j < requiredSlotCount; j++) {
        const currentSlot = slots[i + j];
        
        if (!currentSlot || !currentSlot.isAvailable) {
          canServeAllSlots = false;
          break;
        }

        if (j > 0) {
          const previousSlot = slots[i + j - 1];
          if (previousSlot.endTime !== currentSlot.startTime) {
            canServeAllSlots = false;
            break;
          }
        }

        const employeeAvailability = currentSlot.employeeAvailability?.find(
          (emp) => emp.employeeId.toString() === employeeId
        );

        if (!employeeAvailability || !employeeAvailability.isAvailable) {
          canServeAllSlots = false;
          break;
        }

        currentConsecutiveSlots.push(currentSlot);
      }

      if (canServeAllSlots && currentConsecutiveSlots.length === requiredSlotCount) {
        availableEmployeeIds.push(employeeId);
        
        if (consecutiveSlots.length === 0) {
          consecutiveSlots = [...currentConsecutiveSlots];
        }
      }
    }

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
        originalSlotIndexes: Array.from(
          { length: requiredSlotCount },
          (_, idx) => i + idx
        ),
      });
    }
  }
  
  // Tạo slots không khả dụng
  const unavailableSlots: Slot[] = [];
  
  for (let i = 0; i <= allOriginalSlots.length - requiredSlotCount; i++) {
    const isAlreadyAvailable = availableSlots.some(slot => {
      return slot.startTime === allOriginalSlots[i].startTime;
    });
    
    if (!isAlreadyAvailable) {
      let isConsecutive = true;
      let allInWorkHours = true;
      const slotsToCheck: Slot[] = [];
      
      for (let j = 0; j < requiredSlotCount; j++) {
        if (i + j < allOriginalSlots.length) {
          slotsToCheck.push(allOriginalSlots[i + j]);
          
          if (query.employeeId && employeeWorkHours.length > 0 && !isInWorkHours(allOriginalSlots[i + j])) {
            allInWorkHours = false;
            break;
          }
          
          if (j > 0 && allOriginalSlots[i + j - 1].endTime !== allOriginalSlots[i + j].startTime) {
            isConsecutive = false;
            break;
          }
        } else {
          isConsecutive = false;
          break;
        }
      }
      
      if (isConsecutive && allInWorkHours && slotsToCheck.length === requiredSlotCount) {
        const firstSlot = slotsToCheck[0];
        const lastSlot = slotsToCheck[slotsToCheck.length - 1];
        
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
  
  const allCombinedSlots = [...availableSlots, ...unavailableSlots];
  
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

  const timeSlotResponse: TimeSlotResponse = {
    date: selectedDate,
    slots: allCombinedSlots,
    noAvailableSlots: availableSlots.length === 0,
    employeeWorkHours: employeeWorkHours
  };

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
