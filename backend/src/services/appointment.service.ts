import mongoose, { Types } from "mongoose";
import AppointmentModel, { AppointmentStatus, PaymentStatus, ServiceType } from "../models/appointment.model";
import TimeSlotModel from "../models/time-slot.model";
import PetModel from "../models/pet.model";
import ServiceModel from "../models/service.model";
import ServicePackageModel from "../models/service-package.model";
import EmployeeModel from "../models/user.model";
import UserModel from "../models/user.model";
import { BadRequestException, NotFoundException, ForbiddenException } from "../utils/app-error";
import emailService from "../utils/send-email";
import { StatusUser } from "../enums/status-user.enum";

// Lấy tất cả các cuộc hẹn của người dùng đã đăng nhập
export const getUserAppointmentsService = async (userId: string) => {
  const appointments = await AppointmentModel.find({ customerId: userId })
    .populate("petId", "name species breed profilePicture")
    .populate({
      path: "employeeId",
      populate: {
        path: "userId",
        select: "fullName profilePicture"
      }
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
    .populate("petId", "name species breed profilePicture")
    .populate({
      path: "employeeId",
      populate: {
        path: "userId",
        select: "fullName profilePicture"
      }
    })
    .populate({
      path: "serviceId",
      select: "name description price duration"
    });

  if (!appointment) {
    throw new NotFoundException("Không tìm thấy cuộc hẹn");
  }

  // Kiểm tra quyền truy cập
  if (
    appointment.customerId.toString() !== userId &&
    userRole !== "admin" &&
    userRole !== "employee"
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
    };
    notes?: string;
  },
  userId: string,
  userEmail: string
) => {
  // Kiểm tra thú cưng thuộc về người dùng
  const pet = await PetModel.findById(data.petId);
  if (!pet || pet.ownerId.toString() !== userId) {
    throw new BadRequestException("Thú cưng không hợp lệ");
  }

  // Kiểm tra dịch vụ tồn tại và đang hoạt động
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
    service = await ServicePackageModel.findById(data.serviceId).populate("services");
    if (!service || !service.isActive) {
      throw new BadRequestException("Gói dịch vụ không khả dụng");
    }
    duration = service.duration;
    totalAmount = service.discountedPrice || service.totalPrice;
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
  const appointmentDate = new Date(data.scheduledDate);
  const startTime = data.scheduledTimeSlot.start;
  const endTime = data.scheduledTimeSlot.end;

  // Kiểm tra khung giờ có sẵn
  const timeSlotDoc = await TimeSlotModel.findOne({
    date: {
      $gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
      $lt: new Date(appointmentDate.setHours(23, 59, 59, 999))
    }
  });

  if (!timeSlotDoc) {
    throw new BadRequestException("Không có khung giờ khả dụng cho ngày này");
  }

  // Tìm khung giờ cụ thể
  const slotIndex = timeSlotDoc.slots.findIndex(
    (slot) => slot.startTime === startTime && slot.endTime === endTime && slot.isAvailable
  );

  if (slotIndex === -1) {
    throw new BadRequestException("Khung giờ này không khả dụng");
  }

  // Tìm nhân viên có sẵn với chuyên môn phù hợp
  // const employees = await EmployeeModel.find({
  //   status: StatusUser.ACTIVE,
  //   "employeeInfo.specialties": 
  //     data.serviceType === ServiceType.SINGLE 
  //       // ? service.category as ServiceType.SINGLE 
  //       ? ServiceType.SINGLE
  //       : { $exists: true }
  // });
  const employees = await EmployeeModel.find({
  status: StatusUser.ACTIVE,
  "employeeInfo.specialties": 
    data.serviceType === ServiceType.SINGLE 
      ? specialties[0]
      : { $in: specialties }
});

  if (employees.length === 0) {
    throw new BadRequestException("Không có nhân viên khả dụng cho dịch vụ này");
  }

  // Tìm nhân viên không có cuộc hẹn vào thời điểm này
  let assignedEmployeeId: mongoose.Types.ObjectId | null = null;

  for (const employee of employees) {
    const conflictingAppointment = await AppointmentModel.findOne({
      employeeId: employee._id,
      scheduledDate: {
        $gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
        $lt: new Date(appointmentDate.setHours(23, 59, 59, 999))
      },
      "scheduledTimeSlot.start": startTime,
      status: { $nin: [AppointmentStatus.CANCELLED] }
    });

    if (!conflictingAppointment) {
      assignedEmployeeId = employee._id as mongoose.Types.ObjectId;
      break;
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
      end: endTime
    },
    notes: data.notes,
    status: AppointmentStatus.PENDING,
    paymentStatus: PaymentStatus.PENDING,
    totalAmount
  });

  // Cập nhật khung giờ để đánh dấu là đã đặt
  timeSlotDoc.slots[slotIndex].isAvailable = false;
  timeSlotDoc.slots[slotIndex].appointmentId = appointment._id as mongoose.Types.ObjectId;
  timeSlotDoc.slots[slotIndex].employeeId = assignedEmployeeId;
  await timeSlotDoc.save();

  // Gửi email xác nhận
  try {
    await emailService.sendAppointmentConfirmation(userEmail, {
      date: appointmentDate.toLocaleDateString(),
      time: startTime,
      serviceName: service.name,
      petName: pet.name
    });
  } catch (emailError) {
    console.error("Không thể gửi email xác nhận:", emailError);
    // Không chặn tiến trình nếu gửi email thất bại
  }

  return {
    appointment,
    message: "Đặt lịch hẹn thành công! Email xác nhận đã được gửi."
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
  if (userRole !== "admin" && userRole !== "employee") {
    throw new ForbiddenException("Bạn không có quyền cập nhật trạng thái cuộc hẹn");
  }

  // Xác thực chuyển đổi trạng thái
  const validStatusTransitions: Record<string, string[]> = {
    [AppointmentStatus.PENDING]: [AppointmentStatus.CONFIRMED, AppointmentStatus.CANCELLED],
    [AppointmentStatus.CONFIRMED]: [AppointmentStatus.IN_PROGRESS, AppointmentStatus.CANCELLED],
    [AppointmentStatus.IN_PROGRESS]: [AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED],
    [AppointmentStatus.COMPLETED]: [],
    [AppointmentStatus.CANCELLED]: []
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
        await emailService.sendEmail({
          to: customer.email,
          subject: "Cuộc hẹn của bạn đã được xác nhận",
          html: `
            <h1>Cuộc hẹn đã được xác nhận</h1>
            <p>Cuộc hẹn của bạn cho ${pet.name} vào ngày ${appointment.scheduledDate.toLocaleDateString()} 
            lúc ${appointment.scheduledTimeSlot.start} đã được xác nhận.</p>
            <p>Vui lòng đến trước thời gian hẹn 10 phút.</p>
          `
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

  // Kiểm tra đây có phải là cuộc hẹn của người dùng không
  if (
    appointment.customerId.toString() !== userId &&
    userRole !== "admin"
  ) {
    throw new ForbiddenException("Bạn không có quyền hủy cuộc hẹn này");
  }

  // Kiểm tra xem cuộc hẹn có thể hủy không
  if ([AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED].includes(appointment.status)) {
    throw new BadRequestException(
      `Không thể hủy cuộc hẹn với trạng thái ${appointment.status}`
    );
  }

  // Kiểm tra nếu cuộc hẹn trong vòng 24 giờ và người dùng không phải là admin
  const now = new Date();
  const appointmentTime = new Date(appointment.scheduledDate);
  const hoursDifference = (appointmentTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursDifference < 24 && userRole !== "admin") {
    throw new BadRequestException(
      "Cuộc hẹn chỉ có thể hủy ít nhất 24 giờ trước"
    );
  }

  // Cập nhật trạng thái cuộc hẹn
  appointment.status = AppointmentStatus.CANCELLED;
  const updatedAppointment = await appointment.save();

  // Mở khóa khung giờ
  const timeSlot = await TimeSlotModel.findOne({
    date: {
      $gte: new Date(appointmentTime.setHours(0, 0, 0, 0)),
      $lt: new Date(appointmentTime.setHours(23, 59, 59, 999))
    },
    "slots.appointmentId": appointment._id
  });

  if (timeSlot) {
    const slotIndex = timeSlot.slots.findIndex(
      (slot) => slot.appointmentId?.toString() === appointment._id
    );

    if (slotIndex !== -1) {
      timeSlot.slots[slotIndex].isAvailable = true;
      timeSlot.slots[slotIndex].appointmentId = undefined;
      timeSlot.slots[slotIndex].employeeId = undefined;
      await timeSlot.save();
    }
  }

  // Gửi email hủy
  const customer = await UserModel.findById(appointment.customerId);
  const pet = await PetModel.findById(appointment.petId);

  if (customer && pet) {
    try {
      await emailService.sendEmail({
        to: customer.email,
        subject: "Cuộc hẹn của bạn đã bị hủy",
        html: `
          <h1>Cuộc hẹn đã bị hủy</h1>
          <p>Cuộc hẹn của bạn cho ${pet.name} vào ngày ${appointment.scheduledDate.toLocaleDateString()} 
          lúc ${appointment.scheduledTimeSlot.start} đã bị hủy.</p>
          <p>Nếu bạn muốn đặt lại lịch, vui lòng truy cập trang web của chúng tôi hoặc liên hệ với chúng tôi.</p>
        `
      });
    } catch (emailError) {
      console.error("Không thể gửi email hủy:", emailError);
    }
  }

  return {
    appointment: updatedAppointment,
    message: "Hủy cuộc hẹn thành công"
  };
};

// Lấy các khung giờ có sẵn cho một ngày cụ thể
export const getAvailableTimeSlotsService = async (query: {
  date: string;
  serviceId?: string;
  serviceType?: ServiceType;
}) => {
  if (!query.date) {
    throw new BadRequestException("Ngày là bắt buộc");
  }

  const selectedDate = new Date(query.date);

  // Kiểm tra xem ngày đã qua chưa
  if (selectedDate < new Date()) {
    throw new BadRequestException("Không thể đặt lịch hẹn cho các ngày trong quá khứ");
  }

  // Tìm hoặc tạo khung giờ cho ngày
  let timeSlot = await TimeSlotModel.findOne({
    date: {
      $gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
      $lt: new Date(selectedDate.setHours(23, 59, 59, 999))
    }
  });

  // Nếu không có khung giờ nào tồn tại cho ngày này, tạo chúng
  if (!timeSlot) {
    // Tạo khung giờ tiêu chuẩn từ 9 giờ sáng đến 5 giờ chiều với các khoảng thời gian 1 giờ
    const slots = [];
    const openingHour = 9;
    const closingHour = 17;

    for (let hour = openingHour; hour < closingHour; hour++) {
      slots.push({
        startTime: `${hour.toString().padStart(2, "0")}:00`,
        endTime: `${(hour + 1).toString().padStart(2, "0")}:00`,
        isAvailable: true
      });
    }

    timeSlot = await TimeSlotModel.create({
      date: selectedDate,
      slots
    });
  }

  // Nếu serviceId và serviceType được cung cấp, kiểm tra yêu cầu về thời lượng
  if (query.serviceId && query.serviceType) {
    let service;
    let duration = 60; // Thời lượng mặc định tính bằng phút

    if (query.serviceType === ServiceType.SINGLE) {
      service = await ServiceModel.findById(query.serviceId);
    } else if (query.serviceType === ServiceType.PACKAGE) {
      service = await ServicePackageModel.findById(query.serviceId);
    }

    if (service?.duration) {
      duration = service.duration;
    }

    // Lọc các khung giờ dựa trên thời lượng
    timeSlot.slots = timeSlot.slots.filter((slot) => {
      // Phân tích thời gian
      const [startHour, startMinute] = slot.startTime.split(":").map(Number);
      const [endHour, endMinute] = slot.endTime.split(":").map(Number);

      // Tính toán thời lượng khung giờ tính bằng phút
      const slotStartMinutes = startHour * 60 + startMinute;
      const slotEndMinutes = endHour * 60 + endMinute;
      const slotDuration = slotEndMinutes - slotStartMinutes;

      // Kiểm tra xem khung giờ có đủ dài cho dịch vụ không
      return slot.isAvailable && slotDuration >= duration;
    });
  }

  return { timeSlot };
};

// Lấy tất cả cuộc hẹn (cho quản trị viên)
export const getAllAppointmentsService = async (query: any) => {
  const { 
    status, 
    startDate, 
    endDate, 
    employeeId,
    customerId,
    petId 
  } = query;
  
  const filter: any = {};
  
  if (status) {
    filter.status = status;
  }
  
  if (startDate && endDate) {
    filter.scheduledDate = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  } else if (startDate) {
    filter.scheduledDate = { $gte: new Date(startDate) };
  } else if (endDate) {
    filter.scheduledDate = { $lte: new Date(endDate) };
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
      populate: {
        path: "userId",
        select: "fullName profilePicture"
      }
    })
    .populate("customerId", "fullName email phoneNumber")
    .populate({
      path: "serviceId",
      select: "name description price duration"
    })
    .sort({ scheduledDate: -1 });
  
  return { appointments };
};