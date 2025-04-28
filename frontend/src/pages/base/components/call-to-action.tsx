import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";


import ContactImage from "@/assets/images/contact.png";
const CallToAction = () => {
  return (
    <section className="flex flex-col md:flex-row justify-center items-center bg-white py-24">
      <div className="w-1/2 flex justify-end">
        <img src={ContactImage} alt="contact" />
      </div>
      <div className="w-1/2 flex justify-start translate-y-10">
        <div className="bg-white shadow-lg p-8 rounded-xl max-w-xl w-full">
          <div className="text-primary text-xs uppercase font-semibold mb-2 text-center">Tư vấn miễn phí</div>
          <h2 className="text-4xl font-bold mb-6 text-center">
            Nhận báo thông tin tư vấn miễn phí
          </h2>

          <form>
            <div className="space-y-4 px-8 py-10">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-lg">
                  Tên của bạn
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Nhập tên của bạn"
                  required
                  className="bg-slate-100 rounded-full px-4 py-6 text-lg"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-lg">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Nhập email của bạn"
                  required
                  className="bg-slate-100 rounded-full px-4 py-6 text-lg"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-lg">
                  Số điện thoại
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Nhập số điện thoại"
                  required
                  className="bg-slate-100 rounded-full px-4 py-6 text-lg"
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-lg">
                  Để lại tin nhắn
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Nhập tin nhắn của bạn"
                  rows={4}
                  className="rounded-lg bg-slate-100 px-4 py-6 text-lg"
                />
              </div>

              <Button
                type="submit"
                className="flex justify-center w-full rounded-full py-6"
              >
                Đăng ký tư vấn
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
