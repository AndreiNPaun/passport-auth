const { body } = require('express-validator');

// Reusable name validation
const nameValidation = (data, name) => {
  return body(data)
    .notEmpty()
    .withMessage(`${name} is required.`)
    .bail()
    .isLength({ max: 50 })
    .withMessage(`${name} cannot exceed 50 characters.`)
    .bail()
    .isAlpha()
    .withMessage(`${name} should only contain alphabetic characters.`)
    .customSanitizer((value) => {
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    });
};

// Email validation
const emailValidation = (data) => {
  return body(data)
    .notEmpty()
    .withMessage('Email is required.')
    .bail()
    .isEmail()
    .withMessage('Please enter a valid email.')
    .bail()
    .isLength({ max: 255 })
    .withMessage('Email should not exceed 255 characters.')
    .normalizeEmail();
};

module.exports = { nameValidation, emailValidation };
