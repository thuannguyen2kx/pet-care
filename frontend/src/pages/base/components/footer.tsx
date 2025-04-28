import { Facebook, Instagram, Send, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  // Current year for copyright
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white mt-6 pb-6">
      <div className="container mx-auto px-4 relative">
        {/* Newsletter Subscribe */}
        <div className="-translate-y-1/2 w-full py-6 px-8 bg-orange-300 rounded-xl flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="font-bold text-xl">
              Đăng ký nhận bản tin của chúng tôi
            </h3>
            <p>Nhận tin tức và cập nhật mới nhất</p>
          </div>
          <div className="flex items-center w-full md:w-auto">
            <input
              type="email"
              placeholder="Nhập email"
              className="px-2 py-4 focus:outline-none w-full md:w-64 text-gray-900 border-b border-white"
            />
            <button className="flex-shrink-0 text-white p-2 rounded-full hover:opacity-80 cursor-pointer">
              <Send size={24} className="size-6" /> 
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="text-2xl font-bold text-orange-500 mb-4">
              <span>PetCare</span>
            </div>
            <p className="text-gray-400 mb-4">
              Dịch vụ chăm sóc thú cưng chuyên nghiệp phù hợp với nhu cầu của
              thú cưng. Chúng tôi tận tâm giữ cho thú cưng của bạn luôn vui vẻ
              và khỏe mạnh.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên kết</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Trang chủ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Dịch vụ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Giá
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Chăm sóc thú cưng
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Chơi cùng thú cưng 
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Huấn luyện thú cưng
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Chăm sóc sức khoẻ thú cưng
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Khách sạn thú cưng
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start">
                <span className="mr-2">📍</span>
                <span>123 Pet Street, Animal City, Country</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📞</span>
                <span>+1 (234) 567-8900</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✉️</span>
                <span>info@petcare.com</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">⏰</span>
                <span>T2-T6: 9am-6pm, T7-CN: 10am-4pm</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} PetCare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;