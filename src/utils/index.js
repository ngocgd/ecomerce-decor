'use strict'

const _ = require('lodash')
const crypto = require("crypto")
const { createTokenPair } = require('../auth/authUtils')

const getInfoData = (fields = [], object = {}) => {
    return _.pick(object, fields)
}
const generateToken = async ({ shop_id, email }) => {
    try {
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')
        const token = await createTokenPair({ userId: shop_id, email }, publicKey, privateKey)
        return token
    } catch (e) {
        console.log('---ERROR GENERATE TOKEN--------', e)
    }
}
module.exports = {
    getInfoData,
    generateToken
}