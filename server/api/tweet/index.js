// Tweet API routes
const router = require('express').Router();
const controller = require('./tweet.controller');

// // // //

// GET /tweets
router.get('/', controller.list);

// POST /tweets
router.post('/', controller.create);

// // // //

module.exports = router;
