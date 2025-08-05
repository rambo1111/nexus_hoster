// controllers/siteController.js
const Site = require('../models/siteModel.js');
const { getGfs } = require('../config/db.js');
const mongoose = require('mongoose');

exports.listSites = async (req, res) => {
    try {
        const sites = await Site.find({ owner: req.user._id });
        const siteNames = sites.map(site => site.siteName);
        res.json(siteNames);
    } catch (error) {
        res.status(500).json({ message: 'Failed to list sites.' });
    }
};

exports.getSiteDetails = async (req, res) => {
    const { siteName } = req.params;
    try {
        const site = await Site.findOne({ siteName, owner: req.user._id });
        if (!site) return res.status(404).json({ message: 'Site not found.' });
        
        const files = site.files.map(f => f.filename);
        res.json({
            siteName: site.siteName,
            url: `/sites/${site.siteName}/index.html`,
            files: files
        });
    } catch (error) {
        res.status(404).json({ message: 'Site not found.' });
    }
};

exports.createSite = async (req, res) => {
    const { siteName } = req.body;
    const files = req.files;

    if (!siteName || !files || files.length === 0) {
        return res.status(400).json({ message: 'Site name and files are required.' });
    }
    if (!files.some(f => f.originalname === 'index.html')) {
        return res.status(400).json({ message: 'Deployment failed: index.html not found.' });
    }

    const siteExists = await Site.findOne({ siteName });
    if (siteExists) {
        return res.status(400).json({ message: `Site '${siteName}' already exists.` });
    }

    const site = new Site({
        owner: req.user._id,
        siteName,
        files: files.map(file => ({
            fileId: file.id,
            filename: file.originalname,
            contentType: file.contentType,
            uploadDate: file.uploadDate,
        })),
    });

    try {
        await site.save();
        const url = `/sites/${site.siteName}/index.html`;
        res.status(201).json({ message: 'Deployment successful!', url, siteName });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred on the server.' });
    }
};

exports.deleteSite = async (req, res) => {
    const { siteName } = req.params;
    try {
        const site = await Site.findOneAndDelete({ siteName, owner: req.user._id });
        if (!site) return res.status(404).json({ message: "Site not found or you don't have permission." });

        // Get the 'sites' bucket specifically
        const gfs = getGfs('sites');
        if (!gfs) return res.status(500).json({ message: 'Storage not initialized' });

        for (const file of site.files) {
            await gfs.delete(new mongoose.Types.ObjectId(file.fileId));
        }
        res.status(200).json({ message: `Site '${siteName}' deleted successfully.` });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete site.' });
    }
};

exports.serveSiteFile = async (req, res) => {
    const { siteName, fileName } = req.params;
    try {
        const site = await Site.findOne({ siteName });
        if (!site) return res.status(404).send('Site not found');

        const fileInfo = site.files.find(f => f.filename === fileName);
        if (!fileInfo) return res.status(404).send('File not found');

        // Get the 'sites' bucket specifically
        const gfs = getGfs('sites');
        if (!gfs) return res.status(500).json({ message: 'Storage not initialized' });
        
        res.set('Content-Type', fileInfo.contentType);
        const downloadStream = gfs.openDownloadStream(new mongoose.Types.ObjectId(fileInfo.fileId));
        downloadStream.pipe(res);
    } catch (error) {
        res.status(500).send('Server error');
    }
};
