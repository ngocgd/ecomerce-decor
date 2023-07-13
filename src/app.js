/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');

const app = express();
// init middleware;
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
  extended : true
}))
// init db
require('./dbs/init.mongodb');
// const { checkOverLoad } = require('./helpers/check.connect')
// checkOverLoad()
// init routes
app.use('/',require('./routes/index.routes'))
// handling errors
module.exports = app;
