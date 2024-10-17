const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  content: {
    type: String
  },
  media: {
    type: {
      type: String,
      enum: ['photo', 'video'],
    },
    url: String,
    size: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

messageSchema.pre('save', function(next) {
  if (this.isModified('content') || this.isModified('media')) {
    this.updatedAt = Date.now();
  }
  next();
});

module.exports = mongoose.model('Message', messageSchema);