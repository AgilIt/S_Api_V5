const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  announcement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Announcement',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  startDate: {
    type: Date,
    required: function() { return this.type === 'rental'; }
  },
  endDate: {
    type: Date,
    required: function() { return this.type === 'rental'; }
  },
  type: {
    type: String,
    enum: ['sale', 'rental'],
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  deposit: {
    type: Number,
    required: function() { return this.type === 'rental'; }
  },
  transporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transporter',
    required: function() { return this.type === 'sale'; }
  },
  status: {
    type: String,
    enum: ['pending confirmation', 'confirmed', 'paid', 'disputed', 'completed'],
    default: 'pending confirmation'
  }
});

transactionSchema.pre('save', async function(next) {
  if (this.isNew) {
    const Announcement = mongoose.model('Announcement');
    const announcement = await Announcement.findById(this.announcement);

    if (!announcement) {
      return next(new Error('Announcement not found'));
    }

    this.seller = announcement.customer;
    this.type = announcement.type;

    if (this.type === 'rental') {
      const days = Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
      this.totalPrice = announcement.dailyPrice * days;
      this.deposit = announcement.deposit;
    } else {
      this.totalPrice = announcement.salePrice;
    }
  }
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);