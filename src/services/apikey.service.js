'use strict'

const apikeyModel = require("../models/apikey.model")
const crypto = require('crypto')

const findKeyById = async (key) => {
    // const newKey = await apikeyModel.create({
    //     key : crypto.randomBytes(64).toString('hex'),
    //     permissions : ['0000']
    // })
    // console.log(newKey)
    const check = await apikeyModel.findOne({
        key
    }).lean()
    return check 
}

module.exports = {
    findKeyById
}