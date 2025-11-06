import nodemailer from 'nodemailer';
import { config } from '../../configs/environment';

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: config.email.service,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
  }

  async sendOTP(email: string, code: string): Promise<void> {
    const mailOptions = {
      from: config.email.user,
      to: email,
      subject: 'Your OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #333;">Verification Code</h2>
          <p>Your OTP code is: <strong>${code}</strong></p>
          <p>This code will expire in 2 minutes.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            If you didn't request this code, please ignore this email.
          </p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
