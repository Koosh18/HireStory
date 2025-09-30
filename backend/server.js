require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectToDatabase } = require('./src/utils/db');

const authRoutes = require('./src/routes/auth');
const experienceRoutes = require('./src/routes/experiences');

const app = express();

// Middleware
const allowedOrigin = process.env.FRONTEND_URL || '*';
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/auth', authRoutes);
app.use('/experiences', experienceRoutes);

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
});

const path = require('path');
// Serve frontend build if present (Render static deployment)
const clientBuildPath = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(clientBuildPath));
app.get('*', (req, res, next) => {
  // Avoid intercepting API routes
  if (req.path.startsWith('/auth') || req.path.startsWith('/experiences') || req.path.startsWith('/health')) return next();
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

const PORT = process.env.PORT || 10000;

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', error);
    process.exit(1);
  });


