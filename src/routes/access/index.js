
const express = require('express');
const accessController = require('../../controllers/access.controller');
const { checkPermissions } = require('../../auth/checkAuth');
const router = express.Router();

//signup

router.post('/signup',accessController.signUp)

module.exports = router