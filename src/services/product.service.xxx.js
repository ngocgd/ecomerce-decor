'use strict'

const { BadRequestError } = require('../core/error.response')
const { product, clothing, electronic, furniture } = require('../models/product.model')
const { insertInventory } = require('../models/repositories/inventory.repo')
const { findAllDraftForShop, publishProductByShop, findAllPublishForShop, unPublishProductByShop, searchProductByUser, findAllProducts, findProduct, updateProductById } = require('../models/repositories/product.repo')
const { removeUndefinedObject, updateNestedObjectParser } = require('../utils')

class ProductFactory {
    /*
        type : clothing,
        payload
    */
    static produtRegistry = {}

    static registerProductType(type, classRef) {
        ProductFactory.produtRegistry[type] = classRef
    }
    static async createProduct(type, payload) {
        const productClass = ProductFactory.produtRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid product type ${type}`)
        return new productClass(payload).createProduct()
    }

    static async updateProduct(type, productId, payload) {
        const productClass = ProductFactory.produtRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid product type ${type}`)
        return new productClass(payload).updateProduct(productId, payload)
    }

    static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await findAllDraftForShop({ query, limit, skip })
    }

    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublish: true }
        return await findAllPublishForShop({ query, limit, skip })
    }

    //PUT//
    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id })
    }

    static async unPublishProductByShop({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_shop, product_id })
    }
    //END PUT//
    static async searchProducts({ keySearch }) {
        return await searchProductByUser({ keySearch })
    }

    static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublish: true } }) {
        return await findAllProducts({
            limit, sort, page, filter,
            select: ['product_name', 'product_price', 'product_thump']
        })
    }

    static async findProduct({ product_id }) {
        return await findProduct({ product_id, unSelect: ['__v'] })
    }
}
/*product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_price: { type: String, required: true },
    product_description: String,
    product_quantity: { type: String, required: true },
    product_type: { type: String, required: true, enum: ['Electronics', 'Clothing', 'Furniture'] },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, required: true }
 */
class Product {
    constructor({
        product_name, product_thumb, product_price,
        product_description, product_quantity, product_type,
        product_shop, product_attributes,
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_price = product_price
        this.product_description = product_description
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    async createProduct({ product_id }) {
        const newProduct = await product.create({
            ...this,
            _id: product_id
        })
        if(newProduct){
            await insertInventory({
                productId : newProduct._id,
                shopId : this.product_shop,
                stock : this.product_quantity,
            })
        }
        return newProduct
    }
    async updateProduct(productId, bodyUpdate) {
        return await updateProductById({ productId, bodyUpdate, model: product })
    }
}

class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newClothing) throw new BadRequestError('Create new Clothing error')
        const newProduct = await super.createProduct({ product_id: newClothing._id })
        if (!newProduct) throw new BadRequestError('Create new Product error')
        return newProduct
    }

    // remove atrr has null undefined
    // check xem update o dau
    async updateProduct(productId, payload) {
        const objectParams = removeUndefinedObject(this)
        //update child 
        if (objectParams.product_attributes) {
            await updateProductById({
                productId,
                bodyUpdate : updateNestedObjectParser(objectParams.product_attributes),
                model: clothing
            })
        }
        const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams))
        return updateProduct
    }
}

class Electronics extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElectronic) throw new BadRequestError('Create new Electronic error')
        const newProduct = await super.createProduct({ product_id: newElectronic._id })
        if (!newProduct) throw new BadRequestError('Create new Product error')
        return newProduct
    }
}

class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newFurniture) throw new BadRequestError('Create new Furniture error')
        const newProduct = await super.createProduct({ product_id: newFurniture._id })
        if (!newProduct) throw new BadRequestError('Create new Product error')
        return newProduct
    }
    async updateProduct(productId) {
        const objectParams = this
        if (objectParams.product_attributes) {
            await super.updateProduct({ productId, objectParams, model: furniture })
        }
        const updateProduct = await super.updateProduct(productId, objectParams)
        return updateProduct
    }
}

ProductFactory.registerProductType('Electronics', Electronics)
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Furniture', Furniture)

module.exports = ProductFactory