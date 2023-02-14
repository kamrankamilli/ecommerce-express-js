const { body, validationResult } = require("express-validator");
exports.validateLogin = [
  body("email").isEmail().withMessage("Please enter a valid email").normalizeEmail(),
  body("password").notEmpty().withMessage("Please enter your password").trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        errorMessages: errors.array(),
        previousInput: { email: req.body.email },
        //validationErrors: errors.array(),
      });
    next();
  },
];
