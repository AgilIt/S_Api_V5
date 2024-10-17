const Transaction = require('../models/transactionModel');
const Announcement = require('../models/announcementModel');
const Availability = require('../models/availabilityModel');

exports.createTransaction = async (req, res, next) => {
  try {
    const { announcementId, startDate, endDate } = req.body;
    const buyer = req.customer.id;

    const announcement = await Announcement.findById(announcementId);
    if (!announcement) {
      return res.status(404).json({
        status: 'fail',
        message: 'Announcement not found'
      });
    }

    if (announcement.type === 'rental') {
      const availability = await Availability.findById(announcement.availabilityCalendar);
      const requestedDates = getDatesInRange(new Date(startDate), new Date(endDate));
      const isAvailable = requestedDates.every(date => 
        availability.availableDates.includes(date) && !availability.rentedDates.includes(date)
      );

      if (!isAvailable) {
        return res.status(400).json({
          status: 'fail',
          message: 'The requested dates are not available'
        });
      }
    }

    const transaction = await Transaction.create({
      announcement: announcementId,
      buyer,
      startDate,
      endDate
    });

    if (announcement.manualConfirmation) {
      transaction.status = 'pending confirmation';
    } else {
      transaction.status = 'confirmed';
      // Here you would typically initiate the payment process
    }

    await transaction.save();

    res.status(201).json({
      status: 'success',
      data: {
        transaction
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({
        status: 'fail',
        message: 'Transaction not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        transaction
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTransactionStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        status: 'fail',
        message: 'Transaction not found'
      });
    }

    if (transaction.seller.toString() !== req.customer.id && 
        transaction.buyer.toString() !== req.customer.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not authorized to update this transaction'
      });
    }

    transaction.status = status;
    await transaction.save();

    res.status(200).json({
      status: 'success',
      data: {
        transaction
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ buyer: req.customer.id }, { seller: req.customer.id }]
    });

    res.status(200).json({
      status: 'success',
      results: transactions.length,
      data: {
        transactions
      }
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to get all dates in a range
function getDatesInRange(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}