const Joi = require('joi');

// Auth Schemas
const signupSchema = Joi.object({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  birthdate: Joi.date().required(),
  address: Joi.string().required(),
  address_number: Joi.string().required(),
  postal_code: Joi.string().pattern(/^\d{5}$/).required(),
  city: Joi.string().required(),
  country: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
});

const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Customer Schema
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

// Announcement Schemas
const createAnnouncementSchema = Joi.object({
  type: Joi.string().valid('sale', 'rental').required(),
  dailyPrice: Joi.number().when('type', { is: 'rental', then: Joi.required() }),
  salePrice: Joi.number().when('type', { is: 'sale', then: Joi.required() }),
  deposit: Joi.number().when('type', { is: 'rental', then: Joi.required() }),
  title: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().required(),
  manualConfirmation: Joi.boolean()
});

const updateAnnouncementSchema = Joi.object({
  type: Joi.string().valid('sale', 'rental'),
  dailyPrice: Joi.number(),
  salePrice: Joi.number(),
  deposit: Joi.number(),
  title: Joi.string(),
  description: Joi.string(),
  category: Joi.string(),
  manualConfirmation: Joi.boolean()
}).min(1);

// Transaction Schemas
const createTransactionSchema = Joi.object({
  announcementId: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().min(Joi.ref('startDate')).required()
});

const updateTransactionStatusSchema = Joi.object({
  status: Joi.string().valid('pending confirmation', 'confirmed', 'paid', 'disputed', 'completed').required()
});

// Messaging Schemas
const startConversationSchema = Joi.object({
  announcementId: Joi.string().required()
});

const sendMessageSchema = Joi.object({
  content: Joi.string().allow('').optional(),
  media: Joi.any()
}).or('content', 'media');

const editMessageSchema = Joi.object({
  content: Joi.string().required()
});

// Validation Middleware Functions
exports.validateSignup = (req, res, next) => {
  const { error } = signupSchema.validate(req.body);
  if (error) return res.status(400).json({ status: 'fail', message: error.details[0].message });
  next();
};

exports.validateSignin = (req, res, next) => {
  const { error } = signinSchema.validate(req.body);
  if (error) return res.status(400).json({ status: 'fail', message: error.details[0].message });
  next();
};

exports.validateUpdateProfile = (req, res, next) => {
  const { error } = updateProfileSchema.validate(req.body);
  if (error) return res.status(400).json({ status: 'fail', message: error.details[0].message });
  next();
};

exports.validateCreateAnnouncement = (req, res, next) => {
  const { error } = createAnnouncementSchema.validate(req.body);
  if (error) return res.status(400).json({ status: 'fail', message: error.details[0].message });
  next();
};

exports.validateUpdateAnnouncement = (req, res, next) => {
  const { error } = updateAnnouncementSchema.validate(req.body);
  if (error) return res.status(400).json({ status: 'fail', message: error.details[0].message });
  next();
};

exports.validateCreateTransaction = (req, res, next) => {
  const { error } = createTransactionSchema.validate(req.body);
  if (error) return res.status(400).json({ status: 'fail', message: error.details[0].message });
  next();
};

exports.validateUpdateTransactionStatus = (req, res, next) => {
  const { error } = updateTransactionStatusSchema.validate(req.body);
  if (error) return res.status(400).json({ status: 'fail', message: error.details[0].message });
  next();
};

exports.validateStartConversation = (req, res, next) => {
  const { error } = startConversationSchema.validate(req.body);
  if (error) return res.status(400).json({ status: 'fail', message: error.details[0].message });
  next();
};

exports.validateSendMessage = (req, res, next) => {
  const { error } = sendMessageSchema.validate(req.body);
  if (error) return res.status(400).json({ status: 'fail', message: error.details[0].message });
  next();
};

exports.validateEditMessage = (req, res, next) => {
  const { error } = editMessageSchema.validate(req.body);
  if (error) return res.status(400).json({ status: 'fail', message: error.details[0].message });
  next();
};