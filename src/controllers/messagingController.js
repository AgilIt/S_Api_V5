const Conversation = require('../models/conversationModel');
const Message = require('../models/messageModel');
const Announcement = require('../models/announcementModel');
const { uploadToS3, getVideoDuration, deleteFromS3 } = require('../utils/fileUpload');

exports.startConversation = async (req, res, next) => {
  try {
    const { announcementId } = req.body;
    const clientId = req.customer.id;

    const announcement = await Announcement.findById(announcementId);
    if (!announcement) {
      return res.status(404).json({ status: 'fail', message: 'Announcement not found' });
    }

    if (announcement.customer.toString() === clientId) {
      return res.status(400).json({ status: 'fail', message: 'You cannot start a conversation with your own announcement' });
    }

    const existingConversation = await Conversation.findOne({
      announcement: announcementId,
      owner: announcement.customer,
      client: clientId
    });

    if (existingConversation) {
      return res.status(200).json({
        status: 'success',
        data: {
          conversation: existingConversation
        }
      });
    }

    const newConversation = await Conversation.create({
      announcement: announcementId,
      owner: announcement.customer,
      client: clientId
    });

    res.status(201).json({
      status: 'success',
      data: {
        conversation: newConversation
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getConversations = async (req, res, next) => {
  try {
    const customerId = req.customer.id;
    const conversations = await Conversation.find({
      $or: [{ owner: customerId }, { client: customerId }]
    }).populate('announcement', 'title');

    res.status(200).json({
      status: 'success',
      data: {
        conversations
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const customerId = req.customer.id;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ status: 'fail', message: 'Conversation not found' });
    }

    if (conversation.owner.toString() !== customerId && conversation.client.toString() !== customerId) {
      return res.status(403).json({ status: 'fail', message: 'You are not authorized to access this conversation' });
    }

    const messages = await Message.find({ conversation: conversationId }).sort('createdAt');

    res.status(200).json({
      status: 'success',
      data: {
        messages
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;
    const senderId = req.customer.id;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ status: 'fail', message: 'Conversation not found' });
    }

    if (conversation.owner.toString() !== senderId && conversation.client.toString() !== senderId) {
      return res.status(403).json({ status: 'fail', message: 'You are not authorized to send messages in this conversation' });
    }

    let mediaData = null;
    if (req.file) {
      const uploadResult = await uploadToS3(req.file);
      
      mediaData = {
        type: req.file.mimetype.startsWith('image') ? 'photo' : 'video',
        url: uploadResult.Location,
        size: req.file.size
      };

      if (mediaData.type === 'video') {
        const duration = await getVideoDuration(uploadResult.Location);
        if (duration > 10) {
          await deleteFromS3(uploadResult.Key);
          return res.status(400).json({ status: 'fail', message: 'Video duration exceeds the maximum limit of 10 seconds' });
        }
      }
    }

    const newMessage = await Message.create({
      conversation: conversationId,
      sender: senderId,
      content,
      media: mediaData
    });

    conversation.lastMessage = newMessage._id;
    conversation.updatedAt = Date.now();
    await conversation.save();

    res.status(201).json({
      status: 'success',
      data: {
        message: newMessage
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.editMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const customerId = req.customer.id;

    const message = await Message.findById(messageId).populate('conversation');

    if (!message) {
      return res.status(404).json({ status: 'fail', message: 'Message not found' });
    }

    if (message.sender.toString() !== customerId) {
      return res.status(403).json({ status: 'fail', message: 'You are not authorized to edit this message' });
    }

    if (message.conversation.owner.toString() !== customerId && message.conversation.client.toString() !== customerId) {
      return res.status(403).json({ status: 'fail', message: 'You are not authorized to edit messages in this conversation' });
    }

    message.content = content;
    message.updatedAt = Date.now();
    await message.save();

    res.status(200).json({
      status: 'success',
      data: {
        message
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const customerId = req.customer.id;

    const message = await Message.findById(messageId).populate('conversation');

    if (!message) {
      return res.status(404).json({ status: 'fail', message: 'Message not found' });
    }

    if (message.sender.toString() !== customerId) {
      return res.status(403).json({ status: 'fail', message: 'You are not authorized to delete this message' });
    }

    if (message.conversation.owner.toString() !== customerId && message.conversation.client.toString() !== customerId) {
      return res.status(403).json({ status: 'fail', message: 'You are not authorized to delete messages in this conversation' });
    }

    if (message.media) {
      const key = message.media.url.split('/').pop();
      await deleteFromS3(key);
    }

    await Message.findByIdAndDelete(messageId);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};