import express from 'express';
import { ctrlWrapper } from '../../helpers/ctrlWrapper.js';
import { authToken } from '../../middlewares/authToken.js';
// prettier-ignore
import {addContact, deleteContactById, getAllContacts, getContactById, updateContactById, updateStatusContact} from '../../controllers/contactsController.js';

const router = express.Router();

/* GET: // http://localhost:3000/api/contacts */
router.get('/', authToken, ctrlWrapper(getAllContacts));

/* GET: // http://localhost:3000/api/contacts/:contactId */
router.get('/:contactId', authToken, ctrlWrapper(getContactById));

/* POST: // http://localhost:3000/api/users/signup
{
  "email": "ramon@example.com",
  "password": "examplepassword"
} */

router.post('/', authToken, ctrlWrapper(addContact));

/* DELETE: // http://localhost:3000/api/contacts/:contactId */
router.delete('/:contactId', authToken, ctrlWrapper(deleteContactById));

/* PUT: // http://localhost:3000/api/contacts/:contactId  */
router.put('/:contactId', authToken, ctrlWrapper(updateContactById));

/* PATCH: // http://localhost:3000/api/contacts/:contactId/favorite */
router.patch(
  '/:contactId/favorite',
  authToken,
  ctrlWrapper(updateStatusContact)
);

export { router };
