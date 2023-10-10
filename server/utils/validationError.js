const { validationResult } = require('express-validator');

// Utility function used for sending errors from express-validator to controller
const validationError = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    console.log(errorMessages);

    return res.status(422).send(errorMessages);
  }
};

module.exports = validationError;
