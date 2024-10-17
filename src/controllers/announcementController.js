const Announcement = require('../models/announcementModel');
const Availability = require('../models/availabilityModel');
const { uploadToS3, deleteFromS3 } = require('../utils/fileUpload');

exports.createAnnouncement = async (req, res, next) => {
  try {
    const { type, dailyPrice, salePrice, deposit, title, description, category, manualConfirmation } = req.body;
    const customer = req.customer.id;

    const announcement = await Announcement.create({
      customer,
      type,
      dailyPrice,
      salePrice,
      deposit,
      title,
      description,
      category,
      manualConfirmation
    });

    if (type === 'rental') {
      const availability = await Availability.create({
        announcement: announcement._id,
        availableDates: [],
        rentedDates: []
      });
      announcement.availabilityCalendar = availability._id;
      await announcement.save();
    }

    res.status(201).json({
      status: 'success',
      data: {
        announcement
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.find();

    res.status(200).json({
      status: 'success',
      results: announcements.length,
      data: {
        announcements
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        status: 'fail',
        message: 'Announcement not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        announcement
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        status: 'fail',
        message: 'Announcement not found'
      });
    }

    if (announcement.customer.toString() !== req.customer.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not authorized to update this announcement'
      });
    }

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: {
        announcement: updatedAnnouncement
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        status: 'fail',
        message: 'Announcement not found'
      });
    }

    if (announcement.customer.toString() !== req.customer.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not authorized to delete this announcement'
      });
    }

    await Announcement.findByIdAndDelete(req.params.id);

    if (announcement.type === 'rental') {
      await Availability.findByIdAndDelete(announcement.availabilityCalendar);
    }

    // Delete media files from S3
    for (const mediaUrl of announcement.media) {
      const key = mediaUrl.split('/').pop();
      await deleteFromS3(key);
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

exports.getAnnouncementsByDepartment = async (req, res, next) => {
  try {
    const { department } = req.params;
    
    if (!/^\d{2}$/.test(department)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid department format. Please provide a two-digit number.'
      });
    }

    const announcements = await Announcement.getAnnouncementsByDepartment(department);
    
    res.status(200).json({
      status: 'success',
      results: announcements.length,
      data: { announcements }
    });
  } catch (error) {
    next(error);
  }
};