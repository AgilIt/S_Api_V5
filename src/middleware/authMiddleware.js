const jwt = require('jsonwebtoken');
const Customer = require('../models/customerModel');

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in. Please log in to get access.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const currentCustomer = await Customer.findById(decoded.id);
    if (!currentCustomer) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists.'
      });
    }

    req.customer = currentCustomer;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid token. Please log in again.'
    });
  }
};