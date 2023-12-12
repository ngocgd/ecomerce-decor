const app = require('./src/app')

const PORT = process.env.PORT || 3636
const { cpus } = require('os');
const server = app.listen(PORT,()=>{
    console.log('---------------CPUCORE-------------',cpus(),cpus().length)
    console.log(`WSV eCOMERCE start with ${PORT}`)
})

process.on('SIGINT',()=>{
    server.close(()=>{
        console.log('Exist server express')
    })
})