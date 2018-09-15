const router = require('express').Router()

// Bootstrap API routers
router.use('/tweets', require('./api/tweet'))

module.exports = router
