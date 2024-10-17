const express = require('express');
const transactionController = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');
const { validateCreateTransaction, validateUpdateTransactionStatus } = require('../middleware/validation');

const router = express.Router();

router.use(protect);

router.post('/', validateCreateTransaction, transactionController.createTransaction);
router.get('/:id', transactionController.getTransaction);
router.patch('/:id/status', validateUpdateTransactionStatus, transactionController.updateTransactionStatus);

module.exports = router;