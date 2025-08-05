// models/siteModel.js
const mongoose = require('mongoose');

const siteSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    siteName: {
        type: String,
        required: true,
        unique: true
    },
    files: [{
        fileId: { type: mongoose.Schema.Types.ObjectId },
        filename: { type: String },
        contentType: { type: String },
        uploadDate: { type: Date }
    }]
}, { timestamps: true });

const Site = mongoose.model('Site', siteSchema);
module.exports = Site;