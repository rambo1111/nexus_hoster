const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// --- Storage Engine for Site Deployments ---
const siteStorage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      bucketName: 'sites', // Store site files in a 'sites' bucket
      filename: file.originalname,
      metadata: { siteName: req.body.siteName || req.params.siteName }
    };
  }
});

// --- Storage Engine for User Avatars ---
const avatarStorage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'avatars' // Store avatars in a separate 'avatars' bucket
        };
        resolve(fileInfo);
      });
    });
  }
});

const uploadSite = multer({ storage: siteStorage });
const uploadAvatar = multer({ storage: avatarStorage });

module.exports = { uploadSite, uploadAvatar };
