'use strict'

const { CREATED, SuccessResponse } = require("../core/sucess.response");
const ProductServices = require("../services/product.service");
const ProductServicesV2 = require("../services/product.service.xxx");


class ProductController {
    createProduct = async (req, res, next) => {
        req.body.product_shop = req.user.userId
        new SuccessResponse({
            message: 'Create product success',
            metadata: await ProductServicesV2.createProduct(req.body.product_type, req.body)
        }).send(res)
    }
}

module.exports = new ProductController();