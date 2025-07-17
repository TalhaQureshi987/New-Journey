import express from 'express';
import { submitContact, getContacts, getContact } from '../controllers/contactController.js';

const router = express.Router();

router.post('/', submitContact);

router.get('/', getContacts);
router.get('/:id', getContact);

export default router;