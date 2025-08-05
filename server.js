const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { connectDB, getGfs } = require('./config/db.js');
const authRoutes = require('./routes/authRoutes.js');
const siteRoutes = require('./routes/siteRoutes.js');
const siteController = require('./controllers/siteController');
const mongoose = require('mongoose');

connectDB();

const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/sites', siteRoutes);

// Dynamic Route to Serve Site Files
app.get('/sites/:siteName/:fileName', siteController.serveSiteFile);

// --- NEW: Dynamic Route to Serve Avatar Images ---
app.get('/api/auth/avatar/:filename', (req, res) => {
  const gfs = getGfs('avatars'); // Get the avatars bucket
  if (!gfs) {
    return res.status(500).json({ message: 'GridFS not initialized' });
  }
  gfs.find({ filename: req.params.filename }).toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({ message: 'File not found' });
    }
    gfs.openDownloadStreamByName(req.params.filename).pipe(res);
  });
});

// Fallback for Single Page Application
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`🚀 Server listening at ...`);
});



