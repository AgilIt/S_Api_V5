const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  type: {
    type: String,
    enum: ['sale', 'rental'],
    required: true
  },
  dailyPrice: {
    type: Number,
    required: function() { return this.type === 'rental'; }
  },
  salePrice: {
    type: Number,
    required: function() { return this.type === 'sale'; }
  },
  deposit: {
    type: Number,
    required: function() { return this.type === 'rental'; }
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  media: [{
    type: String,
    required: true
  }],
  availabilityCalendar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Availability',
    required: function() { return this.type === 'rental'; }
  },
  manualConfirmation: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

announcementSchema.statics.getAnnouncementsByDepartment = function(department) {
  return this.aggregate([
    {
      $lookup: {
        from: 'customers',
        localField: 'customer',
        foreignField: '_id',
        as: 'customerDetails'
      }
    },
    {
      $unwind: '$customerDetails'
    },
    {
      $match: {
        'customerDetails.department': department
      }
    },
    {
      $project: {
        'customerDetails.password': 0,
        'customerDetails.email': 0,
        'customerDetails.phone': 0
      }
    }
  ]);
};

module.exports = mongoose.model('Announcement', announcementSchema);