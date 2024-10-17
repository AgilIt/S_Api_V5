const Customer = require('../models/customerModel');

exports.updateProfile = async (req, res, next) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.customer.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({
        status: 'fail',
        message: 'Customer not found'
      });
    }

    // Remove sensitive information
    updatedCustomer.password = undefined;

    res.status(200).json({
      status: 'success',
      data: {
        customer: updatedCustomer
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProfile = async (req, res, next) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.customer.id);

    if (!deletedCustomer) {
      return res.status(404).json({
        status: 'fail',
        message: 'Customer not found'
      });
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.customer.id);

    if (!customer) {
      return res.status(404).json({
        status: 'fail',
        message: 'Customer not found'
      });
    }

    // Remove sensitive information
    customer.password = undefined;

    res.status(200).json({
      status: 'success',
      data: {
        customer
      }
    });
  } catch (error) {
    next(error);
  }
};