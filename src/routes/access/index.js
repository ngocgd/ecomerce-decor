
const express = require('express');
const accessController = require('../../controllers/access.controller');
const { checkPermissions, asyncHandleError } = require('../../auth/checkAuth');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

//signup

router.post('/signup',asyncHandler(accessController.signUp))

router.post('/login',asyncHandler(accessController.login))
router.use(authentication)
router.post('/logout',asyncHandler(accessController.logout))


///////////////////////
module.exports = router