# Secure Node.js Server

## Commands and Useful URLs / Commandes et URLs Utiles

### English

#### Commands

- Start the development server: `npm run dev`
- Start the production server: `npm start`
- Run tests: `npm test` (Note: Tests need to be implemented)

#### Useful URLs

- API Documentation: `http://localhost:3000/api-docs`
- API Base URL: `http://localhost:3000/api`

### Français

#### Commandes

- Démarrer le serveur de développement : `npm run dev`
- Démarrer le serveur de production : `npm start`
- Exécuter les tests : `npm test` (Note : Les tests doivent être implémentés)

#### URLs Utiles

- Documentation de l'API : `http://localhost:3000/api-docs`
- URL de base de l'API : `http://localhost:3000/api`

## API Endpoints

### Authentication / Authentification

- POST `/api/auth/signup`: Register a new user / Enregistrer un nouvel utilisateur
- POST `/api/auth/signin`: Sign in a user / Connecter un utilisateur

### Customers / Clients

- PUT `/api/customers/update-profile`: Update user profile / Mettre à jour le profil utilisateur
- DELETE `/api/customers/delete-profile`: Delete user profile / Supprimer le profil utilisateur

### Announcements / Annonces

- POST `/api/announcements`: Create a new announcement / Créer une nouvelle annonce
- GET `/api/announcements`: Get all announcements / Obtenir toutes les annonces
- GET `/api/announcements/:id`: Get a specific announcement / Obtenir une annonce spécifique
- PUT `/api/announcements/:id`: Update an announcement / Mettre à jour une annonce
- DELETE `/api/announcements/:id`: Delete an announcement / Supprimer une annonce
- GET `/api/announcements/department/:department`: Get announcements by department / Obtenir les annonces par département

### Transactions

- POST `/api/transactions`: Create a new transaction / Créer une nouvelle transaction
- GET `/api/transactions/:id`: Get a specific transaction / Obtenir une transaction spécifique
- PATCH `/api/transactions/:id/status`: Update transaction status / Mettre à jour le statut d'une transaction

### Messaging / Messagerie

- POST `/api/messaging/conversations`: Start a new conversation / Démarrer une nouvelle conversation
- GET `/api/messaging/conversations`: Get all conversations / Obtenir toutes les conversations
- GET `/api/messaging/conversations/:conversationId/messages`: Get messages in a conversation / Obtenir les messages d'une conversation
- POST `/api/messaging/conversations/:conversationId/messages`: Send a message / Envoyer un message
- PUT `/api/messaging/messages/:messageId`: Edit a message / Modifier un message
- DELETE `/api/messaging/messages/:messageId`: Delete a message / Supprimer un message

## Environment Variables / Variables d'Environnement

Make sure to set the following environment variables in your `.env` file:

Assurez-vous de définir les variables d'environnement suivantes dans votre fichier `.env` :

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3000
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET_NAME=your_s3_bucket_name
```

Replace the placeholder values with your actual configuration.

Remplacez les valeurs d'exemple par votre configuration réelle.