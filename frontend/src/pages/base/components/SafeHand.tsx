import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import AboutImage from "@/assets/images/about.png";

const SafeHands = () => {
  const features = [
    "Pet-friendly environment designed for comfort",
    "Professional groomers with decades of experience",
    "Customized care plans for each pet's needs"
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <img
              src={AboutImage}
              alt="About Image"
              className="w-full h-auto object-cover rounded-3xl"
            />
          </div>

          <div className="md:w-1/2 md:pl-16">
          <div className="text-sm text-primary uppercase font-semibold">Về chúng PetCare</div>
            <h2 className="text-3xl font-bold mb-6">
              Thú cưng của bạn đang ở trong tay rất
              <br />
              an toàn và tốt
            </h2>

            <p className="text-gray-600 mb-8">
              Đội ngũ chuyên gia chăm sóc thú cưng được chứng nhận của chúng tôi
              cam kết cung cấp mức độ chăm sóc và quan tâm cao nhất cho thú cưng
              yêu quý của bạn. Chúng tôi hiểu rằng mỗi thú cưng là duy nhất và
              chúng tôi điều chỉnh các dịch vụ của mình để đáp ứng nhu cầu riêng
              của chúng.
            </p>

            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="bg-orange-100 rounded-full p-1 mt-1">
                    <Check className="h-4 w-4 text-orange-500" />
                  </div>
                  <p>{feature}</p>
                </div>
              ))}
            </div>

            <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SafeHands;