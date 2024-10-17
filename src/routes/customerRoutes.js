const express = require('express');
const customerController = require('../controllers/customerController');
const { protect } = require('../middleware/authMiddleware');
const { validateUpdateProfile } = require('../middleware/validation');

const router = express.Router();

router.use(protect);

router.put('/update-profile', validateUpdateProfile, customerController.updateProfile);
router.delete('/delete-profile', customerController.deleteProfile);
router.get('/profile', customerController.getProfile);

module.exports = router;