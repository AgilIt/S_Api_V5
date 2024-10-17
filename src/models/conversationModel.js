const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  announcement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Announcement',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure that the combination of announcement, owner, and client is unique
conversationSchema.index({ announcement: 1, owner: 1, client: 1 }, { unique: true });

module.exports = mongoose.model('Conversation', conversationSchema);