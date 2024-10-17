const Joi = require('joi');

// ... (keep existing schemas and exports)

const updateProfileSchema = Joi.object({
  firstname: Joi.string(),
  lastname: Joi.string(),
  birthdate: Joi.date(),
  address: Joi.string(),
  address_number: Joi.string(),
  postal_code: Joi.string().pattern(/^\d{5}$/),
  city: Joi.string(),
  country: Joi.string(),
  phone: Joi.string(),
  email: Joi.string().email()
}).min(1);

exports.validateUpdateProfile = (req, res, next) => {
  const { error } = updateProfileSchema.validate(req.body);
  if (error) return res.status(400).json({ status: 'fail', message: error.details[0].message });
  next();
};

// ... (keep other existing exports)