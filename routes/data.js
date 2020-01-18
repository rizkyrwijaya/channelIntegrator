var express = require('express');
var router = express.Router();
var jsonConfig = require('../public/json/appConf.json');

/* GET DATA */
router.get('/jsonConfig', (req, res) => {
  res.json(jsonConfig);
})

module.exports = router;
