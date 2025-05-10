import express from 'express';
import { getContactsController } from '../controllers/contacts.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { register, login } from '../controllers/auth.js';

const router = express.Router();

router.get('/contacts', authMiddleware, getContactsController);
router.post('/register', register);
router.post('/login', login);

export default router;


