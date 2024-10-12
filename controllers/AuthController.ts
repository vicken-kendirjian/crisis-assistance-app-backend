import express, {Request,Response,NextFunction} from 'express';
import { validationResult } from 'express-validator';
import { CreateUserInput, OtpInput, UserLogin, UserPayload } from '../dto';
import { User } from '../models';
import { GeneratePassword, GenerateSalt, validatePassword } from '../utility';
import { generateAccessToken, generateRefreshToken } from '../utility';
import { storeUserAndOtp, getUserAndOtp, deleteUserAndOtp } from '../utility/RedisUtility';
import { sendOtp } from '../utility/TwilioUtility';




export const userSignup = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, lastname, phone, password, bloodType } = <CreateUserInput>req.body;

  try {
    // Check if the user already exists in the database
    const duplicate = await User.findOne({ phone });
    if (duplicate) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Store OTP and user info in Redis
    const userData = { name, lastname, phone, password, bloodType };
    await storeUserAndOtp(phone, otp, userData);

    // Send OTP via Twilio
    await sendOtp(phone, otp);

    return res.status(200).json({ msg: 'OTP sent. Please verify to complete registration.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
};


export const verifyOtp = async (req: Request, res: Response) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { phone, otp } = <OtpInput>req.body;

  try {
    // Get OTP and user data from Redis
    const data = await getUserAndOtp(phone);
    
    console.log(data)
    if (!data) {
      return res.status(400).json({ msg: 'OTP expired or invalid' });
    }

    if (data.otp !== otp) {
      return res.status(400).json({ msg: 'Incorrect OTP' });
    }

    // OTP is correct, create the user in MongoDB
    const { name, lastname, password, bloodType } = data.userData;

    const salt = await GenerateSalt();
    const hashedPassword = await GeneratePassword(password, salt);

    const user = new User({
      name,
      lastname,
      phone,
      password: hashedPassword,
      salt,
      bloodType,
      verified: true, // Mark the user as verified
    });

    await user.save();

    // Delete OTP and user data from Redis after successful verification
    await deleteUserAndOtp(phone);

    return res.status(201).json({ msg: 'User created successfully', user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
};



export const userLogin = async (req: Request, res: Response) => {
  const { phone, password } = <UserLogin>req.body; // Assuming phone and password are passed in the request body

  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //Find the user by phone number
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    //Validate the provided password with the stored password
    const isPasswordValid = await validatePassword(password, user.password, user.salt);
    if (!isPasswordValid) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    //Generate access token and refresh token
    const payload : UserPayload = {
      _id: user._id,
      phone: user.phone,
      name: user.name
    }
    
    const accessToken = generateAccessToken(payload); 
    const refreshToken = generateRefreshToken(payload); 

    //Save the refresh token in the DB
    user.refreshToken = refreshToken;
    await user.save();

    //req.userId = user._id.toString();
    res.setHeader('access-token', accessToken);
    console.log("From LOGIN: "+accessToken)
    //Return access token to the frontend
    return res.status(200).json({
      user: {
        _id: user._id,
        phone: user.phone,
        name: user.name,
        lastname: user.lastname
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
};

export const testCall = async (req: Request, res: Response) => {
  res.status(200).json({msg: "Good to go boiii"})
}