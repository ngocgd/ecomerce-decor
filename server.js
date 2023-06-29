const app = require('./src/app')

const PORT =3636

const server = app.listen(PORT,()=>{
    console.log(`WSV eCOMERCE start with ${PORT}`)
})

process.on('SIGINT',()=>{
    server.close(()=>{
        console.log('Exist server express')
    })
})