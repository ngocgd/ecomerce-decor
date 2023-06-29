'user strict'

const mongoose = require('mongoose')

const connectString = 'mongodb://localhost:27017/shopDEV'

class DataBase {
    constructor(){
        this.connect()
    }

    
    connect(type = 'mongodb'){
        if(1 === 1){
            mongoose.set('debug',true);
            mongoose.set('debug',{color : true});
        }
        mongoose.connect(connectString).then(()=>{
            console.log('Connected is sucessfully');
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