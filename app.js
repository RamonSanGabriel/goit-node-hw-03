// const express = require('express')
// const logger = require('morgan');
// const cors = require('cors');
import express from 'express';
import logger from 'morgan';
import cors from 'cors';

// const contactsRouter = require('./routes/api/contacts');
import { router as contactsRouter } from './routes/api/contactsRouter.js';

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

// module.exports = app;
export { app };
