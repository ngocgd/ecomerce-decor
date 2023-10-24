
const express = require('express');
const { apiKey, checkPermissions } = require('../auth/checkAuth');
const router = express.Router();


// router.use(apiKey)
// router.use(checkPermissions('000'))
router.use('/v1/api',require('./access/index'))

// router.get('', (req, res, next) => {
//     return res.status(200).json({
//         message: 'Welcome Fantipjs'
//     })
// })

module.exports = router