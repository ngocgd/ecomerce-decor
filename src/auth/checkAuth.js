'use strict';

const { findKeyById } = require("../services/apikey.service");


const HEADER = {
    API_KEY : 'x-api-key',
    AUTHORIZATION : 'authorization',
}
const apiKey = async (req,res,next)=>{
    try{
        const key = req.headers[HEADER.API_KEY]?.toString();
        if(!key){
            return res.status(403).json({
                message :'Forbidden Error'
            })
        }
        //check key exists
        const checkKey = await findKeyById(key)
        if(!checkKey){
            return res.status(403).json({
                message :'Forbidden Error'
            })
        }
        req.objKey = checkKey
        return next()
    }catch(err){
        console.log(err);
    }
}
const checkPermissions = (permission)=>{
    return (req,res,next) =>{
        if(!req.objKey.permissions){
            return res.status(403).json({
                message :'Forbidden Error'
            })
        }
        const validPermissions = req.objKey.permissions.includes(permission)
        if(!validPermissions){
            return res.status(403).json({
                message : 'permission denied'
            })
        }
        return next()
    }
}
module.exports = {
    apiKey,
    checkPermissions
}