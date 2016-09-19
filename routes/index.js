var express = require('express');
var router = express.Router();
var package = require('../package.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
    
  res.send({
    application: 'stackoverflow-jobs-api', 
    version: package.version
  });
});

module.exports = router;
