'use strict'

const { Schema } = require("mongoose")

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new Schema({
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_price: { type: String, required: true },
    product_description: String,
    product_quantity: { type: String, required: true },
    product_type: { type: String, required: true, enum: ['Electronics', 'Clothing', 'Furniture'] },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, required: true }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

const clothingSchema = new Schema({
    brand: { type: String, required: true },
    size: String,
    material: String,
}, {
    collection: 'clothes',
    timestamps: true
})

const electronicSchema = new Schema({
    manufacture: { type: String, required: true },
    model: String,
    color: String,
}, {
    collection: 'electronics',
    timestamps: true
})

module.exports = {
    product: mongoose.model(DOCUMENT_NAME, productSchema),
    electronic: mongoose.model('Electronics', electronicSchema),
    clothing: mongoose.model('Clothing', clothingSchema)
}