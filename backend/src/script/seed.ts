import "dotenv/config";
import mongoose from "mongoose";
import AccountModel from "../models/account.model";
import UserModel from "../models/user.model";
import PetModel from "../models/pet.model";
import ServiceModel from "../models/service.model";
import { BookingModel } from "../models/booking.model";
import { PostModel } from "../models/post.model";
import { CommentModel } from "../models/comment.model";
import { ReactionModel } from "../models/reaction.model";
import EmployeeScheduleModel from "../models/employee-schedule.model";
import { ShiftTemplateModel } from "../models/shift-template.model";
import { Roles } from "../enums/role.enum";
import { SPECIALTIES } from "../enums/employee.enum";
import { addMonths, subMonths } from "date-fns";
import { Gender } from "../enums/status-user.enum";
import { ProviderEnum } from "../enums/account-provider.enum";
import { config } from "../config/app.config";

const MONGODB_URI = config.MONGO_URI;

// Mock Cloudinary URLs - Unsplash images cho pets và users
const MOCK_IMAGES = {
  users: {
    male: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      "https://images.unsplash.com/photo-1606577017430-20c1a74aa888?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGV0JTIwd2l0aCUyMHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
    ],
    female: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400",
    ],
  },
  pets: {
    dog: [
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400",
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400",
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400",
      "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400",
      "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=400",
    ],
    cat: [
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400",
      "https://images.unsplash.com/photo-1573865526739-10c1dd7aa0e1?w=400",
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400",
      "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=400",
      "https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=400",
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400",
    ],
  },
  services: {
    grooming: [
      "https://images.unsplash.com/photo-1558929996-da64ba858215?w=600",
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600",
    ],
    spa: [
      "https://images.unsplash.com/photo-1669910803409-a447456beaca?q=80&w=1886&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1608848461950-0fe51dfc41cb?w=600",
    ],
    healthcare: [
      "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=600",
      "https://images.unsplash.com/photo-1530041539828-114de669390e?w=600",
    ],
    training: [
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600",
      "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=600",
    ],
    boarding: [
      "https://images.unsplash.com/photo-1581888227599-779811939961?w=600",
      "https://images.unsplash.com/photo-1501820488136-72669149e0d4?w=600",
    ],
  },
  posts: [
    "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800",
    "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800",
    "https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=800",
    "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800",
    "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800",
  ],
};

// Helper function để tạo mock publicId
const generatePublicId = (type: string, id: string) => {
  return `petcare/${type}/${id}_${Date.now()}`;
};

const getRandomImage = (
  category: keyof typeof MOCK_IMAGES,
  subcategory?: string,
): string | null => {
  const cat = (MOCK_IMAGES as any)[category];

  if (
    subcategory &&
    cat &&
    cat[subcategory] &&
    Array.isArray(cat[subcategory])
  ) {
    const images: string[] = cat[subcategory];
    return images[Math.floor(Math.random() * images.length)];
  }

  if (Array.isArray(cat)) {
    const images: string[] = cat;
    return images[Math.floor(Math.random() * images.length)];
  }

  return null;
};

// Hàm tạo ngày giờ ngẫu nhiên
const randomDate = (start: Date, end: Date) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
};

