import express from 'express';
import { check } from 'express-validator';
import { createSale } from '../controllers/salesController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, [
    check('bookstoreId', 'El ID de la llibreria és obligatori').not().isEmpty(),
    check('saleDate', 'La data de venda és obligatòria').not().isEmpty(),
    check('books', 'Els llibres són obligatoris').isArray(),
    check('books.*.bookId', 'El ID del llibre és obligatori').not().isEmpty(),
    check('books.*.quantity', 'La quantitat ha de ser un número').isInt({ min: 1 })
], createSale);

export default router;
