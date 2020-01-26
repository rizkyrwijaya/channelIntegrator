var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { layout: 'default', body: 'ZA BODEH', template: 'ZATEMPLATE' });
});

module.exports = router;