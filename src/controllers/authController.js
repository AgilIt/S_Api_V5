const jwt = require('jsonwebtoken');
const Customer = require('../models/customerModel');

exports.signup = async (req, res, next) => {
  try {
    const { firstname, lastname, birthdate, address, address_number, postal_code, city, country, phone, email, password } = req.body;

    const newCustomer = await Customer.create({
      firstname,
      lastname,
      birthdate,
      address,
      address_number,
      postal_code,
      city,
      country,
      phone,
      email,
      password
    });

    const token = jwt.sign({ id: newCustomer._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.status(201).json({
      status: 'success',
      token,
      data: {
        customer: {
          id: newCustomer._id,
          firstname: newCustomer.firstname,
          lastname: newCustomer.lastname,
          email: newCustomer.email,
          phone: newCustomer.phone
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const customer = await Customer.findOne({ email }).select('+password');
    if (!customer || !(await customer.comparePassword(password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password'
      });
    }

    const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.status(200).json({
      status: 'success',
      token
    });
  } catch (error) {
    next(error);
  }
};