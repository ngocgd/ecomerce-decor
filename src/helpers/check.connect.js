'use strict'
const mongoose = require('mongoose')
const os = require('os')
const process = require('process')
const _SECONDS = 5000
//count connect
const countConnect = () => {
    const numConnections = mongoose.connections.length
    console.log('numConnections ', numConnections)
}
//check overload
const checkOverLoad = () => {
    setInterval(() => {
        const numConnections = mongoose.connections.length
        const numCores = os.cpus.length;
        const memoryUsage = process.memoryUsage().rss;

        //Example maxmimum number of connections based on number osf cores
        const maxConnections = numCores * 5;
        console.log('Memory usege :',memoryUsage/1024/1024,' MB' )
        if(numConnections > maxConnections){
            console.log(`Connection overload detected !`)
        }
    }, _SECONDS) //Monitor every 5 seconds
}
module.exports = {
    countConnect,
    checkOverLoad
}