const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const morgan = require('morgan');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const messagingRoutes = require('./routes/messagingRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/messaging', messagingRoutes);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "API Documentation",
  customfavIcon: "https://example.com/favicon.ico",
  swaggerOptions: {
    docExpansion: 'none',
    persistAuthorization: true,
    displayRequestDuration: true,
    defaultModelsExpandDepth: -1,
    defaultModelExpandDepth: 3,
    filter: true,
  }
}));

// Error handling middleware
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});