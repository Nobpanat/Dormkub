const express = require('express');
const router = express.Router();

// import controller
const imageProxyController = require('../controllers/image-proxyController')

router.get('/', imageProxyController.imageProxy);


module.exports = router;