const express = require('express');
const multer = require('multer');
const messagingController = require('../controllers/messagingController');
const { protect } = require('../middleware/authMiddleware');
const { validateStartConversation, validateSendMessage, validateEditMessage } = require('../middleware/validation');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.use(protect);

/**
 * @swagger
 * /api/messaging/conversations:
 *   post:
 *     summary: Start a new conversation
 *     description: |
 *       [EN] Start a new conversation for a specific announcement.
 *       [FR] Démarrer une nouvelle conversation pour une annonce spécifique.
 *     tags: [Messaging]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - announcementId
 *             properties:
 *               announcementId:
 *                 type: string
 *                 description: |
 *                   [EN] ID of the announcement
 *                   [FR] ID de l'annonce
 *     responses:
 *       201:
 *         description: |
 *           [EN] Conversation started successfully
 *           [FR] Conversation démarrée avec succès
 *       400:
 *         description: |
 *           [EN] Invalid input or user is the owner of the announcement
 *           [FR] Entrée invalide ou l'utilisateur est le propriétaire de l'annonce
 *       404:
 *         description: |
 *           [EN] Announcement not found
 *           [FR] Annonce non trouvée
 */
router.post('/conversations', validateStartConversation, messagingController.startConversation);

/**
 * @swagger
 * /api/messaging/conversations:
 *   get:
 *     summary: Get all conversations for the user
 *     description: |
 *       [EN] Retrieve all conversations for the authenticated user.
 *       [FR] Récupérer toutes les conversations pour l'utilisateur authentifié.
 *     tags: [Messaging]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: |
 *           [EN] Conversations retrieved successfully
 *           [FR] Conversations récupérées avec succès
 */
router.get('/conversations', messagingController.getConversations);

/**
 * @swagger
 * /api/messaging/conversations/{conversationId}/messages:
 *   get:
 *     summary: Get messages in a conversation
 *     description: |
 *       [EN] Retrieve all messages in a specific conversation.
 *       [FR] Récupérer tous les messages d'une conversation spécifique.
 *     tags: [Messaging]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *         description: |
 *           [EN] ID of the conversation
 *           [FR] ID de la conversation
 *     responses:
 *       200:
 *         description: |
 *           [EN] Messages retrieved successfully
 *           [FR] Messages récupérés avec succès
 *       403:
 *         description: |
 *           [EN] User is not authorized to access this conversation
 *           [FR] L'utilisateur n'est pas autorisé à accéder à cette conversation
 *       404:
 *         description: |
 *           [EN] Conversation not found
 *           [FR] Conversation non trouvée
 */
router.get('/conversations/:conversationId/messages', messagingController.getMessages);

/**
 * @swagger
 * /api/messaging/conversations/{conversationId}/messages:
 *   post:
 *     summary: Send a message in a conversation
 *     description: |
 *       [EN] Send a new message in a specific conversation.
 *       [FR] Envoyer un nouveau message dans une conversation spécifique.
 *     tags: [Messaging]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *         description: |
 *           [EN] ID of the conversation
 *           [FR] ID de la conversation
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: |
 *                   [EN] Content of the message
 *                   [FR] Contenu du message
 *               media:
 *                 type: string
 *                 format: binary
 *                 description: |
 *                   [EN] Media file (image or video)
 *                   [FR] Fichier média (image ou vidéo)
 *     responses:
 *       201:
 *         description: |
 *           [EN] Message sent successfully
 *           [FR] Message envoyé avec succès
 *       403:
 *         description: |
 *           [EN] User is not authorized to send messages in this conversation
 *           [FR] L'utilisateur n'est pas autorisé à envoyer des messages dans cette conversation
 *       404:
 *         description: |
 *           [EN] Conversation not found
 *           [FR] Conversation non trouvée
 */
router.post('/conversations/:conversationId/messages', upload.single('media'), validateSendMessage, messagingController.sendMessage);

/**
 * @swagger
 * /api/messaging/messages/{messageId}:
 *   put:
 *     summary: Edit a message
 *     description: |
 *       [EN] Edit the content of an existing message.
 *       [FR] Modifier le contenu d'un message existant.
 *     tags: [Messaging]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: |
 *           [EN] ID of the message to edit
 *           [FR] ID du message à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: |
 *                   [EN] New content of the message
 *                   [FR] Nouveau contenu du message
 *     responses:
 *       200:
 *         description: |
 *           [EN] Message edited successfully
 *           [FR] Message modifié avec succès
 *       403:
 *         description: |
 *           [EN] User is not authorized to edit this message
 *           [FR] L'utilisateur n'est pas autorisé à modifier ce message
 *       404:
 *         description: |
 *           [EN] Message not found
 *           [FR] Message non trouvé
 */
router.put('/messages/:messageId', validateEditMessage, messagingController.editMessage);

/**
 * @swagger
 * /api/messaging/messages/{messageId}:
 *   delete:
 *     summary: Delete a message
 *     description: |
 *       [EN] Delete an existing message.
 *       [FR] Supprimer un message existant.
 *     tags: [Messaging]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: |
 *           [EN] ID of the message to delete
 *           [FR] ID du message à supprimer
 *     responses:
 *       204:
 *         description: |
 *           [EN] Message deleted successfully
 *           [FR] Message supprimé avec succès
 *       403:
 *         description: |
 *           [EN] User is not authorized to delete this message
 *           [FR] L'utilisateur n'est pas autorisé à supprimer ce message
 *       404:
 *         description: |
 *           [EN] Message not found
 *           [FR] Message non trouvé
 */
router.delete('/messages/:messageId', messagingController.deleteMessage);

module.exports = router;