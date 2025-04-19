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


export const VolunteerValidation = [
  body('service')
  .notEmpty().withMessage('Service is required')
  .isString().withMessage('Service must be a string')
  .isIn(['Medical', 'Psychological', 'Maintenance', 'Logistics']).withMessage('Service must be one of: medical, psychological, maintenance or logistics'),

  body('title')
    .notEmpty().withMessage('Title is required')
    .isString().withMessage('Title must be a string'),

  body('description')
    .notEmpty().withMessage('Description is required')
    .isString().withMessage('Description must be a string'),

  body('contactDetails')
    .notEmpty().withMessage('Contact details are required')
    .isString().withMessage('Contact details must be a string')
];

