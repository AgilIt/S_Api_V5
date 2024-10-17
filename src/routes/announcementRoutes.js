const express = require('express');
const announcementController = require('../controllers/announcementController');
const { protect } = require('../middleware/authMiddleware');
const { validateCreateAnnouncement, validateUpdateAnnouncement } = require('../middleware/validation');

const router = express.Router();

router.use(protect);

router.post('/', validateCreateAnnouncement, announcementController.createAnnouncement);
router.get('/', announcementController.getAllAnnouncements);
router.get('/department/:department', announcementController.getAnnouncementsByDepartment);
router.get('/:id', announcementController.getAnnouncement);
router.put('/:id', validateUpdateAnnouncement, announcementController.updateAnnouncement);
router.delete('/:id', announcementController.deleteAnnouncement);

module.exports = router;