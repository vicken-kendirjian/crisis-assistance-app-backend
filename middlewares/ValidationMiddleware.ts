import { body, validationResult } from 'express-validator';

// Validation Middleware
export const CreateUserValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('lastname').notEmpty().withMessage('Last Name is required'),
  body('bloodType').notEmpty().withMessage('Blood type is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('password').notEmpty().withMessage('Password is required')
];

export const OTPValidation = [
  body('phone').notEmpty().withMessage('Phone is required'),
  body('otp')
    .notEmpty().withMessage('OTP is required')
    .custom(value => {
      if (typeof value !== 'number') {
        throw new Error('Phone must be a number'); // Custom error message
      }
      return true; // If validation passes
    })
    .isNumeric().withMessage('Phone must be a number')
];

export const LoginValidation = [
  body('phone').notEmpty().withMessage('Phone Number is required')
    .isNumeric().withMessage('Phone input must be numeric'),
  body('password').notEmpty().withMessage('Password is required')
]

