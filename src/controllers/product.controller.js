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

    updateProduct = async (req, res, next) => {
        try{
            new SuccessResponse({
                message: 'Update product success',
                metadata: await ProductServicesV2.updateProduct(
                    req.body.product_type,
                    req.params.productId,
                    {
                        ...req.body,
                        product_shop: req.user.userId
                    }
                )
            }).send(res)
        }catch(e){
            console.log(e)
            throw(e)
        }
        
    }

    publishProductByShop = async (req, res, next) => {
        req.body.product_shop = req.user.userId
        new SuccessResponse({
            message: 'Publish product by shop',
            metadata: await ProductServicesV2.publishProductByShop({
                product_shop: req.body.product_shop,
                product_id: req.params.id
            })
        }).send(res)
    }

    unPublishProductByShop = async (req, res, next) => {
        req.body.product_shop = req.user.userId
        new SuccessResponse({
            message: 'unPublish product by shop',
            metadata: await ProductServicesV2.unPublishProductByShop({
                product_shop: req.body.product_shop,
                product_id: req.params.id
            })
        }).send(res)
    }

    //QUERY//
    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list Draft success',
            metadata: await ProductServicesV2.findAllDraftForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }
    //END QUERY//

    //QUERY//
    getAllPublishsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list Publish success',
            metadata: await ProductServicesV2.findAllPublishForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }
    //END QUERY//
    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list search product',
            metadata: await ProductServicesV2.searchProducts(req.params)
        }).send(res)
    }

    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list findAllProducts product',
            metadata: await ProductServicesV2.findAllProducts(req.query)
        }).send(res)
    }

    findProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list findProduct product',
            metadata: await ProductServicesV2.findProduct({
                product_id: req.params.product_id
            })
        }).send(res)
    }

}

module.exports = new ProductController();