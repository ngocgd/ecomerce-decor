const inventoryModel = require("../inventory.model")
const { Types } = require('mongoose')
const insertInventory = async ({
    productId, shopId, stock, location = 'unknown'
}) => {
    return await inventoryModel.create({
        inven_productId : productId,
        inven_stock : stock,
        inven_location : location,
        inven_shopId : shopId
    })
}

module.exports = {
    insertInventory
}