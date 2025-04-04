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

    await this.sendEmail({
      to: email,
      subject,
      html,
    });
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

    await this.sendEmail({
      to: email,
      subject,
      html,
    });
  }
}

export default new EmailService();
