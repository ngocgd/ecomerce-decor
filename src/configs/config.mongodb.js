const env = process.env.NODE_ENV  || 'dev'
const config = {
    dev:{
        app :{
            post : 3000
        },
        db : {
            host : process.env.DEV_HOST || '54.254.170.153',
            port : process.env.DEV_PORT || 27017,
            name : process.env.DEV_DATABASE_NAME || 'dev_ecommerce',
            user : process.env.DB_USERNAME || 'ecommerce_user',
            pass_word : process.env.DB_PASSWORD || '12341234',
        }
    },
    production :{
        app :{
            post : 3000
        },
        db : {
            host : process.env.PRO_HOST || 'localhost',
            port : process.env.PRO_PORT || 27017,
            name : process.env.PRO_NAME || 'dbProduction'
        }
    }
   
}
module.exports = config[env]