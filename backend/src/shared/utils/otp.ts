import { randomBytes } from 'crypto';

export const generateOtp = (length: number = 6): string => {
  if (length < 1 || length > 20) {
    throw new Error('طول OTP باید بین 1 تا 20 باشد');
  }

  const randomValues = randomBytes(length);
  let otp = '';

  for (let i = 0; i < length; i++) {
    otp += String(randomValues[i] % 10);
  }

  return otp;
};
