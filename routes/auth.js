import express from 'express';
import { check } from 'express-validator';
import { registrar, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/registrar', [
    check('nomUsuari', 'El nom d\'usuari és obligatori').not().isEmpty(),
    check('contrasenya', 'La contrasenya ha de tenir almenys 6 caràcters').isLength({ min: 6 })
], registrar);

router.post('/iniciar-sessio', [
    check('nomUsuari', 'El nom d\'usuari és obligatori').not().isEmpty(),
    check('contrasenya', 'La contrasenya és obligatòria').not().isEmpty()
], login);

export default router; 