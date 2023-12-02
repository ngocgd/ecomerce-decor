const shopModel = require("../models/shop.model")

const findByEmail = async ({ email, select = {
    email: 1, password: 2, name: 1, status: 1, roles: 1
} }) => {
    const data = await shopModel.findOne({ email }).select(select).lean()
    return data
}

module.exports = {
    findByEmail
}