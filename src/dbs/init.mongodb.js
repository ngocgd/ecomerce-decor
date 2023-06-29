' use strict ';

const mongoose = require('mongoose');

const connectString = 'mongodb://localhost:27017/shopDEV';
mongoose.connect(connectString)
    .then(() => {
        console.log('Connected to mongoose');
    })
    .catch((err) => 
    {
        console.log('ERRRRRRRRRRRR connected to db')
        console.log(err)
    });

//dev
if(1 === 0){
    mongoose.set('debug',true);
    mongoose.set('debug',{color : true});
}

module.exports = mongoose;