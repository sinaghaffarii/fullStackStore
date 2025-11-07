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

  async sendPasswordResetOTP(email: string, code: string): Promise<void> {
    const mailOptions = {
      from: config.email.user,
      to: email,
      subject: 'Password Reset Request - FullStack Store',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset</h2>
        <p>Your password reset code is: <strong style="font-size: 18px;">${code}</strong></p>
        <p>This code will expire in 15 minutes.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          This is an automated message, please do not reply.
        </p>
      </div>
    `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
