'use strict'

const { CREATED, SuccessResponse } = require("../core/sucess.response");
const ProductServices = require("../services/product.service");


class ProductController {
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create product success',
            metadata: await ProductServices.createProduct(req.body.product_type, req.body)
        }).send(res)
    }
}

module.exports = new ProductController();