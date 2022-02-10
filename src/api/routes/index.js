const express = require('express');
const router = express.Router();
const instanceRoutes = require("./instance.route")

router.get('/status', (req, res) => res.send('OK'));

router.use('/instance', instanceRoutes);

module.exports = router;