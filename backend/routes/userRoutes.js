import express from 'express';
import {
    registerUser,
    loginUser,
    updateUsername,
    updatePassword,
    checkUsernameAvailability,
} from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';  // Import middleware

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/update-username', protect, updateUsername);  // Protect these routes
router.put('/update-password', protect, updatePassword);
router.get('/check-username', checkUsernameAvailability);

export default router;
