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

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}

const getUnSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}

const removeUndefinedObject = obj => {
    Object.keys(obj).forEach(k => {
        if (obj[k] === null) {
            delete obj[k]
        }
    })
    return obj
}

const updateNestedObjectParser = obj => {
    const final = {}
    console.log(obj)
    Object.keys(obj).forEach(k => {
        if (typeof obj[k] === 'object' && !Array.isArray(obj[k]) && obj[k] !== null) {
            const response = updateNestedObjectParser(obj[k])
            Object.keys(response).forEach(a => {
                final[`${k}.${a}`] = response[a]
            })
        }else{
            final[k] = obj[k]
        }
    })
    removeUndefinedObject(final)
    return final
}

module.exports = {
    getInfoData,
    generateToken,
    getSelectData,
    getUnSelectData,
    removeUndefinedObject,
    updateNestedObjectParser
}