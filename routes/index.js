var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { layout: 'default', body: 'ZA BODEH', template: 'ZATEMPLATE',footer:'asdasd' });
});

router.get('/alertPage', function(req, res, next) {
  if(req.session && req.session.passport && req.session.passport.user) {
    console.log(req.session.passport.user);
    res.render('alertPage', {layout: 'default', data: req.session.passport.user});
  } else {
    res.redirect('/');
  }
  
});

module.exports = router;