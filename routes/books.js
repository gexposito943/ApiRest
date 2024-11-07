import express from 'express';
import { check } from 'express-validator';
import { 
    getBooks, 
    createBook, 
    updateBook, 
    deleteBook, 
    getBookstoresWithStock 
} from '../controllers/booksController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getBooks);
router.post('/', auth, [
    check('details.title', 'El títol és obligatori').not().isEmpty(),
    check('details.author', 'L\'autor és obligatori').not().isEmpty(),
    check('details.publishedYear', 'L\'any de publicació ha de ser un número').isInt(),
    check('details.genres', 'Els gèneres han de ser un array').isArray(),
    check('details.summary', 'El resum és obligatori').not().isEmpty()
], createBook);
router.put('/:id', auth, updateBook);
router.delete('/:id', auth, deleteBook);
router.get('/:id/bookstores', auth, getBookstoresWithStock);

export default router;
