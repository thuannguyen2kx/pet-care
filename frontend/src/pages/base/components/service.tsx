import GroomingIcon from "@/assets/icons/grooming.svg";
import HealthyMealIcon from "@/assets/icons/healthy-meal.svg";
import PetActivitiesIcon from "@/assets/icons/pet-activities.svg";
import VeterinaryIcon from "@/assets/icons/veterinary.svg";
import GroomingImage from "@/assets/images/grooming.png"; 
import HealthyMealImage from "@/assets/images/healthy-meal.png";
import PetActivitiesImage from "@/assets/images/pet-activities.png";
import VeterinaryImage from "@/assets/images/veterinary.png";

const services = [
  { 
    id: 1, 
    title: 'Chăm sóc thú cưng', 
    description: 'Dịch vụ tắm rửa, cắt tỉa lông, chăm sóc ngoại hình cho thú cưng của bạn.',
    icon: GroomingIcon,
    image: GroomingImage
  },
  { 
    id: 2, 
    title: 'Bữa ăn dinh dưỡng', 
    description: 'Chuẩn bị các bữa ăn đầy đủ dinh dưỡng và phù hợp với từng loại thú cưng.',
    icon: HealthyMealIcon,
    image: HealthyMealImage
  },
  { 
    id: 3, 
    title: 'Chăm sóc hoạt động', 
    description: 'Tổ chức các hoạt động vận động, vui chơi giúp thú cưng luôn khỏe mạnh và năng động.',
    icon: PetActivitiesIcon,
    image: PetActivitiesImage
  },
  { 
    id: 4, 
    title: 'Dịch vụ y tế', 
    description: 'Khám sức khỏe định kỳ, tiêm ngừa và điều trị bệnh cho thú cưng với đội ngũ bác sĩ chuyên nghiệp.',
    icon: VeterinaryIcon,
    image: VeterinaryImage
  }
]


const ServiceCard = ({title, description, icon, image}: {title: string, description: string, icon: string, image: string}) => {
  

  return (
    <div className="relative flex flex-col items-center p-6 rounded-xl bg-white shadow-sm text-center">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full px-2">
        <img src={image} alt="service-image" className="w-full h-auto" />
        <div className="absolute -bottom-8 right-3 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-full object-cover shadow">
          <img
            src={icon}
            alt="service-icon"
            className="size-8 object-cover text-primary"
          />
        </div>
      </div>
      <div className="mt-36 space-y-2">
        <h3 className="text-2xl font-semibold">{title}</h3>
        <div className="leading-relaxed text-slate-600">{description}</div>
      </div>
    </div>
  );
};

const Services = () => {

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="text-xs uppercase tracking-wider font-semibold mb-2 text-primary">
            Những gì chúng tôi đang cung cấp
          </div>
          <h2 className="text-4xl xl:text-5xl font-medium mb-4">
            Cung cấp những dịch vụ tốt nhất
            <br />
            cho thú cưng của bạn
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-40">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              icon={service.icon}
              image={service.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;