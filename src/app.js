/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');

const app = express();
// init middleware;
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
// init db
require('./dbs/init.mongodb')
// init routes
app.get('/haa', (req, res, next) => res.status(200).json({
  message: 'welcome',
}));
// handling errors
module.exports = app;
