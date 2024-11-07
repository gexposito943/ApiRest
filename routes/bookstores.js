import express from 'express';
import { check } from 'express-validator';
import { createBookstore } from '../controllers/bookstoresController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, [
    check('name', 'El nom és obligatori').not().isEmpty(),
    check('location', 'La localització és obligatòria').not().isEmpty(),
    check('contact.phone', 'El telèfon és obligatori').not().isEmpty(),
    check('contact.email', 'El email és obligatori').isEmail()
], createBookstore);

export default router;
