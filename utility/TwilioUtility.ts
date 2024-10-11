import twilio from 'twilio';
import { TWILIO_NUMBER, TWILIO_SID, TWILIO_SECRET } from '../config';

const client = twilio(TWILIO_SID, TWILIO_SECRET);

export const sendOtp = async (phone: string, otp: number) => {
  try {
    await client.messages.create({
      body: `Your verification code is ${otp}`,
      from: TWILIO_NUMBER, 
      to: phone,
    });
  } catch (err) {
    console.error('Failed to send OTP', err);
    throw new Error('Failed to send OTP');
  }
};
