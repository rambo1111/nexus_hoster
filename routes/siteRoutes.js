const express = require('express');
const router = express.Router();
const siteController = require('../controllers/siteController');
const { uploadSite } = require('../config/storage'); // Correctly import uploadSite
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', siteController.listSites);
router.post('/', uploadSite.array('files'), siteController.createSite); // Use uploadSite

router.get('/:siteName', siteController.getSiteDetails);
router.delete('/:siteName', siteController.deleteSite);

module.exports = router;
