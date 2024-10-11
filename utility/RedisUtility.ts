import { createClient } from 'redis';

import { client } from '../services/Redis';


// Store OTP and user data in Redis with expiration time (TTL)
export const storeUserAndOtp = async (phone: string, otp: number, userData: any) => {
  try {
    await client.setEx(
      phone,   // Use phone as the key
      600,     // Expire after 600 seconds (10 minutes)
      JSON.stringify({ otp, userData }) // Store OTP and user data together as JSON
    );
  } catch (err) {
    console.error('Error storing OTP and user data:', err);
  }
};

// Retrieve OTP and user data from Redis
export const getUserAndOtp = async (phone: string): Promise<any> => {
  try {
    const data = await client.get(phone);
    if (!data) return null; // If no data is found, return null
    return JSON.parse(data); // Parse the JSON string back to an object
  } catch (err) {
    console.error('Error retrieving OTP and user data:', err);
    return null;
  }
};

// Delete OTP and user data from Redis
export const deleteUserAndOtp = async (phone: string) => {
  try {
    await client.del(phone);
  } catch (err) {
    console.error('Error deleting OTP and user data:', err);
  }
};
