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
    .matches(/^[a-zA-Z-' ]+$/)
    .withMessage(
      `${name} should only contain alphabetic characters, hyphens, apostrophes, or spaces.`
    )
    .customSanitizer((value) => {
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    });
};

module.exports = nameValidation;
