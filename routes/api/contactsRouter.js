// const express = require('express')
import express from 'express';
import {
  addContactValidation,
  favoriteValidation,
} from '../../validations/validations.js';
import { httpError } from '../../helpers/httpError.js';
import { Contact } from '../../models/contactsModel.js';

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const result = await Contact.find();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);
    if (!result) {
      throw httpError(404);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    // Preventing lack of necessary data
    const { error } = addContactValidation.validate(req.body);
    if (error) {
      throw httpError(400, 'Missing required name field');
    }
    const result = await Contact.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndDelete(contactId);

    if (!result) {
      throw httpError(404);
    }
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    next(error);
  }
});

router.put('/:contactId', async (req, res, next) => {
  try {
    const { error } = addContactValidation.validate(req.body);
    if (error) {
      throw httpError(400, 'Missing fields');
    }

    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });

    if (!result) {
      throw httpError(404);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.patch('/:contactId', async (req, res, next) => {
  try {
    const { error } = favoriteValidation.validate(req.body);
    if (error) {
      throw httpError(400, 'Missing field favorite');
    }

    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });

    if (!result) {
      throw httpError(404);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// module.exports = router;
export { router };
