
const express = require('express');
const { checkPermissions, asyncHandleError } = require('../../auth/checkAuth');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const productController = require('../../controllers/product.controller');
const router = express.Router();


router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct))
router.get('', asyncHandler(productController.findAllProducts))
router.get('/:product_id', asyncHandler(productController.findProduct))

router.use(authentication)

router.post('', asyncHandler(productController.createProduct))
router.patch('/:productId', asyncHandler(productController.updateProduct))
router.post('/publish/:id', asyncHandler(productController.publishProductByShop))
router.post('/unPublish/:id', asyncHandler(productController.unPublishProductByShop))

//QUERY//
/**
 * @description Get all Drafts for shop
 * @param {Number} limit
 * @param {Number} skip
 * @returns {JSON}
 */
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))

router.get('/published/all', asyncHandler(productController.getAllPublishsForShop))
//END QUERY//

///////////////////////
module.exports = router