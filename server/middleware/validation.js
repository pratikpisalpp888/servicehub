const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  handleValidationErrors
];

const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

const validateProviderRequest = [
  body('businessName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Business name must be between 2 and 100 characters'),
  body('categories')
    .isArray({ min: 1 })
    .withMessage('At least one category is required'),
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  body('latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Valid latitude is required'),
  body('longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Valid longitude is required'),
  body('visitCharge')
    .isFloat({ min: 0 })
    .withMessage('Visit charge must be a positive number'),
  handleValidationErrors
];

const validateBooking = [
  body('providerId')
    .isMongoId()
    .withMessage('Valid provider ID is required'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
  body('timeslot')
    .isISO8601()
    .withMessage('Valid timeslot is required'),
  handleValidationErrors
];

const validateChatMessage = [
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required'),
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateProviderRequest,
  validateBooking,
  validateChatMessage
};