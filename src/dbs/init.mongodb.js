'user strict'

const mongoose = require('mongoose')
const {db : {host,name,port,user,pass_word}} = require('../configs/config.mongodb')
const connectString = `mongodb://${user}:${pass_word}@${host}:${port}/${name}`
const {countConnect} = require('../helpers/check.connect')
class DataBase {
    constructor(){
        this.connect()
    }

    
    connect(type = 'mongodb'){
        if(1 === 1){
            mongoose.set('debug',true);
            mongoose.set('debug',{color : true});
        }
        console.log('::::',connectString)
        mongoose.connect(connectString,{
            maxPoolSize : 50
        }).then(()=>{
            // console.log('Connected is sucessfully,count connect :',countConnect());
        })
        .catch(err=>{
            console.log('ERRRRRRRRRRr',err)
        })
    }

    static getInstance(){
        if(!DataBase.instance){
            DataBase.instance = new DataBase()
        }
        return DataBase.instance
    }
}
const instanceMongodb = DataBase.getInstance()
module.exports = instanceMongodb