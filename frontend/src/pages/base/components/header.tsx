import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 z-20 w-full bg-transparent border-b border-slate-100 shadow-sm py-6 backdrop-blur-md">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-4xl font-bold text-orange-500">    
              <span>PetCare</span>
          </div>
        </div>
         
        <div>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6">
            Khám phá ngay
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;