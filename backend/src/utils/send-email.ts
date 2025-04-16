import nodemailer from 'nodemailer';
import { config } from '../config/app.config';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: config.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Email đã được gửi tới ${options.to}`);
    } catch (error) {
      console.error('Gửi email thất bại:', error);
      throw new Error('Không thể gửi email');
    }
  }

  async sendAppointmentConfirmation(email: string, appointmentDetails: any): Promise<void> {
    const subject = 'Xác nhận lịch hẹn chăm sóc thú cưng của bạn';
    const html = `
      <h1>Xác nhận lịch hẹn</h1>
      <p>Lịch hẹn của bạn đã được xác nhận vào ngày ${appointmentDetails.date} lúc ${appointmentDetails.time}.</p>
      <p>Dịch vụ: ${appointmentDetails.serviceName}</p>
      <p>Thú cưng: ${appointmentDetails.petName}</p>
      <p>Cảm ơn bạn đã lựa chọn dịch vụ chăm sóc thú cưng của chúng tôi!</p>
    `;

    await this.sendEmail({ to: email, subject, html });
  }

  async sendAppointmentReminder(email: string, appointmentDetails: any): Promise<void> {
    const subject = 'Nhắc nhở: Lịch hẹn chăm sóc thú cưng sắp tới';
    const html = `
      <h1>Nhắc nhở lịch hẹn</h1>
      <p>Đây là lời nhắc về lịch hẹn chăm sóc thú cưng của bạn vào ngày mai lúc ${appointmentDetails.time}.</p>
      <p>Dịch vụ: ${appointmentDetails.serviceName}</p>
      <p>Thú cưng: ${appointmentDetails.petName}</p>
      <p>Chúng tôi rất mong được gặp bạn và thú cưng!</p>
    `;

    await this.sendEmail({ to: email, subject, html });
  }

  async sendReceipt(options: {
    to: string;
    customerName: string;
    serviceName: string;
    petName: string;
    amount: number;
    currency: string;
    date: Date;
    transactionId: string;
  }): Promise<void> {
    const { to, customerName, serviceName, petName, amount, currency, date, transactionId } = options;

    const subject = 'Biên nhận thanh toán của bạn';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #4f46e5;">Biên Nhận Thanh Toán</h1>
        </div>
        
        <div style="margin-bottom: 20px;">
          <p>Chào ${customerName},</p>
          <p>Cảm ơn bạn đã thanh toán. Dưới đây là biên nhận của bạn:</p>
        </div>
        
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Dịch vụ:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${serviceName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Thú cưng:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${petName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Số tiền:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${amount.toLocaleString()} ${currency}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Ngày thanh toán:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${date.toLocaleDateString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Mã giao dịch:</strong></td>
              <td style="padding: 8px 0; text-align: right;">${transactionId}</td>
            </tr>
          </table>
        </div>
        
        <div style="margin-top: 20px;">
          <p>Nếu bạn có bất kỳ thắc mắc nào về biên nhận này, vui lòng liên hệ đội ngũ hỗ trợ của chúng tôi.</p>
          <p>Cảm ơn bạn đã tin tưởng sử dụng dịch vụ chăm sóc thú cưng của chúng tôi!</p>
        </div>
        
        <div style="margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px;">
          <p>Đây là email tự động. Vui lòng không trả lời thư này.</p>
        </div>
      </div>
    `;

    await this.sendEmail({ to, subject, html });
  }
}

export default new EmailService();
