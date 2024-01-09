
const express = require('express');
const { checkPermissions, asyncHandleError } = require('../../auth/checkAuth');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const productController = require('../../controllers/product.controller');
const router = express.Router();


router.use(authentication)

router.post('',asyncHandler(productController.createProduct))

///////////////////////
module.exports = router