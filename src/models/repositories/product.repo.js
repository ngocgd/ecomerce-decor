'use strict'

const { Types } = require('mongoose')
const { product, electronic, clothing, furniture } = require('../../models/product.model')
const { getSelectData, getUnSelectData } = require('../../utils')

const findAllDraftForShop = async ({ query, limit, skip }) => {
    // console.log(query,limit,skip)
    return await queryProduct({ query, limit, skip })
}

const findAllPublishForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const searchProductByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch)
    const results = await product.find({
        $text: {
            $search: regexSearch
        }
    },
        { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } }
        )
        .lean()
    return results
}

const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if (!foundShop) return null
    foundShop.isDraft = false
    foundShop.isPublish = true
    const { modifiedCount } = await foundShop.updateOne(foundShop)
    return modifiedCount
}

const unPublishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if (!foundShop) return null
    foundShop.isDraft = true
    foundShop.isPublish = false
    const { modifiedCount } = await foundShop.updateOne(foundShop)
    return modifiedCount
}

const queryProduct = async ({ query, limit, skip }) => {
    return await product.findOne({
        ...query
    })
        .populate('product_shop', 'name email -_id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const products = await product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()
        .exec()
    return products
}

const findProduct = async ({ product_id, unSelect }) => {
    return await product.findById(product_id).select(getUnSelectData(unSelect))
}

const updateProductById = async ({
    productId,
    bodyUpdate,
    model,
    isNew = true
}) => {
    return await model.findByIdAndUpdate(productId, bodyUpdate, {
        new: isNew
    })
}
module.exports = {
    findAllDraftForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById
}