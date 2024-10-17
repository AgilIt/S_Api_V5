const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  announcement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Announcement',
    required: true
  },
  availableDates: [{
    type: Date,
    required: true
  }],
  rentedDates: [{
    type: Date,
    required: true
  }]
});

module.exports = mongoose.model('Availability', availabilitySchema);