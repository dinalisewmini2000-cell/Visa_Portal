const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/db'); // Initialize MySQL Connection

const applicationRoutes = require('./routes/applicationRoutes');
const jobRoutes = require('./routes/jobRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/applications', applicationRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/auth', authRoutes);

// Start server only if not in Vercel production environment
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel Serverless
module.exports = app;
