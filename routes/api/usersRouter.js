// const express = require('express')
import express from 'express';
import { ctrlWrapper } from '../../helpers/ctrlWrapper.js';
// prettier-ignore
import { getCurrentUsers, loginUser, logoutUser, signupUser, updateAvatar, updateUserSubscription } from '../../controllers/usersControllers.js';
import { authToken } from '../../middlewares/authToken.js';
import { upload } from '../../middlewares/upload.js';

const router = express.Router();

/* POST: // http://localhost:3000/api/users/signup
{
  "email": "ramon@example.com",
  "password": "examplepassword"
} */

router.post('/signup', ctrlWrapper(signupUser));

// POST: // http://localhost:3000/api/users/login
router.post('/login', ctrlWrapper(loginUser));

// GET: // http://localhost:3000/api/users/logout
router.get('/logout', authToken, ctrlWrapper(logoutUser));

// GET: // http://localhost:3000/api/users/current
router.get('/current', authToken, ctrlWrapper(getCurrentUsers));

router.patch('/', authToken, ctrlWrapper(updateUserSubscription));
/* PATCH: http://localhost:3000/api/users/avatars form-data avatar, file: image */

// prettier-ignore
router.patch('/avatars',authToken, upload.single("avatar"), ctrlWrapper(updateAvatar)
);

// module.exports = router;
export { router };
