const express = require('express');
const router = express.Router();
const { proxyController } = require('../controllers/proxyServer');

router.get('/', proxyController);

module.exports = router;
