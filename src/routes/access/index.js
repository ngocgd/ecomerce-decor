
const express = require('express');
const accessController = require('../../controllers/access.controller');
const { checkPermissions, asyncHandleError } = require('../../auth/checkAuth');
const router = express.Router();

//signup

router.post('/signup',asyncHandleError(accessController.signUp))

module.exports = router