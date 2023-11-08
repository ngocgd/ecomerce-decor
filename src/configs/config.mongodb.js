const env = process.env.NODE_ENV  || 'dev'
const config = {
    dev:{
        app :{
            post : 3000
        },
        db : {
            host : process.env.DEV_HOST || '13.213.72.173',
            port : process.env.DEV_PORT || 27017,
            name : process.env.DEV_NAME || 'dbDev'
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