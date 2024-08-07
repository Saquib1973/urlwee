import express from 'express';
import { getAllUrls, deleteUrl, createShortUrl, redirectUrl, getUserUrls, getUrlHits } from '../controllers/urlController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getAllUrls);
router.put('/delete', protect, deleteUrl);
router.post('/shortUrl', protect, createShortUrl);
router.get('/getUserUrls', protect, getUserUrls);
router.get('/hits', getUrlHits);
router.get('/:shortUrl', redirectUrl);

export default router;