const randomTime = () => {
  const hour = Math.floor(Math.random() * 12) + 8; // 8-19h
  const minute = Math.random() > 0.5 ? "00" : "30";
  return `${hour.toString().padStart(2, "0")}:${minute}`;
};

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✓ Đã kết nối MongoDB", MONGODB_URI);

    // Xóa dữ liệu cũ
    await Promise.all([
      UserModel.deleteMany({}),
      PetModel.deleteMany({}),
      ServiceModel.deleteMany({}),
      BookingModel.deleteMany({}),
      PostModel.deleteMany({}),
      CommentModel.deleteMany({}),
      ReactionModel.deleteMany({}),
      EmployeeScheduleModel.deleteMany({}),
      ShiftTemplateModel.deleteMany({}),
      AccountModel.deleteMany({}),
    ]);
    console.log("✓ Đã xóa dữ liệu cũ");

    // 1. TẠO USERS với ảnh đại diện
    const adminImageUrl = getRandomImage("users", "male");
    const adminUser = await UserModel.create({
      email: "admin@petcare.vn",
      password: "Admin@123456",
      fullName: "Nguyễn Văn Admin",
      phoneNumber: "0901234567",
      role: Roles.ADMIN,
      gender: Gender.MALE,
      dateOfBirth: new Date("1985-05-15"),
      emailVerified: true,
      profilePicture: {
        url: adminImageUrl,
        publicId: generatePublicId("users", "admin"),
      },
      address: {
        province: "Thành phố Hồ Chí Minh",
        ward: "Phường Bến Nghé, Quận 1",
      },
      employeeInfo: {
        specialties: ["GROOMING", "TRAINING", "HEALTHCARE"],
        certifications: [
          "Chứng chỉ Thú Y Quốc Tế",
          "Huấn luyện viên chuyên nghiệp",
        ],
        experience: "15 năm kinh nghiệm quản lý spa thú cưng",
        hourlyRate: 500000,
        hireDate: new Date("2010-01-01"),
        employeeId: "EMP001",
        department: "Quản lý",
      },
    });

    const employeesData = [
      {
        email: "bacsi.hai@petcare.vn",
        password: "Employee@123",
        fullName: "Trần Minh Hải",
        phoneNumber: "0912345678",
        role: Roles.EMPLOYEE,
        gender: Gender.MALE,
        dateOfBirth: new Date("1990-03-20"),
        emailVerified: true,
        profilePicture: {
          url: getRandomImage("users", "male"),
          publicId: generatePublicId("users", "emp002"),
        },
        address: {
          province: "Thành phố Hồ Chí Minh",
          ward: "Phường Tân Định, Quận 1",
        },
        employeeInfo: {
          specialties: ["HEALTHCARE", "GROOMING"],
          certifications: ["Bác sĩ Thú Y", "Chứng chỉ Spa & Grooming"],
          experience: "8 năm kinh nghiệm điều trị và chăm sóc",
          hourlyRate: 350000,
          hireDate: new Date("2016-06-15"),
          employeeId: "EMP002",
          department: "Thú Y",
        },
      },
      {
        email: "huanluyenvien.linh@petcare.vn",
        password: "Employee@123",
        fullName: "Lê Thu Linh",
        phoneNumber: "0923456789",
        role: Roles.EMPLOYEE,
        gender: Gender.FEMALE,
        dateOfBirth: new Date("1992-08-12"),
        emailVerified: true,
        profilePicture: {
          url: getRandomImage("users", "female"),
          publicId: generatePublicId("users", "emp003"),
        },
        address: {
          province: "Thành phố Hồ Chí Minh",
          ward: "Phường Đa Kao, Quận 1",
        },
        employeeInfo: {
          specialties: ["TRAINING", "BOARDING"],
          certifications: [
            "Huấn luyện viên chó mèo chuyên nghiệp",
            "Chứng chỉ hành vi động vật",
          ],
          experience: "6 năm huấn luyện và chăm sóc",
          hourlyRate: 300000,
          hireDate: new Date("2018-03-01"),
          employeeId: "EMP003",
          department: "Huấn luyện",
        },
      },
      {
        email: "spa.anh@petcare.vn",
        password: "Employee@123",
        fullName: "Phạm Tuấn Anh",
        phoneNumber: "0934567890",
        role: Roles.EMPLOYEE,
        gender: Gender.MALE,
        dateOfBirth: new Date("1995-11-25"),
        emailVerified: true,
        profilePicture: {
          url: getRandomImage("users", "male"),
          publicId: generatePublicId("users", "emp004"),
        },
        address: {
          province: "Thành phố Hồ Chí Minh",
          ward: "Phường Nguyễn Thái Bình, Quận 1",
        },
        employeeInfo: {
          specialties: ["GROOMING", "SPA"],
          certifications: [
            "Chứng chỉ Grooming chuyên nghiệp",
            "Kỹ thuật tạo kiểu cao cấp",
          ],
          experience: "5 năm kinh nghiệm spa và grooming",
          hourlyRate: 250000,
          hireDate: new Date("2019-09-15"),
          employeeId: "EMP004",
          department: "Spa & Grooming",
        },
      },
    ];

    const employees = await UserModel.create(employeesData);

    const customersData = [
      {
        email: "nguyenvana@gmail.com",
        password: "Customer@123",
        fullName: "Nguyễn Văn A",
        phoneNumber: "0945678901",
        role: Roles.CUSTOMER,
        gender: Gender.MALE,
        dateOfBirth: new Date("1988-07-10"),
        emailVerified: true,
        profilePicture: {
          url: getRandomImage("users", "male"),
          publicId: generatePublicId("users", "cust001"),
        },
        address: {
          province: "Thành phố Hồ Chí Minh",
          ward: "Phường 6, Quận 3",
        },
      },
      {
        email: "tranthib@gmail.com",
        password: "Customer@123",
        fullName: "Trần Thị B",
        phoneNumber: "0956789012",
        role: Roles.CUSTOMER,
        gender: Gender.FEMALE,
        dateOfBirth: new Date("1993-12-05"),
        emailVerified: true,
        profilePicture: {
          url: getRandomImage("users", "female"),
          publicId: generatePublicId("users", "cust002"),
        },
        address: {
          province: "Thành phố Hồ Chí Minh",
          ward: "Phường 8, Quận Phú Nhuận",
        },
      },
      {
        email: "levanc@gmail.com",
        password: "Customer@123",
        fullName: "Lê Văn C",
        phoneNumber: "0967890123",
        role: Roles.CUSTOMER,
        gender: Gender.MALE,
        dateOfBirth: new Date("1990-04-18"),
        emailVerified: true,
        profilePicture: {
          url: getRandomImage("users", "male"),
          publicId: generatePublicId("users", "cust003"),
        },
        address: {
          province: "Thành phố Hồ Chí Minh",
          ward: "Phường 12, Quận 10",
        },
      },
      {
        email: "phamthid@gmail.com",
        password: "Customer@123",
        fullName: "Phạm Thị D",
        phoneNumber: "0978901234",
        role: Roles.CUSTOMER,
        gender: Gender.FEMALE,
        dateOfBirth: new Date("1995-09-22"),
        emailVerified: true,
        profilePicture: {
          url: getRandomImage("users", "female"),
          publicId: generatePublicId("users", "cust004"),
        },
        address: {
          province: "Thành phố Hồ Chí Minh",
          ward: "Phường 15, Quận Tân Bình",
        },
      },
      {
        email: "hoangvane@gmail.com",
        password: "Customer@123",
        fullName: "Hoàng Văn E",
        phoneNumber: "0989012345",
        role: Roles.CUSTOMER,
        gender: Gender.MALE,
        dateOfBirth: new Date("1987-02-28"),
        emailVerified: true,
        profilePicture: {
          url: getRandomImage("users", "male"),
          publicId: generatePublicId("users", "cust005"),
        },
        address: {
          province: "Thành phố Hồ Chí Minh",
          ward: "Phường Bình An, Quận 2",
        },
      },
    ];

    const customers = await UserModel.create(customersData);

    console.log("✓ Đã tạo Users với ảnh đại diện:", {
      admin: 1,
      employees: employees.length,
      customers: customers.length,
    });

    // Tạo Accounts cho tất cả users
    const accounts = [];

    const adminAccount = await AccountModel.create({
      userId: adminUser._id,
      provider: ProviderEnum.EMAIL,
      providerId: adminUser.email,
      tokenExpiry: null,
    });
    accounts.push(adminAccount);

    for (const employee of employees) {
      const account = await AccountModel.create({
        userId: employee._id,
        provider: ProviderEnum.EMAIL,
        providerId: employee.email,
        tokenExpiry: null,
      });
      accounts.push(account);
    }

    for (let i = 0; i < customers.length; i++) {
      const customer = customers[i];
      const account = await AccountModel.create({
        userId: customer._id,
        provider: ProviderEnum.EMAIL,
        providerId: customer.email,
        refreshToken: null,
        tokenExpiry: null,
      });
      accounts.push(account);
    }

    console.log("✓ Đã tạo Accounts:", accounts.length);

    // 2. TẠO PETS với ảnh
    const dogBreeds = [
      "Golden Retriever",
      "Corgi",
      "Poodle",
      "Husky",
      "Pug",
      "Shiba Inu",
      "Alaska",
      "Chihuahua",
    ];
    const catBreeds = [
      "Ba Tư",
      "Anh Lông Ngắn",
      "Mèo Mướp",
      "Scottish Fold",
      "Ragdoll",
      "Maine Coon",
    ];
    const colors = [
      "Vàng",
      "Trắng",
      "Đen",
      "Nâu",
      "Xám",
      "Trắng đen",
      "Tam thể",
      "Vàng nâu",
    ];

    const pets = [];
    let petCounter = 0;
    for (let i = 0; i < customers.length; i++) {
      const customer = customers[i];
      const petCount = Math.floor(Math.random() * 2) + 1;

      for (let j = 0; j < petCount; j++) {
        petCounter++;
        const isPet = Math.random() > 0.5;
        const type = isPet ? "dog" : "cat";
        const breeds = type === "dog" ? dogBreeds : catBreeds;
        const breed = breeds[Math.floor(Math.random() * breeds.length)];

        const petNames =
          type === "dog"
            ? [
                "Lulu",
                "Max",
                "Buddy",
                "Lucky",
                "Cooper",
                "Milo",
                "Rocky",
                "Bear",
              ]
            : ["Miu", "Kitty", "Luna", "Simba", "Leo", "Tom", "Bella", "Chloe"];

        const petImageUrl = getRandomImage("pets", type);
        const pet = await PetModel.create({
          ownerId: customer._id,
          name: petNames[Math.floor(Math.random() * petNames.length)],
          type,
          breed,
          gender: Math.random() > 0.5 ? "male" : "female",
          dateOfBirth: randomDate(
            new Date("2020-01-01"),
            new Date("2023-12-31"),
          ),
          weight:
            type === "dog" ? Math.random() * 30 + 5 : Math.random() * 5 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          isNeutered: Math.random() > 0.5,
          allergies:
            Math.random() > 0.7 ? ["Một số loại thức ăn", "Phấn hoa"] : [],
          medicalNotes: "Sức khỏe tốt, không có vấn đề đặc biệt",
          image: {
            url: petImageUrl,
            publicId: generatePublicId("pets", `pet${petCounter}`),
          },
          vaccinations: [
            {
              name: "Vacxin 5 bệnh",
              date: new Date("2023-06-15"),
              nextDueDate: new Date("2024-06-15"),
              veterinarianName: "BS. Trần Minh Hải",
              clinicName: "PetCare Spa",
            },
            {
              name: "Vacxin Dại",
              date: new Date("2023-08-20"),
              nextDueDate: new Date("2024-08-20"),
              veterinarianName: "BS. Trần Minh Hải",
              clinicName: "PetCare Spa",
            },
          ],
        });
        pets.push(pet);
      }
    }

    console.log("✓ Đã tạo Pets với ảnh:", pets.length);

    // 3. TẠO SERVICES với ảnh
    const servicesData = [
      // GROOMING
      {
        name: "Tắm cơ bản cho chó nhỏ",
        description: "Tắm, sấy khô, vệ sinh tai, cắt móng cho chó dưới 10kg",
        price: 150000,
        duration: 60,
        category: "GROOMING",
        requiredSpecialties: ["GROOMING"],
        images: [
          {
            url: getRandomImage("services", "grooming"),
            publicId: generatePublicId("services", "grooming1"),
          },
        ],
        isActive: true,
      },
      {
        name: "Tắm cơ bản cho chó lớn",
        description: "Tắm, sấy khô, vệ sinh tai, cắt móng cho chó trên 10kg",
        price: 250000,
        duration: 90,
        category: "GROOMING",
        requiredSpecialties: ["GROOMING"],
        images: [
          {
            url: getRandomImage("services", "grooming"),
            publicId: generatePublicId("services", "grooming2"),
          },
        ],
        isActive: true,
      },
      {
        name: "Tắm cơ bản cho mèo",
        description: "Tắm, sấy khô, vệ sinh tai, cắt móng cho mèo",
        price: 180000,
        duration: 60,
        category: "GROOMING",
        requiredSpecialties: ["GROOMING"],
        images: [
          {
            url: getRandomImage("services", "grooming"),
            publicId: generatePublicId("services", "grooming3"),
          },
        ],
        isActive: true,
      },
      {
        name: "Tỉa lông tạo kiểu chuyên nghiệp",
        description:
          "Tạo kiểu lông theo tiêu chuẩn từng giống, phù hợp thi đấu",
        price: 600000,
        duration: 150,
        category: "GROOMING",
        requiredSpecialties: ["GROOMING"],
        images: [
          {
            url: getRandomImage("services", "grooming"),
            publicId: generatePublicId("services", "grooming4"),
          },
        ],
        isActive: true,
      },
      // SPA
      {
        name: "Combo Spa cao cấp cho chó",
        description:
          "Tắm, sấy, cắt tỉa lông theo yêu cầu, vệ sinh răng miệng, massage",
        price: 450000,
        duration: 120,
        category: "SPA",
        requiredSpecialties: ["SPA"],
        images: [
          {
            url: getRandomImage("services", "spa"),
            publicId: generatePublicId("services", "spa1"),
          },
          {
            url: getRandomImage("services", "spa"),
            publicId: generatePublicId("services", "spa1b"),
          },
        ],
        isActive: true,
      },
      {
        name: "Spa thư giãn toàn thân",
        description: "Massage, aromatherapy, chăm sóc da và lông chuyên sâu",
        price: 550000,
        duration: 90,
        category: "SPA",
        requiredSpecialties: ["SPA"],
        images: [
          {
            url: getRandomImage("services", "spa"),
            publicId: generatePublicId("services", "spa2"),
          },
        ],
        isActive: true,
      },
      {
        name: "Chăm sóc móng và da chân",
        description: "Cắt móng, chăm sóc da chân, massage bàn chân",
        price: 200000,
        duration: 45,
        category: "SPA",
        requiredSpecialties: ["SPA"],
        images: [
          {
            url: getRandomImage("services", "spa"),
            publicId: generatePublicId("services", "spa3"),
          },
        ],
        isActive: true,
      },
      // HEALTHCARE
      {
        name: "Khám sức khỏe tổng quát",
        description: "Kiểm tra sức khỏe toàn diện, tư vấn chế độ dinh dưỡng",
        price: 200000,
        duration: 45,
        category: "HEALTHCARE",
        requiredSpecialties: ["HEALTHCARE"],
        images: [
          {
            url: getRandomImage("services", "healthcare"),
            publicId: generatePublicId("services", "healthcare1"),
          },
        ],
        isActive: true,
      },
      {
        name: "Tiêm phòng vắc-xin 5 bệnh",
        description: "Tiêm phòng Care, Parvo, Distemper, Adeno, Parainfluenza",
        price: 250000,
        duration: 30,
        category: "HEALTHCARE",
        requiredSpecialties: ["HEALTHCARE"],
        images: [
          {
            url: getRandomImage("services", "healthcare"),
            publicId: generatePublicId("services", "healthcare2"),
          },
        ],
        isActive: true,
      },
      {
        name: "Tiêm phòng vắc-xin dại",
        description: "Tiêm phòng bệnh dại, cấp giấy chứng nhận",
        price: 150000,
        duration: 30,
        category: "HEALTHCARE",
        requiredSpecialties: ["HEALTHCARE"],
        images: [
          {
            url: getRandomImage("services", "healthcare"),
            publicId: generatePublicId("services", "healthcare3"),
          },
        ],
        isActive: true,
      },
      {
        name: "Điều trị bệnh da liễu",
        description: "Khám và điều trị các bệnh ngoài da, nấm, ghẻ",
        price: 300000,
        duration: 60,
        category: "HEALTHCARE",
        requiredSpecialties: ["HEALTHCARE"],
        images: [
          {
            url: getRandomImage("services", "healthcare"),
            publicId: generatePublicId("services", "healthcare4"),
          },
        ],
        isActive: true,
      },
      {
        name: "Phẫu thuật triệt sản",
        description:
          "Phẫu thuật triệt sản an toàn, bao gồm thuốc và chăm sóc sau mổ",
        price: 1200000,
        duration: 180,
        category: "HEALTHCARE",
        requiredSpecialties: ["HEALTHCARE"],
        images: [
          {
            url: getRandomImage("services", "healthcare"),
            publicId: generatePublicId("services", "healthcare5"),
          },
        ],
        isActive: true,
      },
      // TRAINING
      {
        name: "Huấn luyện vâng lời cơ bản",
        description: "Dạy ngồi, nằm, đứng, đi theo, không nhảy lên người",
        price: 500000,
        duration: 90,
        category: "TRAINING",
        requiredSpecialties: ["TRAINING"],
        images: [
          {
            url: getRandomImage("services", "training"),
            publicId: generatePublicId("services", "training1"),
          },
        ],
        isActive: true,
      },
      {
        name: "Huấn luyện đi vệ sinh đúng chỗ",
        description: "Dạy chó mèo đi vệ sinh đúng nơi quy định",
        price: 400000,
        duration: 60,
        category: "TRAINING",
        requiredSpecialties: ["TRAINING"],
        images: [
          {
            url: getRandomImage("services", "training"),
            publicId: generatePublicId("services", "training2"),
          },
        ],
        isActive: true,
      },
      {
        name: "Huấn luyện kỹ năng xã hội",
        description: "Giúp thú cưng thân thiện với người và động vật khác",
        price: 600000,
        duration: 90,
        category: "TRAINING",
        requiredSpecialties: ["TRAINING"],
        images: [
          {
            url: getRandomImage("services", "training"),
            publicId: generatePublicId("services", "training3"),
          },
        ],
        isActive: true,
      },
      {
        name: "Khóa huấn luyện nâng cao (10 buổi)",
        description: "Huấn luyện chuyên sâu: vâng lời, kỹ năng bảo vệ, thi đấu",
        price: 8000000,
        duration: 120,
        category: "TRAINING",
        requiredSpecialties: ["TRAINING"],
        images: [
          {
            url: getRandomImage("services", "training"),
            publicId: generatePublicId("services", "training4"),
          },
        ],
        isActive: true,
      },
      // BOARDING
      {
        name: "Dịch vụ lưu trú 1 ngày (chó nhỏ)",
        description: "Chăm sóc, cho ăn, vệ sinh cho chó dưới 10kg",
        price: 150000,
        duration: 1440,
        category: "BOARDING",
        requiredSpecialties: ["BOARDING"],
        images: [
          {
            url: getRandomImage("services", "boarding"),
            publicId: generatePublicId("services", "boarding1"),
          },
        ],
        isActive: true,
      },
      {
        name: "Dịch vụ lưu trú 1 ngày (chó lớn)",
        description: "Chăm sóc, cho ăn, vệ sinh cho chó trên 10kg",
        price: 200000,
        duration: 1440,
        category: "BOARDING",
        requiredSpecialties: ["BOARDING"],
        images: [
          {
            url: getRandomImage("services", "boarding"),
            publicId: generatePublicId("services", "boarding2"),
          },
        ],
        isActive: true,
      },
      {
        name: "Dịch vụ lưu trú 1 ngày (mèo)",
        description: "Chăm sóc, cho ăn, vệ sinh cho mèo",
        price: 120000,
        duration: 1440,
        category: "BOARDING",
        requiredSpecialties: ["BOARDING"],
        images: [
          {
            url: getRandomImage("services", "boarding"),
            publicId: generatePublicId("services", "boarding3"),
          },
        ],
        isActive: true,
      },
    ];

    const services = await ServiceModel.create(servicesData);

    console.log("✓ Đã tạo Services với ảnh:", services.length);

    // 4. TẠO BOOKINGS
    const bookings = [];
    const statuses = ["completed", "confirmed", "pending"];

    for (let i = 0; i < 30; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const customerPets = pets.filter((p) => p.ownerId.equals(customer._id));
      if (customerPets.length === 0) continue;

      const pet = customerPets[Math.floor(Math.random() * customerPets.length)];
      const service = services[Math.floor(Math.random() * services.length)];
      const employee = employees[Math.floor(Math.random() * employees.length)];

      const now = new Date();
      const scheduledDate = randomDate(subMonths(now, 1), addMonths(now, 2));
      const startTime = randomTime();
      const [hour, minute] = startTime.split(":").map(Number);
      const startMinutes = hour * 60 + minute;
      let endMinutes = startMinutes + service.duration;

      // clamp về 23:59
      if (endMinutes > 23 * 60 + 59) {
        endMinutes = 23 * 60 + 59;
      }

      const endHour = Math.floor(endMinutes / 60);
      const endMinute = endMinutes % 60;

      const endTime = `${endHour.toString().padStart(2, "0")}:${endMinute
        .toString()
        .padStart(2, "0")}`;

      const status = statuses[Math.floor(Math.random() * statuses.length)];

      const booking = await BookingModel.create({
        customerId: customer._id,
        petId: pet._id,
        employeeId: employee._id,
        serviceId: service._id,
        scheduledDate,
        startTime,
        endTime,
        duration: service.duration,
        serviceSnapshot: {
          name: service.name,
          price: service.price,
          duration: service.duration,
          category: service.category,
        },
        status,
        totalAmount: service.price,
        paidAmount: status === "completed" ? service.price : 0,
        paymentStatus: status === "completed" ? "paid" : "pending",
        paymentMethod: status === "completed" ? "cash" : undefined,
        customerNotes: "Bé hơi sợ nước, nhờ anh/chị chú ý giúp em",
        completedAt: status === "completed" ? scheduledDate : undefined,
        rating:
          status === "completed"
            ? {
                score: Math.floor(Math.random() * 2) + 4, // 4-5 sao
                feedback: "Dịch vụ rất tốt, nhân viên nhiệt tình!",
                ratedAt: scheduledDate,
              }
            : undefined,
      });
      bookings.push(booking);
    }

    console.log("✓ Đã tạo Bookings:", bookings.length);

    // 5. TẠO POSTS với media
    const posts = [];
    const postTitles = [
      "Mẹo chăm sóc lông cho chó Poodle",
      "Kinh nghiệm nuôi mèo Ba Tư",
      "Cách huấn luyện chó Golden Retriever",
      "Thức ăn tốt nhất cho chó con",
      "Dấu hiệu nhận biết chó bị bệnh",
      "Lịch tiêm phòng cho chó mèo",
      "Cách tắm cho mèo không bị stress",
      "Những giống chó phù hợp nuôi trong chung cư",
    ];

    for (let i = 0; i < 15; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const customerPets = pets.filter((p) => p.ownerId.equals(customer._id));

      // Random số lượng ảnh cho post (1-3 ảnh)
      const imageCount = Math.floor(Math.random() * 3) + 1;
      const postMedia = [];

      for (let j = 0; j < imageCount; j++) {
        postMedia.push({
          type: "image" as const,
          url: MOCK_IMAGES.posts[
            Math.floor(Math.random() * MOCK_IMAGES.posts.length)
          ],
          publicId: generatePublicId("posts", `post${i + 1}_img${j + 1}`),
        });
      }

      const post = await PostModel.create({
        authorId: customer._id,
        title: postTitles[Math.floor(Math.random() * postTitles.length)],
        content: `Hôm nay mình muốn chia sẻ với mọi người về kinh nghiệm chăm sóc thú cưng của mình. Sau một thời gian nuôi dưỡng, mình đã học được rất nhiều điều bổ ích. 

Điều quan trọng nhất là phải kiên nhẫn và yêu thương. Mỗi bé đều có tính cách riêng, cần thời gian để hiểu và thích nghi. Ngoài ra, việc đưa bé đi khám định kỳ cũng rất cần thiết để đảm bảo sức khỏe.

Mình rất may mắn khi tìm được PetCare Spa, dịch vụ ở đây rất chuyên nghiệp và tận tâm. Các bác sĩ và nhân viên đều rất chu đáo!`,
        tags: ["kinh nghiệm", "chăm sóc", "sức khỏe"],
        petIds: customerPets.length > 0 ? [customerPets[0]._id] : [],
        media: postMedia,
        visibility: "public",
        status: "active",
        isFeatured: Math.random() > 0.8,
        stats: {
          viewCount: Math.floor(Math.random() * 500),
          likeCount: Math.floor(Math.random() * 100),
          commentCount: Math.floor(Math.random() * 20),
          shareCount: Math.floor(Math.random() * 10),
          reportCount: 0,
        },
      });
      posts.push(post);
    }

    console.log("✓ Đã tạo Posts với media:", posts.length);

    // 6. TẠO COMMENTS
    const comments = [];
    const commentTexts = [
      "Cảm ơn bạn đã chia sẻ! Bài viết rất hữu ích.",
      "Mình cũng đang gặp tình huống tương tự và sẽ áp dụng theo lời khuyên của bạn.",
      "Thông tin rất bổ ích, cảm ơn bạn nhiều!",
      "Bé nhà bạn đáng yêu quá! Mình cũng đang nuôi loại này.",
      "Có thể cho mình xin thêm thông tin được không?",
      "Bài viết hay lắm, mình đã lưu lại để tham khảo!",
    ];

    for (const post of posts) {
      const commentCount = Math.floor(Math.random() * 5) + 1;
      for (let i = 0; i < commentCount; i++) {
        const commenter =
          customers[Math.floor(Math.random() * customers.length)];
        const comment = await CommentModel.create({
          postId: post._id,
          authorId: commenter._id,
          content:
            commentTexts[Math.floor(Math.random() * commentTexts.length)],
          status: "active",
        });
        comments.push(comment);
      }
    }

    console.log("✓ Đã tạo Comments:", comments.length);

    // 7. TẠO REACTIONS
    const reactions = [];
    for (const post of posts) {
      const reactionCount = Math.floor(Math.random() * 10) + 5;
      for (let i = 0; i < reactionCount; i++) {
        const reactor = customers[Math.floor(Math.random() * customers.length)];
        try {
          const reaction = await ReactionModel.create({
            contentType: "Post",
            contentId: post._id,
            userId: reactor._id,
            reactionType: ["like", "love", "laugh"][
              Math.floor(Math.random() * 3)
            ],
          });
          reactions.push(reaction);
        } catch (e) {
          // Skip duplicate reactions
        }
      }
    }

    console.log("✓ Đã tạo Reactions:", reactions.length);

    // 8. TẠO EMPLOYEE SCHEDULES
    const schedules = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);

      for (const employee of employees) {
        // dayOfWeek: 0 = Thứ 2, 6 = Chủ nhật
        const dayOfWeek = (date.getDay() + 6) % 7; // Chuyển đổi: JS Sunday=0 -> Monday=0

        const schedule = await EmployeeScheduleModel.create({
          employeeId: employee._id,
          date,
          isWorking: dayOfWeek !== 6, // Không làm Chủ nhật (6)
          workHours:
            dayOfWeek !== 6
              ? [
                  { start: "08:00", end: "12:00" },
                  { start: "13:30", end: "17:30" },
                ]
              : [],
          note: dayOfWeek === 5 ? "Làm nửa ngày" : undefined, // Thứ 7
        });
        schedules.push(schedule);
      }
    }

    console.log("✓ Đã tạo Employee Schedules:", schedules.length);

    // 9. TẠO SHIFT TEMPLATES
    const shiftTemplates = [];
    for (const employee of employees) {
      // day: 0 = Thứ 2, 1 = Thứ 3, ..., 5 = Thứ 7, 6 = Chủ nhật
      for (let day = 0; day <= 5; day++) {
        // Thứ 2 (0) - Thứ 7 (5)
        const template = await ShiftTemplateModel.create({
          employeeId: employee._id,
          dayOfWeek: day,
          startTime: "08:00",
          endTime: day === 5 ? "12:00" : "17:30", // Thứ 7 làm nửa ngày
          effectiveFrom: new Date("2024-01-01"),
          isActive: true,
        });
        shiftTemplates.push(template);
      }
    }

    console.log("✓ Đã tạo Shift Templates:", shiftTemplates.length);

    console.log("\n========================================");
    console.log("✓ HOÀN TẤT SEED DATABASE");
    console.log("========================================");
    console.log("Tổng kết:");
    console.log(
      `- Users: ${1 + employees.length + customers.length} (tất cả có ảnh đại diện)`,
    );
    console.log(`- Accounts: ${accounts.length}`);
    console.log(`- Pets: ${pets.length} (tất cả có ảnh)`);
    console.log(`- Services: ${services.length} (tất cả có ảnh minh họa)`);
    console.log(`- Bookings: ${bookings.length}`);
    console.log(`- Posts: ${posts.length} (có 1-3 ảnh mỗi post)`);
    console.log(`- Comments: ${comments.length}`);
    console.log(`- Reactions: ${reactions.length}`);
    console.log(`- Schedules: ${schedules.length}`);
    console.log(`- Shift Templates: ${shiftTemplates.length}`);
    console.log("========================================\n");

    console.log("Thông tin đăng nhập:");
    console.log("Admin: admin@petcare.vn / Admin@123456");
    console.log("Nhân viên: bacsi.hai@petcare.vn / Employee@123");
    console.log("Khách hàng: nguyenvana@gmail.com / Customer@123");
    console.log("\n📸 Tất cả dữ liệu đã có ảnh từ Unsplash!");
  } catch (error) {
    console.error("❌ Lỗi:", error);
  } finally {
    await mongoose.disconnect();
    console.log("✓ Ngắt kết nối với Mongo database");
  }
}

seedDatabase();
