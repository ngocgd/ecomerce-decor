'use strict'

const { BadRequestError } = require('../core/error.response')
const { product, clothing, electronic, furniture } = require('../models/product.model')

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
        console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXX',productClass)
        if (!productClass) throw new BadRequestError(`Invalid product type ${type}`)
        return new productClass(payload).createProduct()
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
        return await product.create({
            ...this,
            _id: product_id
        })
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
}

ProductFactory.registerProductType('Electronics',Electronics)
ProductFactory.registerProductType('Clothing',Clothing)
ProductFactory.registerProductType('Furniture',Furniture)

module.exports = ProductFactory