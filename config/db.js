// config/db.js
const mongoose = require('mongoose');
mongoose.set('strictQuery', true); // Add this line
const { GridFSBucket } = require('mongodb');

let gfsBuckets = {};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Initialize specific GridFS buckets on connection
    gfsBuckets.sites = new GridFSBucket(conn.connection.db, {
        bucketName: 'sites'
    });
    gfsBuckets.avatars = new GridFSBucket(conn.connection.db, {
        bucketName: 'avatars'
    });

  } catch (error) {
    console.error(`Error connecting to DB: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Get a specific GridFS bucket by name.
 * @param {string} bucketName - The name of the bucket ('sites' or 'avatars').
 * @returns {GridFSBucket} The GridFSBucket instance.
 */
const getGfs = (bucketName = 'sites') => gfsBuckets[bucketName];

module.exports = { connectDB, getGfs };
