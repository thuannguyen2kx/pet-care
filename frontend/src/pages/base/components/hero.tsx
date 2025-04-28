import { Button } from "@/components/ui/button";
import BgHero from "@/assets/images/bg-hero.svg";
import Dog from "@/assets/images/dog-hero.png";
import Toy from "@/assets/images/toy.png";

const Hero = () => {
  return (
    <section
      className="overflow-hidden h-screen"
      style={{
        backgroundImage: `url(${BgHero})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="h-full flex flex-col md:flex-row items-start">
        <div className="h-full md:w-1/2 mb-10 md:mb-0 pr-0 md:pr-16 flex flex-col items-center justify-center">
          <div className="py-24">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Chăm sóc <br />
              Thú cưng của bạn
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-xl text-balance">
              Chúng tôi cung cấp dịch vụ chăm sóc tốt nhất cho những người bạn
              lông lá của bạn. Hãy để chúng tôi chăm sóc những con vật cưng yêu
              quý của bạn bằng sự quan tâm và tình yêu thương của chuyên gia.
            </p>
            <Button className="py-6 px-8 rounded-full text-lg">
              Khám phá ngay
            </Button>
          </div>
        </div>

        <div className="md:w-1/2 relative h-full w-full">
          <div className="absolute z-10 top-0 -right-50">
            <img
              src={Dog}
              alt="Dog Image"
              className="w-full h-auto object-contain"
            />
            <div className="absolute z-10 -bottom-30 right-40">
              <img
                src={Toy}
                alt="Toy"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
