/* eslint-disable no-console */
import '@babel/polyfill';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import homeRouter from './routes/home/home';
import linkRouter from './routes/link/link';
import generateRouter from './routes/generate/generate';
import apiRegistrationRouter from './routes/api/v1/registration';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/', homeRouter);
app.use('/link', linkRouter);
app.use('/generate', generateRouter);
app.use('/api/v1/registration/', apiRegistrationRouter);

export default app;
