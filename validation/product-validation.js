const { body } = require("express-validator");

exports.productValidation = [
  body("title").isString().isLength({ min: 3 }).trim(),
  body("price").isFloat(),
  body("description").isLength({ min: 5, max: 400 }).trim(),
];
