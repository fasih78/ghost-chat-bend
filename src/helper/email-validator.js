const validator = require('validator');

const emailValidation = (req, res, next) => {
  const { formData } = req.body;
  console.log(req.body, 'formData')
  console.log('File uploaded:', req.file);
  const email = req.body.email
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const trimmedEmail = email.trim();
  const isEmailValid = validator.isEmail(trimmedEmail);

  if (!isEmailValid) {
    return res.status(400).json({ message: "Invalid email address" });
  }
  req.isEmailValid = true;
  next();
};

module.exports = emailValidation