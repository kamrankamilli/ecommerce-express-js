const { body, validationResult } = require("express-validator");
exports.validateReset = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).render("auth/reset", {
        path: "/reset",
        pageTitle: "Reset",
        errorMessages: errors.array(),
        previousInput: { email: req.body.email },
      });
    next();
  },
];
